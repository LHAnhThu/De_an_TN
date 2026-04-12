const teachingDetailLogic = {
    classData: {
        id: 'TOEIC-LR900-32',
        title: 'Lesson: TOEIC-LR900-L1-C1-01',
        courseName: 'TOEIC L&R Chinh Phục 900+',
        level: 'LEVEL 01: Advanced Listening',
        chapter: 'CHAPTER 1: Mastering Part 1 & 2',
        lesson: 'Lesson 1: Photo Traps & Paraphrase Recognition',
        date: 'Mon, 02/03/2026',
        time: '19:00 - 19:25',
        materials: [
            { name: 'Silde_TOEIC_LR900_L1_C1_01_25m.pdf', size: '38.2 MB', updated: 'Updated 2 days ago' },
            { name: 'Plan_TOEIC_LR900_L1_C1_01_25m.pdf', size: '38.2 MB', updated: 'Updated 2 days ago' },
            { name: 'Key_TOEIC_LR900_L1_C1_01_25m.pdf', size: '38.2 MB', updated: 'Updated 2 days ago' }
        ],
        teacher: { name: 'Trần Thị B', phone: '0947384724', gender: 'Female', inTime: '18:58' },
        student: { name: 'Lê Văn An', code: '0345678912', gender: 'Male', inTime: '18:54' }
    },

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const classId = urlParams.get('id') || 't3';

        // Fake determine progress based on ID
        let status = 'In Progress';
        if (classId === 't1' || classId === 't2') status = 'Late';
        else if (classId === 't4') status = 'Upcoming';
        else if (classId === 't5') status = 'Completed';
        else if (classId === 't6') status = 'Canceled';

        this.renderClassInfo(status);
        this.renderMaterials();
        this.renderMembers(status);
        this.renderCommentsAndRecord(status);
    },

    renderClassInfo: function(status) {
        document.getElementById('det-title').innerText = this.classData.title;  
        document.getElementById('det-id').innerText = 'ID: ' + this.classData.id;

        // Setup Badge
        const badgeEl = document.getElementById('det-badge');
        badgeEl.style.fontSize = '12px';
        badgeEl.style.padding = '6px 14px';

        if (status === 'Completed') {
            badgeEl.innerText = 'Completed';
            badgeEl.className = 'tm-badge completed';
        } else if (status === 'Canceled') {
            badgeEl.innerHTML = '<i class="fa-solid fa-xmark" style="margin-right: 4px;"></i> Canceled';
            badgeEl.className = 'tm-badge canceled';
        } else if (status === 'Late') {
            badgeEl.innerHTML = '<i class="fa-solid fa-triangle-exclamation" style="margin-right: 4px;"></i> Late';
            badgeEl.className = 'tm-badge late';
        } else if (status === 'Upcoming') {
            badgeEl.innerText = 'Upcoming';
            badgeEl.className = 'tm-badge upcoming';
        } else {
            badgeEl.innerText = 'In progress';
            badgeEl.className = 'tm-badge inprogress';
        }

        // Join Button
        const joinBtn = document.getElementById('det-join-btn');
        if (status === 'Completed' || status === 'Canceled') {
            joinBtn.style.display = 'none';
        } else {
            joinBtn.style.display = 'flex';
        }

        // Info Block
        document.getElementById('c-courseName').innerText = this.classData.courseName;
        document.getElementById('c-level').innerText = this.classData.level;    
        document.getElementById('c-chapter').innerText = this.classData.chapter;
        document.getElementById('c-lesson').innerText = this.classData.lesson;  

        document.getElementById('c-date').innerText = this.classData.date;      
        document.getElementById('c-time').innerText = this.classData.time;      
    },

    renderMaterials: function() {
        const matBox = document.getElementById('materials-list');
        if(!matBox) return;
        matBox.innerHTML = '';

        this.classData.materials.forEach(m => {
            matBox.innerHTML += `
                <div class="material-item">
                    <i class="fa-solid fa-file-pdf material-icon"></i>
                    <div class="material-info">
                        <div class="material-name">${m.name}</div>
                        <div class="material-sub">${m.size} &bull; ${m.updated}</div>
                    </div>
                    <i class="fa-solid fa-download material-download"></i>      
                </div>
            `;
        });
    },

    renderMembers: function(status) {
        // Teacher
        document.getElementById('m-teacher-name').innerText = this.classData.teacher.name;
        document.getElementById('m-teacher-sub').innerText = this.classData.teacher.phone;
        const tin = document.getElementById('m-teacher-in');
        if (status === 'Completed' || status === 'Canceled') {
            tin.innerHTML = '<div class="tm-dot out"></div><span class="tm-status-not">Out</span>';
        } else if (status === 'Upcoming' || status === 'Late') {
            tin.innerHTML = '<div class="tm-dot out"></div><span class="tm-status-not">Not In</span>';
        } else {
            tin.innerHTML = `<div class="tm-dot in"></div><span class="tm-status-in">In (${this.classData.teacher.inTime})</span>`;
        }
        document.getElementById('m-teacher-gender').innerHTML = '<i class="fa-solid fa-venus"></i> ' + this.classData.teacher.gender;

        // Student
        document.getElementById('m-student-name').innerText = this.classData.student.name;
        document.getElementById('m-student-sub').innerText = this.classData.student.code;
        const sin = document.getElementById('m-student-in');
        if (status === 'Completed') {
            sin.innerHTML = '<div class="tm-dot out"></div><span class="tm-status-not">Out</span>';
        } else if (status === 'Canceled' || status === 'Upcoming') {
            sin.innerHTML = '<div class="tm-dot out"></div><span class="tm-status-not">Not In</span>';
        } else {
            // Late, In Progress
            sin.innerHTML = `<div class="tm-dot in"></div><span class="tm-status-in">In (${this.classData.student.inTime})</span>`;
        }
        document.getElementById('m-student-gender').innerHTML = '<i class="fa-solid fa-mars"></i> ' + this.classData.student.gender;
    },

    renderCommentsAndRecord: function(status) {
        const commentBox = document.getElementById('comment-box');
        const videoWrapper = document.getElementById('video-wrapper');
        const reasonCard = document.getElementById('reason-card');
        const reasonBox = document.getElementById('reason-box');

        if (status === 'Canceled') {
            reasonCard.style.display = 'block';
            reasonBox.innerHTML = `
                <textarea readonly style="background:white; color:#94a3b8; font-family: inherit;">Cancelled by Center - Student No-show</textarea>
            `;
        } else {
            reasonCard.style.display = 'none';
        }

        if (status === 'In Progress' || status === 'Completed') {
            commentBox.innerHTML = `
                <textarea readonly style="background:white; color:#0f172a;">Học viên học nghiêm túc, trả bài nhanh nhẹn</textarea>
            `;
            videoWrapper.innerHTML = `
                <img style="opacity: 0.5; object-fit:fill ;" src="../assets/img/class_record.png" alt="Class Recording">
                <div style="position:absolute; background:rgba(0,0,0,0.5); color:white; width: 60px; height: 60px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:24px; cursor:pointer;"><i class="fa-solid fa-play"></i></div>
            `;
        } else {
            commentBox.innerHTML = `
                <textarea placeholder="View comments provided by the teacher" readonly></textarea>
            `;
            videoWrapper.innerHTML = `
                <div style="text-align:center; color:#94a3b8;">
                    <i class="fa-solid fa-video-slash" style="font-size:36px; margin-bottom:12px;"></i>
                    <p>Recording not available</p>
                </div>
            `;
        }
    }
};
