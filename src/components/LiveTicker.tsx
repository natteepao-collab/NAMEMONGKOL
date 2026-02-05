'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { X, CreditCard, Sparkles, Users, TrendingUp, Star, Zap } from 'lucide-react';

interface TickerMessage {
    id: number;
    type: 'topup' | 'analysis' | 'grade' | 'online';
    message: string;
    icon: React.ElementType;
    color: string;
    bgColor: string;
}

// Thai first names for random generation
const thaiNames = [
    'สม', 'วิ', 'ประ', 'พร', 'ศิ', 'อา', 'นิ', 'จิ', 'ชา', 'กิ',
    'ธน', 'พิ', 'สุ', 'รัต', 'มน', 'ภา', 'อัค', 'ณัฐ', 'กา', 'ปา'
];

const englishInitials = ['A', 'B', 'C', 'D', 'K', 'M', 'N', 'P', 'S', 'T', 'W'];

const grades = ['A+', 'A', 'A', 'B+', 'A+'];
const amounts = [29, 59, 99, 199, 299, 499];

const getRandomName = (): string => {
    const useEnglish = Math.random() > 0.6;
    if (useEnglish) {
        return englishInitials[Math.floor(Math.random() * englishInitials.length)] + '***';
    }
    return thaiNames[Math.floor(Math.random() * thaiNames.length)] + '***';
};

const getRandomAmount = (): number => {
    return amounts[Math.floor(Math.random() * amounts.length)];
};

const getRandomGrade = (): string => {
    return grades[Math.floor(Math.random() * grades.length)];
};

const getRandomOnlineCount = (): number => {
    return Math.floor(Math.random() * 20) + 5;
};

const generateMessage = (): TickerMessage => {
    const types: Array<'topup' | 'analysis' | 'grade' | 'online'> = ['topup', 'analysis', 'grade', 'online'];
    const weights = [0.3, 0.3, 0.3, 0.1]; // Probability weights
    
    const random = Math.random();
    let type: 'topup' | 'analysis' | 'grade' | 'online' = 'analysis';
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
        case 'topup':
            return {
                id,
                type,
                message: `คุณ ${getRandomName()} เพิ่งเติมเครดิต ${getRandomAmount()} บาท`,
                icon: CreditCard,
                color: 'text-emerald-400',
                bgColor: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
            };
        case 'analysis':
            return {
                id,
                type,
                message: `คุณ ${getRandomName()} กำลังวิเคราะห์ชื่อมงคล`,
                icon: Sparkles,
                color: 'text-amber-400',
                bgColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
            };
        case 'grade':
            const grade = getRandomGrade();
            return {
                id,
                type,
                message: `คุณ ${getRandomName()} ได้ชื่อมงคลระดับ ${grade}`,
                icon: grade === 'A+' ? Star : TrendingUp,
                color: grade === 'A+' ? 'text-yellow-400' : 'text-blue-400',
                bgColor: grade === 'A+' 
                    ? 'from-yellow-500/20 to-amber-500/20 border-yellow-500/30'
                    : 'from-blue-500/20 to-cyan-500/20 border-blue-500/30',
            };
        case 'online':
            return {
                id,
                type,
                message: `มี ${getRandomOnlineCount()} คนกำลังใช้งานอยู่ขณะนี้`,
                icon: Users,
                color: 'text-purple-400',
                bgColor: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
            };
        default:
            return {
                id,
                type: 'analysis',
                message: `คุณ ${getRandomName()} กำลังวิเคราะห์ชื่อมงคล`,
                icon: Sparkles,
                color: 'text-amber-400',
                bgColor: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
            };
    }
};

export const LiveTicker: React.FC = () => {
    const [currentMessage, setCurrentMessage] = useState<TickerMessage | null>(null);
    const [isVisible, setIsVisible] = useState(false);
    const [isDismissed, setIsDismissed] = useState(false);

    const showNextMessage = useCallback(() => {
        if (isDismissed) return;
        
        const newMessage = generateMessage();
        setCurrentMessage(newMessage);
        setIsVisible(true);

        // Hide after 4 seconds
        setTimeout(() => {
            setIsVisible(false);
        }, 4000);
    }, [isDismissed]);

    useEffect(() => {
        // Initial delay before first message (3-6 seconds)
        const initialDelay = Math.random() * 3000 + 3000;
        
        const initialTimeout = setTimeout(() => {
            showNextMessage();
        }, initialDelay);

        return () => clearTimeout(initialTimeout);
    }, [showNextMessage]);

    useEffect(() => {
        if (isDismissed) return;

        // Show new message every 8-15 seconds
        const interval = setInterval(() => {
            const delay = Math.random() * 7000 + 8000;
            setTimeout(showNextMessage, delay);
        }, 12000);

        return () => clearInterval(interval);
    }, [showNextMessage, isDismissed]);

    const handleDismiss = () => {
        setIsVisible(false);
        setIsDismissed(true);
    };

    if (!currentMessage || isDismissed) return null;

    const IconComponent = currentMessage.icon;

    return (
        <div
            className={`fixed bottom-20 left-4 lg:left-[380px] z-40 transition-all duration-500 ease-out ${
                isVisible
                    ? 'opacity-100 translate-x-0 translate-y-0'
                    : 'opacity-0 -translate-x-4 translate-y-2'
            }`}
        >
            <div
                className={`relative flex items-center gap-3 px-4 py-3 rounded-xl bg-gradient-to-r ${currentMessage.bgColor} border backdrop-blur-md shadow-xl max-w-xs sm:max-w-sm`}
            >
                {/* Pulse Effect */}
                <div className="absolute -left-1 -top-1 w-3 h-3">
                    <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75 animate-ping" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                </div>

                {/* Icon */}
                <div className={`shrink-0 p-2 rounded-lg bg-slate-900/50 ${currentMessage.color}`}>
                    <IconComponent className="w-4 h-4" />
                </div>

                {/* Message */}
                <p className="text-sm text-slate-200 font-medium leading-tight pr-6">
                    {currentMessage.message}
                </p>

                {/* Close Button */}
                <button
                    onClick={handleDismiss}
                    className="absolute top-1 right-1 p-1 text-slate-400 hover:text-white transition-colors rounded-full hover:bg-white/10"
                    aria-label="ปิด"
                >
                    <X className="w-3 h-3" />
                </button>

                {/* Time indicator */}
                <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-slate-700/50 rounded-b-xl overflow-hidden">
                    <div
                        className={`h-full ${currentMessage.color.replace('text-', 'bg-')} transition-all duration-[4000ms] ease-linear`}
                        style={{
                            width: isVisible ? '0%' : '100%',
                        }}
                    />
                </div>
            </div>
        </div>
    );
};

export default LiveTicker;
