
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

    if (!config.channelSecret || !signature) {
        return NextResponse.json({ message: 'Missing channel secret or signature' }, { status: 400 });
    }

    try {
        if (!validateSignature(body, config.channelSecret, signature)) {
            return NextResponse.json({ message: 'Invalid signature' }, { status: 403 });
        }
    } catch (e) {
        console.error('Signature validation error', e);
        return NextResponse.json({ message: 'Signature validation failed' }, { status: 403 });
    }

    const data = JSON.parse(body);
    const events: WebhookEvent[] = data.events;

    try {
        await Promise.all(events.map(handleEvent));
        return NextResponse.json({ message: 'OK' });
    } catch (err) {
        console.error('Error processing events:', err);
        return NextResponse.json({ message: 'Error processing events' }, { status: 500 });
    }
}

async function handleEvent(event: WebhookEvent) {
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

        // 4. Find User (Check before API call to ensure valid user first?)
        // optional, but good practice.
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, credits')
            .eq('line_user_id', lineUserId)
            .single();

        if (userError || !user) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '⚠️ ไม่พบข้อมูลบัญชีที่เชื่อมต่อกับ LINE นี้ กรุณาลงทะเบียนหรือแจ้ง Admin'
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
            // user_id: user.id 
        });

        if (insertSlipError) {
            console.error('Failed to insert slip', insertSlipError);
            // Verify urgency?
        }

        // 7.2 Update User Credit
        const { error: updateCreditError } = await supabase
            .from('users')
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
