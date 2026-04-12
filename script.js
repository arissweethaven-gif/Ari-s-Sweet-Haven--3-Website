let cart = [];

function addToCart(name, price) {
  const existingItem = cart.find((item) => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter((item) => item.name !== name);
  updateCart();
}

function updateCart() {
  const cartItemsContainer = document.getElementById("cart-items");
  const subtotalElement = document.getElementById("subtotal");
  const totalElement = document.getElementById("total");
  const serviceTypeSelect = document.getElementById("serviceType");

  if (!cartItemsContainer || !subtotalElement || !totalElement || !serviceTypeSelect) {
    return;
  }

  const serviceType = serviceTypeSelect.value;
  let subtotal = 0;

  cartItemsContainer.innerHTML = "";

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = "<p>Your cart is empty.</p>";
  } else {
    cart.forEach((item) => {
      const itemTotal = item.price * item.quantity;
      subtotal += itemTotal;

      const itemDiv = document.createElement("div");
      itemDiv.classList.add("cart-item");

      itemDiv.innerHTML = `
        <span>${item.name} x ${item.quantity}</span>
        <span>$${itemTotal.toFixed(2)}</span>
        <button type="button" onclick="removeFromCart('${item.name.replace(/'/g, "\\'")}')">Remove</button>
      `;

      cartItemsContainer.appendChild(itemDiv);
    });
  }

  let extraFee = 0;
  if (serviceType === "delivery") extraFee = 5;
  if (serviceType === "shipping") extraFee = 8;

  const total = subtotal + extraFee;

  subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
  totalElement.textContent = `$${total.toFixed(2)}`;
}

function togglePaymentInfo() {
  const paymentMethodSelect = document.getElementById("paymentMethod");
  const paypalInfo = document.getElementById("paypal-info");
  const zelleInfo = document.getElementById("zelle-info");

  if (!paymentMethodSelect || !paypalInfo || !zelleInfo) {
    return;
  }

  const paymentMethod = paymentMethodSelect.value;

  paypalInfo.classList.add("hidden");
  zelleInfo.classList.add("hidden");

  if (paymentMethod === "paypal") {
    paypalInfo.classList.remove("hidden");
  } else if (paymentMethod === "zelle") {
    zelleInfo.classList.remove("hidden");
  }
}

function submitOrder(event) {
  event.preventDefault();

  const messageBox = document.getElementById("order-message");
  const customerNameInput = document.getElementById("customerName");
  const paymentMethodSelect = document.getElementById("paymentMethod");

  if (!messageBox || !customerNameInput || !paymentMethodSelect) {
    return;
  }

  if (cart.length === 0) {
    messageBox.style.display = "block";
    messageBox.textContent = "Please add at least one item to your cart before submitting.";
    return;
  }

  const name = customerNameInput.value;
  const paymentMethod = paymentMethodSelect.value;

  if (!paymentMethod) {
    messageBox.style.display = "block";
    messageBox.textContent = "Please select a payment method.";
    return;
  }

  messageBox.style.display = "block";
  messageBox.textContent = `Thank you, ${name}! Your order request has been submitted. Your order will be confirmed once payment is received.`;

  event.target.reset();
  cart = [];
  updateCart();
  togglePaymentInfo();
}