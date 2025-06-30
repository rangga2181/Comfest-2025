// main.js - Versi Multi-Page Application FINAL
const API_BASE_URL = 'http://127.0.0.1:3000/api';
let csrfToken = null;
let testimonialsData = [], currentTestimonialIndex = 0;

document.addEventListener('DOMContentLoaded', () => {
    // Fungsi ini berjalan pertama kali di setiap halaman
    setupNavbarAndAuth(); 

    // Cek elemen unik di setiap halaman untuk menjalankan fungsi spesifik
    if (document.getElementById('homepage-content')) {
        setupHomepage();
    }
    if (document.getElementById('subscription-content')) {
        setupSubscriptionPage();
    }
    if (document.getElementById('user-dashboard-content')) {
        setupUserDashboardPage();
    }
    if (document.getElementById('admin-content')) {
        setupAdminDashboardPage();
    }
});


// --- FUNGSI SETUP ---

async function setupNavbarAndAuth() {
    const navUI = document.getElementById('nav-dynamic-content');
    const authModal = document.getElementById('auth-modal');
    
    try {
        const csrfRes = await fetch(`${API_BASE_URL}/csrf-token`, { credentials: 'include' });
        const csrfData = await csrfRes.json();
        csrfToken = csrfData.csrfToken;

        const authRes = await fetch(`${API_BASE_URL}/auth/check`, { credentials: 'include' });
        const authData = await authRes.json();

        if (authData.status === 'success') {
            // Tampilan Navbar jika SUDAH LOGIN
            let navLinks = `</li><li><a href="subscription.html">Subscription</a></li>`;
            if (authData.user.role === 'admin') {
                navLinks += `<li><a href="admin.html">Admin</a></li>`;
            }
            navUI.innerHTML = `<ul class="nav-links"><li><span class="nav-text">Welcome, ${escapeHTML(authData.user.name)}!</span></li><li><a href="index.html">Home</a></li>${navLinks}<li><a href="#" id="logout-btn">Logout</a></li></ul>`;
            document.getElementById('logout-btn').addEventListener('click', handleLogout);
        } else {
            // Tampilan Navbar jika BELUM LOGIN
            navUI.innerHTML = `<ul class="nav-links"><li><a href="index.html">Home</a></li><li><a href="subscription.html">Subscription</a></li><li><a id="login-nav-btn">Login/Register</a></li></ul>`;
            const loginBtn = document.getElementById('login-nav-btn');
            if (loginBtn && authModal) {
                loginBtn.addEventListener('click', () => authModal.showModal());
            }
        }
    } catch (err) {
        console.error("Gagal setup navbar:", err);
        navUI.innerHTML = `<ul class="nav-links"><li><a href="index.html">Home</a></li><li><a id="login-nav-btn">Login</a></li></ul>`;
        const loginBtn = document.getElementById('login-nav-btn');
        if (loginBtn && authModal) {
            loginBtn.addEventListener('click', () => authModal.showModal());
        }
    }
}

function setupHomepage() {
    fetchTestimonials();
    document.getElementById('prev-slide').addEventListener('click', () => changeTestimonialSlide(-1));
    document.getElementById('next-slide').addEventListener('click', () => changeTestimonialSlide(1));
    
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    
    const authModal = document.getElementById('auth-modal');
    authModal.addEventListener('click', (e) => { if (e.target === authModal) authModal.close(); });
    
    const loginLinkFromTestimonial = document.getElementById('login-from-testimonial');
    if(loginLinkFromTestimonial) {
        loginLinkFromTestimonial.addEventListener('click', (e) => { e.preventDefault(); authModal.showModal(); });
    }

    // Cek jika user login untuk menampilkan form testimoni
    fetch(`${API_BASE_URL}/auth/check`, { credentials: 'include' })
        .then(res => res.json())
        .then(authData => {
            if (authData.status === 'success') {
                const formContainer = document.getElementById('testimonial-form-container');
                formContainer.innerHTML = `<h3>Bagikan Pengalaman Anda</h3><form id="testimonial-form"><div class="form-group"><label>Rating Anda</label><div class="rating-stars"><input type="radio" id="5-stars" name="rating" value="5" required><label for="5-stars">★</label><input type="radio" id="4-stars" name="rating" value="4"><label for="4-stars">★</label><input type="radio" id="3-stars" name="rating" value="3"><label for="3-stars">★</label><input type="radio" id="2-stars" name="rating" value="2"><label for="2-stars">★</label><input type="radio" id="1-star" name="rating" value="1"><label for="1-star">★</label></div></div><div class="form-group"><label for="review-message">Ulasan Anda</label><textarea id="review-message" name="review_message" rows="4" required placeholder="Ceritakan pengalaman Anda..."></textarea></div><button type="submit" class="btn">Kirim Testimoni</button><div id="testimonial-status" class="status-message"></div></form>`;
                document.getElementById('testimonial-form').addEventListener('submit', handleTestimonialSubmit);
            }
        });
}

async function setupSubscriptionPage() {
    const authGate = document.getElementById('auth-gate');
    const subContent = document.getElementById('subscription-content');
    
    const authRes = await fetch(`${API_BASE_URL}/auth/check`, { credentials: 'include' });
    const authData = await authRes.json();
    
    if (authData.status === 'success') {
        document.getElementById('sub-name').value = authData.user.name;
        subContent.style.display = 'block';
        const subscriptionForm = document.getElementById('subscription-form');
        subscriptionForm.addEventListener('change', calculatePrice);
        subscriptionForm.addEventListener('submit', handleSubscription);
    } else {
        authGate.style.display = 'block';
        subContent.style.display = 'none';
    }
}

async function setupUserDashboardPage() {
    const container = document.getElementById('subscription-list-container');
    const authGate = document.getElementById('auth-gate');
    const content = document.getElementById('user-dashboard-content');
    
    const authRes = await fetch(`${API_BASE_URL}/auth/check`, { credentials: 'include' });
    const authData = await authRes.json();

    if (authData.status !== 'success') {
        if(authGate) authGate.style.display = 'block';
        if(content) content.style.display = 'none';
        return;
    }

    if(content) content.style.display = 'block';

    try {
        const response = await fetch(`${API_BASE_URL}/user/subscriptions`, { credentials: 'include' });
        const result = await response.json();

        if (result.status === 'success' && result.data.length > 0) {
            container.innerHTML = '';
            result.data.forEach(sub => container.innerHTML += createSubscriptionCard(sub));
            attachActionListeners();
        } else {
            container.innerHTML = '<p>Anda belum memiliki langganan aktif.</p>';
        }
    } catch (err) {
        container.innerHTML = '<p>Gagal memuat data. Silakan coba lagi.</p>';
    }

    const pauseForm = document.getElementById('pause-form');
    if(pauseForm) pauseForm.addEventListener('submit', handlePause);
}

async function setupAdminDashboardPage() {
    const authGate = document.getElementById('auth-gate');
    const adminContent = document.getElementById('admin-content');
    
    const authRes = await fetch(`${API_BASE_URL}/auth/check`, { credentials: 'include' });
    const authData = await authRes.json();

    if(authData.status !== 'success' || authData.user.role !== 'admin') {
        if(authGate) authGate.style.display = 'block';
        return;
    }
    
    if(adminContent) adminContent.style.display = 'block';
    
    const filterBtn = document.getElementById('filter-btn');
    if(filterBtn) filterBtn.addEventListener('click', fetchAdminMetrics);
}

// --- FUNGSI-FUNGSI HELPER DAN EVENT HANDLER ---

function createSubscriptionCard(sub) {
    const details = `<div class="detail-item"><span>Paket:</span> ${escapeHTML(sub.plan_name)}</div><div class="detail-item"><span>Harga:</span> ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(sub.total_price)}/bulan</div><div class="detail-item"><span>Jadwal:</span> ${escapeHTML(sub.delivery_days)}</div><div class="detail-item"><span>Makanan:</span> ${escapeHTML(sub.meal_types)}</div>`;
    let actions = '';
    if (sub.status === 'active') {
        actions = `<button class="btn-pause btn" style="width:auto; background-color: #ffa726;">Jeda</button><button class="btn-cancel btn" style="width:auto; background-color: #ef5350;">Batalkan</button>`;
    } else if (sub.status === 'paused') {
        actions = `<button class="btn-reactivate btn" style="width:auto;">Aktifkan Kembali</button>`;
    } else {
        const cancelDate = sub.cancellation_date ? new Date(sub.cancellation_date).toLocaleDateString('id-ID') : '';
        actions = `<i>Dibatalkan pada ${cancelDate}</i>`;
    }
    return `<div class="subscription-item"><h3>Langganan #${sub.id} <span class="status-tag ${sub.status}">${sub.status}</span></h3><div class="subscription-details">${details}</div><div class="actions">${actions}</div></div>`;
}

function attachActionListeners() {
    document.querySelectorAll('.btn-pause').forEach(btn => btn.addEventListener('click', (e) => openPauseModal(e.target.dataset.id)));
    document.querySelectorAll('.btn-cancel').forEach(btn => btn.addEventListener('click', (e) => handleCancel(e.target.dataset.id)));
    document.querySelectorAll('.btn-reactivate').forEach(btn => btn.addEventListener('click', (e) => handleReactivate(e.target.dataset.id)));
}

function openPauseModal(id) { 
    const modal = document.getElementById('pause-modal');
    if (modal) {
        document.getElementById('pause-sub-id').value = id;
        modal.showModal();
    }
}
async function handlePause(e) { e.preventDefault(); const form = e.target; const id = form.querySelector('#pause-sub-id').value; const data = { startDate: form.querySelector('#pause-start-date').value, endDate: form.querySelector('#pause-end-date').value }; await fetch(`${API_BASE_URL}/subscriptions/${id}/pause`, { method: 'POST', body: JSON.stringify(data), headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken }, credentials: 'include' }); location.reload(); }
async function handleCancel(id) { if (confirm('Apakah Anda yakin ingin membatalkan langganan ini secara permanen?')) { await fetch(`${API_BASE_URL}/subscriptions/${id}/cancel`, { method: 'POST', headers: { 'csrf-token': csrfToken }, credentials: 'include' }); location.reload(); } }
async function handleReactivate(id) { if (confirm('Aktifkan kembali langganan ini?')) { await fetch(`${API_BASE_URL}/subscriptions/${id}/reactivate`, { method: 'POST', headers: { 'csrf-token': csrfToken }, credentials: 'include' }); location.reload(); } }

async function fetchAdminMetrics() {
    const startDate = document.getElementById('start-date').value;
    const endDate = document.getElementById('end-date').value;
    if (!startDate || !endDate) { alert('Silakan pilih rentang tanggal terlebih dahulu.'); return; }
    const response = await fetch(`${API_BASE_URL}/admin/metrics?startDate=${startDate}&endDate=${endDate}`, { credentials: 'include' });
    const result = await response.json();
    if(result.status === 'success') {
        const data = result.data;
        document.getElementById('new-subs-value').textContent = data.newSubscriptions;
        document.getElementById('mrr-value').textContent = new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR' }).format(data.monthlyRecurringRevenue);
        document.getElementById('reactivations-value').textContent = data.reactivations;
        document.getElementById('active-subs-value').textContent = data.subscriptionGrowth;
    } else { alert('Gagal memuat metrik: ' + result.message); }
}

function toggleAuthView(showLogin) { document.getElementById('login-view').style.display = showLogin ? 'block' : 'none'; document.getElementById('register-view').style.display = showLogin ? 'none' : 'block'; }
function escapeHTML(str) { const p = document.createElement('p'); p.textContent = str; return p.innerHTML; }
function showStatusMessage(element, status, message) { element.className = `status-message ${status}`; element.textContent = message; element.style.display = 'block'; setTimeout(() => { element.style.display = 'none'; }, 4000); }
async function handleLogin(e) { e.preventDefault(); const form = e.target; const statusDiv = document.getElementById('login-status'); const data = Object.fromEntries(new FormData(form).entries()); try { const response = await fetch(`${API_BASE_URL}/auth/login`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken }, body: JSON.stringify(data) }); const result = await response.json(); if(result.status === 'success') location.reload(); else showStatusMessage(statusDiv, 'error', result.message); } catch(err) { showStatusMessage(statusDiv, 'error', 'Tidak bisa terhubung ke server.'); } }
async function handleRegister(e) { e.preventDefault(); const form = e.target; const statusDiv = document.getElementById('register-status'); const data = Object.fromEntries(new FormData(form).entries()); const response = await fetch(`${API_BASE_URL}/auth/register`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken }, body: JSON.stringify(data) }); const result = await response.json(); if(result.status === 'success') { showStatusMessage(statusDiv, 'success', result.message); setTimeout(() => toggleAuthView(true), 2000); } else { showStatusMessage(statusDiv, 'error', result.message); } }
async function handleLogout(e) { e.preventDefault(); await fetch(`${API_BASE_URL}/auth/logout`, { method: 'POST', credentials: 'include', headers: { 'csrf-token': csrfToken } }); window.location.href = "index.html"; }
async function handleSubscription(e) { e.preventDefault(); const form = e.target; const statusDiv = document.getElementById('subscription-status'); const formData = new FormData(form); const data = Object.fromEntries(formData.entries()); data.meal_type = formData.getAll('meal_type'); data.delivery_days = formData.getAll('delivery_days'); const response = await fetch(`${API_BASE_URL}/subscribe`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken }, body: JSON.stringify(data) }); const result = await response.json(); showStatusMessage(statusDiv, result.status, result.message); if(result.status === 'success') { form.reset(); calculatePrice(); } }
function calculatePrice() { const form = document.getElementById('subscription-form'); const priceDisplay = document.getElementById('total-price-display'); if(!form || !priceDisplay) return; const planInput = form.querySelector('input[name="plan"]:checked'); const mealTypes = form.querySelectorAll('input[name="meal_type"]:checked').length; const deliveryDays = form.querySelectorAll('input[name="delivery_days"]:checked').length; if (!planInput || mealTypes === 0 || deliveryDays === 0) { priceDisplay.textContent = 'Rp 0'; return; } const planPrice = parseFloat(planInput.dataset.price); const totalPrice = planPrice * mealTypes * deliveryDays * 4.3; priceDisplay.textContent = 'Rp ' + totalPrice.toLocaleString('id-ID'); }
async function fetchTestimonials() { try { const response = await fetch(`${API_BASE_URL}/testimonials`, { credentials: 'include' }); const result = await response.json(); if (result.status === 'success') { testimonialsData = result.data; populateTestimonials(testimonialsData); } } catch (err) { console.error("Gagal memuat testimoni:", err); } }
function populateTestimonials(testimonials) { const slider = document.getElementById('testimonial-slider'); if(!slider) return; const nav = slider.querySelector('.slider-nav'); slider.innerHTML = ''; slider.appendChild(nav); if (testimonials.length === 0) { slider.insertAdjacentHTML('afterbegin', `<div class="testimonial-slide active"><p>Belum ada testimoni.</p></div>`); } else { testimonials.forEach(t => { const stars = '★'.repeat(t.rating) + '☆'.repeat(5 - t.rating); const slideHTML = `<div class="testimonial-slide"><blockquote>“${escapeHTML(t.review_message)}”</blockquote><div class="stars">${stars}</div><p class="author">- ${escapeHTML(t.customer_name)}</p></div>`; slider.insertAdjacentHTML('afterbegin', slideHTML); }); } showTestimonialSlide(0); }
function showTestimonialSlide(index) { const slides = document.querySelectorAll('.testimonial-slide'); if (!slides || slides.length === 0) return; currentTestimonialIndex = (index + slides.length) % slides.length; slides.forEach((slide, i) => slide.classList.toggle('active', i === currentTestimonialIndex)); }
function changeTestimonialSlide(direction) { showTestimonialSlide(currentTestimonialIndex + direction); }
async function handleTestimonialSubmit(e) {
    e.preventDefault();
    const form = e.target;
    const statusDiv = document.getElementById('testimonial-status');
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    const response = await fetch(`${API_BASE_URL}/testimonials`, { method: 'POST', credentials: 'include', headers: { 'Content-Type': 'application/json', 'csrf-token': csrfToken }, body: JSON.stringify(data) });
    const result = await response.json();
    showStatusMessage(statusDiv, result.status, result.message);
    if(result.status === 'success') {
        testimonialsData.unshift(result.data);
        populateTestimonials(testimonialsData);
        form.reset();
    }
}