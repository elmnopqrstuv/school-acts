// products.js - Master Data File for all Products

const PRODUCTS_DATA = [
    // --- Product Detail Pages (Using dedicated filenames) ---
    { id: 'knitted-sweater', name: 'KNITTED SWEATER', price: 950.00, file: 'knitted-sweater.html' },
    { id: 'cassandre-shirt', name: 'CASSANDRE SHIRT', price: 450.00, file: 'cassandre-shirt.html' },
    { id: 'high-rise-pants-wool', name: 'HIGH RISE PANTS IN WOOL', price: 550.00, file: 'high-rise-pants-wool.html' },
    
    // --- Products using the generic 'product-detail.html' (Trench Set) ---
    { id: 'signature-trench-set', name: 'THE SIGNATURE TRENCH SET', price: 6580.00, file: 'product-detail.html' }, 

    { 
        id: 'signature-trench-set', 
        name: 'THE SIGNATURE TRENCH SET', 
        price: 6580.00, 
        file: 'product-detail.html',
        image: '../images/product1/medium-SAINT_LAURENT_MFALL_25_LOOKBOOK_ECOM_NO_LOGO_4x5_31_B.avif' // <-- THIS IS REQUIRED
    },
    
    // --- Other Products from your Shop/New Arrivals Images ---
    { id: 'chain-bracelet', name: 'CHAIN BRACELET', price: 220.00, file: 'chain-bracelet.html' },
    { id: 'joe-over-the-knee-boots', name: 'JOE OVER THE KNEE BOOTS', price: 1800.00, file: 'joe-over-the-knee-boots.html' },
    { id: 'collar-in-feathers', name: 'COLLAR IN FEATHERS', price: 850.00, file: 'collar-in-feathers.html' },
    { id: 'shearling-lined-boots', name: 'SHEARLING LINED BOOTS', price: 200.00, file: 'shearling-lined-boots.html' },
    { id: 'merino-wool-beanie', name: 'MERINO WOOL BEANIE', price: 50.00, file: 'merino-wool-beanie.html' },
    { id: 'leather-clutch', name: 'LEATHER CLUTCH', price: 200.00, file: 'leather-clutch.html' },
    { id: 'silk-scarf', name: 'SILK SCARF', price: 450.00, file: 'silk-scarf.html' },
    { id: 'geometric-earrings', name: 'GEOMETRIC EARRINGS', price: 800.00, file: 'geometric-earrings.html' },
    { id: 'purple-ring-set', name: 'PURPLE RING SET', price: 75.00, file: 'purple-ring-set.html' },
    { id: 'long-coat-in-cashmere', name: 'LONG COAT IN CASHMERE', price: 1200.00, file: 'long-coat-cashmere.html' },
    { id: 'jacket-in-wool-cashmere', name: 'JACKET IN WOOL-CASHMERE', price: 1150.00, file: 'jacket-wool-cashmere.html' },
    { id: 'suspender-wool-pants', name: 'SUSPENDER WOOL PANTS', price: 1010.00, file: 'suspender-wool-pants.html' },
    { id: 'suede-sneaker', name: 'SUEDE SNEAKER', price: 400.00, file: 'suede-sneaker.html' },
    { id: 'leather-gloves', name: 'LEATHER GLOVES', price: 110.00, file: 'leather-gloves.html' },
    { id: 'croc-card-holder', name: 'CROC-CARD HOLDER', price: 750.00, file: 'croc-card-holder.html' },
    { id: 'leather-backpack', name: 'LEATHER BACKPACK', price: 500.00, file: 'leather-backpack.html' },
    { id: 'minimalist-belt', name: 'MINIMALIST BELT', price: 300.00, file: 'minimalist-belt.html' },
];