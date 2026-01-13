'use server';

import { Stripe } from 'stripe';
import { createClient } from '@/utils/supabaseServer';
import { redirect } from 'next/navigation';

if (!process.env.STRIPE_SECRET_KEY) {
    throw new Error('STRIPE_SECRET_KEY is missing');
}

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
    // The previous error said: Type '"2024-12-18.acacia"' is not assignable to type '"2025-12-15.clover"'. 
    // This explicitly tells me the type definition expects '2025-12-15.clover'.
    apiVersion: '2025-12-15.clover' as any, // Cast to any to shut it up if types are wonky, or just put the string.
    typescript: true,
});

export async function createPromptPayCheckoutSession(
    price: number,
    credits: number,
    packageName: string
) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        throw new Error('User not authenticated');
    }

    const session = await stripe.checkout.sessions.create({
        payment_method_types: ['promptpay'],
        line_items: [
            {
                price_data: {
                    currency: 'thb',
                    product_data: {
                        name: packageName,
                        description: `${credits} Credits`,
                    },
                    unit_amount: price * 100, // Amount in satang
                },
                quantity: 1,
            },
        ],
        mode: 'payment',
        // Append session_id={CHECKOUT_SESSION_ID} so we can verify it on return
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/topup?payment_status=success&session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/topup?payment_status=cancelled`,
        metadata: {
            user_id: user.id,
            credits: credits.toString(),
            package_name: packageName,
        },
    });

    if (session.url) {
        redirect(session.url);
    }
}

export async function verifyPromptPayTransaction(sessionId: string) {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        return { success: false, message: 'User not authenticated' };
    }

    // Ensure Service Role Key is available
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        throw new Error('Server configuration error: Missing Service Role Key');
    }

    // Initialize Admin Client
    const { createClient: createSupabaseClient } = require('@supabase/supabase-js');
    const supabaseAdmin = createSupabaseClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    try {
        // 1. Retrieve session from Stripe
        const session = await stripe.checkout.sessions.retrieve(sessionId);

        if (session.payment_status !== 'paid') {
            return { success: false, message: 'Payment not completed' };
        }

        // 2. Check for idempotency (if already processed)
        // Use Admin client to be safe, though User client has select policy
        const { data: existingTx } = await supabaseAdmin
            .from('payment_history')
            .select('id')
            .eq('session_id', sessionId)
            .single();

        if (existingTx) {
            return { success: true, message: 'Already processed', credits: session.metadata?.credits };
        }

        const credits = parseInt(session.metadata?.credits || '0', 10);
        const amount = session.amount_total ? session.amount_total / 100 : 0;

        // 3. Insert transaction log
        // Use Admin client to bypass RLS (since we have no INSERT policy for public users)
        const { error: insertError } = await supabaseAdmin.from('payment_history').insert({
            session_id: sessionId,
            user_id: user.id,
            amount: amount,
            credits: credits,
            status: 'completed',
        });

        if (insertError) {
            console.error('Error logging transaction:', insertError);
            throw new Error('Failed to record transaction: ' + insertError.message);
        }

        // 4. Update User Credits
        // Try RPC first
        const { error: updateError } = await supabaseAdmin.rpc('increment_credits', {
            user_uuid: user.id,
            amount: credits
        });

        if (updateError) {
            console.error('RPC increment_credits failed:', updateError);

            console.log('Attempting direct update fallback...');
            const { data: profile, error: fetchError } = await supabaseAdmin.from('user_profiles').select('credits').eq('id', user.id).single();

            if (fetchError) {
                console.error('Failed to fetch profile for fallback:', fetchError);
            }

            const newCredits = (profile?.credits || 0) + credits;
            const { error: directError } = await supabaseAdmin.from('user_profiles').update({ credits: newCredits }).eq('id', user.id);

            if (directError) {
                console.error('Direct update failed:', directError);
                throw new Error('Failed to update credits (Direct): ' + directError.message + ' | RPC Error: ' + updateError.message);
            }
        }

        return { success: true, credits };

    } catch (error: any) {
        console.error('Verification Error:', error);
        return { success: false, message: error.message };
    }
}
