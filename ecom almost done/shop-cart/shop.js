document.addEventListener('DOMContentLoaded', () => {

    // ===== PRODUCT DATABASE WITH CORRECT LINKS & IMAGES =====
    const PRODUCTS = [
        { 
            id: 'knitted-sweater', 
            name: 'Knitted Sweater', 
            price: 950, 
            category: 'outerwear', 
            image: '../images/collections/win-col/sweater.jpg',
            page: '../products/knitted-sweater.html'
        },
        { 
            id: 'chain-bracelet', 
            name: 'Chain Bracelet', 
            price: 220, 
            category: 'accessories', 
            image: '../images/products/chain-bracelet/product99378-3651_cropped.jpg',
            page: '../products/chain-bracelet.html'
        },
        { 
            id: 'cassandre-shirt', 
            name: 'Cassandre Shirt', 
            price: 450, 
            category: 'outerwear', 
            image: '../images/product1/Medium-826821Y217W9000_A.avif',
            page: '../products/cassandre-shirt.html'
        },
        { 
            id: 'joe-over-the-knee-boots', 
            name: 'Joe Over The Knee Boots', 
            price: 1800, 
            category: 'footwear', 
            image: '../images/product1/Medium-843730AAE901000_A.avif',
            page: '../products/joe-over-the-knee-boots.html'
        },
        { 
            id: 'high-rise-pants-wool', 
            name: 'High-Rise Pants In Wool', 
            price: 550, 
            category: 'trousers', 
            image: '../images/products/sig-trouser/trouser1.avif',
            page: '../products/high-rise-pants-wool.html'
        },
        { 
            id: 'leather-clutch', 
            name: 'Leather Clutch', 
            price: 200, 
            category: 'accessories', 
            image: '../images/products/leather clutch/clutch1.avif',
            page: '../products/leather-clutch.html'
        },
        { 
            id: 'suede-sneaker', 
            name: 'Suede Sneakers', 
            price: 400, 
            category: 'footwear', 
            image: '../images/products/sue-sne/suedesnea.jpg',
            page: '../products/suede-sneaker.html'
        },
        { 
            id: 'purple-ring-set', 
            name: 'Ring Set', 
            price: 75, 
            category: 'accessories', 
            image: '../images/products/puri/pu.webp',
            page: '../products/purple-ring-set.html'
        },
        { 
            id: 'geometric-earrings', 
            name: 'Geometric Earrings', 
            price: 80, 
            category: 'accessories', 
            image: '../images/products/earrings/13284469_fpx.webp',
            page: '../products/geometric-earrings.html'
        },
        { 
            id: 'silk-scarf', 
            name: 'Silk Scarf', 
            price: 190, 
            category: 'accessories', 
            image: '../images/products/silk-sca/shopping.webp',
            page: '../products/silk-scarf.html'
        },
        { 
            id: 'leather-backpack', 
            name: 'Black Backpack', 
            price: 450, 
            category: 'accessories', 
            image: '../images/products/backpack/Medium2-756285FACEO1000_A.avif',
            page: '../products/leather-backpack.html'
        },
        { 
            id: 'minimalist-belt', 
            name: 'Minimalist Belt', 
            price: 150, 
            category: 'accessories', 
            image: '../images/products/belt/b1.avif',
            page: '../products/minimalist-belt.html'
        },
        { 
            id: 'long-coat-cashmere', 
            name: 'Long Coat Cashmere', 
            price: 1200, 
            category: 'outerwear', 
            image: '../images/product1/Medium-842171Y3J461000_A.avif',
            page: '../products/long-coat-cashmere.html'
        },
        { 
            id: 'jacket-wool-cashmere', 
            name: 'Jacket Wool-Cashmere', 
            price: 1150, 
            category: 'outerwear', 
            image: '../images/product1/Medium-835102Y5K321000_A.avif',
            page: '../products/jacket-wool-cashmere.html'
        },
        { 
            id: 'suspender-wool-pants', 
            name: 'Suspender Wool Pants', 
            price: 1010, 
            category: 'trousers', 
            image: '../images/collections/win-col/p1.jpg',
            page: '../products/suspender-wool-pants.html'
        },
        { 
            id: 'leather-gloves', 
            name: 'Leather Gloves', 
            price: 110, 
            category: 'accessories', 
            image: '../images/collections/win-col/gloves1.jpg',
            page: '../products/leather-gloves.html'
        },
        { 
            id: 'croc-card-holder', 
            name: 'Croc-Card Holder', 
            price: 750, 
            category: 'accessories', 
            image: '../images/collections/adl-col/croc-card holder/adl1.1.webp',
            page: '../products/croc-card-holder.html'
        },
        { 
            id: 'merino-wool-beanie', 
            name: 'Merino Wool Beanie', 
            price: 50, 
            category: 'accessories', 
            image: '../images/collections/win-col/beanie.jpg',
            page: '../products/merino-wool-beanie.html'
        },
        { 
            id: 'shearling-lined-boots', 
            name: 'Shearling-Lined Boots', 
            price: 200, 
            category: 'footwear', 
            image: '../images/collections/win-col/boots1.jpg',
            page: '../products/shearling-lined-boots.html'
        },
        { 
            id: 'collar-in-feathers', 
            name: 'Collar In Feathers', 
            price: 850, 
            category: 'outerwear', 
            image: '../images/product1/Medium-8471173YT086300_A.avif',
            page: '../products/collar-in-feathers.html'
        },
    ];

    // ===== ELEMENTS =====
    const productGrid = document.getElementById('product-grid');
    const loadMoreBtn = document.getElementById('load-more-btn');
    const resultsCount = document.getElementById('results-count');
    const sortDropdown = document.getElementById('sort-dropdown');
    const priceMinInput = document.getElementById('price-min-input');
    const priceMaxInput = document.getElementById('price-max-input');
    const filterLinks = document.querySelectorAll('.filter-link');
    const cartLink = document.getElementById('cart-link');

    // ===== STATE =====
    let currentPage = 1;
    const productsPerPage = 9;
    let activeCategory = 'all';
    let activeSort = 'default';
    let minPrice = 50;
    let maxPrice = 5000;
    let allFilteredProducts = [];

    // ===== CART FUNCTIONS =====
    function getCart() {
        try {
            return JSON.parse(localStorage.getItem('shoppingCart')) || [];
        } catch (e) {
            return [];
        }
    }

    function saveCart(cart) {
        localStorage.setItem('shoppingCart', JSON.stringify(cart));
        updateCartDisplay();
    }

    function updateCartDisplay() {
        const cart = getCart();
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartLink.textContent = `Cart (${totalItems})`;
    }

    function addToCart(product) {
        let cart = getCart();
        const existingItem = cart.find(item => item.id === product.id);

        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                quantity: 1
            });
        }

        saveCart(cart);

        // Show feedback
        const btn = document.querySelector(`[data-product-id="${product.id}"]`);
        if (btn) {
            const originalText = btn.textContent;
            btn.textContent = 'Added ✅';
            btn.disabled = true;
            setTimeout(() => {
                btn.textContent = originalText;
                btn.disabled = false;
            }, 1200);
        }
    }

    // ===== FILTER & SORT FUNCTIONS =====
    function filterAndSort() {
        let filtered = PRODUCTS.filter(product => {
            const categoryMatch = activeCategory === 'all' || product.category === activeCategory;
            const priceMatch = product.price >= minPrice && product.price <= maxPrice;
            return categoryMatch && priceMatch;
        });

        // Sort
        if (activeSort === 'price-asc') {
            filtered.sort((a, b) => a.price - b.price);
        } else if (activeSort === 'price-desc') {
            filtered.sort((a, b) => b.price - a.price);
        } else if (activeSort === 'name-asc') {
            filtered.sort((a, b) => a.name.localeCompare(b.name));
        }

        allFilteredProducts = filtered;
        return filtered;
    }

    function renderProducts() {
        const start = 0;
        const end = currentPage * productsPerPage;
        const productsToShow = allFilteredProducts.slice(start, end);

        // Clear grid only on first page
        if (currentPage === 1) {
            productGrid.innerHTML = '';
        }

        if (productsToShow.length === 0 && currentPage === 1) {
            productGrid.innerHTML = '<div class="no-results" style="grid-column: 1 / -1;">No products found matching your filters.</div>';
            loadMoreBtn.style.display = 'none';
            resultsCount.textContent = 'No results';
            return;
        }

        // Render only NEW products for this page
        const previousEnd = (currentPage - 1) * productsPerPage;
        const newProducts = allFilteredProducts.slice(previousEnd, end);

        newProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <a href="${product.page}" class="product-link">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </a>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price-grid">$${product.price.toFixed(2)}</p>
                    <button class="add-to-bag-btn add-to-cart" data-product-id="${product.id}" type="button">Add to Bag</button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Show/hide load more button
        if (end >= allFilteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        resultsCount.textContent = `Showing ${Math.min(end, allFilteredProducts.length)} of ${allFilteredProducts.length} results`;
    }

    // ===== EVENT LISTENERS =====
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeCategory = link.dataset.filterValue;
            currentPage = 1;
            filterAndSort();
            renderProducts();
        });
    });

    sortDropdown.addEventListener('change', (e) => {
        activeSort = e.target.value;
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    priceMinInput.addEventListener('change', (e) => {
        minPrice = parseFloat(e.target.value);
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    priceMaxInput.addEventListener('change', (e) => {
        maxPrice = parseFloat(e.target.value);
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderProducts();
    });

        // ===== CART BUTTON HANDLER - ATTACH AFTER RENDERING =====
    function attachCartListeners() {
        const cartButtons = document.querySelectorAll('.add-to-cart');
        cartButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation();
                
                const productId = this.getAttribute('data-product-id');
                console.log('Adding product:', productId);
                
                const product = PRODUCTS.find(p => p.id === productId);
                if (product) {
                    console.log('Product found:', product.name);
                    addToCart(product);
                } else {
                    console.log('Product not found for ID:', productId);
                }
            });
        });
    }

    // ===== UPDATE RENDER FUNCTION =====
    function renderProducts() {
        const start = 0;
        const end = currentPage * productsPerPage;
        const productsToShow = allFilteredProducts.slice(start, end);

        // Clear grid only on first page
        if (currentPage === 1) {
            productGrid.innerHTML = '';
        }

        if (productsToShow.length === 0 && currentPage === 1) {
            productGrid.innerHTML = '<div class="no-results" style="grid-column: 1 / -1;">No products found matching your filters.</div>';
            loadMoreBtn.style.display = 'none';
            resultsCount.textContent = 'No results';
            return;
        }

        // Render only NEW products for this page
        const previousEnd = (currentPage - 1) * productsPerPage;
        const newProducts = allFilteredProducts.slice(previousEnd, end);

        newProducts.forEach(product => {
            const card = document.createElement('div');
            card.classList.add('product-card');
            card.innerHTML = `
                <a href="${product.page}" class="product-link">
                    <div class="product-image-container">
                        <img src="${product.image}" alt="${product.name}">
                    </div>
                </a>
                <div class="product-info">
                    <h3 class="product-name">${product.name}</h3>
                    <p class="product-price-grid">$${product.price.toFixed(2)}</p>
                    <button class="add-to-bag-btn add-to-cart" data-product-id="${product.id}" type="button">Add to Bag</button>
                </div>
            `;
            productGrid.appendChild(card);
        });

        // Show/hide load more button
        if (end >= allFilteredProducts.length) {
            loadMoreBtn.style.display = 'none';
        } else {
            loadMoreBtn.style.display = 'block';
        }

        resultsCount.textContent = `Showing ${Math.min(end, allFilteredProducts.length)} of ${allFilteredProducts.length} results`;

        // ATTACH LISTENERS AFTER RENDERING
        attachCartListeners();
    }

    // ===== EVENT LISTENERS =====
    filterLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            filterLinks.forEach(l => l.classList.remove('active'));
            link.classList.add('active');
            activeCategory = link.dataset.filterValue;
            currentPage = 1;
            filterAndSort();
            renderProducts();
        });
    });

    sortDropdown.addEventListener('change', (e) => {
        activeSort = e.target.value;
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    priceMinInput.addEventListener('change', (e) => {
        minPrice = parseFloat(e.target.value);
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    priceMaxInput.addEventListener('change', (e) => {
        maxPrice = parseFloat(e.target.value);
        currentPage = 1;
        filterAndSort();
        renderProducts();
    });

    loadMoreBtn.addEventListener('click', () => {
        currentPage++;
        renderProducts();
    });

    // ===== INITIALIZE =====
    updateCartDisplay();
    filterAndSort();
    renderProducts();
});