// product-detail.js - Dynamic Price & Product Page Interactivity

const setupProductDetailListeners = () => {
    
    // ----------------------------------------------------------------------
    // --- 1. DYNAMIC DATA LOADING ---
    // ----------------------------------------------------------------------

    // Check if PRODUCTS_DATA (from products.js) is defined
    if (typeof PRODUCTS_DATA === 'undefined') {
        console.error("FATAL ERROR: PRODUCTS_DATA is not defined. Ensure products.js is linked before product-detail.js.");
        return; 
    }

    const currentPath = window.location.pathname;
    const currentFile = currentPath.substring(currentPath.lastIndexOf('/') + 1);

    // Find the current product object using its filename
    const currentProduct = PRODUCTS_DATA.find(p => p.file === currentFile);

    if (!currentProduct) {
        console.error("Error: Could not find product data for file:", currentFile);
        return; 
    }

    // Use the price from the data object for all calculations
    let currentPrice = currentProduct.price; 
    
    // --- 2. Element Selectors & Initialization ---
    const colorSwatches = document.querySelectorAll('.color-swatch');
    const sizeButtons = document.querySelectorAll('.size-button');
    const selectedColorName = document.getElementById('selected-color-name');
    const selectedSize = document.getElementById('selected-size');
    const ctaButton = document.getElementById('add-to-bag-button');
    const mainProductImage = document.getElementById('main-product-image');
    const thumbnailImages = document.querySelectorAll('.image-thumbnails .thumbnail'); 
    
    // Initialize current selections based on what's active in the HTML, or set sensible defaults
    // This is the CRITICAL FIX to ensure selections are never null/undefined when adding to cart.
    let selectedColor = selectedColorName ? selectedColorName.textContent.trim() : 'N/A';
    let selectedSizeValue = selectedSize ? selectedSize.textContent.trim() : 'N/A';
    
    
    // --- 3. Core Functions ---

    // Function to format price
    const formatPrice = (price) => `$${price.toFixed(2)}`;

    // Function to update the CTA button text
    const updateCtaText = (size, color) => {
        ctaButton.textContent = `Add to Bag - ${formatPrice(currentPrice)}`;
        // Update the current selection variables used by addToCart
        selectedSizeValue = size;
        selectedColor = color; 
        console.log(`Selected: ${selectedColor}, Size: ${selectedSizeValue}. Price: ${formatPrice(currentPrice)}`);
    }
    
    // Function to set the main product details on load
    const updateMainProductDetails = () => {
        const mainPriceElement = document.querySelector('.product-price');
        const mainTitleElement = document.querySelector('.product-title');
        
        // Update Title and Price dynamically
        if (mainPriceElement) {
            mainPriceElement.textContent = formatPrice(currentPrice);
        }
        if (mainTitleElement) {
            mainTitleElement.textContent = currentProduct.name; 
        }
        document.title = `${currentProduct.name} - ELM`;
    }

    // --- 4. Event Listeners ---

    // Color Selector Logic
    colorSwatches.forEach(swatch => {
        swatch.addEventListener('click', (e) => {
            e.preventDefault();
            colorSwatches.forEach(s => s.classList.remove('active'));
            const color = e.target.dataset.color;
            e.target.classList.add('active');
            
            // Update the display element
            selectedColorName.textContent = color;
            // Update the current selection variable and CTA text
            updateCtaText(selectedSizeValue, color);
        });
    });

    // Size Selector Logic
    sizeButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.preventDefault();
            sizeButtons.forEach(b => b.classList.remove('active'));
            const size = e.target.dataset.size;
            e.target.classList.add('active');
            
            // Update the display element
            selectedSize.textContent = size;
            // Update the current selection variable and CTA text
            updateCtaText(size, selectedColor);
        });
    });

    // Thumbnail Image Selector Logic 
    thumbnailImages.forEach(thumbnail => {
        thumbnail.addEventListener('click', () => {
            // Remove active state from all
            thumbnailImages.forEach(t => t.classList.remove('active'));
            // Set active state on clicked thumbnail
            thumbnail.classList.add('active');
            // Change main image source
            mainProductImage.src = thumbnail.src;
            mainProductImage.alt = thumbnail.alt;
        });
    });


    // Accordion Logic (No change needed)
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', () => {
            const accordion = header.closest('.accordion');
            const content = accordion.querySelector('.accordion-content');
            const icon = accordion.querySelector('.icon');
            
            // Toggle the open class
            const isOpen = accordion.classList.toggle('open');
            
            // Set max-height for CSS transition and toggle icon
            if (isOpen) {
                // Use scrollHeight for accurate content height
                content.style.maxHeight = content.scrollHeight + 30 + "px"; 
                if (icon) icon.textContent = '-';
            } else {
                content.style.maxHeight = null;
                if (icon) icon.textContent = '+';
            }
        });
    });

    // Add to Cart Button Logic (Requires addToCart function from main.js)
    ctaButton.addEventListener('click', (e) => {
        e.preventDefault();
        
        if (typeof addToCart === 'function') {
            const product = {
                id: currentProduct.id,
                name: currentProduct.name,
                price: currentPrice,
                image: currentProduct.image,
                // Use the dynamically updated variables
                color: selectedColor, 
                size: selectedSizeValue
            };
            
            addToCart(product);
            
            // Provide feedback
            ctaButton.textContent = 'Added to Bag! ✅';
            setTimeout(() => {
                // Revert CTA text to its original state
                updateCtaText(selectedSizeValue, selectedColor);
            }, 1500);
        } else {
            alert('Cart functionality not loaded. Check main.js is linked.');
        }
    });

    // --- 5. Initial Execution on Load ---
    updateMainProductDetails();
    updateCtaText(selectedSizeValue, selectedColor); // Initialize CTA text
    
    // Set the first thumbnail as active on load, if available
    if (thumbnailImages.length > 0) {
        thumbnailImages[0].classList.add('active');
        // Ensure the main image uses the first thumbnail source on load if not set by HTML
        if (!mainProductImage.src.includes(currentProduct.image)) { 
            mainProductImage.src = thumbnailImages[0].src;
            mainProductImage.alt = thumbnailImages[0].alt;
        }
    }

};


/* ===================================================
    MASTER INITIALIZATION
    =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Check for both the data and the wrapper before setup
    if (typeof PRODUCTS_DATA !== 'undefined' && document.querySelector('.product-detail-wrapper')) {
        setupProductDetailListeners();
    } 
    // If PRODUCTS_DATA is missing, the setup function will log an error.
});