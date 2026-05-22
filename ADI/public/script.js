// --- GLOBAL DELETION ATTRIBUTE REGISTER ---
let deletionTargetId = null;

document.addEventListener("DOMContentLoaded", () => {
    enforceActiveSessionGateway().then(() => {
        if (document.getElementById("inventory-table-body")) {
            initializeDashboardWorkspace();
        }
        if (document.getElementById("spec-card-container")) {
            fetchSingleVehicleProfile();
        }
    });
});

// --- RESOLVE RELATIVE RUNTIME PATHS ---
function getSecureAPIEndpointPath(targetScriptName) {
    const runningPathname = window.location.pathname;
    const projectRootSegment = runningPathname.substring(0, runningPathname.lastIndexOf('/public'));
    return `${window.location.origin}${projectRootSegment}/api/${targetScriptName}`;
}

// --- SECURE WORKSPACE CONFIGURATION INTERCEPTOR ---
async function enforceActiveSessionGateway() {
    try {
        const sessionCheckUrl = getSecureAPIEndpointPath('session_check.php');
        const response = await fetch(sessionCheckUrl);
        const session = await response.json();

        if (!session || !session.authenticated) {
            window.location.href = 'login.html';
            return;
        }

        const userBadge = document.getElementById("session-clearance-profile-badge");
        if (userBadge) {
            userBadge.textContent = `${session.username} (${session.role})`;
        }

        if (session.role === 'Admin') {
            const adminWrapper = document.getElementById("admin-actions-wrapper");
            if (adminWrapper) adminWrapper.classList.remove("hidden");
        } else if (session.role === 'Auditor') {
            applyAuditorRestrictedClearanceView();
        }

        const logoutTrigger = document.getElementById("system-logout-trigger");
        if (logoutTrigger) {
            logoutTrigger.addEventListener("click", async (e) => {
                e.preventDefault();
                const logoutUrl = getSecureAPIEndpointPath('logout.php');
                const logResponse = await fetch(logoutUrl);
                if (logResponse.ok) window.location.href = 'login.html';
            });
        }
    } catch (err) {
        console.error("Session verification failure:", err);
    }
}

function applyAuditorRestrictedClearanceView() {
    const adminWrapper = document.getElementById("admin-actions-wrapper");
    if (adminWrapper) adminWrapper.classList.add("hidden");

    const actionsHeader = document.getElementById("table-actions-header");
    if (actionsHeader) actionsHeader.style.display = 'none';

    const tableBodyObserver = new MutationObserver(() => {
        document.querySelectorAll(".inline-stock-input, .inline-price-input").forEach(input => {
            input.setAttribute("disabled", "true");
            input.style.cursor = "not-allowed";
            input.style.border = "none";
            input.style.background = "transparent";
            input.style.color = "var(--text-light)";
        });
        document.querySelectorAll(".purge-row-btn").forEach(btn => btn.style.display = 'none');
    });

    const targetTableBody = document.getElementById("inventory-table-body");
    if (targetTableBody) tableBodyObserver.observe(targetTableBody, { childList: true });
}

function initializeDashboardWorkspace() {
    const productModal = document.getElementById("product-modal");
    const confirmModal = document.getElementById("confirm-modal");
    const addProductForm = document.getElementById("add-product-form");
    
    if (document.getElementById("open-modal-btn")) {
        document.getElementById("open-modal-btn").addEventListener("click", () => productModal.classList.remove("hidden"));
        document.getElementById("close-modal-btn").addEventListener("click", () => productModal.classList.add("hidden"));
        document.getElementById("cancel-modal-btn").addEventListener("click", () => productModal.classList.add("hidden"));
    }
    
    if (document.getElementById("confirm-cancel-btn")) {
        document.getElementById("confirm-cancel-btn").addEventListener("click", () => {
            confirmModal.classList.add("hidden");
            deletionTargetId = null;
        });
        document.getElementById("confirm-delete-btn").addEventListener("click", executeRecordPurgeTransaction);
    }

    if (addProductForm) {
        addProductForm.addEventListener("submit", executeProductAdditionTransaction);
    }

    fetchCarShowroomRecords();
}

// --- CORE ASSET RENDER ENGINE MATRIX (MATCHES SHORT KEYS PERFECTLY) ---
async function fetchCarShowroomRecords() {
    const tableBody = document.getElementById("inventory-table-body");
    const galleryGrid = document.getElementById("gallery-grid");
    const totalItemsBadge = document.getElementById("total-items-badge");

    if (!tableBody) return;

    try {
        const inventoryUrl = getSecureAPIEndpointPath('inventory.php');
        const response = await fetch(inventoryUrl);
        const data = await response.json();

        if (!data || data.length === 0) {
            if (totalItemsBadge) totalItemsBadge.textContent = "0";
            tableBody.innerHTML = "<tr><td colspan='7' style='text-align:center; padding:2rem;'>No products currently registered in the database ledger.</td></tr>";
            return;
        }

        if (totalItemsBadge) totalItemsBadge.textContent = data.length;
        tableBody.innerHTML = "";
        if (galleryGrid) galleryGrid.innerHTML = "";

        data.forEach(car => {
            // Direct object mapping using the working fields verified via raw API printout
            const carId = car.id;
            const carName = car.name;
            const carSku = car.sku;
            const carStock = car.stock;
            const carPrice = car.price;
            const carCategory = car.category_name ? car.category_name : "Uncategorized";
            const carImage = car.image ? car.image : "images/default.jpg";

            // Append dynamic table dataset row markup
            const row = document.createElement("tr");
            // Mark low stock rows
            if (parseInt(carStock) < 10) row.classList.add('low-stock');

            const placeDisabled = parseInt(carStock) <= 0 ? 'disabled' : '';

            row.innerHTML = `
                <td style="color:var(--accent-gold); font-weight:600; font-family:monospace;">${carId}</td>
                <td><strong style="color: #f4f6fa; cursor: pointer;" onclick="window.location.href='details.html?id=${carId}'">${carName}</strong></td>
                <td><code style="background: rgba(255,255,255,0.04); padding: 0.2rem 0.5rem; border-radius: 3px; border: 1px solid var(--border-color); font-size: 0.8rem;">${carSku}</code></td>
                <td><span style="font-size:0.75rem; background:#070b12; padding:0.25rem 0.6rem; border-radius:3px; border:1px solid #1e2e4e; color:#9daec8;">${carCategory}</span></td>
                <td>
                    <div class="input-with-unit">
                        <input type="number" class="inline-stock-input" value="${carStock}" min="0" onchange="inlineUpdateStockPriceTransaction(${carId}, this.value, ${carPrice})">
                        <span class="unit-label">units</span>
                    </div>
                </td>
                <td>
                    <div class="input-with-unit">
                        <span class="currency-prefix">$</span>
                        <input type="number" class="inline-price-input" value="${carPrice}" step="0.01" onchange="inlineUpdateStockPriceTransaction(${carId}, ${carStock}, this.value)">
                    </div>
                </td>
                <td>
                    <button class="place-order-btn" ${placeDisabled} onclick="placeOrder(${carId}, ${carStock})">Place Order</button>
                    <button class="purge-row-btn" onclick="triggerDeleteConfirmationModal(${carId})">Purge</button>
                </td>
            `;
            tableBody.appendChild(row);

            // Populate asset fleet grid visualization blocks
            if (galleryGrid) {
                const card = document.createElement("div");
                card.className = "product-card";
                card.innerHTML = `
                    <a href="details.html?id=${carId}" style="text-decoration:none; display:flex; flex-direction:column; height:100%;">
                        <div style="width:100%; height:160px; overflow:hidden; background-color:#070b12; border-bottom:1px solid var(--border-color);">
                            <img src="${cardImage = carImage}" style="width:100%; height:100%; object-fit:cover;" onerror="this.src='images/default.jpg';">
                        </div>
                        <div style="padding:1.25rem; flex:1; display:flex; flex-direction:column; justify-content:space-between;">
                            <div>
                                <h4 style="color:#f4f6fa; font-size:0.95rem; font-family:'Cinzel', serif; text-transform:uppercase; margin-bottom:0.4rem; line-height:1.4;">${carName}</h4>
                                <p style="font-size:0.75rem; color:#9daec8; font-family:monospace;">${carSku}</p>
                            </div>
                            <div style="margin-top:1.25rem; display:flex; justify-content:space-between; align-items:center;">
                                <span style="color:#d4af37; font-weight:600; font-size:1.15rem;">$${parseFloat(carPrice).toLocaleString(undefined, {minimumFractionDigits: 0})}</span>
                                <span style="font-size:0.75rem; background-color:#070b12; padding:0.3rem 0.6rem; border-radius:3px; color:#f4f6fa; border:1px solid #1e2e4e;">Stock: ${carStock}</span>
                            </div>
                        </div>
                    </a>
                `;
                galleryGrid.appendChild(card);
            }
        });
        // Update warehouse summary after rendering
        fetchWarehouseSummary();
    } catch (error) {
        console.error("Table mapping loop structural execution exception:", error);
    }
}

// Fetch warehouse summary metrics
async function fetchWarehouseSummary() {
    try {
        const url = getSecureAPIEndpointPath('summary.php');
        const res = await fetch(url);
        const data = await res.json();
        const totalValueEl = document.getElementById('total-inventory-value');
        const ordersTodayEl = document.getElementById('total-orders-today');
        if (totalValueEl) totalValueEl.textContent = `$${parseFloat(data.total_inventory_value).toLocaleString()}`;
        if (ordersTodayEl) ordersTodayEl.textContent = data.orders_today;
    } catch (err) {
        console.error('Failed to fetch warehouse summary', err);
    }
}

// --- MUTATION HANDLING ACTIONS ---
async function executeProductAdditionTransaction(e) {
    e.preventDefault();
    const formData = new FormData(e.target);
    const payload = Object.fromEntries(formData.entries());

    try {
        const addProductUrl = getSecureAPIEndpointPath('add_product.php');
        const response = await fetch(addProductUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'IND-SECURE-2024' },
            body: JSON.stringify(payload)
        });
        if (response.ok) {
            document.getElementById("product-modal").classList.add("hidden");
            e.target.reset();
            fetchCarShowroomRecords();
        }
    } catch (err) {
        console.error(err);        if (detailCard) detailCard.classList.add('hidden');
        if (errorMsg) {
            errorMsg.classList.remove('hidden');
            errorMsg.textContent = 'Internal error loading asset profile.';
        }    }
}

async function inlineUpdateStockPriceTransaction(id, currentStock, currentPrice) {
    try {
        const updateProductUrl = getSecureAPIEndpointPath('update_product.php');
        await fetch(updateProductUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'IND-SECURE-2024' },
            body: JSON.stringify({ id: id, stock: parseInt(currentStock), price: parseFloat(currentPrice) })
        });
        fetchCarShowroomRecords();
    } catch (err) {
        console.error(err);
    }
}

function triggerDeleteConfirmationModal(id) {
    deletionTargetId = id;
    const confirmModal = document.getElementById("confirm-modal");
    if (confirmModal) confirmModal.classList.remove("hidden");
}

async function executeRecordPurgeTransaction() {
    if (!deletionTargetId) return;
    try {
        const deleteProductUrl = getSecureAPIEndpointPath('delete_product.php');
        const response = await fetch(deleteProductUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'IND-SECURE-2024' },
            body: JSON.stringify({ id: deletionTargetId })
        });
        if (response.ok) {
            document.getElementById("confirm-modal").classList.add("hidden");
            deletionTargetId = null;
            fetchCarShowroomRecords();
        }
    } catch (err) {
        console.error(err);
    }
}

// Place an order for a product (client-side prompt for customer name and quantity)
async function placeOrder(productId, currentStock) {
    const customerName = prompt('Enter customer name:', '');
    if (customerName === null) return; // cancelled
    if (customerName.trim() === '') { alert('Customer name is required'); return; }
    
    const qtyRaw = prompt('Enter quantity to order:', '1');
    if (qtyRaw === null) return; // cancelled
    const qty = parseInt(qtyRaw);
    if (isNaN(qty) || qty <= 0) { alert('Invalid quantity'); return; }
    if (qty > currentStock) { alert('Insufficient Industrial Stock'); return; }

    try {
        const url = getSecureAPIEndpointPath('place_order.php');
        const res = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'X-Admin-Key': 'IND-SECURE-2024' },
            body: JSON.stringify({ product_id: productId, quantity: qty, customer_name: customerName.trim() })
        });
        if (res.ok) {
            alert('Order placed successfully');
            fetchCarShowroomRecords();
        } else {
            const err = await res.json();
            alert(err.error || 'Order failed');
        }
    } catch (err) {
        console.error('Place order failed', err);
    }
}

async function fetchSingleVehicleProfile() {
    const urlParams = new URLSearchParams(window.location.search);
    const vehicleId = urlParams.get('id');
    const errorMsg = document.getElementById('details-error-msg');
    const detailCard = document.getElementById('spec-card-container');
    if (!vehicleId) {
        if (errorMsg) {
            errorMsg.classList.remove('hidden');
            errorMsg.textContent = 'Missing vehicle identifier.';
        }
        return;
    }

    try {
        const singleProductUrl = `${getSecureAPIEndpointPath('product.php')}?id=${parseInt(vehicleId)}`;
        const response = await fetch(singleProductUrl);
        const car = await response.json();

        if (!response.ok || car.error) {
            if (detailCard) detailCard.classList.add('hidden');
            if (errorMsg) {
                errorMsg.classList.remove('hidden');
                errorMsg.textContent = car.error || 'Unable to load asset profile.';
            }
            return;
        }

        if (errorMsg) errorMsg.classList.add('hidden');
        if (detailCard) detailCard.classList.remove('hidden');

        document.getElementById("vehicle-header-title").textContent = `Asset Profile: ${car.name}`;
        document.getElementById("car-detail-name").textContent = car.name;
        document.getElementById("car-detail-sku").textContent = car.sku;
        document.getElementById("car-detail-id").textContent = `#${car.id.toString().padStart(4, '0')}`;
        document.getElementById("car-detail-stock").textContent = `${car.stock} units allocated`;
        document.getElementById("car-detail-price").textContent = `$${parseFloat(car.price).toLocaleString()}`;
        document.getElementById("car-detail-image").src = car.image ? car.image : 'images/default.jpg';
        document.getElementById("car-detail-status").textContent = car.stock > 0 ? 'In Warehouse' : 'Out of Stock';
        if (car.engine) document.getElementById('car-spec-engine').textContent = car.engine;
        if (car.power) document.getElementById('car-spec-power').textContent = car.power;
        if (car.transmission) document.getElementById('car-spec-transmission').textContent = car.transmission;
    } catch (error) {
        console.error(error);
    }
}