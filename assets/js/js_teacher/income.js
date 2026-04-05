// Tabs
const tabOverview = document.getElementById('tab-overview');
const tabHistory = document.getElementById('tab-history');
const contentOverview = document.getElementById('overview-content');
const contentHistory = document.getElementById('history-content');

tabOverview.addEventListener('click', () => {
    tabOverview.classList.add('active');
    tabHistory.classList.remove('active');
    contentOverview.style.display = 'block';
    contentHistory.style.display = 'none';
});

tabHistory.addEventListener('click', () => {
    tabHistory.classList.add('active');
    tabOverview.classList.remove('active');
    contentHistory.style.display = 'block';
    contentOverview.style.display = 'none';
});

// Accordion View details
const detailToggles = document.querySelectorAll('.view-detail-toggle');
detailToggles.forEach(toggle => {
    toggle.addEventListener('click', (e) => {
        const row = e.target.closest('.history-row');
        const details = row.querySelector('.history-row-details');
        if (details) {
            details.classList.toggle('active');
        }
    });
});

// Appeal Modal
const appealModal = document.getElementById('appeal-modal');
const openAppealBtns = document.querySelectorAll('.open-appeal-btn');
const closeAppealBtns = document.querySelectorAll('.close-modal-btn');

openAppealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        appealModal.style.display = 'flex';
    });
});

closeAppealBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        appealModal.style.display = 'none';
    });
});

appealModal.addEventListener('click', (e) => {
    if (e.target === appealModal) {
        appealModal.style.display = 'none';
    }
});