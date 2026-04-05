const teachingManagementLogic = {
    mockClasses: [
        {
            id: 't1', code: 'IELTS-PR_SPE-L2-C3-01(1)', sub: 'IELTS-PR_SPE-58',
            scheduleTime: '19:00 - 20:10', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Trần Văn Bình', in: false, code: 'STU139489', gender: 'Male', phone: '0345678912' },
            teacher: { name: 'Lê Thị Ánh', in: true, code: 'TEC02389', gender: 'Female', phone: '0947384724' },
            status: 'Late', statusClass: 'late', inTime: '18:58', outTime: '---', totalHours: '---'
        },
        {
            id: 't2', code: 'HSK-1_2-L2-C3-02', sub: 'HSK-1_2-102',
            scheduleTime: '19:00 - 20:10', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Vũ Thị Mẫn', in: true, code: 'STU111222', gender: 'Girl', phone: '0987654321' },
            teacher: { name: 'Trần Nguyệt', in: false, code: 'TEC02390', gender: 'Girl', phone: '0909090909' },
            status: 'Late', statusClass: 'late', inTime: '---', outTime: '---', totalHours: '---'
        },
        {
            id: 't3', code: 'TOEIC-LR900-L1-C1-01', sub: 'TOEIC-LR900-32',
            scheduleTime: '19:00 - 19:25', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Lê Văn An', in: true, code: 'STU139489', gender: 'Male', phone: '0345678912' },
            teacher: { name: 'Trần Thị B', in: true, code: 'TEC02389', gender: 'Female', phone: '0947384724' },
            status: 'In Progress', statusClass: 'inprogress', inTime: '18:58', outTime: '---', totalHours: '---'
        },
        {
            id: 't4', code: 'HSK-1_2-L4-C2-09', sub: 'HSK-1_2-158',
            scheduleTime: '20:30 - 20:55', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Ngô Văn Tuấn', in: false, code: 'STU145555', gender: 'Male', phone: '0888888888' },
            teacher: { name: 'Nguyễn Văn A', in: false, code: 'TEC01111', gender: 'Male', phone: '0999999999' },
            status: 'Upcoming', statusClass: 'upcoming', inTime: '---', outTime: '---', totalHours: '---'
        },
        {
            id: 't5', code: 'HSK-3-L2-C2-08(2)', sub: 'HSK-3-122',
            scheduleTime: '19:25 - 20:10', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Ngô Văn Tuấn', in: false, code: 'STU145555', gender: 'Male', phone: '0888888888' },
            teacher: { name: 'Nguyễn Văn A', in: false, code: 'TEC01111', gender: 'Male', phone: '0999999999' },
            status: 'Completed', statusClass: 'completed', inTime: '19:24', outTime: '20:10', totalHours: '46m 10s'
        },
        {
            id: 't6', code: 'HSK-3-L2-C2-08(2)', sub: 'HSK-3-122',
            scheduleTime: '19:25 - 20:10', scheduleDate: 'Mon, 02/03/2026',
            student: { name: 'Ngô Văn Tuấn', in: false, code: 'STU145555', gender: 'Male', phone: '0888888888' },
            teacher: { name: 'Nguyễn Văn A', in: false, code: 'TEC01111', gender: 'Male', phone: '0999999999' },
            status: 'Canceled', statusClass: 'canceled', inTime: '19:24', outTime: '19:40', totalHours: '16m 02s'
        }
    ],

    currentMode: 'today',
    currentStatus: 'All Statuses',

    setMode: function (mode) {
        this.currentMode = mode;
        const btnToday = document.getElementById('btn-today');
        const btnOptions = document.getElementById('btn-options');
        const datePicker = document.getElementById('options-date-picker');

        if (mode === 'today') {
            btnToday.classList.add('active');
            btnOptions.classList.remove('active');
            datePicker.style.display = 'none';
        } else {
            btnToday.classList.remove('active');
            btnOptions.classList.add('active');
            datePicker.style.display = 'flex';
        }
    },

    setStatus: function (statusValue) {
        this.currentStatus = statusValue;
        this.renderTable();
    },

    init: function () {
        this.renderTable();
        // Close popover when clicking anywhere outside (keep as fallback)
        document.addEventListener('click', (e) => {
            const popover = document.getElementById('tm-popover');
            if (popover && !popover.contains(e.target) && !e.target.closest('.tm-person-name')) {
                popover.style.display = 'none';
            }
        });
    },

    hidePopover: function () {
        const popover = document.getElementById('tm-popover');
        if (popover) popover.style.display = 'none';
    },

    renderTable: function () {
        const tbody = document.getElementById('tm-tbody');
        if (!tbody) return;
        tbody.innerHTML = '';

        let filtered = this.mockClasses.filter(c => {
            if (this.currentStatus === 'All Statuses') return true;
            return c.status === this.currentStatus;
        });

        filtered.forEach(c => {
            const tr = document.createElement('tr');

            // Render Student Cell
            let sInClass = c.student.in ? 'in' : 'out';
            let sInText = c.student.in ? 'In' : 'Not In';
            let sTextClass = c.student.in ? 'tm-status-in' : 'tm-status-not';

            // Render Teacher Cell
            let tInClass = c.teacher.in ? 'in' : 'out';
            let tInText = c.teacher.in ? 'In' : 'Not In';
            let tTextClass = c.teacher.in ? 'tm-status-in' : 'tm-status-not';

            if (c.status === 'Completed') {
                sInClass = 'out'; sInText = 'Out'; sTextClass = 'tm-status-not';
                tInClass = 'out'; tInText = 'Out'; tTextClass = 'tm-status-not';
            } else if (c.status === 'Canceled') {
                sInClass = 'out'; sInText = 'Not In'; sTextClass = 'tm-status-not';
                tInClass = 'out'; tInText = 'Out'; tTextClass = 'tm-status-not';
            }

            tr.innerHTML = `
                <td class="td-classes">
                    <div class="tm-td-class-code">${c.code}</div>
                    <div class="tm-td-class-sub">${c.sub}</div>
                </td>
                <td class="td-schedule">
                    <div class="tm-td-schedule-time">${c.scheduleTime}</div>
                    <div class="tm-td-schedule-date">${c.scheduleDate}</div>
                </td>
                <td>
                    <div class="tm-person-name" onmouseenter="teachingManagementLogic.showPopover(event, '${c.id}', 'student')" onmouseleave="teachingManagementLogic.hidePopover()">${c.student.name}</div>
                    <div class="tm-person-status"><div class="tm-dot ${sInClass}"></div><span class="${sTextClass}">${sInText}</span></div>
                </td>
                <td>
                    <div class="tm-person-name" onmouseenter="teachingManagementLogic.showPopover(event, '${c.id}', 'teacher')" onmouseleave="teachingManagementLogic.hidePopover()">${c.teacher.name}</div>
                    <div class="tm-person-status"><div class="tm-dot ${tInClass}"></div><span class="${tTextClass}">${tInText}</span></div>
                </td>
                <td>
                    <span class="tm-badge ${c.statusClass}">${c.status}</span>
                </td>
                <td style="font-weight:500;">${c.inTime}</td>
                <td style="font-weight:500;">${c.outTime}</td>
                <td style="font-weight:500;">${c.totalHours}</td>
                <td class="tm-td-action" style="padding: 40px 16px;">
                    ${(c.status === 'Completed' || c.status === 'Canceled')
                    ? `<a href="#" class="tm-action-enter" style="visibility: hidden;"><i class="fa-solid fa-arrow-right-to-bracket"></i></a>`
                    : `<a href="#" class="tm-action-enter" onclick="alert('Entering virtual class...')"><i class="fa-solid fa-arrow-right-to-bracket"></i></a>`}
                    <a href="teaching_class_detail.html?id=${c.id}" class="tm-action-view"><i class="fa-solid fa-eye"></i></a>
                </td>
            `;
            tbody.appendChild(tr);
        });
    },

    showPopover: function (event, classId, type) {
        event.stopPropagation();
        const c = this.mockClasses.find(x => x.id === classId);
        if (!c) return;

        const person = type === 'student' ? c.student : c.teacher;
        const popover = document.getElementById('tm-popover');

        // Populate data
        document.getElementById('pop-title').innerText = type === 'student' ? 'Student Information' : 'Teacher Information';
        document.getElementById('pop-name').innerText = person.name;
        document.getElementById('pop-code').innerText = person.code;
        document.getElementById('pop-phone').innerText = person.phone;

        const ava = document.getElementById('pop-ava');
        const initials = person.name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase();

        const genderBox = document.getElementById('pop-gender-box');

        // Avatars and colors
        if (type === 'student') {
            ava.innerHTML = initials;
            ava.classList.add('student-color');
            ava.style.background = '#10b981';
        } else {
            ava.innerHTML = '<img src="../assets/img/user_avatar.png">';
            ava.classList.remove('student-color');
            ava.style.background = 'none';
        }

        // Gender icons & text
        if (person.gender === 'Male') {
            genderBox.innerHTML = '<i class="fa-solid fa-mars"></i> Male';
            genderBox.className = 'tm-popover-icon-text boy';
        } else {
            genderBox.innerHTML = '<i class="fa-solid fa-venus"></i> Female';
            genderBox.className = 'tm-popover-icon-text girl';
        }

        // Position popover
        const rect = event.target.getBoundingClientRect();
        popover.style.display = 'block';
        popover.style.top = (rect.bottom + window.scrollY + 10) + 'px';
        popover.style.left = (rect.left + window.scrollX) + 'px';
    }
};
