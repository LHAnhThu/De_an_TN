const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

const courseLogic = {
    editingLevelId: null,
    editingChapterId: null,
    editingLessonId: null,
    data: [], 
    activeNodeId: null,
    statusFilter: 'All',
    
    uuid: () => Math.random().toString(36).substr(2, 9),

    addNode: function(parentId, type) {

        let name = '';
        if (type === 'level') {
            let newNode = { id: this.uuid(), type: type, name: name, chapters: [], isExpanded: true };
            this.data.push(newNode);
            this.editingLevelId = newNode.id;
            this.renderTree();
            this.renderOverviewTable();
            this.validatePublish();
        } else if (type === 'chapter') {
            let newNode = { id: this.uuid(), type: type, name: name, lessons: [], isExpanded: true };
            let level = this.data.find(l => l.id === parentId);
            if (level) level.chapters.push(newNode);
            this.editingChapterId = newNode.id;
            this.renderTree();
            this.renderOverviewTable();
            this.validatePublish();
        } else if (type === 'lesson') {
            let newNode = { id: this.uuid(), type: type, name: name };
            newNode.materials = {};
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
            this.data.forEach(l => {
                l.chapters.forEach(c => {
                    if (c.id === parentId) c.lessons.push(newNode);
                });
            });
            this.editingLessonId = newNode.id;
            this.renderTree();
            this.renderOverviewTable();
            this.validatePublish();
        }
    },

    deleteNode: function(id, type) {
        if(!confirm(`Are you sure you want to delete this ${type}?`)) return;
        if(type === 'level') {
            this.data = this.data.filter(l => l.id !== id);
        } else if(type === 'chapter') {
            this.data.forEach(l => { l.chapters = l.chapters.filter(c => c.id !== id) });
        } else if(type === 'lesson') {
            this.data.forEach(l => { l.chapters.forEach(c => { c.lessons = c.lessons.filter(les => les.id !== id) }) });
        }
        
        this.activeNodeId = null;
        this.renderTree();
        this.renderOverviewTable();
        this.validatePublish();
    },

    selectNode: function(id, type, e) {
        if(e) e.stopPropagation();
        this.activeNodeId = id;
        this.renderTree();
        
        if (type === 'lesson') {
            // Persist tree structure
            localStorage.setItem('currentDraftCourse', JSON.stringify(this.data));
            
            // Persist form fields
            const formInfo = {
                name: document.getElementById('course-name')?.value || '',
                code: document.getElementById('course-code')?.value || '',
                lang: document.getElementById('course-language')?.value || '',
                desc: document.getElementById('course-description')?.value || '',
                img: courseValidation.isImageUploaded
            };
            localStorage.setItem('currentDraftInfo', JSON.stringify(formInfo));
            localStorage.setItem('lessonDetailSource', 'add_course.html?tab=classes');
            localStorage.setItem('currentCourseName', formInfo.title || 'New course');
            localStorage.setItem('currentCourseCode', formInfo.code || 'NEW-COURSE-01');
            window.location.href = `lesson_detail.html?lessonId=${id}`;
        } else {
            this.renderOverviewTable();
        }
        this.validatePublish();
    },

    toggleExpand: function(id) {
        const level = this.data.find(l => l.id === id);
        if (level) {
            level.isExpanded = !level.isExpanded;
            this.renderOverviewTable();
        }
    },

    toggleChapterExpand: function(id) {
        this.data.forEach(level => {
            level.chapters.forEach(chap => {
                if (chap.id === id) {
                    chap.isExpanded = !chap.isExpanded;
                    this.renderOverviewTable();
                }
            });
        });
    },

    applyTemplate: function(id, data = {}) {
        let tmpl = document.getElementById(id);
        if(!tmpl) return '';
        let html = tmpl.innerHTML;
        for (let k in data) html = html.split(`{{${k}}}`).join(data[k]);
        return html;
    },

    renderTree: function() {
        const container = document.getElementById('structure-tree-container');
        if(!container) return;
        container.innerHTML = '';
        
        if (this.data.length === 0) {
            container.innerHTML = this.applyTemplate('tpl-tree-empty');
            return;
        }

        let out = '';
        this.data.forEach(level => {
            out += `<div class="tree-node">`;
            if (this.editingLevelId === level.id) {
                out += this.applyTemplate('tpl-tree-level-editing', {id: level.id});
            } else {
                out += this.applyTemplate('tpl-tree-level', {id: level.id, name: level.name, activeClass: this.activeNodeId === level.id ? 'selected' : ''});
            }
            out += `<div class="tree-children">`;
            level.chapters.forEach(chapter => {
                out += `<div class="tree-node">`;
                if (this.editingChapterId === chapter.id) {
                    out += this.applyTemplate('tpl-tree-chapter-editing', {id: chapter.id, levelId: level.id});
                } else {
                    out += this.applyTemplate('tpl-tree-chapter', {id: chapter.id, name: chapter.name, activeClass: this.activeNodeId === chapter.id ? 'selected' : ''});
                }
                out += `<div class="tree-children">`;
                chapter.lessons.forEach(lesson => {
                    if (this.editingLessonId === lesson.id) {
                        out += this.applyTemplate('tpl-tree-lesson-editing', {id: lesson.id, chapterId: chapter.id});
                    } else {
                        out += this.applyTemplate('tpl-tree-lesson', {id: lesson.id, name: lesson.name, activeClass: this.activeNodeId === lesson.id ? 'selected' : ''});
                    }
                });
                out += `</div></div>`;
            });
            out += `</div></div>`;
        });
        container.innerHTML = out;
        // ...existing code...
    },

    renderOverviewTable: function() {
        let container = document.getElementById('overview-tabs-container');
        let tableContainer = document.getElementById('overview-table-container');
        if(!container || !tableContainer) return;

        let activeTab = window.activeClassTab || CLASS_TYPES[0];
        let isEmpty = this.data.length === 0;
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
            this.data.forEach(level => {
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

        container.innerHTML = CLASS_TYPES.map(ct => `<button class="ctab-btn ${activeTab === ct ? 'active' : ''}" onclick="window.activeClassTab='${ct}'; courseLogic.renderOverviewTable();">${ct} (${incompleteCounts[ct]})</button>`).join('');

        let isJunior = activeTab.includes('Junior');

        let html = '';

        function capitalizeWords(str) {
            return str.replace(/\b\w/g, c => c.toUpperCase());
        }
        if (isEmpty) {
            html += this.applyTemplate('tpl-overview-empty');
        } else {
            this.data.forEach((level, lIndex) => {
                let lStr = "L" + (lIndex + 1);
                html += this.applyTemplate('tpl-overview-level', {
                    id: level.id, 
                    caret: level.isExpanded ? 'down' : 'right', 
                    name: level.name.toUpperCase()
                });
                
                if (level.isExpanded) {
                    level.chapters.forEach((chap, cIndex) => {
                        let cStr = "C" + (cIndex + 1);
                        html += this.applyTemplate('tpl-overview-chapter', {
                            id: chap.id,
                            name: capitalizeWords(chap.name),
                            cursorStyleAttr: chap.lessons.length > 0 ? 'style="cursor: pointer;"' : "",
                            toggleAction: chap.lessons.length > 0 ? `courseLogic.toggleChapterExpand('${chap.id}')` : "",
                            caretHtml: chap.lessons.length > 0 ? `<i class="fa-solid fa-caret-${chap.isExpanded ? 'down' : 'right'}" style="position: absolute; right: 10px; color:#0f172a;"></i>` : ''
                        });
                        
                        if (chap.isExpanded) {
                            chap.lessons.forEach((les, lesIndex) => {
                                if (!matchesFilter(les, activeTab)) return;

                                let lesStr = (lesIndex + 1).toString().padStart(2, '0');
                                let lessonDisplayId = `TOEIC-LR900-${lStr}-${cStr}-${lesStr}`;

                                let m = les.materials[activeTab];

                                if (isJunior) {
                                    html += this.applyTemplate('tpl-overview-lesson-junior-head', {
                                        id: les.id,
                                        name: capitalizeWords(les.name)
                                    });
                                    
                                    if(m.sessions && m.sessions.length > 0) {
                                        m.sessions.forEach((s, sidx) => {
                                            let iconS = s.slides ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconP = s.plan ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            let iconK = s.key ? `<i class="fa-solid fa-check-circle icon-check"></i>` : `<i class="fa-regular fa-circle-xmark icon-cross"></i>`;
                                            
                                            let sessionDisplayId = `${lessonDisplayId} (${sidx + 1})`;
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
                                        displayId: lessonDisplayId,
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

    validatePublish: function() {
        let allValid = true;
        let incompleteLessonCount = 0;
        let totalLessonCount = 0;

        this.data.forEach(l => {
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
                                allValid = false;
                            } else {
                                m.sessions.forEach(s => {
                                    if(!s.slides || !s.plan || !s.key) {
                                        isLessonComplete = false;
                                        allValid = false;
                                    }
                                });
                            }
                        } else {
                            if(!m.slides || !m.plan || !m.key) {
                                isLessonComplete = false;
                                allValid = false;
                            }
                        }
                    });
                    if (!isLessonComplete) {
                        incompleteLessonCount++;
                    }
                });
            });
        });

        if (totalLessonCount === 0) allValid = false;

        const btnPublish = document.getElementById('btn-publish-main');
        const badge = document.getElementById('classes-badge');

        // Note: Button is always enabled, validation happens on click
        if(btnPublish) {
            btnPublish.disabled = false;
            btnPublish.style.opacity = '1';
            btnPublish.style.cursor = 'pointer';
        }
        
        if (badge) {
            if (incompleteLessonCount > 0) {
                badge.style.display = 'inline-block';
                badge.innerText = incompleteLessonCount;
            } else {
                badge.style.display = 'none';
            }
        }
    },

    setStatusFilter: function(value) {
        this.statusFilter = value;
        this.renderOverviewTable();
    },

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        const fromTab = urlParams.get('tab');
        
        if (fromTab === 'classes') {
            const draftStr = localStorage.getItem('currentDraftCourse');
            if (draftStr) {
                this.data = JSON.parse(draftStr);
            } else {
                this.data = [];
            }
            
            // Restore form fields
            const formStr = localStorage.getItem('currentDraftInfo');
            if(formStr) {
                const formInfo = JSON.parse(formStr);
                const elName = document.getElementById('course-name');
                const elCode = document.getElementById('course-code');
                const elLang = document.getElementById('course-language');
                const elDesc = document.getElementById('course-description');
                
                if(elName) elName.value = formInfo.name;
                if(elCode) elCode.value = formInfo.code;
                if(elLang) elLang.value = formInfo.lang;
                if(elDesc) elDesc.value = formInfo.desc;
                if(formInfo.img) {
                    // Have a slight delay to allow validation object to initialize
                    setTimeout(() => courseValidation.mockUploadImage(), 100);
                }
            }
            
            setTimeout(() => {
                const btnClasses = document.getElementById('tab-btn-classes');
                if (btnClasses) btnClasses.click();
            }, 50);
        } else {
            this.data = [];
            localStorage.removeItem('currentDraftCourse');
            localStorage.removeItem('currentDraftInfo');
            
            // Form is empty natively.
        }

        window.activeClassTab = CLASS_TYPES[0]; // Set default
        this.activeNodeId = null; // Default to overview
        
        this.renderTree();
        this.renderOverviewTable();
        this.validatePublish();
    }
};

document.addEventListener('DOMContentLoaded', () => {
        // --- Inline level name editing handlers ---
        courseLogic.handleEditLevelKey = function(e, levelId) {
            if (e.key === 'Enter') {
                const input = e.target;
                const name = input.value.trim();
                if (name) {
                    courseLogic.setLevelName(levelId, name);
                } else {
                    courseLogic.removeLevel(levelId);
                }
            } else if (e.key === 'Escape') {
                courseLogic.removeLevel(levelId);
            }
        };
        courseLogic.handleEditLevelBlur = function(levelId) {
            const input = document.getElementById(`edit-level-input-${levelId}`);
            if (input) {
                const name = input.value.trim();
                if (name) {
                    courseLogic.setLevelName(levelId, name);
                } else {
                    courseLogic.removeLevel(levelId);
                }
            }
        };
        courseLogic.setLevelName = function(levelId, name) {
            const level = courseLogic.data.find(l => l.id === levelId);
            if (level) {
                level.name = name;
            }
            courseLogic.editingLevelId = null;
            courseLogic.renderTree();
            courseLogic.renderOverviewTable();
            courseLogic.validatePublish();
        };
        courseLogic.removeLevel = function(levelId) {
            courseLogic.data = courseLogic.data.filter(l => l.id !== levelId);
            courseLogic.editingLevelId = null;
            courseLogic.renderTree();
            courseLogic.renderOverviewTable();
            courseLogic.validatePublish();
        };

        // --- Inline lesson name editing handlers ---
        courseLogic.handleEditLessonKey = function(e, chapterId, lessonId) {
            if (e.key === 'Enter') {
                const input = e.target;
                const name = input.value.trim();
                if (name) {
                    courseLogic.setLessonName(chapterId, lessonId, name);
                } else {
                    courseLogic.removeLesson(chapterId, lessonId);
                }
            } else if (e.key === 'Escape') {
                courseLogic.removeLesson(chapterId, lessonId);
            }
        };
        courseLogic.handleEditLessonBlur = function(chapterId, lessonId) {
            const input = document.getElementById(`edit-lesson-input-${lessonId}`);
            if (input) {
                const name = input.value.trim();
                if (name) {
                    courseLogic.setLessonName(chapterId, lessonId, name);
                } else {
                    courseLogic.removeLesson(chapterId, lessonId);
                }
            }
        };
        courseLogic.setLessonName = function(chapterId, lessonId, name) {
            courseLogic.data.forEach(level => {
                level.chapters.forEach(chap => {
                    if (chap.id === chapterId) {
                        const lesson = chap.lessons.find(l => l.id === lessonId);
                        if (lesson) lesson.name = name;
                    }
                });
            });
            courseLogic.editingLessonId = null;
            courseLogic.renderTree();
            courseLogic.renderOverviewTable();
            courseLogic.validatePublish();
        };
        courseLogic.removeLesson = function(chapterId, lessonId) {
            courseLogic.data.forEach(level => {
                level.chapters.forEach(chap => {
                    if (chap.id === chapterId) {
                        chap.lessons = chap.lessons.filter(l => l.id !== lessonId);
                    }
                });
            });
            courseLogic.editingLessonId = null;
            courseLogic.renderTree();
            courseLogic.renderOverviewTable();
            courseLogic.validatePublish();
        };
    // --- Inline chapter name editing handlers ---
    courseLogic.handleEditChapterKey = function(e, levelId, chapterId) {
        if (e.key === 'Enter') {
            const input = e.target;
            const name = input.value.trim();
            if (name) {
                courseLogic.setChapterName(levelId, chapterId, name);
            } else {
                courseLogic.removeChapter(levelId, chapterId);
            }
        } else if (e.key === 'Escape') {
            courseLogic.removeChapter(levelId, chapterId);
        }
    };
    courseLogic.handleEditChapterBlur = function(levelId, chapterId) {
        const input = document.getElementById(`edit-chapter-input-${chapterId}`);
        if (input) {
            const name = input.value.trim();
            if (name) {
                courseLogic.setChapterName(levelId, chapterId, name);
            } else {
                courseLogic.removeChapter(levelId, chapterId);
            }
        }
    };
    courseLogic.setChapterName = function(levelId, chapterId, name) {
        const level = courseLogic.data.find(l => l.id === levelId);
        if (level) {
            const chapter = level.chapters.find(c => c.id === chapterId);
            if (chapter) {
                chapter.name = name;
            }
        }
        courseLogic.editingChapterId = null;
        courseLogic.renderTree();
        courseLogic.renderOverviewTable();
        courseLogic.validatePublish();
    };
    courseLogic.removeChapter = function(levelId, chapterId) {
        const level = courseLogic.data.find(l => l.id === levelId);
        if (level) {
            level.chapters = level.chapters.filter(c => c.id !== chapterId);
        }
        courseLogic.editingChapterId = null;
        courseLogic.renderTree();
        courseLogic.renderOverviewTable();
        courseLogic.validatePublish();
    };
    const statusFilterElem = document.getElementById('overview-status-filter');
    if (statusFilterElem) {
        statusFilterElem.addEventListener('change', function() {
            courseLogic.setStatusFilter(this.value);
        });
    }
    courseLogic.init();
});

const courseValidation = {
    isImageUploaded: false,

    mockUploadImage: function(e) {
        if(e && e.target.closest('.delete-image-btn')) return;
        this.isImageUploaded = true;
        const zone = document.getElementById('course-image-zone');
        if(zone) {
            zone.style.background = 'transparent';
            zone.innerHTML = `
                <div class="dropzone-image">
                    <img src="../assets/img/courses_img/course_1.png" alt="Course Image">
                    <div class="delete-image-btn" onclick="courseValidation.removeImage(event)">
                        <i class="fa-solid fa-xmark"></i>
                    </div>
                </div>
            `;
            const errEl = document.getElementById('err-image');
            if(errEl) errEl.style.display = 'none';
        }
    },

    removeImage: function(e) {
        if(e) e.stopPropagation();
        this.isImageUploaded = false;
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

    clearError: function(el) {
        el.style.borderColor = '#93c5fd';
        const errId = el.id.replace('course-', 'err-');
        const errEl = document.getElementById(errId);
        if(errEl) errEl.style.display = 'none';
    },

    showError: function(idBase) {
        if(idBase !== 'image') {
            const el = document.getElementById(`course-${idBase}`);
            if(el) el.style.borderColor = '#ef4444';
        } else {
            const zone = document.getElementById('course-image-zone');
            if(zone) zone.style.borderColor = '#ef4444';
        }
        
        const errEl = document.getElementById(`err-${idBase}`);
        if(errEl) errEl.style.display = 'block';
    },

    saveDraft: function() {
        let isValid = true;
        
        // Check fields
        const name = document.getElementById('course-name');
        const code = document.getElementById('course-code');
        const lang = document.getElementById('course-language');
        const desc = document.getElementById('course-description');

        if(name && !name.value.trim()) { this.showError('name'); isValid = false; }
        if(code && !code.value.trim()) { this.showError('code'); isValid = false; }
        if(lang && !lang.value) { this.showError('language'); isValid = false; }
        if(desc && !desc.value.trim()) { this.showError('description'); isValid = false; }
        if(!this.isImageUploaded) { this.showError('image'); isValid = false; }

        if(isValid) {
            const courseData = {
                name: name.value.trim(),
                lang: lang.value,
                status: 'Draft',
                img: '../assets/img/courses_img/course_1.png'
            };
            const existing = JSON.parse(sessionStorage.getItem('mockCourses') || '[]');
            existing.push(courseData);
            sessionStorage.setItem('mockCourses', JSON.stringify(existing));
            localStorage.removeItem('currentDraftCourse');
            localStorage.removeItem('currentDraftInfo');

            alert('New Course created successfully (Draft mode)!');
            window.location.href = 'courses_list.html';
        }
    }
};
