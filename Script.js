// ==========================================
// 1. CONFIGURATION DU MAGASIN (تعديلات المتجر)
// ==========================================
const STORE_CONFIG = {
    // ضع رقم الواتساب الخاص بك هنا بالصيغة الدولية (بدون + أو مساحات)
    // مثال للمغرب: 212612345678
    whatsappNumber: "212600000000", 
    
    // اسم المنتج
    productName: "Sac à Main Luxe - Élégance Parisienne",
    
    // الثمن الفردي بالدرهم المغربي
    unitPrice: 350, 
    
    // مصاريف الشحن الافتراضية
    defaultDeliveryFee: 35, 
};

// ==========================================
// 2. STATE MANAGEMENT (إدارة حالة الطلب)
// ==========================================
let currentOrder = {
    selectedColor: "Rose Poudré",
    quantity: 1,
    unitPrice: STORE_CONFIG.unitPrice,
    deliveryFee: STORE_CONFIG.defaultDeliveryFee,
};

// ==========================================
// 3. DOM ELEMENTS (ربط عناصر الصفحة)
// ==========================================
const elements = {
    // Product Elements
    productTitle: document.getElementById('productTitle'),
    productPriceDisplay: document.getElementById('productPriceDisplay'),
    selectedColorName: document.getElementById('selectedColorName'),
    colorBtns: document.querySelectorAll('.color-btn'),
    qtyInput: document.getElementById('qtyInput'),
    btnMinus: document.getElementById('btnMinus'),
    btnPlus: document.getElementById('btnPlus'),

    // Form Elements
    orderForm: document.getElementById('orderForm'),
    fullName: document.getElementById('fullName'),
    phone: document.getElementById('phone'),
    city: document.getElementById('city'),
    address: document.getElementById('address'),
    btnReset: document.getElementById('btnReset'),

    // Summary Elements
    summaryQty: document.getElementById('summaryQty'),
    subtotalDisplay: document.getElementById('subtotalDisplay'),
    deliveryFeeDisplay: document.getElementById('deliveryFeeDisplay'),
    finalTotalDisplay: document.getElementById('finalTotalDisplay'),
    toast: document.getElementById('toast'),
};

// ==========================================
// 4. FUNCTIONS & LOGIC (الوظائف والعمليات)
// ==========================================

// Initialization
function initStore() {
    // Set initial product titles & prices from config
    elements.productTitle.textContent = STORE_CONFIG.productName;
    elements.productPriceDisplay.textContent = `${STORE_CONFIG.unitPrice} DH`;
    
    // Set button color backgrounds dynamically from data attribute
    elements.colorBtns.forEach(btn => {
        const bg = btn.getAttribute('data-bg');
        if (bg) btn.style.backgroundColor = bg;
    });

    updateCalculations();
}

// Calculate Subtotal & Total
function updateCalculations() {
    const subtotal = currentOrder.quantity * currentOrder.unitPrice;
    const finalTotal = subtotal + currentOrder.deliveryFee;

    // Update UI elements
    elements.summaryQty.textContent = currentOrder.quantity;
    elements.subtotalDisplay.textContent = `${subtotal} DH`;
    elements.deliveryFeeDisplay.textContent = `${currentOrder.deliveryFee} DH`;
    elements.finalTotalDisplay.textContent = `${finalTotal} DH`;
}

// Show Toast Notification
function showToast(message) {
    elements.toast.textContent = message;
    elements.toast.classList.add('show');
    setTimeout(() => {
        elements.toast.classList.remove('show');
    }, 3000);
}

// Validation Functions
function validateField(inputElement, errorElementId) {
    const errorMsg = document.getElementById(errorElementId);
    const parentGroup = inputElement.closest('.form-group');

    if (!inputElement.value.trim()) {
        parentGroup.classList.add('error');
        return false;
    }

    // Phone validation (10 digits starting with 0)
    if (inputElement.id === 'phone') {
        const phoneRegex = /^0[5-7][0-9]{8}$/;
        const cleanPhone = inputElement.value.replace(/\s+/g, '');
        if (!phoneRegex.test(cleanPhone)) {
            parentGroup.classList.add('error');
            return false;
        }
    }

    parentGroup.classList.remove('error');
    return true;
}

// Reset Form Errors
function clearErrors() {
    document.querySelectorAll('.form-group').forEach(group => {
        group.classList.remove('error');
    });
}

// Build & Format WhatsApp Text
function buildWhatsAppUrl() {
    const name = elements.fullName.value.trim();
    const phone = elements.phone.value.trim();
    const cityName = elements.city.options[elements.city.selectedIndex].value;
    const addressDetails = elements.address.value.trim();

    const subtotal = currentOrder.quantity * currentOrder.unitPrice;
    const grandTotal = subtotal + currentOrder.deliveryFee;

    // Beautiful French Message Template
    const message = 
`Bonjour Maison Élégance,

Je souhaite passer une commande :

🛍️ *PRODUIT* : ${STORE_CONFIG.productName}
🎨 *Couleur* : ${currentOrder.selectedColor}
🔢 *Quantité* : ${currentOrder.quantity}
💰 *Prix Unitaire* : ${STORE_CONFIG.unitPrice} DH

--------------------------------
👤 *INFORMATIONS CLIENT* :
• *Nom complet* : ${name}
• *Téléphone* : ${phone}
• *Ville* : ${cityName}
• *Adresse* : ${addressDetails}

--------------------------------
💵 *RÉCAPITULATIF FINANCIER* :
• *Sous-total* : ${subtotal} DH
• *Frais de livraison* : ${currentOrder.deliveryFee} DH
• *TOTAL À PAYER* : *${grandTotal} DH*

Merci de me confirmer la commande et le délai de livraison !`;

    // Encode URI for WhatsApp compatibility
    const encodedMessage = encodeURIComponent(message);
    return `https://wa.me/${STORE_CONFIG.whatsappNumber}?text=${encodedMessage}`;
}

// ==========================================
// 5. EVENT LISTENERS (الأحداث والتفاعلات)
// ==========================================

// Color Selection
elements.colorBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        elements.colorBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        currentOrder.selectedColor = btn.getAttribute('data-color');
        elements.selectedColorName.textContent = currentOrder.selectedColor;
    });
});

// Quantity Controls
elements.btnPlus.addEventListener('click', () => {
    if (currentOrder.quantity < 10) {
        currentOrder.quantity++;
        elements.qtyInput.value = currentOrder.quantity;
        updateCalculations();
    }
});

elements.btnMinus.addEventListener('click', () => {
    if (currentOrder.quantity > 1) {
        currentOrder.quantity--;
        elements.qtyInput.value = currentOrder.quantity;
        updateCalculations();
    }
});

// City Select Change (Updates Delivery Fee)
elements.city.addEventListener('change', (e) => {
    const selectedOption = e.target.options[e.target.selectedIndex];
    const fee = selectedOption.getAttribute('data-fee');
    
    if (fee) {
        currentOrder.deliveryFee = parseInt(fee, 10);
        updateCalculations();
    }
});

// Reset Form
elements.btnReset.addEventListener('click', () => {
    elements.orderForm.reset();
    clearErrors();
    currentOrder.quantity = 1;
    currentOrder.deliveryFee = STORE_CONFIG.defaultDeliveryFee;
    elements.qtyInput.value = 1;
    updateCalculations();
    showToast("Le formulaire a été réinitialisé.");
});

// Form Submission -> Redirection to WhatsApp
elements.orderForm.addEventListener('submit', (e) => {
    e.preventDefault();

    // Validate all fields
    const isNameValid = validateField(elements.fullName, 'fullNameError');
    const isPhoneValid = validateField(elements.phone, 'phoneError');
    const isCityValid = validateField(elements.city, 'cityError');
    const isAddressValid = validateField(elements.address, 'addressError');

    if (isNameValid && isPhoneValid && isCityValid && isAddressValid) {
        const whatsappUrl = buildWhatsAppUrl();
        
        showToast("Redirection vers WhatsApp en cours...");
        
        // Open WhatsApp in a new tab/app after 800ms delay
        setTimeout(() => {
            window.open(whatsappUrl, '_blank');
        }, 800);
    } else {
        showToast("Veuillez remplir correctement tous les champs obligatoires.");
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', initStore);
