const CLASS_TYPES = ['25 minutes', '45 minutes', 'Junior 25 minutes', 'Junior 45 minutes'];

const courseLogic = {
    data: [], 
    activeNodeId: null,
    
    uuid: () => Math.random().toString(36).substr(2, 9),

    addNode: function(parentId, type) {
        let name = prompt(`Enter ${type} name:`, `New ${type.toUpperCase()}`);
        if (!name) return;

        let newNode = { id: this.uuid(), type: type, name: name };

        if (type === 'level') {
            newNode.chapters = [];
            this.data.push(newNode);
        } else if (type === 'chapter') {
            newNode.lessons = [];
            let level = this.data.find(l => l.id === parentId);
            if (level) level.chapters.push(newNode);
        } else if (type === 'lesson') {
            newNode.materials = {};
            CLASS_TYPES.forEach(ct => {
                if (ct.includes('Junior')) {
                    newNode.materials[ct] = {
                        sessions: [
                            { id: this.uuid(), name: 'Session 1: Introduction', slides: false, plan: false, key: false }
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
        }
        this.renderTree();
        this.renderOverviewTable();
        this.validatePublish();
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
            
            window.location.href = `lesson_detail.html?lessonId=${id}`;
        } else {
            this.renderOverviewTable();
        }
        this.validatePublish();
    },

    renderTree: function() {
        const container = document.getElementById('structure-tree-container');
        if(!container) return;
        container.innerHTML = '';
        
        if (this.data.length === 0) {
            container.innerHTML = '<div style="color:#94a3b8; font-size:12px; font-style:italic; padding: 16px; text-align:center;">No levels added yet.</div>';
            return;
        }

        this.data.forEach(level => {
            let levelHtml = `
                <div class="tree-node">
                    <div class="tree-row ${this.activeNodeId === level.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${level.id}', 'level', event)">
                        <i class="fa-solid fa-layer-group" style="color:#475569;"></i> ${level.name}
                        <button class="tree-btn-add" onclick="courseLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                    </div>
                    <div class="tree-children">
            `;
            
            level.chapters.forEach(chapter => {
                levelHtml += `
                    <div class="tree-node">
                        <div class="tree-row ${this.activeNodeId === chapter.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${chapter.id}', 'chapter', event)">
                            <i class="fa-regular fa-folder" style="color:#94a3b8;"></i> ${chapter.name}
                            <button class="tree-btn-add" onclick="courseLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                        </div>
                        <div class="tree-children">
                `;

                chapter.lessons.forEach(lesson => {
                    levelHtml += `
                        <div class="tree-row is-lesson ${this.activeNodeId === lesson.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${lesson.id}', 'lesson', event)">
                            <i class="fa-regular fa-file-lines" style="color:#cbd5e1;"></i> ${lesson.name}
                        </div>
                    `;
                });

                levelHtml += `</div></div>`;
            });

            levelHtml += `</div></div>`;
            container.innerHTML += levelHtml;
        });
    },

    renderOverviewTable: function() {
        let container = document.getElementById('overview-tabs-container');
        let tableContainer = document.getElementById('overview-table-container');
        if(!container || !tableContainer) return;

        let activeTab = window.activeClassTab || CLASS_TYPES[0];
        let isEmpty = this.data.length === 0;

        container.innerHTML = CLASS_TYPES.map(ct => `<button class="ctab-btn ${activeTab === ct ? 'active' : ''}" onclick="window.activeClassTab='${ct}'; courseLogic.renderOverviewTable();">${ct}</button>`).join('');

        let isJunior = activeTab.includes('Junior');

        let html = `
            <table class="overview-table">
                <thead>
                    <tr>
                        <th>LESSON</th>
                        <th>SLIDES</th>
                        <th>LESSON PLAN</th>
                        <th>ANSWER KEY</th>
                    </tr>
                </thead>
                <tbody>
        `;

        if (isEmpty) {
            html += `<tr><td colspan="4" style="text-align:center; padding:60px; color:#94a3b8;"><i class="fa-solid fa-folder-open dropzone-icon"></i><div>No Course Structure Added. Click + on the left panel.</div></td></tr>`;
        } else {
            this.data.forEach(level => {
                html += `<tr class="overview-group-row"><td colspan="4"><i class="fa-solid fa-caret-down" style="color:#4e60ff;"></i> ${level.name}</td></tr>`;
                
                level.chapters.forEach(chap => {
                    html += `<tr style="background:white;">
                                <td colspan="4" style="padding-left:40px; font-weight:700; font-size:12px; color:#0f172a; border-bottom:1px solid #e2e8f0;">
                                   <i class="fa-regular fa-folder" style="color:#94a3b8; font-size:14px; margin-right:4px;"></i> ${chap.name}
                                </td>
                             </tr>`;
                    
                    chap.lessons.forEach(les => {
                        let m = les.materials[activeTab];

                        if (isJunior) {
                            // Render Lesson Header Row
                            html += `
                            <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                <td colspan="4" style="padding-left: 60px; cursor:pointer;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
                                    <div style="font-weight:600; font-size:12px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${les.name}</div>
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
                                        <td style="padding-left: 80px; cursor:pointer;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
                                            <div style="font-weight:600; font-size:12px; margin-bottom: 2px;">${s.name}</div>
                                            <div style="color:#94a3b8; font-size:10px; font-weight: normal;">ID: TOEIC-LR900-L1-C1-${les.id.substring(0,2)}-${s.id.substring(0,2)} (${sidx+1})</div>
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
                                <td style="padding-left: 60px; cursor:pointer;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
                                    <div style="font-weight:600; font-size:12px; margin-bottom: 2px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${les.name}</div>
                                    <div style="color:#94a3b8; font-size:10px; font-weight: normal;">ID: TOEIC-LR900-${les.id.substring(0,4)}</div>
                                </td>
                                <td>${iconS}</td>
                                <td>${iconP}</td>
                                <td>${iconK}</td>
                            </tr>`;
                        }
                    });
                });
            });
        }

        html += `</tbody></table>`;
        tableContainer.innerHTML = html;
    },

    validatePublish: function() {
        let allValid = true;
        let lessonCount = 0;

        this.data.forEach(l => {
            l.chapters.forEach(c => {
                c.lessons.forEach(les => {
                    lessonCount++;
                    CLASS_TYPES.forEach(ct => {
                        let isJunior = ct.includes('Junior');
                        let m = les.materials[ct];
                        
                        if (isJunior) {
                            if (m.sessions.length === 0) allValid = false;
                            m.sessions.forEach(s => {
                                if(!s.slides || !s.plan || !s.key) allValid = false;
                            });
                        } else {
                            if(!m.slides || !m.plan || !m.key) allValid = false;
                        }
                    });
                });
            });
        });

        const btnPublish = document.getElementById('btn-publish-main');
        const badge = document.getElementById('classes-badge');

        if (lessonCount === 0) allValid = false;

        if (allValid) {
            btnPublish.disabled = false;
            btnPublish.style.opacity = '1';
            btnPublish.style.cursor = 'pointer';
            if (badge) badge.style.display = 'none';
        } else {
            btnPublish.disabled = true;
            btnPublish.style.opacity = '0.6';
            btnPublish.style.cursor = 'not-allowed';
            if (badge) {
                badge.style.display = 'inline-block';
                badge.innerText = '1';
            }
        }
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
    courseLogic.init();
});

const courseValidation = {
    isImageUploaded: false,

    mockUploadImage: function() {
        this.isImageUploaded = true;
        const zone = document.getElementById('course-image-zone');
        if(zone) {
            zone.style.borderColor = '#10b981';
            zone.style.background = '#f0fdf4';
            document.getElementById('drop-icon').className = 'fa-regular fa-image dropzone-icon';
            document.getElementById('drop-icon').style.color = '#10b981';
            document.getElementById('drop-text').innerText = 'Course_Cover.jpg';
            document.getElementById('err-image').style.display = 'none';
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
            const existing = JSON.parse(localStorage.getItem('mockCourses') || '[]');
            existing.push(courseData);
            localStorage.setItem('mockCourses', JSON.stringify(existing));

            alert('New Course created successfully (Draft mode)!');
            window.location.href = 'courses_list.html';
        }
    }
};
