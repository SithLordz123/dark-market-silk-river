const products = [
  { name: "Amazon Gift Card - $1000", priceUSD: 100, image: "https://i.imgur.com/AMAZONCARD.png" },
  { name: "Apple Gift Card - $1000", priceUSD: 100, image: "https://i.imgur.com/APPLECARD.png" },
  { name: "Steam Gift Card - $500", priceUSD: 50, image: "https://i.imgur.com/STEAMCARD.png" },
  { name: "Walmart Gift Card - $500", priceUSD: 50, image: "https://i.imgur.com/WALMARTCARD.png" },
  { name: "Visa Prepaid Card - $2000", priceUSD: 200, image: "https://i.imgur.com/VISACARD.png" }
];

let cart = [];
let btcRate = 0;

async function fetchBTCPrice() {
  try {
    const res = await fetch('https://api.coindesk.com/v1/bpi/currentprice/USD.json');
    const data = await res.json();
    btcRate = 1 / data.bpi.USD.rate_float;
    updateCart();
  } catch (err) {
    console.error('Error fetching BTC price:', err);
  }
}

function renderProducts() {
  const container = document.getElementById('products');
  products.forEach((product, index) => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}" />
      <h3>${product.name}</h3>
      <p>Price: $${product.priceUSD}</p>
      <button onclick="addToCart(${index})">Add to Cart</button>
    `;
    container.appendChild(div);
  });
}

function addToCart(index) {
  cart.push(products[index]);
  updateCart();
}

function updateCart() {
  const cartList = document.getElementById('cart-items');
  const totalUSD = cart.reduce((sum, item) => sum + item.priceUSD, 0);
  const totalBTC = (totalUSD * btcRate).toFixed(6);

  cartList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.priceUSD}`;
    cartList.appendChild(li);
  });

  document.getElementById('total-usd').textContent = totalUSD;
  document.getElementById('total-btc').textContent = totalBTC;

  document.getElementById('checkout-btn').disabled = cart.length === 0;
}

document.getElementById('checkout-btn').addEventListener('click', () => {
  const email = document.getElementById('email').value;
  if (!email) return alert('Please enter your email.');

  document.getElementById('cart').style.display = 'none';
  document.getElementById('checkout').style.display = 'block';

  document.getElementById('receipt-email').textContent = email;
  document.getElementById('checkout-total-usd').textContent = cart.reduce((sum, item) => sum + item.priceUSD, 0);
  document.getElementById('checkout-total-btc').textContent = (cart.reduce((sum, item) => sum + item.priceUSD, 0) * btcRate).toFixed(6);

  const checkoutList = document.getElementById('checkout-cart-items');
  checkoutList.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.priceUSD}`;
    checkoutList.appendChild(li);
  });
});

renderProducts();
fetchBTCPrice();
setInterval(fetchBTCPrice, 30000); // Refresh BTC rate every 30 seconds
