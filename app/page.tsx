"use client";
import { useState, useEffect } from 'react';
import axios from 'axios';

// 1. TİP TANIMLAMALARI
interface Mood {
  id: string;
  label: string;
  emoji: string;
  genreIds: string;
  desc: string;
  color: string; // Buton rengi için
}

interface Movie {
  id: number;
  title: string;
  overview: string;
  poster_path: string;
  vote_average: number;
  release_date: string;
  trailer_key?: string; // Fragman ID'si (Opsiyonel)
  providers?: {
    logo_path: string;
    provider_name: string;
  }[];
}

// AYARLAR
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY; // <-- ANAHTARINI BURAYA YAPIŞTIR
const BASE_URL = 'https://api.themoviedb.org/3';

// Geliştirilmiş Mood Listesi
const MOODS: Mood[] = [
  {
    id: 'bored',
    label: '😤 Sıkıldım',
    emoji: '🔥',
    genreIds: '28,12',
    desc: 'Adrenalin ve Aksiyon',
    color: 'from-red-500 to-orange-500'
  },
  {
    id: 'sad',
    label: '😢 Hüzünlüyüm',
    emoji: '🍫',
    genreIds: '35,10751',
    desc: 'Komedi ve Aile',
    color: 'from-blue-400 to-cyan-300'
  },
  {
    id: 'chill',
    label: '😌 Sakin',
    emoji: '🌿',
    genreIds: '99,36,18',
    desc: 'Drama ve Belgesel',
    color: 'from-green-400 to-emerald-600'
  },
  {
    id: 'scared',
    label: '😱 Korkut Beni',
    emoji: '👻',
    genreIds: '27,53',
    desc: 'Korku ve Gerilim',
    color: 'from-purple-600 to-indigo-900'
  },
  {
    id: 'curious',
    label: '🤔 Meraklı',
    emoji: '🚀',
    genreIds: '878,9648',
    desc: 'Bilim Kurgu ve Gizem',
    color: 'from-indigo-400 to-purple-500'
  }
];

export default function Home() {
  const [activeMood, setActiveMood] = useState<Mood | null>(null);
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [savedMovies, setSavedMovies] = useState<Movie[]>([]);

  // Sayfa açıldığında LocalStorage'dan kayıtlı filmleri çek
  useEffect(() => {
    const saved = localStorage.getItem('myWatchlist');
    if (saved) {
      setSavedMovies(JSON.parse(saved));
    }
  }, []);

  // Listeye Ekle / Çıkar
  const toggleSaveMovie = (movieToSave: Movie) => {
    let newSavedList = [];
    const exists = savedMovies.find(m => m.id === movieToSave.id);

    if (exists) {
      newSavedList = savedMovies.filter(m => m.id !== movieToSave.id);
    } else {
      newSavedList = [...savedMovies, movieToSave];
    }

    setSavedMovies(newSavedList);
    localStorage.setItem('myWatchlist', JSON.stringify(newSavedList));
  };

  const fetchMovie = async (mood: Mood) => {
    setLoading(true);
    setActiveMood(mood);
    setMovie(null);

    try {
      // 1. FİLMİ BUL
      const response = await axios.get(`${BASE_URL}/discover/movie`, {
        params: {
          api_key: API_KEY,
          with_genres: mood.genreIds,
          sort_by: 'popularity.desc',
          language: 'tr-TR',
          'vote_average.gte': 6.0,
          'vote_count.gte': 100,
          page: Math.floor(Math.random() * 5) + 1
        }
      });

      const results = response.data.results;
      if (results.length > 0) {
        const randomMovie = results[Math.floor(Math.random() * results.length)];

        // 2. FRAGMANI ÇEK (Paralel İstek 1)
        const videoReq = axios.get(`${BASE_URL}/movie/${randomMovie.id}/videos`, {
          params: { api_key: API_KEY }
        });

        // 3. İZLEME PLATFORMLARINI ÇEK (Paralel İstek 2 - YENİ)
        const providerReq = axios.get(`${BASE_URL}/movie/${randomMovie.id}/watch/providers`, {
          params: { api_key: API_KEY }
        });

        // İki isteği aynı anda bekle (Daha hızlı çalışır)
        const [videoRes, providerRes] = await Promise.all([videoReq, providerReq]);

        // Fragman Mantığı
        const trailer = videoRes.data.results.find(
          (vid: any) => vid.site === "YouTube" && (vid.type === "Trailer" || vid.type === "Teaser")
        );

        // Platform Mantığı (Türkiye 'TR' verisine bakıyoruz)
        const trProviders = providerRes.data.results.TR;
        // Flatrate (Abonelik) veya Buy (Satın alma) seçeneklerini birleştir
        const availableProviders = trProviders
          ? [...(trProviders.flatrate || []), ...(trProviders.buy || [])].slice(0, 3) // En fazla 3 tane göster
          : [];

        // State'i Güncelle
        setMovie({
          ...randomMovie,
          trailer_key: trailer ? trailer.key : null,
          providers: availableProviders // YENİ
        });

      } else {
        alert("Bu kriterlere uygun film bulamadım.");
      }

    } catch (error) {
      console.error("Hata:", error);
    }
    setLoading(false);
  };

  const isSaved = movie && savedMovies.find(m => m.id === movie.id);

  return (
    <main className="min-h-screen bg-[#0f172a] text-white flex flex-col items-center p-6 font-sans selection:bg-purple-500 selection:text-white">

      {/* HEADER */}
      <div className="text-center mb-10 mt-6 z-10">
        <h1 className="text-5xl md:text-7xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 drop-shadow-lg">
          Nova CineMood
        </h1>
        <p className="text-slate-400 text-lg mt-2 font-medium tracking-wide">
          Bugün modun ne? Senin için en iyi filmi bulalım.
        </p>
      </div>

      {/* MOOD SEÇİCİ */}
      <div className="flex flex-wrap justify-center gap-4 w-full max-w-4xl mb-12">
        {MOODS.map((mood) => (
          <button
            key={mood.id}
            onClick={() => fetchMovie(mood)}
            className={`
              relative group overflow-hidden px-6 py-4 rounded-2xl border transition-all duration-300
              ${activeMood?.id === mood.id
                ? `bg-gradient-to-br ${mood.color} border-transparent shadow-lg scale-105 ring-2 ring-white/20`
                : 'bg-slate-800/50 border-slate-700 hover:border-slate-500 hover:bg-slate-800'
              }
            `}
          >
            <div className="flex flex-col items-center">
              <span className="text-3xl mb-1 group-hover:scale-110 transition-transform">{mood.emoji}</span>
              <span className="font-bold text-sm tracking-wide">{mood.label}</span>
            </div>
          </button>
        ))}
      </div>

      {/* ANA İÇERİK ALANI */}
      <div className="w-full max-w-5xl flex flex-col lg:flex-row gap-8 items-start">

        {/* SOL: FİLM KARTI */}
        <div className="flex-1 w-full">
          {loading ? (
            <div className="h-[500px] w-full bg-slate-800/30 rounded-3xl border border-slate-700 animate-pulse flex items-center justify-center">
              <div className="flex flex-col items-center gap-4">
                <div className="w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full animate-spin"></div>
                <span className="text-purple-400 font-bold animate-pulse">Film Mısırları Patlatılıyor...</span>
              </div>
            </div>
          ) : movie ? (
            <div className="bg-slate-800/40 backdrop-blur-xl rounded-3xl overflow-hidden shadow-2xl border border-slate-700/50 flex flex-col md:flex-row relative group">

              {/* Poster */}
              <div className="md:w-2/5 relative h-[500px] md:h-auto overflow-hidden">
                {movie.poster_path ? (
                  <img
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="w-full h-full bg-slate-700 flex items-center justify-center">Resim Yok</div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent md:hidden"></div>
              </div>

              {/* Detaylar */}
              <div className="p-8 md:w-3/5 flex flex-col justify-center">
                <div className="mb-4">
                  <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30 mb-2">
                    {movie.release_date?.split('-')[0]}
                  </span>
                  <h2 className="text-4xl font-bold leading-tight">{movie.title}</h2>
                </div>

                <div className="flex items-center gap-4 mb-6">
                  <div className="flex items-center text-yellow-400 font-bold text-xl">
                    ⭐ {movie.vote_average >= 7.5 && (
                      <span className="bg-orange-500/20 text-orange-400 text-xs font-bold px-2 py-1 rounded border border-orange-500/30 animate-pulse">
                        🔥 Kesin İzle
                      </span>
                    )}
                  </div>
                  <div className="h-1 w-1 rounded-full bg-slate-500"></div>
                  <div className="text-slate-400 text-sm">TMDB Puanı</div>
                </div>

                <p className="text-slate-300 leading-relaxed text-lg mb-8 line-clamp-6">
                  {movie.overview || "Özet bulunamadı."}
                </p>
                {/* PLATFORMLAR ALANI */}
                {movie.providers && movie.providers.length > 0 && (
                  <div className="mb-6">
                    <p className="text-sm text-slate-400 mb-2">Burada İzleyebilirsin:</p>
                    <div className="flex gap-3">
                      {movie.providers.map((prov, index) => (
                        <div key={index} className="group relative">
                          <img
                            src={`https://image.tmdb.org/t/p/original${prov.logo_path}`}
                            alt={prov.provider_name}
                            title={prov.provider_name}
                            className="w-10 h-10 rounded-lg shadow-md border border-slate-600 transition-transform group-hover:scale-110"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                {/* Aksiyon Butonları */}
                <div className="flex flex-wrap gap-4 mt-auto">
                  {movie.trailer_key && (
                    <a
                      href={`https://www.youtube.com/watch?v=${movie.trailer_key}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold flex items-center gap-2 transition-all shadow-lg hover:shadow-red-600/30"
                    >
                      ▶ Fragmanı İzle
                    </a>
                  )}

                  <button
                    onClick={() => toggleSaveMovie(movie)}
                    className={`px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-all border ${isSaved
                      ? 'bg-green-600 border-green-500 text-white hover:bg-green-700'
                      : 'bg-slate-700 border-slate-600 text-slate-200 hover:bg-slate-600'
                      }`}
                  >
                    {isSaved ? '✓ Listemde' : '+ Listeme Ekle'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] flex flex-col items-center justify-center text-center p-8 bg-slate-800/30 rounded-3xl border border-slate-700/50 border-dashed">
              <span className="text-6xl mb-4">👆</span>
              <h3 className="text-2xl font-bold text-slate-300">Bir Mod Seç</h3>
              <p className="text-slate-500 max-w-xs mt-2">Yukarıdaki butonlardan birine tıkla, yapay zeka sana uygun filmi bulsun.</p>
            </div>
          )}
        </div>

        {/* SAĞ: İZLEME LİSTESİ (SIDEBAR) */}
        <div className="w-full lg:w-80 flex flex-col gap-4">
          <div className="bg-slate-800/50 rounded-2xl p-6 border border-slate-700/50">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              📂 Listem <span className="text-sm bg-slate-700 px-2 py-0.5 rounded-full text-slate-300">{savedMovies.length}</span>
            </h3>

            {savedMovies.length === 0 ? (
              <p className="text-slate-500 text-sm">Henüz hiç film kaydetmedin.</p>
            ) : (
              <div className="space-y-3 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                {savedMovies.map((m) => (
                  <div key={m.id} className="group flex gap-3 items-start bg-slate-900/50 p-3 rounded-xl hover:bg-slate-800 transition-colors">
                    <img
                      src={`https://image.tmdb.org/t/p/w200${m.poster_path}`}
                      alt={m.title}
                      className="w-12 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-sm truncate text-slate-200">{m.title}</h4>
                      <p className="text-xs text-yellow-500 mt-1">⭐ {m.vote_average.toFixed(1)}</p>
                      <button
                        onClick={() => toggleSaveMovie(m)}
                        className="text-xs text-red-400 mt-2 hover:text-red-300 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Kaldır
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

      </div>
    </main>
  );
}