import React from 'react';
import { X, CheckCircle2 } from 'lucide-react';
import { QRCodeCanvas } from 'qrcode.react';
import generatePayload from 'promptpay-qr';
import SlipUploader from './SlipUploader';

interface ManualPaymentModalProps {
    price: number;
    credits: number;
    tierId: string;
    tierName: string;
    promptpayNumber?: string;
    onClose: () => void;
}

export default function ManualPaymentModal({ price, credits, tierId, tierName, promptpayNumber, onClose }: ManualPaymentModalProps) {
    const PROMPTPAY_ID = (promptpayNumber || '').trim();
    const payload = PROMPTPAY_ID ? generatePayload(PROMPTPAY_ID, { amount: price }) : '';
    const [copied, setCopied] = React.useState(false);

    const handleCopy = () => {
        if (!PROMPTPAY_ID) return;
        navigator.clipboard.writeText(PROMPTPAY_ID);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-in font-sans">
            <div className="bg-white w-full max-w-[340px] md:max-w-[400px] rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

                {/* Header - Thai QR Payment Style */}
                <div className="bg-[#1a3a6c] px-4 py-3 flex justify-between items-center relative shrink-0">
                    <div className="flex items-center gap-3">
                        {/* Thai QR Logo SVG */}
                        <div className="w-10 h-10 md:w-12 md:h-12 relative flex items-center justify-center">
                            <svg viewBox="0 0 100 100" className="w-full h-full text-white" fill="none" xmlns="http://www.w3.org/2000/svg">
                                {/* Outer Rounded Square */}
                                <rect x="5" y="5" width="90" height="90" rx="15" stroke="currentColor" strokeWidth="6" />

                                {/* Inner Corners */}
                                <path d="M25 25 L25 40 M25 25 L40 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M75 25 L75 40 M75 25 L60 25" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M25 75 L25 60 M25 75 L40 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />
                                <path d="M75 75 L75 60 M75 75 L60 75" stroke="currentColor" strokeWidth="6" strokeLinecap="round" />

                                {/* Center Dot */}
                                <circle cx="50" cy="50" r="8" fill="currentColor" />
                            </svg>
                        </div>
                        <div className="flex flex-col text-white leading-tight">
                            <span className="font-bold text-lg md:text-xl tracking-wide">THAI QR</span>
                            <span className="font-light text-xs md:text-sm tracking-widest">PAYMENT</span>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="bg-white/20 hover:bg-white/30 rounded-full p-1.5 transition-colors text-white"
                    >
                        <X size={18} />
                    </button>
                </div>

                {/* Content - Scrollable */}
                <div className="overflow-y-auto custom-scrollbar p-4 bg-[#f9fafb]">

                    {/* Amount Display */}
                    <div className="text-center mb-4">
                        <p className="text-slate-500 text-xs mb-1">ยอดชำระเงิน (Amount)</p>
                        <h2 className="text-3xl font-bold text-[#1a3a6c]">
                            {price.toFixed(2)} <span className="text-base font-normal text-slate-400">THB</span>
                        </h2>
                    </div>

                    {/* QR Code Section */}
                    <div className="flex flex-col items-center space-y-3 mb-6">
                        <div className="p-3 bg-white rounded-xl shadow-sm border border-slate-100 relative">
                            {PROMPTPAY_ID ? (
                                <QRCodeCanvas
                                    value={payload}
                                    size={180}
                                    level="M"
                                    imageSettings={{
                                        src: "https://upload.wikimedia.org/wikipedia/commons/c/c5/PromptPay_logo.png",
                                        height: 20,
                                        width: 50,
                                        excavate: true,
                                    }}
                                />
                            ) : (
                                <div className="w-[180px] h-[180px] flex items-center justify-center text-center text-xs text-slate-500 bg-slate-50">
                                    ยังไม่ได้ตั้งค่า PromptPay<br />กรุณาตั้งค่าในหน้า Admin
                                </div>
                            )}
                        </div>

                        <button
                            className="flex items-center gap-2 px-5 py-1.5 bg-[#eef2f6] hover:bg-[#dbeafe] text-[#1a3a6c] rounded-full text-xs font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            disabled={!PROMPTPAY_ID}
                            onClick={() => {
                                if (!PROMPTPAY_ID) return;
                                const canvas = document.querySelector('canvas');
                                if (canvas) {
                                    const link = document.createElement('a');
                                    link.download = `QR-NameMongkol-${price}.png`;
                                    link.href = canvas.toDataURL();
                                    link.click();
                                }
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                            </svg>
                            บันทึกรูป QR Code
                        </button>
                    </div>

                    {PROMPTPAY_ID && (
                        <div className="mb-4 flex items-center justify-center gap-2 text-xs text-slate-600">
                            <span>หมายเลขพร้อมเพย์:</span>
                            <button
                                onClick={handleCopy}
                                className="px-2 py-1 rounded-full bg-[#eef2f6] hover:bg-[#dbeafe] text-[#1a3a6c] font-semibold"
                            >
                                {PROMPTPAY_ID}
                            </button>
                            {copied && (
                                <span className="text-emerald-600 flex items-center gap-1">
                                    <CheckCircle2 size={12} /> คัดลอกแล้ว
                                </span>
                            )}
                        </div>
                    )}

                    {/* Divider */}
                    {/* <div className="border-t border-dashed border-slate-300 my-6 relative">
                         <div className="absolute left-0 -top-3 w-6 h-6 bg-[#f9fafb] rounded-full -ml-9"></div>
                         <div className="absolute right-0 -top-3 w-6 h-6 bg-[#f9fafb] rounded-full -mr-9"></div>
                    </div> */}

                    {/* Uploader Section */}
                    <SlipUploader amount={price} credits={credits} tierId={tierId} />

                </div>
            </div>
        </div>
    );
}

function formatPhoneNumber(phoneNumber: string) {
    if (phoneNumber.length === 10) {
        return `${phoneNumber.slice(0, 3)}-${phoneNumber.slice(3, 6)}-${phoneNumber.slice(6)}`;
    }
    return phoneNumber;
}
