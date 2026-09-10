// popup.js
// Menampilkan popup (modal) saat tombol navbar diklik.
// Setiap tombol punya konten popup masing-masing:
//  - Cara Kerja      -> ringkasan 4 langkah
//  - Produk          -> preview daftar layanan
//  - Estimasi Harga  -> kalkulator mini yang langsung berfungsi
//  - Lacak Pesanan   -> contoh tracker status
//  - Roadmap         -> rencana pengembangan sistem ke depan

document.addEventListener('DOMContentLoaded', () => {
  const overlay = document.getElementById('modalOverlay');
  const contentEl = document.getElementById('modalContent');
  const closeBtn = document.getElementById('modalClose');
  const triggers = document.querySelectorAll('[data-modal]');

  if (!overlay || !contentEl || !closeBtn) return;

  function formatRupiah(angka){
    return 'Rp' + Math.round(angka).toLocaleString('id-ID');
  }

  const templates = {
    caraKerja: () => `
      <p class="modal-kicker">Alur Pesanan</p>
      <h3>Cara Kerja Barasiah</h3>
      <p class="modal-desc">Empat langkah singkat dari keranjang cucian sampai siap diambil.</p>
      <ol class="modal-steps">
        <li><span class="num">1</span><span><strong>Pilih layanan</strong><span>Cuci kering, cuci setrika, atau express.</span></span></li>
        <li><span class="num">2</span><span><strong>Masukkan berat</strong><span>Timbang pakaian dan isi beratnya dalam kilogram.</span></span></li>
        <li><span class="num">3</span><span><strong>Lihat estimasi harga</strong><span>Total dihitung otomatis, tanpa biaya tersembunyi.</span></span></li>
        <li><span class="num">4</span><span><strong>Pantau statusnya</strong><span>Ikuti progres dari Diproses sampai Selesai.</span></span></li>
      </ol>
      <div class="modal-actions">
        <button class="modal-btn primary" data-jump="#cara-kerja">Lihat bagian ini di halaman</button>
      </div>
    `,

    produk: () => `
      <p class="modal-kicker">Layanan Kami</p>
      <h3>Pilihan Layanan Laundry</h3>
      <p class="modal-desc">Tiga layanan dengan harga per kilogram, sesuai kebutuhan cucianmu.</p>
      <ul class="modal-produk-list">
        <li><span class="nama">Cuci Kering</span><span class="harga">Rp7.000/kg</span></li>
        <li><span class="nama">Cuci Setrika</span><span class="harga">Rp10.000/kg</span></li>
        <li><span class="nama">Express &middot; 6 jam selesai</span><span class="harga">Rp15.000/kg</span></li>
      </ul>
      <div class="modal-actions">
        <a class="modal-btn primary" href="produk.html">Lihat semua produk</a>
        <button class="modal-btn ghost" data-jump="#layanan">Bandingkan di halaman</button>
      </div>
    `,

    estimasi: () => `
      <p class="modal-kicker">Hitung Cepat</p>
      <h3>Estimasi Harga</h3>
      <p class="modal-desc">Isi berat dan pilih layanan, totalnya langsung muncul.</p>
      <div class="modal-calc-field">
        <label for="modalBerat">Berat pakaian (kg)</label>
        <input type="number" id="modalBerat" min="0" step="0.5" placeholder="Contoh: 3.5">
      </div>
      <div class="modal-calc-field">
        <label for="modalLayanan">Layanan</label>
        <select id="modalLayanan">
          <option value="7000" data-name="Cuci Kering">Cuci Kering &mdash; Rp7.000/kg</option>
          <option value="10000" data-name="Cuci Setrika">Cuci Setrika &mdash; Rp10.000/kg</option>
          <option value="15000" data-name="Express">Express &mdash; Rp15.000/kg</option>
        </select>
      </div>
      <div class="modal-readout">
        <span class="label">Estimasi Total</span>
        <span class="amount" id="modalHasil">Rp0</span>
        <span class="sub" id="modalDetail">isi berat untuk mulai</span>
      </div>
      <div class="modal-actions">
        <button class="modal-btn ghost" data-jump="#kalkulator">Buka kalkulator penuh</button>
      </div>
    `,

    lacak: () => `
      <p class="modal-kicker">Contoh Tampilan</p>
      <h3>Lacak Status Pesanan</h3>
      <p class="modal-desc">Klik tiap titik untuk melihat bagaimana progres pesananmu akan terlihat.</p>
      <div class="modal-tracker" id="modalTrackerRow">
        <button class="modal-tnode active" data-step="0">
          <span class="tdot">1</span><span class="tlabel">Diproses</span>
        </button>
        <button class="modal-tnode" data-step="1">
          <span class="tdot">2</span><span class="tlabel">Dicuci</span>
        </button>
        <button class="modal-tnode" data-step="2">
          <span class="tdot">3</span><span class="tlabel">Selesai</span>
        </button>
      </div>
      <p class="modal-track-hint" id="modalTrackHint">Pesanan diterima dan sedang menunggu diproses.</p>
      <div class="modal-actions">
        <button class="modal-btn ghost" data-jump="#status">Lihat di halaman</button>
      </div>
    `,

    roadmap: () => `
      <p class="modal-kicker">Rencana Pengembangan</p>
      <h3>Roadmap Barasiah</h3>
      <p class="modal-desc">masih baraja, jangan diketawain puh sepuh. Berikut tahapan yang sudah dan akan dikerjakan.</p>
      <ul class="modal-roadmap">
        <li class="aktif">
          <span class="fase">Fase 1<span class="status">&middot; berjalan</span></span>
          <strong>Pemesanan &amp; Estimasi Harga</strong>
          <p>Pilih layanan, hitung estimasi harga, dan lihat contoh status pesanan &mdash; seperti yang kamu lihat sekarang.</p>
        </li>
        <li>
          <span class="fase">Fase 2<span class="status">&middot; direncanakan</span></span>
          <strong>Akun &amp; Riwayat Pesanan</strong>
          <p>Pengguna bisa masuk dengan akun sendiri dan melihat riwayat pesanan sebelumnya.</p>
        </li>
        <li>
          <span class="fase">Fase 3<span class="status">&middot; direncanakan</span></span>
          <strong>Pembayaran Online</strong>
          <p>Pesanan bisa langsung dibayar lewat transfer atau e-wallet saat checkout.</p>
        </li>
        <li>
          <span class="fase">Fase 4<span class="status">&middot; direncanakan</span></span>
          <strong>Notifikasi Status Real-time</strong>
          <p>Pemberitahuan otomatis lewat WhatsApp setiap status pesanan berubah.</p>
        </li>
      </ul>
    `,

    pesanSekarang: () => `
      <p class="modal-kicker">Pesan Cepat</p>
      <h3>Pesan Sekarang</h3>
      <p class="modal-desc">Chat langsung lewat halaman whatsapp kami untuk pesan laundry, tanya-tanya harga, atau jadwalkan antar-jemput.</p>
      <div class="modal-actions">
        <a class="modal-btn primary" href="https://wa.me/6281371685749?text=Halo%20BARASIAH%2C%20saya%20ingin%20pesan%20layanan%20Setrika%20Saja" target="_blank" rel="noopener noreferrer">Buka whatsapp Kami</a>
        <button class="modal-btn ghost" data-jump="#kalkulator">Hitung dulu estimasi harga</button>
      </div>
    `,
  };

  function bindDynamicContent(key){
    if (key === 'estimasi'){
      const select = document.getElementById('modalLayanan');
      const berat = document.getElementById('modalBerat');
      const hasil = document.getElementById('modalHasil');
      const detail = document.getElementById('modalDetail');

      function hitung(){
        const harga = parseInt(select.value, 10);
        const kg = parseFloat(berat.value);
        const nama = select.options[select.selectedIndex].dataset.name;
        if (!kg || kg <= 0){
          hasil.textContent = 'Rp0';
          detail.textContent = 'isi berat untuk mulai';
          return;
        }
        hasil.textContent = formatRupiah(harga * kg);
        detail.textContent = nama + ' \u00b7 ' + kg + ' kg';
      }
      select.addEventListener('change', hitung);
      berat.addEventListener('input', hitung);
    }

    if (key === 'lacak'){
      const nodes = document.querySelectorAll('#modalTrackerRow .modal-tnode');
      const hint = document.getElementById('modalTrackHint');
      const hints = [
        'Pesanan diterima dan sedang menunggu diproses.',
        'Cucian sedang dicuci dan dikeringkan di laundry.',
        'Cucian sudah rapi dan siap diambil.'
      ];
      nodes.forEach(node => {
        node.addEventListener('click', () => {
          const step = parseInt(node.dataset.step, 10);
          nodes.forEach(n => {
            const s = parseInt(n.dataset.step, 10);
            n.classList.remove('active', 'done');
            if (s < step) n.classList.add('done');
            if (s === step) n.classList.add('active');
          });
          hint.textContent = hints[step];
        });
      });
    }
  }

  function openModal(key){
    const build = templates[key];
    if (!build) return;
    contentEl.innerHTML = build();
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    bindDynamicContent(key);
    closeBtn.focus();
  }

  function closeModal(){
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  triggers.forEach(link => {
    const key = link.dataset.modal;
    if (!templates[key]) return;
    link.addEventListener('click', e => {
      e.preventDefault();
      openModal(key);
    });
  });

  closeBtn.addEventListener('click', closeModal);
  overlay.addEventListener('click', e => {
    if (e.target === overlay) closeModal();
  });
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeModal();
  });

  // Tombol "Lihat di halaman" / "Buka kalkulator penuh" di dalam popup:
  // tutup popup lalu scroll halus ke bagian terkait.
  contentEl.addEventListener('click', e => {
    const jumpBtn = e.target.closest('[data-jump]');
    if (!jumpBtn) return;
    const targetSel = jumpBtn.dataset.jump;
    closeModal();
    const target = document.querySelector(targetSel);
    if (target){
      setTimeout(() => target.scrollIntoView({ behavior: 'smooth', block: 'start' }), 180);
    }
  });
});
