'use client';

import React from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';

type ImageEnlargeModalProps = {
    isOpen: boolean;
    src: string | null;
    alt: string;
    onClose: () => void;
};

export const ImageEnlargeModal: React.FC<ImageEnlargeModalProps> = ({
    isOpen,
    src,
    alt,
    onClose,
}) => {
    React.useEffect(() => {
        if (!isOpen) {
            return;
        }

        const onKeyDown = (event: KeyboardEvent) => {
            if (event.key === 'Escape') {
                onClose();
            }
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
    }, [isOpen, onClose]);

    if (!src) {
        return null;
    }

    return (
        <AnimatePresence>
            {isOpen ? (
                <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 sm:p-6" role="dialog" aria-modal="true" aria-label="ดูภาพขยาย">
                    <motion.button
                        type="button"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        aria-label="ปิดภาพขยาย"
                        className="absolute inset-0 bg-black/85 backdrop-blur-sm"
                    />

                    <motion.div
                        initial={{ opacity: 0, scale: 0.96, y: 8 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.96, y: 8 }}
                        transition={{ duration: 0.2, ease: 'easeOut' }}
                        className="relative z-10 w-full max-w-6xl"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <button
                            type="button"
                            onClick={onClose}
                            aria-label="ปิดภาพขยาย"
                            className="absolute right-2 top-2 z-20 inline-flex items-center justify-center rounded-full border border-white/20 bg-black/60 p-2 text-white transition-colors hover:bg-black/80"
                        >
                            <X size={20} />
                        </button>

                        <div className="overflow-hidden rounded-2xl border border-white/15 bg-slate-950/80 shadow-2xl">
                            <Image
                                src={src}
                                alt={alt}
                                width={1600}
                                height={1200}
                                className="max-h-[85vh] w-full object-contain"
                                priority
                            />
                        </div>
                    </motion.div>
                </div>
            ) : null}
        </AnimatePresence>
    );
};
