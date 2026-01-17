# 🎬 Nova CineMood

**Nova CineMood**, kullanıcıların o anki ruh haline (mood) göre film önerileri almasını sağlayan yapay zeka destekli bir web uygulamasıdır. Klasik "tür seçme" deneyimi yerine, duygu durumuna odaklanan bir kullanıcı deneyimi (UX) sunar.

## 🚀 Canlı Demo
[Buraya Vercel Linki Gelecek]

## 💡 Özellikler
* **Duygu Analizi:** Kullanıcının seçtiği ruh haline (Sıkılmış, Hüzünlü, Meraklı vb.) göre arka planda dinamik tür eşleştirmesi yapar.
* **Akıllı Algoritma:** TMDB API'sini kullanarak popülerlik, oy oranı ve tür filtresine göre en uygun içeriği getirir.
* **Responsive Tasarım:** Tailwind CSS ile hem mobil hem masaüstü cihazlarda kusursuz görünüm.
* **Type-Safe:** TypeScript kullanılarak geliştirilmiş, hata oranı minimize edilmiş kod yapısı.

## 🛠️ Kullanılan Teknolojiler
* **Framework:** Next.js 14 (App Router)
* **Dil:** TypeScript
* **Styling:** Tailwind CSS
* **Veri Kaynağı:** TMDB API
* **HTTP Client:** Axios

## 📦 Kurulum (Lokal)

1. Projeyi klonlayın:
\`\`\`bash
git clone https://github.com/kullaniciadi/nova-cinemood.git
\`\`\`

2. Bağımlılıkları yükleyin:
\`\`\`bash
npm install
\`\`\`

3. API Anahtarını Ekleyin:
`src/app/page.tsx` dosyası içerisindeki `API_KEY` alanına kendi TMDB anahtarınızı girin.

4. Çalıştırın:
\`\`\`bash
npm run dev
\`\`\`