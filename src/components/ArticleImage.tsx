'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

interface ArticleImageProps {
    src?: string;
    alt: string;
    priority?: boolean;
    className?: string;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ src, alt, priority = false, className }) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div className={`w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 relative overflow-hidden transition-transform duration-500 ${className || 'group-hover:scale-105'}`}>
                <BookOpen size={32} className="opacity-50" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
        );
    }

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            className={`object-cover transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
            sizes="(max-width: 768px) 100vw, 33vw"
            onError={() => setError(true)}
            unoptimized={src.startsWith('http')}
        />
    );
};
