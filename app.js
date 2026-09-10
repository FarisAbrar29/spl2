// assets/app.js
// Logika dipakai bersama oleh produk.html & riwayat.html.
// Butuh assets/produk-data.js sudah dimuat lebih dulu (lihat urutan <script> di HTML).

const STORAGE_KEY = "barasiah_pesanan";

function formatRupiah(n){
  return "Rp" + Math.round(n).toLocaleString("id-ID");
}

function ambilSemuaPesanan(){
  try{
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  }catch(e){
    console.error("Gagal membaca riwayat:", e);
    return [];
  }
}

function simpanPesananBaru(pesanan){
  const semua = ambilSemuaPesanan();
  semua.push(pesanan);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(semua));
}

function hapusSemuaPesanan(){
  localStorage.removeItem(STORAGE_KEY);
}

/* ========== HALAMAN PRODUK: render kartu + popup ========== */
function initHalamanProduk(){
  const grid = document.getElementById("produkGrid");
  if(!grid) return; // bukan halaman produk, lewati

  // 1) Render kartu dari PRODUK_LIST (assets/produk-data.js)
  grid.innerHTML = PRODUK_LIST.map(p => `
    <button type="button" class="produk-card" data-id="${p.id}">
      <span class="tag">${p.tag}</span>
      <h3>${p.nama}</h3>
      <p>${p.deskripsi}</p>
      <div class="price mono">${formatRupiah(p.harga)}<span style="font-weight:400;color:var(--ink-soft);">/kg</span></div>
      <div class="cta-hint">Lihat detail &amp; pesan &rarr;</div>
    </button>
  `).join("");

  // 2) Setiap kartu punya popup sendiri-sendiri (isinya beda per produk)
  grid.querySelectorAll(".produk-card").forEach(card => {
    card.addEventListener("click", () => openProdukModal(card.dataset.id));
  });

  // 3) Kontrol popup: tutup pakai tombol X / klik luar / tombol Escape
  const overlay = document.getElementById("modalOverlay");
  document.getElementById("modalClose").addEventListener("click", closeProdukModal);
  overlay.addEventListener("click", (e) => { if(e.target === overlay) closeProdukModal(); });
  document.addEventListener("keydown", (e) => { if(e.key === "Escape") closeProdukModal(); });
}

let produkAktif = null;

function openProdukModal(id){
  produkAktif = PRODUK_LIST.find(p => p.id === id);
  if(!produkAktif) return;

  document.getElementById("modalTag").textContent = produkAktif.tag;
  document.getElementById("modalTitle").textContent = produkAktif.nama;
  document.getElementById("modalPrice").textContent = formatRupiah(produkAktif.harga) + "/kg \u00b7 estimasi " + produkAktif.estimasi;
  document.getElementById("modalDesc").textContent = produkAktif.deskripsi;
  document.getElementById("modalBerat").value = "";
  document.getElementById("modalCatatan").value = "";
  updateModalTotal();

  document.getElementById("modalOverlay").classList.add("open");
  document.body.style.overflow = "hidden";
}

function closeProdukModal(){
  document.getElementById("modalOverlay").classList.remove("open");
  document.body.style.overflow = "";
}

function updateModalTotal(){
  const berat = parseFloat(document.getElementById("modalBerat").value);
  const amtEl = document.getElementById("modalTotalAmt");
  const subEl = document.getElementById("modalTotalSub");
  if(!produkAktif || !berat || berat <= 0){
    amtEl.textContent = "Rp0";
    subEl.textContent = "isi berat dulu";
    return;
  }
  amtEl.textContent = formatRupiah(produkAktif.harga * berat);
  subEl.textContent = berat + " kg \u00d7 " + formatRupiah(produkAktif.harga);
}

function simpanDariModal(){
  const berat = parseFloat(document.getElementById("modalBerat").value);
  if(!produkAktif || !berat || berat <= 0){
    alert("Isi berat pakaian dulu ya (lebih dari 0 kg).");
    return;
  }
  const catatan = document.getElementById("modalCatatan").value.trim();
  simpanPesananBaru({
    nama: produkAktif.nama,
    harga: produkAktif.harga,
    berat: berat,
    total: produkAktif.harga * berat,
    catatan: catatan,
    waktu: new Date().toISOString()
  });

  const flash = document.getElementById("savedFlash");
  flash.classList.add("show");
  setTimeout(() => flash.classList.remove("show"), 2200);
}

function waLinkDariModal(){
  if(!produkAktif) return "#";
  const berat = parseFloat(document.getElementById("modalBerat").value) || 0;
  const catatan = document.getElementById("modalCatatan").value.trim();
  let pesan = `Halo BARASIAH, saya ingin pesan layanan ${produkAktif.nama}`;
  if(berat > 0) pesan += ` (${berat} kg, estimasi ${formatRupiah(produkAktif.harga * berat)})`;
  if(catatan) pesan += `. Catatan: ${catatan}`;
  return `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(pesan)}`;
}

function bukaWaDariModal(){
  simpanDariModal();
  window.open(waLinkDariModal(), "_blank");
}

/* ========== HALAMAN RIWAYAT ========== */
function initHalamanRiwayat(){
  const body = document.getElementById("riwayatBody");
  if(!body) return; // bukan halaman riwayat, lewati

  renderRiwayat();

  const clearBtn = document.getElementById("clearBtn");
  if(clearBtn){
    clearBtn.addEventListener("click", () => {
      if(confirm("Hapus semua riwayat pesanan yang tersimpan di browser ini?")){
        hapusSemuaPesanan();
        renderRiwayat();
      }
    });
  }
}

function renderRiwayat(){
  const body = document.getElementById("riwayatBody");
  const empty = document.getElementById("riwayatEmpty");
  const table = document.getElementById("riwayatTable");
  const pesanan = ambilSemuaPesanan().slice().reverse();

  if(pesanan.length === 0){
    table.style.display = "none";
    empty.style.display = "block";
    return;
  }
  table.style.display = "table";
  empty.style.display = "none";

  body.innerHTML = pesanan.map(p => `
    <tr>
      <td><strong>${p.nama}</strong></td>
      <td>${p.berat} kg</td>
      <td class="mono">${formatRupiah(p.total)}</td>
      <td>${p.catatan ? p.catatan : '<span style="color:var(--ink-soft);">&ndash;</span>'}</td>
      <td class="mono" style="font-size:12px; color:var(--ink-soft);">${new Date(p.waktu).toLocaleString("id-ID")}</td>
    </tr>
  `).join("");
}

document.addEventListener("DOMContentLoaded", () => {
  initHalamanProduk();
  initHalamanRiwayat();
});
