const courseDetailLogic = {
    courseId: null,
    courseData: null,
    editingLevelId: null,
    editingChapterId: null,
    editingLessonId: null,
    activeNodeId: null,
    statusFilter: 'All',
    currentAction: null,

    uuid: () => Math.random().toString(36).substr(2, 9),

    // Load course data from URL parameter or localStorage
    loadCourseData: function () {
        const urlParams = new URLSearchParams(window.location.search);
        const courseId = urlParams.get('id') || '1';

        // Mock data - in real application, fetch from API
        const course1Data = {
            id: '1',
            name: 'TOEIC L&R: Conquer 900+',
            code: 'ENG-TOEIC-LR900',
            language: 'English',
            level: 'Advanced',
            age: '18+',
            objectives: 'Certificate Exam Preparation',
            basePrice: 599000,
            discount: 12,
            status: 'Draft',
            lastUpdated: '28/02/2026',
            description: 'Khóa học tập trung vào việc luyện tập Listening và Reading chuyên sâu cho kỳ thi TOEIC. Chương trình bao gồm 120 bài học, 30 bài kiểm tra sát thực tế. Mục tiêu giúp học viên đạt từ 900+ chỉ số 3 tháng học tập trong học 1 với giáo viên.',
            image: '../assets/img/courses_img/course_1.png',
            fees: {
                '25 minutes': 0,
                '45 minutes': 250000,
                'Junior 25 minutes': 200000,
                'Junior 45 minutes': 450000
            },
            structure: [
                {
                    id: 'level-1',
                    type: 'level',
                    name: 'LEVEL 01: ADVANCED LISTENING',
                    chapters: [
                        {
                            id: 'chapter-1-1',
                            type: 'chapter',
                            name: 'Chapter 1: Mastering Part 1 & 2',
                            isExpanded: true,
                            lessons: [
                                {
                                    id: 'lesson-1-1-1',
                                    type: 'lesson',
                                    name: 'Lesson 1: Photo & Conversation',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: true, key: true },
                                        'Junior 25 minutes': {
                                            sessions: [
                                                { id: 'sess-1', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-2', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        },
                                        'Junior 45 minutes': {
                                            sessions: [
                                                { id: 'sess-3', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-4', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        }
                                    }
                                },
                                {
                                    id: 'lesson-1-1-2',
                                    type: 'lesson',
                                    name: 'Lesson 2: Question-Response',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: true, key: true },
                                        'Junior 25 minutes': {
                                            sessions: [
                                                { id: 'sess-5', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-6', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        },
                                        'Junior 45 minutes': {
                                            sessions: [
                                                { id: 'sess-7', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-8', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 'chapter-1-2',
                            type: 'chapter',
                            name: 'Chapter 2: Mastering Part 3',
                            isExpanded: false,
                            lessons: [
                                {
                                    id: 'lesson-1-2-1',
                                    type: 'lesson',
                                    name: 'Lesson 1: 2 Minutes Test',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: false, key: true },
                                        'Junior 25 minutes': {
                                            sessions: [
                                                { id: 'sess-9', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-10', name: 'Session 2: Practice', slides: false, plan: true, key: true }
                                            ]
                                        },
                                        'Junior 45 minutes': {
                                            sessions: [
                                                { id: 'sess-11', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-12', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        }
                                    }
                                }
                            ]
                        }
                    ],
                    isExpanded: true
                },
                {
                    id: 'level-2',
                    type: 'level',
                    name: 'LEVEL 02: STRATEGIC READING',
                    chapters: [
                        {
                            id: 'chapter-2-1',
                            type: 'chapter',
                            name: 'Chapter 1: Mastering Part 5',
                            isExpanded: false,
                            lessons: [
                                {
                                    id: 'lesson-2-1-1',
                                    type: 'lesson',
                                    name: 'Lesson 1: Grammar Focus',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: true, key: true },
                                        'Junior 25 minutes': {
                                            sessions: [
                                                { id: 'sess-13', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-14', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        },
                                        'Junior 45 minutes': {
                                            sessions: [
                                                { id: 'sess-15', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                { id: 'sess-16', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                            ]
                                        }
                                    }
                                }
                            ]
                        },
                        {
                            id: 'chapter-2-2',
                            type: 'chapter',
                            name: 'Chapter 2: Mastering Part 6 & 7',
                            isExpanded: false,
                            lessons: []
                        }
                    ],
                    isExpanded: false
                }
            ]
        };

        const mockCourses = {
            '1': course1Data,
            '2': {
                ...JSON.parse(JSON.stringify(course1Data)), // Deep copy structure
                id: '2',
                name: 'IELTS Grammar & Vocabulary',
                code: 'ENG-IELTS-GRAMVOCAB',
                level: 'Beginner',
                age: '12-17 years old',
                status: 'Active',
                image: '../assets/img/courses_img/course_2.png',
                description: 'Khóa học cung cấp nền tảng từ vựng và ngữ pháp vững chắc cho kỳ thi IELTS. Bao gồm 48 bài học và hàng trăm bài tập thực hành sát với bài thi thật.',
                structure: [
                    {
                        id: 'level-1',
                        type: 'level',
                        name: 'LEVEL 01: ADVANCED LISTENING',
                        chapters: [
                            {
                                id: 'chapter-1-1',
                                type: 'chapter',
                                name: 'Chapter 1: Mastering Part 1 & 2',
                                isExpanded: true,
                                lessons: [
                                    {
                                        id: 'lesson-1-1-1',
                                        type: 'lesson',
                                        name: 'Lesson 1: Photo & Conversation',
                                        materials: {
                                            '25 minutes': { slides: true, plan: true, key: true },
                                            '45 minutes': { slides: true, plan: true, key: true },
                                            'Junior 25 minutes': {
                                                sessions: [
                                                    { id: 'sess-1', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-2', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            },
                                            'Junior 45 minutes': {
                                                sessions: [
                                                    { id: 'sess-3', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-4', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            }
                                        }
                                    },
                                    {
                                        id: 'lesson-1-1-2',
                                        type: 'lesson',
                                        name: 'Lesson 2: Question-Response',
                                        materials: {
                                            '25 minutes': { slides: true, plan: true, key: true },
                                            '45 minutes': { slides: true, plan: true, key: true },
                                            'Junior 25 minutes': {
                                                sessions: [
                                                    { id: 'sess-5', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-6', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            },
                                            'Junior 45 minutes': {
                                                sessions: [
                                                    { id: 'sess-7', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-8', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                id: 'chapter-1-2',
                                type: 'chapter',
                                name: 'Chapter 2: Mastering Part 3',
                                isExpanded: false,
                                lessons: [
                                    {
                                        id: 'lesson-1-2-1',
                                        type: 'lesson',
                                        name: 'Lesson 1: 2 Minutes Test',
                                        materials: {
                                            '25 minutes': { slides: true, plan: true, key: true },
                                            '45 minutes': { slides: true, plan: true, key: true },
                                            'Junior 25 minutes': {
                                                sessions: [
                                                    { id: 'sess-9', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-10', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            },
                                            'Junior 45 minutes': {
                                                sessions: [
                                                    { id: 'sess-11', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-12', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            }
                        ],
                        isExpanded: true
                    },
                    {
                        id: 'level-2',
                        type: 'level',
                        name: 'LEVEL 02: STRATEGIC READING',
                        chapters: [
                            {
                                id: 'chapter-2-1',
                                type: 'chapter',
                                name: 'Chapter 1: Mastering Part 5',
                                isExpanded: false,
                                lessons: [
                                    {
                                        id: 'lesson-2-1-1',
                                        type: 'lesson',
                                        name: 'Lesson 1: Grammar Focus',
                                        materials: {
                                            '25 minutes': { slides: true, plan: true, key: true },
                                            '45 minutes': { slides: true, plan: true, key: true },
                                            'Junior 25 minutes': {
                                                sessions: [
                                                    { id: 'sess-13', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-14', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            },
                                            'Junior 45 minutes': {
                                                sessions: [
                                                    { id: 'sess-15', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                                    { id: 'sess-16', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                                ]
                                            }
                                        }
                                    }
                                ]
                            },
                            {
                                id: 'chapter-2-2',
                                type: 'chapter',
                                name: 'Chapter 2: Mastering Part 6 & 7',
                                isExpanded: false,
                                lessons: []
                            }
                        ],
                        isExpanded: false
                    }
                ]
            }
        };

        // Use course from URL or fallback to ID 1
        this.courseData = mockCourses[courseId] || mockCourses['1'];
        return this.courseData;
    },

    // Load course information into form
    loadCourseInfo: function () {
        if (!this.courseData) return;

        const course = this.courseData;

        // Fill form fields
        document.getElementById('course-name').value = course.name;
        document.getElementById('course-code').value = course.code;
        document.getElementById('course-language').value = course.language;
        document.getElementById('course-level').value = course.level;
        document.getElementById('course-age').value = course.age;
        document.getElementById('course-objectives').value = course.objectives;
        document.getElementById('course-status').value = course.status;
        document.getElementById('course-updated').value = course.lastUpdated;
        document.getElementById('course-description').value = course.description;
        document.getElementById('course-title-display').textContent = course.name;
        document.getElementById('header-course-name').textContent = course.name;

        // Format and fill prices
        document.getElementById('base-price').value = this.formatNumber(course.basePrice.toString());
        document.getElementById('discount').value = course.discount;

        // Fill class type fees
        document.getElementById('fee-25min').value = this.formatNumber(course.fees['25 minutes'].toString());
        document.getElementById('fee-45min').value = this.formatNumber(course.fees['45 minutes'].toString());
        document.getElementById('fee-junior-25min').value = this.formatNumber(course.fees['Junior 25 minutes'].toString());
        document.getElementById('fee-junior-45min').value = this.formatNumber(course.fees['Junior 45 minutes'].toString());

        // Calculate and display totals
        this.calculateTotalAmounts();

        // Display course image
        const imgZone = document.getElementById('course-image-zone');
        if (imgZone) {
            if (course.image) {
                imgZone.style.background = '';
                imgZone.style.borderColor = '';
                imgZone.innerHTML = `
                    <div class="dropzone-image">
                        <img id="course-image-display" src="${course.image}" alt="Course Image">
                        <div class="delete-image-btn" id="remove-image-icon" onclick="courseDetailLogic.removeImage(event)" style="display: none;">
                            <i class="fa-solid fa-xmark"></i>
                        </div>
                    </div>
                `;
            } else {
                imgZone.style.borderColor = '';
                imgZone.style.background = '';
                imgZone.style.padding = '20px';
                imgZone.innerHTML = `
                    <i class="fa-solid fa-cloud-arrow-up dropzone-icon" id="drop-icon" style="color: #cbd5e1;"></i>
                    <div class="dropzone-text" id="drop-text" style="color: #64748b;">Drag & Drop or Click to Select File</div>
                `;
            }
        }

        // Setup action button based on status
        this.setupActionButton();
    },

    // Setup Publish/Lock button based on status
    setupActionButton: function () {
        const actionContainer = document.querySelector('.action-buttons');
        if (!actionContainer || !this.courseData) return;

        const status = this.courseData.status;

        if (status === 'Draft') {
            actionContainer.innerHTML = `
                <button class="btn btn-outline" style="border-radius: 6px; padding: 6px 16px; font-size: 13px; font-weight: 500; border-color: #cbd5e1; color: #4e60ff;" onclick="courseDetailLogic.saveDraft()"><i class="fa-solid fa-floppy-disk"></i> Save Draft</button>
                <button class="btn btn-primary" id="btn-action-main" style="border-radius: 6px; padding: 6px 16px; font-size: 13px;" onclick="courseDetailLogic.publishCourse()"><i class="fa-solid fa-arrow-up-from-bracket"></i> Publish</button>
            `;

            const addLevelBtn = document.getElementById('btn-add-level-detail');
            if (addLevelBtn) {
                addLevelBtn.disabled = false;
                addLevelBtn.style.opacity = '1';
                addLevelBtn.style.cursor = 'pointer';
                addLevelBtn.onclick = () => courseDetailLogic.addNode('root', 'level');
            }

        } else if (status === 'Active') {
            actionContainer.innerHTML = `
                <button class="btn btn-danger" id="btn-action-main" style="border-radius: 6px; padding: 6px 16px; font-size: 14px; font-weight: 500; background: #FFD1D1; color: #FF0000; border: none;" onclick="courseDetailLogic.lockCourse()"><i class="fa-solid fa-lock"></i> Lock</button>
            `;

            const addLevelBtn = document.getElementById('btn-add-level-detail');
            if (addLevelBtn) {
                addLevelBtn.disabled = true;
                addLevelBtn.style.opacity = '0.5';
                addLevelBtn.style.cursor = 'not-allowed';
                addLevelBtn.onclick = null;
            }
        } else if (status === 'Locked') {
            actionContainer.innerHTML = `
                <button class="btn" disabled style="border-radius: 6px; padding: 6px 16px; font-size: 13px; font-weight: 500; background: #f1f5f9; color: #94a3b8; border: 1px solid #e2e8f0; cursor: not-allowed;"><i class="fa-solid fa-lock"></i> Locked</button>
            `;

            const addLevelBtn = document.getElementById('btn-add-level-detail');
            if (addLevelBtn) {
                addLevelBtn.disabled = true;
                addLevelBtn.style.opacity = '0.5';
                addLevelBtn.style.cursor = 'not-allowed';
            }
        }
    },

    // Publish course
    publishCourse: function () {
        if (!this.courseData) return;

        let allValid = true;
        let totalLessonCount = 0;
        const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

        this.courseData.structure.forEach(l => {
            l.chapters.forEach(c => {
                c.lessons.forEach(les => {
                    totalLessonCount++;
                    let isLessonComplete = true;
                    CLASS_TYPES.forEach(ct => {
                        let isJunior = ct.includes('Junior');
                        let m = les.materials[ct];
                        
                        if (isJunior) {
                            if (!m.sessions || m.sessions.length === 0) {
                                isLessonComplete = false;
                            } else {
                                m.sessions.forEach(s => {
                                    if(!s.slides || !s.plan || !s.key) {
                                        isLessonComplete = false;
                                    }
                                });
                            }
                        } else {
                            if(!m.slides || !m.plan || !m.key) {
                                isLessonComplete = false;
                            }
                        }
                    });
                    if (!isLessonComplete) {
                        allValid = false;
                    }
                });
            });
        });

        if (totalLessonCount === 0) allValid = false;

        if (!allValid) {
            document.getElementById('custom-alert-modal').style.display = 'flex';
        } else {
            this.currentAction = 'publish';
            document.getElementById('custom-confirm-text').innerHTML = 'Are you sure you want to <strong>publish</strong> this course? It will be available for students to enroll.';
            document.getElementById('custom-confirm-modal').style.display = 'flex';
        }
    },

    // Save Draft
    saveDraft: function () {
        if (!this.courseData) return;
        this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
        document.getElementById('course-updated').value = this.courseData.lastUpdated;
        alert('Draft saved successfully!');
        window.location.href = 'courses_list.html';
    },

    // Lock course
    lockCourse: function () {
        if (!this.courseData) return;
        this.courseData.status = 'Locked';
        this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
        document.getElementById('course-status').value = 'Locked';
        document.getElementById('course-updated').value = this.courseData.lastUpdated;
        this.setupActionButton();
        alert('Course locked successfully!');
    },

    handleConfirmResult: function(confirmed) {
        document.getElementById('custom-confirm-modal').style.display = 'none';
        if (confirmed) {
            if (this.currentAction === 'publish') {
                this.courseData.status = 'Active';
                this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
                document.getElementById('course-status').value = 'Active';
                document.getElementById('course-updated').value = this.courseData.lastUpdated;
                this.setupActionButton();
                this.renderTree();
                if (typeof renderClassTable === 'function') renderClassTable();
                alert('Course published successfully!');
                window.location.href = 'courses_list.html';
            } else if (this.currentAction === 'lock') {
                this.courseData.status = 'Locked';
                this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
                document.getElementById('course-status').value = 'Locked';
                document.getElementById('course-updated').value = this.courseData.lastUpdated;
                this.setupActionButton();
                alert('Course locked successfully!');
            }
        }
    },

    addNode: function (parentId, type) {
        let name = '';
        if (type === 'level') {
            let newNode = { id: this.uuid(), type: type, name: name, chapters: [], isExpanded: true };
            this.courseData.structure.push(newNode);
            this.editingLevelId = newNode.id;
        } else if (type === 'chapter') {
            let newNode = { id: this.uuid(), type: type, name: name, lessons: [], isExpanded: true };
            let level = this.courseData.structure.find(l => l.id === parentId);
            if (level) level.chapters.push(newNode);
            this.editingChapterId = newNode.id;
        } else if (type === 'lesson') {
            let newNode = { id: this.uuid(), type: type, name: name };
            newNode.materials = {};
            const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];
            CLASS_TYPES.forEach(ct => {
                if (ct.includes('Junior')) {
                    newNode.materials[ct] = {
                        sessions: [
                            { id: this.uuid(), name: 'Session 1: Introduction', slides: false, plan: false, key: false },
                            { id: this.uuid(), name: 'Session 2: Practice', slides: false, plan: false, key: false }
                        ]
                    };
                } else {
                    newNode.materials[ct] = { slides: false, plan: false, key: false };
                }
            });
            this.courseData.structure.forEach(l => {
                l.chapters.forEach(c => {
                    if (c.id === parentId) c.lessons.push(newNode);
                });
            });
            this.editingLessonId = newNode.id;
        }
        this.renderTree();
        this.renderOverviewTable();
        // Update badge only when a lesson is added
        if (type === 'lesson') {
            const badge = document.getElementById('classes-badge');
            if (badge) {
                badge.innerText = parseInt(badge.innerText || 0) + 1;
                badge.style.display = 'inline-block';
            }
        }
    },

    applyTemplate: function(id, data = {}) {
        let tmpl = document.getElementById(id);
        if(!tmpl) return '';
        let html = tmpl.innerHTML;
        for (let k in data) html = html.split(`{{${k}}}`).join(data[k]);
        return html;
    },

    // Render course tree structure
    renderTree: function () {
        const container = document.getElementById('structure-tree-container');
        if (!container || !this.courseData) return;
        container.innerHTML = '';

        const isDraft = (this.courseData.status === 'Draft');

        if (this.courseData.structure.length === 0) {
            container.innerHTML = this.applyTemplate('tpl-tree-empty');
            return;
        }

        let out = '';
        this.courseData.structure.forEach(level => {
            out += `<div class="tree-node">`;
            if (this.editingLevelId === level.id && isDraft) {
                out += this.applyTemplate('tpl-tree-level-editing', {id: level.id});
            } else {
                let addBtnHtml = isDraft ? `<button class="tree-btn-add" onclick="courseDetailLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>` : '';
                out += this.applyTemplate('tpl-tree-level', {
                    id: level.id, 
                    name: level.name, 
                    activeClass: this.activeNodeId === level.id ? 'selected' : '',
                    addBtnHtml: addBtnHtml
                });
            }

            out += `<div class="tree-children">`;
            level.chapters.forEach(chapter => {
                out += `<div class="tree-node">`;
                if (this.editingChapterId === chapter.id && isDraft) {
                    out += this.applyTemplate('tpl-tree-chapter-editing', {id: chapter.id, levelId: level.id});
                } else {
                    let addBtnHtml = isDraft ? `<button class="tree-btn-add" onclick="courseDetailLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>` : '';
                    out += this.applyTemplate('tpl-tree-chapter', {
                        id: chapter.id, 
                        name: chapter.name, 
                        activeClass: this.activeNodeId === chapter.id ? 'selected' : '',
                        addBtnHtml: addBtnHtml
                    });
                }

                out += `<div class="tree-children">`;
                chapter.lessons.forEach(lesson => {
                    if (this.editingLessonId === lesson.id && isDraft) {
                        out += this.applyTemplate('tpl-tree-lesson-editing', {id: lesson.id, chapterId: chapter.id});
                    } else {
                        out += this.applyTemplate('tpl-tree-lesson', {
                            id: lesson.id, 
                            name: lesson.name, 
                            activeClass: this.activeNodeId === lesson.id ? 'selected' : ''
                        });
                    }
                });
                out += `</div></div>`;
            });
            out += `</div></div>`;
        });
        container.innerHTML = out;
    },

    // Select node in tree
    selectNode: function (id, type, event) {
        if (event) event.stopPropagation();
        this.activeNodeId = id;
        this.renderTree();

        if (type === 'lesson') {
            this.navigateToLesson(id);
        }
    },

    navigateToLesson: function (lessonId) {
        if (this.courseData) {
            if (this.courseData.structure) {
                localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData.structure));
            }
            localStorage.setItem('lessonDetailSource', window.location.href);
            localStorage.setItem('currentCourseCode', this.courseData.code || 'ENG-TOEIC-LR900');
            localStorage.setItem('currentCourseName', this.courseData.title || 'TOEIC L&R: Conquer 900+');
        }
        window.location.href = `lesson_detail.html?lessonId=${lessonId}`;
    },

    // Render overview table with lessons
    renderOverviewTable: function () {
        let container = document.getElementById('overview-tabs-container');
        let tableContainer = document.getElementById('overview-table-container');
        if (!container || !tableContainer || !this.courseData) return;

        const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];
        let activeTab = window.activeClassTab || CLASS_TYPES[0];
        let isEmpty = this.courseData.structure.length === 0;
        let statusFilter = this.statusFilter || 'All';
        const statusSelectEl = document.getElementById('overview-status-filter');
        if (statusSelectEl) statusSelectEl.value = statusFilter;

        const isLessonComplete = (les, classType) => {
            const material = les.materials[classType];
            if (!material) return false;
            if (classType.includes('Junior')) {
                return material.sessions && material.sessions.length > 0 && material.sessions.every(s => s.slides && s.plan && s.key);
            }
            return material.slides && material.plan && material.key;
        };

        const matchesFilter = (les, classType) => {
            if (statusFilter === 'All') return true;
            const completed = isLessonComplete(les, classType);
            if (statusFilter === 'Complete') return completed;
            if (statusFilter === 'Incomplete') return !completed;
            return true;
        };

        // Calculate incomplete lesson counts for each class type
        let incompleteCounts = {};
        CLASS_TYPES.forEach(ct => {
            incompleteCounts[ct] = 0;
            let isJunior = ct.includes('Junior');
            this.courseData.structure.forEach(level => {
                level.chapters.forEach(chap => {
                    chap.lessons.forEach(les => {
                        let m = les.materials[ct];
                        let incomplete = false;
                        if (isJunior) {
                            if (m.sessions && m.sessions.some(s => !s.slides || !s.plan || !s.key)) incomplete = true;
                        } else {
                            if (!m.slides || !m.plan || !m.key) incomplete = true;
                        }
                        if (incomplete) incompleteCounts[ct]++;
                    });
                });
            });
        });

        container.innerHTML = CLASS_TYPES.map(ct => `<button class="ctab-btn ${activeTab === ct ? 'active' : ''}" onclick="window.activeClassTab='${ct}'; courseDetailLogic.renderOverviewTable();">${ct} (${incompleteCounts[ct]})</button>`).join('');

        let isJunior = activeTab.includes('Junior');

        let html = '';

        function capitalizeWords(str) {
            return str.replace(/\b\w/g, c => c.toUpperCase());
        }

        if (isEmpty) {
            html += this.applyTemplate('tpl-overview-empty');
        } else {
            this.courseData.structure.forEach((level, lIndex) => {
                html += this.applyTemplate('tpl-overview-level', {
                    id: level.id, 
                    caret: level.isExpanded ? 'down' : 'right', 
                    name: level.name.toUpperCase()
                });

                if (level.isExpanded) {
                    level.chapters.forEach((chap, cIndex) => {
                        html += this.applyTemplate('tpl-overview-chapter', {
                            id: chap.id,
                            name: capitalizeWords(chap.name),
                            cursorStyleAttr: chap.lessons.length > 0 ? 'style="cursor: pointer;"' : "",
                            toggleAction: chap.lessons.length > 0 ? `courseDetailLogic.toggleChapterExpand('${chap.id}')` : "",
                            caretHtml: chap.lessons.length > 0 ? `<i class="fa-solid fa-caret-${chap.isExpanded ? 'down' : 'right'}" style="position: absolute; right: 10px; color:#0f172a;"></i>` : ''
                        });

                        if (chap.isExpanded) {
                            chap.lessons.forEach((les, lesIndex) => {
                                if (!matchesFilter(les, activeTab)) return;

                                let m = les.materials[activeTab];

                                let baseCode = (this.courseData.code || '').replace(/^ENG-/, '');
                                let strL = 'L' + (lIndex + 1);
                                let strC = 'C' + (cIndex + 1);
                                let strLes = String(lesIndex + 1).padStart(2, '0');
                                let lessonIdStr = `${baseCode}-${strL}-${strC}-${strLes}`;

                                if (isJunior) {
                                    html += this.applyTemplate('tpl-overview-lesson-junior-head', {
                                        id: les.id,
                                        name: capitalizeWords(les.name)
                                    });

                                    if (m.sessions && m.sessions.length > 0) {
                                        m.sessions.forEach((s, sidx) => {
                                            let iconS = s.slides ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconP = s.plan ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconK = s.key ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;

                                            let sessionDisplayId = `${lessonIdStr} (${sidx + 1})`;
                                            html += this.applyTemplate('tpl-overview-lesson-junior-session', {
                                                id: les.id,
                                                sName: s.name,
                                                displayId: sessionDisplayId,
                                                iconS: iconS, iconP: iconP, iconK: iconK
                                            });
                                        });
                                    } else {
                                        html += this.applyTemplate('tpl-overview-lesson-junior-empty');
                                    }

                                } else {
                                    let iconS = m.slides ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                    let iconP = m.plan ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                    let iconK = m.key ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;

                                    html += this.applyTemplate('tpl-overview-lesson-standard', {
                                        id: les.id,
                                        name: capitalizeWords(les.name),
                                        displayId: lessonIdStr,
                                        iconS: iconS, iconP: iconP, iconK: iconK
                                    });
                                }
                            });
                        }
                    });
                }
            });
        }

        if(tableContainer) {
            let tbody = tableContainer.querySelector('#overview-table-body');
            if(tbody) tbody.innerHTML = html;
        }
    },

    toggleExpand: function (id) {
        if (!this.courseData) return;
        const level = this.courseData.structure.find(l => l.id === id);
        if (level) {
            level.isExpanded = !level.isExpanded;
            this.renderOverviewTable();
        }
    },

    toggleChapterExpand: function (id) {
        if (!this.courseData) return;
        this.courseData.structure.forEach(level => {
            level.chapters.forEach(chap => {
                if (chap.id === id) {
                    chap.isExpanded = !chap.isExpanded;
                    this.renderOverviewTable();
                }
            });
        });
    },

    setStatusFilter: function (value) {
        this.statusFilter = value;
        this.renderOverviewTable();
    },

    formatNumber: function (value) {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    parseFormattedNumber: function (value) {
        return parseFloat(value.replace(/\./g, '')) || 0;
    },

    calculateTotalAmounts: function () {
        const basePrice = this.parseFormattedNumber(document.getElementById('base-price').value);
        const discount = parseFloat(document.getElementById('discount').value) || 0;
        const discountedPrice = basePrice * (1 - discount / 100);

        const fees = [
            { id: 'fee-25min', totalId: 'total-25min' },
            { id: 'fee-45min', totalId: 'total-45min' },
            { id: 'fee-junior-25min', totalId: 'total-junior-25min' },
            { id: 'fee-junior-45min', totalId: 'total-junior-45min' }
        ];

        fees.forEach(fee => {
            const additionalFee = this.parseFormattedNumber(document.getElementById(fee.id).value);
            const total = discountedPrice + additionalFee;
            document.getElementById(fee.totalId).textContent = this.formatNumber(total.toString());
        });
    },

    toggleEditInfo: function (isEditing) {
        const inputFields = ['course-name', 'course-code', 'base-price', 'discount', 'course-description'];
        const selectFields = ['course-language', 'course-level', 'course-age', 'course-objectives'];

        inputFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('readonly');
                    el.classList.remove('disabled');
                    el.style.borderColor = '#93c5fd';
                } else {
                    el.setAttribute('readonly', true);
                    el.classList.add('disabled');
                    el.style.borderColor = '';
                }
            }
        });

        selectFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('disabled');
                    el.classList.remove('disabled');
                    el.style.borderColor = '#93c5fd';
                } else {
                    el.setAttribute('disabled', true);
                    el.classList.add('disabled');
                    el.style.borderColor = '';
                }
            }
        });

        const imgZone = document.getElementById('course-image-zone');
        if (imgZone) {
            imgZone.style.cursor = isEditing ? 'pointer' : 'default';
            if (isEditing) {
                imgZone.onclick = (e) => this.mockUploadImage(e);
            } else {
                imgZone.onclick = null;
            }
        }
        
        const removeIcon = document.getElementById('remove-image-icon');
        if (removeIcon) {
            removeIcon.style.display = isEditing ? 'flex' : 'none';
        }

        const editBtn = document.getElementById('btn-edit-info');
        const saveBtn = document.getElementById('btn-save-info');
        const cancelBtn = document.getElementById('btn-cancel-info');

        if (editBtn) editBtn.style.display = isEditing ? 'none' : 'flex';
        if (saveBtn) saveBtn.style.display = isEditing ? 'flex' : 'none';
        if (cancelBtn) cancelBtn.style.display = isEditing ? 'flex' : 'none';

        if (!isEditing) {
            this.loadCourseInfo();
        }
    },

    saveInfo: function () {
        if (!this.courseData) return;

        this.courseData.name = document.getElementById('course-name').value;
        this.courseData.code = document.getElementById('course-code').value;
        this.courseData.language = document.getElementById('course-language').value;
        this.courseData.level = document.getElementById('course-level').value;
        this.courseData.age = document.getElementById('course-age').value;
        this.courseData.objectives = document.getElementById('course-objectives').value;
        this.courseData.basePrice = this.parseFormattedNumber(document.getElementById('base-price').value);
        this.courseData.discount = parseFloat(document.getElementById('discount').value) || 0;
        this.courseData.description = document.getElementById('course-description').value;

        const titleDisplay = document.getElementById('course-title-display');
        const headerName = document.getElementById('header-course-name');
        if (titleDisplay) titleDisplay.textContent = this.courseData.name;
        if (headerName) headerName.textContent = this.courseData.name;

        this.calculateTotalAmounts();

        alert('Course information saved successfully!');
        this.toggleEditInfo(false);
    },

    toggleEditPrice: function (isEditing) {
        const fields = ['fee-25min', 'fee-45min', 'fee-junior-25min', 'fee-junior-45min'];

        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('readonly');
                    el.classList.remove('disabled');
                    el.style.borderColor = '#93c5fd';
                } else {
                    el.setAttribute('readonly', true);
                    el.classList.add('disabled');
                    el.style.borderColor = '';
                }
            }
        });

        const editBtn = document.getElementById('btn-edit-price');
        const saveBtn = document.getElementById('btn-save-price');
        const cancelBtn = document.getElementById('btn-cancel-price');

        if (editBtn) editBtn.style.display = isEditing ? 'none' : 'flex';
        if (saveBtn) saveBtn.style.display = isEditing ? 'flex' : 'none';
        if (cancelBtn) cancelBtn.style.display = isEditing ? 'flex' : 'none';

        if (!isEditing) {
            this.loadCourseInfo();
        }
    },

    savePrice: function () {
        if (!this.courseData) return;

        this.courseData.fees['25 minutes'] = this.parseFormattedNumber(document.getElementById('fee-25min').value);
        this.courseData.fees['45 minutes'] = this.parseFormattedNumber(document.getElementById('fee-45min').value);
        this.courseData.fees['Junior 25 minutes'] = this.parseFormattedNumber(document.getElementById('fee-junior-25min').value);
        this.courseData.fees['Junior 45 minutes'] = this.parseFormattedNumber(document.getElementById('fee-junior-45min').value);

        this.calculateTotalAmounts();

        alert('Course prices saved successfully!');
        this.toggleEditPrice(false);
    },

    removeImage: function (e) {
        if(e) e.stopPropagation();
        if (!this.courseData) return;

        // Clear the image
        this.courseData.image = '';
        
        const zone = document.getElementById('course-image-zone');
        if(zone) {
            zone.style.borderColor = '';
            zone.style.background = '';
            zone.style.padding = '';
            zone.innerHTML = `
                <i class="fa-solid fa-cloud-arrow-up dropzone-icon" id="drop-icon" style="color: #cbd5e1;"></i>
                <div class="dropzone-text" id="drop-text" style="color: #64748b;">Drag & Drop or Click to Select File</div>
            `;
        }
    },

    mockUploadImage: function (e) {
        if(e && e.target.closest('.delete-image-btn')) return;
        if (!this.courseData) return;

        // Mock image upload - in real app, this would open file picker
        const newImageUrl = '../assets/img/courses_img/course_2.png'; // Example new image
        this.courseData.image = newImageUrl;
        
        const zone = document.getElementById('course-image-zone');
        if(zone) {
            zone.style.background = 'transparent';
            zone.style.borderColor = '';
            zone.innerHTML = `
                <div class="dropzone-image">
                    <img id="course-image-display" src="${newImageUrl}" alt="Course Image">
                    <div class="delete-image-btn" id="remove-image-icon" onclick="courseDetailLogic.removeImage(event)" style="display: flex;">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            `;
            const errEl = document.getElementById('err-image');
            if(errEl) errEl.style.display = 'none';
        }
    },

    init: function () {
        // Load course data
        this.loadCourseData();

        // Load course information
        this.loadCourseInfo();

        // Set initial edit state (view mode)
        this.toggleEditInfo(false);
        this.toggleEditPrice(false);

        // Setup class tab
        window.activeClassTab = '25 minutes';

        // Render views
        this.renderTree();
        this.renderOverviewTable();

        // Bind status filter
        const statusFilterElem = document.getElementById('overview-status-filter');
        if (statusFilterElem) {
            statusFilterElem.addEventListener('change', function () {
                courseDetailLogic.setStatusFilter(this.value);
            });
        }

        // Live calculation bindings
        const priceInputs = ['base-price', 'fee-25min', 'fee-45min', 'fee-junior-25min', 'fee-junior-45min'];
        priceInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function () {
                    let val = this.value.replace(/\D/g, '');
                    if (val) this.value = courseDetailLogic.formatNumber(val);
                    else this.value = '0';
                    courseDetailLogic.calculateTotalAmounts();
                });
            }
        });

        const discountElem = document.getElementById('discount');
        if (discountElem) {
            discountElem.addEventListener('input', function () {
                courseDetailLogic.calculateTotalAmounts();
            });
        }

        // Update badge count
        const badge = document.getElementById('classes-badge');
        if (badge && this.courseData) {
            let incompleteLessonCount = 0;
            const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

            this.courseData.structure.forEach(level => {
                level.chapters.forEach(chap => {
                    chap.lessons.forEach(les => {
                        let isLessonComplete = true;
                        CLASS_TYPES.forEach(ct => {
                            let isJunior = ct.includes('Junior');
                            let m = les.materials[ct];
                            if (isJunior) {
                                if (!m.sessions || m.sessions.length === 0) {
                                    isLessonComplete = false;
                                } else {
                                    m.sessions.forEach(s => {
                                        if (!s.slides || !s.plan || !s.key) isLessonComplete = false;
                                    });
                                }
                            } else {
                                if (!m.slides || !m.plan || !m.key) isLessonComplete = false;
                            }
                        });
                        if (!isLessonComplete) {
                            incompleteLessonCount++;
                        }
                    });
                });
            });

            if (incompleteLessonCount > 0) {
                badge.style.display = 'inline-block';
                badge.textContent = incompleteLessonCount;
            } else {
                badge.style.display = 'none';
            }
        }
    }
};

// Inline Editing Handlers for courseDetailLogic
courseDetailLogic.handleEditLevelKey = function (e, levelId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setLevelName(levelId, name);
        else courseDetailLogic.removeLevel(levelId);
    } else if (e.key === 'Escape') courseDetailLogic.removeLevel(levelId);
};
courseDetailLogic.handleEditLevelBlur = function (levelId) {
    const input = document.getElementById(`edit-level-input-${levelId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setLevelName(levelId, name);
        else courseDetailLogic.removeLevel(levelId);
    }
};
courseDetailLogic.setLevelName = function (levelId, name) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) level.name = name;
    courseDetailLogic.editingLevelId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
courseDetailLogic.removeLevel = function (levelId) {
    courseDetailLogic.courseData.structure = courseDetailLogic.courseData.structure.filter(l => l.id !== levelId);
    courseDetailLogic.editingLevelId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};

courseDetailLogic.handleEditChapterKey = function (e, levelId, chapterId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setChapterName(levelId, chapterId, name);
        else courseDetailLogic.removeChapter(levelId, chapterId);
    } else if (e.key === 'Escape') courseDetailLogic.removeChapter(levelId, chapterId);
};
courseDetailLogic.handleEditChapterBlur = function (levelId, chapterId) {
    const input = document.getElementById(`edit-chapter-input-${chapterId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setChapterName(levelId, chapterId, name);
        else courseDetailLogic.removeChapter(levelId, chapterId);
    }
};
courseDetailLogic.setChapterName = function (levelId, chapterId, name) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) {
        const chapter = level.chapters.find(c => c.id === chapterId);
        if (chapter) chapter.name = name;
    }
    courseDetailLogic.editingChapterId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
courseDetailLogic.removeChapter = function (levelId, chapterId) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) level.chapters = level.chapters.filter(c => c.id !== chapterId);
    courseDetailLogic.editingChapterId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};

courseDetailLogic.handleEditLessonKey = function (e, chapterId, lessonId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setLessonName(chapterId, lessonId, name);
        else courseDetailLogic.removeLesson(chapterId, lessonId);
    } else if (e.key === 'Escape') courseDetailLogic.removeLesson(chapterId, lessonId);
};
courseDetailLogic.handleEditLessonBlur = function (chapterId, lessonId) {
    const input = document.getElementById(`edit-lesson-input-${lessonId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setLessonName(chapterId, lessonId, name);
        else courseDetailLogic.removeLesson(chapterId, lessonId);
    }
};
courseDetailLogic.setLessonName = function (chapterId, lessonId, name) {
    courseDetailLogic.courseData.structure.forEach(level => {
        level.chapters.forEach(chap => {
            if (chap.id === chapterId) {
                const lesson = chap.lessons.find(l => l.id === lessonId);
                if (lesson) lesson.name = name;
            }
        });
    });
    courseDetailLogic.editingLessonId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
courseDetailLogic.removeLesson = function (chapterId, lessonId) {
    courseDetailLogic.courseData.structure.forEach(level => {
        level.chapters.forEach(chap => {
            if (chap.id === chapterId) {
                chap.lessons = chap.lessons.filter(l => l.id !== lessonId);
            }
        });
    });
    courseDetailLogic.editingLessonId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
