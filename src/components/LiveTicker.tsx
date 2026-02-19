'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { Sparkles, Users, TrendingUp, Star } from 'lucide-react';
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

    const isEnabled = false;

    useEffect(() => {
        if (!isEnabled) return;
        setIsClient(true);
    }, [isEnabled]);

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
        if (!isEnabled || !isClient || isDismissed) return;

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

    if (!isEnabled || !isClient || !currentMessage || isDismissed) return null;

    const IconComponent = currentMessage.icon;

    return (
        <div
            className={`fixed bottom-20 left-1/2 -translate-x-1/2 z-40 transition-all duration-500 ease-out pointer-events-none ${isVisible
                ? 'opacity-100 translate-y-0'
                : 'opacity-0 translate-y-4'
                }`}
        >
            <div className="relative flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/60 backdrop-blur-md shadow-lg border border-white/10">
                {/* Icon */}
                <div className={`shrink-0 flex items-center justify-center w-4 h-4 rounded-full bg-white/10 ${currentMessage.color}`}>
                    <IconComponent className="w-2.5 h-2.5" />
                </div>

                {/* Message */}
                <span className="text-xs text-slate-200 font-medium whitespace-nowrap pr-1">
                    {currentMessage.message}
                </span>

                {/* Live Indicator */}
                <span className="relative flex h-1.5 w-1.5">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
            </div>
        </div>
    );
};

export default LiveTicker;

