document.addEventListener('DOMContentLoaded', () => {
    loadTableData();

    const form = document.getElementById('oilForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const oilData = {
            id: Date.now(),
            date: document.getElementById('oilDate').value,
            mileage: document.getElementById('currentMileage').value,
            brand: document.getElementById('oilBrand').value,
            nextMileage: document.getElementById('nextMileage').value,
            note: document.getElementById('note').value
        };

        saveData(oilData);
        form.reset();
        loadTableData();
    });
});

function saveData(data) {
    let records = JSON.parse(localStorage.getItem('oilRecords')) || [];
    records.push(data);
    localStorage.setItem('oilRecords', JSON.stringify(records));
}

function loadTableData() {
    const tableBody = document.getElementById('oilTableBody');
    tableBody.innerHTML = '';

    let records = JSON.parse(localStorage.getItem('oilRecords')) || [];

    // เรียงจากใหม่ไปเก่า
    records.sort((a, b) => b.id - a.id);

    records.forEach(record => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${record.date}</td>
            <td>${Number(record.mileage).toLocaleString()} กม.</td>
            <td>${record.brand}</td>
            <td>${Number(record.nextMileage).toLocaleString()} กม.</td>
            <td>${record.note || '-'}</td>
            <td><button class="btn-delete" onclick="deleteRecord(${record.id})">ลบ</button></td>
        `;
        tableBody.appendChild(row);
    });
}

function deleteRecord(id) {
    let records = JSON.parse(localStorage.getItem('oilRecords')) || [];
    records = records.filter(record => record.id !== id);
    localStorage.setItem('oilRecords', JSON.stringify(records));
    loadTableData();
}