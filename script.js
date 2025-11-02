// Global variables for the shopping cart
let cart = JSON.parse(localStorage.getItem('sdMartCart')) || [];

// DOM Elements
const cartButton = document.getElementById('cart-button');
const cartCountSpan = document.getElementById('cart-count');
const cartModal = document.getElementById('cart-modal');
const closeButton = document.querySelector('.close-button');
const cartItemsList = document.getElementById('cart-items-list');
const cartTotalSpan = document.getElementById('cart-total');
const productCards = document.querySelectorAll('.product-card');
const checkoutButton = document.querySelector('.checkout-button');

// --- Helper Functions ---

/**
 * Updates the visual cart count in the header.
 */
const updateCartCount = () => {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCountSpan.textContent = totalItems;
};

/**
 * Saves the current cart to Local Storage.
 */
const saveCart = () => {
    localStorage.setItem('sdMartCart', JSON.stringify(cart));
};

/**
 * Calculates the total price of all items in the cart.
 * @returns {number} The total price.
 */
const calculateTotal = () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    return total;
};

/**
 * Renders the cart items in the modal.
 */
const renderCart = () => {
    cartItemsList.innerHTML = ''; // Clear existing list
    
    if (cart.length === 0) {
        cartItemsList.innerHTML = '<li>Your cart is empty.</li>';
    } else {
        cart.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${item.name} (x${item.quantity})</span>
                <span>$${(item.price * item.quantity).toFixed(2)}</span>
            `;
            cartItemsList.appendChild(li);
        });
    }

    cartTotalSpan.textContent = calculateTotal().toFixed(2);
};

// --- Event Handlers ---

/**
 * Logic for adding a product to the cart.
 * @param {string} id - Product ID
 * @param {string} name - Product Name
 * @param {number} price - Product Price
 */
const addToCart = (id, name, price) => {
    const existingItem = cart.find(item => item.id === id);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    console.log(`${name} added to cart.`);
};

// --- Initialization and Event Listeners ---

// 1. Product "Add to Cart" buttons
productCards.forEach(card => {
    const addButton = card.querySelector('.add-to-cart');
    const id = card.getAttribute('data-product-id');
    const price = parseFloat(card.getAttribute('data-price'));
    const name = card.querySelector('h3').textContent.trim().replace(/ \W/g, ''); // Basic clean-up for name

    addButton.addEventListener('click', () => {
        addToCart(id, name, price);
    });
});

// 2. Cart Modal Handlers
cartButton.addEventListener('click', () => {
    renderCart(); // Refresh cart content before opening
    cartModal.style.display = 'block';
});

closeButton.addEventListener('click', () => {
    cartModal.style.display = 'none';
});

// Close modal if user clicks outside of it
window.addEventListener('click', (event) => {
    if (event.target === cartModal) {
        cartModal.style.display = 'none';
    }
});

// 3. Checkout (Simple alert for a startup)
checkoutButton.addEventListener('click', () => {
    if (cart.length > 0) {
        alert(`Thank you for your order! Your total is $${calculateTotal().toFixed(2)}. We'll contact you soon.`);
        // Clear the cart after "checkout"
        cart = [];
        saveCart();
        renderCart();
        updateCartCount();
        cartModal.style.display = 'none';
    } else {
        alert("Your cart is empty. Add some products before checking out!");
    }
});


// Initial load: set the correct cart count from localStorage
document.addEventListener('DOMContentLoaded', updateCartCount);