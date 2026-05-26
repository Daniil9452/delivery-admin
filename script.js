// ========== ДАННЫЕ (имитация API) ==========
let orders = [
    { id: 1245, client: "Иван Иванов", phone: "+7 999 123-45-67", from: "ул. Ленина 10", to: "ул. Гагарина 5", type: "Документы", weight: "0.5 кг", status: "В пути", courier: "Сергей", comment: "Позвонить за 10 минут" },
    { id: 1244, client: "Мария Петрова", phone: "+7 999 234-56-78", from: "пр. Мира 2", to: "ул. Солнечная 15", type: "Пакет", weight: "2 кг", status: "Новый", courier: null, comment: "" },
    { id: 1243, client: "Петр Сидоров", phone: "+7 999 345-67-89", from: "ул. Лесная 7", to: "ул. Полевая 8", type: "Коробка", weight: "5 кг", status: "Доставлен", courier: "Алексей", comment: "Оставить у двери" }
];

// ========== АВТОРИЗАЦИЯ ==========
if (document.getElementById('loginForm')) {
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const login = document.getElementById('login').value;
        const password = document.getElementById('password').value;
        
        if (login === "admin" && password === "123") {
            localStorage.setItem('adminLoggedIn', 'true');
            window.location.href = 'orders.html';
        } else {
            document.getElementById('errorMsg').textContent = "Неверный логин или пароль";
        }
    });
}

// ========== ПРОВЕРКА ВХОДА ==========
function checkAuth() {
    if (localStorage.getItem('adminLoggedIn') !== 'true' && !window.location.href.includes('index.html')) {
        window.location.href = 'index.html';
    }
}
checkAuth();

// ========== ВЫХОД ==========
document.querySelectorAll('#logoutBtn').forEach(btn => {
    if (btn) {
        btn.addEventListener('click', () => {
            localStorage.removeItem('adminLoggedIn');
            window.location.href = 'index.html';
        });
    }
});

// ========== ОТОБРАЖЕНИЕ СПИСКА ЗАКАЗОВ ==========
function renderOrders() {
    const container = document.getElementById('ordersList');
    if (!container) return;
    
    const filter = document.getElementById('statusFilter')?.value || 'all';
    const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);
    
    if (filtered.length === 0) {
        container.innerHTML = '<div class="loading">Заказов не найдено</div>';
        return;
    }
    
    container.innerHTML = filtered.map(order => `
        <div class="order-card" data-id="${order.id}">
            <div style="display: flex; justify-content: space-between;">
                <strong>Заказ №${order.id}</strong>
                <span class="status status-${order.status.replace(/ /g, '_')}">${order.status}</span>
            </div>
            <div style="margin-top: 10px;">
                <div>Клиент: ${order.client}</div>
                <div>Откуда: ${order.from}</div>
                <div>Куда: ${order.to}</div>
                <div>Курьер: ${order.courier || "не назначен"}</div>
            </div>
        </div>
    `).join('');
    
    document.querySelectorAll('.order-card').forEach(card => {
        card.addEventListener('click', () => {
            const id = card.getAttribute('data-id');
            window.location.href = `order-detail.html?id=${id}`;
        });
    });
}

// Фильтр
const filterSelect = document.getElementById('statusFilter');
if (filterSelect) {
    filterSelect.addEventListener('change', renderOrders);
}

// ========== ДЕТАЛИ ЗАКАЗА ==========
function renderOrderDetail() {
    const params = new URLSearchParams(window.location.search);
    const orderId = parseInt(params.get('id'));
    const order = orders.find(o => o.id === orderId);
    
    if (!order) {
        document.getElementById('orderDetail').innerHTML = '<div class="loading">Заказ не найден</div>';
        return;
    }
    
    const couriers = ["Не назначен", "Сергей", "Алексей", "Дмитрий"];
    
    document.getElementById('orderDetail').innerHTML = `
        <h2>Заказ №${order.id}</h2>
        
        <div class="detail-row">
            <label>Клиент:</label> ${order.client} (${order.phone})
        </div>
        <div class="detail-row">
            <label>Тип груза:</label> ${order.type}
        </div>
        <div class="detail-row">
            <label>Вес:</label> ${order.weight}
        </div>
        <div class="detail-row">
            <label>Откуда:</label> ${order.from}
        </div>
        <div class="detail-row">
            <label>Куда:</label> ${order.to}
        </div>
        <div class="detail-row">
            <label>Комментарий:</label> ${order.comment || "Нет комментария"}
        </div>
        
        <div class="detail-row">
            <label>Статус:</label>
            <select id="statusSelect">
                <option ${order.status === 'Новый' ? 'selected' : ''}>Новый</option>
                <option ${order.status === 'В пути' ? 'selected' : ''}>В пути</option>
                <option ${order.status === 'Доставлен' ? 'selected' : ''}>Доставлен</option>
                <option ${order.status === 'Проблема' ? 'selected' : ''}>Проблема</option>
            </select>
        </div>
        
        <div class="detail-row">
            <label>Курьер:</label>
            <select id="courierSelect">
                ${couriers.map(c => `<option ${order.courier === c ? 'selected' : ''}>${c}</option>`).join('')}
            </select>
        </div>
        
        <button class="save-btn" id="saveBtn">Сохранить изменения</button>
    `;
    
    document.getElementById('saveBtn')?.addEventListener('click', () => {
        const newStatus = document.getElementById('statusSelect').value;
        const newCourier = document.getElementById('courierSelect').value;
        
        order.status = newStatus;
        order.courier = newCourier === "Не назначен" ? null : newCourier;
        
        alert('Изменения сохранены!');
        renderOrderDetail(); // обновить
        if (typeof renderOrders === 'function') renderOrders();
    });
}

// Запуск
if (window.location.href.includes('orders.html')) {
    renderOrders();
}
if (window.location.href.includes('order-detail.html')) {
    renderOrderDetail();
}