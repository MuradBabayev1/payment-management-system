// Konstantlar
const API_BASE_URL = "http://localhost:8080/api/payments";
const urlParams = new URLSearchParams(window.location.search);
const currentId = urlParams.get('id');

// DOM Elementləri
const editForm = document.getElementById('editForm');
const backBtn = document.getElementById('backBtn');

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
        amount: parseFloat(document.getElementById('amount').value)
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