const API_URL = "http://localhost:8080/api/payments";

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
            // Diqqət: row dəyişəninin sonundakı ` işarəsinə fikir ver
            const row = `
                <tr>
                    <td>${p.CompanyName}</td>
                    <td>${p.ServiceName}</td>
                    <td>${p.date}</td>
                    <td>${p.amount} AZN</td>
                    <td class="${p.status === 'Ödənilib' ? 'status-paid' : 'status-pending'}">${p.status}</td>
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