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
            
            const isUpcoming = link.closest('.panel-upcoming') !== null;
            const waitingRow = document.getElementById('booking-status-waiting');
            const approvedRow = document.getElementById('booking-status-approved');
            const cancelledRow = document.getElementById('booking-status-cancelled');
            const waitingActions = document.getElementById('booking-actions-waiting');
            const acceptedActions = document.getElementById('booking-actions-accepted');

            if (isUpcoming) {
                if (waitingRow) waitingRow.style.display = 'none';
                if (approvedRow) approvedRow.style.display = 'flex';
                if (cancelledRow) cancelledRow.style.display = 'none';
                if (waitingActions) waitingActions.style.display = 'none';
                if (acceptedActions) acceptedActions.style.display = 'none';
            } else {
                if (waitingRow) waitingRow.style.display = 'flex';
                if (approvedRow) approvedRow.style.display = 'none';
                if (cancelledRow) cancelledRow.style.display = 'none';
                if (waitingActions) waitingActions.style.display = 'flex';
                if (acceptedActions) acceptedActions.style.display = 'none';
            }
            
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

    // Evaluation Star Rating Logic
    const evalDataMap = {
        'Behavior': {
            1: "Học viên thường xuyên mất tập trung, không chú ý nghe giảng và không tham gia vào các hoạt động học tập.",
            2: "Học viên đôi khi hay mất tập trung hoặc chưa chủ động tham gia vào các hoạt động học tập. Học viên cần tích cực tham gia hoạt động hơn.",
            3: "Học viên tham gia tương đối tốt vào các hoạt động học tập, nhưng đôi lúc vẫn còn mất tập trung.",
            4: "Học viên chú ý nghe giảng, tích cực tham gia các hoạt động của bài học",
            5: "Học viên luôn chú ý nghe giảng, hăng hái tham gia, chủ động trong các hoạt động học tập. Học viên có tinh thần học hỏi cao."
        },
        'Vocabulary': {
            1: "Học viên chưa nhớ từ vựng đã học ở các bài trước, cần ôn tập nhiều để củng cố kiến thức.",
            2: "Học viên nhớ được một ít từ vựng đã học. Học viên cần được hỗ trợ nhiều để sử dụng từ vựng mới học.",
            3: "Học viên nhớ được một số từ vựng đã học, nhưng đôi khi còn nhầm lẫn.",
            4: "Học viên nhớ được phần lớn từ vựng đã học. Đôi khi học viên còn lúng túng khi sử dụng từ mới.",
            5: "Học viên nhớ từ vựng của bài cũ, có thể áp dụng được từ vựng vừa học của bài mới."
        },
        'Grammar': {
            1: "Học viên cần sự hỗ trợ của giáo viên nhiều để sử dụng đúng ngữ pháp. Học viên cần ôn tập kỹ hơn các cấu trúc đã học.",
            2: "Học viên đã nhớ các cấu trúc ngữ pháp cơ bản được học, tuy nhiên còn mắc lỗi nhiều và cần giáo viên hỗ trợ ôn tập nhiều.",
            3: "Học viên nắm được một số cấu trúc ngữ pháp cơ bản, học viên cần ôn tập nhiều để không mắc lỗi với các điểm ngữ pháp này.",
            4: "Học viên nắm vững phần lớn các cấu trúc ngữ pháp đã học, đôi khi còn mắc một số lỗi nhỏ.",
            5: "Học viên nắm vững và vận dụng linh hoạt các cấu trúc ngữ pháp đã học. Học viên sử dụng ngữ pháp chính xác trong bài tập với ít sự hỗ trợ của giáo viên."
        },
        'Listening Skills': {
            1: "Học viên cần hỗ trợ nhiều từ giáo viên để hiểu yêu cầu của giáo viên hay bài tập, học viên cần củng cố nhiều ở kỹ năng nghe.",
            2: "Học viên nghe hiểu được một vài chi tiết trong bài nghe nhưng cần nhiều hỗ trợ từ giáo viên để nắm được ý chính.",
            3: "Học viên hiểu được một số yêu cầu và câu hỏi của giáo viên. Học viên cần hỗ trợ nhiều để hoàn thành được bài tập nghe hiểu.",
            4: "Học viên nghe hiểu được yêu cầu và câu hỏi của giáo viên. Học viên có thể hoàn thành bài tập nghe với một ít sự hỗ trợ từ giáo viên.",
            5: "Học viên nghe hiểu được yêu cầu và câu hỏi của giáo viên. Học viên hiểu toàn bộ nội dung bài nghe và hoàn thành bài tập nghe chính xác."
        },
        'Speaking Skills': {
            1: "Học viên cần hỗ trợ từ giáo viên để hoàn thành câu. Học viên cần ôn tập lại các cấu trúc được học và luyện tập nói nhiều hơn.",
            2: "Học viên nói còn ngập ngừng, cần giáo viên hỗ trợ để diễn đạt ý tốt hơn.",
            3: "Học viên có thể trả lời được câu hỏi bằng tiếng Anh, có một số lỗi nhưng không ảnh hưởng đến việc nghe hiểu.",
            4: "Học viên có thể nói tự tin và trôi chảy, đôi khi ngập ngừng khi diễn đạt ý phức tạp.",
            5: "Học viên nói lưu loát, phát âm chuẩn, ngữ điệu tự nhiên. Học viên có thể trả lời giáo viên với câu đầy đủ cấu trúc ngữ pháp."
        },
        'Reading Skills': {
            1: "Học viên cần sự hỗ trợ nhiều từ giáo viên để hoàn thành bài tập đọc hiểu, học viên cần ôn tập từ vựng và kỹ năng đọc nhiều.",
            2: "Học viên đọc hiểu chưa nhanh và chưa nắm bắt được ý chính, cần giáo viên hỗ trợ nhiều trong quá trình đọc hiểu.",
            3: "Học viên có thể hiểu được ý chính của bài đọc, học viên có thể hoàn thành bài tập đọc hiểu với nhiều sự hỗ trợ từ giáo viên.",
            4: "Học viên đọc hiểu bài đọc tốt, có thể hoàn thành bài tập đọc hiểu với một ít sự hỗ trợ từ giáo viên.",
            5: "Học viên đọc hiểu rõ nội dung bài đọc tốt. Học viên có thể hoàn thành bài tập đọc hiểu chính xác."
        },
        'Writing Skills': {
            1: "Học viên cần củng cố nhiều ở từ vựng, ngữ pháp và chính tả để có thể hoàn thành bài tập viết tốt hơn.",
            2: "Học viên cần sự hỗ trợ nhiều từ giáo viên để hoàn thành bài tập viết, học viên cần củng cố thêm về cách dùng từ và ngữ pháp.",
            3: "Học viên có thể hoàn thành các bài tập viết đơn giản, học viên cần sự hỗ trợ của giáo viên để hoàn thành các bài tập khó.",
            4: "Học viên có thể hoàn thành bài tập viết, tuy nhiên còn mắc một vài lỗi nhỏ ở ngữ pháp và cách dùng từ.",
            5: "Học viên viết tốt, viết đúng ngữ pháp và cách dùng từ, học viên có thể hoàn thành bài tập viết chính xác."
        },
    };

    const evalCategories = document.querySelectorAll('.eval-category');
    evalCategories.forEach(categoryEl => {
        const categoryName = categoryEl.getAttribute('data-category');
        const stars = categoryEl.querySelectorAll('.eval-star');
        const descEl = categoryEl.querySelector('.eval-desc');
        
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = parseInt(this.getAttribute('data-rating'));
                
                // Update stars visual
                stars.forEach(s => {
                    if (parseInt(s.getAttribute('data-rating')) <= rating) {
                        s.style.color = '#ea580c'; // Highlighted star color (orange)
                    } else {
                        s.style.color = '#cbd5e1'; // Inactive star color
                    }
                });

                // Update text description
                if (evalDataMap[categoryName] && evalDataMap[categoryName][rating]) {
                    descEl.textContent = evalDataMap[categoryName][rating];
                    descEl.style.display = 'block';
                } else {
                    descEl.textContent = '';
                    descEl.style.display = 'none';
                }
            });
        });
    });
});