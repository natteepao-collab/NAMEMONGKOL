'use client';

import React, { useState, useEffect, useRef } from 'react';

import { supabase } from '@/utils/supabase';
import { Package, CreditCard, ShieldCheck, Zap, Bitcoin, CheckCircle2, X, Upload, FileText, AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { QRCodeSVG } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import Swal from 'sweetalert2';

interface PricingTier {
    id: string;
    credits: number;
    price: number;
    name: string;
    description: string;
    popular?: boolean;
    color: string;
}

const PRICING_TIERS: PricingTier[] = [
    {
        id: 'tier_starter',
        credits: 100,
        price: 1,
        name: 'Starter Pack',
        description: 'เหมาะสำหรับผู้เริ่มต้น',
        color: 'from-blue-500 to-cyan-500'
    },
    {
        id: 'tier_pro',
        credits: 150,
        price: 139,
        name: 'Pro Value',
        description: 'คุ้มค่าที่สุด! ประหยัด 7%',
        popular: true,
        color: 'from-amber-500 to-orange-500'
    },
    {
        id: 'tier_whale',
        credits: 500,
        price: 399,
        name: 'Fortune Seeker',
        description: 'สำหรับสายมูตัวจริง ประหยัด 20%',
        color: 'from-purple-500 to-pink-500'
    }
];

const PROMPTPAY_NUMBER = '0891682824';

export default function TopUpPage() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);
    const [selectedTier, setSelectedTier] = useState<PricingTier | null>(null);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [qrPayload, setQrPayload] = useState<string>('');
    const [timeLeft, setTimeLeft] = useState(600); // 10 minutes in seconds
    const [orderId, setOrderId] = useState('');

    // Slip Upload States
    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);
    const [uploadError, setUploadError] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleSelectTier = (tier: PricingTier) => {
        setSelectedTier(tier);
        const payload = generatePayload(PROMPTPAY_NUMBER, { amount: tier.price });
        setQrPayload(payload);
        setOrderId(Math.floor(1000000000 + Math.random() * 9000000000).toString()); // 10 digit random order ID
        setTimeLeft(600); // Reset timer
        setShowPaymentModal(true);
        // Reset file states
        setSelectedFile(null);
        setPreviewUrl(null);
        setUploadError(null);
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Basic validation
            if (!file.type.startsWith('image/')) {
                setUploadError('กรุณาอัปโหลดไฟล์รูปภาพเท่านั้น');
                return;
            }
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                setUploadError('ขนาดไฟล์ต้องไม่เกิน 5MB');
                return;
            }

            setSelectedFile(file);
            setPreviewUrl(URL.createObjectURL(file));
            setUploadError(null);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const handleConfirmPayment = async () => {
        if (!selectedTier || !selectedFile) return;

        setIsLoading(true);
        setUploadError(null);

        try {
            const formData = new FormData();
            formData.append('image', selectedFile);

            // 1. Verify Slip with API
            const response = await fetch('/api/verify-slip', {
                method: 'POST',
                body: formData,
            });

            const data = await response.json();

            if (!response.ok || !data.success) {
                throw new Error(data.message || 'สลิปไม่ถูกต้อง หรือตรวจสอบไม่ผ่าน');
            }

            // Optional: Check amount matches (EasySlip likely returns amount in data.amount)
            // Note: logic depends on EasySlip response structure based on documentation/testing
            // For now we assume if success=true, it's a valid real slip. 
            // We could check data.data.amount if strict validation is needed.

            const slipAmount = data.data?.amount?.amount || 0;
            // Loose check: slip amount should be at least payment amount
            if (slipAmount < selectedTier.price) {
                throw new Error(`ยอดเงินในสลิป (${slipAmount}) ไม่ครบตามจำนวน (${selectedTier.price})`);
            }

            // 2. Add Credits securely (prevent duplicates)
            const slipRef = data.data?.transRef;
            if (!slipRef) {
                throw new Error('ไม่สามารถตรวจสอบรหัสรายการ (Transaction Ref) ได้');
            }

            const { data: rpcResult, error } = await supabase.rpc('add_credits_v2', {
                credit_amount: selectedTier.credits,
                payment_amount: selectedTier.price,
                slip_ref: slipRef
            });

            if (error) throw error;

            // Check logic response from RPC
            if (rpcResult && !rpcResult.success) {
                throw new Error(rpcResult.message || 'สลิปนี้ถูกใช้งานไปแล้ว');
            }

            // Success Alert
            await Swal.fire({
                title: 'เติมเครดิตสำเร็จ!',
                text: `คุณได้รับ ${selectedTier.credits} Credits เรียบร้อยแล้ว`,
                icon: 'success',
                confirmButtonText: 'ตกลง',
                confirmButtonColor: '#10b981', // emerald-500
                background: '#fff',
                color: '#1e293b'
            });

            setShowPaymentModal(false);
            window.location.reload(); // Refresh to update sidebar credits

        } catch (error: any) {
            console.error('Top-up error:', error);
            const errorMessage = error.message || 'เกิดข้อผิดพลาดในการตรวจสอบสลิป';

            // Error Alert (Sweet Alert)
            Swal.fire({
                title: 'เกิดข้อผิดพลาด',
                text: errorMessage,
                icon: 'error',
                confirmButtonText: 'ลองใหม่อีกครั้ง',
                confirmButtonColor: '#ef4444', // red-500
            });

            setUploadError(errorMessage);
        } finally {
            setIsLoading(false);
        }
    };

    const closePaymentModal = () => {
        if (isLoading) return;
        setShowPaymentModal(false);
        setSelectedTier(null);
    };

    useEffect(() => {
        let interval: NodeJS.Timeout;
        if (showPaymentModal && timeLeft > 0) {
            interval = setInterval(() => {
                setTimeLeft((prev) => prev - 1);
            }, 1000);
        } else if (timeLeft === 0) {
            // Handle timeout if needed
        }
        return () => clearInterval(interval);
    }, [showPaymentModal, timeLeft]);

    const formatTime = (seconds: number) => {
        const m = Math.floor(seconds / 60);
        const s = seconds % 60;
        return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-200 font-sans selection:bg-amber-500/30">
            <main className="min-h-screen relative overflow-hidden p-4 md:p-8">
                {/* Background Decor */}
                <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                    <div className="absolute top-[20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-emerald-500/5 blur-[120px]" />
                    <div className="absolute bottom-[-10%] left-[20%] w-[500px] h-[500px] rounded-full bg-blue-500/5 blur-[100px]" />
                </div>

                <div className="relative z-10 max-w-5xl mx-auto space-y-6 md:space-y-12 pt-4 md:pt-8">
                    {/* Header */}
                    <div className="text-center space-y-2 md:space-y-4">
                        <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-gradient-to-r from-emerald-500/10 to-teal-500/10 border border-emerald-500/20 text-emerald-300 text-xs md:text-sm font-medium">
                            <Zap size={14} className="md:w-4 md:h-4" />
                            <span>Top Up Credits</span>
                        </div>
                        <h1 className="text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-slate-200 to-slate-400">
                            เติมเครดิตเพื่อใช้งาน
                        </h1>
                        <p className="text-slate-400 text-sm md:text-lg max-w-2xl mx-auto px-4">
                            เลือกแพ็กเกจเครดิตที่คุ้มค่าสำหรับคุณ เพื่อใช้งานระบบวิเคราะห์ชื่อขั้นสูงและบริการอื่นๆ
                        </p>
                    </div>

                    {/* Pricing Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-8 pb-20 md:pb-0">
                        {PRICING_TIERS.map((tier) => (
                            <div
                                key={tier.id}
                                className={`relative group p-5 md:p-8 rounded-[1.5rem] md:rounded-[2rem] border transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl flex flex-col ${tier.popular
                                    ? 'bg-gradient-to-b from-slate-800/80 to-slate-900/90 border-amber-500/30 shadow-amber-500/10 scale-100 md:scale-105 z-10'
                                    : 'bg-slate-900/50 border-white/10 hover:border-white/20'
                                    }`}
                            >
                                {tier.popular && (
                                    <div className="absolute -top-3 md:-top-4 left-1/2 -translate-x-1/2 px-3 py-0.5 md:px-4 md:py-1 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full text-white text-[10px] md:text-xs font-bold shadow-lg shadow-amber-500/30 flex items-center gap-1">
                                        <Package size={10} className="md:w-3 md:h-3" /> BEST SELLER
                                    </div>
                                )}

                                <div className={`w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl bg-gradient-to-br ${tier.color} flex items-center justify-center text-white mb-2 md:mb-6 shadow-lg`}>
                                    <Bitcoin size={20} className="md:w-7 md:h-7" />
                                </div>

                                <div className="mb-2">
                                    <h3 className="text-lg md:text-xl font-bold text-white">{tier.name}</h3>
                                    <p className="text-slate-400 text-xs md:text-sm">{tier.description}</p>
                                </div>

                                <div className="mt-1 md:mt-4 mb-2 md:mb-8">
                                    <span className="text-3xl md:text-4xl font-black text-white">{tier.price}</span>
                                    <span className="text-slate-500 ml-2 text-sm md:text-lg">baht</span>
                                </div>

                                <div className="flex items-center gap-2 md:gap-3 mb-3 md:mb-8 text-emerald-400 font-medium bg-emerald-500/10 px-3 py-2 md:px-4 md:py-3 rounded-lg md:rounded-xl border border-emerald-500/20">
                                    <Zap size={16} className="md:w-5 md:h-5" />
                                    <span className="text-lg md:text-xl font-bold">{tier.credits}</span> Credits
                                </div>

                                <div className="mt-auto">
                                    <button
                                        onClick={() => handleSelectTier(tier)}
                                        disabled={isLoading}
                                        className={`w-full py-3 md:py-4 rounded-xl font-bold transition-all shadow-lg active:scale-95 flex items-center justify-center gap-2 text-sm md:text-base ${isLoading && selectedTier?.id === tier.id
                                            ? 'bg-slate-700 text-slate-400 cursor-not-allowed'
                                            : tier.popular
                                                ? 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 text-white shadow-amber-500/25'
                                                : 'bg-white text-slate-900 hover:bg-slate-200'
                                            }`}
                                    >
                                        <CreditCard size={16} className="md:w-[18px] md:h-[18px]" />
                                        ซื้อแพ็กเกจ
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Trust Badges */}
                    <div className="flex flex-wrap justify-center gap-8 md:gap-16 pt-8 border-t border-white/5 opacity-50">
                        <div className="flex items-center gap-3 text-slate-400">
                            <ShieldCheck className="w-6 h-6" />
                            <span className="text-sm font-medium">Secure Payment</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <CheckCircle2 className="w-6 h-6" />
                            <span className="text-sm font-medium">Instant Credit</span>
                        </div>
                        <div className="flex items-center gap-3 text-slate-400">
                            <Package className="w-6 h-6" />
                            <span className="text-sm font-medium">No Expiry Date</span>
                        </div>
                    </div>
                </div>

                {/* Payment Modal */}
                {showPaymentModal && selectedTier && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-in">
                        <div className="relative w-full max-w-md max-h-[90vh] flex flex-col bg-white rounded-[2rem] shadow-2xl overflow-hidden animate-fade-in-up">

                            {/* Blue Header - Thai QR Payment */}
                            <div className="bg-[#113566] p-3 md:p-5 flex justify-center items-center relative shrink-0">
                                <img
                                    src="/pp-white.svg"
                                    alt="Thai QR Payment"
                                    className="h-12 md:h-14 w-auto object-contain relative z-10"
                                />
                                {/* Internal Close Button */}
                                <button
                                    onClick={closePaymentModal}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white bg-white/10 hover:bg-white/20 p-2 rounded-full transition-all"
                                >
                                    <X size={20} />
                                </button>
                            </div>

                            {/* Scrollable Body */}
                            <div className="flex-1 overflow-y-auto custom-scrollbar">
                                <div className="p-4 md:p-8 flex flex-col items-center">
                                    <div className="text-center mb-2 md:mb-4">
                                        <p className="text-slate-500 text-xs md:text-sm mb-0.5">ยอดชำระเงิน (Amount)</p>
                                        <div className="text-3xl md:text-4xl font-black text-[#113566] tracking-tight">
                                            {selectedTier.price.toFixed(2)} <span className="text-base md:text-lg text-slate-400 font-bold">THB</span>
                                        </div>
                                    </div>

                                    {/* QR Code */}
                                    <div className="relative group mb-2 md:mb-4">
                                        <div className="absolute -inset-1 bg-gradient-to-tr from-[#113566] to-[#00aeef] rounded-2xl blur opacity-20 group-hover:opacity-30 transition duration-500"></div>
                                        <div className="bg-white p-1.5 md:p-3 rounded-2xl border border-slate-100 relative shadow-sm">
                                            <div className="relative flex items-center justify-center">
                                                <QRCodeSVG
                                                    value={qrPayload}
                                                    size={180}
                                                    level="H"
                                                    includeMargin={false}
                                                    className="w-full h-auto max-w-[180px]"
                                                />
                                                <div className="absolute bg-white p-1.5 rounded-lg shadow-sm flex items-center justify-center">
                                                    <img
                                                        src="/711px-PromptPay-logo.png"
                                                        alt="Logo"
                                                        className="w-14 h-auto object-contain"
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Upload Area */}
                                    <div className="w-full space-y-4">
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileChange}
                                            accept="image/*"
                                            className="hidden"
                                        />

                                        {!selectedFile ? (
                                            <button
                                                onClick={triggerFileInput}
                                                className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:bg-slate-50 hover:border-[#113566]/50 hover:text-[#113566] transition-all group"
                                            >
                                                <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center group-hover:bg-[#113566]/10 transition-colors">
                                                    <Upload size={20} />
                                                </div>
                                                <span className="text-sm font-medium">กดเพื่ออัปโหลดสลิปโอนเงิน</span>
                                            </button>
                                        ) : (
                                            <div className="w-full">
                                                <div className="flex items-center gap-4 p-4 bg-emerald-50 border border-emerald-100 rounded-xl relative overflow-hidden group hover:border-emerald-200 transition-colors">
                                                    {previewUrl && (
                                                        // eslint-disable-next-line @next/next/no-img-element
                                                        <img src={previewUrl} alt="Slip" className="w-16 h-16 object-cover rounded-lg border border-emerald-200 shadow-sm" />
                                                    )}
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-bold text-emerald-900 truncate">แนบสลิปเรียบร้อย</p>
                                                        <p className="text-xs text-emerald-600 truncate opacity-80">{selectedFile.name}</p>
                                                        <button
                                                            onClick={triggerFileInput}
                                                            className="text-xs text-[#113566] underline mt-1 font-medium"
                                                        >
                                                            เปลี่ยนรูปภาพ
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={(e) => { e.stopPropagation(); setSelectedFile(null); setPreviewUrl(null); }}
                                                        className="p-2 hover:bg-white rounded-lg text-red-500 hover:text-red-600 transition-colors"
                                                        title="ลบรูปภาพ"
                                                    >
                                                        <X size={20} />
                                                    </button>
                                                </div>
                                            </div>
                                        )}

                                        {uploadError && (
                                            <div className="flex items-start gap-3 text-red-600 text-sm bg-red-50 p-4 rounded-xl border border-red-100 animate-shake">
                                                <AlertCircle size={18} className="mt-0.5 shrink-0" />
                                                <span className="font-medium">{uploadError}</span>
                                            </div>
                                        )}
                                    </div>

                                    <div className="mt-4 flex items-center gap-2 text-slate-400 text-xs bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                                        <span>Ref ID:</span>
                                        <span className="font-mono font-bold text-slate-600 tracking-wider">{orderId}</span>
                                    </div>
                                </div>
                            </div>

                            {/* Footer Action Area (Fixed at bottom) */}
                            <div className="bg-slate-50 p-4 md:p-6 border-t border-slate-100 shrink-0">
                                <div className="flex items-center justify-between mb-3 text-sm font-medium px-1">
                                    <span className="text-slate-500 text-xs md:text-sm">กรุณาชำระเงินภายใน</span>
                                    <div className="flex items-center gap-2">
                                        <span className={`font-mono text-lg md:text-xl font-bold ${timeLeft < 60 ? 'text-red-500 animate-pulse' : 'text-[#113566]'}`}>
                                            {formatTime(timeLeft)}
                                        </span>
                                        <span className="text-slate-400 text-[10px] md:text-xs">นาที</span>
                                    </div>
                                </div>

                                <button
                                    onClick={handleConfirmPayment}
                                    disabled={isLoading || timeLeft === 0 || !selectedFile}
                                    className="w-full py-4 bg-gradient-to-r from-[#113566] to-[#005a9e] hover:from-[#0d2a52] hover:to-[#004e8a] text-white rounded-xl font-bold text-lg shadow-lg shadow-blue-900/20 active:scale-[0.98] transition-all flex items-center justify-center gap-3 disabled:opacity-70 disabled:grayscale disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <>
                                            <span className="animate-spin text-xl">⏳</span>
                                            <span>กำลังตรวจสอบ...</span>
                                        </>
                                    ) : (
                                        <>
                                            <CheckCircle2 size={24} className="text-emerald-400" />
                                            <span>ยืนยันการแจ้งโอน</span>
                                        </>
                                    )}
                                </button>
                            </div>
                        </div>
                    </div>
                )}
            </main>
        </div>
    );
}
