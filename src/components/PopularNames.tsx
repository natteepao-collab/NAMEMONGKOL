import { Sparkles, TrendingUp, Star } from 'lucide-react';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabase';
import { calculateScore } from '@/utils/numerologyUtils';
import { analyzeNameSuitability } from '@/utils/thaksaUtils';

interface NameItem {
  name: string;
  gender: string;
}

export default function PopularNames() {
  const [popular, setPopular] = useState<{ name: string; score: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopular = async () => {
      setLoading(true);
      try {
          // ดึงข้อมูลจำนวนมากเพื่อนำมาสุ่ม (เผื่อในกรณีที่ order random ไม่ทำงาน)
          const { data, error } = await supabase
            .from('auspicious_names')
            .select('name, gender')
            .limit(2000); 

          if (error) {
              console.error('Error fetching popular names:', error);
              setLoading(false);
              return;
          }

          if (data && data.length > 0) {
              // สุ่มชื่อจากผลลัพธ์
              const shuffled = (data as NameItem[]).sort(() => 0.5 - Math.random());
              
              const processed = shuffled.map((item) => ({
                name: item.name,
                score: calculateScore(item.name),
                suitable: analyzeNameSuitability(item.name).suitable,
              }));

              // พยายามหาชื่อที่ใช้ได้ 8 วันก่อน
              let filtered = processed.filter(item => item.suitable.length === 8);
              
              // ถ้าได้ไม่ถึง 10 ชื่อ ให้ผ่อนปรนเอาชื่อที่ใช้ได้ 7 วัน หรือ 6 วันมาเติมให้ครบ
              if (filtered.length < 10) {
                  filtered = [...filtered, ...processed.filter(item => item.suitable.length === 7)];
              }
              if (filtered.length < 10) {
                  filtered = [...filtered, ...processed.filter(item => item.suitable.length === 6)];
              }

              // คัดให้เหลือ 10 ชื่อตามลำดับ
              const top10 = filtered.slice(0, 10).map(({ name, score }) => ({ name, score }));
              setPopular(top10);
          }
      } catch (err) {
          console.error(err);
      } finally {
          setLoading(false);
      }
    };
    fetchPopular();
  }, []);

  return (
    <section className="mt-8 mb-8 w-full max-w-5xl mx-auto px-4">
      <div className="flex flex-col items-center justify-center mb-10 text-center animate-fade-in">
        <div className="inline-flex items-center justify-center gap-2 px-4 py-1.5 rounded-full border border-amber-500/30 bg-amber-500/10 mb-4 shadow-[0_0_15px_rgba(245,158,11,0.2)] backdrop-blur-sm">
          <TrendingUp className="w-4 h-4 text-amber-400" />
          <span className="text-sm font-semibold tracking-wide text-amber-300">สถิติยอดนิยม</span>
        </div>
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-3 flex flex-wrap items-center justify-center gap-2">
          10 อันดับชื่อมงคลยอดฮิตประจำสัปดาห์
          <Sparkles className="w-6 h-6 text-amber-400" />
        </h2>
        <p className="text-slate-400 text-sm md:text-base max-w-lg mx-auto leading-relaxed">
          อัปเดตรายชื่อมงคลที่มีผู้สนใจมากที่สุด พร้อมผลรวมที่ดีเยี่ยมและสามารถใช้งานได้สำหรับคนเกิดทุกวัน
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center h-48">
          <div className="flex flex-col items-center gap-4">
            <div className="animate-spin rounded-full h-10 w-10 border-t-2 border-b-2 border-amber-500"></div>
            <span className="text-slate-400 text-sm animate-pulse tracking-wide">กำลังจัดเตรียมชื่อมงคล...</span>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-5">
          {popular.map((item, index) => (
            <div 
              key={index + item.name} 
              className="group relative flex flex-col justify-between p-5 rounded-2xl bg-gradient-to-br from-[#1e293b]/80 to-[#0f172a]/80 border border-white/10 hover:border-amber-500/40 hover:bg-[#1e293b] hover:shadow-[0_8px_30px_rgba(245,158,11,0.15)] hover:-translate-y-1.5 transition-all duration-300 cursor-pointer overflow-hidden backdrop-blur-md"
            >
              {/* Ranking Badge */}
              <div className={`absolute top-0 right-0 w-10 h-10 rounded-bl-2xl flex items-center justify-center text-sm font-bold border-b border-l border-white/5 z-10 transition-all duration-300 ${index < 3 ? 'bg-gradient-to-br from-amber-400 to-amber-600 text-black border-amber-500/50 shadow-[-4px_4px_15px_rgba(245,158,11,0.3)]' : 'bg-white/5 text-slate-300 group-hover:bg-white/10'}`}>
                  {index + 1}
              </div>

              <div className="flex flex-col items-center text-center gap-4 pt-4 pb-2 z-10">
                <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-100 to-slate-400 group-hover:from-amber-200 group-hover:to-amber-500 transition-all duration-300 leading-tight">
                    {item.name}
                </span>
                
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-black/40 border border-white/5 group-hover:bg-amber-500/10 group-hover:border-amber-500/30 transition-all duration-300 shadow-inner">
                  <Star className="w-3.5 h-3.5 text-amber-400 group-hover:fill-amber-400 drop-shadow-[0_0_5px_rgba(245,158,11,0.5)] transition-all duration-300" />
                  <span className="text-xs font-semibold text-amber-300">ผลรวม {item.score}</span>
                </div>
              </div>
              
              {/* Decorative Glow */}
              <div className="absolute -bottom-10 -right-10 w-24 h-24 bg-amber-500/10 rounded-full blur-2xl group-hover:bg-amber-500/20 transition-all duration-500"></div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
