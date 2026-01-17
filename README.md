# 🎬 Nova CineMood

**Nova CineMood**, "Ne izlesem?" derdine son veren, kullanıcıların o anki duygu durumuna (mood) göre nokta atışı film önerileri almasını sağlayan modern bir web uygulamasıdır.

🔗 **Canlı Demo:** [https://nova-cinemood-project.vercel.app/](https://nova-cinemood-project.vercel.app/)



## ✨ Öne Çıkan Özellikler

* **🎭 Mood Tabanlı Öneri:** Standart kategori seçimi yerine; "Sıkıldım", "Hüzünlüyüm", "Meraklıyım" gibi duygu durumlarına göre akıllı filtreleme.
* **🎥 Fragman Entegrasyonu:** Önerilen filmin YouTube fragmanını direkt arayüz üzerinden izleme imkanı.
* **💾 Kişisel İzleme Listesi:** Beğenilen filmleri tarayıcı hafızasında (LocalStorage) saklayarak kaybetmeme özelliği.
* **🎨 Modern Arayüz:** Tailwind CSS ile hazırlanmış, Glassmorphism etkili şık ve responsive (mobil uyumlu) tasarım.
* **🔒 Güvenli Mimari:** API anahtarları `.env` dosyası üzerinden yönetilir, kod içine gömülmez.

## 🛠️ Kullanılan Teknolojiler

* **Framework:** [Next.js 14](https://nextjs.org/) (App Router)
* **Dil:** [TypeScript](https://www.typescriptlang.org/)
* **Stil:** [Tailwind CSS](https://tailwindcss.com/)
* **Veri Kaynağı:** [TMDB API](https://www.themoviedb.org/)
* **HTTP İstekleri:** Axios

## 🚀 Kurulum (Local Setup)

Projeyi kendi bilgisayarınızda çalıştırmak için şu adımları izleyin:

1.  **Projeyi Klonlayın:**
    ```bash
    git clone [https://github.com/KULLANICI_ADIN/nova-cinemood.git](https://github.com/KULLANICI_ADIN/nova-cinemood.git)
    cd nova-cinemood
    ```

2.  **Paketleri Yükleyin:**
    ```bash
    npm install
    ```

3.  **Çevre Değişkenlerini (Environment Variables) Ayarlayın:**
    Ana dizinde `.env.local` adında bir dosya oluşturun ve TMDB API anahtarınızı ekleyin:
    ```env
    NEXT_PUBLIC_TMDB_API_KEY=senin_api_anahtarin_buraya
    ```

4.  **Projeyi Başlatın:**
    ```bash
    npm run dev
    ```
    Tarayıcınızda `http://localhost:3000` adresine gidin.

## 🌐 Dağıtım (Deployment)

Bu proje [Vercel](https://vercel.com) üzerinde barındırılmaktadır. Kendi versiyonunuzu yayınlarken Vercel proje ayarlarında **Environment Variables** kısmına `NEXT_PUBLIC_TMDB_API_KEY` değişkenini eklemeyi unutmayın.

---
*Geliştirici: [Senin Adın/GitHub Profilin]*