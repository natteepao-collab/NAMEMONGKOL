'use client';

import React from 'react';
import Image from 'next/image';
import { ImageEnlargeModal } from './ImageEnlargeModal';

export const ComparisonSection = () => {
    const [isOpen, setIsOpen] = React.useState(false);

    return (
        <section className="w-full max-w-5xl mx-auto px-4 py-16 relative z-10">
            <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
                ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์
            </h2>

            <figure className="overflow-hidden rounded-2xl border border-slate-700 shadow-2xl bg-slate-900/60 backdrop-blur-sm">
                <button
                    type="button"
                    onClick={() => setIsOpen(true)}
                    className="block w-full cursor-zoom-in"
                    aria-label="คลิกเพื่อดูภาพตารางเปรียบเทียบแบบขยาย"
                >
                    <Image
                        src="/images/articles/ฟีเจอร์การวิเคราะห์.png"
                        alt="ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์ชื่อมงคล ระหว่างเว็บไซต์ทั่วไปกับ NameMongkol"
                        width={998}
                        height={484}
                        className="h-auto w-full object-cover"
                        priority
                    />
                </button>
                <figcaption className="border-t border-slate-700/60 bg-slate-950/60 px-4 py-3 text-sm text-slate-400 md:px-6">
                    ภาพสรุปความแตกต่างของฟีเจอร์วิเคราะห์ชื่อมงคล ระหว่างเว็บไซต์ทั่วไปและ NameMongkol
                </figcaption>
            </figure>

            <ImageEnlargeModal
                isOpen={isOpen}
                src="/images/articles/ฟีเจอร์การวิเคราะห์.png"
                alt="ตารางเปรียบเทียบฟีเจอร์การวิเคราะห์ชื่อมงคล ระหว่างเว็บไซต์ทั่วไปกับ NameMongkol"
                onClose={() => setIsOpen(false)}
            />
        </section>
    );
};
