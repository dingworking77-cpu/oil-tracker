// URL ของ Google Apps Script ที่เชื่อมต่อกับ Google Sheet ของคุณ
const WEB_APP_URL = 'https://script.google.com/macros/s/AKfycbwIyj2ZQuVWIdNYJCWpZJ1SJ83y_udLOZAm4rcpT2GuHOblNzkQly0Yn_YqPOa5sZ_ZQw/exec';

document.addEventListener('DOMContentLoaded', () => {
    const today = new Date().toISOString().split('T')[0];
    document.getElementById('oilDate').value = today;

    loadRecordsFromSheet();

    // ระบบสลับธีม มืด/สว่าง
    const themeToggle = document.getElementById('themeToggle');
    const savedTheme = localStorage.getItem('theme');

    if (savedTheme === 'dark') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> โหมดสว่าง';
    }

    themeToggle.addEventListener('click', () => {
        document.body.classList.toggle('dark-mode');
        if (document.body.classList.contains('dark-mode')) {
            localStorage.setItem('theme', 'dark');
            themeToggle.innerHTML = '<i class="fa-solid fa-sun"></i> โหมดสว่าง';
        } else {
            localStorage.setItem('theme', 'light');
            themeToggle.innerHTML = '<i class="fa-solid fa-moon"></i> โหมดมืด';
        }
    });

    // บันทึกข้อมูลส่งไป Google Sheet
    const form = document.getElementById('oilForm');
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        const record = {
            date: document.getElementById('oilDate').value,
            mileage: Number(document.getElementById('currentMileage').value),
            interval: Number(document.getElementById('distanceInterval').value),
            brand: document.getElementById('oilBrand').value
        };

        const submitBtn = document.getElementById('submitBtn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> กำลังบันทึก...';

        fetch(WEB_APP_URL, {
            method: 'POST',
            body: JSON.stringify(record)
        })
        .then(response => response.json())
        .then(data => {
            form.reset();
            document.getElementById('oilDate').value = today;
            loadRecordsFromSheet();
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึก';
        })
        .catch(error => {
            console.error('Error:', error);
            alert('เกิดข้อผิดพลาดในการบันทึกข้อมูล');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<i class="fa-solid fa-floppy-disk"></i> บันทึก';
        });
    });
});

function loadRecordsFromSheet() {
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '<p style="text-align: center;">กำลังโหลดข้อมูล...</p>';

    fetch(WEB_APP_URL)
    .then(response => response.json())
    .then(records => {
        historyList.innerHTML = '';

        if (!records || records.length === 0) {
            historyList.innerHTML = '<p style="text-align: center; color: var(--border-color);">ยังไม่มีประวัติการบันทึก</p>';
            return;
        }

        // เรียงจากล่าสุดไปเก่าสุด
        records.reverse();

        records.forEach(record => {
            const nextMileage = Number(record.mileage) + Number(record.interval);

            const item = document.createElement('div');
            item.className = 'history-item';
            item.innerHTML = `
                <div class="history-date"><i class="fa-solid fa-calendar-days"></i> ${record.date}</div>
                <div class="history-details">
                    <div><i class="fa-solid fa-gauge"></i> ไมล์ตอนเปลี่ยน: <b>${Number(record.mileage).toLocaleString()} กม.</b></div>
                    <div><i class="fa-solid fa-route"></i> ระยะทาง: <b>${Number(record.interval).toLocaleString()} กม.</b></div>
                    <div><i class="fa-solid fa-bottle-droplet"></i> ยี่ห้อ: <b>${record.brand}</b></div>
                </div>
                <div class="next-mileage-box">
                    <i class="fa-solid fa-bell"></i> ไมล์ครั้งถัดไป: ${nextMileage.toLocaleString()} กม.
                </div>
            `;
            historyList.appendChild(item);
        });
    })
    .catch(error => {
        console.error('Error:', error);
        historyList.innerHTML = '<p style="text-align: center; color: red;">ไม่สามารถโหลดข้อมูลได้</p>';
    });
}