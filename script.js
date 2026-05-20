// Firebase Configuration - Replace with your own config from Firebase Console
const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT_ID.appspot.com",
    messagingSenderId: "YOUR_MESSAGING_SENDER_ID",
    appId: "YOUR_APP_ID"
};

// Initialize Firebase
if (typeof firebase !== 'undefined') {
    firebase.initializeApp(firebaseConfig);
    var db = firebase.firestore();
}

const PRICING_DATA = {
    "Veshje te ndryshme": [
        { label: "Kostume", price: 700 },
        { label: "Xhaketa", price: 400 },
        { label: "Jeleke Serioz", price: 200 },
        { label: "Xhaketa te bardha", price: 500 },
        { label: "Pantallona Serioze", price: 300 },
        { label: "Pardesy", price: "600-800", base: 600 },
        { label: "Pallto", price: "600-900", base: 600 },
        { label: "Xhup me vatine", price: "600-800", base: 600 },
        { label: "Xhup pupla", price: "700-1000", base: 700 },
        { label: "Xhup filter", price: "600-800", base: 600 },
        { label: "Kemisha", price: 300 },
        { label: "Pantallona xhinse", price: 300 },
        { label: "Bluze te gjata", price: 300 },
        { label: "Bluze te shkurtra", price: 200 }
    ],
    "Fustane dhe pajisje gjumi": [
        { label: "Pantallona te shkurtra", price: 200 },
        { label: "Fustane te shkurtra", price: "500-600", base: 500 },
        { label: "Fustane te gjata", price: "700-1000", base: 700 },
        { label: "Fustane nusesh", price: "2000-3500", base: 2000 },
        { label: "Funde", price: 300 },
        { label: "Batanije dopio (2 shtresa)", price: 1000 },
        { label: "Batanije teke", price: 700 },
        { label: "Jorgane Dopio", price: "900-1000", base: 900 },
        { label: "Jorgan teke", price: 700 },
        { label: "Jorgan me pupla dopio", price: 1300 },
        { label: "Jorgan me pupla tek", price: 1000 },
        { label: "Kllef Dysheku", price: "1000-1500", base: 1000 },
        { label: "Perde (M/Linear)", price: 200 },
        { label: "Larje me kg", price: "250-300", base: 250 }
    ]
};

const I18N = {
    en: {
        welcome: "Hi! Welcome to Laundry Express. Please choose your language to continue.",
        askName: "Great! What is your name?",
        greet: (name) => `Hello ${name}! What can we help you with today?`,
        chooseCategory: "Please choose a category:",
        chooseItems: "Click on the items you want to add to your order. We'll estimate the total for you.",
        categories: {
            "Veshje te ndryshme": "Various Clothing",
            "Fustane dhe pajisje gjumi": "Dresses & Bedding"
        },
        total: "Estimated Total",
        orderMore: "Add more items",
        finish: "Estimate my order",
        summary: "Here is your order summary:",
        back: "Back",
        currency: "lek",
        placeholder: "Type your name..."
    },
    sq: {
        welcome: "Përshëndetje! Mirësevini në Laundry Express. Ju lutem zgjidhni gjuhën për të vazhduar.",
        askName: "Shkëlqyeshëm! Si quheni ju?",
        greet: (name) => `Përshëndetje ${name}! Me çfarë mund t'ju ndihmojmë sot?`,
        chooseCategory: "Ju lutem zgjidhni një kategori:",
        chooseItems: "Kliko mbi artikujt që dëshironi të shtoni në porosinë tuaj. Ne do të llogarisim totalin për ju.",
        categories: {
            "Veshje te ndryshme": "Veshje të ndryshme",
            "Fustane dhe pajisje gjumi": "Fustane dhe pajisje gjumi"
        },
        total: "Totali i Vlerësuar",
        orderMore: "Shto artikuj të tjerë",
        finish: "Përfundo vlerësimin",
        summary: "Këtu është përmbledhja e porosisë tuaj:",
        back: "Mbrapa",
        currency: "lek",
        placeholder: "Shkruani emrin tuaj..."
    }
};

let state = {
    language: null,
    name: null,
    currentCategory: null,
    cart: []
};

const messagesContainer = document.getElementById('chat-messages');
const inputContainer = document.getElementById('chat-input-area');
const textInput = document.getElementById('name-input');
const sendBtn = document.getElementById('send-btn');

function addMessage(text, isUser = false, attachment = null) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${isUser ? 'user-message' : 'bot-message'}`;
    msgDiv.innerHTML = `<div>${text}</div>`;
    
    if (attachment) {
        msgDiv.appendChild(attachment);
    }
    
    messagesContainer.appendChild(msgDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function createOptions(options, callback) {
    const grid = document.createElement('div');
    grid.className = 'options-grid';
    
    options.forEach(opt => {
        const btn = document.createElement('button');
        btn.className = 'option-btn';
        btn.innerHTML = `<span>${opt.text}</span> ${opt.price ? `<span class="price">${opt.price}</span>` : ''}`;
        btn.onclick = () => {
            grid.style.pointerEvents = 'none';
            btn.style.borderColor = 'var(--primary)';
            callback(opt.id, opt.text);
        };
        grid.appendChild(btn);
    });
    
    return grid;
}

function init() {
    addMessage(I18N.en.welcome);
    const langOptions = createOptions([
        { id: 'en', text: 'English 🇬🇧' },
        { id: 'sq', text: 'Shqip 🇦🇱' }
    ], (id) => {
        state.language = id;
        addMessage(id === 'en' ? 'English' : 'Shqip', true);
        askName();
    });
    messagesContainer.appendChild(langOptions);
}

function askName() {
    const t = I18N[state.language];
    addMessage(t.askName);
    inputContainer.style.display = 'block';
    textInput.placeholder = t.placeholder;
    textInput.focus();
}

function handleNameSubmit() {
    const name = textInput.value.trim();
    if (name) {
        state.name = name;
        addMessage(name, true);
        textInput.value = '';
        inputContainer.style.display = 'none';
        showCategories();
    }
}

sendBtn.onclick = handleNameSubmit;
textInput.onkeypress = (e) => { if (e.key === 'Enter') handleNameSubmit(); };

function showCategories() {
    const t = I18N[state.language];
    addMessage(t.greet(state.name));
    addMessage(t.chooseCategory);
    
    const catOptions = createOptions([
        { id: 'Veshje te ndryshme', text: t.categories['Veshje te ndryshme'] },
        { id: 'Fustane dhe pajisje gjumi', text: t.categories['Fustane dhe pajisje gjumi'] }
    ], (id, text) => {
        state.currentCategory = id;
        addMessage(text, true);
        showItems(id);
    });
    messagesContainer.appendChild(catOptions);
}

function showItems(categoryId) {
    const t = I18N[state.language];
    addMessage(t.chooseItems);
    
    const items = PRICING_DATA[categoryId];
    const options = items.map(item => ({
        id: item.label,
        text: item.label,
        price: `${item.price} ${t.currency}`
    }));
    
    const itemGrid = createOptions(options, (label) => {
        const item = items.find(i => i.label === label);
        state.cart.push(item);
        updateCartDisplay();
    });
    
    messagesContainer.appendChild(itemGrid);
}

function updateCartDisplay() {
    const t = I18N[state.language];
    let existingSummary = document.querySelector('.cart-summary-message');
    
    if (existingSummary) {
        existingSummary.remove();
    }
    
    const summaryDiv = document.createElement('div');
    summaryDiv.className = 'cart-summary-message';
    
    const cartBox = document.createElement('div');
    cartBox.className = 'cart-summary';
    
    let totalMin = 0;
    state.cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        const priceVal = typeof item.price === 'number' ? item.price : item.base;
        totalMin += priceVal;
        
        itemDiv.innerHTML = `<span>${item.label}</span> <span>${item.price} ${t.currency}</span>`;
        cartBox.appendChild(itemDiv);
    });
    
    const totalDiv = document.createElement('div');
    totalDiv.className = 'cart-total';
    totalDiv.innerHTML = `<span>${t.total}:</span> <span>${totalMin} ${t.currency}+</span>`;
    cartBox.appendChild(totalDiv);
    
    const actionGrid = document.createElement('div');
    actionGrid.className = 'options-grid';
    actionGrid.style.marginTop = '12px';
    
    const moreBtn = document.createElement('button');
    moreBtn.className = 'option-btn';
    moreBtn.style.justifyContent = 'center';
    moreBtn.innerText = `➕ ${t.orderMore}`;
    moreBtn.onclick = () => {
        summaryDiv.style.opacity = '0.5';
        summaryDiv.style.pointerEvents = 'none';
        showCategories();
    };
    
    const finishBtn = document.createElement('button');
    finishBtn.className = 'option-btn';
    finishBtn.style.justifyContent = 'center';
    finishBtn.style.background = 'linear-gradient(135deg, var(--success), #059669)';
    finishBtn.innerText = `✅ ${t.finish}`;
    finishBtn.onclick = () => {
        addMessage(t.finish, true);
        addMessage(`${t.summary}`);
        addMessage(cartBox.outerHTML);
        
        // Firebase Submission
        submitOrderToFirebase();
    };
    
    actionGrid.appendChild(moreBtn);
    actionGrid.appendChild(finishBtn);
    
    summaryDiv.appendChild(cartBox);
    summaryDiv.appendChild(actionGrid);
    
    messagesContainer.appendChild(summaryDiv);
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
}

function submitOrderToFirebase() {
    if (typeof db === 'undefined') {
        console.warn("Firebase not initialized. Please configure script.js with your Firebase project details.");
        return;
    }

    const orderData = {
        name: state.name,
        language: state.language,
        items: state.cart.map(i => ({ label: i.label, price: i.price })),
        total: state.cart.reduce((acc, i) => acc + (typeof i.price === 'number' ? i.price : i.base), 0),
        timestamp: firebase.firestore.FieldValue.serverTimestamp()
    };

    db.collection("laundry_orders").add(orderData)
        .then((docRef) => {
            console.log("Order saved with ID: ", docRef.id);
            addMessage(state.language === 'en' ? "✅ Your order estimate has been saved!" : "✅ Vlerësimi i porosisë tuaj është ruajtur!");
        })
        .catch((error) => {
            console.error("Error adding document: ", error);
        });
}

init();
