import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

export async function POST(request: Request) {
    console.log('--- API verify-slip START ---');

    try {
        const formData = await request.formData();
        // รับค่าได้ทั้ง image และ file
        const file = formData.get('image') || formData.get('file');
        const creditAmount = Number(formData.get('credit_amount') || 0);
        const paymentAmount = Number(formData.get('payment_amount') || 0);
        const orderId = (formData.get('order_id') || '').toString() || undefined;
        const tierId = (formData.get('tier_id') || '').toString() || undefined;
        const transId = (formData.get('trans_id') || '').toString().trim();
        const senderName = (formData.get('sender_name') || '').toString().trim() || null;

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
        if (!token) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 });
        }

        if (!transId) {
            return NextResponse.json({ success: false, message: 'missing trans_id' }, { status: 400 });
        }

        // 1) เตรียมข้อมูลไฟล์ที่ใช้ซ้ำได้ทุก endpoint + hash สำหรับกันสลิปซ้ำโดยรูป
        const arrayBuffer = await file.arrayBuffer();
        const mimeType = (file as Blob).type || 'image/jpeg';
        const base64 = Buffer.from(arrayBuffer).toString('base64');
        const fileHash = createHash('sha256').update(Buffer.from(arrayBuffer)).digest('hex');

        // 2) ตั้งค่า Key (ควรตั้งใน .env.production ด้วย)
        const secretKey = process.env.SLIP2GO_SECRET_KEY || 'BKkuXbNHiznJu80IHV2OgL5N9BDm1Bb7uz2yKLToM9E=';

        // 3) เตรียม endpoint หลายแบบ (เรียงตามที่ผู้ให้บริการแนะนำ)
        const explicitEndpoint = process.env.SLIP2GO_ENDPOINT?.trim();
        const endpoints = [
            explicitEndpoint,
            'https://connect.slip2go.com/api/verify-slip/qr-image/info',
            'https://connect.slip2go.com/api/verify-slip/qr-code/info',
            'https://connect.slip2go.com/api/verify-slip/qr-base64/info',
            'https://app.slip2go.com/api/verify-slip/qr-image/info',
            'https://api.slip2go.com/verify-slip/qr-image/info',
            'https://api.slip2go.com/api/verify-slip/qr-image/info',
        ].filter(Boolean) as string[];

        // Supabase client as end-user (Bearer token from caller) เพื่อให้ auth.uid() ถูกต้อง
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        if (!supabaseUrl || !supabaseAnonKey) {
            throw new Error('Missing Supabase environment variables');
        }
        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        });

        // 0) เช็คซ้ำใน Supabase ก่อนยิง Slip2Go (ทั้ง trans_id และ file_hash)
        const { data: existingSlip, error: slipCheckError } = await supabase
            .from('slips')
            .select('trans_id, file_hash')
            .or(`trans_id.eq.${transId},file_hash.eq.${fileHash}`)
            .maybeSingle();

        if (slipCheckError) {
            throw new Error(`Slip check failed: ${slipCheckError.message}`);
        }

        if (existingSlip) {
            return NextResponse.json({
                success: false,
                message: 'สลิปนี้ถูกใช้งานไปแล้ว (trans_id/file_hash ซ้ำ)',
                code: 'DUPLICATE_SLIP',
                slipRef: transId,
            }, { status: 400 });
        }

        let lastError: Error | null = null;
        for (const endpoint of endpoints) {
            try {
                console.log('Sending request to Slip2Go endpoint:', endpoint);

                // FormData ต้องสร้างใหม่ทุกครั้งเพื่อหลีกเลี่ยงปัญหา stream ถูกใช้ซ้ำ
                const fd = new FormData();
                fd.append('file', new Blob([arrayBuffer], { type: mimeType }), 'slip.jpg');

                // เผื่อ endpoint qr-base64 ต้องการ base64 string
                const isBase64Endpoint = endpoint.includes('qr-base64');
                const isQrCodeEndpoint = endpoint.includes('qr-code');

                const headers: Record<string, string> = {
                    Authorization: `Bearer ${secretKey}`,
                    Accept: 'application/json',
                };

                const fetchOptions: RequestInit = {
                    method: 'POST',
                    headers,
                    body: fd,
                };

                if (isBase64Endpoint) {
                    // เปลี่ยนเป็น JSON payload สำหรับ base64 endpoint
                    fetchOptions.body = JSON.stringify({ base64: `data:${mimeType};base64,${base64}` });
                    fetchOptions.headers = {
                        ...headers,
                        'Content-Type': 'application/json',
                    };
                } else if (isQrCodeEndpoint) {
                    // qr-code endpoint คาดว่าจะได้สตริง QR; ลองส่งเป็นไฟล์ base64 ให้ด้วย
                    fetchOptions.body = JSON.stringify({ qr: `data:${mimeType};base64,${base64}` });
                    fetchOptions.headers = {
                        ...headers,
                        'Content-Type': 'application/json',
                    };
                }

                const apiResponse = await fetch(endpoint, fetchOptions);

                const responseText = await apiResponse.text();
                console.log('Slip2Go Response:', responseText);

                let apiData: any;
                try {
                    apiData = JSON.parse(responseText);
                } catch {
                    throw new Error(`Non-JSON response from ${endpoint}: ${responseText}`);
                }

                if (!apiResponse.ok) {
                    throw new Error(apiData.message || `Slip2Go rejected with status ${apiResponse.status}`);
                }

                // 4) หา slipRef จากผลลัพธ์ (ห้าม fallback สุ่ม เพื่อป้องกัน duplicate หลุดรอด)
                const slipRef = (
                    apiData?.refNo
                    || apiData?.referenceNo
                    || apiData?.result?.refNo
                    || apiData?.result?.referenceNo
                    || apiData?.data?.transRef
                    || apiData?.data?.referenceId
                    || apiData?.data?.qrCode
                    || apiData?.qrCode
                )?.toString()?.trim();

                if (!slipRef) {
                    throw new Error('ไม่พบรหัสอ้างอิงสลิปจากผู้ให้บริการ (slip_ref)');
                }

                let creditResult: any = null;
                if (creditAmount > 0 && paymentAmount > 0) {
                    const { data: addResult, error: creditError } = await supabase.rpc('add_credits_v2', {
                        credit_amount: creditAmount,
                        payment_amount: paymentAmount,
                        slip_ref: slipRef,
                    });

                    if (creditError) {
                        throw new Error(`Add credits failed: ${creditError.message}`);
                    }
                    if (addResult && addResult.success === false) {
                        return NextResponse.json({
                            success: false,
                            message: addResult.message || 'สลิปนี้ถูกใช้งานไปแล้ว',
                            code: 'DUPLICATE_SLIP',
                            slipRef,
                        }, { status: 400 });
                    }
                    creditResult = addResult;
                }

                // 5) บันทึก trans_id ลง Supabase slips table (กันซ้ำครั้งต่อไป)
                const insertPayload = {
                    trans_id: transId,
                    amount: paymentAmount || apiData?.data?.amount || apiData?.amount || null,
                    sender_name: senderName || apiData?.data?.sender?.account?.name || null,
                    slip_ref: slipRef,
                    file_hash: fileHash,
                };

                const { error: insertError } = await supabase.from('slips').insert(insertPayload);
                if (insertError) {
                    throw new Error(`Insert slip failed: ${insertError.message}`);
                }

                // สำเร็จ -> ตอบกลับ พร้อมผลการเพิ่มเครดิต (ถ้ามี)
                return NextResponse.json({ success: true, data: { apiData, creditResult, slipRef, tierId } });
            } catch (err: any) {
                lastError = err;
                console.error(`Slip2Go call failed for ${endpoint}:`, err);
            }
        }

        throw lastError || new Error('Slip2Go verification failed');

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        return NextResponse.json({
            success: false,
            message: error.message,
            debug: error.stack,
        }, { status: 500 });
    }
}
