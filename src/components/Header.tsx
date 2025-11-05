import { FlameKindling, Filter, Search } from 'lucide-react';

function Header ({ searchQuery, setSearchQuery, selectedGenre, setSelectedGenre, genres }) {
    return (
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
    )
};

export default Header;
