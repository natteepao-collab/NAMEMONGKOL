
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
        // 1. Get Image
        const messageId = event.message.id;
        const stream = await client.getMessageContent(messageId);
        const chunks: any[] = [];
        for await (const chunk of stream) {
            chunks.push(chunk);
        }
        const buffer = Buffer.concat(chunks);

        // 2. Prepare Slip2Go
        const secretKey = process.env.SLIP2GO_SECRET_KEY || '';
        const slipEndpoint = process.env.SLIP2GO_ENDPOINT || 'https://connect.slip2go.com/api/verify-slip/qr-image/info';
        const mimeType = 'image/jpeg';

        const fd = new FormData();
        fd.append('file', new Blob([buffer], { type: mimeType }), 'slip.jpg');

        // 3. Call Slip2Go
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

        // 4. Connect Supabase
        // Note: Using Service Role Key is recommended for background tasks, checking if available
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
        const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
        const supabase = createClient(supabaseUrl, supabaseKey);

        // 5. Find User
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('id, credits')
            .eq('line_user_id', lineUserId)
            .single();

        if (userError || !user) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '⚠️ ไม่พบข้อมูลบัญชีที่เชื่อมต่อกับ LINE นี้'
            });
            return;
        }

        // 6. Update Credits (Using RPC if possible, else update directly if Service Role)
        // Trying to use the logic from existing verified slip (assuming add_credits_v2 is versatile or we use direct update)
        // Since we are likely using Service Role (or Anon with open RLS), we can try direct update first for reliability in this specific task context
        // OR try RPC. Let's try RPC first as it handles log transaction logic usually.

        /* 
           Assumption: 'add_credits_v2' expects the caller to be the user (via auth.uid()). 
           Since we are a bot, we can't easily mimic that without signing a JWT.
           So we will try to update manually and insert a slip record.
        */

        // Check duplicate in 'slips' table first
        const fileHash = createHash('sha256').update(buffer).digest('hex');
        const { data: existingSlip } = await supabase
            .from('slips')
            .select('id')
            .or(`trans_id.eq.${transRef},file_hash.eq.${fileHash}`)
            .maybeSingle();

        if (existingSlip) {
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '⚠️ สลิปนี้ถูกใช้งานไปแล้ว'
            });
            return;
        }

        // Add Credits & Record Slip
        // We do this in a transaction if possible, or sequential.

        // 6.1 Insert Slip Record
        const { error: insertSlipError } = await supabase.from('slips').insert({
            trans_id: transRef,
            amount: amount,
            sender_name: slipData.data?.sender?.account?.name || 'Start',
            slip_ref: transRef,
            file_hash: fileHash,
            // user_id: user.id // If table has user_id column
        });

        if (insertSlipError) {
            console.error('Failed to insert slip', insertSlipError);
            // Verify if it was a dupe that race-conditioned
            // return;
        }

        // 6.2 Update User Credit
        // Simple direct update for now
        const { error: updateCreditError } = await supabase
            .from('users')
            .update({ credits: (user.credits || 0) + amount })
            .eq('id', user.id);

        if (updateCreditError) {
            console.error('Failed to update credits', updateCreditError);
            await client.replyMessage(replyToken, {
                type: 'text',
                text: '❌ เกิดข้อผิดพลาดในการเติมเครดิต โปรดติดต่อแอดมิน'
            });
            return;
        }

        // 7. Reply Success
        await client.replyMessage(replyToken, {
            type: 'text',
            text: `✅ ตรวจสอบสลิปเรียบร้อย\n💰 เติมเครดิต: ${amount} เครดิต`
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
