document.addEventListener('DOMContentLoaded', () => {
    // 1. Modal Elements
    const modal = document.getElementById('advanced-filter-modal');
    const btnOpenModal = document.getElementById('btnAdvancedFilter');
    const btnCloseModal = document.getElementById('btn-close-modal');
    const btnCancelModal = document.getElementById('btn-cancel-modal');
    const btnApplyModal = document.getElementById('btn-apply-modal');

    // 2. Filter Inputs
    const searchInput = document.getElementById('searchInput');
    const filterLanguage = document.getElementById('filterLanguage');
    const filterStatus = document.getElementById('filterStatus');

    // 3. Modal Inputs
    const modalLevelCheckboxes = document.querySelectorAll('input[name="level"]');
    const modalAgeCheckboxes = document.querySelectorAll('input[name="age"]');
    const modalObjectiveSelect = document.getElementById('modal-objective');

    // 4. Active Filters UI
    const activeFiltersBox = document.getElementById('activeFiltersBox');
    const filterPillsContainer = document.getElementById('filterPillsContainer');
    const btnClearFilters = document.getElementById('btnClearFilters');

    // Data State for Advanced Filters
    let advancedFilters = {
        levels: [],
        ages: [],
        objective: ''
    };

    // Modal Toggles
    function openModal() { modal?.classList.add('active'); }
    function closeModal() { modal?.classList.remove('active'); }

    // Safety: ensure modal is closed on page load (prevents visible state from prior state or leaks)
    if (modal) {
        modal.classList.remove('active');
    }

    if(btnOpenModal) btnOpenModal.addEventListener('click', openModal);
    if(btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
    if(btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

    if(modal) {
        modal.addEventListener('click', (e) => {
            if(e.target === modal) closeModal();
        });
    }

    // 5. Apply Filters (Master Function)
    function applyAllFilters() {
        // Collect basic filters
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const langVal = filterLanguage ? filterLanguage.value : '';
        const statusVal = filterStatus ? filterStatus.value.toLowerCase() : '';

        // Determine if we are on list or grid
        let isGrid = document.querySelector('.grid-view') !== null;
        let cards = isGrid ? document.querySelectorAll('.course-card') : document.querySelectorAll('.custom-table tbody tr');

        let visibleCount = 0;

        cards.forEach(card => {
            // Extract data directly from HTML dataset
            let title = card.dataset.title ? card.dataset.title.toLowerCase() : '';
            let langTag = card.dataset.lang ? card.dataset.lang.toLowerCase() : '';
            let statusText = card.dataset.status ? card.dataset.status.toLowerCase() : '';
            let levelTag = card.dataset.level ? card.dataset.level.toLowerCase() : '';
            let ageText = card.dataset.age ? card.dataset.age.toLowerCase() : '';
            let objText = card.dataset.objective ? card.dataset.objective.toLowerCase() : '';

            // Check Basic safely ignoring case
            let matchSearch = title.includes(searchTerm);
            let matchLang = langVal === '' || langTag === langVal.trim().toLowerCase();
            let matchStatus = statusVal === '' || statusText === statusVal.trim().toLowerCase();

            // Check Advanced safely ignoring case
            let matchLevel = advancedFilters.levels.length === 0 || advancedFilters.levels.some(v => v.trim().toLowerCase() === levelTag);
            let matchAge = advancedFilters.ages.length === 0 || advancedFilters.ages.some(v => v.trim().toLowerCase() === ageText);
            let matchObj = advancedFilters.objective === '' || objText === advancedFilters.objective.trim().toLowerCase();

            if (matchSearch && matchLang && matchStatus && matchLevel && matchAge && matchObj) {
                if (visibleCount < 6) {
                    card.style.display = isGrid ? 'flex' : 'table-row';
                } else {
                    card.style.display = 'none'; // Hide if past page 1 (6 items)
                }
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Handle No Results
        let viewContainer = isGrid ? document.querySelector('.grid-view') : document.querySelector('.table-wrapper');
        let noResultsMsg = document.getElementById('no-results-msg');
        
        if (!noResultsMsg && viewContainer) {
            noResultsMsg = document.createElement('div');
            noResultsMsg.id = 'no-results-msg';
            noResultsMsg.style.textAlign = 'center';
            noResultsMsg.style.padding = '60px 20px';
            noResultsMsg.style.color = '#64748b';
            noResultsMsg.style.fontSize = '15px';
            noResultsMsg.style.width = '100%';
            noResultsMsg.innerHTML = '<i class="fa-solid fa-box-open" style="font-size: 36px; margin-bottom: 16px; color: #cbd5e1; display:block;"></i> No results found matching your filters.';
            viewContainer.parentNode.insertBefore(noResultsMsg, viewContainer.nextSibling);
        }

        if (noResultsMsg) {
            noResultsMsg.style.display = visibleCount === 0 ? 'block' : 'none';
            if (isGrid) {
                document.querySelector('.grid-view').style.display = visibleCount === 0 ? 'none' : 'grid';
            } else {
                document.querySelector('.table-wrapper').style.display = visibleCount === 0 ? 'none' : 'block';
            }
        }

        // --- UPDATE PAGINATION TEXT ---
        let textContainer = document.querySelector('.showing-text');
        if (textContainer) {
            let showingCount = Math.min(visibleCount, 6);
            if (visibleCount === 0) {
                textContainer.innerHTML = `Showing <strong>0</strong> courses`;
            } else {
                textContainer.innerHTML = `Showing <strong>1-${showingCount}</strong> of <strong>${visibleCount > 6 ? visibleCount + 18 : visibleCount}</strong> courses`;
            }
            
            // Visually dim page 2 if no overflow
            let pageBtns = document.querySelectorAll('.pagination .page-btn');
            if(pageBtns.length >= 3) {
                let p2 = pageBtns[2];
                if (visibleCount > 6) {
                    p2.style.opacity = '1';
                    p2.style.pointerEvents = 'auto';
                } else {
                    p2.style.opacity = '0.5';
                    p2.style.pointerEvents = 'none';
                }
            }
        }

        // Update Active Pills UI
        renderActivePills();
    }

    // Modal Apply Button
    if(btnApplyModal) {
        btnApplyModal.addEventListener('click', () => {
            // Save modal states
            advancedFilters.levels = Array.from(modalLevelCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
            advancedFilters.ages = Array.from(modalAgeCheckboxes).filter(cb => cb.checked).map(cb => cb.value);
            advancedFilters.objective = modalObjectiveSelect.value;
            
            closeModal();
            applyAllFilters();
        });
    }

    // Basic filters trigger immediately
    if(searchInput) searchInput.addEventListener('input', applyAllFilters);
    if(filterLanguage) filterLanguage.addEventListener('change', applyAllFilters);
    if(filterStatus) filterStatus.addEventListener('change', applyAllFilters);

    function renderActivePills() {
        if(!filterPillsContainer) return;
        filterPillsContainer.innerHTML = '';
        let hasFilters = false;

        // Render levels
        advancedFilters.levels.forEach(val => {
            hasFilters = true;
            createPill('Level', val, () => {
                advancedFilters.levels = advancedFilters.levels.filter(v => v !== val);
                document.querySelector(`input[name="level"][value="${val}"]`).checked = false;
                applyAllFilters();
            });
        });

        // Render ages
        advancedFilters.ages.forEach(val => {
            hasFilters = true;
            createPill('Age', val, () => {
                advancedFilters.ages = advancedFilters.ages.filter(v => v !== val);
                document.querySelector(`input[name="age"][value="${val}"]`).checked = false;
                applyAllFilters();
            });
        });

        // Render Objective
        if(advancedFilters.objective) {
            hasFilters = true;
            createPill('Obj', advancedFilters.objective, () => {
                advancedFilters.objective = '';
                modalObjectiveSelect.value = '';
                applyAllFilters();
            });
        }

        if(hasFilters) {
            activeFiltersBox.style.display = 'flex';
        } else {
            activeFiltersBox.style.display = 'none';
        }
    }

    function createPill(category, value, onRemove) {
        let pill = document.createElement('span');
        pill.className = 'filter-pill';
        pill.innerHTML = `${category}: ${value} <i class="fa-solid fa-xmark"></i>`;
        pill.querySelector('i').style.cursor = 'pointer';
        pill.querySelector('i').addEventListener('click', onRemove);
        filterPillsContainer.appendChild(pill);
    }

    // Clear All
    if(btnClearFilters) {
        btnClearFilters.addEventListener('click', () => {
            // reset advanced state
            advancedFilters.levels = [];
            advancedFilters.ages = [];
            advancedFilters.objective = '';

            // reset DOM checks
            modalLevelCheckboxes.forEach(cb => cb.checked = false);
            modalAgeCheckboxes.forEach(cb => cb.checked = false);
            modalObjectiveSelect.value = '';

            // basic inputs
            if(searchInput) searchInput.value = '';
            if(filterLanguage) filterLanguage.value = '';
            if(filterStatus) filterStatus.value = '';

            applyAllFilters();
        });
    }
});
