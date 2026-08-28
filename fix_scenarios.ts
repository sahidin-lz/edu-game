import fs from 'fs';

let content = fs.readFileSync('src/data/scenarioData.ts', 'utf-8');

// We will recreate the scenarioBank completely to ensure it's clean and matches the request.
const newScenarios = `
export const scenarioBank: Scenario[] = [
  {
    id: 1,
    lokasi: "Grup WhatsApp Angkatan",
    judul_konflik: "Petaka Jempol Netizen",
    deskripsi: "Telah terjadi Cancel Culture dan Cyberbullying yang sangat parah di grup WhatsApp angkatan akibat salah paham kecil. Selesaikan masalah ini! (Ketik esai pembelaan sosiologismu, lafalkan Q.S. Al-Hujurat: 11, dan jelaskan makna tadaburnya)",
    kd_sosiologi: "Cyberbullying & Cancel Culture",
    ayat_rujukan: "Q.S. Al-Hujurat: 11",
    ayat_arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا لَا يَسْخَرْ قَوْمٌ مِّن قَوْمٍ عَسَىٰ أَن يَكُونُوا خَيْرًا مِّنْهُمْ",
    ayat_terjemahan: "Wahai orang-orang yang beriman! Janganlah suatu kaum mengolok-olok kaum yang lain (karena) boleh jadi mereka (yang diolok-olokkan) lebih baik dari mereka (yang mengolok-olok)...",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "available",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 2,
    lokasi: "Timeline Media Sosial",
    judul_konflik: "Sindrom Pamer & Pinjol",
    deskripsi: "Fenomena flexing gaya hidup hedon di media sosial memicu banyak siswa terjebak hutang Pinjol ilegal demi validasi. (Gunakan suara/orasi untuk menasihati, lafalkan Q.S. Al-Isra: 26-27, dan tadaburi dampaknya terhadap ketimpangan sosial)",
    kd_sosiologi: "Hedonisme & Ketimpangan Sosial",
    ayat_rujukan: "Q.S. Al-Isra: 26-27",
    ayat_arab: "وَآتِ ذَا الْقُرْبَىٰ حَقَّهُ وَالْمِسْكِينَ وَابْنَ السَّبِيلِ وَلَا تُبَذِّرْ تَبْذِيرًا . إِنَّ الْمُبَذِّرِينَ كَانُوا إِخْوَانَ الشَّيَاطِينِ",
    ayat_terjemahan: "Dan berikanlah haknya kepada kerabat dekat, juga kepada orang miskin dan orang yang dalam perjalanan; dan janganlah kamu menghambur-hamburkan (hartamu) secara boros. Sesungguhnya orang-orang yang pemboros itu adalah saudara setan...",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 3,
    lokasi: "Lahan Proyek Strategis",
    judul_konflik: "Ekskavator vs Tanah Leluhur",
    deskripsi: "Terjadi konflik vertikal sengketa lahan besar-besaran antara aparat dan warga desa yang mempertahankan tanah leluhurnya. (Tuliskan solusi resolusi konflik, lafalkan Q.S. Al-Baqarah: 188, dan tadaburi maknanya)",
    kd_sosiologi: "Konflik Vertikal & Sengketa Lahan",
    ayat_rujukan: "Q.S. Al-Baqarah: 188",
    ayat_arab: "وَلَا تَأْكُلُوا أَمْوَالَكُم بَيْنَكُم بِالْبَاطِلِ وَتُدْلُوا بِهَا إِلَى الْحُكَّامِ لِتَأْكُلُوا فَرِيقًا مِّنْ أَمْوَالِ النَّاسِ بِالْإِثْمِ وَأَنتُمْ تَعْلَمُونَ",
    ayat_terjemahan: "Dan janganlah kamu makan harta di antara kamu dengan jalan yang batil, dan (janganlah) kamu menyuap dengan harta itu kepada para hakim, dengan maksud agar kamu dapat memakan sebagian harta orang lain itu dengan jalan dosa, padahal kamu mengetahui.",
    tipe_tantangan: "teks_esai",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  },
  {
    id: 4,
    lokasi: "Pemukiman Minoritas",
    judul_konflik: "Gembok di Rumah Tuhan",
    deskripsi: "Eskalasi intoleransi memuncak saat sekelompok ormas menyegel rumah ibadah kelompok minoritas secara paksa. (Gunakan orasi suaramu untuk meredakan massa, lafalkan Q.S. Al-Ma'idah: 8, dan tadaburi pentingnya keadilan sosial)",
    kd_sosiologi: "Intoleransi & Mayoritarianisme",
    ayat_rujukan: "Q.S. Al-Ma'idah: 8",
    ayat_arab: "يَا أَيُّهَا الَّذِينَ آمَنُوا كُونُوا قَوَّامِينَ لِلَّهِ شُهَدَاءَ بِالْقِسْطِ ۖ وَلَا يَجْرِمَنَّكُمْ شَنَآنُ قَوْمٍ عَلَىٰ أَلَّا تَعْدِلُوا ۚ اعْدِلُوا هُوَ أَقْرَبُ لِلتَّقْوَىٰ",
    ayat_terjemahan: "Wahai orang-orang yang beriman! Jadilah kamu sebagai penegak keadilan karena Allah, (ketika) menjadi saksi dengan adil. Dan janganlah kebencianmu terhadap suatu kaum mendorong kamu untuk berlaku tidak adil. Berlaku adillah. Karena (adil) itu lebih dekat kepada takwa...",
    tipe_tantangan: "suara_orasi",
    kategori: "Main Quest",
    status: "locked",
    reward_qris: 50000,
    cost_energi: 20
  }
];
`;

content = content.replace(/export const scenarioBank: Scenario\[\] = \[[\s\S]*\];/, newScenarios.trim());
fs.writeFileSync('src/data/scenarioData.ts', content);
