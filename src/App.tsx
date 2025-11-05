import { useEffect, useState } from 'react';
import { supabase, type Anime } from './lib/supabase.ts';
import './App.css';
import Animes from './pages/Animes.tsx';
import Header from './components/Header.tsx';

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
    <>  
      <Header 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
        genres={genres} />
      <Animes 
        searchQuery={searchQuery} 
        setSearchQuery={setSearchQuery} 
        selectedGenre={selectedGenre} 
        setSelectedGenre={setSelectedGenre} 
        genres={genres} 
        loading={loading}
        filteredAnime={filteredAnime} />
    </>
  )
}

export default App;
