const productsList = document.getElementById("products-list");
const cartElements = document.getElementById("cart-elements");
const cartSection = document.getElementById("cart-section");
const emptySection = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const totalElement = document.querySelector(".total h2");

let cartArray = [];
let allProducts = [];

// تحميل المنتجات من data.json
fetch("data.json")
  .then(res => res.json())
  .then(data => {
    allProducts = data;
    showProducts(data);
  });

// ✅ عرض المنتجات في الصفحة
function showProducts(products) {
  productsList.innerHTML = "";
  products.forEach(item => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${item.image.desktop}" alt="${item.name}">
      <div class="cart-btn">
        <button class="add-to-cart">
          <img src="./assets/images/icon-add-to-cart.svg" alt="">
          <span>Add to cart</span>
        </button>

        <div class="quantity-controls hidden">
          <button class="decrease"><img src="./assets/images/icon-decrement-quantity.svg" alt=""></button>
          <span class="quantity">1</span>
          <button class="increase"><img src="./assets/images/icon-increment-quantity.svg" alt=""></button>
        </div>
      </div>

      <div class="info">
        <p class="category">${item.category}</p>
        <h4>${item.name}</h4>
        <span>$${item.price.toFixed(2)}</span>
      </div>
    `;

    productsList.appendChild(card);
  });
}

// ✅ Event Delegation (تحسين لتقليل عدد Listeners)
productsList.addEventListener("click", (e) => {

  const addBtn = e.target.closest(".add-to-cart");
  const increaseBtn = e.target.closest(".increase");
  const decreaseBtn = e.target.closest(".decrease");

  // إضافة للسلة
  if (addBtn) {
    const card = addBtn.closest(".card");
    addProduct(card);
    addBtn.style.display = "none";
  }

  // زيادة
  if (increaseBtn) {
    const card = increaseBtn.closest(".card");
    updateQuantity(card, "inc");
  }

  // إنقاص
  if (decreaseBtn) {
    const card = decreaseBtn.closest(".card");
    updateQuantity(card, "dec");
    if (card.querySelector(".quantity").innerText == "0") {
      addBtn.style.display = "flex";
    }
  }
});

// ✅ إضافة منتج
function addProduct(card) {
  const name = card.querySelector("h4").innerText;
  const price = parseFloat(card.querySelector("span").innerText.slice(1));

  cartArray.push({ name, price, quantity: 1 });

  card.querySelector(".add-to-cart").classList.add("hidden");
  card.querySelector(".quantity-controls").classList.remove("hidden");

  updateCartUI();
}

// ✅ زيادة أو إنقاص كمية المنتج
function updateQuantity(card, type) {
  const name = card.querySelector("h4").innerText;
  const product = cartArray.find(p => p.name === name);

  if (type === "inc") product.quantity++;
  if (type === "dec") product.quantity--;

  if (product.quantity <= 0) {
    cartArray = cartArray.filter(p => p.name !== name);

    card.querySelector(".quantity-controls").classList.add("hidden");
    card.querySelector(".add-to-cart").classList.remove("hidden");
  } else {
    card.querySelector(".quantity").innerText = product.quantity;
  }

  updateCartUI();
}

// ✅ تحديث واجهة السلة الجانبية
function updateCartUI() {

  if (cartArray.length === 0) {
    cartSection.style.display = "none";
    emptySection.style.display = "block";
    return;
  }

  cartSection.style.display = "block";
  emptySection.style.display = "none";

  cartElements.innerHTML = "";

  let total = 0;

  cartArray.forEach(item => {
    const productTotal = item.quantity * item.price;
    total += productTotal;

    cartElements.innerHTML += `
      <div class="element">
        <div class="element-info">
          <h4>${item.name}</h4>
          <p>
            <span class="number">${item.quantity}x</span>
            <span class="price">@ $${item.price}</span>
            <span class="total-price">$${productTotal.toFixed(2)}</span>
          </p>
        </div>
      </div>
    `;
  });

  cartCount.innerText = `(${cartArray.length})`;
  totalElement.innerText = `$${total.toFixed(2)}`;
}
