// Sinkronkan pilihan layanan (kartu) <-> dropdown kalkulator
document.addEventListener('DOMContentLoaded', () => {
  const cards = document.querySelectorAll('.service-card');
  const select = document.getElementById('layananSelect');
  const beratInput = document.getElementById('beratInput');
  const hasilHarga = document.getElementById('hasilHarga');
  const hasilDetail = document.getElementById('hasilDetail');

  // Halaman ini mungkin tidak punya kalkulator (mis. produk.html), jadi cek dulu
  if (select && beratInput && hasilHarga && hasilDetail) {
    function formatRupiah(angka){
      return 'Rp' + Math.round(angka).toLocaleString('id-ID');
    }

    function hitungTotal(){
      const harga = parseInt(select.value, 10);
      const berat = parseFloat(beratInput.value);
      const nama = select.options[select.selectedIndex].dataset.name;

      if(!berat || berat <= 0){
        hasilHarga.textContent = 'Rp0';
        hasilDetail.textContent = 'isi berat untuk mulai';
        return;
      }
      const total = harga * berat;
      hasilHarga.textContent = formatRupiah(total);
      hasilDetail.textContent = nama + ' \u00b7 ' + berat + ' kg';
    }

    cards.forEach(card => {
      card.addEventListener('click', () => {
        cards.forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        const price = card.dataset.price;
        select.value = price;
        hitungTotal();
      });
    });

    select.addEventListener('change', () => {
      cards.forEach(c => c.classList.toggle('selected', c.dataset.price === select.value));
      hitungTotal();
    });

    beratInput.addEventListener('input', hitungTotal);
  }

  // Demo status tracker
  const tnodes = document.querySelectorAll('.tnode');
  if (tnodes.length) {
    tnodes.forEach(node => {
      node.addEventListener('click', () => {
        const step = parseInt(node.dataset.step, 10);
        tnodes.forEach(n => {
          const s = parseInt(n.dataset.step, 10);
          n.classList.remove('active', 'done');
          if(s < step) n.classList.add('done');
          if(s === step) n.classList.add('active');
        });
      });
    });
  }
});
