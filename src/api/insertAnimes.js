import { createClient } from '@supabase/supabase-js';
import 'dotenv/config';

const supabaseUrl = process.env.VITE_SUPABASE_URL;
const supabaseApiKey = process.env.VITE_SUPABASE_SERVICE_KEY;

console.log('Supabase URL:', supabaseUrl);
console.log('Supabase API Key:', supabaseApiKey);

if (!supabaseUrl || !supabaseApiKey) {
  throw new Error('Missing Supabase environment variables');
};

export const supabase = createClient(supabaseUrl, supabaseApiKey);

// URL base de la API de Jikan
const JIKAN_API = 'https://api.jikan.moe/v4';

// Función para esperar entre peticiones (Jikan tiene rate limit)
const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

// Función para obtener el género principal
function getMainGenre(genres) {
  if (!genres || genres.length === 0) return 'Unknown';
  
  const mainGenres = ['Action', 'Adventure', 'Comedy', 'Drama', 'Fantasy', 'Horror', 
    'Mystery', 'Romance', 'Sci-Fi', 'Slice of Life', 'Sports', 'Supernatural'];
  
  const genreNames = genres.map(g => g.name);
  
  for (const genre of mainGenres) {
    if (genreNames.includes(genre)) {
      return genre;
    }
  }
  
  return genres[0].name;
}

// Función para obtener top animes
const fetchTopAnimes = async (limit = 10) => {
  try {
    console.log(`🔍 Fetching top ${limit} anime from Jikan API...`);
    
    const animes = [];
    let page = 1;
    
    while (animes.length < limit) {
      const response = await fetch(`${JIKAN_API}/top/anime?page=${page}&limit=25`);
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      
      for (const anime of data.data) {
        if (animes.length >= limit) break;
        
        console.log(`📺 Processing: ${anime.title} (${anime.score || 'N/A'}⭐)`);
        
        const animeData = {
          name: anime.title,
          description: anime.synopsis?.slice(0, 500) || 'No description available',
          genre: getMainGenre(anime.genres),
          rating: anime.score || 0,
          episodes: anime.episodes || 12,
          cover: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
          status: anime.status === 'Finished Airing' ? 'finished' : 'inProgress'
        };
        
        animes.push(animeData);
      }
      
      // Verificar si hay más páginas
      if (!data.pagination?.has_next_page || animes.length >= limit) {
        break;
      }
      
      page++;
      
      // Esperar 1 segundo entre peticiones (rate limit de Jikan)
      console.log('⏳ Waiting to avoid rate limit...');
      await sleep(1000);
    }
    
    return animes;
  } catch (error) {
    console.error('Error fetching from Jikan API:', error);
    throw error;
  }
}

// Función para verificar si un anime ya existe
const checkExistingAnime = async (name) => {
  const { data, error } = await supabase
    .from('anime')
    .select('id, name')
    .eq('name', name)
    .single();
  
  return data !== null;
}

// Función para insertar en Supabase
async function insertAnimesToSupabase(animes, skipDuplicates = true) {
  try {
    console.log(`\n📤 Preparing to insert ${animes.length} animes into Supabase...`);
    
    let inserted = 0;
    let skipped = 0;
    
    for (const anime of animes) {
      if (skipDuplicates) {
        const exists = await checkExistingAnime(anime.name);
        
        if (exists) {
          console.log(`⏭️  Skipping "${anime.name}" (already exists)`);
          skipped++;
          continue;
        }
      }
      
      const { data, error } = await supabase
        .from('anime')
        .insert([anime])
        .select();
      
      if (error) {
        console.error(`❌ Error inserting "${anime.name}":`, error.message);
      } else {
        console.log(`✅ Inserted: ${anime.name}`);
        inserted++;
      }
    }
    
    console.log(`\n📊 Summary:`);
    console.log(`   ✅ Inserted: ${inserted}`);
    console.log(`   ⏭️  Skipped: ${skipped}`);
    console.log(`   ❌ Failed: ${animes.length - inserted - skipped}`);
    
    return { inserted, skipped };
  } catch (error) {
    console.error('Error inserting to Supabase:', error);
    throw error;
  }
}

// Función para buscar animes por género
async function fetchAnimesByGenre(genreId, limit = 10) {
  try {
    console.log(`🔍 Fetching anime with genre ID ${genreId}...`);
    
    const response = await fetch(`${JIKAN_API}/anime?genres=${genreId}&order_by=score&sort=desc&limit=${limit}`);
    
    if (!response.ok) {
      throw new Error(`API error: ${response.status}`);
    }
    
    const data = await response.json();
    const animes = [];
    
    for (const anime of data.data) {
      console.log(`📺 Processing: ${anime.title}`);
      
      const animeData = {
        name: anime.title,
        description: anime.synopsis?.slice(0, 500) || 'No description available',
        genre: getMainGenre(anime.genres),
        rating: anime.score || 0,
        episodes: anime.episodes || 12,
        cover: anime.images?.jpg?.large_image_url || anime.images?.jpg?.image_url || '',
        status: anime.status === 'Finished Airing' ? 'finished' : 'inProgress'
      };
      
      animes.push(animeData);
    }
    
    return animes;
  } catch (error) {
    console.error('Error fetching from Jikan API:', error);
    throw error;
  }
}

// Función principal
async function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0] || 'top';
    
    console.log('🚀 Starting anime import script...\n');
    
    let animes = [];
    
    switch (command) {
      case 'top':
        const limit = parseInt(args[1]) || 25;
        animes = await fetchTopAnimes(limit);
        break;
        
      case 'genre':
        const genreId = parseInt(args[1]);
        const genreLimit = parseInt(args[2]) || 10;
        
        if (!genreId) {
          console.error('❌ Please provide a genre ID');
          console.log('\nGenre IDs:');
          console.log('  1: Action, 2: Adventure, 4: Comedy, 8: Drama');
          console.log('  10: Fantasy, 22: Romance, 24: Sci-Fi, 36: Slice of Life');
          console.log('  30: Sports, 37: Supernatural');
          process.exit(1);
        }
        
        animes = await fetchAnimesByGenre(genreId, genreLimit);
        break;
        
      default:
        console.log('Usage:');
        console.log('  node import-animes.js top [limit]');
        console.log('  node import-animes.js genre [genreId] [limit]');
        process.exit(1);
    }
    
    if (animes.length === 0) {
      console.log('⚠️  No animes found');
      return;
    }
    
    await insertAnimesToSupabase(animes, true);
    
    console.log('\n🎉 Import completed successfully!');
  } catch (error) {
    console.error('💥 Fatal error:', error);
    process.exit(1);
  }
}

main();
