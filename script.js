const productsList = document.getElementById("products-list");
const cartElements = document.getElementById("cart-elements");
const cartSection = document.getElementById("cart-section");
const emptySection = document.getElementById("cart-empty");
const cartCount = document.getElementById("cart-count");
const totalElement = document.querySelector(".total h2");

let allProducts = [];
let cartArray = [];
updateCartUI();
// Get data from JSON file
fetch("data.json")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    showProducts(data);
  });

// Show prodcuts in DOM
function showProducts(products) {
  productsList.innerHTML = "";
  products.forEach((item) => {
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

productsList.addEventListener("click", (e) => {
  const addBtn = e.target.closest(".add-to-cart");
  const increaseBtn = e.target.closest(".increase");
  const decreaseBtn = e.target.closest(".decrease");

  // Add to cart
  if (addBtn) {
    const card = addBtn.closest(".card");
    addProduct(card);
    addBtn.style.display = "none";
  }

  // Increase
  if (increaseBtn) {
    const card = increaseBtn.closest(".card");
    updateQuantity(card, "inc");
  }

  // Decrease
  if (decreaseBtn) {
    const card = decreaseBtn.closest(".card");
    updateQuantity(card, "dec");
    if (card.querySelector(".quantity").innerText == "0") {
      addBtn.style.display = "flex";
    }
  }
});

// Add product
function addProduct(card) {
  const name = card.querySelector("h4").innerText;
  const price = parseFloat(card.querySelector(".info span").innerText.slice(1));

  cartArray.push({ name, price, quantity: 1 });

  card.querySelector(".add-to-cart").classList.add("hidden");
  card.querySelector(".quantity-controls").classList.remove("hidden");

  updateCartUI();
}

// Increase or decrease product
function updateQuantity(card, type) {
  const name = card.querySelector("h4").innerText;
  const product = cartArray.find((p) => p.name === name);

  if (type === "inc") product.quantity++;
  if (type === "dec") product.quantity--;

  if (product.quantity <= 0) {
    cartArray = cartArray.filter((p) => p.name !== name);

    card.querySelector(".quantity-controls").classList.add("hidden");
    card.querySelector(".add-to-cart").classList.remove("hidden");
  } else {
    card.querySelector(".quantity").innerText = product.quantity;
  }

  updateCartUI();
}

// Update cart UI
function updateCartUI() {
  if (cartArray.length === 0) {
    cartSection.style.display = "none";
    emptySection.style.display = "flex";
    return;
  }

  cartSection.style.display = "flex";
  emptySection.style.display = "none";

  cartElements.innerHTML = "";

  let total = 0;

  cartArray.forEach((item) => {
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

// Confirm Box Logic
const popup = document.getElementById("confirmPopup");
const overlay = document.querySelector(".popup-overlay");
const confirmedItemsContainer = document.getElementById("confirmedItems");
const confirmedTotal = document.getElementById("confirmedTotal");
const confirmBtn = document.querySelector(".confirm-btn");

confirmBtn.addEventListener("click", () => {
  showConfirmPopup();
});

function showConfirmPopup() {
  confirmedItemsContainer.innerHTML = "";
  let total = 0;

  cartArray.forEach((item) => {
    const productData = allProducts.find((p) => p.name === item.name);
    const thumbnail = productData.image.thumbnail;

    const productTotal = (item.quantity * item.price).toFixed(2);
    total += parseFloat(productTotal);

    confirmedItemsContainer.innerHTML += `
      <div class="order">
        <div class="info">
          <img src="${thumbnail}" alt="${item.name}">
          <div class="text">
            <h4>${item.name}</h4>
            <span class="number">${item.quantity}x</span>
            <span class="price">@ $${item.price.toFixed(2)}</span>
          </div>
        </div>
        <div class="total-price">$${productTotal}</div>
      </div>
    `;
  });

  confirmedTotal.innerText = `$${total.toFixed(2)}`;

  popup.classList.remove("hidden");
  overlay.classList.remove("hidden");
}

document.getElementById("order-btn").addEventListener("click", () => {
  popup.classList.add("hidden");
  overlay.classList.add("hidden");

  cartArray = [];
  updateCartUI();
  document.querySelector(".success-msg").classList.remove("hidden");
  setTimeout(() => {
    document.querySelector(".success-msg").classList.add("hidden");
  }, 3000);
});
