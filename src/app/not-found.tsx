import { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
    title: 'ไม่พบหน้าที่ต้องการ (404)',
    description: 'ไม่พบหน้าที่คุณกำลังค้นหา กรุณากลับไปหน้าหลักเพื่อวิเคราะห์ชื่อมงคล',
    robots: {
        index: false,
        follow: true,
    },
};

export default function NotFound() {
    return (
        <div className="min-h-screen bg-[#0f172a] flex items-center justify-center px-4">
            <div className="text-center max-w-md">
                <h1 className="text-6xl font-bold text-amber-400 mb-4">404</h1>
                <h2 className="text-2xl font-semibold text-white mb-4">
                    ไม่พบหน้าที่ต้องการ
                </h2>
                <p className="text-slate-400 mb-8">
                    หน้าที่คุณกำลังค้นหาอาจถูกย้ายหรือไม่มีอยู่แล้ว
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <Link
                        href="/"
                        className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 text-white font-semibold rounded-xl hover:from-amber-600 hover:to-orange-600 transition-all"
                    >
                        🏠 กลับหน้าหลัก
                    </Link>
                    <Link
                        href="/search"
                        className="inline-flex items-center justify-center px-6 py-3 bg-slate-700 text-white font-semibold rounded-xl hover:bg-slate-600 transition-all"
                    >
                        🔍 ค้นหาชื่อมงคล
                    </Link>
                </div>
            </div>
        </div>
    );
}
