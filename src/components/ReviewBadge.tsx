import { Star } from 'lucide-react';

export default function ReviewBadge({ rating = 4.8, count = 512 }: { rating?: number; count?: number }) {
  return (
    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-sm font-medium shadow-sm">
      <Star className="w-4 h-4 text-amber-400" fill="#fbbf24" />
      <span>{rating.toFixed(1)}</span>
      <span className="text-slate-400">/ 5</span>
      <span className="mx-1 text-slate-400">•</span>
      <span className="text-slate-300">{count.toLocaleString()} รีวิว</span>
    </div>
  );
}
