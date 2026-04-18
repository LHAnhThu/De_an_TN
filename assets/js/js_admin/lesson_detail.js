const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

const lessonDetail = {
    courseData: [],
    lessonId: null,
    node: null,
    pChapter: null,
    pLevel: null,
    activeTab: CLASS_TYPES[0],
    sessionIdToDelete: null,
    editingLevelId: null,
    editingChapterId: null,
    editingLessonId: null,
    treeActiveNodeId: null,

    uuid: () => Math.random().toString(36).substr(2, 9),

    init: function () {
        const urlParams = new URLSearchParams(window.location.search);
        this.lessonId = urlParams.get('lessonId');

        if (!this.lessonId) {
            alert('Lesson ID not found!');
            this.goBack();
            return;
        }

        let courseName = localStorage.getItem('currentCourseName') || 'TOEIC L&R: Conquer 900+';
        let bdName = document.getElementById('bd-course-name');
        if (bdName) bdName.innerText = courseName;

        const draftStr = localStorage.getItem('currentDraftCourse');
        if (draftStr) {
            this.courseData = JSON.parse(draftStr);
        } else {
            alert('No course data found in session!');
            this.goBack();
            return;
        }

        // Find the specific node and store indices
        this.courseData.forEach((l, lIdx) => {
            l.chapters.forEach((c, cIdx) => {
                c.lessons.forEach((les, lesIdx) => {
                    if (les.id === this.lessonId) {
                        this.node = les;
                        this.pChapter = c;
                        this.pLevel = l;
                        this.lIndex = lIdx + 1;
                        this.cIndex = cIdx + 1;
                        this.lesIndex = lesIdx + 1;
                    }
                });
            });
        });

        if (!this.node) {
            alert('Lesson not found in course data!');
            this.goBack();
            return;
        }

        this.renderTree();
        this.renderView();
    },

    goBack: function () {
        let source = localStorage.getItem('lessonDetailSource');
        if (source) {
            window.location.href = source;
        } else {
            window.location.href = 'add_course.html?tab=classes';
        }
    },

    navigateToLesson: function (lessonId) {
        window.location.href = `lesson_detail.html?lessonId=${lessonId}`;
    },

    saveAndBack: function () {
        // Update local storage
        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.goBack();
    },

    deleteNode: function () {
        if (!confirm('Are you sure you want to delete this lesson?')) return;

        // Remove from current data
        this.courseData.forEach(l => {
            l.chapters.forEach(c => {
                c.lessons = c.lessons.filter(les => les.id !== this.lessonId);
            });
        });

        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.goBack();
    },

    applyTemplate: function (id, data = {}) {
        let tmpl = document.getElementById(id);
        if (!tmpl) return '';
        let html = tmpl.innerHTML;
        for (let k in data) html = html.split(`{{${k}}}`).join(data[k]);
        return html;
    },

    renderTree: function () {
        const container = document.getElementById('structure-tree-container');
        if (!container || !this.courseData) return;

        let html = '';
        const isDraft = true; // Wait: The user only opens the mock data draft here, let's look for this.courseData.status but it's an array of levels. In lesson_detail.js, courseData is just the structure array (`this.courseData = JSON.parse(draftStr)` ? Wait, actually if local storage is used, it might be the whole course object.
        // Let's check `lesson_detail.js` `init()` logic to see if courseData is an array.
        // It says: this.courseData.forEach((l, lIdx) => ...). So this.courseData IS the array of levels.

        let globalAddBtn = document.getElementById('btn-global-add-level');
        if (globalAddBtn) globalAddBtn.style.display = 'block';

        this.courseData.forEach(level => {
            let chHtml = '';
            level.chapters.forEach(chapter => {
                let lesHtml = '';
                chapter.lessons.forEach(lesson => {
                    if (this.editingLessonId === lesson.id) {
                        lesHtml += this.applyTemplate('tpl-tree-lesson-editing', { id: lesson.id, chapterId: chapter.id });
                    } else {
                        lesHtml += this.applyTemplate('tpl-tree-lesson', {
                            id: lesson.id,
                            name: lesson.name,
                            activeClass: this.lessonId === lesson.id ? 'selected' : ''
                        });
                    }
                });

                if (this.editingChapterId === chapter.id) {
                    chHtml += this.applyTemplate('tpl-tree-chapter-editing', { id: chapter.id, levelId: level.id });
                } else {
                    let btnHtml = `<button class="tree-btn-add" onclick="lessonDetail.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>`;
                    chHtml += this.applyTemplate('tpl-tree-chapter', {
                        id: chapter.id,
                        name: chapter.name,
                        children: lesHtml,
                        addBtnHtml: btnHtml
                    });
                }
            });

            if (this.editingLevelId === level.id) {
                html += this.applyTemplate('tpl-tree-level-editing', { id: level.id });
            } else {
                let btnHtml = `<button class="tree-btn-add" onclick="lessonDetail.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>`;
                html += this.applyTemplate('tpl-tree-level', {
                    id: level.id,
                    name: level.name,
                    children: chHtml,
                    addBtnHtml: btnHtml
                });
            }
        });
        container.innerHTML = html;
    },

    // --- TREE EDITING LOGIC ---
    addNode: function (parentId, type) {
        let name = type === 'level' ? 'NEW LEVEL' : (type === 'chapter' ? 'New Chapter' : 'New Lesson');
        if (type === 'level') {
            let newNode = { id: this.uuid(), type: type, name: name, chapters: [], isExpanded: true };
            this.courseData.push(newNode);
            this.editingLevelId = newNode.id;
        } else if (type === 'chapter') {
            let newNode = { id: this.uuid(), type: type, name: name, lessons: [], isExpanded: true };
            let level = this.courseData.find(l => l.id === parentId);
            if (level) level.chapters.push(newNode);
            this.editingChapterId = newNode.id;
        } else if (type === 'lesson') {
            let newNode = {
                id: this.uuid(), type: type, name: name,
                materials: {
                    '25 minutes': { slides: false, plan: false, key: false },
                    '45 minutes': { slides: false, plan: false, key: false },
                    'Junior 25 minutes': { sessions: [] },
                    'Junior 45 minutes': { sessions: [] }
                }
            };
            this.courseData.forEach(l => {
                l.chapters.forEach(c => {
                    if (c.id === parentId) c.lessons.push(newNode);
                });
            });
            this.editingLessonId = newNode.id;
        }
        this.renderTree();
    },
    handleEditNodeKey: function (e, type, id1, id2) {
        if (e.key === 'Enter') {
            const name = e.target.value.trim();
            if (name) this.setNodeName(type, name, id1, id2);
            else this.removeNode(type, id1, id2);
        } else if (e.key === 'Escape') this.removeNode(type, id1, id2);
    },
    handleEditNodeBlur: function (type, id1, id2) {
        const input = document.getElementById(`edit-${type}-input-${id2 || id1}`);
        if (input) {
            const name = input.value.trim();
            if (name) this.setNodeName(type, name, id1, id2);
            else this.removeNode(type, id1, id2);
        }
    },
    setNodeName: function (type, name, id1, id2) {
        if (type === 'level') {
            const level = this.courseData.find(l => l.id === id1);
            if (level) level.name = name;
            this.editingLevelId = null;
        } else if (type === 'chapter') {
            const level = this.courseData.find(l => l.id === id1);
            if (level) {
                const chapter = level.chapters.find(c => c.id === id2);
                if (chapter) chapter.name = name;
            }
            this.editingChapterId = null;
        } else if (type === 'lesson') {
            this.courseData.forEach(l => {
                const chapter = l.chapters.find(c => c.id === id1);
                if (chapter) {
                    const lesson = chapter.lessons.find(ls => ls.id === id2);
                    if (lesson) lesson.name = name;
                }
            });
            this.editingLessonId = null;
        }
        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.renderTree();
    },
    removeNode: function (type, id1, id2) {
        if (type === 'level') {
            this.courseData = this.courseData.filter(l => l.id !== id1);
            this.editingLevelId = null;
        } else if (type === 'chapter') {
            const level = this.courseData.find(l => l.id === id1);
            if (level) level.chapters = level.chapters.filter(c => c.id !== id2);
            this.editingChapterId = null;
        } else if (type === 'lesson') {
            this.courseData.forEach(l => {
                const chapter = l.chapters.find(c => c.id === id1);
                if (chapter) chapter.lessons = chapter.lessons.filter(ls => ls.id !== id2);
            });
            this.editingLessonId = null;
        }
        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.renderTree();
    },
    // ----------------------------

    renderView: function () {
        const container = document.getElementById('lesson-detail-container');
        if (!container) return;

        let getShortName = (name) => {
            let parts = name.split(':')[0].trim().toLowerCase().split(' ');
            if (parts.length >= 2 && !isNaN(parseInt(parts[1], 10))) {
                return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + ' ' + parseInt(parts[1], 10);
            }
            return name.split(':')[0];
        };

        let bdLevel = document.getElementById('bd-level');
        if (bdLevel) bdLevel.innerText = `Level ${this.lIndex}`;

        let bdChapter = document.getElementById('bd-chapter');
        if (bdChapter) bdChapter.innerText = `Chapter ${this.cIndex}`;

        let bdLesson = document.getElementById('bd-lesson');
        if (bdLesson) bdLesson.innerText = `Lesson ${this.lesIndex}`;

        let isJunior = this.activeTab.includes('Junior');

        let courseCode = localStorage.getItem('currentCourseCode') || 'ENG-TOEIC-LR900';
        let baseCode = courseCode.replace(/^ENG-/, '');
        this.lessonIdStr = `${baseCode}-L${this.lIndex}-C${this.cIndex}-${String(this.lesIndex).padStart(2, '0')}`;

        let tabsHtml = CLASS_TYPES.map(ct => `<button class="ctab-btn ${this.activeTab === ct ? 'active' : ''}" onclick="lessonDetail.activeTab='${ct}'; lessonDetail.renderView()">${ct}</button>`).join('');

        let contentHtml = '';

        if (!isJunior) {
            contentHtml += this.renderUploadModule('Lecture Slides', 'PDF, PPTX (Max 100MB)', 'slides', 'fa-desktop', 'blue');
            contentHtml += this.renderUploadModule('Lesson Plan', 'PDF, Word (Max 50MB)', 'plan', 'fa-book-open', 'green');
            contentHtml += this.renderUploadModule('Answer Key', 'PDF, Word (Max 100MB)', 'key', 'fa-key', 'orange');
        } else {
            if (!this.dirtySessions) this.dirtySessions = {};

            let sessionObj = this.node.materials[this.activeTab];
            sessionObj.sessions.forEach((sess, idx) => {
                let sessionActions = `<i class="fa-solid fa-trash-can" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.deleteSession('${sess.id}')"></i>`;

                if (this.dirtySessions[sess.id]) {
                    sessionActions = `
                        <div style="display:flex; align-items:center; gap:16px;">
                            <i class="fa-solid fa-xmark" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.cancelSessionChanges('${sess.id}')"></i>
                            <i class="fa-solid fa-floppy-disk" style="color:#4e60ff; cursor:pointer; font-size:16px;" onclick="lessonDetail.saveSessionChanges('${sess.id}')"></i>
                            <i class="fa-solid fa-trash-can" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.deleteSession('${sess.id}')"></i>
                        </div>
                    `;
                }

                let cellsHtml = '';
                cellsHtml += this.renderSessionCell(sess.id, 'Lecture Slides', 'PDF, PPTX (Max 100MB)', 'slides', 'fa-desktop', 'blue', sess.slides);
                cellsHtml += this.renderSessionCell(sess.id, 'Lesson Plan', 'PDF, Word (Max 50MB)', 'plan', 'fa-book-open', 'green', sess.plan);
                cellsHtml += this.renderSessionCell(sess.id, 'Answer Key', 'PDF, Word (Max 100MB)', 'key', 'fa-key', 'orange', sess.key);

                let match = sess.name.match(/^(Session \d+:\s*)(.*)$/);
                let prefix = match ? match[1] : '';
                let title = match ? match[2] : sess.name;

                let isDefault = title.trim() === '';
                let borderStyle = isDefault ? '1.5px solid #0f172a' : 'none';
                
                let nameHtml = `
                    <span style="font-weight: 600; color: #0f172a; white-space: pre;">${prefix.replace(/"/g, '&quot;')}</span>
                    <input type="text" value="${title.replace(/"/g, '&quot;')}"
                        onchange="lessonDetail.updateSessionName('${sess.id}', this.value)"
                        title="${title.replace(/"/g, '&quot;')}"
                        style="border: none; border-bottom: ${borderStyle}; outline: none; font-size: 16px; width: 250px; color: #0f172a; background: transparent; padding-bottom: 2px; font-family: inherit; font-weight: 600;"
                    >
                `;

                contentHtml += this.applyTemplate('tpl-session-block', {
                    nameHtml: nameHtml,
                    sessionActions: sessionActions,
                    cellsHtml: cellsHtml
                });
            });

            contentHtml += `<button class="btn-add-session" onclick="lessonDetail.addSession()"><i class="fa-solid fa-plus" style="margin-right:8px; font-size:16px;"></i> Add Session</button>`;
        }

        container.innerHTML = this.applyTemplate('tpl-view-wrapper', {
            name: this.node.name,
            lessonIdStr: this.lessonIdStr,
            pLevelName: this.pLevel?.name.replace('LEVEL 01: ', '') || 'N/A',
            pChapterName: this.pChapter?.name.replace('CHAPTER 1: ', '') || 'N/A',
            tabsHtml: tabsHtml,
            contentHtml: contentHtml
        });
    },

    renderUploadModule: function (title, desc, docType, iconClass, colorClass) {
        let isUploaded = this.node.materials[this.activeTab][docType];
        let iconColor = colorClass === 'blue' ? '#4e60ff' : (colorClass === 'green' ? '#10b981' : '#f59e0b');

        let uiActions = '';
        if (this.dirtyStandard && this.dirtyStandard[docType]) {
            uiActions = `
                <div style="display:flex; align-items:center; gap:16px;">
                    <i class="fa-solid fa-xmark" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.cancelStandardChanges('${docType}')"></i>
                    <i class="fa-solid fa-floppy-disk" style="color:#4e60ff; cursor:pointer; font-size:16px;" onclick="lessonDetail.saveStandardChanges('${docType}')"></i>
                </div>
            `;
        }

        let ctx = {
            title: title, desc: desc, docType: docType, iconClass: iconClass, iconStyleAttr: `style="color:${iconColor}; font-size:16px;"`, uiActions: uiActions, nodeId: this.node.id.substring(0, 4)
        };

        return this.applyTemplate(isUploaded ? 'tpl-upload-module-filled' : 'tpl-upload-module-empty', ctx);
    },

    renderSessionCell: function (sessionId, title, desc, docType, iconClass, colorClass, isUploaded) {
        let iconColor = colorClass === 'blue' ? '#4e60ff' : (colorClass === 'green' ? '#10b981' : '#f59e0b');
        let ctx = {
            sessionId: sessionId, title: title, desc: desc, docType: docType, iconClass: iconClass, iconStyleAttr: `style="color:${iconColor}; font-size:16px;"`
        };
        return this.applyTemplate(isUploaded ? 'tpl-session-cell-filled' : 'tpl-session-cell-empty', ctx);
    },

    toggleUploadStandard: function (docType, state) {
        if (!this.dirtyStandard) this.dirtyStandard = {};
        if (!this.standardBackups) this.standardBackups = {};

        this.dirtyStandard[docType] = true;
        if (this.standardBackups[docType] === undefined) {
            this.standardBackups[docType] = this.node.materials[this.activeTab][docType];
        }

        this.node.materials[this.activeTab][docType] = state;
        this.renderView();
    },

    saveStandardChanges: function (docType) {
        if (this.dirtyStandard) delete this.dirtyStandard[docType];
        if (this.standardBackups) delete this.standardBackups[docType];
        this.renderView();
    },

    cancelStandardChanges: function (docType) {
        if (this.standardBackups && this.standardBackups[docType] !== undefined) {
            this.node.materials[this.activeTab][docType] = this.standardBackups[docType];
        }
        if (this.dirtyStandard) delete this.dirtyStandard[docType];
        if (this.standardBackups) delete this.standardBackups[docType];
        this.renderView();
    },

    toggleUploadSession: function (sessionId, docType, state) {
        if (!this.dirtySessions) this.dirtySessions = {};
        if (!this.sessionBackups) this.sessionBackups = {};

        this.dirtySessions[sessionId] = true;

        let s = this.node.materials[this.activeTab].sessions.find(x => x.id === sessionId);
        if (!this.sessionBackups[sessionId] && s) {
            this.sessionBackups[sessionId] = JSON.parse(JSON.stringify(s));
        }

        if (s) s[docType] = state;
        this.renderView();
    },

    saveSessionChanges: function (sessionId) {
        if (this.dirtySessions) delete this.dirtySessions[sessionId];
        if (this.sessionBackups) delete this.sessionBackups[sessionId];
        this.renderView();
    },

    cancelSessionChanges: function (sessionId) {
        let sessionObj = this.node.materials[this.activeTab];
        let sIndex = sessionObj.sessions.findIndex(x => x.id === sessionId);

        if (sIndex > -1) {
            if (this.sessionBackups && this.sessionBackups[sessionId]) {
                Object.assign(sessionObj.sessions[sIndex], this.sessionBackups[sessionId]);
            } else {
                // If there's no backup, it means it was a newly added session, so we remove it.
                sessionObj.sessions.splice(sIndex, 1);
            }
        }

        if (this.dirtySessions) delete this.dirtySessions[sessionId];
        if (this.sessionBackups) delete this.sessionBackups[sessionId];
        this.renderView();
    },

    addSession: function () {
        let sessionObj = this.node.materials[this.activeTab];
        let defaultName = `Session ${sessionObj.sessions.length + 1}: `;

        let newId = this.uuid();
        sessionObj.sessions.push({
            id: newId, name: defaultName, slides: false, plan: false, key: false
        });

        if (!this.dirtySessions) this.dirtySessions = {};
        this.dirtySessions[newId] = true;
        // Do not create an entry in sessionBackups so cancel removes it

        this.renderView();
    },

    updateSessionName: function (sessionId, val) {
        let sessionObj = this.node.materials[this.activeTab];
        let sess = sessionObj.sessions.find(x => x.id === sessionId);
        if (sess) {
            let match = sess.name.match(/^(Session \d+:\s*)(.*)$/);
            let prefix = match ? match[1] : '';
            sess.name = prefix + val;
            this.renderView();
        }
    },

    deleteSession: function (sessionId) {
        this.sessionIdToDelete = sessionId;
        document.getElementById('delete-session-modal').style.display = 'flex';
    },

    closeDeleteModal: function () {
        document.getElementById('delete-session-modal').style.display = 'none';
        this.sessionIdToDelete = null;
    },

    confirmDeleteSession: function () {
        if (!this.sessionIdToDelete) return;
        let sessionObj = this.node.materials[this.activeTab];
        sessionObj.sessions = sessionObj.sessions.filter(s => s.id !== this.sessionIdToDelete);
        this.closeDeleteModal();
        this.renderView();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    lessonDetail.init();
});
