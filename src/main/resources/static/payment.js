const API_URL = "http://localhost:8080/api/payments";

function normalizeStatus(rawStatus) {
    if (!rawStatus) return "Gözləyir";

    const normalized = rawStatus
        .toString()
        .trim()
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");

    if (normalized === "odenilib" || normalized === "paid") {
        return "Ödənilib";
    }

    if (normalized === "gozleyir" || normalized === "pending") {
        return "Gözləyir";
    }

    return rawStatus;
}

function normalizeDate(rawDate) {
    if (!rawDate || rawDate === 'null') return '-';
    const s = rawDate.toString().trim();
    // Convert YYYY-MM-DD → DD.MM.YYYY for display
    if (/^\d{4}-\d{2}-\d{2}$/.test(s)) {
        const [y, m, d] = s.split('-');
        return `${d}.${m}.${y}`;
    }
    return s; // Already DD.MM.YYYY or other format
}

document.addEventListener("DOMContentLoaded", () => {
    console.log("Səhifə yükləndi, API-yə müraciət edilir...");
    loadPayments();
});

async function loadPayments() {
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error("Serverdən cavab alınmadı: " + response.status);
        }

        const payments = await response.json();
        console.log("Gələn məlumatlar:", payments); // Konsolda yoxla

        const tableBody = document.getElementById("payment-table-body");
        tableBody.innerHTML = "";

        if (payments.length === 0) {
            tableBody.innerHTML = "<tr><td colspan='6' style='text-align:center'>Heç bir məlumat tapılmadı.</td></tr>";
            return;
        }

        payments.forEach(p => {
            const displayStatus = normalizeStatus(p.status);
            const displayDate = normalizeDate(p.date);
            // Diqqət: row dəyişəninin sonundakı ` işarəsinə fikir ver
            const row = `
                <tr>
                    <td>${p.CompanyName}</td>
                    <td>${p.ServiceName}</td>
                    <td>${displayDate}</td>
                    <td>${p.amount} AZN</td>
                    <td class="${displayStatus === 'Ödənilib' ? 'status-paid' : 'status-pending'}">${displayStatus}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editPayment(${p.id})">Düzəliş</button>
                    </td>
                </tr>`;

            tableBody.innerHTML += row;
        });

    } catch (error) {
        console.error("XƏTA BAŞ VERDİ:", error);
        alert("Məlumatları yükləmək mümkün olmadı. Konsola (F12) baxın.");
    }
}

function editPayment(id) {
    window.location.href = `edit-payment.html?id=${id}`;
}