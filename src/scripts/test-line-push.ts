
import { Client } from '@line/bot-sdk';
import * as dotenv from 'dotenv';
import path from 'path';

// Load env from local file
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

const config = {
    channelAccessToken: process.env.CHANNEL_ACCESS_TOKEN || '',
    channelSecret: process.env.CHANNEL_SECRET || '',
};

const client = new Client(config);
const ADMIN_LINE_ID = 'Ub8d2e90e5c8d8628bfa13b0f25326a48';

async function testPush() {
    console.log('--- TEST LINE PUSH MESSAGE ---');
    console.log(`Admin ID: ${ADMIN_LINE_ID}`);
    console.log(`Access Token present: ${!!config.channelAccessToken}`);
    console.log(`Channel Secret present: ${!!config.channelSecret}`);

    try {
        await client.pushMessage(ADMIN_LINE_ID, {
            type: 'text',
            text: '🔔 TEST NOTIFICATION: If you see this, the bot works!'
        });
        console.log('✅ Push message sent successfully!');
    } catch (error: any) {
        console.error('❌ Failed to send push message:');
        if (error.originalError && error.originalError.response) {
            console.error('Status:', error.originalError.response.status);
            console.error('Data:', JSON.stringify(error.originalError.response.data, null, 2));
        } else {
            console.error(error);
        }
    }
}

testPush();
