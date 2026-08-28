import re

with open('src/App.tsx', 'r') as f:
    content = f.read()

# 1. Update LandingPage layout for STUDENT role in isAtBasecamp
# Currently isAtBasecamp returns <LandingPage />. 
# Oh wait, the prompt says "Layar Awal (Start Screen): Saat siswa berhasil login, arahkan ke layar "Persiapan Petualangan". Tampilkan informasi profil siswa, Level saat ini (berdasarkan index misi), dan "Bekal" mereka (jumlah Energi dan Uang QRIS). Tambahkan tombol besar "Mulai Petualangan"."
# Let's find `isAtBasecamp` in App.tsx
