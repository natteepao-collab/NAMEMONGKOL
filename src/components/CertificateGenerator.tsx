'use client';

import React, { useRef, useState } from 'react';
import { Download, Award, Sparkles, Loader2, Share2, X } from 'lucide-react';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { analyzePairs } from '@/utils/analyzePairs';

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
    compact?: boolean;
}

const dayNames: Record<string, string> = {
    sunday: 'อาทิตย์',
    monday: 'จันทร์',
    tuesday: 'อังคาร',
    wednesday: 'พุธ',
    wednesday_night: 'พุธ (กลางคืน)',
    thursday: 'พฤหัสบดี',
    friday: 'ศุกร์',
    saturday: 'เสาร์',
};

const gradeColors: Record<string, { bg1: string; bg2: string; text: string; glow: string }> = {
    'A+': { bg1: '#f59e0b', bg2: '#facc15', text: '#78350f', glow: 'rgba(245,158,11,0.5)' },
    'A': { bg1: '#10b981', bg2: '#2dd4bf', text: '#064e3b', glow: 'rgba(16,185,129,0.5)' },
    'B+': { bg1: '#3b82f6', bg2: '#22d3ee', text: '#1e3a8a', glow: 'rgba(59,130,246,0.5)' },
    'B': { bg1: '#6366f1', bg2: '#a855f7', text: '#312e81', glow: 'rgba(99,102,241,0.5)' },
    'C': { bg1: '#64748b', bg2: '#9ca3af', text: '#0f172a', glow: 'rgba(100,116,139,0.5)' },
    'F': { bg1: '#ef4444', bg2: '#f87171', text: '#7f1d1d', glow: 'rgba(239,68,68,0.5)' },
};

export const CertificateGenerator: React.FC<CertificateGeneratorProps> = ({
    name, surname, grade, totalScore, day, prediction, compact = false,
}) => {
    const certificateRef = useRef<HTMLDivElement>(null);
    const [isGenerating, setIsGenerating] = useState(false);
    const [showCertificate, setShowCertificate] = useState(false);

    const currentDate = new Date().toLocaleDateString('th-TH', { year: 'numeric', month: 'long', day: 'numeric' });
    const gs = gradeColors[grade] || gradeColors['B'];
    const thaiDay = dayNames[day] || day;

    const fixColorFunctions = (clone: Document) => {
        clone.querySelectorAll('*').forEach((el) => {
            const cs = window.getComputedStyle(el);
            ['color', 'backgroundColor', 'borderColor', 'fill', 'stroke'].forEach((p) => {
                const v = cs.getPropertyValue(p);
                if (v && (v.includes('lab(') || v.includes('oklch(') || v.includes('oklab(') || v.includes('color('))) {
                    (el as HTMLElement).style.setProperty(p, p === 'color' ? '#ffffff' : 'transparent', 'important');
                }
            });
        });
    };

    const captureCanvas = () => html2canvas(certificateRef.current!, {
        backgroundColor: '#0f172a', logging: false, useCORS: true, scale: 3,
        onclone: (d: Document) => fixColorFunctions(d),
    } as Parameters<typeof html2canvas>[1]);

    const handleDownloadPDF = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await captureCanvas();
            const imgData = canvas.toDataURL('image/png');
            const pdf = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a5' });
            const pw = pdf.internal.pageSize.getWidth(), ph = pdf.internal.pageSize.getHeight();
            const ip = pdf.getImageProperties(imgData);
            const r = ip.width / ip.height, pr = pw / ph;
            const [w, h] = r > pr ? [pw, pw / r] : [ph * r, ph];
            // Fill entire page with dark background to remove white margins
            pdf.setFillColor(15, 23, 42); // #0f172a
            pdf.rect(0, 0, pw, ph, 'F');
            pdf.addImage(imgData, 'PNG', (pw - w) / 2, (ph - h) / 2, w, h);
            pdf.save(`ใบรับรองมงคล-${name}${surname}.pdf`);
        } catch (e) { console.error('PDF error:', e); }
        finally { setIsGenerating(false); }
    };

    const handleDownloadImage = async () => {
        if (!certificateRef.current) return;
        setIsGenerating(true);
        try {
            const canvas = await captureCanvas();
            const a = document.createElement('a');
            a.download = `ใบรับรองมงคล-${name}${surname}.png`;
            a.href = canvas.toDataURL('image/png');
            a.click();
        } catch (e) { console.error('Image error:', e); }
        finally { setIsGenerating(false); }
    };

    // --- Trigger Buttons ---
    if (!showCertificate) {
        if (compact) {
            return (
                <button onClick={() => setShowCertificate(true)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 text-xs font-medium rounded-lg transition-all duration-300 group">
                    <Award className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" />
                    <span>ใบรับรอง</span>
                </button>
            );
        }
        return (
            <button onClick={() => setShowCertificate(true)}
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500/10 to-orange-500/10 hover:from-amber-500/20 hover:to-orange-500/20 border border-amber-500/30 hover:border-amber-500/50 text-amber-400 font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 group">
                <Award className="w-5 h-5 group-hover:scale-110 transition-transform" />
                <span>ออกใบรับรองมงคล</span>
                <Sparkles className="w-4 h-4 animate-pulse" />
            </button>
        );
    }

    // ===== MODAL =====
    // Header = 36px, Buttons = 52px — reserved. Certificate scrolls in the remaining space.
    const HEADER_H = 36;
    const BUTTON_H = 52;

    return (
        <div style={{
            position: 'fixed', inset: 0, zIndex: 100,
            display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            padding: '8px',
            fontFamily: "'Sarabun','Kanit',system-ui,sans-serif",
        }}>
            {/* Backdrop */}
            <div style={{
                position: 'absolute', inset: 0,
                background: 'rgba(0,0,0,0.85)',
                backdropFilter: 'blur(8px)',
            }} onClick={() => setShowCertificate(false)} />

            {/* Certificate Modal — scrollable */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                maxHeight: 'calc(100vh - 60px)',
                overflowY: 'auto',
                overflowX: 'hidden',
                background: '#0c1322',
                borderRadius: '16px 16px 0 0',
                border: '1px solid rgba(245,158,11,0.2)',
                borderBottom: 'none',
                boxShadow: '0 25px 50px rgba(0,0,0,0.5)',
            }}>
                <div style={{ display: 'flex', justifyContent: 'center', padding: '4px' }}>
                    <div ref={certificateRef} style={{
                        width: '340px',
                        background: 'linear-gradient(180deg, #0f172a 0%, #131d2e 100%)',
                        position: 'relative', overflow: 'hidden',
                        fontFamily: "'Sarabun','Kanit',sans-serif",
                        color: '#fff',
                    }}>
                        <div style={{ position: 'absolute', inset: '5px', border: '1px solid rgba(245,158,11,0.2)', borderRadius: '12px', pointerEvents: 'none', zIndex: 1 }} />
                        <div style={{ position: 'absolute', inset: '8px', border: '2px solid rgba(245,158,11,0.4)', borderRadius: '9px', pointerEvents: 'none', zIndex: 1 }} />

                        <div style={{ position: 'relative', zIndex: 10, padding: '16px 18px 14px', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px', marginBottom: '2px' }}>
                                <img src="/icon-192.png" alt="Logo" style={{ width: '20px', height: '20px', borderRadius: '4px', boxShadow: '0 2px 6px rgba(245,158,11,0.3)' }} />
                                <span style={{ fontSize: '13px', fontWeight: 'bold', color: '#fbbf24' }}>NameMongkol</span>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', width: '75%', marginBottom: '10px' }}>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(90deg, transparent, rgba(251,191,36,0.5))' }} />
                                <span style={{ fontSize: '9px', color: '#64748b', letterSpacing: '2px' }}>CERTIFICATE</span>
                                <div style={{ height: '1px', flex: 1, background: 'linear-gradient(270deg, transparent, rgba(251,191,36,0.5))' }} />
                            </div>
                            <div style={{
                                width: 'calc(100% + 36px)', marginLeft: '-18px', marginRight: '-18px',
                                padding: '8px 18px',
                                background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.08), transparent)',
                                borderTop: '1px solid rgba(245,158,11,0.2)',
                                borderBottom: '1px solid rgba(245,158,11,0.2)',
                                textAlign: 'center', marginBottom: '10px',
                            }}>
                                <p style={{ fontSize: '8px', color: '#475569', margin: '0 0 1px', letterSpacing: '2px' }}>ขอรับรองว่า</p>
                                <h2 style={{
                                    fontSize: '18px', fontWeight: 'bold', color: '#fcd34d',
                                    textShadow: '0 1px 6px rgba(252,211,77,0.2)',
                                    margin: '0 0 2px', lineHeight: 1.3,
                                }}>{name} {surname}</h2>
                                <p style={{ fontSize: '8px', color: '#94a3b8', margin: 0 }}>
                                    เกิดวัน<span style={{ color: '#fbbf24', fontWeight: 'bold', margin: '0 2px' }}>{thaiDay}</span> • วิเคราะห์ตามหลักโหราศาสตร์ไทย
                                </p>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                                <div style={{
                                    width: '48px', height: '48px', borderRadius: '50%', flexShrink: 0,
                                    background: `linear-gradient(135deg, ${gs.bg1}, ${gs.bg2})`,
                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                    boxShadow: `0 0 14px ${gs.glow}, 0 2px 6px rgba(0,0,0,0.3)`,
                                    border: '2px solid rgba(255,255,255,0.15)',
                                }}>
                                    <span style={{ fontSize: '20px', fontWeight: 900, color: gs.text }}>{grade}</span>
                                </div>
                                <div style={{ textAlign: 'left' }}>
                                    <p style={{ fontSize: '8px', color: '#475569', margin: '0 0 0px', letterSpacing: '1px' }}>ระดับ</p>
                                    <p style={{ fontSize: '12px', fontWeight: 'bold', color: '#e2e8f0', margin: '0 0 1px' }}>{prediction.level}</p>
                                    <p style={{ fontSize: '16px', fontWeight: 'bold', color: '#fbbf24', margin: 0, lineHeight: 1 }}>
                                        {totalScore} <span style={{ fontSize: '9px', color: '#64748b', fontWeight: 'normal' }}>ผลรวมชื่อสกุล</span>
                                    </p>
                                </div>
                            </div>
                            {(() => {
                                const pairs = analyzePairs(name);
                                return pairs.length > 0 ? (
                                    <div style={{
                                        display: 'flex', flexWrap: 'wrap', gap: '3px', alignItems: 'center', justifyContent: 'center',
                                        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)',
                                        borderRadius: '8px', padding: '6px 10px', marginBottom: '10px',
                                    }}>
                                        {pairs.map((p, i) => (
                                            <React.Fragment key={i}>
                                                <span style={{ fontSize: '10px', fontWeight: 'bold', color: '#e2e8f0' }}>{p.pair}</span>
                                                <div style={{
                                                    width: '7px', height: '7px', borderRadius: '50%',
                                                    background: '#10b981',
                                                    boxShadow: '0 0 4px rgba(16,185,129,0.5)',
                                                    flexShrink: 0,
                                                }} />
                                            </React.Fragment>
                                        ))}
                                    </div>
                                ) : null;
                            })()}
                            <div style={{
                                width: 'calc(100% + 36px)', marginLeft: '-18px', marginRight: '-18px',
                                paddingTop: '8px', borderTop: '1px solid rgba(245,158,11,0.15)',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px',
                                paddingBottom: '10px',
                            }}>
                                <span style={{ fontSize: '8px', color: '#475569' }}>ออกเมื่อ {currentDate}</span>
                                <div style={{
                                    display: 'flex', alignItems: 'center', gap: '5px',
                                    padding: '4px 12px', background: 'rgba(245,158,11,0.1)',
                                    borderRadius: '14px', border: '1px solid rgba(245,158,11,0.25)',
                                }}>
                                    <div style={{
                                        width: '16px', height: '16px', borderRadius: '50%',
                                        background: 'linear-gradient(135deg,#f59e0b,#d97706)',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        flexShrink: 0, overflow: 'hidden', boxSizing: 'border-box',
                                    }}>
                                        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path d="M5 12l5 5L19 7" stroke="#fff" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" />
                                        </svg>
                                    </div>
                                    <span style={{ color: '#fbbf24', fontSize: '9px', fontWeight: 'bold' }}>รับรองแล้ว</span>
                                </div>
                                <span style={{ fontSize: '7px', color: '#334155' }}>www.namemongkol.com</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* ===== BUTTON BAR — separate element, always visible below modal ===== */}
            <div style={{
                position: 'relative',
                width: '100%',
                maxWidth: '380px',
                flexShrink: 0,
                padding: '8px',
                display: 'flex',
                gap: '6px',
                alignItems: 'center',
                boxSizing: 'border-box',
                background: '#0c1322',
                borderRadius: '0 0 16px 16px',
                border: '1px solid rgba(245,158,11,0.2)',
                borderTop: '1px solid rgba(245,158,11,0.3)',
            }}>
                <button onClick={handleDownloadPDF} disabled={isGenerating}
                    style={{
                        flex: 1, height: '32px',
                        background: 'linear-gradient(135deg, #f59e0b, #ea580c)',
                        color: '#fff', fontWeight: 'bold', fontSize: '11px',
                        border: 'none', borderRadius: '6px', cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                        boxShadow: '0 2px 8px rgba(245,158,11,0.3)',
                        opacity: isGenerating ? 0.6 : 1,
                    }}>
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Download size={12} />}
                    PDF
                </button>
                <button onClick={handleDownloadImage} disabled={isGenerating}
                    style={{
                        flex: 1, height: '32px',
                        background: '#1e293b',
                        color: '#cbd5e1', fontWeight: 600, fontSize: '11px',
                        border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                        opacity: isGenerating ? 0.6 : 1,
                    }}>
                    {isGenerating ? <Loader2 size={12} className="animate-spin" /> : <Share2 size={12} />}
                    รูปภาพ
                </button>
                <button onClick={() => setShowCertificate(false)}
                    style={{
                        height: '32px', padding: '0 14px',
                        background: '#334155',
                        color: '#94a3b8', fontWeight: 600, fontSize: '11px',
                        border: 'none', borderRadius: '6px', cursor: 'pointer',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '4px',
                        flexShrink: 0,
                    }}>
                    <X size={12} />
                    ปิด
                </button>
            </div>
        </div>
    );
};

export default CertificateGenerator;

