export function getAkademikPersona(faham: number, hifdz: number, ukhuwah: number): { title: string, desc: string, color: string } {
  // Balanced high
  if (faham >= 80 && hifdz >= 80 && ukhuwah >= 80) {
    return { title: "Ulul Albab", desc: "Pemikir Ulung yang menyeimbangkan kecerdasan intelektual, spiritual, dan sosial.", color: "text-amber-400" };
  }
  
  if (faham >= 70 && hifdz < 50) {
    return { title: "Sosiolog Kritis", desc: "Tajam dalam analisa sosial, namun perlu memperdalam landasan spiritual (hifdz).", color: "text-blue-400" };
  }
  
  if (hifdz >= 70 && faham < 50) {
    return { title: "Penjaga Tradisi", desc: "Sangat kuat menjaga hafalan dan tradisi agama, tapi perlu lebih luwes membaca realitas sosial.", color: "text-emerald-400" };
  }
  
  if (ukhuwah >= 80) {
    return { title: "Diplomat Umat", desc: "Mampu meredam ketegangan dan merekatkan ukhuwah masyarakat.", color: "text-indigo-400" };
  }

  if (faham < 40 && hifdz < 40 && ukhuwah < 40) {
    return { title: "Musafir Kebingungan", desc: "Belum menemukan pijakan yang kuat. Teruslah belajar dari krisis.", color: "text-rose-400" };
  }

  return { title: "Santri Pembelajar", desc: "Sedang dalam proses menyeimbangkan ilmu dunia dan akhirat.", color: "text-slate-300" };
}
