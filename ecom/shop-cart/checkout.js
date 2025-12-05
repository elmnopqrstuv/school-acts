document.addEventListener('DOMContentLoaded', () => {
    const shippingForm = document.getElementById('shipping-form');
    const paymentForm = document.getElementById('payment-form');
    const placeOrderButton = document.getElementById('place-order-button');
    const checkoutProductList = document.getElementById('checkout-product-list');
    const checkoutSubtotal = document.getElementById('checkout-subtotal');
    const checkoutTotal = document.getElementById('checkout-total');
    const checkoutMessage = document.getElementById('checkout-message');
    const savedAddressesSection = document.getElementById('saved-addresses-section');
    const savedAddressesList = document.getElementById('saved-addresses-list');
    const useNewAddressBtn = document.getElementById('use-new-address-btn');
    const cancelNewAddressBtn = document.getElementById('cancel-new-address-btn');
    const newAddressForm = document.getElementById('new-address-form');
    const addressDisplay = document.getElementById('address-display');

    let selectedAddress = null;
    let usingNewAddress = false;

    // Get cart from localStorage
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('shoppingCart')) || [];
        } catch (e) {
            console.error("Error retrieving cart:", e);
            return [];
        }
    }

    // Get order history from localStorage
    function getOrderHistory() {
        try {
            return JSON.parse(localStorage.getItem('orderHistory')) || [];
        } catch (e) {
            console.error("Error retrieving order history:", e);
            return [];
        }
    }

    // Save order to history
    function saveOrder(orderData) {
        let orders = getOrderHistory();
        orders.push(orderData);
        localStorage.setItem('orderHistory', JSON.stringify(orders));
    }

    let cartData = getCart();

    // Load saved addresses
    function loadSavedAddresses() {
        const savedAddresses = JSON.parse(localStorage.getItem('savedAddresses')) || [];

        if (savedAddresses.length === 0) {
            savedAddressesSection.style.display = 'none';
            newAddressForm.classList.add('show');
            usingNewAddress = true;
            return;
        }

        savedAddressesSection.style.display = 'block';
        savedAddressesList.innerHTML = '';

        savedAddresses.forEach((address, index) => {
            const addressDiv = document.createElement('div');
            addressDiv.classList.add('address-option');
            addressDiv.innerHTML = `
                <label class="address-option-label">
                    <input type="radio" name="saved-address" value="${index}" data-address='${JSON.stringify(address)}'>
                    <div class="address-info">
                        <div class="address-type-badge">${address.type}</div>
                        <div class="address-info-text">
                            <strong>${address.name}</strong><br>
                            ${address.street}<br>
                            ${address.city}, ${address.state} ${address.zip}<br>
                            ${address.country}<br>
                            ${address.phone}
                        </div>
                    </div>
                </label>
            `;

            const radio = addressDiv.querySelector('input[type="radio"]');
            radio.addEventListener('change', () => {
                selectedAddress = JSON.parse(radio.dataset.address);
                newAddressForm.classList.remove('show');
                usingNewAddress = false;
                displayAddress(selectedAddress);
                updateButtonState();
                document.querySelectorAll('.address-option').forEach(opt => opt.classList.remove('active'));
                addressDiv.classList.add('active');
            });

            savedAddressesList.appendChild(addressDiv);
        });

        // Pre-select first address
        const firstRadio = savedAddressesList.querySelector('input[type="radio"]');
        if (firstRadio) {
            firstRadio.checked = true;
            firstRadio.dispatchEvent(new Event('change'));
        }
    }

    // Display selected address
    function displayAddress(address) {
        addressDisplay.innerHTML = `
            <strong>${address.name}</strong><br>
            ${address.street}<br>
            ${address.city}, ${address.state} ${address.zip}<br>
            ${address.country}<br>
            ${address.phone}
        `;
        addressDisplay.style.display = 'block';
    }

    // Use new address
    useNewAddressBtn.addEventListener('click', () => {
        newAddressForm.classList.add('show');
        usingNewAddress = true;
        addressDisplay.style.display = 'none';
        document.querySelectorAll('.address-option').forEach(opt => opt.classList.remove('active'));
        document.querySelectorAll('input[name="saved-address"]').forEach(radio => radio.checked = false);
    });

    cancelNewAddressBtn.addEventListener('click', () => {
        newAddressForm.classList.remove('show');
        usingNewAddress = false;
        const firstRadio = savedAddressesList.querySelector('input[type="radio"]');
        if (firstRadio) {
            firstRadio.checked = true;
            firstRadio.dispatchEvent(new Event('change'));
        }
    });

    // Load order summary
    function loadOrderSummary() {
        if (cartData.length === 0) {
            checkoutProductList.innerHTML = '<p style="color:var(--color-text-accent);">Your cart is empty. Please return to the shop.</p>';
            placeOrderButton.disabled = true;
            return;
        }

        checkoutProductList.innerHTML = '';
        let subtotal = 0;

        cartData.forEach(item => {
            const itemTotal = item.price * item.quantity;
            subtotal += itemTotal;

            const itemElement = document.createElement('div');
            itemElement.classList.add('summary-item');
            itemElement.innerHTML = `
                <img src="${item.image || ''}" alt="${item.name}" class="summary-item-image">
                <div class="summary-item-details">
                    <div class="name">${item.name}</div>
                    <div class="price">Qty: ${item.quantity} × $${item.price.toFixed(2)} = $${itemTotal.toFixed(2)}</div>
                </div>
            `;
            checkoutProductList.appendChild(itemElement);
        });

        const shipping = 0;
        const total = subtotal + shipping;

        checkoutSubtotal.textContent = `$${subtotal.toFixed(2)}`;
        checkoutTotal.textContent = `$${total.toFixed(2)}`;
        placeOrderButton.textContent = `Place Order - $${total.toFixed(2)}`;
    }

    // Form validation
    function updateButtonState() {
        const isPaymentValid = paymentForm.checkValidity();
        const hasAddress = selectedAddress || usingNewAddress;

        // If using new address, validate new address fields
        if (usingNewAddress) {
            const name = document.getElementById('checkout-name').value;
            const phone = document.getElementById('checkout-phone').value;
            const address = document.getElementById('checkout-address').value;
            const city = document.getElementById('checkout-city').value;
            const zip = document.getElementById('checkout-zip').value;
            const hasNewAddress = name && phone && address && city && zip;
            
            if (isPaymentValid && hasNewAddress && cartData.length > 0) {
                placeOrderButton.disabled = false;
            } else {
                placeOrderButton.disabled = true;
            }
        } else {
            if (isPaymentValid && hasAddress && cartData.length > 0) {
                placeOrderButton.disabled = false;
            } else {
                placeOrderButton.disabled = true;
            }
        }
    }

    paymentForm.addEventListener('input', updateButtonState);
    document.getElementById('checkout-name').addEventListener('input', updateButtonState);
    document.getElementById('checkout-phone').addEventListener('input', updateButtonState);
    document.getElementById('checkout-address').addEventListener('input', updateButtonState);
    document.getElementById('checkout-city').addEventListener('input', updateButtonState);
    document.getElementById('checkout-zip').addEventListener('input', updateButtonState);

    // Place order
    placeOrderButton.addEventListener('click', (e) => {
        e.preventDefault();

        if (placeOrderButton.disabled || cartData.length === 0) return;

        let shippingData;

        if (selectedAddress) {
            shippingData = selectedAddress;
        } else {
            // New address
            shippingData = {
                name: document.getElementById('checkout-name').value,
                phone: document.getElementById('checkout-phone').value,
                street: document.getElementById('checkout-address').value,
                city: document.getElementById('checkout-city').value,
                state: document.getElementById('checkout-state').value,
                zip: document.getElementById('checkout-zip').value,
                country: document.getElementById('checkout-country').value,
                type: 'Checkout'
            };
        }

        // Create order object
        const order = {
            id: 'ORD-' + Date.now(),
            date: new Date().toLocaleDateString(),
            items: cartData,
            subtotal: parseFloat(checkoutSubtotal.textContent.replace('$', '')),
            total: parseFloat(checkoutTotal.textContent.replace('$', '')),
            shipping: shippingData,
            status: 'Processing'
        };

        // Save to order history
        saveOrder(order);

        // Clear cart
        localStorage.removeItem('shoppingCart');

        // Show success message
        checkoutMessage.textContent = '✅ Order Placed Successfully! Order ID: ' + order.id + '. Redirecting to order history...';
        checkoutMessage.classList.remove('hidden-message');
        checkoutMessage.style.display = 'block';

        // Redirect to order history after 2 seconds
        setTimeout(() => {
            window.location.href = '../main/account-orders.html';
        }, 2000);
    });

    // Initialize
    loadSavedAddresses();
    loadOrderSummary();
    updateButtonState();
});