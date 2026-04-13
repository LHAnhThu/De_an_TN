document.addEventListener('DOMContentLoaded', () => {
    const gridView = document.getElementById('classes-grid-view');
    const emptyView = document.getElementById('empty-state-view');
    const dateDisplay = document.getElementById('current-date-display');
    const dayBoxes = document.querySelectorAll('.week-day-box');

    function showClassesView(dayName, dayNum) {
        gridView.style.display = 'grid';
        emptyView.style.display = 'none';
        // Adjust year dynamically based on requirements, assuming 2026 for now
        let fullDayName = 'Thursday';
        if (dayName === 'T') { fullDayName = (dayNum == '10' || dayNum == '17') ? 'Tuesday' : 'Thursday'; }
        else if (dayName === 'W') fullDayName = 'Wednesday';
        else if (dayName === 'F') fullDayName = 'Friday';
        else if (dayName === 'S') fullDayName = (dayNum == '14' || dayNum == '21') ? 'Saturday' : 'Sunday';
        else if (dayName === 'M') fullDayName = 'Monday';

        dateDisplay.textContent = `${fullDayName}, ${dayNum}/03/2026`;
    }

    function showEmptyView(dayName, dayNum) {
        gridView.style.display = 'none';
        emptyView.style.display = 'flex';
        let fullDayName = 'Saturday';
        if (dayName === 'S' && (dayNum == '14' || dayNum == '21')) fullDayName = 'Saturday';
        else if (dayName === 'S' && dayNum == '15') fullDayName = 'Sunday';
        dateDisplay.textContent = `${fullDayName}, ${dayNum}/03/2026`;
    }

    dayBoxes.forEach(box => {
        box.addEventListener('click', () => {
            // Update active styling
            dayBoxes.forEach(b => b.classList.remove('active'));
            box.classList.add('active');

            // Check if it has classes (has class-indicator span)
            const hasClasses = box.querySelector('.class-indicator');
            const dayNum = box.dataset.day;
            const dayName = box.querySelector('.week-day-name').textContent.charAt(0);

            if (hasClasses) {
                showClassesView(dayName, dayNum);
            } else {
                showEmptyView(dayName, dayNum);
            }
        });
    });

    // Filter logic
    const filterBtn = document.getElementById('filter-select-btn');
    const filterDropdown = document.getElementById('filter-dropdown');
    const filterText = document.getElementById('filter-selected-text');
    const dropdownItems = document.querySelectorAll('.dropdown-item');
    const classCards = document.querySelectorAll('.booking-detail-card');

    filterBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        filterDropdown.style.display = filterDropdown.style.display === 'none' ? 'block' : 'none';
    });

    document.addEventListener('click', (e) => {
        if (!filterBtn.contains(e.target) && !filterDropdown.contains(e.target)) {
            filterDropdown.style.display = 'none';
        }
    });

    dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
            const value = item.dataset.value;
            filterText.textContent = value;
            filterDropdown.style.display = 'none';

            classCards.forEach(card => {
                if (value === 'All') {
                    card.style.display = '';
                } else {
                    if (card.dataset.status === value) {
                        card.style.display = '';
                    } else {
                        card.style.display = 'none';
                    }
                }
            });
        });
    });

    // "View detail" logic
    const detailLinks = document.querySelectorAll('.detail-link');
    const bookingPanel = document.getElementById('booking-detail-panel');
    const closeButtons = document.querySelectorAll('.btn-close');

    detailLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const card = link.closest('.booking-detail-card');
            if (!card) return;

            const status = card.dataset.status;
            const approvedRow = document.getElementById('booking-status-approved');
            const cancelledRow = document.getElementById('booking-status-cancelled');
            const acceptedActions = document.getElementById('booking-actions-accepted');

            if (status === 'Cancelled') {
                if (approvedRow) approvedRow.style.display = 'none';
                if (cancelledRow) cancelledRow.style.display = 'flex';
                if (acceptedActions) acceptedActions.style.display = 'none';
            } else if (status === 'Approved') {
                if (approvedRow) approvedRow.style.display = 'flex';
                if (cancelledRow) cancelledRow.style.display = 'none';
                if (acceptedActions) acceptedActions.style.display = 'flex';
            }

            bookingPanel.style.display = 'flex';
            bookingPanel.classList.add('active');
        });
    });

    closeButtons.forEach(btn => {
        btn.addEventListener('click', e => {
            const overlay = e.target.closest('.modal-overlay');
            if (overlay) {
                overlay.style.display = 'none';
                overlay.classList.remove('active');
            }
        });
    });

    if (bookingPanel) {
        bookingPanel.addEventListener('click', function (event) {
            if (event.target === bookingPanel) {
                bookingPanel.style.display = 'none';
                bookingPanel.classList.remove('active');
            }
        });
    }
});