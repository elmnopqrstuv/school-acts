// account.js - Account Dashboard Logic

const checkLoginStatus = () => {
    const currentUser = localStorage.getItem('currentUser');
    
    if (!currentUser) {
        // Redirect to login page if no user is found in Local Storage
        window.location.href = 'login.html';
        return false;
    }
    
    const user = JSON.parse(currentUser);
    const emailDisplay = document.getElementById('user-email-display');
    
    if (emailDisplay) {
        // Display the user's email, truncating it to look like a name (e.g., 'john@' becomes 'John')
        const namePart = user.email.split('@')[0];
        emailDisplay.textContent = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    }

    return true;
};

const handleLogout = (e) => {
    e.preventDefault();
    
    // Clear the current user session
    localStorage.removeItem('currentUser');
    
    // Redirect to the login page or homepage
    window.location.href = 'login.html'; 
};

document.addEventListener('DOMContentLoaded', () => {
    // 1. Enforce login check on page load
    if (checkLoginStatus()) {
        // 2. Attach listener to the Logout button only if the user is logged in
        const logoutButton = document.getElementById('logout-button');
        if (logoutButton) {
            logoutButton.addEventListener('click', handleLogout);
        }
    }
});