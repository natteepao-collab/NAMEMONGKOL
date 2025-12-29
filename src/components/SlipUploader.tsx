'use client';

import { useState } from 'react';

export default function SlipUploader() {
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [result, setResult] = useState<{ success: boolean; message: string } | null>(null);

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

        setIsLoading(true);
        setResult(null);

        const formData = new FormData();
        formData.append('image', selectedFile);

        try {
            const response = await fetch('/api/verify-slip', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (response.ok && data.success) {
                setResult({ success: true, message: data.message });
            } else {
                setResult({
                    success: false,
                    message: data.message || 'เกิดข้อผิดพลาดในการตรวจสอบ'
                });
            }
        } catch (error) {
            console.error('Upload error:', error);
            setResult({ success: false, message: 'เชื่อต่อเซิร์ฟเวอร์ไม่ได้' });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="p-6 bg-white/20 backdrop-blur-md rounded-2xl border border-white/30 shadow-xl max-w-md mx-auto text-center">
            <h3 className="text-xl font-bold text-white mb-4">แจ้งชำระเงิน</h3>

            <div className="mb-6">
                <label
                    htmlFor="slip-upload"
                    className="cursor-pointer block w-full h-48 border-2 border-dashed border-white/50 rounded-xl flex items-center justify-center hover:bg-white/10 transition-all relative overflow-hidden"
                >
                    {previewUrl ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                            src={previewUrl}
                            alt="Slip Preview"
                            className="w-full h-full object-contain"
                        />
                    ) : (
                        <div className="text-white/70">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 mx-auto mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>คลิกเพื่ออัปโหลดสลิป</span>
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

            <button
                onClick={handleUpload}
                disabled={!selectedFile || isLoading}
                className={`w-full py-3 rounded-xl font-bold text-white transition-all transform hover:scale-105 active:scale-95 shadow-lg
          ${!selectedFile || isLoading
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-gradient-to-r from-emerald-400 to-cyan-500 hover:shadow-emerald-500/30'}`}
            >
                {isLoading ? (
                    <span className="flex items-center justify-center gap-2">
                        <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        กำลังตรวจสอบ...
                    </span>
                ) : 'ยืนยันการโอนเงิน'}
            </button>

            {result && (
                <div className={`mt-4 p-3 rounded-lg flex items-center gap-2 text-sm justify-center font-medium animate-fade-in-up
          ${result.success ? 'bg-emerald-500/20 text-emerald-100 border border-emerald-500/30' : 'bg-red-500/20 text-red-100 border border-red-500/30'}`}
                >
                    {result.success ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                    ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                        </svg>
                    )}
                    {result.message}
                </div>
            )}
        </div>
    );
}
