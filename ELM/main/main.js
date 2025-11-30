// main.js

/* ===================================================
    1. LOCAL STORAGE & CART MANAGEMENT
    (No changes needed in this section)
    =================================================== */

const getCart = () => {
    const cart = localStorage.getItem('shoppingCart');
    // Return an empty array if cart is null, otherwise parse the JSON
    return cart ? JSON.parse(cart) : [];
};

const saveCart = (cart) => {
    localStorage.setItem('shoppingCart', JSON.stringify(cart));
    updateCartCount();
};

const updateCartCount = () => {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    
    // Update the cart link text on all pages
    const cartLink = document.getElementById('cart-link');
    if (cartLink) {
        cartLink.textContent = `CART (${totalItems})`;
    }
};

const addToCart = (product) => {
    let cart = getCart();
    // Use a simplified ID/Name combination to check for existing items
    const existingItem = cart.find(item => item.id === product.id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        // Ensure image is saved on new addition
        cart.push({
            ...product, 
            quantity: 1,
        image: product.image
        });
    }

    saveCart(cart);
};

// ----------------------------------------------------
// 2. RENDERING CART PAGE FUNCTIONS (cart.html)
// (No changes needed in this section)
// ----------------------------------------------------

// Helper function to format prices
const formatPrice = (price) => `$${price.toFixed(2)}`;

const renderCartItems = () => {
    const cart = getCart();
    const container = document.getElementById('cart-items-container');
    if (!container) return; // Stop if we're not on the cart page

    container.innerHTML = ''; // Clear existing content

    if (cart.length === 0) {
        container.innerHTML = '<p class="empty-cart">Your bag is currently empty.</p>';
        updateCartSummary(cart);
        return;
    }

    cart.forEach(item => {
        const itemElement = document.createElement('div');
        itemElement.classList.add('cart-item');
        
        const itemTotal = item.price * item.quantity;

        itemElement.innerHTML = `
            <div class="item-details">
                <img src="${item.image || ''}" alt="${item.name}" class="cart-item-image">
                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p>Size: ${item.size || 'N/A'}, Color: ${item.color || 'N/A'}</p> 
                </div>
            </div>
            
            <div class="item-controls">
                <p class="item-price">${formatPrice(itemTotal)}</p>
                <div class="quantity-control">
                    <button data-id="${item.id}" data-action="decrease">-</button>
                    <input type="number" value="${item.quantity}" min="1" readonly>
                    <button data-id="${item.id}" data-action="increase">+</button>
                </div>
                <span class="remove-item" data-id="${item.id}">Remove</span>
            </div>
        `;
        container.appendChild(itemElement);
    });
    
    updateCartSummary(cart);
};

const updateCartSummary = (cart) => {
    const subtotalElement = document.getElementById('cart-subtotal');
    const totalElement = document.getElementById('cart-total');
    const shippingElement = document.getElementById('cart-shipping'); 

    if (!subtotalElement || !totalElement) return;

    // Calculate subtotal
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    // Shipping logic: Free over $200, otherwise $15
    const shippingCost = subtotal >= 200 ? 0 : 15; 
    const total = subtotal + shippingCost;

    subtotalElement.textContent = formatPrice(subtotal);
    
    // Safely update shipping cost
    if (shippingElement) {
        shippingElement.textContent = shippingCost === 0 ? 'FREE' : formatPrice(shippingCost);
    }
    
    totalElement.textContent = formatPrice(total);
};

const addCartEventListeners = () => {
    const container = document.getElementById('cart-items-container');
    if (!container) return;

    // Listener is attached ONLY ONCE to the parent container
    container.addEventListener('click', (e) => {
        const target = e.target;
        const productId = target.dataset.id;
        
        if (!productId) return; 

        let cart = getCart();
        const itemIndex = cart.findIndex(item => item.id === productId);

        if (itemIndex === -1) return;

        if (target.dataset.action === 'increase') {
            cart[itemIndex].quantity += 1;
        } else if (target.dataset.action === 'decrease') {
            if (cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
            } else {
                cart.splice(itemIndex, 1);
            }
        } else if (target.classList.contains('remove-item')) {
            cart.splice(itemIndex, 1);
        }
        
        saveCart(cart);
        renderCartItems(); // Re-render the cart to show changes
    });
};


/* ===================================================
    3. PRODUCT PAGE LOGIC (index.html, na.html)
    =================================================== */

const setupProductPageListeners = () => {
    // Listen on the entire document or a main container
    const container = document.querySelector('.content-main') || document; 

    container.addEventListener('click', (e) => {
        const target = e.target;
        
        // --- NEW FIX: Check for the navigation CTA buttons and ALLOW them to navigate. ---
        // If the click target is a CTA button that is NOT specifically an 'Add to Bag' button, 
        // we exit here to allow the default anchor tag navigation.
        if (target.classList.contains('cta-button') && target.tagName === 'A') {
             // We can check textContent for extra safety, though target.tagName === 'A' is usually enough
             const navButtons = ['View Details', 'Explore New Arrivals', 'Shop Outerwear'];
             if (navButtons.includes(target.textContent.trim())) {
                 return; // Allow the default link behavior
             }
        }
        
        // Check if the click target is a button meant for ADDING TO CART
        // We ONLY care about the 'add-to-cart' class now.
        if (target.classList.contains('add-to-cart')) {
            
            // If the button is clicked, prevent the parent link from navigating!
            e.preventDefault();
            e.stopPropagation(); // Essential to stop the event from bubbling up to the anchor tag

            // Determine the product card context
            const card = target.closest('.product-card') || target.closest('.featured-product-section');
            if (!card) return;

            // --- USE DATA ATTRIBUTES IF AVAILABLE (Best for na.html) ---
            let productId = target.dataset.id;
            let productName = target.dataset.name;
            let productPrice = parseFloat(target.dataset.price);
            let productImage;

            if (!productId) {
                // --- FALLBACK: Scrape HTML for data (Used for index.html if no data- attributes) ---
                productName = card.querySelector('h3, h2').textContent.trim(); // Supports h3 in grid, h2 in featured
                // Use a more robust regex to handle various price formats (e.g., $6,580 USD)
                const priceText = card.querySelector('.price, .price-large').textContent.match(/[\d,.]+/)[0].replace(/,/g, '');
                productPrice = parseFloat(priceText);
                productId = productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            }
            
            // Capture image source
            const imgEl = card.querySelector('.product-image') || card.querySelector('img');
            productImage = imgEl ? imgEl.src : '';


            // Create product object
            const product = { id: productId, name: productName, price: productPrice, image: productImage };
            
            // Add to Cart Logic
            addToCart(product);

            // Visual Feedback
            const originalText = target.textContent;
            target.textContent = 'Added! ✅';
            target.disabled = true;

            setTimeout(() => {
                target.textContent = originalText;
                target.disabled = false;
            }, 1000); 
        } 
        
        // NOTE: The product card hover effect listeners and fallback button creation
        // have been moved out of this event listener to prevent performance issues.
    });
};


/* ===================================================
    4. MOUSE DRAG/SWIPE FUNCTIONALITY
    (No changes needed in this section)
    =================================================== */

const setupSwipeableSlider = () => {
    const slider = document.querySelector('.swipe-container');

    if (slider) {
        let isDown = false;
        let startX;
        let scrollLeft;

        // 1. Mouse Down (Start Drag)
        slider.addEventListener('mousedown', (e) => {
            isDown = true;
            slider.classList.add('active-drag');
            startX = e.pageX - slider.offsetLeft;
            scrollLeft = slider.scrollLeft;
        });

        // 2. Mouse Leave or Up (End Drag)
        document.addEventListener('mouseup', () => {
            isDown = false;
            if (slider) { // Check if slider still exists (relevant if running on another page)
                 slider.classList.remove('active-drag');
            }
        });
        
        slider.addEventListener('mouseleave', () => {
            if (isDown) { 
                slider.classList.remove('active-drag');
            }
        });

        // 3. Mouse Move (Dragging)
        document.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            e.preventDefault();
            
            const x = e.pageX - slider.offsetLeft;
            const walk = (x - startX) * 1.5;
            
            slider.scrollLeft = scrollLeft - walk;
        });
    }
};


/* ===================================================
    5. MASTER INITIALIZATION
    =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Initialize common header count
    updateCartCount(); 

    // Initialize logic specific to the current page
    if (document.getElementById('cart-items-container')) {
        // We are on cart.html
        renderCartItems();
        addCartEventListeners(); 
    } else {
        // We are on index.html (or another product page like na.html)
        setupProductPageListeners(); 
        setupSwipeableSlider();
    }
});