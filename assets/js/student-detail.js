const studentDetailLogic = {
    // Mock student data mirroring students-list.js for static demonstration
    mockStudents: [
        {
            id: 'STU001',
            name: 'Lê Văn An',
            email: 'levanan@gmail.com',
            phone: '0345678912',
            dob: '2005-05-20',
            gender: 'Male',
            status: 'active',
            address: '50 Như Nguyệt, Đà Nẵng'
        },
        {
            id: 'STU002',
            name: 'Ngô Văn Tuấn',
            email: 'ngovantuan@gmail.com',
            phone: '0345678912',
            dob: '2011-04-30',
            gender: 'Male',
            status: 'locked',
            address: '50 Như Nguyệt, Đà Nẵng'
        },
        {
            id: 'STU003',
            name: 'Vũ Thị Ngọc',
            email: 'vuthingoc@gmail.com',
            phone: '0345678912',
            dob: '2012-06-14',
            gender: 'Female',
            status: 'inactive',
            address: '50 Như Nguyệt, Đà Nẵng'
        }
    ],

    studentData: null,

    init: function() {
        this.loadStudentFromUrl();
        this.loadStudentInfo();
        this.toggleEditInfo(false);
    },

    loadStudentFromUrl: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const studentId = urlParams.get('id');
        
        let found = this.mockStudents.find(s => s.id === studentId);
        
        // If no ID passed or not found, default to a locked student for demo purposes
        if (!found) {
            found = this.mockStudents.find(s => s.status === 'locked');
        }

        // Format dates if needed to match input type requirements
        let formattedDob = found.dob;
        if (formattedDob && formattedDob.indexOf('-') !== -1) {
            const parts = formattedDob.split('-');
            if (parts[0].length === 4) {
                // yyyy-mm-dd to dd/mm/yyyy
                formattedDob = `${parts[2]}/${parts[1]}/${parts[0]}`;
            }
        }

        this.studentData = {
            id: found.id || 'STU139490',
            name: found.name,
            dob: formattedDob,
            gender: found.gender,
            phone: found.phone,
            email: found.email,
            address: found.address,
            status: found.status
        };
    },

    getInitials: function(name) {
        const safe = (name || '').trim();
        if (!safe) return 'NA';
        const stripped = safe.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
        const parts = stripped.split(/\s+/).filter(Boolean);
        const first = parts[0]?.[0] || '';
        const last = parts.length > 1 ? (parts[parts.length - 1]?.[0] || '') : '';
        return (first + last).toUpperCase();
    },

    loadStudentInfo: function() {
        document.getElementById('student-name').value = this.studentData.name;
        document.getElementById('student-dob').value = this.studentData.dob;
        document.getElementById('student-gender').value = this.studentData.gender;
        document.getElementById('student-phone').value = this.studentData.phone;
        document.getElementById('student-email').value = this.studentData.email;
        document.getElementById('student-address').value = this.studentData.address;
        
        const usernameEl = document.getElementById('student-username');
        if (usernameEl) {
            usernameEl.value = this.studentData.email;
        }

        // Update headers and summary
        const headerName = document.getElementById('header-student-name');
        if (headerName) headerName.textContent = this.studentData.name;
        
        const summaryName = document.getElementById('student-summary-name');
        if (summaryName) summaryName.textContent = this.studentData.name;

        const summaryId = document.getElementById('student-summary-id');
        if (summaryId) summaryId.textContent = 'ID: ' + this.studentData.id;

        const avatarDisplay = document.getElementById('student-avatar-display');
        if (avatarDisplay) {
            avatarDisplay.textContent = this.getInitials(this.studentData.name);
            
            const avatarPalette = [
                { bg: '#dcfce7', color: '#166534' }, // green
                { bg: '#fef3c7', color: '#92400e' }, // amber
                { bg: '#dbeafe', color: '#1d4ed8' }, // blue
                { bg: '#fce7f3', color: '#9d174d' }, // pink
                { bg: '#ffe4e6', color: '#9f1239' }, // rose
                { bg: '#ede9fe', color: '#6d28d9' }  // violet
            ];
            
            let idx = this.mockStudents.findIndex(s => s.id === this.studentData.id);
            if (idx === -1) idx = 0;
            const palette = avatarPalette[idx % avatarPalette.length];
            
            avatarDisplay.style.background = palette.bg;
            avatarDisplay.style.color = palette.color;
        }

        // Render Status and Left Action Buttons
        this.renderStatusUI();
    },

    renderStatusUI: function() {
        const badge = document.getElementById('student-status-badge');
        const actionBtn = document.getElementById('student-action-btn');
        const actionIcon = document.getElementById('student-action-icon');
        const actionText = document.getElementById('student-action-text');

        if (!badge || !actionBtn) return;

        // Reset classes
        badge.className = 'student-summary-status status-badge';
        actionBtn.className = 'action-btn-left';
        actionBtn.style.display = 'flex';

        if (this.studentData.status === 'locked') {
            badge.classList.add('status-locked');
            badge.textContent = 'Locked';
            
            actionBtn.classList.add('btn-recover');
            actionIcon.className = 'fa-solid fa-clock-rotate-left';
            actionText.textContent = 'Recover';
        } else if (this.studentData.status === 'active') {
            badge.classList.add('status-active');
            badge.textContent = 'Active';
            
            actionBtn.classList.add('btn-lock');
            actionIcon.className = 'fa-solid fa-user-lock';
            actionText.textContent = 'Lock Account';
        } else {
            // Default inactive / pending
            badge.classList.add('status-inactive');
            badge.textContent = 'Not Activated';
            
            actionBtn.classList.add('btn-resend');
            actionIcon.className = 'fa-regular fa-paper-plane';
            actionText.textContent = 'Resend Activation';
        }
    },

    toggleEditInfo: function(isEditing) {
        const inputFields = ['student-name', 'student-dob', 'student-phone', 'student-email', 'student-address'];
        const selectFields = ['student-gender'];
        
        inputFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('readonly');
                    el.classList.remove('readonly-mode');
                    el.classList.add('edit-mode');
                } else {
                    el.setAttribute('readonly', true);
                    el.classList.remove('edit-mode');
                    el.classList.add('readonly-mode');
                }
            }
        });

        selectFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('disabled');
                    el.classList.remove('readonly-mode');
                    el.classList.add('edit-mode');
                } else {
                    el.setAttribute('disabled', true);
                    el.classList.remove('edit-mode');
                    el.classList.add('readonly-mode');
                }
            }
        });

        const editBtn = document.getElementById('btn-edit-info');
        const saveBtn = document.getElementById('btn-save-info');
        const cancelBtn = document.getElementById('btn-cancel-info');
        
        if (editBtn) editBtn.style.display = isEditing ? 'none' : 'flex';
        if (saveBtn) saveBtn.style.display = isEditing ? 'flex' : 'none';
        if (cancelBtn) cancelBtn.style.display = isEditing ? 'flex' : 'none';

        if (!isEditing) {
            this.loadStudentInfo(); // restore original data on cancel (or reload updated data on save)
        }
    },

    saveInfo: function() {
        this.studentData.name = document.getElementById('student-name').value;
        this.studentData.dob = document.getElementById('student-dob').value;
        this.studentData.gender = document.getElementById('student-gender').value;
        this.studentData.phone = document.getElementById('student-phone').value;
        this.studentData.email = document.getElementById('student-email').value;
        this.studentData.address = document.getElementById('student-address').value;

        alert('Personal information saved successfully!');
        this.toggleEditInfo(false); 
        this.renderStatusUI(); // re-render names/initials
    },

    // Enrolled Courses Logic
    mockEnrolledCourses: [
        {
            id: 'ENG-TOEIC-LR900',
            name: 'TOEIC L&R: Conquer 900+',
            type: '25 minutes',
            schedule: 'Mon, Wed, Fri (19:00 - 19:25)',
            status: 'In Progress',
            regDate: '02/03/2026',
            level: 'Advanced',
            age: '18+',
            objectives: 'Certificate Exam Preparation',
            price: '485.000',
            levelsCount: 8,
            lessonsCount: 31,
            completedLessons: 12
        },
        {
            id: 'ENG-IELTS-GR_VO',
            name: 'IELTS Grammar & Vocabulary',
            type: 'Juinior 45 minutes',
            schedule: 'Mon, Wed, Fri (20:00 - 20:45)',
            status: 'Completed',
            regDate: '10/08/2025',
            level: 'Intermediate',
            age: '12+',
            objectives: 'General English Development',
            price: '550.000',
            levelsCount: 6,
            lessonsCount: 24,
            completedLessons: 24
        }
    ],

    mockClasses: [
        { code: 'TOEIC-LR900-32', lesson: 'Photo Traps & Paraphrase...', lessonSub: 'TOEIC-LR900-L1-C1-01', date: '02-03-2026', teacher: 'Lê Xuân Anh', status: 'Completed', comment: 'Học tập trung' },
        { code: 'TOEIC-LR900-33', lesson: 'Question-Response...', lessonSub: 'TOEIC-LR900-L1-C1-02', date: '04-03-2026', teacher: 'Trần Thị B', status: 'Not Started', comment: '---' },
        { code: 'TOEIC-LR900-34', lesson: 'Part 1 & 2 Mastery Test', lessonSub: 'TOEIC-LR900-L1-C1-03', date: '06-03-2026', teacher: '---', status: 'Not Started', comment: '---' },
        { code: 'TOEIC-LR900-35', lesson: 'Short Conversations...', lessonSub: 'TOEIC-LR900-L1-C1-04', date: '09-03-2026', teacher: '---', status: 'Not Started', comment: '---' },
        { code: 'TOEIC-LR900-36', cast: 'Short Talks Strategies', lessonSub: 'TOEIC-LR900-L1-C1-05', date: '11-03-2026', teacher: '---', status: 'Not Started', comment: '---' }
    ],

    switchTab: function(tabId) {
        document.getElementById('tab-btn-personal').classList.remove('active');
        document.getElementById('tab-btn-courses').classList.remove('active');
        
        document.getElementById('tab-content-personal').style.display = 'none';
        document.getElementById('tab-content-courses').style.display = 'none';

        if (tabId === 'personal') {
            document.getElementById('tab-btn-personal').classList.add('active');
            document.getElementById('tab-content-personal').style.display = 'block';
        } else if (tabId === 'courses') {
            document.getElementById('tab-btn-courses').classList.add('active');
            document.getElementById('tab-content-courses').style.display = 'block';
            this.renderCourseFilterOptions();
            this.renderEnrolledCourses();
        }
    },

    renderCourseFilterOptions: function() {
        const filterSelect = document.getElementById('course-filter-select');
        if (!filterSelect) return;
        
        const currentVal = filterSelect.value || 'all';
        
        let optionsHTML = '<option value="all">All Courses</option>';
        this.mockEnrolledCourses.forEach(course => {
            optionsHTML += `<option value="${course.id}">${course.name}</option>`;
        });
        
        filterSelect.innerHTML = optionsHTML;
        filterSelect.value = currentVal;
    },

    renderEnrolledCourses: function() {
        const tbody = document.getElementById('student-courses-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        const filterSelect = document.getElementById('course-filter-select');
        const filterValue = filterSelect ? filterSelect.value : 'all';
        
        let coursesToRender = this.mockEnrolledCourses;
        if (filterValue !== 'all') {
            coursesToRender = coursesToRender.filter(c => c.id === filterValue);
        }
        
        coursesToRender.forEach(course => {
            const tr = document.createElement('tr');
            
            let statusClass = 'status-notstarted';
            if (course.status === 'In Progress') statusClass = 'status-inprogress';
            else if (course.status === 'Completed') statusClass = 'status-completed';

            // Split schedule for display
            let schedHTML = course.schedule;
            if (schedHTML.includes('(')) {
                schedHTML = schedHTML.replace('(', '<br><span style="color:#94a3b8; font-size:13px;">').replace(')', '</span>');
            }

            // Split type for display
            let typeHTML = course.type;
            if (typeHTML.includes('Juinior')) {
                typeHTML = typeHTML.replace('Juinior ', 'Juinior<br>');
            }

            tr.innerHTML = `
                <td>
                    <div style="font-weight: 700; color: #020617;">${course.name}</div>
                    <div style="color: #94a3b8; font-size: 13px;">${course.id}</div>
                </td>
                <td>${typeHTML}</td>
                <td>${schedHTML}</td>
                <td><span class="status-badge ${statusClass}">${course.status}</span></td>
                <td style="padding-left: 35px;">${course.regDate}</td>
                <td class="action-cell">
                    <button class="btn btn-outline" style="border: none; background: none; color: #64748b; font-size: 18px; cursor: pointer; padding: 4px;" onclick="studentDetailLogic.toggleCourseAction('${course.id}', event)">
                        <i class="fa-solid fa-ellipsis-vertical"></i>
                    </button>
                    <div id="popover-${course.id}" class="action-popover" style="display: none;">
                        <button onclick="studentDetailLogic.openCourseModal('${course.id}')"><i class="fa-solid fa-eye"></i> View Details</button>
                    </div>
                </td>
            `;
            tbody.appendChild(tr);
        });

        // Close popovers if clicking outside
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.action-cell')) {
                document.querySelectorAll('.action-popover').forEach(el => el.style.display = 'none');
            }
        });
    },

    toggleCourseAction: function(courseId, event) {
        event.stopPropagation();
        const popover = document.getElementById('popover-' + courseId);
        const isVisible = popover.style.display === 'block';
        
        // hide all others
        document.querySelectorAll('.action-popover').forEach(el => el.style.display = 'none');
        
        if (!isVisible) {
            popover.style.display = 'block';
        }
    },

    openCourseModal: function(courseId) {
        // hide the popover
        const popover = document.getElementById('popover-' + courseId);
        if (popover) popover.style.display = 'none';

        const course = this.mockEnrolledCourses.find(c => c.id === courseId);
        if (!course) return;

        document.getElementById('modal-course-title').textContent = course.name;
        document.getElementById('modal-course-code').textContent = course.id;
        
        document.getElementById('modal-class-type').textContent = course.type.replace('Juinior ', 'Juinior '); // reset br
        document.getElementById('modal-reg-date').textContent = course.regDate;
        document.getElementById('modal-schedule').textContent = course.schedule;
        
        const statusEl = document.getElementById('modal-status');
        statusEl.textContent = course.status;
        statusEl.className = 'status-badge';
        if (course.status === 'In Progress') statusEl.classList.add('status-inprogress');
        else if (course.status === 'Completed') statusEl.classList.add('status-completed');

        document.getElementById('modal-level').textContent = course.level;
        document.getElementById('modal-objectives').textContent = course.objectives;
        document.getElementById('modal-age').textContent = course.age;
        document.getElementById('modal-price').textContent = course.price;
        document.getElementById('modal-levels-count').textContent = course.levelsCount;
        document.getElementById('modal-lessons-count').textContent = course.lessonsCount;

        // Progress
        const progressPercentage = Math.round((course.completedLessons / course.lessonsCount) * 100);
        const wrap = document.querySelector('.progress-wrap');
        if (wrap) {
            wrap.innerHTML = `
                <div style="text-align: right; font-size: 13px; font-weight: 600; margin-bottom: 4px;">Progress: <span style="color: #16a34a;">${course.completedLessons}</span>/ ${course.lessonsCount} Classes</div>
                <div class="progress-bar-bg">
                    <div class="progress-bar-fill" style="width: ${progressPercentage}%;"></div>
                </div>
            `;
        }

        this.renderModalClasses();
        
        document.getElementById('course-detail-modal').style.display = 'flex';
    },

    closeCourseModal: function() {
        document.getElementById('course-detail-modal').style.display = 'none';
    },

    renderModalClasses: function() {
        const tbody = document.getElementById('modal-classes-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';
        
        this.mockClasses.forEach(cls => {
            const tr = document.createElement('tr');
            
            let statusClass = 'status-notstarted';
            if (cls.status === 'In Progress') statusClass = 'status-inprogress';
            else if (cls.status === 'Completed') statusClass = 'status-completed';

            let lessonTitle = cls.lesson || cls.cast;

            tr.innerHTML = `
                <td style="color: #020617; font-weight: 500;">${cls.code}</td>
                <td>
                    <div style="color: #4f46e5; font-weight: 500;">${lessonTitle}</div>
                    <div style="color: #94a3b8; font-size: 13px;">${cls.lessonSub}</div>
                </td>
                <td>${cls.date}</td>
                <td>${cls.teacher}</td>
                <td><span class="status-badge ${statusClass}">${cls.status}</span></td>
                <td>${cls.comment}</td>
            `;
            tbody.appendChild(tr);
        });
    },

    // Enroll in Course Modal logic
    openEnrollModal: function() {
        const studentNameEl = document.getElementById('enroll-modal-student-name');
        if (studentNameEl && this.studentData) {
            studentNameEl.textContent = `${this.studentData.name} - ${this.studentData.id}`;
        }
        
        // Reset form
        document.getElementById('enroll-course-search').value = '';
        document.getElementById('enroll-course-selected').style.display = 'none';
        
        const amountEl = document.getElementById('enroll-total-amount');
        if (amountEl) {
            amountEl.textContent = '0';
            amountEl.classList.add('zero');
        }

        // Set default date to 02/03/2026 similar to image if mock doesn't matter, else today
        document.getElementById('enroll-reg-date').value = '2026-03-02';

        // Reset days
        document.querySelectorAll('.day-btn').forEach(btn => btn.classList.remove('active'));

        document.getElementById('enroll-course-modal').style.display = 'flex';
    },

    closeEnrollModal: function() {
        document.getElementById('enroll-course-modal').style.display = 'none';
    },

    onCourseSearchInput: function(event) {
        const val = event.target.value.toLowerCase();
        const selectedContainer = document.getElementById('enroll-course-selected');
        const amountEl = document.getElementById('enroll-total-amount');

        if (val.includes('ielts')) {
            // Show course info like image 2
            selectedContainer.style.display = 'flex';
            selectedContainer.className = 'course-selected-card';
            selectedContainer.innerHTML = `
                <img src="../assets/img/courses_img/course_3.png" alt="IELTS Course" class="course-thumb">
                <div class="course-info-grid">
                    <!-- Row 1 -->
                    <div class="info-cell">
                        <span class="info-lbl">Language:</span>
                        <span class="info-val">English</span>
                    </div>
                    <div class="info-cell">
                        <span class="info-lbl">Age:</span>
                        <span class="info-val">18+</span>
                    </div>
                    <div class="info-cell">
                        <span class="info-lbl">Levels:</span>
                        <span class="info-val">8</span>
                    </div>
                    
                    <!-- Row 2 -->
                    <div class="info-cell">
                        <span class="info-lbl">Course Level:</span>
                        <span class="info-val">Advanced</span>
                    </div>
                    <div class="info-cell align-center">
                        <span class="info-lbl">Objectives:</span>
                        <span class="info-val">Certificate Exam<br>Preparation</span>
                    </div>
                    <div class="info-cell">
                        <span class="info-lbl">Lessons:</span>
                        <span class="info-val">29</span>
                    </div>
                    
                    <!-- Row 3 -->
                    <div class="info-cell no-border">
                        <div class="course-price-label">
                            <i class="fa-solid fa-circle-info"></i>
                            <span>Course Price:</span>
                        </div>
                        <span class="course-price-val">485.000đ</span>
                    </div>
                    <div class="info-cell no-border"></div>
                    <div class="info-cell no-border"></div>
                </div>
            `;
            
            // Set amount
            if (amountEl) {
                amountEl.textContent = '485.000';
                amountEl.classList.remove('zero');
            }

            // Select Mon Wed Fri automatically for mock demonstration
            document.querySelectorAll('.day-btn').forEach(btn => {
                if (['Mon', 'Wed', 'Fri'].includes(btn.textContent)) {
                    btn.classList.add('active');
                } else {
                    btn.classList.remove('active');
                }
            });
            
        } else {
            selectedContainer.style.display = 'none';
            if (amountEl) {
                amountEl.textContent = '0';
                amountEl.classList.add('zero');
            }
        }
    },

    updateClassType: function() {
        // Handled via CSS :checked pseudo-class and name group
    },

    toggleEnrollDay: function(btn) {
        btn.classList.toggle('active');
    },

    confirmEnroll: function() {
        // Only allow confirm if a course is selected (amount is not 0)
        const amountEl = document.getElementById('enroll-total-amount');
        if (amountEl && amountEl.textContent === '0') {
            alert('Please search and select a course first!');
            return;
        }
        document.getElementById('enroll-confirm-modal').style.display = 'flex';
    },

    closeEnrollConfirmModal: function() {
        document.getElementById('enroll-confirm-modal').style.display = 'none';
    },

    submitEnroll: function() {
        // Determine selected class type
        const classTypeRadios = document.querySelectorAll('input[name="enrollClassType"]');
        let selectedClassType = "25 minutes";
        classTypeRadios.forEach(radio => {
            if (radio.checked) selectedClassType = radio.value;
        });

        // Determine schedule duration
        let durationMinutes = 25;
        if (selectedClassType.includes("45")) {
            durationMinutes = 45;
        }

        const selectedDays = Array.from(document.querySelectorAll('.day-btn.active')).map(b => b.textContent);
        const timeVal = document.getElementById('enroll-time').value || "19:00";
        
        // Calculate end time
        let endTimeStr = "";
        if (timeVal) {
            let [hours, minutes] = timeVal.split(':').map(Number);
            let date = new Date();
            date.setHours(hours, minutes, 0, 0);
            date.setMinutes(date.getMinutes() + durationMinutes);
            let endHours = String(date.getHours()).padStart(2, '0');
            let endMinutes = String(date.getMinutes()).padStart(2, '0');
            endTimeStr = `${timeVal} - ${endHours}:${endMinutes}`;
        } else {
            endTimeStr = "19:00 - 19:25";
        }

        const scheduleStr = selectedDays.length ? `${selectedDays.join(', ')} (${endTimeStr})` : `Mon, Wed, Fri (${endTimeStr})`;

        // Determine Registration Date
        const regDateVal = document.getElementById('enroll-reg-date').value;
        let formattedDate = "02/03/2026";
        if (regDateVal) {
            const [yyyy, mm, dd] = regDateVal.split('-');
            formattedDate = `${dd}/${mm}/${yyyy}`;
        }

        // Mock a new enrolled course based on "IELTS Intensive Speaking" or standard
        const newCourse = {
            id: 'ENG-IELTS-SPK',
            name: "IELTS Intensive Speaking",
            type: selectedClassType,
            schedule: scheduleStr,
            status: "In Progress", // newly registered
            regDate: formattedDate,
            level: "Advanced",
            age: "18+",
            objectives: "Certificate Exam Preparation",
            price: "485.000",
            levelsCount: 8,
            lessonsCount: 29,
            completedLessons: 0
        };

        // Add to array at the beginning
        this.mockEnrolledCourses.unshift(newCourse);
        
        // Re-render
        this.renderEnrolledCourses();

        // Close all modals
        this.closeEnrollConfirmModal();
        this.closeEnrollModal();
    }
};
