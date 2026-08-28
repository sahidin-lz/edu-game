import fs from 'fs';

const avatars = [
  { id: "sosiolog-muda", name: "Sosiolog Muda", seed: "Felix", bg: "b6e3f4", desc: "Pakar analisis sosial. Cocok untuk menyelesaikan masalah struktural di masyarakat dengan argumen kritis." },
  { id: "aktivis-sosial", name: "Aktivis Sosial", seed: "Aneka", bg: "c0aede", desc: "Penggerak massa. Mampu meredakan ketegangan dan meningkatkan ukhuwah melalui orasi emosional." },
  { id: "santri-kritis", name: "Santri Kritis", seed: "Jocelyn", bg: "ffd5dc", desc: "Berpegang teguh pada dalil Al-Qur'an. Memiliki hafalan kuat untuk menjawab tantangan moral." },
  { id: "diplomat-ulung", name: "Diplomat Ulung", seed: "Bandit", bg: "ffdfbf", desc: "Ahli negosiasi yang selalu menemukan jalan tengah. Ahli menurunkan tensi konflik." },
  { id: "jurnalis-investigasi", name: "Jurnalis Investigasi", seed: "Jack", bg: "d1d4f9", desc: "Mencari fakta di balik layar. Cocok untuk mengungkap hoaks dan ketidakadilan." },
  { id: "pemikir-bebas", name: "Pemikir Bebas", seed: "Oliver", bg: "c0aede", desc: "Inovatif dan tidak terikat aturan kaku. Mampu menemukan solusi out-of-the-box." },
  { id: "pekerja-sosial", name: "Pekerja Sosial", seed: "Caleb", bg: "b6e3f4", desc: "Sangat peduli pada akar rumput. Berfokus pada pembangunan kesejahteraan desa." },
  { id: "pendidik-inovatif", name: "Pendidik Inovatif", seed: "Sam", bg: "ffd5dc", desc: "Menyebarkan pemahaman melalui pendekatan edukatif. Memiliki pemahaman sosial mendalam." },
  { id: "budayawan-lokal", name: "Budayawan Lokal", seed: "Mia", bg: "ffdfbf", desc: "Ahli melestarikan tradisi kearifan lokal untuk menjaga ukhuwah masyarakat." },
  { id: "teknokrat-muda", name: "Teknokrat Muda", seed: "Adrian", bg: "d1d4f9", desc: "Memanfaatkan teknologi untuk memberantas kesenjangan digital di era modern." },
  { id: "orator-jalanan", name: "Orator Jalanan", seed: "Sasha", bg: "c0aede", desc: "Penyambung lidah rakyat. Mengandalkan orasi berapi-api untuk menuntut keadilan." },
  { id: "penegak-hukum", name: "Kader Hukum", seed: "Leo", bg: "b6e3f4", desc: "Kritis terhadap pelanggaran norma sosial dan hukum positif di masyarakat." },
  { id: "relawan-kemanusiaan", name: "Relawan", seed: "Zoey", bg: "ffd5dc", desc: "Garda terdepan di daerah krisis, sigap dan berempati pada penderitaan." },
  { id: "pengamat-politik", name: "Pengamat Politik", seed: "Max", bg: "ffdfbf", desc: "Membedah kebijakan pemerintah dan dampaknya pada masyarakat struktural." },
  { id: "dai-milenial", name: "Da'i Milenial", seed: "Toby", bg: "d1d4f9", desc: "Menyampaikan dakwah Islam secara damai dan dapat diterima lintas generasi." }
];

let content = `export const AVATARS = [\n`;
avatars.forEach(a => {
  content += `  {
    id: "${a.id}",
    name: "${a.name}",
    image: "https://api.dicebear.com/7.x/adventurer/svg?seed=${a.seed}&backgroundColor=${a.bg}",
    description: "${a.desc}"
  },\n`;
});
content += `];\n\n`;
content += `// Untuk custom avatar
export const getCustomAvatarUrl = (seed: string) => \`https://api.dicebear.com/7.x/adventurer/svg?seed=\${encodeURIComponent(seed)}&backgroundColor=b6e3f4\`;\n`;

fs.writeFileSync('src/data/avatars.ts', content);
