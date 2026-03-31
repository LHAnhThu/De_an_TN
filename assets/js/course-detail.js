const courseDetailLogic = {
    courseData: null,
    editingLevelId: null,
    editingChapterId: null,
    editingLessonId: null,
    activeNodeId: null,
    statusFilter: 'All',

    uuid: () => Math.random().toString(36).substr(2, 9),

    // Load course data from URL parameter or localStorage
    loadCourseData: function() {
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-1', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-2', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-3', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-4', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
                                    }
                                },
                                {
                                    id: 'lesson-1-1-2',
                                    type: 'lesson',
                                    name: 'Lesson 2: Question-Response',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: true, key: true },
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-5', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-6', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-7', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-8', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-9', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-10', name: 'Session 2: Practice', slides: false, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-11', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-12', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-13', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-14', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-15', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-16', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-1', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-2', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-3', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-4', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
                                    }
                                },
                                {
                                    id: 'lesson-1-1-2',
                                    type: 'lesson',
                                    name: 'Lesson 2: Question-Response',
                                    materials: {
                                        '25 minutes': { slides: true, plan: true, key: true },
                                        '45 minutes': { slides: true, plan: true, key: true },
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-5', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-6', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-7', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-8', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-9', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-10', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-11', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-12', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
                                        'Junior 25 minutes': { sessions: [
                                            { id: 'sess-13', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-14', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]},
                                        'Junior 45 minutes': { sessions: [
                                            { id: 'sess-15', name: 'Session 1: Introduction', slides: true, plan: true, key: true },
                                            { id: 'sess-16', name: 'Session 2: Practice', slides: true, plan: true, key: true }
                                        ]}
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
    loadCourseInfo: function() {
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
        const imageDisplay = document.getElementById('course-image-display');
        if (imageDisplay) {
            imageDisplay.src = course.image;
            imageDisplay.style.display = 'block';
        }

        // Setup action button based on status
        this.setupActionButton();
    },

    // Setup Publish/Lock button based on status
    setupActionButton: function() {
        const actionContainer = document.querySelector('.action-buttons');
        if (!actionContainer || !this.courseData) return;

        const status = this.courseData.status;

        if (status === 'Draft') {
            actionContainer.innerHTML = `
                <button class="btn btn-outline" style="border-radius: 6px; padding: 6px 16px; font-size: 13px; font-weight: 500; border-color: #cbd5e1; color: #4e60ff;" onclick="courseDetailLogic.saveDraft()"><i class="fa-solid fa-floppy-disk"></i> Save Draft</button>
                <button class="btn btn-primary" id="btn-action-main" style="border-radius: 6px; padding: 6px 16px; font-size: 13px;" onclick="courseDetailLogic.publishCourse()"><i class="fa-solid fa-arrow-up-from-bracket"></i> Publish</button>
            `;
            
            const addLevelBtn = document.getElementById('btn-add-level-detail');
            if(addLevelBtn) {
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
            if(addLevelBtn) {
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
            if(addLevelBtn) {
                addLevelBtn.disabled = true;
                addLevelBtn.style.opacity = '0.5';
                addLevelBtn.style.cursor = 'not-allowed';
            }
        }
    },

    // Publish course
    publishCourse: function() {
        if (!this.courseData) return;
        
        if (confirm('Are you sure you want to publish this course? It will be visible to students.')) {
            this.courseData.status = 'Active';
            this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
            document.getElementById('course-status').value = 'Active';
            document.getElementById('course-updated').value = this.courseData.lastUpdated;
            this.setupActionButton();
            this.renderTree(); // re-render to remove edit buttons
            alert('Course published successfully!');
        }
    },

    // Save Draft
    saveDraft: function() {
        if (!this.courseData) return;
        this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
        document.getElementById('course-updated').value = this.courseData.lastUpdated;
        alert('Draft saved successfully!');
    },

    // Lock course
    lockCourse: function() {
        if (!this.courseData) return;
        
        if (confirm('Are you sure you want to lock this course? It will no longer be available for students.')) {
            this.courseData.status = 'Locked';
            this.courseData.lastUpdated = new Date().toLocaleDateString('en-GB');
            document.getElementById('course-status').value = 'Locked';
            document.getElementById('course-updated').value = this.courseData.lastUpdated;
            this.setupActionButton();
            alert('Course locked successfully!');
        }
    },

    addNode: function(parentId, type) {
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

    // Render course tree structure
    renderTree: function() {
        const container = document.getElementById('structure-tree-container');
        if(!container || !this.courseData) return;
        container.innerHTML = '';
        
        const isDraft = (this.courseData.status === 'Draft');

        if (this.courseData.structure.length === 0) {
            container.innerHTML = '<div style="color:#94a3b8; font-size:12px; font-style:italic; padding: 16px; text-align:center;">No levels added yet.</div>';
            return;
        }

        this.courseData.structure.forEach(level => {
            let levelHtml = `<div class="tree-node">`;
            if (this.editingLevelId === level.id) {
                levelHtml += `
                    <div class="tree-row editing-row">
                        <i class="fa-solid fa-layer-group" style="color:#475569;"></i>
                        <input type="text" class="tree-edit-input" id="edit-level-input-${level.id}" value="" placeholder="Enter level name..." style="width: 170px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseDetailLogic.handleEditLevelKey(event, '${level.id}')" onblur="courseDetailLogic.handleEditLevelBlur('${level.id}')" />
                        <button class="tree-btn-add" onclick="courseDetailLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
            } else {
                levelHtml += `
                    <div class="tree-row ${this.activeNodeId === level.id ? 'selected' : ''}" onclick="courseDetailLogic.selectNode('${level.id}', 'level', event)">
                        <i class="fa-solid fa-layer-group" style="color:#475569;"></i> ${level.name}
                        ${isDraft ? `<button class="tree-btn-add" onclick="courseDetailLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>` : ''}
                    </div>
                `;
            }

            levelHtml += `<div class="tree-children">`;
            level.chapters.forEach(chapter => {
                levelHtml += `<div class="tree-node">`;
                if (this.editingChapterId === chapter.id) {
                    levelHtml += `
                        <div class="tree-row editing-row">
                            <i class="fa-regular fa-folder" style="color:#94a3b8;"></i>
                            <input type="text" class="tree-edit-input" id="edit-chapter-input-${chapter.id}" value="" placeholder="Enter chapter name..." style="width: 140px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseDetailLogic.handleEditChapterKey(event, '${level.id}', '${chapter.id}')" onblur="courseDetailLogic.handleEditChapterBlur('${level.id}', '${chapter.id}')" />
                            <button class="tree-btn-add" onclick="courseDetailLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    `;
                } else {
                    levelHtml += `
                        <div class="tree-row ${this.activeNodeId === chapter.id ? 'selected' : ''}" onclick="courseDetailLogic.selectNode('${chapter.id}', 'chapter', event)">
                            <i class="fa-regular fa-folder" style="color:#94a3b8;"></i> ${chapter.name}
                            ${isDraft ? `<button class="tree-btn-add" onclick="courseDetailLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>` : ''}
                        </div>
                    `;
                }

                levelHtml += `<div class="tree-children">`;
                chapter.lessons.forEach(lesson => {
                    if (this.editingLessonId === lesson.id) {
                        levelHtml += `
                            <div class="tree-row editing-row">
                                <i class="fa-regular fa-file-lines" style="color:#cbd5e1;"></i>
                                <input type="text" class="tree-edit-input" id="edit-lesson-input-${lesson.id}" value="" placeholder="Enter lesson name..." style="width: 140px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseDetailLogic.handleEditLessonKey(event, '${chapter.id}', '${lesson.id}')" onblur="courseDetailLogic.handleEditLessonBlur('${chapter.id}', '${lesson.id}')" />
                            </div>
                        `;
                    } else {
                        levelHtml += `
                            <div class="tree-row is-lesson ${this.activeNodeId === lesson.id ? 'selected' : ''}" onclick="courseDetailLogic.selectNode('${lesson.id}', 'lesson', event)">
                                <i class="fa-regular fa-file-lines" style="color:#cbd5e1;"></i> ${lesson.name}
                            </div>
                        `;
                    }
                });
                levelHtml += `</div></div>`;
            });
            levelHtml += `</div></div>`;
            container.innerHTML += levelHtml;
        });
    },

    // Select node in tree
    selectNode: function(id, type, event) {
        if (event) event.stopPropagation();
        this.activeNodeId = id;
        this.renderTree();
        
        if (type === 'lesson') {
            this.navigateToLesson(id);
        }
    },

    navigateToLesson: function(lessonId) {
        if (this.courseData) {
            if (this.courseData.structure) {
                localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData.structure));
            }
            localStorage.setItem('lessonDetailSource', window.location.href);
            localStorage.setItem('currentCourseCode', this.courseData.code || 'ENG-TOEIC-LR900');
        }
        window.location.href = `lesson_detail.html?lessonId=${lessonId}`;
    },

    // Render overview table with lessons
    renderOverviewTable: function() {
        let container = document.getElementById('overview-tabs-container');
        let tableContainer = document.getElementById('overview-table-container');
        if(!container || !tableContainer || !this.courseData) return;

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

        let html = `
            <table class="overview-table" style="table-layout: fixed; width: 100%;">
                <thead style="position: sticky; top: 0; background: white; z-index: 1;">
                    <tr>
                        <th style="width: 40%;">LESSON</th>
                        <th style="width: 20%;">SLIDES</th>
                        <th style="width: 20%;">LESSON PLAN</th>
                        <th style="width: 20%;">ANSWER KEY</th>
                    </tr>
                </thead>
                <tbody>
        `;

        function capitalizeWords(str) {
            return str.replace(/\b\w/g, c => c.toUpperCase());
        }

        if (isEmpty) {
            html += `<tr><td colspan="4" style="text-align:center; padding:60px; color:#94a3b8;"><i class="fa-solid fa-folder-open dropzone-icon"></i><div>No Course Structure Added.</div></td></tr>`;
        } else {
            this.courseData.structure.forEach((level, lIndex) => {
                html += `<tr class="overview-group-row"><td colspan="4" style="text-align: left; cursor: pointer;" onclick="courseDetailLogic.toggleExpand('${level.id}')"><i class="fa-solid fa-caret-${level.isExpanded ? 'down' : 'right'}" style="color:#4e60ff;"></i> ${level.name.toUpperCase()}</td></tr>`;
                
                if (level.isExpanded) {
                    level.chapters.forEach((chap, cIndex) => {
                        html += `<tr style="background:white;">
                                    <td colspan="4" style="padding-left:40px; font-weight:700; font-size:12px; color:#0f172a; border-bottom:1px solid #e2e8f0; text-align: left; position: relative;${chap.lessons.length > 0 ? ' cursor: pointer;' : ''}" ${chap.lessons.length > 0 ? `onclick="courseDetailLogic.toggleChapterExpand('${chap.id}')"` : ''}>
                                       <i class="fa-regular fa-folder" style="color:#94a3b8; font-size:14px; margin-right:4px;"></i> ${capitalizeWords(chap.name)}
                                       ${chap.lessons.length > 0 ? `<i class="fa-solid fa-caret-${chap.isExpanded ? 'down' : 'right'}" style="position: absolute; right: 10px; color:#4e60ff;"></i>` : ''}
                                    </td>
                                 </tr>`;
                        
                        if (chap.isExpanded) {
                            chap.lessons.forEach((les, lesIndex) => {
                                if (!matchesFilter(les, activeTab)) return;

                                let m = les.materials[activeTab];
                                
                                // Dynamic Lesson ID generation
                                let baseCode = (this.courseData.code || '').replace(/^ENG-/, '');
                                let strL = 'L' + (lIndex + 1);
                                let strC = 'C' + (cIndex + 1);
                                let strLes = String(lesIndex + 1).padStart(2, '0');
                                let lessonIdStr = `${baseCode}-${strL}-${strC}-${strLes}`;

                                if (isJunior) {
                                    // Render Lesson Header Row
                                    html += `
                                    <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                        <td colspan="4" style="padding-left: 60px; text-align: left;">
                                            <div style="font-weight:600; font-size:12px; cursor: pointer; display: inline-block;" onclick="courseDetailLogic.navigateToLesson('${les.id}')"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${capitalizeWords(les.name)}</div>
                                        </td>
                                    </tr>`;
                                    
                                    // Render Sessions
                                    if(m.sessions && m.sessions.length > 0) {
                                        m.sessions.forEach((s, sidx) => {
                                            let iconS = s.slides ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconP = s.plan ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconK = s.key ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            
                                            html += `
                                            <tr style="background:white; border-bottom:1px solid #e2e8f0;">
                                                <td style="padding-left: 80px; text-align: left;">
                                                    <div style="font-weight:600; font-size:12px; margin-bottom: 2px;">${s.name}</div>
                                                    <div style="color:#94a3b8; font-size:10px; font-weight: normal;">ID: ${lessonIdStr} (${sidx + 1})</div>
                                                </td>
                                                <td>${iconS}</td>
                                                <td>${iconP}</td>
                                                <td>${iconK}</td>
                                            </tr>`;
                                        });
                                    } else {
                                        html += `<tr><td colspan="4" style="text-align:center; color:#94a3b8; font-size:11px; padding:12px;">No Sessions Added</td></tr>`;
                                    }

                                } else {
                                    let isSR = m.slides;
                                    let isPR = m.plan;
                                    let isKR = m.key;

                                    let iconS = isSR ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                    let iconP = isPR ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                    let iconK = isKR ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                    
                                    html += `
                                    <tr style="background:white; border-bottom:1px solid #e2e8f0;">
                                        <td style="padding-left: 60px; text-align: left;">
                                            <div style="font-weight:600; font-size:12px; margin-bottom: 2px; cursor: pointer; display: inline-block;" onclick="courseDetailLogic.navigateToLesson('${les.id}')"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${capitalizeWords(les.name)}</div>
                                            <div style="color:#94a3b8; font-size:10px; font-weight: normal;">ID: ${lessonIdStr}</div>
                                        </td>
                                        <td>${iconS}</td>
                                        <td>${iconP}</td>
                                        <td>${iconK}</td>
                                    </tr>`;
                                }
                            });
                        }
                    });
                }
            });
        }

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
    },

    toggleExpand: function(id) {
        if (!this.courseData) return;
        const level = this.courseData.structure.find(l => l.id === id);
        if (level) {
            level.isExpanded = !level.isExpanded;
            this.renderOverviewTable();
        }
    },

    toggleChapterExpand: function(id) {
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

    setStatusFilter: function(value) {
        this.statusFilter = value;
        this.renderOverviewTable();
    },

    formatNumber: function(value) {
        return value.replace(/\D/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    },

    parseFormattedNumber: function(value) {
        return parseFloat(value.replace(/\./g, '')) || 0;
    },

    calculateTotalAmounts: function() {
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

    toggleEditInfo: function(isEditing) {
        const inputFields = ['course-name', 'course-code', 'base-price', 'discount', 'course-description'];
        const selectFields = ['course-language', 'course-level', 'course-age', 'course-objectives'];
        
        inputFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('readonly');
                } else {
                    el.setAttribute('readonly', true);
                }
            }
        });

        selectFields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('disabled');
                } else {
                    el.setAttribute('disabled', true);
                }
            }
        });

        const imgZone = document.getElementById('course-image-zone');
        if (imgZone) {
            imgZone.style.cursor = isEditing ? 'pointer' : 'default';
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

    saveInfo: function() {
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

    toggleEditPrice: function(isEditing) {
        const fields = ['fee-25min', 'fee-45min', 'fee-junior-25min', 'fee-junior-45min'];
        
        fields.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                if (isEditing) {
                    el.removeAttribute('readonly');
                } else {
                    el.setAttribute('readonly', true);
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

    savePrice: function() {
        if (!this.courseData) return;

        this.courseData.fees['25 minutes'] = this.parseFormattedNumber(document.getElementById('fee-25min').value);
        this.courseData.fees['45 minutes'] = this.parseFormattedNumber(document.getElementById('fee-45min').value);
        this.courseData.fees['Junior 25 minutes'] = this.parseFormattedNumber(document.getElementById('fee-junior-25min').value);
        this.courseData.fees['Junior 45 minutes'] = this.parseFormattedNumber(document.getElementById('fee-junior-45min').value);

        this.calculateTotalAmounts();

        alert('Course prices saved successfully!');
        this.toggleEditPrice(false);
    },

    init: function() {
        // Load course data
        this.loadCourseData();
        
        // Load course information
        this.loadCourseInfo();

        // Setup class tab
        window.activeClassTab = '25 minutes';
        
        // Render views
        this.renderTree();
        this.renderOverviewTable();

        // Bind status filter
        const statusFilterElem = document.getElementById('overview-status-filter');
        if (statusFilterElem) {
            statusFilterElem.addEventListener('change', function() {
                courseDetailLogic.setStatusFilter(this.value);
            });
        }

        // Live calculation bindings
        const priceInputs = ['base-price', 'fee-25min', 'fee-45min', 'fee-junior-25min', 'fee-junior-45min'];
        priceInputs.forEach(id => {
            const el = document.getElementById(id);
            if (el) {
                el.addEventListener('input', function() {
                    let val = this.value.replace(/\D/g, '');
                    if (val) this.value = courseDetailLogic.formatNumber(val);
                    else this.value = '0';
                    courseDetailLogic.calculateTotalAmounts();
                });
            }
        });

        const discountElem = document.getElementById('discount');
        if (discountElem) {
            discountElem.addEventListener('input', function() {
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
                                        if(!s.slides || !s.plan || !s.key) isLessonComplete = false;
                                    });
                                }
                            } else {
                                if(!m.slides || !m.plan || !m.key) isLessonComplete = false;
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
courseDetailLogic.handleEditLevelKey = function(e, levelId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setLevelName(levelId, name);
        else courseDetailLogic.removeLevel(levelId);
    } else if (e.key === 'Escape') courseDetailLogic.removeLevel(levelId);
};
courseDetailLogic.handleEditLevelBlur = function(levelId) {
    const input = document.getElementById(`edit-level-input-${levelId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setLevelName(levelId, name);
        else courseDetailLogic.removeLevel(levelId);
    }
};
courseDetailLogic.setLevelName = function(levelId, name) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) level.name = name;
    courseDetailLogic.editingLevelId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
courseDetailLogic.removeLevel = function(levelId) {
    courseDetailLogic.courseData.structure = courseDetailLogic.courseData.structure.filter(l => l.id !== levelId);
    courseDetailLogic.editingLevelId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};

courseDetailLogic.handleEditChapterKey = function(e, levelId, chapterId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setChapterName(levelId, chapterId, name);
        else courseDetailLogic.removeChapter(levelId, chapterId);
    } else if (e.key === 'Escape') courseDetailLogic.removeChapter(levelId, chapterId);
};
courseDetailLogic.handleEditChapterBlur = function(levelId, chapterId) {
    const input = document.getElementById(`edit-chapter-input-${chapterId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setChapterName(levelId, chapterId, name);
        else courseDetailLogic.removeChapter(levelId, chapterId);
    }
};
courseDetailLogic.setChapterName = function(levelId, chapterId, name) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) {
        const chapter = level.chapters.find(c => c.id === chapterId);
        if (chapter) chapter.name = name;
    }
    courseDetailLogic.editingChapterId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};
courseDetailLogic.removeChapter = function(levelId, chapterId) {
    const level = courseDetailLogic.courseData.structure.find(l => l.id === levelId);
    if (level) level.chapters = level.chapters.filter(c => c.id !== chapterId);
    courseDetailLogic.editingChapterId = null;
    courseDetailLogic.renderTree();
    courseDetailLogic.renderOverviewTable();
};

courseDetailLogic.handleEditLessonKey = function(e, chapterId, lessonId) {
    if (e.key === 'Enter') {
        const name = e.target.value.trim();
        if (name) courseDetailLogic.setLessonName(chapterId, lessonId, name);
        else courseDetailLogic.removeLesson(chapterId, lessonId);
    } else if (e.key === 'Escape') courseDetailLogic.removeLesson(chapterId, lessonId);
};
courseDetailLogic.handleEditLessonBlur = function(chapterId, lessonId) {
    const input = document.getElementById(`edit-lesson-input-${lessonId}`);
    if (input) {
        const name = input.value.trim();
        if (name) courseDetailLogic.setLessonName(chapterId, lessonId, name);
        else courseDetailLogic.removeLesson(chapterId, lessonId);
    }
};
courseDetailLogic.setLessonName = function(chapterId, lessonId, name) {
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
courseDetailLogic.removeLesson = function(chapterId, lessonId) {
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
