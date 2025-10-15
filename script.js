document.querySelectorAll(".overlay p").forEach((el) => {
  const letters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  // Ambil dari data-text kalau ada; kalau nggak, pakai teks asli <p> (termasuk \n dari <br>)
  const targetText = (el.getAttribute("data-text") || el.innerText || "").trim();
  let interval = null;

  // Mulai dari kosong biar efek scramble keliatan
  el.innerText = "";

  // Cari elemen .album terdekat sebagai target hover
  const album = el.closest(".album");
  if (!album || !targetText) return;

  album.addEventListener("mouseenter", () => {
    let iteration = 0;
    clearInterval(interval);

    interval = setInterval(() => {
      el.innerText = targetText
        .split("")
        .map((char, index) => {
          // Pertahankan line break agar layout tetap tengah
          if (char === "\n") return "\n";
          // Setelah "terkunci", tampilkan huruf aslinya
          if (index < iteration) return targetText[index];
          // Sebelum "terkunci", tampilkan huruf acak
          return letters[Math.floor(Math.random() * letters.length)];
        })
        .join("");

      if (iteration >= targetText.length) {
        clearInterval(interval);
        el.innerText = targetText; // pastikan berakhir di teks final
      }

      iteration += 2 / 3; // makin kecil = makin lambat
    }, 30);
  });

  album.addEventListener("mouseleave", () => {
    clearInterval(interval);
    el.innerText = ""; // reset biar bisa animasi lagi saat hover berikutnya
  });
});
