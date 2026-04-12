const classAllocationLogic = {
    mockClasses: [
        {
            id: 'c1',
            code: 'TOEIC-LR900-L1-C1-01',
            group: 'TOEIC-LR900-32',
            studentName: 'Lê Văn An',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:00 - 19:25',
            suggestedCount: 11,
            suggestState: 'All Rejected',
            status: 'Pending',
            teacher: '---'
        },
        {
            id: 'c2',
            code: 'IELTS-PR_SPE-L2-C3-01(1)',
            group: 'IELTS-PR_SPE-58',
            studentName: 'Ngô Văn Tuấn',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:00 - 19:25',
            suggestedCount: 0,
            suggestState: 'No Suitable Teacher', 
            status: 'Pending',
            teacher: '---'
        },
        {
            id: 'c3',
            code: 'HSK-1_2-L2-C3-02',
            group: 'HSK-1_2-102',
            studentName: 'Vũ Thị Ngọc',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:25 - 20:10',
            suggestedCount: 6,
            suggestState: '',
            status: 'Teacher Assigned',
            teacher: 'Trần Thị B'
        },
        {
            id: 'c4',
            code: 'HSK-1_2-L4-C2-09',
            group: 'HSK-1_2-158',
            studentName: 'Trần Văn Bình',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:25 - 20:10',
            suggestedCount: 8,
            suggestState: '',
            status: 'Pending',
            teacher: '---'
        },
        {
            id: 'c5',
            code: 'HSK-3-L2-C2-08(2)',
            group: 'HSK-3-122',
            studentName: 'Lê Ngọc Mẫn',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:25 - 20:10',
            suggestedCount: 10,
            suggestState: '',
            status: 'Pending',
            teacher: '---'
        },
        {
            id: 'c6',
            code: 'HSK-1_2-L6-C5-10',
            group: 'HSK-1_2-132',
            studentName: 'Lê Trần Nam',
            studentPhone: '0345678912',
            date: 'Mon, 02/03/2026',
            time: '19:25 - 19:50',
            suggestedCount: 14,
            suggestState: '',
            status: 'Teacher Assigned',
            teacher: 'Nguyễn Đình E'
        }
    ],

    mockTeachers: [
        { id: 't1', name: 'Nguyễn Văn A', phone: '0123456789', status: 'Rejected' },
        { id: 't2', name: 'Trần Thị B', phone: '0123456789', status: 'Not Contacted' },
        { id: 't3', name: 'Trần Văn Bình', phone: '0123456789', status: 'Rejected' },
        { id: 't4', name: 'Đinh Thị Cúc', phone: '0123456789', status: 'Not Contacted' },
        { id: 't5', name: 'Lê Văn Định', phone: '0123456789', status: 'Not Contacted' }
    ],

    currentAdjustClass: null,
    currentSelectTeacher: null,
    
    // Filter states
    classFilter: 'All',
    teacherFilter: 'All',

    setFilter: function(type, val, btnEl) {
        // Update active class on buttons
        const container = btnEl.parentElement;
        container.querySelectorAll('.segment-btn').forEach(btn => btn.classList.remove('active'));
        btnEl.classList.add('active');

        if (type === 'class') {
            this.classFilter = val;
            this.renderTable();
        } else if (type === 'teacher') {
            this.teacherFilter = val;
            this.renderTeacherList();
        }
    },

    init: function() {
        this.renderTable();
    },

    renderTable: function() {
        const tbody = document.getElementById('alloc-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        const searchQ = (document.getElementById('class-search-input') || {value: ''}).value.toLowerCase();

        let filtered = this.mockClasses.filter(c => {
            // Filter by segmented control
            if (this.classFilter !== 'All') {
                if (c.status !== this.classFilter) return false;
            }
            // Filter by search string
            if (searchQ) {
                if (!c.studentName.toLowerCase().includes(searchQ) && !c.studentPhone.includes(searchQ)) {
                    return false;
                }
            }
            return true;
        });

        filtered.forEach(c => {
            const tr = document.createElement('tr');
            
            // Suggested teachers HTML
            let suggestHtml = '';
            if (c.suggestedCount > 0) {
                let avatarsHtml = `
                    <div class="avatar-group">
                        <img src="../assets/img/user_avatar.png" alt="T1">
                        <img src="../assets/img/user_avatar.png" alt="T2">
                        <img src="../assets/img/user_avatar.png" alt="T3">
                        <span class="more-avatar">+${c.suggestedCount - 3}</span>
                    </div>
                `;
                let stateHtml = '';
                if (c.suggestState === 'All Rejected') {
                    stateHtml = `<div class="suggest-text red">All Rejected</div>`;
                }
                suggestHtml = `
                    <div class="td-suggested">
                        ${avatarsHtml}
                        ${stateHtml}
                    </div>
                `;
            } else {
                suggestHtml = `<div class="suggest-text gray">No Suitable Teacher</div>`;
            }

            let statusClass = c.status === 'Pending' ? 'pending' : 'assigned';

            tr.innerHTML = `
                <td class="td-classes">
                    <div class="c-code">${c.code}</div>
                    <div class="c-sub">${c.group}</div>
                </td>
                <td class="td-student">
                    <div class="s-name">${c.studentName}</div>
                    <div class="s-phone">${c.studentPhone}</div>
                </td>
                <td class="td-schedule">
                    <div class="sch-date">${c.date}</div>
                    <div class="sch-time">${c.time}</div>
                </td>
                <td>${suggestHtml}</td>
                <td><span class="status-badge ${statusClass}">${c.status}</span></td>
                <td>${c.teacher}</td>
                <td class="td-action">
                    <a href="#" onclick="classAllocationLogic.openAdjustModal('${c.id}', event)">Adjust</a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    openAdjustModal: function(classId, event) {
        event.preventDefault();
        const c = this.mockClasses.find(x => x.id === classId);
        if(!c) return;

        this.currentAdjustClass = c;
        
        const titleEl = document.getElementById('modal-class-title');
        if(titleEl) {
            titleEl.innerHTML = `<strong>Class:</strong> ${c.group} (${c.code})`;
        }

        this.renderTeacherList();
        
        document.getElementById('adjust-modal').style.display = 'flex';
    },

    closeAdjustModal: function() {
        document.getElementById('adjust-modal').style.display = 'none';
        this.currentAdjustClass = null;
    },

    renderTeacherList: function() {
        const listEl = document.getElementById('teacher-list-container');
        if(!listEl) return;
        listEl.innerHTML = '';

        const searchQ = (document.getElementById('teacher-search-input') || {value: ''}).value.toLowerCase();

        let filtered = this.mockTeachers.filter(t => {
            if (this.teacherFilter !== 'All') {
                if (t.status !== this.teacherFilter) return false;
            }
            if (searchQ) {
                if (!t.name.toLowerCase().includes(searchQ) && !t.phone.includes(searchQ)) {
                    return false;
                }
            }
            return true;
        });

        filtered.forEach(t => {
            let badgeClass = t.status === 'Rejected' ? 't-rejected' : 't-notcontact';
            
            let btnHtml = '';
            if (t.status !== 'Rejected') {
                btnHtml = `
                    <button class="btn-reject" onclick="classAllocationLogic.rejectTeacher('${t.id}')">Reject</button>
                    <button class="btn-select" onclick="classAllocationLogic.confirmSelect('${t.id}')">Select</button>
                `;
            }

            const item = document.createElement('div');
            item.className = 'teacher-item';
            item.innerHTML = `
                <div class="teacher-info-block">
                    <img src="../assets/img/user_avatar.png" alt="Avatar">
                    <div>
                        <div class="t-name-row">
                            <span class="t-name">${t.name}</span>
                            <span class="t-badge ${badgeClass}">${t.status}</span>
                        </div>
                        <div class="t-phone">${t.phone}</div>
                    </div>
                </div>
                <div class="teacher-actions">
                    ${btnHtml}
                </div>
            `;
            listEl.appendChild(item);
        });
    },

    rejectTeacher: function(teacherId) {
        // Simple mock to just mark as rejected
        const t = this.mockTeachers.find(x => x.id === teacherId);
        if(t) {
            t.status = 'Rejected';
            this.renderTeacherList();
        }
    },

    confirmSelect: function(teacherId) {
        const t = this.mockTeachers.find(x => x.id === teacherId);
        if(!t) return;
        
        this.currentSelectTeacher = t;
        
        // Update confirm msg
        const msgEl = document.getElementById('confirm-msg');
        if (msgEl && this.currentAdjustClass) {
            msgEl.innerHTML = `Are you sure you want to assign class <strong>${this.currentAdjustClass.group}</strong> to teacher <strong>${t.name}</strong>?`;
        }

        document.getElementById('confirm-assign-modal').style.display = 'flex';
    },

    closeConfirmModal: function() {
        document.getElementById('confirm-assign-modal').style.display = 'none';
        this.currentSelectTeacher = null;
    },

    submitAssignment: function() {
        if (!this.currentAdjustClass || !this.currentSelectTeacher) return;
        
        // Update class status
        this.currentAdjustClass.status = 'Teacher Assigned';
        this.currentAdjustClass.teacher = this.currentSelectTeacher.name;

        // Re-render main table
        this.renderTable();
        
        // Close modals
        this.closeConfirmModal();
        this.closeAdjustModal();
    }
};
