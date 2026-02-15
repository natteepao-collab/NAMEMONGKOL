'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Users, TrendingUp, Star, Zap } from 'lucide-react';
import { auspiciousNames } from '@/data/auspiciousNames';

interface TickerMessage {
    id: number;
    type: 'analysis' | 'grade' | 'online';
    message: string;
    icon: React.ElementType;
    color: string;
}

const grades = ['A+', 'A', 'A', 'B+', 'A+'];

const getRandomName = (): string => {
    // Pick a random name from the real data
    const name = auspiciousNames[Math.floor(Math.random() * auspiciousNames.length)];
    // Mask the last few characters for privacy/mystery
    if (name.length > 2) {
        return name.substring(0, Math.ceil(name.length * 0.6)) + '***';
    }
    return name + '***';
};

const getRandomGrade = (): string => {
    return grades[Math.floor(Math.random() * grades.length)];
};

const getRandomOnlineCount = (): number => {
    return Math.floor(Math.random() * 20) + 5;
};

const generateMessage = (): TickerMessage => {
    const types: Array<'analysis' | 'grade' | 'online'> = ['analysis', 'grade', 'online'];
    const weights = [0.5, 0.3, 0.2]; // Increased probability for analysis

    const random = Math.random();
    let type: 'analysis' | 'grade' | 'online' = 'analysis';
    let cumulative = 0;

    for (let i = 0; i < types.length; i++) {
        cumulative += weights[i];
        if (random <= cumulative) {
            type = types[i];
            break;
        }
    }

    const id = Date.now() + Math.random();

    switch (type) {
        case 'analysis':
            return {
                id,
                type,
                message: `คุณ ${getRandomName()} กำลังวิเคราะห์ชื่อ`,
                icon: Sparkles,
                color: 'text-amber-500',
            };
        case 'grade':
            const grade = getRandomGrade();
            return {
                id,
                type,
                message: `คุณ ${getRandomName()} ได้ชื่อระดับ ${grade}`,
                icon: grade === 'A+' ? Star : TrendingUp,
                color: grade === 'A+' ? 'text-yellow-500' : 'text-blue-500',
            };
        case 'online':
            return {
                id,
                type,
                message: `${getRandomOnlineCount()} คนกำลังใช้งาน`,
                icon: Users,
                color: 'text-emerald-500',
            };
        default:
            return {
                id,
                type: 'analysis',
                message: `คุณ ${getRandomName()} กำลังวิเคราะห์ชื่อ`,
                icon: Sparkles,
                color: 'text-amber-500',
            };
    }
};

export const LiveTicker: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState<TickerMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isClient, setIsClient] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    const showNextMessage = useCallback(() => {
        if (isDismissed) return;

        const newMessage = generateMessage();
        setCurrentMessage(newMessage);
        setIsVisible(true);

        // Hide after 3.5 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 3500);
    }, [isDismissed]);

    useEffect(() => {
        if (!isClient || isDismissed) return;

        // Initial delay
        const initialDelay = Math.random() * 2000 + 1000;
        const initialTimeout = setTimeout(showNextMessage, initialDelay);

        // Periodic updates
        const interval = setInterval(() => {
            if (isDismissed) return;
            const delay = Math.random() * 5000 + 4000; // More frequent: 4-9s delay
            setTimeout(showNextMessage, delay);
        }, 10000); // Check every 10s

        return () => {
            clearTimeout(initialTimeout);
            clearInterval(interval);
        };
    }, [showNextMessage, isClient, isDismissed]);

    const handleDismiss = (e: React.MouseEvent) => {
        e.stopPropagation();
        setIsVisible(false);
        setTimeout(() => setIsDismissed(true), 300); // Wait for animation
    };

    if (!isClient || !currentMessage || isDismissed) return null;

    const IconComponent = currentMessage.icon;

    return (
        <div
            className={`fixed bottom-24 lg:bottom-8 left-1/2 -translate-x-1/2 lg:left-8 lg:translate-x-0 z-50 transition-all duration-500 ease-out ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
                }`}
        >
            <div className="relative flex items-center gap-3 px-4 py-2.5 rounded-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-md shadow-lg border border-slate-200/50 dark:border-slate-700/50 pr-12">
                {/* Icon */}
                <div className={`shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-800 ${currentMessage.color}`}>
                    <IconComponent className="w-3.5 h-3.5" />
                </div>

                {/* Message */}
                <span className="text-sm text-slate-600 dark:text-slate-300 font-medium whitespace-nowrap">
                    {currentMessage.message}
                </span>

                {/* Live Indicator */}
                <span className="relative flex h-2 w-2 ml-1">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>

                {/* Close Button - White X on subtle background */}
                <button
                    onClick={handleDismiss}
                    className="absolute right-2 top-1/2 -translate-y-1/2 p-1 rounded-full bg-slate-400/80 hover:bg-slate-500 text-white transition-colors"
                    aria-label="Close"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 6 6 18" />
                        <path d="m6 6 18 18" />
                    </svg>
                </button>
            </div>
        </div>
    );
};

export default LiveTicker;

