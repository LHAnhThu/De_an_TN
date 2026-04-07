document.addEventListener('DOMContentLoaded', function () {
    const evalCard = document.getElementById('evaluations-card');
    const evalModal = document.getElementById('evaluation-modal');
    const bookingPanel = document.getElementById('booking-detail-panel');
    const setupModal = document.getElementById('setup-modal');
    const detailLinks = document.querySelectorAll('.detail-link');
    const setupButton = document.querySelector('.booking-button');
    const closeButtons = document.querySelectorAll('.btn-close');

    const openOverlay = function (el) {
        if (el) {
            el.classList.add('active');
            el.style.display = 'flex';
        }
    };
    const closeOverlay = function (el) {
        if (el) {
            el.classList.remove('active');
            el.style.display = 'none';
        }
    };

    if (evalCard) {
        evalCard.addEventListener('click', function () {
            openOverlay(evalModal);
        });
    }

    detailLinks.forEach(function (link) {
        link.addEventListener('click', function (event) {
            event.preventDefault();
            openOverlay(bookingPanel);
        });
    });

    if (setupButton) {
        setupButton.addEventListener('click', function () {
            openOverlay(setupModal);
        });
    }

    closeButtons.forEach(function (btn) {
        btn.addEventListener('click', function (event) {
            const overlay = event.target.closest('.modal-overlay');
            closeOverlay(overlay);
        });
    });

    [evalModal, bookingPanel, setupModal].forEach(function (modal) {
        if (!modal) return;
        modal.addEventListener('click', function (event) {
            if (event.target === modal) {
                closeOverlay(modal);
            }
        });
    });

    const scheduleCells = document.querySelectorAll('.schedule-cell');
    scheduleCells.forEach(function (cell) {
        cell.addEventListener('click', function () {
            // Check if already selected or has other element inside (we only allow selecting empty cells)
            if (this.querySelector('.selected-check')) {
                this.innerHTML = '';
            } else {
                this.innerHTML = '<span class="selected-check"><i class="fa-solid fa-check"></i></span>';
            }
        });
    });

    // Toast Logic
    const toastAccepted = document.getElementById('toast-accepted');
    const toastTaken = document.getElementById('toast-taken');

    function showToast(toastEl) {
        if (!toastEl) return;
        toastEl.style.display = 'flex';
        // Auto hide after 3.5 seconds
        setTimeout(() => {
            toastEl.style.display = 'none';
        }, 3500);
    }

    function closeParentContainers(btn) {
        // Close modal if inside one
        const overlay = btn.closest('.modal-overlay');
        if (overlay) closeOverlay(overlay);

        // Hide sidebar if inside New Booking Sidebar
        const sidebar = btn.closest('#new-booking-sidebar');
        if (sidebar) {
            // Change it to empty state for next view
            const card = document.getElementById('new-booking-card');
            const empty = document.getElementById('new-booking-empty');
            const badge = sidebar.querySelector('.booking-count');

            if (card) card.style.display = 'none';
            if (empty) empty.style.display = 'block';
            if (badge) badge.textContent = '0';
        }
    }

    // Accept Buttons
    const acceptBtns = document.querySelectorAll('.btn-sidebar-accept, .btn-panel-accept');
    acceptBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            showToast(toastAccepted);

            const panel = this.closest('#booking-detail-panel');
            
            if (panel) {
                // If clicked inside the detail panel: switch modal state to "Approved" instead of closing
                const waitingRow = document.getElementById('booking-status-waiting');
                const approvedRow = document.getElementById('booking-status-approved');
                const waitingActions = document.getElementById('booking-actions-waiting');
                const acceptedActions = document.getElementById('booking-actions-accepted');

                if (waitingRow) waitingRow.style.display = 'none';
                if (approvedRow) approvedRow.style.display = 'flex';
                if (waitingActions) waitingActions.style.display = 'none';
                if (acceptedActions) acceptedActions.style.display = 'flex';
                
                // Keep modal open, but still update the sidebar to empty state in the background
                const sidebar = document.getElementById('new-booking-sidebar');
                if (sidebar) {
                    const card = document.getElementById('new-booking-card');
                    const empty = document.getElementById('new-booking-empty');
                    const badge = sidebar.querySelector('.booking-count');

                    if (card) card.style.display = 'none';
                    if (empty) empty.style.display = 'block';
                    if (badge) badge.textContent = '0';
                }
            } else {
                // If clicked from sidebar (or somewhere else), close standard containers
                closeParentContainers(this);
            }
        });
    });

    // Deny Buttons
    const denyBtns = document.querySelectorAll('.btn-sidebar-deny, .btn-panel-deny');
    denyBtns.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            showToast(toastTaken);
            closeParentContainers(this);
            
            // Unconditionally update sidebar to empty state since booking is taken
            const sidebar = document.getElementById('new-booking-sidebar');
            if (sidebar) {
                const card = document.getElementById('new-booking-card');
                const empty = document.getElementById('new-booking-empty');
                const badge = sidebar.querySelector('.booking-count');

                if (card) card.style.display = 'none';
                if (empty) empty.style.display = 'block';
                if (badge) badge.textContent = '0';
            }
        });
    });

    // Cancel Class Flow
    const btnCancelClass = document.getElementById('btn-panel-cancel-class');
    const modalCancelClass = document.getElementById('cancel-class-modal');
    if (btnCancelClass && modalCancelClass) {
        btnCancelClass.addEventListener('click', function(e) {
            e.preventDefault();
            openOverlay(modalCancelClass);
        });
    }

    const btnCancelConfirm = document.getElementById('btn-cancel-confirm');
    if (btnCancelConfirm) {
        btnCancelConfirm.addEventListener('click', function(e) {
            e.preventDefault();
            closeOverlay(modalCancelClass);
            
            // Update booking detail to cancelled state
            const approvedRow = document.getElementById('booking-status-approved');
            const cancelledRow = document.getElementById('booking-status-cancelled');
            const acceptedActions = document.getElementById('booking-actions-accepted');

            if (approvedRow) approvedRow.style.display = 'none';
            if (cancelledRow) cancelledRow.style.display = 'flex';
            if (acceptedActions) acceptedActions.style.display = 'none';
        });
    }
});