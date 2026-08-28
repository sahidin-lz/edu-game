import fs from 'fs';

const avatars = [
  { id: "santri-bersorban", name: "Santri Bersorban", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmad&top=turban&clothing=shirtCrewNeck&backgroundColor=b6e3f4", desc: "Pemuda pesantren dengan semangat dakwah dan keilmuan yang luas." },
  { id: "santriwati-hijab", name: "Santriwati Berhijab", image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Aisyah&top=hijab&clothing=shirtCrewNeck&backgroundColor=ffd5dc", desc: "Aktivis muslimah yang cerdas, peduli sosial, dan berpegang pada Al-Qur'an." },
  { id: "sosiolog-muda", name: "Sosiolog Muda", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Felix&backgroundColor=b6e3f4", desc: "Pakar analisis sosial. Cocok untuk menyelesaikan masalah struktural di masyarakat dengan argumen kritis." },
  { id: "aktivis-sosial", name: "Aktivis Sosial", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Aneka&backgroundColor=c0aede", desc: "Penggerak massa. Mampu meredakan ketegangan dan meningkatkan ukhuwah melalui orasi emosional." },
  { id: "santri-kritis", name: "Santri Kritis", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jocelyn&backgroundColor=ffd5dc", desc: "Berpegang teguh pada dalil Al-Qur'an. Memiliki hafalan kuat untuk menjawab tantangan moral." },
  { id: "diplomat-ulung", name: "Diplomat Ulung", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Bandit&backgroundColor=ffdfbf", desc: "Ahli negosiasi yang selalu menemukan jalan tengah. Ahli menurunkan tensi konflik." },
  { id: "jurnalis-investigasi", name: "Jurnalis Investigasi", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Jack&backgroundColor=d1d4f9", desc: "Mencari fakta di balik layar. Cocok untuk mengungkap hoaks dan ketidakadilan." },
  { id: "pemikir-bebas", name: "Pemikir Bebas", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Oliver&backgroundColor=c0aede", desc: "Inovatif dan tidak terikat aturan kaku. Mampu menemukan solusi out-of-the-box." },
  { id: "pekerja-sosial", name: "Pekerja Sosial", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Caleb&backgroundColor=b6e3f4", desc: "Sangat peduli pada akar rumput. Berfokus pada pembangunan kesejahteraan desa." },
  { id: "pendidik-inovatif", name: "Pendidik Inovatif", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sam&backgroundColor=ffd5dc", desc: "Menyebarkan pemahaman melalui pendekatan edukatif. Memiliki pemahaman sosial mendalam." },
  { id: "budayawan-lokal", name: "Budayawan Lokal", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Mia&backgroundColor=ffdfbf", desc: "Ahli melestarikan tradisi kearifan lokal untuk menjaga ukhuwah masyarakat." },
  { id: "teknokrat-muda", name: "Teknokrat Muda", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Adrian&backgroundColor=d1d4f9", desc: "Memanfaatkan teknologi untuk memberantas kesenjangan digital di era modern." },
  { id: "orator-jalanan", name: "Orator Jalanan", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Sasha&backgroundColor=c0aede", desc: "Penyambung lidah rakyat. Mengandalkan orasi berapi-api untuk menuntut keadilan." },
  { id: "penegak-hukum", name: "Kader Hukum", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Leo&backgroundColor=b6e3f4", desc: "Kritis terhadap pelanggaran norma sosial dan hukum positif di masyarakat." },
  { id: "relawan-kemanusiaan", name: "Relawan", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Zoey&backgroundColor=ffd5dc", desc: "Garda terdepan di daerah krisis, sigap dan berempati pada penderitaan." },
  { id: "pengamat-politik", name: "Pengamat Politik", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Max&backgroundColor=ffdfbf", desc: "Membedah kebijakan pemerintah dan dampaknya pada masyarakat struktural." },
  { id: "dai-milenial", name: "Da'i Milenial", image: "https://api.dicebear.com/7.x/adventurer/svg?seed=Toby&backgroundColor=d1d4f9", desc: "Menyampaikan dakwah Islam secara damai dan dapat diterima lintas generasi." }
];

let content = `export const AVATARS = [\n`;
avatars.forEach(a => {
  content += `  {
    id: "${a.id}",
    name: "${a.name}",
    image: "${a.image}",
    description: "${a.desc}"
  },\n`;
});
content += `];\n\n`;
content += `// Untuk custom avatar
export const getCustomAvatarUrl = (seed: string) => {
  // If it contains "hijab" or "sorban", use avataaars for better support
  const s = seed.toLowerCase();
  if (s.includes('hijab') || s.includes('perempuan') || s.includes('cewek') || s.includes('akhwat') || s.includes('ukhti')) {
    return \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(seed)}&top=hijab&backgroundColor=ffd5dc\`;
  }
  if (s.includes('sorban') || s.includes('peci') || s.includes('ikhwan') || s.includes('akhi')) {
    return \`https://api.dicebear.com/7.x/avataaars/svg?seed=\${encodeURIComponent(seed)}&top=turban&backgroundColor=b6e3f4\`;
  }
  return \`https://api.dicebear.com/7.x/adventurer/svg?seed=\${encodeURIComponent(seed)}&backgroundColor=c0aede\`;
};\n`;

fs.writeFileSync('src/data/avatars.ts', content);
