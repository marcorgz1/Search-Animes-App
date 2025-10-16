import { useEffect, useState } from 'react';
import { FlameKindling, Filter, Search } from 'lucide-react';
import { supabase, type Anime } from './lib/supabase.ts';
import './App.css';
import AnimeCard from './components/AnimeCard.tsx';

function App() {
  // Estado que almacena los animes existentes
  const [animes, setAnimes] = useState<Anime[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchAnimes = async () => {
    try {
      const { data, error } = await supabase
      .from('anime')
      .select('*');

      console.log('Animes data:', data);

      setAnimes(data || []);

      if (error) {
        console.error('Error al obtener los datos:', error.message);
      }
    } catch (err) {
      console.error('Error obteniendo los datos del anime:', err);
    } finally {
      setLoading(false);
    }
    
  };
    // Extraer todos los géneros de anime de los animes existentes
    const genres = ['all', ...Array.from(new Set(animes.map(anime => anime.genre)))];
  
    const filteredAnime = animes.filter(anime => {
      // Filtrar animes por su género
      const matchesGenre = selectedGenre === 'all' || anime.genre === selectedGenre;
      // Filtrar animes por el contenido del texto
      const matchesSearch = anime.name.toLowerCase().includes(searchQuery.toLowerCase()) || anime.description.toLowerCase().includes(searchQuery.toLowerCase());
      // Devolver los animes filtrados por el género y el contenido de su texto
      return matchesGenre && matchesSearch;
  });

  useEffect(() => {
    fetchAnimes()
  }, [])


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSAxMCAwIEwgMCAwIDAgMTAiIGZpbGw9Im5vbmUiIHN0cm9rZT0id2hpdGUiIHN0cm9rZS1vcGFjaXR5PSIwLjAzIiBzdHJva2Utd2lkdGg9IjEiLz48L3BhdHRlcm4+PC9kZWZzPjxyZWN0IHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiIGZpbGw9InVybCgjZ3JpZCkiLz48L3N2Zz4=')] opacity-40" />

      <div className="relative">
        <header className="bg-slate-900/50 backdrop-blur-md border-b border-slate-700/50 sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-gradient-to-br from-blue-900 to-purple-500 p-3 rounded-xl">
                <FlameKindling className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-4xl font-bold text-white tracking-tight">
                  Anime<span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-900 to-purple-500">Hub</span>
                </h1>
                <p className="text-slate-400 text-sm mt-1 ml-2">Descubre tu siguiente anime favorito</p>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search anime..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent transition-all"
                />
              </div>

              <div className="relative">
                <Filter className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 pointer-events-none" />
                <select
                  value={selectedGenre}
                  onChange={(e) => setSelectedGenre(e.target.value)}
                  className="pl-11 pr-10 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-800 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[160px]"
                >
                  {genres.map(genre => (
                    <option key={genre} value={genre}>
                      {genre === 'all' ? 'Todos' : genre}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>
        </header>

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
}

export default App;
