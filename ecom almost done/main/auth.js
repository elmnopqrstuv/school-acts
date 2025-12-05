// auth.js - User Authentication Logic (Register and Login)

// Helper to get all registered users (simulating a database)
const getRegisteredUsers = () => {
    const users = localStorage.getItem('registeredUsers');
    return users ? JSON.parse(users) : [];
};

// Helper to save the current list of users
const saveRegisteredUsers = (users) => {
    localStorage.setItem('registeredUsers', JSON.stringify(users));
};

/* ===================================================
    REGISTER LOGIC
    =================================================== */

const handleRegister = (e) => {
    e.preventDefault();
    
    const email = document.getElementById('reg-email').value.trim();
    const password = document.getElementById('reg-password').value;
    const confirmPassword = document.getElementById('reg-confirm-password').value;
    const messageEl = document.getElementById('register-message');
    
    messageEl.style.display = 'block';
    messageEl.style.color = 'red';

    if (password !== confirmPassword) {
        messageEl.textContent = 'Error: Passwords do not match.';
        return;
    }

    let users = getRegisteredUsers();

    if (users.find(u => u.email === email)) {
        messageEl.textContent = 'Error: An account with this email already exists.';
        return;
    }

    // Hash simulation (real world needs server-side hashing)
    // Here we'll just save the plain password for this simple demo
    users.push({ 
        email: email, 
        password: password // In a real app, hash this!
    });
    
    saveRegisteredUsers(users);
    
    messageEl.style.color = 'green';
    messageEl.textContent = 'Registration successful! Redirecting to login...';

    // Simulate redirection after successful registration
    setTimeout(() => {
        window.location.href = 'login.html';
    }, 1500);
};

/* ===================================================
    LOGIN LOGIC
    =================================================== */

const handleLogin = (e) => {
    e.preventDefault();

    const email = document.getElementById('log-email').value.trim();
    const password = document.getElementById('log-password').value;
    const messageEl = document.getElementById('login-message');
    
    messageEl.style.display = 'block';
    messageEl.style.color = 'red';

    let users = getRegisteredUsers();
    
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        // Successful Login
        localStorage.setItem('currentUser', JSON.stringify({ email: user.email }));
        messageEl.style.color = 'green';
        messageEl.textContent = 'Login successful! Welcome back.';

        // Redirect to the homepage or a dashboard
        setTimeout(() => {
            window.location.href = '../main/main.html';
        }, 1000);

    } else {
        messageEl.textContent = 'Error: Invalid email or password.';
    }
};

/* ===================================================
    INITIALIZATION
    =================================================== */

document.addEventListener('DOMContentLoaded', () => {
    // Attach listener for Register page
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Attach listener for Login page
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
});