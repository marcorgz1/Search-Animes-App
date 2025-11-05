import { FlameKindling, Filter, Search } from 'lucide-react';
import AnimeCard from '../components/AnimeCard.tsx';

function Animes ({ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre, genres, loading, filteredAnime }) {
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="relative">
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          {/* Mostrar estado cargando si aún no se han obtenido los animes */}
          {loading ? (
            <div className="flex items-center justify-center min-h-[400px]">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-purple-500"></div>
            </div>
          ) : filteredAnime.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-slate-400 text-lg">No anime found matching your criteria.</p>
            </div>
          ) : (
            <section>
              <div className="mb-12">
                <h2 className="flex justify-center items-center gap-4 text-2xl font-bold text-white">
                  {selectedGenre === 'all' ? 'Todos los animes' : selectedGenre}
                  <span className="text-slate-400 font-normal text-sm">
                    ({filteredAnime.length} {filteredAnime.length === 1 ? 'encontrado' : 'encontrados'})
                  </span>
                </h2>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {filteredAnime.map((item) => (
                  <AnimeCard key={item.id} anime={item} />
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
    )
};

export default Animes;
