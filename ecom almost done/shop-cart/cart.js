document.addEventListener('DOMContentLoaded', () => {

    // --- MAPPING CHANGES ---
    // Note: These selectors may need to be updated to match the minimal cart.html changes (e.g., from 'cart-subtotal' to 'subtotal')
    const cartItemsContainer = document.getElementById('cart-items-container');
    const emptyCartMessage = document.querySelector('.empty-cart');
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const cartLink = document.getElementById('cart-link');

    // --- I. CORE CART STORAGE FUNCTIONS (No changes needed) ---

    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            return Array.isArray(cart) ? cart : [];
        } catch (e) {
            console.error("Error retrieving cart from localStorage:", e);
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartCountDisplay(cart);
    }

    function updateCartCountDisplay(cart) {
        const currentCart = cart || getCart();
        const totalItems = currentCart.reduce((total, item) => total + item.quantity, 0);
        if (cartLink) {
            cartLink.textContent = `Cart (${totalItems})`;
        }
    }

    // --- NEW: FUNCTION TO RENDER A SINGLE ITEM (EDITED) ---

    function renderSingleItem(item) {
        const itemTotal = item.price * item.quantity;

        const cartItemHTML = `
            <div class="cart-item" data-product-id="${item.id}">
                <div class="item-details">
                    <div class="product-image-placeholder">
                        <img src="${item.image}" alt="${item.name}" width="100" height="100" style="object-fit: cover;">
                    </div>
                    <div class="item-info">
                        <h4>${item.name}</h4>
                        <p>QTY: ${item.quantity}</p>                         <p>$${item.price.toFixed(2)} each</p>
                    </div>
                </div>
                
                <div class="item-controls">
                    
                                        <div class="item-price">
                        $${itemTotal.toFixed(2)}
                    </div>
                    <a href="#" class="remove-item" data-id="${item.id}">Remove</a>
                </div>
            </div>
        `;
        
        // Use a temporary element to convert the string to a DOM node
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = cartItemHTML.trim();
        return tempDiv.firstChild;
    }


    // --- II. CART RENDERING AND CALCULATION (Modified to use renderSingleItem) ---

    function renderCart() {
        const cart = getCart();
        cartItemsContainer.innerHTML = ''; // This is only run on page load or on item removal
        let subtotal = 0;

        if (cart.length === 0) {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'block';
            }
            updateSummary(0);
            return;
        } else {
            if (emptyCartMessage) {
                emptyCartMessage.style.display = 'none';
            }
        }

        cart.forEach(item => {
            const itemElement = renderSingleItem(item);
            cartItemsContainer.appendChild(itemElement);
            subtotal += item.price * item.quantity;
        });

        updateSummary(subtotal);
        addCartEventListeners(); // Re-attach listeners, but only for the 'Remove' link now
    }

    function updateSummary(subtotal) {
        const shipping = 0.00; 
        const total = subtotal + shipping;

        subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
        totalElement.textContent = `$${total.toFixed(2)}`;
    }


    // --- III. EVENT HANDLERS (EDITED to remove quantity logic) ---

    // Removed: updateItemQuantity function (no longer needed)
    

    function removeItem(itemId) {
        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === itemId);

        if (itemIndex > -1) {
            cart.splice(itemIndex, 1);
            saveCart(cart);
            // Must re-render the whole cart on removal to easily clear listeners and container
            renderCart(); 
        }
    }
    
    function addCartEventListeners() {
        // Removed: Quantity Plus/Minus button listeners

        // Remove Item links
        document.querySelectorAll('.remove-item').forEach(link => {
            link.onclick = (e) => {
                e.preventDefault();
                const itemId = e.target.getAttribute('data-id');
                removeItem(itemId);
            };
        });
    }

    // --- IV. INITIALIZATION ---

    updateCartCountDisplay();
    renderCart();
});