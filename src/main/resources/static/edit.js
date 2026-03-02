// Konstantlar
const API_BASE_URL = "http://localhost:8080/api/payments";
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');

// DOM Elementləri
const editForm = document.getElementById('editForm');
const backBtn = document.getElementById('backBtn');

function normalizeStatus(rawStatus) {
    if (!rawStatus) return '';

    const normalized = rawStatus
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (normalized === 'odenilib' || normalized === 'paid') {
        return 'Ödənilib';
    }

    if (normalized === 'gozleyir' || normalized === 'pending') {
        return 'Gözləyir';
    }

    return rawStatus;
}

// Convert any date format to YYYY-MM-DD for <input type="date">
function toInputDate(rawDate) {
    if (!rawDate || rawDate === 'null') return '';
    const s = rawDate.toString().trim();
    // Already YYYY-MM-DD
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    // Convert DD.MM.YYYY → YYYY-MM-DD
    const parts = s.split('.');
    if (parts.length === 3) return `${parts[2]}-${parts[1]}-${parts[0]}`;
    return s;
}

// 1. Səhifə yüklənəndə mövcud datanı gətir
document.addEventListener('DOMContentLoaded', async () => {
    if (!currentId) {
        alert("ID tapılmadı!");
        return;
    }
    await fetchPaymentData(currentId);
});

async function fetchPaymentData(id) {
    try {
        const response = await fetch(`${API_BASE_URL}/${id}`);
        if (!response.ok) throw new Error("Məlumat tapılmadı");

        const data = await response.json();

        // Formu doldur
        document.getElementById('paymentId').value = data.id;
        document.getElementById('companyName').value = data.companyName || data.CompanyName;
        document.getElementById('serviceName').value = data.serviceName || data.ServiceName;
        document.getElementById('amount').value = data.amount;
        document.getElementById('date').value = toInputDate(data.date);
        document.getElementById('status').value = normalizeStatus(data.status);

    } catch (error) {
        console.error("Xəta:", error);
        alert("Serverdən məlumat çəkilərkən xəta baş verdi.");
    }
}

// 2. Formu göndərmə (Update)
editForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const updatedData = {
        CompanyName: document.getElementById('companyName').value,
        ServiceName: document.getElementById('serviceName').value,
        amount: parseFloat(document.getElementById('amount').value),
        date: document.getElementById('date').value,
        status: normalizeStatus(document.getElementById('status').value)
    };

    try {
        const response = await fetch(`${API_BASE_URL}/${currentId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedData)
        });

        if (response.ok) {
            alert("Məlumat uğurla yeniləndi!");
            window.location.href = "index.html"; // Əsas səhifəyə qayıt
        } else {
            throw new Error("Yenilənmə alınmadı");
        }
    } catch (error) {
        alert("Xəta: " + error.message);
    }
});

// Geri qayıt düyməsi
backBtn.addEventListener('click', () => {
    window.location.href = "index.html";
});