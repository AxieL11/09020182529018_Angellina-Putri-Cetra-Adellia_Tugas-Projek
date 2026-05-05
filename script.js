// ==============================
// FORMAT RUPIAH
// ==============================
function formatRupiah(angka) {
  return angka.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".");
}

// ==============================
// TAMBAH KE KERANJANG
// ==============================
function addToCart(name, select) {
  let price = parseInt(select.value);
  let detail = select.options[select.selectedIndex].text;

  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.push({ name, detail, price });

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();

  tampilPopup(`${name} ditambahkan (Rp${formatRupiah(price)})`);
}

// ==============================
// HAPUS ITEM
// ==============================
function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartCount();
  renderCart();
}

// ==============================
// RENDER CART
// ==============================
function renderCart() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  const list = document.getElementById("cart-items");
  const totalEl = document.getElementById("cart-total");
  const container = document.getElementById("cart-container");
  const empty = document.getElementById("empty-cart-text");

  if (!list || !totalEl || !container) return;

  list.innerHTML = "";
  let total = 0;

  if (cart.length === 0) {
    container.style.display = "none";
    if (empty) empty.style.display = "block";
    return;
  }

  container.style.display = "block";
  if (empty) empty.style.display = "none";

  cart.forEach((item, i) => {
    let li = document.createElement("li");

    let nama = item.name || item.game;
    let detail = item.detail || item.nominal;
    let harga = item.price || item.harga;

    li.innerHTML = `
      ${nama} - ${detail} (Rp${formatRupiah(harga)})
      <button onclick="removeFromCart(${i})">❌</button>
    `;

    list.appendChild(li);
    total += harga;
  });

  totalEl.textContent = "Rp" + formatRupiah(total);
}

// ==============================
// INPUT NOMINAL TOPUP
// ==============================
let selectedGame = "";
let selectedNominal = 0;
let selectedDetail = "";

function selectNominal(game, price, detail) {
  selectedGame = game;
  selectedNominal = price;
  selectedDetail = detail;
  tampilPopup(`${game} - ${detail} dipilih (Rp${formatRupiah(price)})`);
}

function addTopup(game) {
  let userId, serverId;

  if (game === "Mobile Legend") {
    userId = document.getElementById("ml-id").value;
    serverId = document.getElementById("ml-server").value;
  } else if (game === "Free Fire") {
    userId = document.getElementById("ff-id").value;
    serverId = document.getElementById("ff-server").value;
  } else if (game === "Genshin Impact") {
    userId = document.getElementById("gi-id").value;
    serverId = document.getElementById("gi-server").value;
  }

  if (!userId || !serverId) {
    tampilPopup("ID dan Server wajib diisi!");
    return;
  }

  if (!selectedNominal) {
    tampilPopup("Pilih nominal top-up terlebih dahulu!");
    return;
  }

let cart = JSON.parse(localStorage.getItem("cart")) || [];
cart.push({
  name: game,
  detail: selectedDetail,
  price: selectedNominal,
  userId: userId,
  server: serverId
});

localStorage.setItem("cart", JSON.stringify(cart));

// 🔥 INI WAJIB ADA
updateCartCount();

tampilPopup(
  `Top-up ${game} berhasil ditambahkan!\nNominal: Rp${formatRupiah(selectedNominal)}`
);
}

// ==============================
// METODE PEMBAYARAN DINAMIS
// ==============================
document.addEventListener("DOMContentLoaded", function () {

  const paymentRadios = document.querySelectorAll(".pay-radio");
  const inputSection = document.getElementById("input-section");
  const info = document.getElementById("info-transfer");
  const nomorTujuan = document.getElementById("nomor-tujuan");
  const qrisSection = document.getElementById("qris-section");

  function generateQris() {
    const qrisBox = document.getElementById("qris-code");
    if (!qrisBox) return;

    qrisBox.innerHTML = "";

    const qrisID = "QRIS-" + Math.random().toString(36).substring(2, 12);

    new QRCode(qrisBox, {
      text: qrisID,
      width: 200,
      height: 200,
    });
  }

  paymentRadios.forEach(radio => {
    radio.addEventListener("change", function () {

      inputSection.style.display = "block";
      bankList.style.display = "none";
      qrisSection.style.display = "none";

      info.innerText = "";
      nomorTujuan.innerText = "";

      if (this.value === "Dana") {
        info.innerText = "Transfer ke nomor berikut:";
        nomorTujuan.innerText = "0895-3212-93274";
      }

      else if (this.value === "Gopay") {
        info.innerText = "Transfer ke nomor berikut:";
        nomorTujuan.innerText = "0895-3212-93274";
      }

      else if (this.value === "Qris") {
        inputSection.style.display = "none";
        qrisSection.style.display = "block";
        generateQris();
      }

    });
  });

});

// ==============================
// POPUP
// ==============================
function tampilPopup(pesan, jumlah = null) {

  if (jumlah !== null) {
    pesan = pesan.replace("{jumlah}", "Rp" + formatRupiah(jumlah));
  }

  document.getElementById("popup-text").innerText = pesan;
  document.getElementById("popup").style.display = "flex";
}

function tutupPopup() {
  document.getElementById("popup").style.display = "none";
}

// ==============================
// CHECKOUT
// ==============================
function initCheckout() {
  const btn = document.querySelector(".buy-btn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];

    if (cart.length === 0) {
      tampilPopup("Keranjang kosong!");
      return;
    }

    const payment = document.querySelector('input[name="payment"]:checked');
    if (!payment) {
      tampilPopup
    `✅ ${game} berhasil masuk keranjang!\nRp${formatRupiah(selectedData.harga)}`
      return;
    }

    tampilPopup("Checkout berhasil!");
    setTimeout(showReceipt, 500);
  });
}

// ==============================
// SEARCH
// ==============================

document.addEventListener("DOMContentLoaded", () => {
  initSearch();
});

function initSearch() {
  const searchInput = document.getElementById("searchInput");
  const cards = document.querySelectorAll(".product");

  if (!searchInput || cards.length === 0) return;

  searchInput.addEventListener("input", function () {
    const keyword = this.value.toLowerCase().trim();
    let found = false;

    cards.forEach(card => {
      const title = card.querySelector("h2").textContent.toLowerCase();

      if (title.includes(keyword)) {
        card.style.display = ""; // 🔥 reset ke default (INI PENTING)
        found = true;
      } else {
        card.style.display = "none";
      }
    });

    let noResult = document.getElementById("no-result");

    if (!found && keyword !== "") {
      if (!noResult) {
        let div = document.createElement("div");
        div.id = "no-result";
        div.innerText = "😢 Game tidak ditemukan";
        div.style.textAlign = "center";
        div.style.color = "white";
        div.style.marginTop = "20px";
        document.querySelector(".container").appendChild(div);
      }
    } else {
      if (noResult) noResult.remove();
    }
  });
}

// ==============================
// NOMINAL
// ==============================
let selectedData = {};

function selectNominal(game, harga, nominal) {
  selectedData = { game, harga, nominal };

  // kasih efek aktif
  document.querySelectorAll(".nominal-card").forEach(card => {
    card.style.border = "1px solid rgba(255,102,178,0.4)";
  });

  event.target.style.border = "2px solid #00e0ff";
}

// ==============================
// TAMBAH KE KERANJANG
// ==============================
function addTopup(game) {
  let idInput = document.querySelector(`#${getGameId(game)}-id`);
  let serverInput = document.querySelector(`#${getGameId(game)}-server`);

  let id = idInput ? idInput.value : "";
  let server = serverInput ? serverInput.value : "";

  if (!id) {
    tampilPopup("⚠️ ID harus diisi!");
    return;
  }

  if (!selectedData.nominal) {
    tampilPopup("⚠️ Pilih nominal dulu!");
    return;
  }

  let cart = JSON.parse(localStorage.getItem("cart")) || [];

  cart.push({
    name: game,
    detail: selectedData.nominal,
    price: selectedData.harga,
    userId: id,
    server: server
  });

  localStorage.setItem("cart", JSON.stringify(cart));

  updateCartCount();

  tampilPopup(
    `✅ ${game} berhasil masuk keranjang!\nRp${formatRupiah(selectedData.harga)}`
  );
}

// ==============================
// HELPER GAME ID
// ==============================
function getGameId(game) {
  if (game === "Mobile Legend") return "ml";
  if (game === "Free Fire") return "ff";
  if (game === "Genshin Impact") return "gi";
}

// ==============================
// POPUP
// ==============================
function tampilPopup(text) {
  const popup = document.getElementById("popup");
  const txt = document.getElementById("popup-text");

  if (!popup || !txt) return;

  txt.innerText = text;
  popup.style.display = "flex";
}

function tutupPopup() {
  const popup = document.getElementById("popup");
  if (popup) popup.style.display = "none";
}

// ==============================
// CART COUNT (ANTI ERROR)
// ==============================
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const el = document.getElementById("cart-count");
  if (el) el.textContent = cart.length;
}

// ==============================
// INIT
// ==============================
document.addEventListener("DOMContentLoaded", () => {
  renderCart();
  initCheckout();
  updateCartCount();
});

// ==============================
// STRUK TRANSAKSI FIXED
// ==============================
function showReceipt() {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart.length === 0) return;

  const paymentInput = document.querySelector('input[name="payment"]:checked');
  const namaInput = document.getElementById("nama");
  const bankInput = document.querySelector('input[name="bank"]:checked');
  const username = localStorage.getItem("username") || "Guest";

  const nama = namaInput ? namaInput.value.trim() : "";
  const metode = paymentInput ? paymentInput.value : "";

  if (!metode) {
    tampilPopup("Pilih metode pembayaran dulu.");
    return;
  }

  let itemsHTML = "";
  let total = 0;

  cart.forEach(item => {
    let namaItem = item.name || item.game;
    let detail = item.detail || item.nominal;
    let harga = item.price || item.harga;

    itemsHTML += `
      <p>${namaItem} - ${detail} (Rp${formatRupiah(harga)})</p>
    `;

    total += harga;
  });

  document.getElementById("struk-date").innerText =
    "Tanggal: " + new Date().toLocaleString();

document.getElementById("struk-nama").innerText =
  "Nama: " + username;

  
  document.getElementById("struk-items").innerHTML = itemsHTML;

  document.getElementById("struk-total").innerHTML =
    "Total: Rp" + formatRupiah(total);

  document.getElementById("struk-payment").innerHTML =
    "Metode: " + metode;

  // BANK OPTIONAL
  if (metode === "Transfer Bank" && bankInput) {
    document.getElementById("struk-bank").innerHTML =
      "Bank: " + bankInput.value;
  } else {
    document.getElementById("struk-bank").innerHTML = "";
  }

  document.getElementById("struk-container").style.display = "flex";
}

// ==============================
// TUTUP STRUK
// ==============================
function closeReceipt() {
  document.getElementById("struk-container").style.display = "none";
  localStorage.removeItem("cart");

  updateCartCount();
  renderCart();
}

// ==============================
// QRIS DINAMIS (FIX CLEAN)
// ==============================

document.addEventListener("DOMContentLoaded", function () {

  const paymentRadios = document.querySelectorAll(".pay-radio");
  const inputSection = document.getElementById("input-section");

  const nomorInput = document.getElementById("nomor");
  const nomorLabel = document.getElementById("label-nomor");
  const bankList = document.getElementById("bank-list");
  const qrisSection = document.getElementById("qris-section");

  // 🔥 GENERATE QRIS
  function generateQris() {
    const qrisBox = document.getElementById("qris-code");
    if (!qrisBox) return "";

    qrisBox.innerHTML = "";

    const qrisID = "QRIS-" + Math.random().toString(36).substring(2, 12);

    new QRCode(qrisBox, {
      text: qrisID,
      width: 200,
      height: 200,
    });

    return qrisID;
  }

  // 🔥 EVENT PILIH METODE
  paymentRadios.forEach(radio => {
    radio.addEventListener("change", function () {

      if (inputSection) inputSection.style.display = "block";

      // reset semua
      if (nomorInput) nomorInput.style.display = "none";
      if (nomorLabel) nomorLabel.style.display = "none";
      if (bankList) bankList.style.display = "none";
      if (qrisSection) qrisSection.style.display = "none";

      // ======================
      // QRIS
      // ======================
      if (this.value === "Qris") {
        if (qrisSection) qrisSection.style.display = "block";

        const newID = generateQris();

        // simpan ID ke input (biar bisa masuk struk)
        if (nomorInput) nomorInput.value = newID;

        return;
      }

      // ======================
      // TRANSFER BANK
      // ======================
      if (this.value === "Transfer Bank") {
        if (nomorInput) nomorInput.style.display = "block";
        if (nomorLabel) nomorLabel.style.display = "block";
        if (bankList) bankList.style.display = "block";
        return;
      }

      // ======================
      // DANA / GOPAY
      // ======================
      if (nomorInput) nomorInput.style.display = "block";
      if (nomorLabel) nomorLabel.style.display = "block";
    });
  });

});

// ==============================
// UPDATE ANGKA KERANJANG OTOMATIS
// ==============================
function updateCartCount() {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  let count = cart.length;

  const cartCountElement = document.getElementById("cart-count");
  if (cartCountElement) {
    cartCountElement.textContent = count;
  }
}

// ==============================
// SYNC ANTAR TAB
// ==============================
window.addEventListener("storage", updateCartCount);


// ==============================
// LOGIN SYSTEM
// ==============================

function login() {
  const username = document.getElementById("username").value.trim();
  const error = document.getElementById("error-text");

  if (username === "") {
    error.style.display = "block";
    return;
  }

  // simpan username
  localStorage.setItem("username", username);

  // pindah halaman
  window.location.href = "Menu Utama.html";
}

// enter = login
document.getElementById("username").addEventListener("keypress", function(e) {
  if (e.key === "Enter") {
    login();
  }
});