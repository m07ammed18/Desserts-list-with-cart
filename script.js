const productList = document.getElementById("productList");
const filterSelect = document.getElementById("filter");
const resultCount = document.getElementById("resultCount");

let allProducts = [];

// قراءة JSON
fetch("data.json")
  .then((response) => response.json())
  .then((data) => {
    allProducts = data;
    populateCategories(data);
    renderProducts(data);
  });
// عرض المنتجات
function renderProducts(products) {
  productList.innerHTML = ""; // clear

  products.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
      <img src="${item.image.tablet}" alt="${item.name}">
      <h4>${item.name}</h4>
      <p>${item.category}</p>
      <strong>$${item.price.toFixed(2)}</strong>
    `;

    productList.appendChild(card);
  });

  resultCount.textContent = `Showing: ${products.length} item(s)`;
}

// ملء قائمة الفئات من JSON ✅
function populateCategories(data) {
  const categories = [...new Set(data.map((item) => item.category))];

  categories.forEach((category) => {
    const option = document.createElement("option");
    option.value = category;
    option.textContent = category;
    filterSelect.appendChild(option);
  });
}

// حدث الفلترة
filterSelect.addEventListener("change", () => {
  const selected = filterSelect.value;

  if (selected === "all") {
    renderProducts(allProducts);
  } else {
    const filtered = allProducts.filter((item) => item.category === selected);
    renderProducts(filtered);
  }
});
