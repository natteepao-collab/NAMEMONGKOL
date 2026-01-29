'use client';

import { useState } from 'react';
import { supabase } from '@/utils/supabase';
import { CreditReceivedModal } from './CreditReceivedModal';

interface SlipUploaderProps {
    amount?: number;
    credits?: number;
    tierId?: string;
}

export default function SlipUploader({ amount, credits, tierId }: SlipUploaderProps) {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);
    const [showSuccessModal, setShowSuccessModal] = useState(false);
    const [receivedCredits, setReceivedCredits] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setResult(null); // Reset previous result
        }
    };

    const handleUpload = async () => {
        if (!selectedFile) return;

        // Dynamic import SweetAlert2 (explicit path to ensure chunk exists)
        // @ts-ignore
        const Swal = (await import('sweetalert2')).default;

        setIsLoading(true);
        setResult(null);

        try {
            const { data: { session } } = await supabase.auth.getSession();
            if (!session) {
                Swal.fire({
                    icon: 'error',
                    title: 'กรุณาเข้าสู่ระบบ',
                    text: 'กรุณาเข้าสู่ระบบก่อนทำรายการ',
                    confirmButtonText: 'ตกลง'
                });
                setIsLoading(false);
                return;
            }

            const formData = new FormData();
            formData.append('image', selectedFile);

            // Generate a unique transaction ID for this upload attempt
            const transId = `MANUAL-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
            formData.append('trans_id', transId);

            if (amount) formData.append('payment_amount', amount.toString());
            if (credits) formData.append('credit_amount', credits.toString());
            if (tierId) formData.append('tier_id', tierId);

            const response = await fetch('/api/verify-slip', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${session.access_token}`
                },
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResult({ success: true, message: data.message });
                // Show Success Modal
                setReceivedCredits(data.data?.creditAmount || credits || 0);
                setShowSuccessModal(true);

                // If success, force refresh credits
                window.dispatchEvent(new Event('force_credits_update'));
            } else {
                const isDuplicate = data.code === 'DUPLICATE_SLIP';
                Swal.fire({
                    icon: 'error',
                    title: isDuplicate ? 'สลิปซ้ำ!' : 'ตรวจสอบไม่ผ่าน',
                    text: data.message || 'เกิดข้อผิดพลาดในการตรวจสอบ',
                    confirmButtonText: 'ตกลง',
                    confirmButtonColor: '#ef4444'
                });
                setResult({
                    success: false,
                    message: data.message || 'เกิดข้อผิดพลาดในการตรวจสอบ'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            Swal.fire({
                icon: 'error',
                title: 'เกิดข้อผิดพลาด',
                text: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้',
                confirmButtonText: 'ตกลง'
            });
            setResult({ success: false, message: 'เชื่อมต่อเซิร์ฟเวอร์ไม่ได้' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="w-full">
            {/* Upload Box */}
            <div className="mb-4">
                <label
                    htmlFor="slip-upload"
                    className="cursor-pointer group flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-300 rounded-lg hover:bg-slate-50 transition-all relative overflow-hidden bg-white"
                >
                    {previewUrl ? (
                        <div className="w-full h-full p-2 relative">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                                src={previewUrl}
                                alt="Slip Preview"
                                className="w-full h-full object-contain"
                            />
                            <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <span className="text-white text-xs bg-black/50 px-2 py-1 rounded">เปลี่ยนรูป</span>
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center justify-center pt-5 pb-6 text-slate-400">
                            <div className="w-10 h-10 mb-2 rounded-full bg-slate-100 flex items-center justify-center">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                                </svg>
                            </div>
                            <p className="text-sm font-medium text-slate-500">กดเพื่ออัปโหลดสลิปโอนเงิน</p>
                        </div>
                    )}
                    <input
                        id="slip-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleFileChange}
                        className="hidden"
                    />
                </label>
            </div>

            {/* Ref ID (Mock) */}
            <div className="text-center mb-6">
                <div className="inline-block bg-slate-100 px-4 py-1.5 rounded-full">
                    <p className="text-slate-500 text-xs font-mono">Ref ID: {tierId?.split('-')[0] || '6881880026'}</p>
                </div>
            </div>

            {/* Footer Info (Timer Mock) */}
            <div className="flex justify-between items-center text-xs text-slate-500 mb-4 px-2">
                <span>กรุณาชำระเงินภายใน</span>
                <span className="font-bold text-slate-700">10:00 นาที</span>
            </div>

            {/* Confirm Button */}
            <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg
                    ${!selectedFile || isLoading
                        ? 'bg-slate-400 text-white cursor-not-allowed'
                        : 'bg-[#58595b] hover:bg-[#4a4b4d] text-white shadow-slate-400/30'}`} // Matching the grey button in reference or could be theme color
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังตรวจสอบ...
                    </span>
                ) : (
                    <div className="flex items-center justify-center gap-2">
                        <div className="w-5 h-5 rounded-full border-2 border-white flex items-center justify-center">
                            <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" /></svg>
                        </div>
                        ยืนยันการแจ้งโอน
                    </div>
                )}
            </button>

            {result && result.message && !result.success && (
                <div className="mt-3 text-center text-sm text-red-500 bg-red-50 p-2 rounded-lg border border-red-100">
                    {result.message}
                </div>
            )}

            <CreditReceivedModal
                isOpen={showSuccessModal}
                onClose={() => {
                    setShowSuccessModal(false);
                    // Optional: clear file/preview
                    setSelectedFile(null);
                    setPreviewUrl(null);
                    if (window.location.pathname.includes('/topup')) {
                        // maybe redirect or refresh?
                    }
                }}
                creditAmount={receivedCredits}
            />
        </div>
    );
}
