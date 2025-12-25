'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, Facebook, Eye, EyeOff, Loader2 } from 'lucide-react';

export default function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        console.log('Login with:', email, password);
        setIsLoading(false);
    };

    return (
        <div className="min-h-screen bg-[#0f172a] text-slate-100 font-sans selection:bg-amber-500 selection:text-white relative overflow-hidden flex items-center justify-center p-4">
            {/* Background Decor */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className="absolute top-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-[120px]"></div>
                <div className="absolute bottom-[-10%] left-[-10%] w-[500px] h-[500px] bg-amber-600/10 rounded-full blur-[120px]"></div>
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="bg-white/[0.03] border border-white/10 rounded-2xl backdrop-blur-xl p-8 shadow-2xl">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-amber-200 via-white to-amber-200 mb-2">
                            เข้าสู่ระบบ
                        </h1>
                        <p className="text-slate-400 text-sm">
                            ยินดีต้อนรับกลับเข้าสู่ระบบ
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">อีเมล</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Mail className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="block w-full pl-11 pr-4 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="name@example.com"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-sm font-medium text-slate-300 ml-1">รหัสผ่าน</label>
                            <div className="relative group">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-slate-500 group-focus-within:text-amber-400 transition-colors" />
                                </div>
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="block w-full pl-11 pr-12 py-3 bg-black/20 border border-white/10 rounded-xl text-slate-100 placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                    placeholder="••••••••"
                                    required
                                    disabled={isLoading}
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-500 hover:text-slate-300 transition-colors focus:outline-none"
                                    disabled={isLoading}
                                >
                                    {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                                </button>
                            </div>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <label className="flex items-center gap-2 cursor-pointer group">
                                <input type="checkbox" className="w-4 h-4 rounded border-white/10 bg-white/5 text-amber-500 focus:ring-amber-500 focus:ring-offset-0" disabled={isLoading} />
                                <span className="text-slate-400 group-hover:text-slate-300 transition-colors">จดจำฉัน</span>
                            </label>
                            <a href="#" className="text-amber-400 hover:text-amber-300 transition-colors pointer-events-auto">ลืมรหัสผ่าน?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold rounded-xl shadow-lg shadow-amber-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed disabled:active:scale-100"
                        >
                            {isLoading ? (
                                <>
                                    <Loader2 className="w-5 h-5 animate-spin" />
                                    <span>กำลังเข้าสู่ระบบ...</span>
                                </>
                            ) : (
                                <>
                                    <span>เข้าสู่ระบบ</span>
                                    <ArrowRight className="w-5 h-5" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="relative my-8">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-white/10"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-4 text-slate-500 bg-[#0f172a]/50 backdrop-blur-sm">หรือเข้าสู่ระบบด้วย</span>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <button className="w-full py-3 px-4 bg-white text-slate-900 font-medium rounded-xl hover:bg-slate-100 active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
                            <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M23.52 12.29C23.52 11.43 23.44 10.71 23.3 10.05H12V14.53H18.57C18.3 16.08 17.38 17.5 15.93 18.53V21.75H19.75C21.99 19.66 23.52 16.47 23.52 12.29Z" fill="#4285F4" />
                                <path d="M12 24C15.24 24 17.96 22.92 19.98 21.05L16.2 17.7C15.09 18.45 13.67 18.9 12 18.9C8.84 18.9 6.16 16.71 5.2 13.8L1.35 16.79C3.36 20.9 7.42 24 12 24Z" fill="#34A853" />
                                <path d="M5.21 13.8C4.95 12.98 4.79 12.11 4.79 11.99C4.79 11.1 4.93 10.23 5.19 9.4L1.35 6.42C0.49 8.13 0 10.02 0 11.99C0 14.12 0.53 16.14 1.48 17.97L5.21 13.8Z" fill="#FBBC05" />
                                <path d="M12 5.1C14.33 5.1 15.91 6.11 16.8 6.96L20.08 3.73C18.06 1.84 15.34 0 12 0C7.42 0 3.36 3.1 1.35 7.21L5.2 10.2C6.16 7.28 8.84 5.1 12 5.1Z" fill="#EA4335" />
                            </svg>
                            <span>ดำเนินการต่อด้วย Google</span>
                        </button>
                        <button className="w-full py-3 px-4 bg-[#1877F2] hover:bg-[#166fe5] text-white font-medium rounded-xl active:scale-[0.98] transition-all flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed" disabled={isLoading}>
                            <Facebook className="w-5 h-5 fill-current" />
                            <span>ดำเนินการต่อด้วย Facebook</span>
                        </button>
                    </div>

                    <div className="mt-8 text-center text-sm text-slate-400">
                        ยังไม่มีบัญชีใช่ไหม?{' '}
                        <Link href="/register" className={`text-amber-400 hover:text-amber-300 font-medium transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}>
                            สมัครสมาชิก
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
