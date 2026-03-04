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

    const searchInput = document.getElementById("searchInput");
    if (searchInput) {
        searchInput.addEventListener("input", () => {
            const query = searchInput.value.trim().toLowerCase();
            const rows = document.querySelectorAll("#payment-table-body tr");
            rows.forEach(row => {
                const company = row.cells[0]?.textContent.toLowerCase() || "";
                row.style.display = company.includes(query) ? "" : "none";
            });
        });
    }

    const addBtn = document.querySelector(".btn-add");
    if (addBtn) {
        addBtn.addEventListener("click", () => openAddModal());
    }
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
            const row = `
                <tr>
                    <td>${p.companyName}</td>
                    <td>${p.serviceName}</td>
                    <td>${displayDate}</td>
                    <td>${p.amount} AZN</td>
                    <td class="${displayStatus === 'Ödənilib' ? 'status-paid' : 'status-pending'}">${displayStatus}</td>
                    <td>
                        <button class="btn btn-edit" onclick="editPayment(${p.id})">Düzəliş</button>
                        <button class="btn btn-delete" onclick="deletePayment(${p.id})">Sil</button>
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

async function deletePayment(id) {
    if (!confirm("Bu ödənişi silmək istədiyinizdən əminsiniz?")) return;
    try {
        const response = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
        if (response.ok) {
            loadPayments();
        } else {
            alert("Silinmə zamanı xəta baş verdi.");
        }
    } catch (error) {
        console.error("Silinmə xətası:", error);
        alert("Serverlə əlaqə qurulası olmadı.");
    }
}

function openAddModal() {
    document.getElementById('addModal').style.display = 'flex';
}

function closeAddModal() {
    document.getElementById('addModal').style.display = 'none';
    document.getElementById('addForm').reset();
}

document.addEventListener('DOMContentLoaded', () => {
    const addForm = document.getElementById('addForm');
    if (addForm) {
        addForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const newPayment = {
                companyName: document.getElementById('newCompanyName').value,
                serviceName: document.getElementById('newServiceName').value,
                amount: parseFloat(document.getElementById('newAmount').value),
                date: document.getElementById('newDate').value,
                status: document.getElementById('newStatus').value
            };
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(newPayment)
                });
                if (response.ok) {
                    closeAddModal();
                    loadPayments();
                } else {
                    alert('Ödəniş əlavə edilərkən xəta baş verdi.');
                }
            } catch (error) {
                alert('Serverlə əlaqə qurulmadı: ' + error.message);
            }
        });
    }
});