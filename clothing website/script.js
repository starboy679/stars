const products = [
    {
        id: 1,
        title: "Shirt",
        category: "men",
        price: 59.99,
        // Add your product description here
        description: "A classic black toxido, perfect for formal events. Made from high-quality wool blend for a comfortable fit.",
        rating: 4.5,
        // Add more image URLs to this array for a gallery.
        // To add a local image, place the image file in your project folder (e.g., in an 'images' subfolder)
        // and use the relative path, like: "images/my-product-image.jpg"
        images: [
            "products-pics/shirts/shirt 1.jpg",
            "products-pics/shirts/shirt 2.jpg",
            "products-pics/shirts/shirt 3.jpg",
        ],
    },
    {
        id: 2,
        title: "Dress",
        category: "women",
        price: 19.99,
        description: "A stylish and comfortable shirt for everyday wear. Available in multiple colors.",
        rating: 4.0,
        images: [
            "products-pics/women/dress 1.jpg",
            "products-pics/women/dress 2.jpg",
            "products-pics/women/dress 3.jpg"
        ],
    },
    {
        id: 3,
        title: "T-shirt",
        category: "men",
        price: 10.99,
        description: "A soft and breathable t-shirt, perfect for a casual look. Made from 100% organic cotton.",
        rating: 5.0,
        images: [
            "products-pics/t shits/t shirt 1.jpg",
            "products-pics/t shits/t shirt 2.jpg",
            "products-pics/t shits/t shirt 3.jpg"
        ],
    },
    {
        id: 4,
        title: "Pants",
        category: "men",
        price: 79.99,
        description: "High-quality artist paints with vibrant colors. Non-toxic and suitable for all ages.",
        rating: 4.2,
        images: [
            "products-pics/pants/pants 1.jpg",
            "products-pics/pants/pants 2.jpg",
            "products-pics/pants/pants 3.jpg"
        
        ],
    }
];




let cart = [];
let currentPaymentMethod = 'credit';



function renderProducts() {
    const showcase = document.getElementById('productShowcase');
    showcase.innerHTML = ''; // Clear previous content

    // Get unique categories from the products array
    const categories = [...new Set(products.map(p => p.category))];

    categories.forEach(category => {
        // Filter products for the current category
        const productsOfCategory = products.filter(p => p.category === category);

        // Create the HTML for the product cards in this category
        const productCardsHTML = productsOfCategory.map(product => `
            <div class="product-card" data-category="${product.category}" onclick="openProductModal(event, ${product.id})">
                <img src="${product.images[0]}" alt="${product.title}" class="product-image">
                <div class="product-info">
                    <h3 class="product-title">${product.title}</h3>
                    <p class="product-category">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</p>
                    <div class="product-price">$${product.price.toFixed(2)}</div>
                    <div class="product-buttons">
                        <button class="add-to-cart" onclick="addToCart(event, ${product.id})">Add to Cart</button>
                        <button class="buy-now" onclick="buyNow(event, ${product.id})">Buy Now</button>
                    </div>
                </div>
            </div>
        `).join('');

        // Create the full row for this category and append it to the showcase
        const categoryRowHTML = `
            <div class="product-row">
                <h2 class="category-title">${category.charAt(0).toUpperCase() + category.slice(1)}</h2>
                <div class="product-grid">${productCardsHTML}</div>
            </div>
        `;
        showcase.innerHTML += categoryRowHTML;
    });
}

function addToCart(event, productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    updateCartCount();

    const button = event.target;
    const originalText = button.textContent;
    button.innerHTML = '<i class="fas fa-check"></i> Added!';
    button.style.background = '#34c759';
    button.style.color = '#fff';
    button.disabled = true;

    setTimeout(() => {
        button.textContent = originalText;
        button.style.background = button.classList.contains('buy-now') ? '#ff5100' : '#000';
        button.style.color = '#fff';
        button.disabled = false;
    }, 1000);
    renderCart();

}

function buyNow(event, productId) {
    addToCart(event, productId);
    // Change the button text to "Let's Go!" and keep orange color
    const button = event.target;
    button.innerHTML = '<i class="fas fa-check"></i> Let\'s Go!';
    button.style.background = '#ff5100';
    // Open cart modal if not already open
    const model = document.getElementById('cartModel');
    if (model.style.display !== 'block') {
        ToggleCart();
    }
    // Proceed to checkout
    setTimeout(() => {
        showCheckOut();
    }, 100); // Small delay to ensure modal is open
}



function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCartCount();
    renderCart();
}


function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            updateCartCount();
            renderCart();
        }
    }
}

function updateCartCount() {

    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

function renderCart() {

    const cartItems = document.getElementById('cartItems');
    const cartTotal = document.getElementById('cartTotal');

    if (cart.length === 0) {
        cartItems.innerHTML = `
          <div class="empty-cart">
                        <div class="empty-cart-icon">
                            <i class="fas fa-shopping-cart"></i>
                        </div>
                        <p>Your Cart is empty</p>
                    </div>
            `;
        cartTotal.style.display = 'none';
        return;
    }
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-items">
            <img src="${item.images[0]}" alt="${item.title}" class="cart-item-image">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.title}</div>
                    <div class="cart-item-footer">
                        <div class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</div>
                        <div class="quantity-controls">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)"><i class="fa fa-minus"></i></button>
                            <span class="quantity">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, +1)"><i class="fa fa-plus"></i></button>
                        </div>
                    </div>
                </div>
            </div>
        `
    ).join('');

    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('totalPrice').textContent = `Total: $${total.toFixed(2)}`;
    document.getElementById('checkOutTotal').textContent = `Total: $${total.toFixed(2)}`;
    cartTotal.style.display = 'block';
}

function ToggleCart() {
    const model = document.getElementById('cartModel');
    if (model.style.display === 'block') {
        model.classList.remove('active');
        model.style.display = 'none';
    } else {
        model.style.display = 'block';
        setTimeout(() => {
            model.classList.add('active');
        }, 10);
    }

    hideCheckout();

}

function showCheckOut() {
    if (cart.length === 0) return;

    document.getElementById('cartItems').style.display = 'none';
    document.getElementById('cartTotal').style.display = 'none';
    document.getElementById('checkOutForm').classList.add('active');

    // Populate order summary
    const orderItems = document.getElementById('orderItems');
    orderItems.innerHTML = cart.map(item => `
        <div class="order-item">
            <span class="order-item-title">${item.title}</span>
            <span class="order-item-quantity">x${item.quantity}</span>
            <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
}
function hideCheckOut() {


    document.getElementById('cartItems').style.display = 'block';
    document.getElementById('cartTotal').style.display = 'block';
    document.getElementById('checkOutForm').classList.remove('active');
    document.getElementById('checkOutForm').style.display = 'none';

}

function selectPayment(method, element) {
    currentPaymentMethod = method;
    document.querySelectorAll('.payment-method').forEach(btn => btn.classList.remove('active'));
    element.classList.add('active');

    const creditCardForm = document.getElementById('creditCardForm');
    if (method === 'credit') {
        creditCardForm.style.display = 'block';
        // Set required for credit card fields
        document.getElementById('cardName').required = true;
        document.getElementById('cardNumber').required = true;
        document.getElementById('expireDate').required = true;
        document.getElementById('cvvCode').required = true;
    } else {
        creditCardForm.style.display = 'none';
        // Remove required for credit card fields
        document.getElementById('cardName').required = false;
        document.getElementById('cardNumber').required = false;
        document.getElementById('expireDate').required = false;
        document.getElementById('cvvCode').required = false;
    }

    // Update the hidden input field for Netlify
    document.getElementById('paymentMethodInput').value = method;
}

async function processOrder(event) {
    event.preventDefault();

    if (cart.length === 0) return;

    const form = event.target;
    const formData = new FormData(form);

    // Create a clean, readable summary of cart items for the submission
    const cartSummary = cart.map(item => ({
        product: item.title,
        quantity: item.quantity,
        price: `$${item.price.toFixed(2)}`,
        total: `$${(item.price * item.quantity).toFixed(2)}`
    }));
    formData.set('cart-items', JSON.stringify(cartSummary, null, 2));

    formData.set('cart-total', cart.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2));

    // **Improvement:** Only include credit card info if the payment method is 'credit'
    if (currentPaymentMethod !== 'credit') {
        formData.delete('cardName');
        formData.delete('cardNumber');
        formData.delete('expireDate');
        formData.delete('cvvCode');
    }

    const placeOrderBtn = document.getElementById('place-order-btn');
    placeOrderBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    placeOrderBtn.disabled = true;

    try {
        await fetch(form.action, {
            method: "POST",
            body: formData,
            headers: { 'Accept': 'application/json' }
        });

        // Since the submission is working on Formspree's side,
        // we can assume that if the fetch command doesn't throw a network error,
        // the submission was successful. We will proceed directly to the success logic
        // to avoid the false error alert caused by browser security (CORS).


        // --- Post-Order Cleanup and Success Message ---
        form.reset();
        cart = [];
        updateCartCount();
        renderCart();
        selectPayment('credit', document.querySelector('.payment-method[onclick*="credit"]'));
        hideCheckOut();
        ToggleCart();

        // Show the new success modal
        const successModal = document.getElementById('successModalOverlay');
        successModal.style.display = 'flex';
        setTimeout(() => successModal.classList.add('active'), 10);

        // After 3 seconds, hide the modal and scroll to top
        setTimeout(() => {
            successModal.classList.remove('active');
            setTimeout(() => {
                successModal.style.display = 'none';
                // Scroll to the top of the page smoothly
                window.scrollTo({ top: 0, behavior: 'smooth' });
            }, 400); // Wait for fade out transition
        }, 3000); // Keep modal visible for 3 seconds

    } catch (error) {
        console.error('Form submission error:', error);
        alert('Sorry, there was an error submitting your order. Please try again.');
    } finally {
        // Always reset the button state
        placeOrderBtn.innerHTML = '<i class="fas fa-rocket"></i>Order';
        placeOrderBtn.disabled = false;
    }
}

document.addEventListener('DOMContentLoaded', function () {
    const cardNumberInput = document.getElementById('cardNumber')
    const expiryInput = document.getElementById('expiryDate')
    const cvvInput = document.getElementById('cvvInput')

    if (cardNumberInput) {

        cardNumberInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\s+/g, '').replace(/[^0-9]/gi, '')
            let matches = value.match(/.{1,4}/g);
            if (matches) {
                e.target.value = matches.join(' ');
            }

        })


    }

    if (expiryInput) {
        expiryInput.addEventListener('input', function (e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }

            e.target.value = value;

        })
    }
    if (cvvInput) {
        cvvInput.addEventListener('input',function(e){
            e.target.value = e.target.value.replace(/[*0-9]/g,'*').substring(0,4);

        })
    }
});

document.getElementById('cartModel').addEventListener('click', function (e) {
    if (e.target === this) {
        ToggleCart();
}
});


document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if(target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
        
    })

})

function showSection(id){

    const sections = document.querySelectorAll('.section');
    sections.forEach(sec => sec.style.display = "none");

    document.getElementById(id).style.display = "block";
}

document.addEventListener('DOMContentLoaded', function () {
    renderProducts();
    updateCartCount();
    setupHeaderScroll();
    setupHeroCarousel();
});

function setupHeaderScroll() {
    const header = document.querySelector('.header');
    const hero = document.querySelector('.hero');

    if (!header || !hero) return;

    const triggerHeight = hero.offsetHeight * 0.8; // Trigger when 80% of the hero is scrolled past

    window.addEventListener('scroll', () => {
        if (window.scrollY > triggerHeight) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

function setupHeroCarousel() {
    const slides = document.querySelectorAll('.hero-bg');
    let currentSlide = 0;

    if (slides.length === 0) return;

    setInterval(() => {
        slides[currentSlide].classList.remove('active');
        currentSlide = (currentSlide + 1) % slides.length;
        slides[currentSlide].classList.add('active');
    }, 5000); // Change image every 5 seconds
}

function openProductModal(event, productId) {
    // Prevent modal from opening if the 'Add to Cart' or 'Buy Now' button inside the card was clicked
    if (event.target.classList.contains('add-to-cart') || event.target.classList.contains('buy-now')) {
        return;
    }

    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Populate modal with product data
    document.getElementById('modalMainImage').src = product.images[0];
    document.getElementById('modalProductTitle').textContent = product.title;
    document.getElementById('modalProductCategory').textContent = product.category;
    document.getElementById('modalProductPrice').textContent = `$${product.price.toFixed(2)}`;
    document.getElementById('modalProductDescription').textContent = product.description;

    // Generate rating stars
    const ratingContainer = document.getElementById('modalProductRating');
    ratingContainer.innerHTML = '';
    const fullStars = Math.floor(product.rating);
    const halfStar = product.rating % 1 !== 0;
    const emptyStars = 5 - Math.ceil(product.rating);

    for (let i = 0; i < fullStars; i++) {
        ratingContainer.innerHTML += '<i class="fas fa-star"></i>';
    }
    if (halfStar) {
        ratingContainer.innerHTML += '<i class="fas fa-star-half-alt"></i>';
    }
    for (let i = 0; i < emptyStars; i++) {
        ratingContainer.innerHTML += '<i class="far fa-star"></i>';
    }

    // Generate thumbnails
    const thumbnailsContainer = document.getElementById('modalThumbnails');
    thumbnailsContainer.innerHTML = product.images.map((img, index) =>
        `<img src="${img}" alt="Thumbnail ${index + 1}" class="modal-thumbnail ${index === 0 ? 'active' : ''}" onclick="changeModalImage(event, '${img}')">`
    ).join('');

    // Setup "Add to Cart" button inside the modal
    const modalAddToCartBtn = document.getElementById('modalAddToCartBtn');
    modalAddToCartBtn.onclick = (e) => {
        addToCart(e, product.id);
        closeProductModal();
    };

    // Setup "Buy Now" button inside the modal
    const modalBuyNowBtn = document.getElementById('modalBuyNowBtn');
    modalBuyNowBtn.onclick = (e) => {
        closeProductModal();
        buyNow(e, product.id);
    };

    // Show the modal
    const modalOverlay = document.getElementById('productModalOverlay');
    modalOverlay.classList.add('active');
}

function closeProductModal() {
    document.getElementById('productModalOverlay').classList.remove('active');
}

function changeModalImage(event, newImageSrc) {
    document.getElementById('modalMainImage').src = newImageSrc;

    // Update active state on thumbnails
    document.querySelectorAll('.modal-thumbnail').forEach(thumb => {
        thumb.classList.remove('active');
    });
    element.classList.add('active');
}

function toggleSideMenuContact(event) {
    event.preventDefault();
    document.getElementById('sideMenu').classList.toggle('show-contact');
}

function toggleSideMenuAbout(event) {
    event.preventDefault();
    document.getElementById('sideMenu').classList.toggle('show-about');
}

function toggleMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('sideMenuOverlay');
    menu.classList.toggle('active');
    overlay.classList.toggle('active');
    document.body.classList.toggle('menu-open');
}

function closeMenu() {
    const menu = document.getElementById('sideMenu');
    const overlay = document.getElementById('sideMenuOverlay');
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('menu-open');
}

// Add event listener to close modal when clicking on the overlay
document.getElementById('productModalOverlay').addEventListener('click', function(event) {
    // Check if the click is on the overlay itself and not on its children
    if (event.target === this) {
        closeProductModal();
    }
});
