'use client';

import SlipUploader from '@/components/SlipUploader';


export default function SlipVerificationPage() {
    return (
        <div className="p-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                ระบบตรวจสอบสลิป
            </h1>
            <div className="max-w-xl mx-auto">
                <SlipUploader />
            </div>
        </div>
    );
}
