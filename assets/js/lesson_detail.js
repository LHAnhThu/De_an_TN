const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

const lessonDetail = {
    courseData: [],
    lessonId: null,
    node: null,
    pChapter: null,
    pLevel: null,
    activeTab: CLASS_TYPES[0],

    uuid: () => Math.random().toString(36).substr(2, 9),

    init: function() {
        const urlParams = new URLSearchParams(window.location.search);
        this.lessonId = urlParams.get('lessonId');

        if (!this.lessonId) {
            alert('Lesson ID not found!');
            this.goBack();
            return;
        }

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
                    if(les.id === this.lessonId) {
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

    goBack: function() {
        let source = localStorage.getItem('lessonDetailSource');
        if (source) {
            window.location.href = source;
        } else {
            window.location.href = 'add_course.html?tab=classes';
        }
    },

    navigateToLesson: function(lessonId) {
        window.location.href = `lesson_detail.html?lessonId=${lessonId}`;
    },

    saveAndBack: function() {
        // Update local storage
        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.goBack();
    },

    deleteNode: function() {
        if(!confirm('Are you sure you want to delete this lesson?')) return;
        
        // Remove from current data
        this.courseData.forEach(l => { 
            l.chapters.forEach(c => { 
                c.lessons = c.lessons.filter(les => les.id !== this.lessonId);
            });
        });
        
        localStorage.setItem('currentDraftCourse', JSON.stringify(this.courseData));
        this.goBack();
    },

    renderTree: function() {
        const container = document.getElementById('structure-tree-container');
        if(!container || !this.courseData) return;
        
        let html = '';
        this.courseData.forEach(level => {
            html += `<div class="tree-node">
                <div class="tree-row">
                    <i class="fa-solid fa-layer-group" style="color:#475569;"></i> ${level.name}
                </div>
                <div class="tree-children">`;
            level.chapters.forEach(chapter => {
                html += `<div class="tree-node">
                    <div class="tree-row">
                        <i class="fa-regular fa-folder" style="color:#94a3b8;"></i> ${chapter.name}
                    </div>
                    <div class="tree-children">`;
                chapter.lessons.forEach(lesson => {
                    html += `
                        <div class="tree-row is-lesson ${this.lessonId === lesson.id ? 'selected' : ''}" onclick="lessonDetail.navigateToLesson('${lesson.id}')">
                            <i class="fa-regular fa-file-lines" style="color:#cbd5e1;"></i> ${lesson.name}
                        </div>
                    `;
                });
                html += `</div></div>`;
            });
            html += `</div></div>`;
        });
        container.innerHTML = html;
    },

    renderView: function() {
        const container = document.getElementById('lesson-detail-container');
        if (!container) return;

        let getShortName = (name) => {
            let parts = name.split(':')[0].trim().toLowerCase().split(' ');
            if (parts.length >= 2 && !isNaN(parseInt(parts[1], 10))) {
                return parts[0].charAt(0).toUpperCase() + parts[0].slice(1) + ' ' + parseInt(parts[1], 10);
            }
            return name.split(':')[0];
        };

        // Update breadcrumb placeholders in the header
        let bdLevel = document.getElementById('bd-level');
        if (bdLevel) bdLevel.innerText = getShortName(this.pLevel?.name || '');
        
        let bdChapter = document.getElementById('bd-chapter');
        if (bdChapter) bdChapter.innerText = getShortName(this.pChapter?.name || '');
        
        let bdLesson = document.getElementById('bd-lesson');
        if (bdLesson) bdLesson.innerText = getShortName(this.node?.name || '');

        let isJunior = this.activeTab.includes('Junior');

        // Dynamically compute Lesson ID Base
        let courseCode = localStorage.getItem('currentCourseCode') || 'ENG-TOEIC-LR900';
        let baseCode = courseCode.replace(/^ENG-/, '');
        this.lessonIdStr = `${baseCode}-L${this.lIndex}-C${this.cIndex}-${String(this.lesIndex).padStart(2, '0')}`;

        let html = `
            <div class="lesson-header-row">
                <div>
                    <h2>${this.node.name}</h2>
                    <div class="lesson-id">ID: ${this.lessonIdStr}</div>
                </div>
                <button class="btn btn-outline-danger" onclick="lessonDetail.deleteNode()"><i class="fa-regular fa-trash-can"></i> Delete</button>
            </div>

            <!-- Two upper boxes -->
            <div style="display:flex; gap:20px; margin-bottom: 32px; max-width: 900px;">
                <div style="flex:1; background:white; padding:20px 24px; border-radius:10px; border:1px solid #e2e8f0; font-size:13px;">
                    <div style="color:#0f172a; font-weight:700; margin-bottom:4px;">LEVEL 01:</div>
                    <div style="color:#475569; font-size:14px;">${this.pLevel?.name.replace('LEVEL 01: ', '') || 'N/A'}</div>
                </div>
                <div style="flex:1; background:white; padding:20px 24px; border-radius:10px; border:1px solid #e2e8f0; font-size:13px;">
                    <div style="color:#0f172a; font-weight:700; margin-bottom:4px;">CHAPTER 1:</div>
                    <div style="color:#475569; font-size:14px;">${this.pChapter?.name.replace('CHAPTER 1: ', '') || 'N/A'}</div>
                </div>
            </div>

            <!-- Class Tabs -->
            <div class="class-tabs">
                ${CLASS_TYPES.map(ct => `<button class="ctab-btn ${this.activeTab === ct ? 'active' : ''}" onclick="lessonDetail.activeTab='${ct}'; lessonDetail.renderView()">${ct}</button>`).join('')}
            </div>
            
            <div style="padding: 16px 0;">
        `;

        if (!isJunior) {
            // Standard View
            html += this.renderUploadModule('Lecture Slides', 'PDF, PPTX (Max 100MB)', 'slides', 'fa-desktop', 'blue');
            html += this.renderUploadModule('Lesson Plan', 'PDF, Word (Max 50MB)', 'plan', 'fa-book-open', 'green');
            html += this.renderUploadModule('Answer Key', 'PDF, Word (Max 100MB)', 'key', 'fa-key', 'orange');
        } else {
            // Junior View
            if (!this.dirtySessions) this.dirtySessions = {};
            
            let sessionObj = this.node.materials[this.activeTab];
            sessionObj.sessions.forEach((sess, idx) => {
                let sessionActions = `
                    <i class="fa-solid fa-trash-can" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.deleteSession('${sess.id}')"></i>
                `;
                if (this.dirtySessions[sess.id]) {
                    sessionActions = `
                        <div style="display:flex; align-items:center; gap:16px;">
                            <i class="fa-solid fa-xmark" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.cancelSessionChanges('${sess.id}')"></i>
                            <i class="fa-solid fa-floppy-disk" style="color:#4e60ff; cursor:pointer; font-size:16px;" onclick="lessonDetail.saveSessionChanges('${sess.id}')"></i>
                            <i class="fa-solid fa-trash-can" style="color:#ef4444; cursor:pointer; font-size:16px;" onclick="lessonDetail.deleteSession('${sess.id}')"></i>
                        </div>
                    `;
                }

                html += `
                <div class="session-block">
                    <div class="session-header">
                        <div style="display:flex; align-items:center; gap:8px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8;"></i> ${sess.name}</div>
                        ${sessionActions}
                    </div>
                    <div class="session-grid">
                        ${this.renderSessionCell(sess.id, 'Lecture Slides', 'PDF, PPTX (Max 100MB)', 'slides', 'fa-desktop', 'blue', sess.slides)}
                        ${this.renderSessionCell(sess.id, 'Lesson Plan', 'PDF, Word (Max 50MB)', 'plan', 'fa-book-open', 'green', sess.plan)}
                        ${this.renderSessionCell(sess.id, 'Answer Key', 'PDF, Word (Max 100MB)', 'key', 'fa-key', 'orange', sess.key)}
                    </div>
                </div>
                `;
            });
            
            html += `<button class="btn-add-session" onclick="lessonDetail.addSession()"><i class="fa-solid fa-plus" style="margin-right:8px; font-size:16px;"></i> Add Session</button>`;
        }

        html += `</div>`;
        container.innerHTML = html;
    },

    renderUploadModule: function(title, desc, docType, iconClass, colorClass) {
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

        if (!isUploaded) {
            return `
            <div class="upload-module">
                <div class="upload-header">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
                    ${uiActions}
                </div>
                <div class="upload-body">
                    <div class="upload-dropzone" onclick="lessonDetail.toggleUploadStandard('${docType}', true)">
                        <i class="fa-solid fa-cloud-arrow-up dropzone-icon" style="font-size:36px; color:#cbd5e1; margin-bottom:8px; display:block;"></i>
                        <span style="font-weight:600; color:#94a3b8;">Drag & Drop or Click to Select File</span>
                    </div>
                </div>
            </div>`;
        } else {
            return `
            <div class="upload-module">
                <div class="upload-header">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
                    ${uiActions}
                </div>
                <div class="upload-body">
                    <div class="uploaded-file-row">
                        <div class="uploaded-file-info">
                            <i class="fa-solid fa-file-pdf uploaded-file-icon"></i>
                            <div>
                                <div class="uploaded-file-name">File_${docType}_${this.node.id.substring(0,4)}.pdf</div>
                                <div class="uploaded-file-meta">38.2 MB • Updated 2 days ago</div>
                            </div>
                        </div>
                        <div class="uploaded-actions">
                            <button onclick="lessonDetail.toggleUploadStandard('${docType}', false)"><i class="fa-solid fa-trash-can"></i></button>
                            <button class="download"><i class="fa-solid fa-download"></i></button>
                        </div>
                    </div>
                    <div class="upload-dropzone" style="padding:20px;">
                        <i class="fa-solid fa-cloud-arrow-up dropzone-icon" style="font-size:24px; color:#cbd5e1; display:inline-block; margin-bottom:0; vertical-align:middle;"></i>
                        <span style="font-weight:600; color:#94a3b8; margin-left:12px;">Drag & Drop or Click to Select File</span>
                    </div>
                </div>
            </div>`;
        }
    },

    renderSessionCell: function(sessionId, title, desc, docType, iconClass, colorClass, isUploaded) {
        let iconColor = colorClass === 'blue' ? '#4e60ff' : (colorClass === 'green' ? '#10b981' : '#f59e0b');

        if (!isUploaded) {
            return `
            <div class="session-cell">
                <div class="upload-header">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
                </div>
                <div class="session-cell-body">
                    <button class="session-btn-upload" onclick="lessonDetail.toggleUploadSession('${sessionId}', '${docType}', true)">Upload File</button>
                </div>
            </div>`;
        } else {
            return `
            <div class="session-cell">
                <div class="upload-header"">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
                </div>
                <div class="session-cell-body">
                     <div class="uploaded-file-row" style="padding:10px 14px; margin-bottom:12px;">
                        <div class="uploaded-file-info" style="gap:10px;">
                            <i class="fa-solid fa-file-pdf uploaded-file-icon" style="font-size:20px;"></i>
                            <div>
                                <div class="uploaded-file-name" style="font-size:12px;">File_${docType}.pdf</div>
                                <div class="uploaded-file-meta" style="font-size:10px;">38.2 MB</div>
                            </div>
                        </div>
                        <div class="uploaded-actions">
                            <button onclick="lessonDetail.toggleUploadSession('${sessionId}', '${docType}', false)" style="padding:0;"><i class="fa-solid fa-trash-can" style="font-size:14px;"></i></button>
                            <button class="download"><i class="fa-solid fa-download" style="font-size:14px;"></i></button>
                        </div>
                    </div>
                    <button class="session-btn-upload">Upload File</button>
                </div>
            </div>`;
        }
    },

    toggleUploadStandard: function(docType, state) {
        if (!this.dirtyStandard) this.dirtyStandard = {};
        if (!this.standardBackups) this.standardBackups = {};
        
        this.dirtyStandard[docType] = true;
        if (this.standardBackups[docType] === undefined) {
             this.standardBackups[docType] = this.node.materials[this.activeTab][docType];
        }

        this.node.materials[this.activeTab][docType] = state;
        this.renderView();
    },

    saveStandardChanges: function(docType) {
        if (this.dirtyStandard) delete this.dirtyStandard[docType];
        if (this.standardBackups) delete this.standardBackups[docType];
        this.renderView();
    },

    cancelStandardChanges: function(docType) {
        if (this.standardBackups && this.standardBackups[docType] !== undefined) {
            this.node.materials[this.activeTab][docType] = this.standardBackups[docType];
        }
        if (this.dirtyStandard) delete this.dirtyStandard[docType];
        if (this.standardBackups) delete this.standardBackups[docType];
        this.renderView();
    },

    toggleUploadSession: function(sessionId, docType, state) {
        if (!this.dirtySessions) this.dirtySessions = {};
        if (!this.sessionBackups) this.sessionBackups = {};
        
        this.dirtySessions[sessionId] = true;

        let s = this.node.materials[this.activeTab].sessions.find(x => x.id === sessionId);
        if (!this.sessionBackups[sessionId] && s) {
            this.sessionBackups[sessionId] = JSON.parse(JSON.stringify(s));
        }

        if(s) s[docType] = state;
        this.renderView();
    },

    saveSessionChanges: function(sessionId) {
        if (this.dirtySessions) delete this.dirtySessions[sessionId];
        if (this.sessionBackups) delete this.sessionBackups[sessionId];
        this.renderView();
    },

    cancelSessionChanges: function(sessionId) {
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

    addSession: function() {
        let sessionObj = this.node.materials[this.activeTab];
        let name = prompt(`Enter Session name:`, `Session ${sessionObj.sessions.length + 1}`);
        if(!name) return;

        let newId = this.uuid();
        sessionObj.sessions.push({
            id: newId, name: name, slides: false, plan: false, key: false
        });
        
        if (!this.dirtySessions) this.dirtySessions = {};
        this.dirtySessions[newId] = true;
        // Do not create an entry in sessionBackups so cancel removes it

        this.renderView();
    },

    deleteSession: function(sessionId) {
        if(!confirm('Delete this Session?')) return;
        let sessionObj = this.node.materials[this.activeTab];
        sessionObj.sessions = sessionObj.sessions.filter(s => s.id !== sessionId);
        this.renderView();
    }
};

document.addEventListener('DOMContentLoaded', () => {
    lessonDetail.init();
});
