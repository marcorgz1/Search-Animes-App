import { Star, Tv } from 'lucide-react';
import type { Anime } from '../lib/supabase.ts';

interface AnimeCardProps {
    anime: Anime;
}

function AnimeCard ({ anime }: AnimeCardProps) {
    const statusColors = {
        inProgress: 'bg-emerald-500',
        finished: 'bg-blue-500'
    };

    return (
        <div className="group relative bg-slate-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:scale-105">
            <div className="aspect-[3/4] overflow-hidden">
                <img
                    src={anime.cover}
                    alt={anime.name}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/40 to-transparent opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
            </div>

            <div className="absolute top-3 right-3 flex gap-2">
                <span className={`${statusColors[anime.status]} text-white text-xs font-semibold px-3 py-1 rounded-full`}>
                    {anime.status}
                </span>
            </div>

            <div className="p-5">
                <h3 className="text-xl font-bold text-white mb-2 line-clamp-1">
                    {anime.name}
                </h3>

                <div className="flex items-center gap-4 mb-3 text-sm">
                    <div className="flex items-center gap-1 text-amber-400">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="font-semibold">{anime.rating.toFixed(1)}</span>
                    </div>
                    <div className="flex items-center gap-1 text-slate-400">
                        <Tv className="w-4 h-4" />
                        <span>{anime.episodes} eps</span>
                    </div>
                    <span className="text-slate-400 text-xs uppercase tracking-wide">
                        {anime.genre}
                    </span>
                </div>

                <p className="text-slate-400 text-sm line-clamp-3 leading-relaxed">
                    {anime.description}
                </p>
            </div>
        </div>
    )
}

export default AnimeCard;
