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

    renderTree: function() {
        const container = document.getElementById('structure-tree-container');
        if(!container) return;
        container.innerHTML = '';
        
        if (this.data.length === 0) {
            container.innerHTML = '<div style="color:#94a3b8; font-size:12px; font-style:italic; padding: 16px; text-align:center;">No levels added yet.</div>';
            return;
        }

        this.data.forEach(level => {
            let levelHtml = `<div class="tree-node">`;
            if (this.editingLevelId === level.id) {
                levelHtml += `
                    <div class="tree-row editing-row">
                        <i class="fa-solid fa-layer-group" style="color:#475569;"></i>
                        <input type="text" class="tree-edit-input" id="edit-level-input-${level.id}" value="" placeholder="Enter level name..." style="width: 170px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseLogic.handleEditLevelKey(event, '${level.id}')" onblur="courseLogic.handleEditLevelBlur('${level.id}')" />
                        <button class="tree-btn-add" onclick="courseLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                    </div>
                `;
            } else {
                levelHtml += `
                    <div class="tree-row ${this.activeNodeId === level.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${level.id}', 'level', event)">
                        <i class="fa-solid fa-layer-group" style="color:#475569;"></i> ${level.name}
                        <button class="tree-btn-add" onclick="courseLogic.addNode('${level.id}', 'chapter'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
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
                            <input type="text" class="tree-edit-input" id="edit-chapter-input-${chapter.id}" value="" placeholder="Enter chapter name..." style="width: 140px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseLogic.handleEditChapterKey(event, '${level.id}', '${chapter.id}')" onblur="courseLogic.handleEditChapterBlur('${level.id}', '${chapter.id}')" />
                            <button class="tree-btn-add" onclick="courseLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    `;
                } else {
                    levelHtml += `
                        <div class="tree-row ${this.activeNodeId === chapter.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${chapter.id}', 'chapter', event)">
                            <i class="fa-regular fa-folder" style="color:#94a3b8;"></i> ${chapter.name}
                            <button class="tree-btn-add" onclick="courseLogic.addNode('${chapter.id}', 'lesson'); event.stopPropagation();"><i class="fa-solid fa-plus"></i></button>
                        </div>
                    `;
                }
                levelHtml += `<div class="tree-children">`;
                chapter.lessons.forEach(lesson => {
                    if (this.editingLessonId === lesson.id) {
                        levelHtml += `
                            <div class="tree-row editing-row">
                                <i class="fa-regular fa-file-lines" style="color:#cbd5e1;"></i>
                                <input type="text" class="tree-edit-input" id="edit-lesson-input-${lesson.id}" value="" placeholder="Enter lesson name..." style="width: 140px; margin-left: 4px; font-size: 13px; border: 1.5px solid #e5e7eb; border-radius: 6px; padding: 4px 10px; outline: none; background: #f8fafc; color: #0f172a; font-weight: 500;" autofocus onkeydown="courseLogic.handleEditLessonKey(event, '${chapter.id}', '${lesson.id}')" onblur="courseLogic.handleEditLessonBlur('${chapter.id}', '${lesson.id}')" />
                            </div>
                        `;
                    } else {
                        levelHtml += `
                            <div class="tree-row is-lesson ${this.activeNodeId === lesson.id ? 'selected' : ''}" onclick="courseLogic.selectNode('${lesson.id}', 'lesson', event)">
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
            html += `<tr><td colspan="4" style="text-align:center; padding:60px; color:#94a3b8;"><i class="fa-solid fa-folder-open dropzone-icon"></i><div>No Course Structure Added. Click + on the left panel.</div></td></tr>`;
        } else {
            this.data.forEach(level => {
                html += `<tr class="overview-group-row"><td colspan="4" style="text-align: left; cursor: pointer;" onclick="courseLogic.toggleExpand('${level.id}')"><i class="fa-solid fa-caret-${level.isExpanded ? 'down' : 'right'}" style="color:#4e60ff;"></i> ${level.name.toUpperCase()}</td></tr>`;
                
                if (level.isExpanded) {
                    level.chapters.forEach(chap => {
                        html += `<tr style="background:white;">
                                    <td colspan="4" style="padding-left:40px; font-weight:700; font-size:12px; color:#0f172a; border-bottom:1px solid #e2e8f0; text-align: left; position: relative;${chap.lessons.length > 0 ? ' cursor: pointer;' : ''}" ${chap.lessons.length > 0 ? `onclick=\"courseLogic.toggleChapterExpand('${chap.id}')\"` : ''}>
                                       <i class="fa-regular fa-folder" style="color:#94a3b8; font-size:14px; margin-right:4px;"></i> ${capitalizeWords(chap.name)}
                                       ${chap.lessons.length > 0 ? `<i class=\"fa-solid fa-caret-${chap.isExpanded ? 'down' : 'right'}\" style=\"position: absolute; right: 10px; color:#4e60ff;\"></i>` : ''}
                                    </td>
                                 </tr>`;
                        
                        if (chap.isExpanded) {
                            chap.lessons.filter(les => matchesFilter(les, activeTab)).forEach(les => {
                            let m = les.materials[activeTab];

                            if (isJunior) {
                                // Render Lesson Header Row
                                html += `
                                <tr style="background:#f8fafc; border-bottom:1px solid #e2e8f0;">
                                    <td colspan="4" style="padding-left: 60px; cursor:pointer; text-align: left;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
                                        <div style="font-weight:600; font-size:12px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${capitalizeWords(les.name)}</div>
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
                                            <td style="padding-left: 80px; cursor:pointer; text-align: left;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
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
                                    <td style="padding-left: 60px; cursor:pointer; text-align: left;" onclick="courseLogic.selectNode('${les.id}', 'lesson', event)">
                                        <div style="font-weight:600; font-size:12px; margin-bottom: 2px;"><i class="fa-regular fa-file-lines" style="color:#94a3b8; margin-right:4px;"></i> ${capitalizeWords(les.name)}</div>
                                        <div style="color:#94a3b8; font-size:10px; font-weight: normal;">ID: TOEIC-LR900-${les.id.substring(0,4)}</div>
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

        if (allValid) {
            if(btnPublish) {
                btnPublish.disabled = false;
                btnPublish.style.opacity = '1';
                btnPublish.style.cursor = 'pointer';
            }
        } else {
            if(btnPublish) {
                btnPublish.disabled = true;
                btnPublish.style.opacity = '0.6';
                btnPublish.style.cursor = 'not-allowed';
            }
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
