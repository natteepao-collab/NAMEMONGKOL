import React, { useState, useRef } from 'react';
import { X, Download, Smartphone, Square, Loader2, Image as ImageIcon } from 'lucide-react';
import html2canvas from 'html2canvas';
import { AnalysisResult } from '@/types';
import { SocialCard } from './SocialCard';
import { motion, AnimatePresence } from 'framer-motion';

interface ImageGeneratorModalProps {
    isOpen: boolean;
    onClose: () => void;
    result: AnalysisResult;
}

export const ImageGeneratorModal: React.FC<ImageGeneratorModalProps> = ({ isOpen, onClose, result }) => {
    const [format, setFormat] = useState<'story' | 'post'>('story');
    const [isGenerating, setIsGenerating] = useState(false);
    const cardRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (!cardRef.current || isGenerating) return;

        setIsGenerating(true);
        try {
            // Wait a moment for any renders or fonts
            await new Promise(resolve => setTimeout(resolve, 500));

            const canvas = await html2canvas(cardRef.current, {
                scale: 2, // Higher resolution
                useCORS: true,
                backgroundColor: '#0f172a',
                fontQuality: 'quality', // Note: specific to some modifications, but standard html2canvas ignores unknown props usually
            } as any);

            const image = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            link.href = image;
            link.download = `namemongkol-${result.totalScore}-${format}.png`;
            link.click();
        } catch (error) {
            console.error('Failed to generate image:', error);
        } finally {
            setIsGenerating(false);
        }
    };

    if (!isOpen) return null;

    return (
        <AnimatePresence>
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onClick={onClose}
                    className="absolute inset-0 bg-black/80 backdrop-blur-sm"
                />

                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: 20 }}
                    className="relative w-full max-w-lg bg-[#1e293b] rounded-2xl border border-white/10 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
                >
                    {/* Header */}
                    <div className="flex items-center justify-between p-4 border-b border-white/5">
                        <div className="flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-amber-500" />
                            <h3 className="text-lg font-semibold text-white">Save as Image</h3>
                        </div>
                        <button
                            onClick={onClose}
                            className="p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                    </div>

                    {/* Preview Area */}
                    <div className="flex-1 overflow-y-auto p-6 bg-[#0f172a]/50 flex items-center justify-center min-h-[300px]">
                        <div className="relative">
                            {/* Visual Preview (Scaled Down) */}
                            <div
                                className="origin-top shadow-2xl rounded-lg overflow-hidden border border-white/10"
                                style={{
                                    transform: 'scale(0.25)', // Scale down the huge card
                                    width: format === 'story' ? 1080 : 1080,
                                    height: format === 'story' ? 1920 : 1080,
                                    marginBottom: format === 'story' ? -1440 : -810, // Compensate space after scaling
                                    marginRight: format === 'story' ? -810 : -810, // Compensate width
                                }}
                            >
                                <SocialCard ref={cardRef} result={result} format={format} />
                            </div>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="p-4 bg-[#1e293b] border-t border-white/5 space-y-4">
                        <div className="flex justify-center gap-2 bg-black/20 p-1 rounded-xl">
                            <button
                                onClick={() => setFormat('story')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${format === 'story'
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Smartphone className="w-4 h-4" />
                                Story (9:16)
                            </button>
                            <button
                                onClick={() => setFormat('post')}
                                className={`flex-1 flex items-center justify-center gap-2 py-2 px-4 rounded-lg text-sm font-medium transition-all ${format === 'post'
                                    ? 'bg-amber-500 text-white shadow-lg'
                                    : 'text-slate-400 hover:text-white hover:bg-white/5'
                                    }`}
                            >
                                <Square className="w-4 h-4" />
                                Post (1:1)
                            </button>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={isGenerating}
                            className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold shadow-lg shadow-amber-500/20 hover:shadow-amber-500/30 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {isGenerating ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    Generating...
                                </>
                            ) : (
                                <>
                                    <Download className="w-5 h-5" />
                                    Download Image
                                </>
                            )}
                        </button>
                    </div>
                </motion.div>
            </div>
        </AnimatePresence>
    );
};
