/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';
import { Client } from '@line/bot-sdk';

export async function POST(request: Request) {
    console.log('--- API verify-slip START ---');

    const enableDebugLog = process.env.DEBUG_SLIP_LOG === 'true' && process.env.NODE_ENV !== 'production';

    try {
        const formData = await request.formData();
        // รับค่าได้ทั้ง image และ file
        const file = formData.get('image') || formData.get('file');
        const creditAmount = Number(formData.get('credit_amount') || 0);
        const paymentAmount = Number(formData.get('payment_amount') || 0);
        const tierId = (formData.get('tier_id') || '').toString() || undefined;
        const transId = (formData.get('trans_id') || '').toString().trim();
        const senderName = (formData.get('sender_name') || '').toString().trim() || null;

        if (enableDebugLog) {
            const headerObj: Record<string, string> = {};
            request.headers.forEach((value, key) => {
                headerObj[key] = value;
            });
            console.log('Incoming Headers (debug):', JSON.stringify(headerObj, null, 2));
        }

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json({ success: false, message: 'No file uploaded' }, { status: 400 });
        }

        // Basic file validation to mitigate junk uploads
        const allowedMime = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];
        const fileMime = (file as Blob).type || '';
        const fileSize = (file as Blob).size || 0;
        if (fileMime && !allowedMime.includes(fileMime)) {
            return NextResponse.json({ success: false, message: 'Unsupported file type' }, { status: 400 });
        }
        if (fileSize > 8 * 1024 * 1024) {
            return NextResponse.json({ success: false, message: 'File too large (max 8MB)' }, { status: 400 });
        }

        const authHeader = request.headers.get('authorization') || '';
        const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined;
        if (enableDebugLog) {
            console.log('Auth Header Present:', Boolean(authHeader));
            console.log('Extracted Token Prefix:', token ? token.substring(0, 6) + '...' : 'UNDEFINED');
        }

        if (!token) {
            console.error('No token found in request');
            return NextResponse.json({ success: false, message: 'Unauthorized (No Token)' }, { status: 401 });
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
        const secretKey = process.env.SLIP2GO_SECRET_KEY;
        if (!secretKey) {
            throw new Error('Missing SLIP2GO_SECRET_KEY');
        }

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

        // Supabase client as end-user (for add_credits RPC)
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
        const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY; // server-side only

        if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables');
        }

        const supabase = createClient(supabaseUrl, supabaseAnonKey, {
            global: { headers: { Authorization: `Bearer ${token}` } }
        });

        const { data: userData, error: userError } = await supabase.auth.getUser();
        if (userError || !userData?.user?.id) {
            console.error('Failed to resolve user from token', userError);
            return NextResponse.json({ success: false, message: 'Unauthorized (Invalid Token)' }, { status: 401 });
        }
        const userId = userData.user.id;

        // Supabase Admin for global duplicate check (Bypass RLS)
        const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

        // 0) เช็คซ้ำใน Supabase ก่อนยิง Slip2Go (Global Check via Admin)
        const { data: existingSlip, error: slipCheckError } = await supabaseAdmin
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
        const REQUEST_TIMEOUT_MS = 12000;
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

                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
                try {
                    (fetchOptions as any).signal = controller.signal;
                    const apiResponse = await fetch(endpoint, fetchOptions);

                    const responseText = await apiResponse.text();
                    if (enableDebugLog) {
                        console.log('Slip2Go Response:', responseText);
                    }

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

                    const slipAmountRaw = apiData?.data?.amount ?? apiData?.amount ?? apiData?.result?.amount;
                    const slipAmount = typeof slipAmountRaw === 'string' || typeof slipAmountRaw === 'number'
                        ? Number(slipAmountRaw)
                        : null;

                    if (slipAmount !== null && !Number.isNaN(slipAmount) && paymentAmount > 0) {
                        const delta = Math.abs(slipAmount - paymentAmount);
                        if (delta > 0.5) {
                            return NextResponse.json({
                                success: false,
                                message: 'ยอดเงินในสลิปไม่ตรงกับคำขอ',
                                code: 'AMOUNT_MISMATCH',
                                slipRef,
                            }, { status: 400 });
                        }
                    }

                    let creditResult: any = null;
                    if (creditAmount > 0 && paymentAmount > 0) {
                        const { data: addResult, error: creditError } = await supabase.rpc('add_credits_v3', {
                            credit_amount: creditAmount,
                            payment_amount: paymentAmount,
                            slip_ref: slipRef,
                        });

                        if (creditError) {
                            // Check for unique constraint violation (Duplicate slip_ref in payment_history)
                            if (creditError.message.includes('duplicate key') || creditError.message.includes('unique constraint') || creditError.code === '23505') {

                                // Insert into slips to block this file hash in the future
                                const duplicatePayload = {
                                    trans_id: transId,
                                    amount: paymentAmount || apiData?.data?.amount || apiData?.amount || null,
                                    sender_name: senderName || apiData?.data?.sender?.account?.name || null,
                                    slip_ref: slipRef,
                                    file_hash: fileHash,
                                    user_id: userId
                                };
                                await supabaseAdmin.from('slips').insert(duplicatePayload);

                                return NextResponse.json({
                                    success: false,
                                    message: 'สลิปนี้ถูกใช้งานไปแล้ว (Duplicate)',
                                    code: 'DUPLICATE_SLIP',
                                    slipRef,
                                }, { status: 400 });
                            }

                            throw new Error(`Add credits failed: ${creditError.message}`);
                        }
                        if (addResult && addResult.success === false) {
                            // Insert into slips to block this file hash in the future (preventing re-verification)
                            const duplicatePayload = {
                                trans_id: transId,
                                amount: paymentAmount || apiData?.data?.amount || apiData?.amount || null,
                                sender_name: senderName || apiData?.data?.sender?.account?.name || null,
                                slip_ref: slipRef,
                                file_hash: fileHash,
                                user_id: userId // Ensure user_id is set
                            };
                            await supabaseAdmin.from('slips').insert(duplicatePayload);

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
                        user_id: userId
                    };

                    const { error: insertError } = await supabaseAdmin.from('slips').insert(insertPayload);
                    if (insertError) {
                        // Log but don't fail, as credit is already added
                        console.error(`Insert slip failed: ${insertError.message}`);
                    }

                    // 6) Notify Admin via LINE
                    try {
                        const lineConfig = {
                            channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
                            channelSecret: process.env.CHANNEL_SECRET || '',
                        };
                        const lineClient = new Client(lineConfig);
                        const adminLineId = process.env.ADMIN_LINE_ID || 'Ub8d2e90e5c8d8628bfa13b0f25326a48';

                        if (!lineConfig.channelAccessToken || !lineConfig.channelSecret || !adminLineId) {
                            throw new Error('Missing LINE channel configuration');
                        }

                        await lineClient.pushMessage(adminLineId, {
                            type: 'text',
                            text: `🔔 WEB TOPUP RECEIVED\n\n👤 Sender: ${insertPayload.sender_name || 'Unknown'}\n💰 Amount: ${paymentAmount}\n💎 Credits: ${creditAmount}\n🧾 Ref: ${slipRef}`
                        });
                        console.log('✅ Admin notification sent (API)');
                    } catch (notifyErr) {
                        console.error('❌ Failed to notify admin (API):', notifyErr);
                    }

                    // สำเร็จ -> ตอบกลับ พร้อมผลการเพิ่มเครดิต (ถ้ามี)
                    return NextResponse.json({ success: true, data: { apiData, creditResult, slipRef, tierId, creditAmount } });
                } finally {
                    clearTimeout(timeoutId);
                }
            } catch (err: any) {
                lastError = err;
                console.error(`Slip2Go call failed for ${endpoint}:`, err);
            }
        }

        throw lastError || new Error('Slip2Go verification failed');

    } catch (error: any) {
        console.error('SERVER ERROR:', error);
        const resp: any = {
            success: false,
            message: 'Server error',
        };
        if (enableDebugLog) {
            resp.debug = error?.message;
        }
        return NextResponse.json(resp, { status: 500 });
    }
}
