'use client';

import SlipUploader from '@/components/SlipUploader';
import { Sidebar } from '@/components/Sidebar';

export default function SlipVerificationPage() {
    return (
        <div className="flex bg-[#1a0b2e] min-h-screen text-white font-sans">
            <Sidebar />
            <div className="flex-1 p-8">
                <h1 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-teal-200 to-emerald-400">
                    ระบบตรวจสอบสลิป
                </h1>
                <div className="max-w-xl mx-auto">
                    <SlipUploader />
                </div>
            </div>
        </div>
    );
}
