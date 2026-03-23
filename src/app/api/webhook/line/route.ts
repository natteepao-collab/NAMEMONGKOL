/* eslint-disable @typescript-eslint/no-explicit-any */

import { type NextRequest, NextResponse } from 'next/server';
import {
    Client,
    middleware,
    validateSignature,
    WebhookEvent,
} from '@line/bot-sdk';
import axios from 'axios';
import { createClient } from '@supabase/supabase-js';
import { createHash } from 'crypto';

// Setup LINE SDK
const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET || '',
};
const client = new Client(config);

function writeWebhookLog(level: 'INFO' | 'ERROR', message: string, details?: Record<string, unknown>) {
    const payload = {
        scope: 'line-webhook',
        level,
        message,
        ...(details ? { details } : {}),
        timestamp: new Date().toISOString(),
    };
    const line = `${JSON.stringify(payload)}\n`;

    if (level === 'ERROR') {
        process.stderr.write(line);
        return;
    }

    process.stdout.write(line);
}

function maskToken(token: string) {
    if (token.length <= 8) return token;
    return `${token.slice(0, 8)}...`;
}

async function replyWithDiagnostics(
    replyToken: string,
    message: string,
    context: Record<string, unknown>
) {
    try {
        await client.replyMessage(replyToken, {
            type: 'text',
            text: message,
        });
        writeWebhookLog('INFO', 'LINE replyMessage succeeded', context);
    } catch (error) {
        writeWebhookLog('ERROR', 'LINE replyMessage failed', {
            ...context,
            error: error instanceof Error ? error.message : String(error),
        });
        throw error;
    }
}

// Pricing Tiers (Synced with TopUpPage)
const PRICING_TIERS = [
    { credits: 500, price: 399, name: 'Fortune Seeker' },
    { credits: 150, price: 139, name: 'Pro Value' },
    { credits: 100, price: 1, name: 'Starter Pack' },
];

function calculateCredits(amount: number): { credits: number, tierName: string | null } {
    const tier = PRICING_TIERS.find(t => Math.abs(t.price - amount) < 0.5);
    if (tier) {
        return { credits: tier.credits, tierName: tier.name };
    }
    return { credits: Math.floor(amount), tierName: null };
}

export async function POST(req: NextRequest) {
    const body = await req.text();
    const signature = req.headers.get('x-line-signature') as string;

    writeWebhookLog('INFO', 'Received webhook request', {
        hasSignature: Boolean(signature),
        userAgent: req.headers.get('user-agent') || 'unknown',
    });

    if (!config.channelSecret || !signature) {
        writeWebhookLog('ERROR', 'Missing channel secret or signature', {
            hasChannelSecret: Boolean(config.channelSecret),
            hasSignature: Boolean(signature),
        });
        return NextResponse.json({ message: 'Missing channel secret or signature' }, { status: 400 });
    }

    try {
        if (!validateSignature(body, config.channelSecret, signature)) {
            writeWebhookLog('ERROR', 'Invalid LINE signature');
            return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
        }
    } catch (e) {
        writeWebhookLog('ERROR', 'Signature validation exception', {
            error: e instanceof Error ? e.message : String(e),
        });
        return NextResponse.json({ message: 'Signature validation failed' }, { status: 403 });
    }

    const data = JSON.parse(body);
    const events: WebhookEvent[] = data.events;

    writeWebhookLog('INFO', 'Validated webhook request', {
        eventCount: Array.isArray(events) ? events.length : 0,
        eventTypes: Array.isArray(events) ? events.map((event) => event.type) : [],
    });

    try {
        await Promise.all(events.map(handleEvent));
        return NextResponse.json({ message: 'OK' });
    } catch (err) {
        writeWebhookLog('ERROR', 'Unhandled error processing events', {
            error: err instanceof Error ? err.message : String(err),
        });
        return NextResponse.json({ message: 'Error processing events' }, { status: 500 });
    }
}

async function handleEvent(event: WebhookEvent) {
    // Interface for RPC response
    interface LinkEmailResult {
        success: boolean;
        message: string;
    }

    // Handle Follow event — auto-verify LINE bonus if a pending token exists
    if (event.type === 'follow') {
        const lineUserId = event.source.userId;
        writeWebhookLog('INFO', 'Handling follow event', {
            lineUserId: lineUserId || 'missing',
        });
        if (!lineUserId) return;

        try {
            const supabaseAdmin = createClient(
                process.env.NEXT_PUBLIC_SUPABASE_URL!,
                process.env.SUPABASE_SERVICE_ROLE_KEY!
            );

            // Check if this LINE user is already linked to any account
            const { data: existingProfile } = await supabaseAdmin
                .from('user_profiles')
                .select('id')
                .eq('line_user_id', lineUserId)
                .maybeSingle();

            if (existingProfile) {
                writeWebhookLog('INFO', 'Follow event for already linked LINE account', {
                    lineUserId,
                });
                await replyWithDiagnostics(
                    event.replyToken,
                    'ยินดีต้อนรับกลับมา! 🎉\nบัญชี LINE ของคุณเชื่อมต่อกับระบบแล้วครับ',
                    { eventType: 'follow', lineUserId, replyType: 'already-linked' }
                );
                return;
            }

            // Look for the most recent pending verification token (unused, not expired)
            const { data: pendingToken } = await supabaseAdmin
                .from('line_verification_tokens')
                .select('token, user_id, expires_at')
                .is('used_at', null)
                .gt('expires_at', new Date().toISOString())
                .order('created_at', { ascending: false })
                .limit(1)
                .maybeSingle();

            if (pendingToken) {
                writeWebhookLog('INFO', 'Found pending token for follow auto-verify', {
                    lineUserId,
                    token: maskToken(pendingToken.token),
                });
                // Auto-verify with this token
                const { data: bonusResult, error: bonusError } = await supabaseAdmin.rpc('grant_line_bonus', {
                    p_token: pendingToken.token,
                    p_line_user_id: lineUserId
                });
                const result = bonusResult as { success: boolean; code: string } | null;

                if (bonusError) {
                    writeWebhookLog('ERROR', 'Auto-verify grant_line_bonus error', {
                        lineUserId,
                        token: maskToken(pendingToken.token),
                        error: bonusError.message,
                    });
                    await replyWithDiagnostics(
                        event.replyToken,
                        'ขอบคุณที่เพิ่มเพื่อน! 🎉\n❌ ระบบยืนยันอัตโนมัติมีปัญหา กรุณากลับไปที่หน้าโปรไฟล์แล้วกดปุ่มยืนยันอีกครั้งครับ',
                        { eventType: 'follow', lineUserId, replyType: 'auto-verify-error' }
                    );
                } else if (result?.code === 'ok') {
                    writeWebhookLog('INFO', 'Auto-verify succeeded on follow event', {
                        lineUserId,
                        token: maskToken(pendingToken.token),
                    });
                    await replyWithDiagnostics(
                        event.replyToken,
                        '🎉 ยินดีต้อนรับ & ยืนยัน LINE สำเร็จ!\n\nคุณได้รับ 80 เครดิตโบนัสแล้วครับ ✅\nพร้อมใช้งานได้ทันที!',
                        { eventType: 'follow', lineUserId, replyType: 'auto-verify-success' }
                    );
                } else if (result?.code === 'already_claimed') {
                    writeWebhookLog('INFO', 'Follow auto-verify skipped because bonus already claimed', {
                        lineUserId,
                        token: maskToken(pendingToken.token),
                    });
                    await replyWithDiagnostics(
                        event.replyToken,
                        'ยินดีต้อนรับ! 🎉\nบัญชีของคุณได้รับโบนัส LINE ไปแล้วครับ',
                        { eventType: 'follow', lineUserId, replyType: 'already-claimed' }
                    );
                } else if (result?.code === 'line_already_used') {
                    writeWebhookLog('INFO', 'Follow auto-verify rejected because LINE account is already linked elsewhere', {
                        lineUserId,
                        token: maskToken(pendingToken.token),
                    });
                    await replyWithDiagnostics(
                        event.replyToken,
                        'ยินดีต้อนรับ! 🎉\n❌ LINE บัญชีนี้เคยผูกกับบัญชีอื่นแล้ว\nไม่สามารถรับโบนัสซ้ำได้ครับ',
                        { eventType: 'follow', lineUserId, replyType: 'line-already-used' }
                    );
                } else {
                    writeWebhookLog('INFO', 'Follow auto-verify returned non-ok result', {
                        lineUserId,
                        token: maskToken(pendingToken.token),
                        code: result?.code || 'unknown',
                    });
                    await replyWithDiagnostics(
                        event.replyToken,
                        'ขอบคุณที่เพิ่มเพื่อน! 🎉\n\nหากต้องการรับโบนัส 80 เครดิต กรุณากลับไปที่หน้าโปรไฟล์แล้วกดปุ่มยืนยันครับ',
                        { eventType: 'follow', lineUserId, replyType: 'non-ok-result', code: result?.code || 'unknown' }
                    );
                }
            } else {
                writeWebhookLog('INFO', 'No pending token found for follow event', {
                    lineUserId,
                });
                // No pending token — just welcome
                await replyWithDiagnostics(
                    event.replyToken,
                    'ขอบคุณที่เพิ่มเพื่อน NameMongkol! 🎉\n\nหากต้องการรับโบนัส 80 เครดิต กรุณาไปที่:\n🔗 หน้าโปรไฟล์ > เชื่อมต่อ LINE\nแล้วกดปุ่มเพิ่มเพื่อนอีกครั้งครับ',
                    { eventType: 'follow', lineUserId, replyType: 'no-pending-token' }
                );
            }
        } catch (err) {
            writeWebhookLog('ERROR', 'Error handling follow event', {
                lineUserId,
                error: err instanceof Error ? err.message : String(err),
            });
        }
        return;
    }

    // Handle Text Message (for Email Linking)
    if (event.type === 'message' && event.message.type === 'text') {
        const text = event.message.text.trim();
        const lineUserId = event.source.userId;
        const replyToken = event.replyToken;

        // Handle verify: token (LINE bonus flow) — must check before email regex
        if (text.startsWith('verify:') && lineUserId) {
            const verifyToken = text.slice(7).trim();
            writeWebhookLog('INFO', 'Received verify message', {
                lineUserId,
                token: maskToken(verifyToken),
            });
            if (verifyToken) {
                try {
                    const supabaseAdmin = createClient(
                        process.env.NEXT_PUBLIC_SUPABASE_URL!,
                        process.env.SUPABASE_SERVICE_ROLE_KEY!
                    );
                    const { data: bonusResult, error: bonusError } = await supabaseAdmin.rpc('grant_line_bonus', {
                        p_token: verifyToken,
                        p_line_user_id: lineUserId
                    });
                    const result = bonusResult as { success: boolean; code: string } | null;
                    if (bonusError) {
                        writeWebhookLog('ERROR', 'grant_line_bonus error in verify handler', {
                            lineUserId,
                            token: maskToken(verifyToken),
                            error: bonusError.message,
                        });
                        await replyWithDiagnostics(
                            replyToken,
                            '❌ เกิดข้อผิดพลาดในการยืนยัน โปรดลองใหม่อีกครั้ง',
                            { eventType: 'verify-message', lineUserId, token: maskToken(verifyToken), replyType: 'grant-line-bonus-error' }
                        );
                    } else if (result?.code === 'ok') {
                        writeWebhookLog('INFO', 'Verify handler granted bonus successfully', {
                            lineUserId,
                            token: maskToken(verifyToken),
                        });
                        await replyWithDiagnostics(
                            replyToken,
                            '✅ ยืนยัน LINE สำเร็จ!\nคุณได้รับ 80 เครดิตโบนัสแล้วครับ 🎉\n\nขอบคุณที่ยืนยันตัวตน พร้อมใช้งานได้ทันที!',
                            { eventType: 'verify-message', lineUserId, token: maskToken(verifyToken), replyType: 'verify-success' }
                        );
                    } else if (result?.code === 'already_claimed') {
                        writeWebhookLog('INFO', 'Verify handler found bonus already claimed', {
                            lineUserId,
                            token: maskToken(verifyToken),
                        });
                        await replyWithDiagnostics(
                            replyToken,
                            'ℹ️ บัญชีของคุณได้รับโบนัส LINE ไปแล้วครับ',
                            { eventType: 'verify-message', lineUserId, token: maskToken(verifyToken), replyType: 'already-claimed' }
                        );
                    } else if (result?.code === 'line_already_used') {
                        writeWebhookLog('INFO', 'Verify handler rejected because LINE account is already linked elsewhere', {
                            lineUserId,
                            token: maskToken(verifyToken),
                        });
                        await replyWithDiagnostics(
                            replyToken,
                            '❌ LINE บัญชีนี้เคยผูกกับบัญชีอื่นแล้ว\nไม่สามารถรับโบนัสซ้ำได้ครับ',
                            { eventType: 'verify-message', lineUserId, token: maskToken(verifyToken), replyType: 'line-already-used' }
                        );
                    } else {
                        writeWebhookLog('INFO', 'Verify handler returned invalid or expired token result', {
                            lineUserId,
                            token: maskToken(verifyToken),
                            code: result?.code || 'unknown',
                        });
                        await replyWithDiagnostics(
                            replyToken,
                            '❌ รหัสยืนยันหมดอายุหรือไม่ถูกต้อง\nกรุณาขอลิงก์ยืนยันใหม่จากหน้าโปรไฟล์บนเว็บไซต์',
                            { eventType: 'verify-message', lineUserId, token: maskToken(verifyToken), replyType: 'invalid-or-expired', code: result?.code || 'unknown' }
                        );
                    }
                } catch (err) {
                    writeWebhookLog('ERROR', 'Unhandled exception in verify handler', {
                        lineUserId,
                        token: maskToken(verifyToken),
                        error: err instanceof Error ? err.message : String(err),
                    });
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: '❌ เกิดข้อผิดพลาดในระบบ'
                    });
                }
            }
            return;
        }

        // Simple Email Regex
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (emailRegex.test(text) && lineUserId) {
            try {
                // Call RPC to link email
                const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
                const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
                const supabase = createClient(supabaseUrl, supabaseKey);

                const { data, error } = await supabase.rpc('link_line_id_by_email', {
                    email_input: text,
                    line_id_input: lineUserId
                });

                // Cast data to expected type
                const result = data as LinkEmailResult;

                if (error || !result?.success) {
                    console.error('Link email error:', error || result);
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: '❌ ไม่พบอีเมลนี้ในระบบ หรือเกิดข้อผิดพลาด\nโปรดตรวจสอบว่าสะกดถูกต้อง และสมัครสมาชิกบนหน้าเว็บแล้ว'
                    });
                } else {
                    await client.replyMessage(replyToken, {
                        type: 'text',
                        text: '✅ ผูกบัญชีสำเร็จ! \nคุณสามารถส่งรูปสลิปเพื่อเติมเครดิตได้ทันทีครับ'
                    });
                }
            } catch (err) {
                console.error('Error linking email:', err);
                await client.replyMessage(replyToken, { type: 'text', text: '❌ เกิดข้อผิดพลาดในการเชื่อมต่อระบบ' });
            }
        }
        return;
    }

    if (event.type !== 'message' || event.message.type !== 'image') {
        return;
    }

    const lineUserId = event.source.userId;
    if (!lineUserId) return;
    const replyToken = event.replyToken;

    try {
        // 1. Connect Supabase
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // ... (lines 121-149 omitted for brevity, keeping existing logic) ...
        // 2. Get Image Content
        const messageId = event.message.id;
        const stream = await client.getMessageContent(messageId);
        const chunks: any[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // 3. Check Local Duplicate (File Hash) - SAVE SLIP2GO QUOTA
        const fileHash = createHash('sha256').update(buffer).digest('hex');

        // Note: We check if ANY slip with this hash exists. 
        // If you want to allow re-uploading the same slip IF the previous attempt failed, you'd check status.
        // But assuming 'slips' table stores successful transactions, finding it means it was used.
        const { data: duplicateByHash } = await supabase
            .from('slips')
            .select('id, created_at')
            .eq('file_hash', fileHash)
            .maybeSingle();

        if (duplicateByHash) {
            console.log(`Duplicate slip detected by hash: ${fileHash}`);
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '⚠️ รูปภาพสลิปนี้ถูกใช้งานไปแล้ว (ตรวจสอบพบซ้ำในระบบ)'
            });
            return; // EXIT HERE to save quota
        }

        // 4. Find User
        console.log(`Looking up user for LINE ID: ${lineUserId}`);
        // Use RPC to bypass RLS policies and cast result
        // Define interface for user lookup result
        interface UserLookupResult {
            id: string;
            credits: number;
        }

        const { data: userRaw, error: userError } = await supabase
            .rpc('get_user_by_line_id', { line_id_input: lineUserId })
            .maybeSingle();

        const user = userRaw as UserLookupResult;

        console.log('User lookup result:', user ? 'Found' : 'Not Found', userError ? userError.message : 'No Error');

        if (userError || !user) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: `⚠️ ไม่พบข้อมูลบัญชีที่เชื่อมต่อกับ LINE นี้\n🆔 LINE ID ของคุณคือ: ${lineUserId}\n\nกรุณาแจ้ง Admin เพื่อทำการผูกบัญชี หรือพิมพ์ อีเมล เพื่อเชื่อมต่ออัตโนมัติ`
            });
            return;
        }

        // 5. Call Slip2Go (Quota will be used here)
        const secretKey = process.env.SLIP2GO_SECRET_KEY || '';
        const slipEndpoint = process.env.SLIP2GO_ENDPOINT || 'https://connect.slip2go.com/api/verify-slip/qr-image/info';
        const mimeType = 'image/jpeg';

        const fd = new FormData();
        fd.append('file', new Blob([buffer], { type: mimeType }), 'slip.jpg');

        console.log(`Verifying slip from ${lineUserId}...`);
        const slipRes = await axios.post(slipEndpoint, fd, {
            headers: { Authorization: `Bearer ${secretKey}` }
        });
        const slipData = slipRes.data;
        console.log('Slip2Go Response:', JSON.stringify(slipData));

        const isValid = (slipData.status === 200 || slipData.status === 'success') && (slipData.data || slipData.amount);
        if (!isValid) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '❌ สลิปไม่ถูกต้อง หรือไม่สามารถตรวจสอบได้'
            });
            return;
        }

        const amount = Number(slipData.data?.amount || slipData.amount || 0);
        const transRef = (slipData.data?.transRef || slipData.data?.sendingBank || slipRefFromData(slipData))?.toString();

        if (!transRef) {
            await client.replyMessage(replyToken, { type: 'text', text: '❌ ไม่พบเลขที่รายการในสลิป' });
            return;
        }

        // 6. Check Duplicate by Transaction ID (Double Check)
        // If user took a NEW PHOTO of the SAME SLIP, hash check fails, but Trans ID check passes.
        const { data: duplicateByRef } = await supabase
            .from('slips')
            .select('id')
            .eq('trans_id', transRef)
            .maybeSingle();

        if (duplicateByRef) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '⚠️ สลิปนี้ถูกใช้งานไปแล้ว (รหัสรายการซ้ำ)'
            });
            return;
        }

        // 7. Calculate & Add Credits
        const { credits, tierName } = calculateCredits(amount);

        // 7.1 Insert Slip Record
        const { error: insertSlipError } = await supabase.from('slips').insert({
            trans_id: transRef,
            amount: amount,
            sender_name: slipData.data?.sender?.account?.name || 'LINE User',
            slip_ref: transRef,
            file_hash: fileHash,
            user_id: user.id
        });

        if (insertSlipError) {
            console.error('Failed to insert slip', insertSlipError);
            // Verify urgency?
        }

        // 7.2 Update User Credit
        const { error: updateCreditError } = await supabase
            .from('user_profiles')
            .update({ credits: (user.credits || 0) + credits })
            .eq('id', user.id);

        if (updateCreditError) {
            console.error('Failed to update credits', updateCreditError);
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '❌ เกิดข้อผิดพลาดในการเติมเครดิต โปรดติดต่อแอดมิน'
            });
            return;
        }

        // 8. Reply Success
        const packageName = tierName ? `📦 แพ็กเกจ: ${tierName}` : '';
        const bonusText = (credits > amount) ? `(แถม ${credits - amount} เครดิต!)` : '';

        await client.replyMessage(replyToken, {
            type: 'text',
            text: `✅ ตรวจสอบสลิปเรียบร้อย\n💰 ยอดเงิน: ${amount} บาท\n💎 ได้รับ: ${credits} เครดิต ${bonusText}\n${packageName}\n\nขอบคุณที่ใช้บริการครับ 🙏`
        });

        // 9. Notify Admin
        console.log('--- STARTING ADMIN NOTIFICATION ---');
        const ADMIN_LINE_ID = 'Ub8d2e90e5c8d8628bfa13b0f25326a48';
        try {
            console.log(`Sending to Admin: ${ADMIN_LINE_ID}`);
            await client.pushMessage(ADMIN_LINE_ID, {
                type: 'text',
                text: `🔔 NEW SLIP RECEIVED\n\n👤 Sender: ${slipData.data?.sender?.account?.name || 'Unknown'}\n🆔 Line ID: ${lineUserId}\n💰 Amount: ${amount}\n💎 Credits: ${credits}\n🧾 Ref: ${transRef}`
            });
            console.log('✅ Admin notification sent successfully');
        } catch (adminErr) {
            console.error('❌ Failed to notify admin:', adminErr);
        }
        console.log('--- END ADMIN NOTIFICATION ---');

    } catch (e) {
        console.error('Error handling event', e);
        try {
            await client.replyMessage(replyToken, { type: 'text', text: '❌ เกิดข้อผิดพลาดในระบบ' });
        } catch { }
    }
}

function slipRefFromData(data: any) {
    return data?.transRef || data?.result?.refNo || data?.data?.transRef;
}
