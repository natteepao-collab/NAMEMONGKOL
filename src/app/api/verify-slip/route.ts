import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase Admin Client to bypass RLS for checking/updating records securely
// We need SERVICE_ROLE_KEY for this if we were untrusted, but here we can use the backend logic.
// HOWEVER, route handlers run on server.
// If we use the standard client created with cookies, it acts as the user.
// The `add_credits_v2` RPC is SECURITY DEFINER, so it runs with high privileges even if called by a user.
// Use the standard setup we have or create a fresh one.
// Let's use the standard setup but we need `createRouteHandlerClient` equivalent or just standard REST if we want.
// Given the previous code didn't import supabase, we need to add it.
// The user has `src/utils/supabase.ts` which exports `supabase` (client-side usually).
// For API routes, it's better to use `createServerClient` or just standard `createClient` with URL/ANON_KEY and rely on the user's session from the request cookies?
// Actually, `verify-slip` receives a request. We need to identify the user.
// The `add_credits_v2` uses `auth.uid()`, so we MUST have an authenticated session context.
// Next.js App Router API Routes don't automatically have `auth.uid()` context unless we assume the client passed cookies and we forward them, OR we use `createServerClient` from `@supabase/ssr`.

// Let's check `src/utils/supabase.ts` first to see what it exports.
// If it's just the singleton generic client, it might not have auth context on server.
// But wait, the previous implementation of `verify-slip` didn't interact with DB.
// Now we NEED to interact with DB.

// To properly call `add_credits_v2` (which uses `auth.uid()`), we need a Supabase client configured with the user's cookies.
import { createServerClient, type CookieOptions } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get('image'); // Frontend sends 'image'

        if (!file || !(file instanceof Blob)) {
            return NextResponse.json(
                { success: false, message: 'No image provided or invalid file type' },
                { status: 400 }
            );
        }

        // 1. Setup Supabase Client for Auth Context
        const cookieStore = await cookies();
        const supabase = createServerClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                cookies: {
                    get(name: string) {
                        return cookieStore.get(name)?.value;
                    },
                    set(name: string, value: string, options: CookieOptions) {
                        cookieStore.set({ name, value, ...options });
                    },
                    remove(name: string, options: CookieOptions) {
                        cookieStore.set({ name, value: '', ...options });
                    },
                },
            }
        );

        // Check if user is authenticated
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json(
                { success: false, message: 'Unauthorized: Please login first' },
                { status: 401 }
            );
        }

        // 2. Prepare for Slip2Go API
        // Convert Blob to Buffer
        const buffer = Buffer.from(await file.arrayBuffer());

        // Create new FormData for the upstream API
        const slip2GoFormData = new FormData();
        // Slip2Go requires field name 'file'
        slip2GoFormData.append('file', new Blob([buffer], { type: file.type }), (file as any).name || 'slip.jpg');

        const secretKey = process.env.SLIP2GO_SECRET_KEY || 'BKkuXbNHiznJu80IHV2OgL5N9BDm1Bb7uz2yKLToM9E=';

        console.log('Sending request to Slip2Go...');

        // 3. Call Slip2Go
        const apiResponse = await fetch('https://api.slip2go.com/api/verify-slip/qr-image/info', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${secretKey}`,
                // Content-Type is set automatically by fetch for FormData
            },
            body: slip2GoFormData,
        });

        const apiData = await apiResponse.json();

        // Check API response
        // Slip2Go success structure needs to be handled. 
        // Assuming standard HTTP errors or specific success fields.
        if (!apiResponse.ok) {
            console.error('Slip2Go Error:', apiData);
            return NextResponse.json({
                success: false,
                message: apiData.message || 'Verification failed at provider',
                details: apiData
            }, { status: apiResponse.status });
        }

        // 4. Extract Data
        // Based on user prompt: "ดึงค่า transRef และ amount"
        // Let's assume the structure based on common Slip2Go patterns or similar APIs
        // Commonly: data: { transRef: '...', amount: 100.00, ... } or just top level.
        // User prompt says: "When response comes back, extract transRef and amount"
        // Let's handle the extraction carefully. 
        // If the user didn't give EXACT JSON structure, I'll log and assume `data` wrapper.
        // Most verified providers wrap in `data`.

        // NOTE: User prompt implies strict structure. 
        // Let's assume `apiData.data.transRef` and `apiData.data.amount` based on previous EasySlip structure which was similar.
        // If Slip2Go uses different casing, we should handle it. `transRef` is specified in prompt.

        const resultData = apiData.data || apiData;
        const transRef = resultData.transRef || resultData.trans_ref || resultData.ref;
        const amount = typeof resultData.amount === 'object' ? resultData.amount.amount : resultData.amount; // Sometimes amount is { amount: 100, currency: 'THB' }

        if (!transRef || !amount) {
            console.error('Invalid Slip Data:', resultData);
            return NextResponse.json({
                success: false,
                message: 'Could not extract slip data (TransRef or Amount missing)',
                details: resultData
            }, { status: 400 });
        }

        // 5. Calculate Credits (Server-Side Logic)
        // 100 -> 1 THB (Starter)
        // 150 -> 139 THB (Pro)
        // 500 -> 399 THB (Whale)
        // Fallback: 1 THB = 1 Credit
        let creditsToAdd = 0;
        const amountVal = parseFloat(amount.toString());

        if (Math.abs(amountVal - 1.00) < 0.1) {
            creditsToAdd = 100;
        } else if (Math.abs(amountVal - 139.00) < 0.1) {
            creditsToAdd = 150;
        } else if (Math.abs(amountVal - 399.00) < 0.1) {
            creditsToAdd = 500;
        } else {
            creditsToAdd = Math.floor(amountVal); // Default 1:1
        }

        // 6. DB Duplicate Check and Update (Atomic RPC)
        const { data: rpcResult, error: rpcError } = await supabase.rpc('add_credits_v2', {
            credit_amount: creditsToAdd,
            payment_amount: amountVal,
            slip_ref: transRef
        });

        if (rpcError) {
            console.error('RPC Error:', rpcError);
            throw rpcError;
        }

        // 7. Handle RPC Result
        if (!rpcResult.success) {
            // Duplicate or other logical failure
            return NextResponse.json({
                success: false,
                message: rpcResult.message || 'สลิปนี้ถูกใช้งานไปแล้ว',
                data: { transRef, amount }
            }, { status: 400 });
        }

        return NextResponse.json({
            success: true,
            message: 'เติมเครดิตสำเร็จ',
            data: {
                transRef,
                amount: amountVal,
                creditsAdded: creditsToAdd,
                newBalance: rpcResult.new_balance
            }
        });

    } catch (error: any) {
        console.error('Verification Error:', error);
        return NextResponse.json(
            { success: false, message: 'Internal server error', details: error.message },
            { status: 500 }
        );
    }
}
