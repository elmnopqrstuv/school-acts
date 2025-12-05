// main.js


// ===================================================
// AUTHENTICATION CHECK - Redirect to login if not authenticated
// ===================================================

function checkAuthentication() {
    const currentUser = localStorage.getItem('currentUser');
    const currentPage = window.location.pathname;
    
    // List of public pages (no login required)
    const publicPages = [
        'login.html',
        'register.html',
        'main.html'
    ];
    
    // Check if current page is public
    const isPublicPage = publicPages.some(page => currentPage.includes(page));
    
    // If page is protected and user is NOT logged in, redirect to login
    if (!isPublicPage && !currentUser) {
        window.location.href = '../main/login.html';
    }
}

// Run auth check immediately when script loads
checkAuthentication();

// ===================================================

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
    // Listen on the main content or document as fallback
    const container = document.querySelector('.content-main') || document;

    container.addEventListener('click', (e) => {
        const target = e.target;

        // Allow navigation for CTAs that are real links (not add-to-cart)
        if (target.tagName === 'A' && target.classList.contains('cta-button')) {
            return; // allow default navigation
        }

        // ADD TO CART handling
        if (target.classList.contains('add-to-cart')) {
            // Prevent parent anchor navigation
            e.preventDefault();
            e.stopPropagation();

            // Support different card classes used on the site
            const card = target.closest('.product-card, .premium-product-card, .featured-product-section, .collection-card');

            // Read data attributes (support multiple naming styles)
            const productId = target.dataset.productId || target.dataset.id || '';
            const productName = target.dataset.productName || target.dataset.name || (card && (card.querySelector('h3, h2')?.textContent.trim())) || 'Product';
            const productPriceRaw = target.dataset.productPrice || target.dataset.price || '';
            const productPrice = productPriceRaw ? parseFloat(productPriceRaw) : (() => {
                // fallback: scrape price text from card
                try {
                    const priceText = (card && (card.querySelector('.product-price, .price, .price-large')?.textContent)) || '';
                    const match = priceText && priceText.match(/[\d,.]+/);
                    return match ? parseFloat(match[0].replace(/,/g, '')) : 0;
                } catch (err) { return 0; }
            })();

            // image fallback
            const imgEl = (card && (card.querySelector('img') || card.querySelector('.product-image'))) || null;
            const productImage = target.dataset.productImage || target.dataset.image || (imgEl ? imgEl.src : '');

            // Build product object and add to cart
            const finalId = productId || productName.toLowerCase().replace(/[^a-z0-9]/g, '-');
            const product = { id: finalId, name: productName, price: productPrice, image: productImage };

            addToCart(product);

            // Visual feedback for user
            const originalText = target.textContent;
            target.textContent = 'Added! ✅';
            target.disabled = true;
            setTimeout(() => {
                target.textContent = originalText;
                target.disabled = false;
            }, 900);
        }
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

// Override navigation links to check auth
document.addEventListener('DOMContentLoaded', function() {
    // Check Shop link
    const shopLinks = document.querySelectorAll('a[href="../shop-cart/shop.html"]');
    shopLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to shop');
                window.location.href = '../main/login.html';
            }
        });
    });

    // Check Collections link
    const collectionLinks = document.querySelectorAll('a[href="../collection/collection.html"]');
    collectionLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to view collections');
                window.location.href = '../main/login.html';
            }
        });
    });

    // Check Account link
    const accountLinks = document.querySelectorAll('a[href="../main/account.html"], a[href="account.html"]');
    accountLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to view your account');
                window.location.href = '../main/login.html';
            }
        });
    });

    // Check Cart link
    const cartLinks = document.querySelectorAll('a[href="../shop-cart/cart.html"], #cart-link');
    cartLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to view your cart');
                window.location.href = '../main/login.html';
            }
        });
    });

    // Check product detail links
    const productLinks = document.querySelectorAll('a[href*="../products/"]');
    productLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to view product details');
                window.location.href = '../main/login.html';
            }
        });
    });

    // Check New Arrivals link
    const naLinks = document.querySelectorAll('a[href="../new-arv/na.html"]');
    naLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            const currentUser = localStorage.getItem('currentUser');
            if (!currentUser) {
                e.preventDefault();
                alert('Please sign in or sign up to view new arrivals');
                window.location.href = '../main/login.html';
            }
        });
    });
});