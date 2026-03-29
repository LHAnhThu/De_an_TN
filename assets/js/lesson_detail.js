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

        // Find the specific node
        this.courseData.forEach(l => {
            l.chapters.forEach(c => {
                c.lessons.forEach(les => {
                    if(les.id === this.lessonId) {
                        this.node = les;
                        this.pChapter = c;
                        this.pLevel = l;
                    }
                });
            });
        });

        if (!this.node) {
            alert('Lesson not found in course data!');
            this.goBack();
            return;
        }

        this.renderView();
    },

    goBack: function() {
        window.location.href = 'add_course.html?tab=classes';
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

    renderView: function() {
        const container = document.getElementById('lesson-detail-container');
        if (!container) return;

        let isJunior = this.activeTab.includes('Junior');

        let html = `
            <div class="lesson-breadcrumb">
                <span class="link" onclick="lessonDetail.goBack()">TOEIC L&R: Conquer 900+</span> &gt; ${this.pLevel?.name} &gt; ${this.pChapter?.name} &gt; <span style="font-weight:700; color:#0f172a;">${this.node.name}</span>
            </div>

            <div class="lesson-header-row">
                <div>
                    <h2>${this.node.name}</h2>
                    <div class="lesson-id">ID: TOEIC-LR900-L1-C1-${this.node.id.substring(0,4)}</div>
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
            let sessionObj = this.node.materials[this.activeTab];
            sessionObj.sessions.forEach((sess, idx) => {
                html += `
                <div class="session-block">
                    <div class="session-header">
                        <div style="display:flex; align-items:center; gap:8px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8;"></i> ${sess.name}</div>
                        <i class="fa-solid fa-trash-can" style="color:#ef4444; cursor:pointer;" onclick="lessonDetail.deleteSession('${sess.id}')"></i>
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

        if (!isUploaded) {
            return `
            <div class="upload-module">
                <div class="upload-header">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
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
                <div class="upload-header" style="background:white;">
                    <div class="upload-header-left">
                        <i class="fa-solid ${iconClass}" style="color:${iconColor}; font-size:16px;"></i>
                        <div><div class="upload-title">${title}</div><div class="upload-desc">${desc}</div></div>
                    </div>
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
                <div class="upload-header" style="background:white;">
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
        this.node.materials[this.activeTab][docType] = state;
        this.renderView();
    },

    toggleUploadSession: function(sessionId, docType, state) {
        let s = this.node.materials[this.activeTab].sessions.find(x => x.id === sessionId);
        if(s) s[docType] = state;
        this.renderView();
    },

    addSession: function() {
        let sessionObj = this.node.materials[this.activeTab];
        let name = prompt(`Enter Session name:`, `Session ${sessionObj.sessions.length + 1}`);
        if(!name) return;

        sessionObj.sessions.push({
            id: this.uuid(), name: name, slides: false, plan: false, key: false
        });
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
