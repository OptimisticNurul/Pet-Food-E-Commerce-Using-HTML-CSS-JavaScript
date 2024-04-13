const searchInput = document.getElementById('searchInput');
const productBoxes = document.querySelectorAll('.product-box');

searchInput.addEventListener('input', filterProducts);

function filterProducts() {
    const keyword = searchInput.value.toLowerCase();

    productBoxes.forEach((box) => {
        const title = box.querySelector('.product-title').textContent.toLowerCase();

        if (title.includes(keyword)) {
            box.style.display = 'block';
        } else {
            box.style.display = 'none';
        }
    });
}

const cartIcon = document.querySelector("#cart-icon");
const cart = document.querySelector(".cart");
const closeCart = document.querySelector("#cart-close");

cartIcon.addEventListener("click", () => {
    cart.classList.add("active");
});

closeCart.addEventListener("click", () => {
    cart.classList.remove("active");
});

if (document.readyState == "loading") {
    document.addEventListener("DOMContentLoaded", start);
} else {
    start();
}

function start() {
    addEvents();
}

function update() {
    addEvents();
    updateTotal();
    updateCartNumber();
}

function addEvents() {
    let cartRemove_btns = document.querySelectorAll(".cart-remove");
    console.log(cartRemove_btns);
    cartRemove_btns.forEach((btn) => {
        btn.addEventListener("click", handle_removeCartItem);
    });

    let cartQuantity_inputs = document.querySelectorAll(".cart-quantity");
    cartQuantity_inputs.forEach((input) => {
        input.addEventListener("change", handle_changeItemQuantity);
    });

    let addCart_btns = document.querySelectorAll(".add-cart");
    addCart_btns.forEach((btn) => {
        btn.addEventListener("click", handle_addCartItem);
    });

    const buy_btn = document.querySelector(".btn-buy");
    buy_btn.addEventListener("click", handle_buyOrder);
}

let itemsAdded = [];

function handle_addCartItem() {
    let product = this.parentElement;
    let title = product.querySelector(".product-title").innerHTML;
    let price = product.querySelector(".product-price").innerHTML;
    let imgSrc = product.querySelector(".product-img").src;
    console.log(title, price, imgSrc);

    let newToAdd = {
        title,
        price,
        imgSrc,
    };

    if (itemsAdded.find((el) => el.title == newToAdd.title)) {
        alert("This Item Is Already Exist!");
        return;
    } else {
        itemsAdded.push(newToAdd);
    }

    let cartBoxElement = CartBoxComponent(title, price, imgSrc);
    let newNode = document.createElement("div");
    newNode.innerHTML = cartBoxElement;
    const cartContent = cart.querySelector(".cart-content");
    cartContent.appendChild(newNode);

    update();
}

function handle_removeCartItem() {
    this.parentElement.remove();
    itemsAdded = itemsAdded.filter(
        (el) =>
            el.title !=
            this.parentElement.querySelector(".cart-product-title").innerHTML
    );

    update();
}

function handle_changeItemQuantity() {
    if (isNaN(this.value) || this.value < 1) {
        this.value = 1;
    }
    this.value = Math.floor(this.value);

    update();
}

function handle_buyOrder() {
    if (itemsAdded.length <= 0) {
        alert("There is No Order to Place Yet! \nPlease Make an Order first.");
        return;
    }
    const cartContent = cart.querySelector(".cart-content");
    cartContent.innerHTML = "";
    alert("Your Order is Placed Successfully :)");
    itemsAdded = [];

    update();
}

function updateTotal() {
    let cartBoxes = document.querySelectorAll(".cart-box");
    const totalElement = cart.querySelector(".total-price");
    let total = 0;
    cartBoxes.forEach((cartBox) => {
        let priceElement = cartBox.querySelector(".cart-price");
        let price = parseFloat(priceElement.innerHTML.replace("$", ""));
        let quantity = cartBox.querySelector(".cart-quantity").value;
        total += price * quantity;
    });

    total = total.toFixed(2);
    totalElement.innerHTML = "$" + total;
}

function updateCartNumber() {
    const cartIcon = document.querySelector("#cart-icon");
    const cartNumber = document.querySelector(".cart-number");
    cartNumber.textContent = itemsAdded.length;
}

function CartBoxComponent(title, price, imgSrc) {
    return `
        <div class="cart-box">
            <img src=${imgSrc} alt="" class="cart-img">
            <div class="detail-box">
                <div class="cart-product-title">${title}</div>
                <div class="cart-price">${price}</div>
                <input type="number" value="1" class="cart-quantity">
            </div>
            <i class='bx bxs-trash-alt cart-remove'></i>
        </div>`;
}

function submitProduct() {
    const title = document.getElementById('title').value;
    const price = document.getElementById('price').value;
    const imageInput = document.getElementById('image');

    if (!title || !price || !imageInput.files[0]) {
        alert('Please fill in all fields');
        return;
    }

    const reader = new FileReader();
    reader.onload = function (e) {
        const image = e.target.result;

        const newProductBox = document.createElement('div');
        newProductBox.className = 'product-box';

        const productHTML = `
            <img src="${image}" alt="${title}" class="product-img">
            <h2 class="product-title">${title}</h2>
            <span class="product-price">$${price}</span>
            <i class='bx bx-shopping-bag add-cart'></i>
        `;

        newProductBox.innerHTML = productHTML;

        const newProductsSection = document.getElementById('newProducts');
        newProductsSection.insertBefore(newProductBox, newProductsSection.firstChild);

        document.getElementById('title').value = '';
        document.getElementById('price').value = '';
        document.getElementById('image').value = '';
    };

    reader.readAsDataURL(imageInput.files[0]);
}

document.addEventListener('DOMContentLoaded', function () {
    const chatPopup = document.getElementById('chatPopup');
    const chatBody = document.getElementById('chatBody');
    const userMessageInput = document.getElementById('userMessage');
    const sendMessageBtn = document.getElementById('sendMessage');
    const closeChat = document.getElementById('closeChat');

    setTimeout(() => {
        chatPopup.style.display = 'block';
        chatPopup.style.animation = 'fadeInUp 0.5s ease';
    }, 1000);

    closeChat.addEventListener('click', () => {
        chatPopup.style.display = 'none';
    });

    sendMessageBtn.addEventListener('click', () => {
        const userMessage = userMessageInput.value;
        if (userMessage.trim() !== '') {
            appendMessage('user', userMessage);
            userMessageInput.value = '';

            setTimeout(() => {
                appendMessage('agent', 'Thank you for your message! How can we assist you further?');
            }, 1000);
        }
    });

    function appendMessage(sender, message) {
        const messageElement = document.createElement('p');
        messageElement.textContent = message;

        if (sender === 'user') {
            messageElement.classList.add('user-message');
        } else if (sender === 'agent') {
            messageElement.classList.add('agent-message');
        }

        chatBody.appendChild(messageElement);
    }
});

function addToStorage(storageType) {
    const firstName = document.getElementById(`${storageType}FirstName`).value;
    const lastName = document.getElementById(`${storageType}LastName`).value;
    const email = document.getElementById(`${storageType}Email`).value;
    const phone = document.getElementById(`${storageType}Phone`).value;

    const data = { firstName, lastName, email, phone };

    if (storageType === 'localStorage' || storageType === 'sessionStorage') {
        addToDatabase(storageType, data);
    } else if (storageType === 'indexedDB') {
        addToIndexedDB(data);
    } else if (storageType === 'webSQL') {
        addToWebSQL(data);
    }
}

function updateTable(storageType) {
    const table = document.getElementById(`${storageType}Table`).getElementsByTagName('tbody')[0];
    table.innerHTML = '';

    if (storageType === 'localStorage' || storageType === 'sessionStorage') {
        const storageData = JSON.parse(window[storageType].getItem('storageData')) || [];
        storageData.forEach(item => {
            const row = table.insertRow(-1);
            for (const key in item) {
                if (item.hasOwnProperty(key)) {
                    const cell = row.insertCell();
                    cell.innerHTML = item[key];
                }
            }
        });
    } else if (storageType === 'indexedDB') {
        readIndexedDB(table);
    } else if (storageType === 'webSQL') {
        readWebSQL(table);
    }
}

function addToDatabase(storageType, data) {
    const storageData = JSON.parse(window[storageType].getItem('storageData')) || [];
    storageData.push(data);
    window[storageType].setItem('storageData', JSON.stringify(storageData));
    updateTable(storageType);
}

function addToIndexedDB(data) {
    const request = window.indexedDB.open('myDatabase', 1);

    request.onerror = function (event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['storageData'], 'readwrite');
        const objectStore = transaction.objectStore('storageData');

        const addRequest = objectStore.add(data);

        addRequest.onsuccess = function () {
            console.log('Data added to IndexedDB successfully.');
            updateTable('indexedDB');
        };

        addRequest.onerror = function (error) {
            console.error('Error adding data to IndexedDB:', error.target.error);
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };

    request.onupgradeneeded = function (event) {
        const db = event.target.result;
        db.createObjectStore('storageData', { keyPath: 'id', autoIncrement: true });
    };
}

function addToWebSQL(data) {
    const webSQLDB = openDatabase('myDatabase', '1.0', 'Storage Data', 2 * 1024 * 1024);

    webSQLDB.transaction(function (tx) {
        tx.executeSql(
            'CREATE TABLE IF NOT EXISTS storageData (id INTEGER PRIMARY KEY, firstName TEXT, lastName TEXT, email TEXT, phone TEXT)',
            [],
            function () {
                tx.executeSql(
                    'INSERT INTO storageData (firstName, lastName, email, phone) VALUES (?, ?, ?, ?)',
                    [data.firstName, data.lastName, data.email, data.phone],
                    function () {
                        console.log('Data added to Web SQL successfully.');
                        updateTable('webSQL');
                    },
                    function (tx, error) {
                        console.error('Web SQL error:', error.message);
                    }
                );
            },
            function (tx, error) {
                console.error('Web SQL error:', error.message);
            }
        );
    });
}

function readIndexedDB(table) {
    const request = window.indexedDB.open('myDatabase', 1);

    request.onerror = function (event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };

    request.onsuccess = function (event) {
        const db = event.target.result;
        const transaction = db.transaction(['storageData'], 'readonly');
        const objectStore = transaction.objectStore('storageData');
        const getAllRequest = objectStore.getAll();

        getAllRequest.onsuccess = function () {
            const storageData = getAllRequest.result;
            storageData.forEach(item => {
                const row = table.insertRow(-1);
                for (const key in item) {
                    if (item.hasOwnProperty(key) && key !== 'id') {
                        const cell = row.insertCell();
                        cell.innerHTML = item[key];
                    }
                }
            });
        };

        getAllRequest.onerror = function (error) {
            console.error('Error reading data from IndexedDB:', error.target.error);
        };

        transaction.oncomplete = function () {
            db.close();
        };
    };
}

function readWebSQL(table) {
    const webSQLDB = openDatabase('myDatabase', '1.0', 'Storage Data', 2 * 1024 * 1024);

    webSQLDB.transaction(function (tx) {
        tx.executeSql(
            'SELECT * FROM storageData',
            [],
            function (tx, result) {
                const rows = result.rows;
                for (let i = 0; i < rows.length; i++) {
                    const item = rows.item(i);
                    const row = table.insertRow(-1);
                    for (const key in item) {
                        if (item.hasOwnProperty(key) && key !== 'id') {
                            const cell = row.insertCell();
                            cell.innerHTML = item[key];
                        }
                    }
                }
            },
            function (tx, error) {
                console.error('Web SQL error:', error.message);
            }
        );
    });
}
