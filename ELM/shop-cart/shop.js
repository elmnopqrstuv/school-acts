document.addEventListener('DOMContentLoaded', () => {

    // --- I. CART FUNCTIONS (Keep these intact) ---
    const cartLink = document.querySelector('.cart-link');
    function getCart() {
        try {
            const cart = JSON.parse(localStorage.getItem('shoppingCart')) || [];
            const cartElement = document.getElementById('cart-link'); 
            if (cartElement) {
                const totalItems = cart.reduce((total, item) => total + item.quantity, 0); 
                cartElement.textContent = `CART (${totalItems})`;
            }
            return Array.isArray(cart) ? cart : [];
        } catch (e) { return []; }
    }
    function saveCart(cart) { localStorage.setItem('shoppingCart', JSON.stringify(cart)); }
    
    function updateCartCount() {
        getCart();
    }

    function addToCart(item) {
        let cart = getCart();
        const existingItem = cart.find(i => i.id === item.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1 });
        }
        saveCart(cart);
        updateCartCount();
        console.log(`Added ${item.name} to cart.`);
        alert(`${item.name} added to your bag!`);
    }
    
    updateCartCount();
    
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('add-to-cart')) {
            const button = e.target;
            const productData = {
                id: button.getAttribute('data-product-id'),
                name: button.getAttribute('data-product-name'),
                price: parseFloat(button.getAttribute('data-product-price')),
                image: button.getAttribute('data-product-image')
            };
            if (productData.id && productData.name && !isNaN(productData.price) && productData.image) {
                addToCart(productData);
            } else {
                console.error("Missing product data for cart addition.", productData);
            }
        }
    });

    // ===================================================
    // II. PRODUCT DATA MODEL (Add missing products here)
    // ===================================================

    const newProductData = [
        { 
            id: 'p8', 
            name: 'SIGNATURE TROUSERS', 
            price: 180, 
            category: 'trousers', 
            color: 'White',
            image: '../images/product1/signature_trousers.jpg'
        },
        { 
            id: 'p9', 
            name: 'LEATHER CLUTCH', 
            price: 520, 
            category: 'accessories', 
            color: 'Brown',
            image: '../images/product1/leather_clutch.jpg'
        },
        { 
            id: 'p10', 
            name: 'SUEDE SNEAKERS', 
            price: 290, 
            category: 'footwear', 
            color: 'Brown',
            image: '../images/product1/suede_sneakers.jpg'
        },
        { 
            id: 'p11', 
            name: 'RING SET', 
            price: 150, 
            category: 'accessories', 
            color: 'Black',
            image: '../images/product1/ring_set.jpg'
        },
        { 
            id: 'p12', 
            name: 'GEOMETRIC EARRINGS', 
            price: 95, 
            category: 'accessories', 
            color: 'Black',
            image: '../images/product1/geometric_earrings.jpg'
        },
    ];

    // ===================================================
    // III. PRODUCT RENDERING & INIT
    // ===================================================

    const productGrid = document.querySelector('.product-grid');

    function createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-category', product.category);
        card.setAttribute('data-color', product.color);
        card.setAttribute('data-price', product.price);
        card.setAttribute('data-id', product.id);

        card.innerHTML = `
            <a href="../products/product-detail.html?id=${product.id}" class="product-link">
                <div class="product-image-container">
                    <img src="${product.image}" alt="${product.name}">
                </div>
                <h4 class="product-name">${product.name}</h4>
                <p class="product-price-grid price">$${product.price}</p>
            </a>
            <button class="add-to-bag-btn add-to-cart"
                data-product-name="${product.name}" 
                data-product-price="${product.price}" 
                data-product-id="${product.id}"
                data-product-image="${product.image}">
                Add to Bag
            </button>
        `;
        return card;
    }
    
    newProductData.forEach(product => {
        if (!document.querySelector(`.product-card[data-id="${product.id}"]`)) {
            productGrid.appendChild(createProductCard(product));
        }
    });

    // --- IV. SHOP FILTERING AND "LOAD MORE" LOGIC (For shop.html) ---
    
    const allProductCards = Array.from(document.querySelectorAll('.product-listing-area .product-card'));
    
    // CONFIGURATION
    const productsPerPage = 9; // Number of products to load per click
    let currentPage = 1; // Tracks how many sets of 9 have been loaded
    let currentSort = 'default';
    let currentFilters = {
        category: 'all',
        color: null,
        minPrice: 50,
        maxPrice: 5000 
    };

    const sortDropdown = document.getElementById('sort-dropdown');
    const showingResults = document.getElementById('results-count'); 
    const paginationContainer = document.getElementById('pagination-controls'); 
    
    const isShopPage = document.querySelector('.shop-layout') !== null;
    
    if (isShopPage) {

        // Get the current sort value on initialization
        if (sortDropdown) {
             currentSort = sortDropdown.value;
        }
        
        // --- A. FILTERING & SORTING CORE FUNCTION ---

        function filterAndRenderProducts() {
            let filteredProducts = allProductCards.filter(card => {
                const cardCategory = card.getAttribute('data-category');
                const cardColor = card.getAttribute('data-color');
                const cardPrice = parseFloat(card.getAttribute('data-price'));

                const matchesCategory = currentFilters.category === 'all' || cardCategory === currentFilters.category;
                const matchesColor = !currentFilters.color || cardColor === currentFilters.color;
                const matchesPrice = cardPrice >= currentFilters.minPrice && cardPrice <= currentFilters.maxPrice;

                return matchesCategory && matchesColor && matchesPrice;
            });

            // 4. Sorting
            let sortedProducts = [...filteredProducts];
            
            switch (currentSort) {
                case 'price-asc':
                    sortedProducts.sort((a, b) => {
                        const priceA = parseFloat(a.getAttribute('data-price'));
                        const priceB = parseFloat(b.getAttribute('data-price'));
                        return priceA - priceB;
                    });
                    break;
                case 'price-desc':
                    sortedProducts.sort((a, b) => {
                        const priceA = parseFloat(a.getAttribute('data-price'));
                        const priceB = parseFloat(b.getAttribute('data-price'));
                        return priceB - priceA;
                    });
                    break;
                case 'name-asc':
                    // A-Z Sort Logic
                    sortedProducts.sort((a, b) => {
                        const nameA = a.querySelector('.product-name').textContent.toUpperCase();
                        const nameB = b.querySelector('.product-name').textContent.toUpperCase();
                        if (nameA < nameB) return -1;
                        if (nameA > nameB) return 1;
                        return 0;
                    });
                    break;
                // No 'default' case needed, as it defaults to the order in the HTML
            }
            
            // 5. Load More Logic: Determine the number of products to show
            const totalProducts = sortedProducts.length;
            const productsToShow = currentPage * productsPerPage;
            
            // 6. Rendering: Clear grid and re-append sorted/filtered products
            productGrid.innerHTML = ''; 
            sortedProducts.forEach(card => productGrid.appendChild(card));
            
            if (totalProducts > 0) {
                // Hide products that exceed the current loaded view limit
                sortedProducts.forEach((card, index) => {
                    const isVisible = index < productsToShow;
                    if (isVisible) {
                        card.classList.remove('hidden'); 
                    } else {
                        card.classList.add('hidden'); 
                    }
                });
            } else {
                productGrid.innerHTML = '<p class="no-results">No products found matching your criteria.</p>';
            }

            // 7. Update Status (Show X of Y results)
            const endResult = Math.min(productsToShow, totalProducts);
            
            if (totalProducts > 0) {
                showingResults.textContent = `Showing ${endResult} of ${totalProducts} Results`;
            } else {
                 showingResults.textContent = `Showing 0 of ${allProductCards.length} Results`;
            }

            // Update the "Load More" button
            updateLoadMoreButton(totalProducts, productsToShow);
        }

        // --- B. EVENT LISTENERS (MODIFIED) ---
        document.querySelectorAll('.filter-link, .color-swatch-small').forEach(filter => {
             filter.addEventListener('click', function(e) {
                 e.preventDefault();
                 const filterType = this.parentElement.closest('[data-filter-type]').getAttribute('data-filter-type');
                 const filterValue = this.getAttribute('data-filter-value');
                 const isCategory = filterType === 'category';

                 const filterGroup = this.parentElement.closest('.filter-group');
                 
                 if (isCategory) {
                     filterGroup.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                     this.classList.add('active');
                     currentFilters.category = filterValue;
                 } else { // Color
                     const parentOptions = filterGroup.querySelectorAll('.color-swatch-small');
                     
                     if (this.classList.contains('active') && currentFilters.color === filterValue) {
                         this.classList.remove('active');
                         currentFilters.color = null;
                     } else {
                         parentOptions.forEach(el => el.classList.remove('active'));
                         this.classList.add('active');
                         currentFilters.color = filterValue;
                     }
                 }
                 
                 // FIX: currentPage resets, but currentSort IS NOT reset here, 
                 // it retains the value from the dropdown. This is the intended fix.
                 currentPage = 1; 
                 filterAndRenderProducts();
             });
         });
          
        if (sortDropdown) {
             sortDropdown.addEventListener('change', function() {
                 currentSort = this.value; // Update the sorting state immediately
                 currentPage = 1; // Always reset to page 1 when sorting changes
                 filterAndRenderProducts();
             });
        }
        
        const minInput = document.getElementById('price-min-input');
        const maxInput = document.getElementById('price-max-input');
        const rangeSlider = document.getElementById('price-range-slider');

        if (minInput && maxInput && rangeSlider) {
             currentFilters.minPrice = parseFloat(minInput.min);
             currentFilters.maxPrice = parseFloat(maxInput.max);
             minInput.value = currentFilters.minPrice;
             maxInput.value = currentFilters.maxPrice;
             rangeSlider.value = currentFilters.maxPrice;

             const handlePriceChange = () => {
                 const min = parseFloat(minInput.value);
                 let max = parseFloat(maxInput.value);
                 
                 if (max < min) {
                     max = min;
                     maxInput.value = min;
                 }

                 currentFilters.minPrice = min;
                 currentFilters.maxPrice = max;
                 rangeSlider.value = max; 
                 
                 currentPage = 1; // Reset page count when prices change
                 filterAndRenderProducts();
             };

             minInput.addEventListener('change', handlePriceChange);
             maxInput.addEventListener('change', handlePriceChange);
             rangeSlider.addEventListener('input', () => {
                 maxInput.value = rangeSlider.value;
             });
             rangeSlider.addEventListener('change', handlePriceChange);
        }
        
        // --- C. "LOAD MORE" FUNCTION ---
        function updateLoadMoreButton(totalProducts, productsCurrentlyShown) {
             paginationContainer.innerHTML = ''; // Clear old pagination

             if (productsCurrentlyShown < totalProducts) {
                 const loadMoreButton = document.createElement('button');
                 loadMoreButton.className = 'load-more-btn';
                 loadMoreButton.textContent = 'Load More Products';
                 loadMoreButton.addEventListener('click', function() {
                      currentPage++; // Increment the number of loaded pages
                      filterAndRenderProducts(); // Re-render to show the new set
                 });
                 paginationContainer.appendChild(loadMoreButton);
             } 
        }

        // Initial load for Shop Page
        filterAndRenderProducts();
    }
    
    // --- V. COLLECTION PAGE PAGINATION LOGIC (For collection.html) ---
    const collectionGrid = document.querySelector('.collection-grid');
    const collectionPagination = document.querySelector('.collection-pagination-placeholder');

    if (collectionGrid && collectionPagination) {
        const collectionCards = Array.from(collectionGrid.querySelectorAll('.product-card'));
        const collectionItemsPerPage = 16; 
        const totalCollectionPages = Math.ceil(collectionCards.length / collectionItemsPerPage);
        let currentCollectionPage = 1;

        function renderCollectionPage() {
            const startIndex = (currentCollectionPage - 1) * collectionItemsPerPage;
            const endIndex = startIndex + collectionItemsPerPage;

            collectionCards.forEach((card, index) => {
                if (index >= startIndex && index < endIndex) {
                    card.style.display = ''; 
                } else {
                    card.style.display = 'none'; 
                }
            });

            collectionPagination.querySelectorAll('a').forEach(link => {
                link.classList.remove('active');
                if (link.textContent === String(currentCollectionPage)) {
                    link.classList.add('active');
                }
            });
        }

        collectionPagination.addEventListener('click', function(e) {
            if (e.target.tagName === 'A') {
                e.preventDefault();
                const text = e.target.textContent;

                if (text === '>') {
                    if (currentCollectionPage < totalCollectionPages) {
                        currentCollectionPage++;
                    }
                } else if (text === '<') {
                    if (currentCollectionPage > 1) {
                        currentCollectionPage--;
                    }
                } else if (!isNaN(parseInt(text))) {
                    currentCollectionPage = parseInt(text);
                }
                
                renderCollectionPage();
            }
        });

        renderCollectionPage();
    }
});