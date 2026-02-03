'use client';

import React, { useRef, useState } from 'react';
import { Download, Award, Sparkles, Loader2, Share2 } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

interface CertificateGeneratorProps {
    name: string;
    surname: string;
    grade: string;
    totalScore: number;
    day: string;
    prediction: {
        level: string;
        desc: string;
    };
    /** Compact mode for embedding in small cards */
    compact?: boolean;
}

const dayNames: Record<string, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์',
};

// Use hex colors instead of Tailwind classes for html2canvas compatibility
const gradeHexColors: Record<string, { bg1: string; bg2: string; text: string; glow: string }> = {
    'A+': { bg1: '#f59e0b', bg2: '#facc15', text: '#78350f', glow: 'rgba(245, 158, 11, 0.5)' },
    'A': { bg1: '#10b981', bg2: '#2dd4bf', text: '#064e3b', glow: 'rgba(16, 185, 129, 0.5)' },
    'B+': { bg1: '#3b82f6', bg2: '#22d3ee', text: '#1e3a8a', glow: 'rgba(59, 130, 246, 0.5)' },
    'B': { bg1: '#6366f1', bg2: '#a855f7', text: '#312e81', glow: 'rgba(99, 102, 241, 0.5)' },
    'C': { bg1: '#64748b', bg2: '#9ca3af', text: '#0f172a', glow: 'rgba(100, 116, 139, 0.5)' },
};

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
    name,
    surname,
    grade,
    totalScore,
    day,
    prediction,
    compact = false,
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    const currentDate = new Date().toLocaleDateString('th-TH', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    });

    const gradeStyle = gradeHexColors[grade] || gradeHexColors['C'];

    // Function to fix unsupported CSS color functions for html2canvas
    const fixColorFunctions = (clone: Document) => {
        const allElements = clone.querySelectorAll('*');
        allElements.forEach((el) => {
            const computedStyle = window.getComputedStyle(el);
            const stylesToCheck = ['color', 'backgroundColor', 'borderColor', 'borderTopColor', 'borderRightColor', 'borderBottomColor', 'borderLeftColor', 'outlineColor', 'textDecorationColor', 'fill', 'stroke'];
            
            stylesToCheck.forEach((prop) => {
                const value = computedStyle.getPropertyValue(prop);
                if (value && (value.includes('lab(') || value.includes('oklch(') || value.includes('oklab('))) {
                    // Replace with a fallback color
                    (el as HTMLElement).style.setProperty(prop, '#ffffff', 'important');
                }
            });
            
            // Also check background
            const bg = computedStyle.background;
            if (bg && (bg.includes('lab(') || bg.includes('oklch(') || bg.includes('oklab('))) {
                (el as HTMLElement).style.setProperty('background', '#0f172a', 'important');
            }
        });
    };

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;

        setIsGenerating(true);

        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: '#0f172a',
                logging: false,
                useCORS: true,
                scale: 3, // Higher scale for better quality
                onclone: (clonedDoc: Document) => {
                    fixColorFunctions(clonedDoc);
                },
            } as Parameters<typeof html2canvas>[1]);

            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({
                orientation: 'landscape',
                unit: 'mm',
                format: 'a4',
            });

            const pdfWidth = pdf.internal.pageSize.getWidth();
            const pdfHeight = pdf.internal.pageSize.getHeight();

            pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
            pdf.save(`ใบรับรองมงคล-${name}${surname}.pdf`);
        } catch (error) {
            console.error('Error generating PDF:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleDownloadImage = async () => {
        if (!certificateRef.current) return;

        setIsGenerating(true);

        try {
            const element = certificateRef.current;
            const canvas = await html2canvas(element, {
                backgroundColor: '#0f172a',
                logging: false,
                useCORS: true,
                scale: 3, // Higher scale for better quality
                onclone: (clonedDoc: Document) => {
                    fixColorFunctions(clonedDoc);
                },
            } as Parameters<typeof html2canvas>[1]);

            const link = document.createElement('a');
            link.download = `ใบรับรองมงคล-${name}${surname}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
        } catch (error) {
            console.error('Error generating image:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    // Compact mode button (for embedding in cards)
    if (compact && !showCertificate) {
        return (
            <button
                onClick={() => setShowCertificate(true)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 text-xs font-medium rounded-lg transition-all duration-300 group"
            >
                <Award className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                <span>ออกใบรับรอง</span>
            </button>
        );
    }

    if (!showCertificate) {
        return (
            <button
                onClick={() => setShowCertificate(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group"
            >
                <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>ออกใบรับรองมงคล</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
            </button>
        );
    }

    // Certificate content with inline styles for html2canvas compatibility
    const CertificateContent = ({ isCompact = false }: { isCompact?: boolean }) => (
        <div
            ref={certificateRef}
            style={{
                position: 'relative',
                background: 'linear-gradient(180deg, #0f172a 0%, #1e293b 100%)',
                padding: isCompact ? '14px' : '20px',
                width: isCompact ? '420px' : '580px',
                height: isCompact ? '360px' : '500px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'space-between',
                textAlign: 'center',
                fontFamily: 'system-ui, -apple-system, sans-serif',
            }}
        >
            {/* Elegant Border Frame */}
            <div style={{
                position: 'absolute',
                inset: isCompact ? '6px' : '10px',
                border: '1px solid rgba(245, 158, 11, 0.3)',
                borderRadius: '6px',
                pointerEvents: 'none',
            }} />
            <div style={{
                position: 'absolute',
                inset: isCompact ? '10px' : '14px',
                border: '2px solid rgba(245, 158, 11, 0.5)',
                borderRadius: '4px',
                pointerEvents: 'none',
            }} />

            {/* Header Section with Logo */}
            <div style={{
                width: '100%',
                paddingTop: isCompact ? '4px' : '6px',
                paddingBottom: isCompact ? '8px' : '10px',
                borderBottom: '1px solid rgba(245, 158, 11, 0.2)',
                marginBottom: isCompact ? '8px' : '12px',
            }}>
                {/* Logo and Brand */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isCompact ? '6px' : '8px',
                    marginBottom: isCompact ? '6px' : '8px',
                }}>
                    <img 
                        src="/icon-192.png" 
                        alt="NameMongkol Logo"
                        style={{
                            width: isCompact ? '24px' : '32px',
                            height: isCompact ? '24px' : '32px',
                            borderRadius: '6px',
                            boxShadow: '0 2px 8px rgba(245, 158, 11, 0.3)',
                        }}
                    />
                    <div style={{ textAlign: 'left' }}>
                        <p style={{
                            fontSize: isCompact ? '12px' : '16px',
                            fontWeight: 'bold',
                            color: '#fbbf24',
                            margin: 0,
                            letterSpacing: '0.02em',
                        }}>
                            NameMongkol
                        </p>
                        <p style={{
                            fontSize: isCompact ? '6px' : '8px',
                            color: 'rgba(251, 191, 36, 0.6)',
                            margin: 0,
                            letterSpacing: '0.05em',
                        }}>
                            ตั้งชื่อมงคล เสริมดวงชะตา
                        </p>
                    </div>
                </div>

                {/* Certificate Title */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                }}>
                    <div style={{ width: '30px', height: '1px', background: 'linear-gradient(to right, transparent, #f59e0b)' }} />
                    <h1 style={{
                        fontSize: isCompact ? '11px' : '14px',
                        fontWeight: 600,
                        color: '#94a3b8',
                        letterSpacing: '0.1em',
                        margin: 0,
                    }}>
                        ใบรับรองมงคล
                    </h1>
                    <div style={{ width: '30px', height: '1px', background: 'linear-gradient(to left, transparent, #f59e0b)' }} />
                </div>
            </div>

            {/* Main Content */}
            <div style={{ position: 'relative', zIndex: 10, flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                
                {/* Name Display */}
                <div style={{
                    padding: isCompact ? '10px 16px' : '14px 24px',
                    background: 'linear-gradient(90deg, transparent 0%, rgba(245, 158, 11, 0.08) 50%, transparent 100%)',
                    borderTop: '1px solid rgba(245, 158, 11, 0.3)',
                    borderBottom: '1px solid rgba(245, 158, 11, 0.3)',
                    marginBottom: isCompact ? '8px' : '12px',
                }}>
                    <p style={{ color: '#64748b', fontSize: isCompact ? '8px' : '10px', marginBottom: '2px', letterSpacing: '0.1em' }}>ขอรับรองว่า</p>
                    <h2 style={{
                        fontSize: isCompact ? '20px' : '28px',
                        fontWeight: 'bold',
                        color: '#fcd34d',
                        textShadow: '0 2px 8px rgba(252, 211, 77, 0.2)',
                        margin: 0,
                        letterSpacing: '0.02em',
                    }}>
                        {name} {surname}
                    </h2>
                    <p style={{
                        color: '#94a3b8',
                        fontSize: isCompact ? '8px' : '10px',
                        marginTop: '4px',
                    }}>
                        เกิดวัน<span style={{ color: '#fbbf24', fontWeight: 600 }}>{dayNames[day] || day}</span> • วิเคราะห์ตามหลักโหราศาสตร์ไทย
                    </p>
                </div>

                {/* Grade and Score Section */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isCompact ? '16px' : '24px',
                    marginBottom: isCompact ? '8px' : '12px',
                }}>
                    {/* Grade Badge */}
                    <div style={{
                        width: isCompact ? '40px' : '54px',
                        height: isCompact ? '40px' : '54px',
                        borderRadius: '50%',
                        background: `linear-gradient(135deg, ${gradeStyle.bg1}, ${gradeStyle.bg2})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        boxShadow: `0 6px 24px ${gradeStyle.glow}`,
                    }}>
                        <span style={{
                            fontSize: isCompact ? '16px' : '22px',
                            fontWeight: 900,
                            color: gradeStyle.text,
                        }}>
                            {grade}
                        </span>
                    </div>

                    {/* Score Info */}
                    <div style={{ textAlign: 'left' }}>
                        <p style={{ 
                            fontSize: isCompact ? '8px' : '10px', 
                            color: '#64748b', 
                            margin: '0 0 1px',
                            letterSpacing: '0.05em',
                        }}>
                            ระดับ
                        </p>
                        <p style={{ 
                            fontSize: isCompact ? '12px' : '15px', 
                            fontWeight: 'bold', 
                            color: '#ffffff', 
                            margin: '0 0 2px' 
                        }}>
                            {prediction.level}
                        </p>
                        <p style={{ 
                            fontSize: isCompact ? '14px' : '18px', 
                            fontWeight: 'bold', 
                            color: '#fbbf24', 
                            margin: 0 
                        }}>
                            {totalScore} <span style={{ fontSize: isCompact ? '9px' : '11px', color: '#64748b', fontWeight: 400 }}>คะแนน</span>
                        </p>
                    </div>
                </div>

                {/* Prediction Quote */}
                <div style={{
                    maxWidth: isCompact ? '85%' : '320px',
                    margin: '0 auto',
                    background: 'rgba(15, 23, 42, 0.6)',
                    borderRadius: '6px',
                    padding: isCompact ? '8px 10px' : '10px 14px',
                    border: '1px solid rgba(100, 116, 139, 0.3)',
                }}>
                    <p style={{
                        color: '#cbd5e1',
                        fontSize: isCompact ? '8px' : '10px',
                        fontStyle: 'italic',
                        lineHeight: 1.5,
                        margin: 0,
                    }}>
                        &quot;{prediction.desc}&quot;
                    </p>
                </div>
            </div>

            {/* Footer */}
            <div style={{
                width: '100%',
                paddingTop: isCompact ? '8px' : '12px',
                borderTop: '2px solid rgba(245, 158, 11, 0.3)',
                marginTop: 'auto',
                paddingBottom: isCompact ? '4px' : '6px',
            }}>
                {/* Single Row Footer */}
                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: isCompact ? '12px' : '20px',
                    flexWrap: 'wrap',
                }}>
                    {/* Issue Date */}
                    <span style={{ 
                        color: '#64748b', 
                        fontSize: isCompact ? '9px' : '11px',
                    }}>
                        ออกเมื่อ {currentDate}
                    </span>

                    {/* Verified Badge */}
                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: isCompact ? '5px' : '6px',
                        padding: isCompact ? '4px 10px' : '5px 14px',
                        background: 'rgba(245, 158, 11, 0.15)',
                        borderRadius: '20px',
                        border: '1px solid rgba(245, 158, 11, 0.3)',
                    }}>
                        <div style={{
                            width: isCompact ? '18px' : '24px',
                            height: isCompact ? '18px' : '24px',
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            flexShrink: 0,
                        }}>
                            <span style={{ 
                                color: '#fff', 
                                fontSize: isCompact ? '11px' : '14px', 
                                fontWeight: 'bold',
                                lineHeight: 1,
                                display: 'block',
                                textAlign: 'center',
                            }}>✓</span>
                        </div>
                        <span style={{ 
                            color: '#fbbf24', 
                            fontSize: isCompact ? '9px' : '11px', 
                            fontWeight: 600,
                        }}>
                            รับรองแล้ว
                        </span>
                    </div>

                    {/* Website */}
                    <span style={{ 
                        color: '#fbbf24', 
                        fontSize: isCompact ? '9px' : '11px', 
                        fontWeight: 600,
                    }}>
                        namemongkol.com
                    </span>
                </div>
            </div>
        </div>
    );

    // Compact mode certificate modal
    if (compact) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fade-in">
                <div className="relative w-full max-w-3xl bg-slate-900 rounded-2xl border border-amber-500/30 shadow-2xl overflow-hidden">
                    {/* Close button */}
                    <button
                        onClick={() => setShowCertificate(false)}
                        className="absolute top-4 right-4 z-20 p-2 bg-slate-800/80 hover:bg-slate-700 rounded-full text-slate-400 hover:text-white transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>

                    {/* Certificate Content */}
                    <CertificateContent isCompact />

                    {/* Download Buttons */}
                    <div className="p-4 bg-slate-800/50 flex flex-col sm:flex-row gap-2">
                        <button
                            onClick={handleDownloadPDF}
                            disabled={isGenerating}
                            className="flex-1 py-2.5 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-lg transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 text-sm"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
                            <span>ดาวน์โหลด PDF</span>
                        </button>
                        <button
                            onClick={handleDownloadImage}
                            disabled={isGenerating}
                            className="flex-1 py-2.5 px-4 bg-slate-700 hover:bg-slate-600 border border-slate-600 text-white font-medium rounded-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 text-sm"
                        >
                            {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <Share2 className="w-4 h-4" />}
                            <span>ดาวน์โหลดรูปภาพ</span>
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-4">
            {/* Certificate Preview */}
            <div className="overflow-hidden rounded-2xl border border-amber-500/30 shadow-2xl">
                <CertificateContent />
            </div>

            {/* Download Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
                <button
                    onClick={handleDownloadPDF}
                    disabled={isGenerating}
                    className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Download className="w-5 h-5" />
                    )}
                    <span>ดาวน์โหลด PDF</span>
                </button>
                <button
                    onClick={handleDownloadImage}
                    disabled={isGenerating}
                    className="flex-1 py-3 px-4 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-white font-medium rounded-xl transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                    {isGenerating ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                    ) : (
                        <Share2 className="w-5 h-5" />
                    )}
                    <span>ดาวน์โหลดรูปภาพ</span>
                </button>
            </div>

            {/* Close Button */}
            <button
                onClick={() => setShowCertificate(false)}
                className="w-full py-2 text-slate-400 hover:text-white text-sm transition-colors"
            >
                ซ่อนใบรับรอง
            </button>
        </div>
    );
};

export default CertificateGenerator;
