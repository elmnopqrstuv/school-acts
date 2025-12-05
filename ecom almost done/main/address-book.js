// address-book.js - Manages Address Book functionality

const STORAGE_KEY = 'userAddresses';
const CURRENT_USER_KEY = 'currentUser';

// Helper: Get user's email
const getCurrentUserEmail = () => {
    const user = localStorage.getItem(CURRENT_USER_KEY);
    return user ? JSON.parse(user).email : null;
};

// Helper: Get all addresses for the current user
const getAddresses = () => {
    const email = getCurrentUserEmail();
    if (!email) return [];
    
    const allAddressData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    return allAddressData[email] || [];
};

// Helper: Save all addresses for the current user
const saveAddresses = (addresses) => {
    const email = getCurrentUserEmail();
    if (!email) return;

    let allAddressData = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    allAddressData[email] = addresses;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(allAddressData));
};

// --- RENDER FUNCTION FOR address-book.html ---

const renderAddressBook = () => {
    const addresses = getAddresses();
    const grid = document.getElementById('address-grid');
    if (!grid) return;
    grid.innerHTML = '';
    
    if (addresses.length === 0) {
        grid.innerHTML = '<p style="color:#a0a0a0; margin-top: 20px;">You have no saved addresses. Click "Add New Address" to begin.</p>';
        return;
    }

    addresses.forEach((addr, index) => {
        const card = document.createElement('div');
        card.className = 'address-card';
        
        // Default logic simulation
        const isDefault = (index === 0) ? ' (Default)' : '';

        card.innerHTML = `
            <h3 class="address-type">${addr.type || 'Shipping Address'}${isDefault}</h3>
            <p>${addr.fullName}</p>
            <p>${addr.address1}, ${addr.address2}</p>
            <p>${addr.city}, ${addr.state} ${addr.zip}</p>
            <p>${addr.country}</p>
            <div class="address-actions">
                <a href="account-address-form.html?id=${index}">Edit</a> | 
                <a href="#" class="remove-address" data-id="${index}">Remove</a>
            </div>
        `;
        grid.appendChild(card);
    });

    // Attach Remove event listeners
    document.querySelectorAll('.remove-address').forEach(button => {
        button.addEventListener('click', handleRemoveAddress);
    });
};

const handleRemoveAddress = (e) => {
    e.preventDefault();
    if (!confirm('Are you sure you want to remove this address?')) return;
    
    const index = parseInt(e.target.dataset.id);
    let addresses = getAddresses();
    
    addresses.splice(index, 1); // Remove address at index
    saveAddresses(addresses);
    renderAddressBook(); // Re-render the grid
};


// --- FORM LOGIC FOR account-address-form.html ---

const loadAddressForm = () => {
    const urlParams = new URLSearchParams(window.location.search);
    const addressId = urlParams.get('id'); // Will be null for 'Add New'
    const form = document.getElementById('address-form');
    const title = document.getElementById('form-title');
    
    if (!form || !title) return;

    if (addressId !== null) {
        const addresses = getAddresses();
        const address = addresses[parseInt(addressId)];

        if (address) {
            title.textContent = 'Edit Address';
            // Populate form fields
            form.querySelector('#address-id').value = addressId;
            form.querySelector('#full-name').value = address.fullName || '';
            form.querySelector('#address-line-1').value = address.address1 || '';
            form.querySelector('#address-line-2').value = address.address2 || '';
            form.querySelector('#city').value = address.city || '';
            form.querySelector('#state').value = address.state || '';
            form.querySelector('#zip').value = address.zip || '';
            form.querySelector('#country').value = address.country || '';
            form.querySelector('#address-type').value = address.type || 'Shipping Address';
            
            // Update button text
            form.querySelector('button[type="submit"]').textContent = 'Update Address';
        } else {
            // Address ID was in URL but not found
            title.textContent = 'Add New Address';
        }
    } else {
        title.textContent = 'Add New Address';
    }
};

const handleSaveAddress = (e) => {
    e.preventDefault();

    const form = e.target;
    const addressId = form.querySelector('#address-id').value;
    
    const newAddress = {
        fullName: form.querySelector('#full-name').value.trim(),
        address1: form.querySelector('#address-line-1').value.trim(),
        address2: form.querySelector('#address-line-2').value.trim(),
        city: form.querySelector('#city').value.trim(),
        state: form.querySelector('#state').value.trim(),
        zip: form.querySelector('#zip').value.trim(),
        country: form.querySelector('#country').value.trim(),
        type: form.querySelector('#address-type').value,
    };

    let addresses = getAddresses();
    
    if (addressId) {
        // Edit existing address
        addresses[parseInt(addressId)] = newAddress;
    } else {
        // Add new address
        addresses.push(newAddress);
    }

    saveAddresses(addresses);
    alert('Address saved successfully!');
    window.location.href = 'account-addresses.html'; // Redirect back to list
};


// Initialization
document.addEventListener('DOMContentLoaded', () => {
    // Check which page we are on
    if (document.getElementById('address-grid')) {
        renderAddressBook();
    }

    const addressForm = document.getElementById('address-form');
    if (addressForm) {
        loadAddressForm();
        addressForm.addEventListener('submit', handleSaveAddress);
    }
});