const studentManagement = {
    students: [],
    currentPage: 1,
    itemsPerPage: 6,
    filteredStudents: [],

    // Sample student data (chỉ 6 học viên như mock)
    sampleStudents: [
        {
            id: 'STU001',
            name: 'Lê Văn An',
            email: 'levanan@gmail.com',
            phone: '0345678912',
            dob: '2005-05-20',
            gender: 'Male',
            totalCourses: 2,
            status: 'active',
            dateCreated: '2026-03-02'
        },
        {
            id: 'STU002',
            name: 'Ngô Văn Tuấn',
            email: 'ngovantuan@gmail.com',
            phone: '0345678912',
            dob: '2011-04-30',
            gender: 'Male',
            totalCourses: 1,
            status: 'locked',
            dateCreated: '2026-03-02'
        },
        {
            id: 'STU003',
            name: 'Vũ Thị Ngọc',
            email: 'vuthingoc@gmail.com',
            phone: '0345678912',
            dob: '2012-06-14',
            gender: 'Female',
            totalCourses: 1,
            status: 'inactive',
            dateCreated: '2026-03-02'
        },
        {
            id: 'STU004',
            name: 'Trần Mai Hương',
            email: 'tranmaihuong@gmail.com',
            phone: '0345678912',
            dob: '2007-08-20',
            gender: 'Female',
            totalCourses: 1,
            status: 'active',
            dateCreated: '2026-03-02'
        },
        {
            id: 'STU005',
            name: 'Trần Văn Minh',
            email: 'tranvanminh@gmail.com',
            phone: '0345678912',
            dob: '2008-08-15',
            gender: 'Male',
            totalCourses: 3,
            status: 'active',
            dateCreated: '2026-03-02'
        },
        {
            id: 'STU006',
            name: 'Phạm Thị Lan Anh',
            email: 'lananhpt@gmail.com',
            phone: '0345678912',
            dob: '2006-07-22',
            gender: 'Female',
            totalCourses: 2,
            status: 'active',
            dateCreated: '2026-03-02'
        }
    ],

    init: function() {
        this.students = [...this.sampleStudents];
        this.filteredStudents = [...this.students];
        this.bindEvents();
        this.renderStudents();
    },

    bindEvents: function() {
        // Add student modal
        const btnAdd = document.getElementById('btn-add-student');
        const btnClose = document.getElementById('close-add-modal');
        const btnCancel = document.getElementById('cancel-add-student');
        const btnSave = document.getElementById('save-student');

        if (btnAdd) btnAdd.addEventListener('click', () => this.showAddStudentModal());
        if (btnClose) btnClose.addEventListener('click', () => this.hideAddStudentModal());
        if (btnCancel) btnCancel.addEventListener('click', () => this.hideAddStudentModal());

        // Save student
        if (btnSave) btnSave.addEventListener('click', () => this.saveStudent());

        // Search and filters
        const searchInput = document.getElementById('search-students');
        const statusFilter = document.getElementById('filter-status');
        if (searchInput) {
            searchInput.addEventListener('input', () => this.filterStudents());
        }
        if (statusFilter) statusFilter.addEventListener('change', () => this.filterStudents());

        const reloadButton = document.getElementById('btn-reload');
        if (reloadButton) {
            reloadButton.addEventListener('click', () => {
                if (searchInput) searchInput.value = '';
                if (statusFilter) statusFilter.value = 'all';
                this.filteredStudents = [...this.students];
                this.renderStudents();
            });
        }
    },

    showAddStudentModal: function() {
        document.getElementById('add-student-modal').style.display = 'flex';
        document.getElementById('add-student-form').reset();
    },

    hideAddStudentModal: function() {
        document.getElementById('add-student-modal').style.display = 'none';
    },

    saveStudent: function() {
        const form = document.getElementById('add-student-form');
        if (!form.checkValidity()) {
            form.reportValidity();
            return;
        }

        const genderEl = document.getElementById('student-gender');
        const dobEl = document.getElementById('student-dob');

        const newStudent = {
            id: 'STU' + String(this.students.length + 1).padStart(3, '0'),
            name: document.getElementById('student-name').value,
            email: document.getElementById('student-email').value,
            phone: document.getElementById('student-phone').value,
            dob: dobEl ? dobEl.value : '',
            gender: genderEl ? genderEl.value : 'Male',
            totalCourses: 0,
            status: 'active',
            dateCreated: new Date().toISOString().split('T')[0],
            address: document.getElementById('student-address').value
        };

        this.students.unshift(newStudent);
        this.filteredStudents = [...this.students];
        this.renderStudents();
        this.hideAddStudentModal();

        alert('Student added successfully!');
    },

    filterStudents: function() {
        const searchInput = document.getElementById('search-students');
        const statusSelect = document.getElementById('filter-status');

        const searchTerm = (searchInput ? searchInput.value : '').toLowerCase().trim();
        const statusFilter = statusSelect ? statusSelect.value : 'all';
        const courseFilterElement = document.getElementById('filter-course');
        const courseFilter = courseFilterElement ? courseFilterElement.value : 'all';

        this.filteredStudents = this.students.filter(student => {
            const matchesSearch =
                (student.name || '').toLowerCase().includes(searchTerm) ||
                (student.email || '').toLowerCase().includes(searchTerm) ||
                (student.phone || '').toLowerCase().includes(searchTerm) ||
                (student.id || '').toLowerCase().includes(searchTerm);

            const matchesStatus = statusFilter === 'all' || student.status === statusFilter;

            const matchesCourse = courseFilter === 'all' ||
                                (student.course && student.course.toLowerCase().includes(courseFilter));

            return matchesSearch && matchesStatus && matchesCourse;
        });

        this.renderStudents();
    },

    renderStudents: function() {
        const tbody = document.getElementById('students-table-body');
        tbody.innerHTML = '';

        // Luôn hiển thị đơn giản 6 học viên đầu tiên
        const studentsToShow = this.filteredStudents.slice(0, this.itemsPerPage);

        const avatarPalette = [
            { bg: '#dcfce7', color: '#166534' }, // green
            { bg: '#fef3c7', color: '#92400e' }, // amber
            { bg: '#dbeafe', color: '#1d4ed8' }, // blue
            { bg: '#fce7f3', color: '#9d174d' }, // pink
            { bg: '#ffe4e6', color: '#9f1239' }, // rose
            { bg: '#ede9fe', color: '#6d28d9' } // violet
        ];

        studentsToShow.forEach((student, idx) => {
            const row = document.createElement('tr');
            row.style.cursor = 'pointer';
            row.addEventListener('click', () => {
                window.location.href = 'student_detail.html?id=' + student.id;
            });
            const initials = this.getStudentInitials(student.name);
            const palette = avatarPalette[idx % avatarPalette.length];
            row.innerHTML = `
                <td>
                    <div class="avatar-circle" style="background:${palette.bg}; color:${palette.color};">${initials}</div>
                </td>
                <td>
                    <div class="student-name-cell">
                        <div class="student-name">${student.name}</div>
                        <div class="student-meta">${this.formatDate(student.dob, 'dob')} • ${student.gender}</div>
                    </div>
                </td>
                <td>${student.email}</td>
                <td>${student.phone || '-'}</td>
                <td><span class="status-badge status-${student.status}">${this.getStatusLabel(student.status)}</span></td>
                <td style="text-align: center;">${student.totalCourses || 0}</td>
                <td>${this.formatDate(student.dateCreated, 'short')}</td>
            `;
            tbody.appendChild(row);
        });

        if (studentsToShow.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" style="text-align: center; padding: 40px;">No students found</td></tr>';
        }
    },

    viewStudent: function(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            alert(`Viewing student: ${student.name}\nEmail: ${student.email}\nCourse: ${student.course}`);
        }
    },

    editStudent: function(studentId) {
        const student = this.students.find(s => s.id === studentId);
        if (student) {
            alert(`Editing student: ${student.name}\n(This would open an edit modal in a real application)`);
        }
    },

    deleteStudent: function(studentId) {
        if (confirm('Are you sure you want to delete this student?')) {
            this.students = this.students.filter(s => s.id !== studentId);
            this.filteredStudents = [...this.students];
            this.renderStudents();
            alert('Student deleted successfully!');
        }
    },

    getStatusLabel: function(status) {
        const map = {
            active: 'Active',
            locked: 'Locked',
            inactive: 'Not Activated',
            pending: 'Pending'
        };
        return map[status] || status || '-';
    },

    getStudentInitials: function(name) {
        const safe = (name || '').trim();
        if (!safe) return '';

        const stripped = this.stripDiacritics(safe);
        const parts = stripped.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '';

        return (first + last).toUpperCase();
    },

    stripDiacritics: function(str) {
        // Chuẩn hóa Unicode để bỏ dấu tiếng Việt
        try {
            return String(str).normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        } catch {
            return String(str);
        }
    },

    formatDate: function(dateString, formatType = 'long') {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (Number.isNaN(date.valueOf())) return dateString;

        if (formatType === 'short') {
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }

        if (formatType === 'dob') {
            // Ảnh hiển thị DOB theo dạng DD-MM-YYYY
            return date.toLocaleDateString('en-GB', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            }).replaceAll('/', '-');
        }

        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    }
};