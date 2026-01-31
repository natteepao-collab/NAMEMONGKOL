'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { BookOpen } from 'lucide-react';

interface ArticleImageProps {
    src?: string;
    alt: string;
    priority?: boolean;
    className?: string;
    /** Width hint for srcset optimization */
    width?: number;
    /** Height hint for srcset optimization */
    height?: number;
}

export const ArticleImage: React.FC<ArticleImageProps> = ({ 
    src, 
    alt, 
    priority = false, 
    className,
    width,
    height 
}) => {
    const [error, setError] = useState(false);

    if (!src || error) {
        return (
            <div 
                className={`w-full h-full flex items-center justify-center bg-slate-800 text-slate-600 relative overflow-hidden transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
                role="img"
                aria-label={alt || 'ไม่พบรูปภาพ'}
            >
                <BookOpen size={32} className="opacity-50" aria-hidden="true" />
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent"></div>
            </div>
        );
    }

    // Determine if external URL
    const isExternal = src.startsWith('http');

    return (
        <Image
            src={src}
            alt={alt}
            fill
            priority={priority}
            loading={priority ? 'eager' : 'lazy'}
            className={`object-cover transition-transform duration-500 ${className || 'group-hover:scale-105'}`}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            onError={() => setError(true)}
            unoptimized={isExternal}
            quality={85}
        />
    );
};
