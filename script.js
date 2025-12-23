// 1. Image Gallery Switcher
function changeImage(src) {
    document.getElementById('current-img').src = src;
}

// 2. Add to Cart System with localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Page Navigation
const mainPages = ['home-content', 'listing-content', 'product-detail-page', 'cart-page'];

function showPage(pageId) {
    mainPages.forEach(id => {
        const page = document.getElementById(id);
        if (page) {
            page.style.display = (id === pageId) ? 'block' : 'none';
        }
    });

    const services = document.querySelector('.services-section');
    if (services) {
        // Show services only on the home page
        services.style.display = (pageId === 'home-content') ? 'block' : 'none';
    }
    window.scrollTo(0, 0);
}


function addToCart(productName, price, image) {
    // Get product details from product detail page if on that page
    const onDetailPage = document.getElementById('product-detail-page')?.style.display !== 'none';
    
    if (onDetailPage) {
        productName = productName || document.getElementById('productTitle').textContent;
        price = price || document.getElementById('productPrice').textContent;
        const size = document.getElementById('sizeSelect').value;
        const quantity = parseInt(document.getElementById('quantityInput').value);
        
        if (size === 'Select Size') {
            alert('Please select a size');
            return;
        }
        
        // Check if item already exists in cart
        const existingItem = cart.find(item => item.name === productName && item.size === size);
        
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            cart.push({
                id: Date.now(),
                name: productName,
                price: parseFloat(price.replace('$', '')),
                size: size,
                quantity: quantity,
                image: image || 'https://via.placeholder.com/80x80'
            });
        }
        
        alert(`Added ${quantity} ${productName}(s) to cart!`);
        document.getElementById('quantityInput').value = 1;
    } else {
        // From listing page - get nearest product info
        const productCard = event.target.closest('.product-list-item');
        const name = productCard.querySelector('.product-list-header h3').textContent;
        const priceText = productCard.querySelector('.product-list-price').textContent;
        const imgSrc = productCard.querySelector('.product-list-img img').src;
        
        const existingItem = cart.find(item => item.name === name);
        
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({
                id: Date.now(),
                name: name,
                price: parseFloat(priceText.replace('$', '')),
                quantity: 1,
                image: imgSrc
            });
        }
        
        alert(`${name} added to cart!`);
    }
    
    saveCart();
    updateCartCount();
}

function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.nav-icons .icon-item:last-child span');
    if (cartIcon) {
        cartIcon.textContent = `My cart (${totalItems})`;
    }
}

function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    updateCartCount();
    renderCart(); // Re-render the cart after removing an item
}

function updateCartItemQuantity(itemId, quantity) {
    const item = cart.find(i => i.id === itemId);
    if (item) {
        item.quantity = quantity;
        if (quantity <= 0) {
            removeFromCart(itemId);
        } else {
            saveCart();
            renderCart(); // Re-render
        }
    }
    updateCartCount();
}

function viewCart() {
    showPage('cart-page');
    renderCart();
}

    // 12. Load More Products Functionality
    let recommendedProductsShown = 2;
    let listingProductsShown = 8;

    const moreProducts = [
        { name: 'Winter Jacket', price: '$65.99', category: 'clothes', desc: 'Warm and stylish winter jacket for cold weather' },
        { name: 'Running Shoes', price: '$89.99', category: 'sports', desc: 'Professional running shoes with advanced cushioning' },
        { name: 'Smart TV', price: '$399.99', category: 'computer and tech', desc: 'HD Smart TV with streaming capabilities' },
        { name: 'Backpack', price: '$49.99', category: 'accessories', desc: 'Durable and spacious travel backpack' },
        { name: 'Coffee Maker', price: '$59.99', category: 'home', desc: 'Automatic coffee maker with timer' },
        { name: 'Desk Lamp', price: '$35.99', category: 'home', desc: 'LED desk lamp with adjustable brightness' },
        { name: 'Headphones', price: '$75.99', category: 'computer and tech', desc: 'Premium noise-cancelling headphones' },
        { name: 'Sports Bag', price: '$45.99', category: 'sports', desc: 'Gym bag with multiple compartments' }
    ];

    function loadMoreRecommended() {
        const grid = document.querySelector('.product-grid');
    
        for (let i = 0; i < 2 && recommendedProductsShown < moreProducts.length; i++, recommendedProductsShown++) {
            const product = moreProducts[recommendedProductsShown];
            const card = document.createElement('div');
            card.className = 'product-card';
            card.innerHTML = `
                <div class="product-img">
                    <img src="https://via.placeholder.com/150" alt="${product.name}">
                </div>
                <div class="product-info">
                    <p class="price">${product.price}</p>
                    <p class="desc">${product.name}</p>
                    <button class="buy-now">Buy Now</button>
                </div>
            `;
            grid.appendChild(card);
        }
    
        if (recommendedProductsShown >= moreProducts.length) {
            document.getElementById('load-more-recommended').style.display = 'none';
        }
    }

    function loadMoreProducts() {
        const container = document.getElementById('product-container');

        for (let i = 0; i < 4 && listingProductsShown < 16; i++, listingProductsShown++) {
            const product = moreProducts[listingProductsShown % moreProducts.length];
            const item = document.createElement('div');
            item.className = 'product-list-item';
            item.setAttribute('data-category', product.category);
            item.innerHTML = `
                <div class="product-list-img">
                    <img src="https://via.placeholder.com/120x120" alt="${product.name}">
                </div>
                <div class="product-list-content">
                    <div class="product-list-header">
                        <h3>${product.name}</h3>
                        <span class="product-rating">
                            <i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star"></i><i class="fas fa-star-half-alt"></i>
                            (256 reviews)
                        </span>
                    </div>
                    <p class="product-list-desc">${product.desc}</p>
                    <div class="product-list-footer">
                        <span class="product-list-price">${product.price}</span>
                        <span class="shipping-info"><i class="fas fa-shipping-fast"></i> Free Shipping</span>
                        <button class="btn-add-cart" onclick="addToCart()">Add to Cart</button>
                    </div>
                </div>
                <div class="product-list-actions">
                    <button class="btn-compare" title="Compare"><i class="fas fa-exchange-alt"></i></button>
                    <button class="btn-wishlist" title="Add to Wishlist"><i class="fas fa-heart"></i></button>
                </div>
            `;
            container.appendChild(item);
        }

        if (listingProductsShown >= 16) {
            document.getElementById('load-more-listing').style.display = 'none';
        }

        // Re-apply filters after adding new products
        applyFilters();
}

    function loadMoreGlobal() {
        const listingVisible = document.getElementById('listing-content') && document.getElementById('listing-content').style.display !== 'none';
        const homeVisible = document.getElementById('home-content') && document.getElementById('home-content').style.display !== 'none';
        const productDetailVisible = document.getElementById('product-detail-page') && document.getElementById('product-detail-page').style.display !== 'none';

        if (listingVisible) {
            loadMoreProducts();
        } else if (homeVisible) {
            loadMoreRecommended();
        } else if (productDetailVisible) {
            loadMoreRecommended();
        } else {
            // Fallback to listing
            loadMoreProducts();
        }
    }

function renderCart() {
    const cartContainer = document.getElementById('cart-items-container');
    const cartSummary = document.getElementById('cart-summary');
    
    if (!cartContainer || !cartSummary) return; // Guard clause

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p style="text-align: center; padding: 40px; color: #8b96a5;">Your cart is empty!</p>';
        cartSummary.innerHTML = '';
        return;
    }
    
    let cartHTML = '';
    cart.forEach(item => {
        const itemTotal = (item.price * item.quantity).toFixed(2);
        cartHTML += `
            <div class="cart-item">
                <div class="cart-item-img">
                    <img src="${item.image}" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h3>${item.name}</h3>
                    ${item.size ? `<p class="cart-item-size">Size: <strong>${item.size}</strong></p>` : ''}
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                </div>
                <div class="cart-item-quantity">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity - 1})">-</button>
                    <input type="number" value="${item.quantity}" onchange="updateCartItemQuantity(${item.id}, this.value)" min="1">
                    <button onclick="updateCartItemQuantity(${item.id}, ${item.quantity + 1})">+</button>
                </div>
                <div class="cart-item-total">
                    <p>$${itemTotal}</p>
                </div>
                <div class="cart-item-remove">
                    <button class="btn-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash"></i></button>
                </div>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    
    // Calculate totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    cartSummary.innerHTML = `
        <div class="summary-box">
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
            </div>
            <div class="summary-row">
                <span>Tax:</span>
                <span>$0.00</span>
            </div>
            <hr>
            <div class="summary-row total">
                <strong>Total:</strong>
                <strong>$${subtotal.toFixed(2)}</strong>
            </div>
            <button class="btn-checkout">Proceed to Checkout</button>
        </div>
    `;
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // 4. Show/Hide Listing Page
    const moreCategoriesBtn = document.getElementById('more-categories-btn');
    if(moreCategoriesBtn) {
        moreCategoriesBtn.addEventListener('click', () => {
            showPage('listing-content');
        });
    }

    // 3. Search Bar Interactivity (Styled only)
    const searchInput = document.querySelector('.search-container input');
    const searchBtn = document.querySelector('.search-btn');

    if(searchBtn) {
        searchBtn.addEventListener('click', () => {
            const searchTerm = searchInput.value.trim().toLowerCase();
            if (searchTerm !== "") {
                showPage('listing-content');
                applyFilters(); 
                document.getElementById('productsTitle').textContent = `Search results for "${searchInput.value}"`;
            } else {
                alert("Please enter something to search.");
            }
        });
    }

    // 6. Product Filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            filterButtons.forEach(btn => btn.classList.remove('active'));
            button.classList.add('active');

            const filter = button.dataset.filter;
            const allProducts = document.querySelectorAll('.product-list-item[data-category]');

            allProducts.forEach(item => {
                if (filter === 'all' || item.dataset.category === filter) {
                    item.style.display = 'flex'; // Use flex for list items
                } else {
                    item.style.display = 'none';
                }
            });
        });
    });
    
    // 7. Price range slider
    const priceRange = document.querySelector('.price-range');
    const priceValue = document.getElementById('price-value');

    if (priceRange) {
        priceRange.addEventListener('input', function() {
            priceValue.textContent = '$0 - $' + this.value;
        });
    }

    const loginBtn = document.querySelector('.login-card .btn-white');
    if(loginBtn) {
        loginBtn.addEventListener('click', () => {
            window.location.href = 'project.html';
        });
    }

    const joinNowBtn = document.querySelector('.login-card .btn-blue');
    if(joinNowBtn) {
        joinNowBtn.addEventListener('click', () => {
            window.location.href = 'project.html';
        });
    }

    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('buy-now')) {
            const productCard = event.target.closest('.product-card');
            const name = productCard.querySelector('.desc').textContent;
            const priceText = productCard.querySelector('.price').textContent;
            const imgSrc = productCard.querySelector('.product-img img').src;

            const existingItem = cart.find(item => item.name === name);
        
            if (existingItem) {
                existingItem.quantity += 1;
            } else {
                cart.push({
                    id: Date.now(),
                    name: name,
                    price: parseFloat(priceText.replace('$', '')),
                    quantity: 1,
                    image: imgSrc
                });
            }
            
            saveCart();
            updateCartCount();
            viewCart();
        }
    });

    // 9. Apply Filters Functionality
    const applyFilterBtn = document.querySelector('.btn-apply-filter');
    if(applyFilterBtn) {
        applyFilterBtn.addEventListener('click', applyFilters);
    }
});

function applyFilters() {
    const products = document.querySelectorAll('.product-list-item');
    const searchTerm = document.querySelector('.search-container input').value.trim().toLowerCase();
    
    // Get filter values
    const categories = Array.from(document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]:checked'))
                            .map(cb => cb.parentElement.textContent.trim().toLowerCase());
    
    const minPrice = parseInt(document.querySelector('.price-min').value);
    const maxPrice = parseInt(document.querySelector('.price-max').value);

    const conditions = Array.from(document.querySelectorAll('.filter-group:nth-child(3) input[type="checkbox"]:checked'))
                            .map(cb => cb.parentElement.textContent.trim().toLowerCase());

    const ratings = Array.from(document.querySelectorAll('.filter-group:nth-child(4) input[type="checkbox"]:checked'))
                           .map(cb => parseInt(cb.parentElement.textContent.match(/\d+/)[0]));

    products.forEach(product => {
        const category = product.dataset.category ? product.dataset.category.toLowerCase() : '';
        const price = parseFloat(product.querySelector('.product-list-price').textContent.replace('$', ''));
        const name = product.querySelector('h3').textContent.toLowerCase();

        let categoryMatch = true;
        if (categories.length > 0 && !categories.includes('all products')) {
            categoryMatch = categories.includes(category) || categories.some(c => name.includes(c.slice(0, -1)));
        }

        const priceMatch = price >= minPrice && price <= maxPrice;
        
        const searchMatch = searchTerm === '' || name.includes(searchTerm);

        // Since we don't have data for condition and rating, we'll just show all for now
        // In a real application, you would have data attributes for these
        const conditionMatch = true; 
        const ratingMatch = true;

        if (categoryMatch && priceMatch && conditionMatch && ratingMatch && searchMatch) {
            product.style.display = 'flex';
        } else {
            product.style.display = 'none';
        }
    });

    displayAppliedFilters();
}



// 5. Go Back to Home
function goBackHome() {
    showPage('home-content');
}

// 8. Toggle Filter Groups
function toggleFilter(btn) {
    const filterGroup = btn.closest('.filter-group');
    const content = filterGroup.querySelector('.filter-list, .price-inputs, .price-range');
    const icon = btn.querySelector('i');
    
    if (content) {
        const isVisible = content.style.display !== 'none';
        content.style.display = isVisible ? 'none' : (content.classList.contains('filter-list') ? 'flex' : 'block');
        if(filterGroup.querySelector('.price-inputs')) filterGroup.querySelector('.price-inputs').style.display = isVisible ? 'none' : 'flex';
        if(filterGroup.querySelector('.price-range')) filterGroup.querySelector('.price-range').style.display = isVisible ? 'none' : 'block';

        icon.style.transform = isVisible ? 'rotate(0deg)' : 'rotate(180deg)';
    }
}

// 9. Apply Filters Logic
const appliedFiltersSection = document.getElementById('appliedFiltersSection');
const activeFiltersContainer = document.getElementById('activeFiltersContainer');
const resultsCount = document.getElementById('resultsCount');

let activeFilters = {};

function displayAppliedFilters() {
    if(!activeFiltersContainer || !appliedFiltersSection) return;

    activeFilters = {};
    document.querySelectorAll('.filter-list input[type="checkbox"]:checked').forEach(checkbox => {
        const label = checkbox.parentElement.textContent.trim();
        if (!activeFilters[label]) {
            activeFilters[label] = label;
        }
    });

    activeFiltersContainer.innerHTML = '';
    
    if (Object.keys(activeFilters).length === 0) {
        appliedFiltersSection.style.display = 'none';
    } else {
        appliedFiltersSection.style.display = 'block';
    }
    
    Object.values(activeFilters).forEach(filterValue => {
        const chip = document.createElement('span');
        chip.className = 'filter-chip';
        chip.innerHTML = `
            ${filterValue}
            <span class="remove-filter" onclick="removeFilter('${filterValue}')">×</span>
        `;
        activeFiltersContainer.appendChild(chip);
    });
    
    const clearBtn = document.querySelector('.btn-clear-all');
    if(clearBtn) clearBtn.style.display = Object.keys(activeFilters).length > 0 ? 'block' : 'none';
    
    const visibleItems = Array.from(document.querySelectorAll('.product-list-item')).filter(i => i.style.display !== 'none');
    if(resultsCount) resultsCount.textContent = `${visibleItems.length} items found`;
}

function removeFilter(filterValue) {
    delete activeFilters[filterValue];
    
    document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(checkbox => {
        if (checkbox.parentElement.textContent.includes(filterValue)) {
            checkbox.checked = false;
        }
    });
    
    applyFilters();
}

function clearAllFilters() {
    document.querySelectorAll('.filter-list input[type="checkbox"]').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    activeFilters = {};
    if(appliedFiltersSection) appliedFiltersSection.style.display = 'none';
    if(activeFiltersContainer) activeFiltersContainer.innerHTML = '';

    applyFilters();
}

// 10. Product Detail Page Functions
function viewProductDetail(productName, price, category, reviews) {
    showPage('product-detail-page');
    
    // Update breadcrumb
    document.getElementById('breadcrumb-category').textContent = category;
    document.getElementById('breadcrumb-product').textContent = productName;
    
    // Update product details
    document.getElementById('productTitle').textContent = productName;
    document.getElementById('productPrice').textContent = price;
    document.getElementById('reviewCount').textContent = reviews;
}

function changeMainImage(src) {
    document.getElementById('mainProductImage').src = src;
    document.querySelectorAll('.thumbnail').forEach(thumb => thumb.classList.remove('active'));
    const thumb = Array.from(document.querySelectorAll('.thumbnail')).find(t => t.src === src || t.getAttribute('src') === src);
    if (thumb) thumb.classList.add('active');
}

function selectColor(btn) {
    document.querySelectorAll('.color-btn').forEach(b => {
        b.style.borderColor = 'transparent';
    });
    btn.style.borderColor = '#0d6efd';
}

function increaseQty() {
    const input = document.getElementById('quantityInput');
    input.value = parseInt(input.value) + 1;
}

function decreaseQty() {
    const input = document.getElementById('quantityInput');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// 11. Category Selection from Home Page
function selectCategory(element, categoryName) {
    document.querySelectorAll('.category-sidebar li').forEach(li => {
        li.classList.remove('active');
    });
    element.classList.add('active');
    
    showPage('listing-content');
    
    const categoryMap = {
        'Clothes and wear': 'clothes',
        'Computer and tech': 'computer and tech',
        'Sports and outdoor': 'sports',
        'Home interiors': 'home',
        'Automobiles': 'automobiles',
        'Tools, equipments': 'tools',
        'Animal and pets': 'pets',
        'Machinery tools': 'machinery'
    };
    
    const filterValue = categoryMap[categoryName] || 'all';

    // Uncheck all category boxes
    document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]').forEach(cb => cb.checked = false);

    // Check the correct category box
    if (filterValue !== 'all') {
        const categoryCheckbox = Array.from(document.querySelectorAll('.filter-group:nth-child(1) input[type="checkbox"]'))
                                      .find(cb => cb.parentElement.textContent.trim().toLowerCase().includes(filterValue));
        if (categoryCheckbox) {
            categoryCheckbox.checked = true;
        }
    } else {
        const allProductsCheckbox = document.querySelector('.filter-group:nth-child(1) input[type="checkbox"]');
        if (allProductsCheckbox) {
            allProductsCheckbox.checked = true;
        }
    }

    applyFilters();

    document.getElementById('productsTitle').textContent = categoryName + ' Products';
}
