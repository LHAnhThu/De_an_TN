const pollState = {
    mode: 'setup',
    type: null,
    question: '',
    options: [],
    results: {},
    allowMultiple: false,
    anonymous: false
};

function openPollView() {
    document.getElementById('pollView').style.display = 'flex';
    const plusMenu = document.getElementById('plusPopupMenu');
    if (plusMenu) {
        plusMenu.style.display = 'none';
    }
    const chatView = document.getElementById('chatView');
    if (chatView) {
        chatView.style.display = 'none';
    }
    resetPoll();
    renderPollView();
}

function closePollView() {
    const pollView = document.getElementById('pollView');
    if (pollView) {
        pollView.style.display = 'none';
    }
    resetPoll();
}

function updatePollQuestion() {
    const questionInput = document.getElementById('pollQuestion');
    pollState.question = questionInput ? questionInput.value.trim() : '';
    renderPollAction();
}

function selectPollType(type) {
    pollState.type = type;
    if (type === 'truefalse') {
        pollState.options = ['True', 'False'];
    } else if (type === 'abcd') {
        pollState.options = ['A', 'B', 'C', 'D'];
    } else if (type === 'yesno') {
        pollState.options = ['Yes', 'No', 'Abstention'];
    } else if (type === 'typed') {
        pollState.options = ['Typed response'];
    } else {
        pollState.options = [];
    }
    pollState.mode = 'setup';
    pollState.results = {};
    pollState.allowMultiple = false;
    pollState.anonymous = false;
    renderPollView();
}

function renderTypeButtons() {
    return [
        { type: 'truefalse', label: 'True / False' },
        { type: 'abcd', label: 'A / B / C / D' },
        { type: 'yesno', label: 'Yes / No / Abstention' },
        { type: 'typed', label: 'Typed Response' }
    ].map(button => {
        const selectedClass = pollState.type === button.type ? 'selected' : '';
        return `<button class="poll-type-btn ${selectedClass}" onclick="selectPollType('${button.type}')">${button.label}</button>`;
    }).join('');
}

function renderPollChoices() {
    const area = document.getElementById('pollChoicesArea');
    if (!area) {
        return;
    }

    area.innerHTML = '';

    if (!pollState.type) {
        area.innerHTML = '';
        return;
    }

    if (pollState.type === 'truefalse') {
        area.innerHTML = `
            <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 12px;">Response Choices</div>
            <div style="display: flex; gap: 12px; margin-bottom: 24px; align-items: center;">
                <input type="checkbox" id="allowMultiple" style="width: 14px; height: 14px; cursor: pointer; " ${pollState.allowMultiple ? 'checked' : ''} onchange="toggleAllowMultiple()">
                <label for="allowMultiple" style="font-size: 11px; color: #6b7280; cursor: pointer;">Allow multiple answers per respondent</label>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                ${pollState.options.map((option, index) => `
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="text" value="${option}" oninput="updatePollOptionIndex(${index}, this.value)" style="flex:1; padding: 8px 16px; border: 1px solid #9ca3af; border-radius: 20px; outline: none; font-size: 12px; color: #475569;">
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 16px;">
                <span onclick="addPollChoice(event)" style="color: #22c55e; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <div style="border: 1.5px solid #22c55e; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-plus" style="font-size: 8px;"></i></div> Add item
                </span>
            </div>
        `;
        return;
    }

    if (pollState.type === 'abcd') {
        area.innerHTML = `
            <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 12px;">Response Choices</div>
            <div style="display: flex; gap: 12px; margin-bottom: 24px; align-items: flex-start;">
                <input type="checkbox" id="allowMultiple" style="width: 14px; height: 14px; cursor: pointer; margin-top: 2px;" ${pollState.allowMultiple ? 'checked' : ''} onchange="toggleAllowMultiple()">
                <label for="allowMultiple" style="font-size: 11px; color: #6b7280; line-height: 1.4; cursor: pointer;">Allow multiple answers per<br>respondent</label>
            </div>
            <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
                ${pollState.options.map((option, index) => `
                    <div style="display:flex; align-items:center; gap:8px;">
                        <input type="text" value="${option}" oninput="updatePollOptionIndex(${index}, this.value)" style="flex:1; padding: 8px 16px; border: 1px solid #9ca3af; border-radius: 20px; outline: none; font-size: 12px; color: #475569;">
                        <i class="fa-regular fa-trash-can" onclick="removePollOption(${index})" style="color: #64748b; cursor: pointer; font-size: 14px;"></i>
                    </div>
                `).join('')}
            </div>
            <div style="margin-top: 16px;">
                <span onclick="addPollChoice(event)" style="color: #22c55e; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                    <div style="border: 1.5px solid #22c55e; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-plus" style="font-size: 8px;"></i></div> Add item
                </span>
            </div>
        `;
        return;
    }

    if (pollState.type === 'typed') {
        area.innerHTML = `
            <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 12px;">Response Choices</div>
            <div style="color: #6b7280; font-size: 12px; line-height: 1.4;">Users will be presented with a text box to fill in their response</div>
        `;
        return;
    }

    area.innerHTML = `
        <div style="font-size: 12px; font-weight: 700; color: #111827; margin-bottom: 12px;">Response Choices</div>
        <div style="display: flex; gap: 12px; margin-bottom: 24px; align-items: flex-start;">
            <input type="checkbox" id="allowMultiple" style="width: 14px; height: 14px; cursor: pointer; margin-top: 2px;" ${pollState.allowMultiple ? 'checked' : ''} onchange="toggleAllowMultiple()">
            <label for="allowMultiple" style="font-size: 11px; color: #6b7280; line-height: 1.4; cursor: pointer;">Allow multiple answers per<br>respondent</label>
        </div>
        <div style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;">
            ${pollState.options.map((option, index) => `
                <div style="display:flex; align-items:center; gap:8px;">
                    <input type="text" value="${option}" oninput="updatePollOptionIndex(${index}, this.value)" style="flex:1; padding: 8px 16px; border: 1px solid #9ca3af; border-radius: 20px; outline: none; font-size: 12px; color: #475569;">
                    <i class="fa-regular fa-trash-can" onclick="removePollOption(${index})" style="color: #64748b; cursor: pointer; font-size: 14px;"></i>
                </div>
            `).join('')}
        </div>
        <div style="margin-top: 16px;">
            <span onclick="addPollChoice(event)" style="color: #22c55e; font-size: 12px; font-weight: 500; cursor: pointer; display: inline-flex; align-items: center; gap: 6px;">
                <div style="border: 1.5px solid #22c55e; border-radius: 50%; width: 15px; height: 15px; display: flex; align-items: center; justify-content: center;"><i class="fa-solid fa-plus" style="font-size: 8px;"></i></div> Add item
            </span>
        </div>
    `;
}

function updatePollOptionIndex(index, value) {
    pollState.options[index] = value;
    renderPollAction();
}

function removePollOption(index) {
    pollState.options.splice(index, 1);
    renderPollChoices();
    renderPollAction();
}

function updatePollOption(key, value) {
    const index = ['A', 'B', 'C', 'D'].indexOf(key);
    if (index >= 0) {
        pollState.options[index] = value.trim() || key;
    }
    renderPollAction();
}

function toggleAllowMultiple() {
    pollState.allowMultiple = !pollState.allowMultiple;
    renderPollChoices();
}

function toggleAnonymous() {
    pollState.anonymous = !pollState.anonymous;
    renderPollView();
}

function addPollChoice(event) {
    event.preventDefault();
    pollState.options.push('');
    renderPollChoices();
    renderPollAction();
}

function renderPollAction() {
    const actionArea = document.getElementById('pollActionArea');
    if (!actionArea) {
        return;
    }

    if (!pollState.type) {
        actionArea.innerHTML = '';
        return;
    }

    const validOptions = pollState.type === 'typed' || pollState.options.some(opt => opt && opt.trim().length > 0);
    const canStart = pollState.type && validOptions;

    actionArea.innerHTML = `
        <button class="btn-primary" style="margin-bottom: 20px; width:100%; padding: 12px 16px; border-radius: 8px; font-weight: 600; font-size: 15px; background: ${canStart ? '#22C55E' : '#d1d5db'}; color: white; border: none; cursor: ${canStart ? 'pointer' : 'default'};" onclick="startPoll()" ${canStart ? '' : 'disabled'}>Start Poll</button>
    `;
}

function startPoll() {
    const validOptions = pollState.type === 'typed' || pollState.options.some(opt => opt && opt.trim().length > 0);
    if (!pollState.type || !validOptions) {
        return;
    }

    pollState.mode = 'live';
    pollState.results = pollState.options.reduce((acc, option) => {
        if(option.trim().length > 0) {
            acc[option] = 0;
        }
        return acc;
    }, {});

    renderPollView();
}

function renderPollView() {
    const content = document.querySelector('#pollView .poll-content');
    if (!content) {
        return;
    }

    if (pollState.mode === 'live') {
        const totalVotes = Object.values(pollState.results).reduce((sum, value) => sum + value, 0) || 0;
        const totalStudents = 0; 
        
        let headerMessage = ''; 
        if (pollState.question) {
            headerMessage = `<div style="font-size: 14px; font-weight: 700; color: #000; line-height: 1.4; margin-bottom: 8px;">${pollState.question}</div>`;
        }
        
        const optionsHtml = Object.keys(pollState.results).map(option => {
            const votes = pollState.results[option] || 0;
            const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;

            if (pollState.type === 'typed') {
                return `
                    <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #111827;">
                        <span style="text-align: left; flex: 1; word-break: break-word;">${option}</span>
                        <div style="display: flex; align-items: center;">
                            <span style="font-weight: 500;">${votes}</span><span style="margin-left: 24px; font-weight: 500;">${percentage}%</span>
                        </div>
                    </div>
                `;
            }

            return `
                <div style="margin-bottom: 16px; display: flex; justify-content: space-between; align-items: center; font-size: 13px; font-weight: 700; color: #111827;">
                    <span style="text-align: left; flex: 1; word-break: break-word; padding-right: 12px;">${option}</span>
                    <div style="display: flex; align-items: center;">
                        <div style="height: 18px; border-left: 1px solid #9ca3af;"></div>
                        <span style="width: 24px; text-align: right; margin-left: 24px; font-weight: 500; font-size: 14px;">${votes}</span>
                        <span style="width: 40px; text-align: right; margin-left: 24px; font-weight: 500; font-size: 14px;">${percentage}%</span>
                    </div>
                </div>
            `;
        }).join('');

        // Update Sidebar
        const sidebarQuestion = document.getElementById('sidebarActivePollQuestion');
        if (sidebarQuestion) {
            sidebarQuestion.innerHTML = pollState.question;
            sidebarQuestion.style.display = pollState.question ? 'block' : 'none';
        }

        const respNgan = document.getElementById('response-ngan');
        if (respNgan) {
            respNgan.innerHTML = pollState.options[0] || '';
            respNgan.style.display = pollState.options[0] ? 'block' : 'none';
        }

        const respHuy = document.getElementById('response-huy');
        if (respHuy) {
            respHuy.innerHTML = pollState.options[1] || '';
            respHuy.style.display = pollState.options[1] ? 'block' : 'none';
        }

        content.innerHTML = `
            <div style="font-size: 12px; font-weight: 600; color: #9ca3af; line-height: 1.5; margin-bottom: 16px;">
                Leave this panel open to see live responses to your poll. When you are ready, select "Publish polling results" to publish the results and end the poll
            </div>
            <div style="border: 1px solid #d1d5db; border-radius: 8px; padding: 16px; margin-bottom: 24px;">
                ${headerMessage}
                <div style="font-size: 13px; color: #6b7280; font-style: italic; margin-bottom: 24px;">Waiting for responses (${totalVotes}/${totalStudents})...</div>
                <div style="display: flex; flex-direction: column;">
                    ${optionsHtml}
                </div>
            </div>
            <div style="display: flex; gap: 12px; margin-bottom: 24px;">
                <button class="btn-primary" style="flex: 1; padding: 10px; background: #5cb85c; color: white; border: none; border-radius: 24px; font-weight: 700; cursor: pointer; font-size: 13px;" onclick="publishPoll()">Publish Poll</button>
                <button style="flex: 1; padding: 10px; background: white; color: #000; border: 1px solid #e5e7eb; border-radius: 24px; font-weight: 700; cursor: pointer; font-size: 13px;" onclick="resetPoll()">Cancel</button>
            </div>
            <div>
                <div style="border-top: 1px solid #e5e7eb; padding-top: 16px; margin-bottom: 16px;"></div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; font-weight: 800; color: #000; margin-bottom: 16px;">
                    <span>Users</span>
                    <span>Response</span>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 13px; color: #000; font-weight: 500;">
                    <span>Nguyễn Ngọc G...</span>
                    <span></span>
                </div>
            </div>
        `;
        return;
    }

    content.innerHTML = `
        <div style="display: flex; flex-direction: column; height: 100%;">
            <textarea id="pollQuestion" placeholder="Write your question (optional)..." oninput="updatePollQuestion()" style="flex-shrink: 0; border: 1px solid #9ca3af; border-radius: 8px; padding: 12px; margin-bottom: 24px; resize: none; width: 100%; height: 100px; outline: none; font-size: 13px;">${pollState.question}</textarea>
            <div class="poll-types-title" style="font-size: 12px; font-weight: 700; margin-bottom: 12px;">Response Types</div>
        ${renderTypeButtons()}
        <div id="pollChoicesArea" style="margin-top: 24px;"></div>
        
        ${pollState.type ? `
        <div style="margin-top: 20px; display: flex; justify-content: space-between; align-items: center; font-size: 12px; font-weight: 700; color: #111827;">
            <span>Anonymous Poll</span>
            <div style="display: flex; align-items: center; gap: 8px;">
                <span style="font-size: 11px; font-weight: 700; color: #111827;">${pollState.anonymous ? 'ON' : 'OFF'}</span>
                <div class="toggle-switch ${pollState.anonymous ? 'active' : ''}" onclick="toggleAnonymous()">
                    <div class="toggle-handle"></div>
                </div>
            </div>
        </div>
        ` : ''}
        
            <div id="pollActionArea" style="margin-top: auto; padding-top: 24px; display: flex; justify-content: center;"></div>
        </div>
    `;
    renderPollChoices();
    renderPollAction();
}

function publishPoll() {
    pollState.mode = 'published';
    // Show results inside the whiteboard area
    const wbVideoMock = document.getElementById('wbVideoMock');
    if (!wbVideoMock) return;

    // Create a modal over the whiteboard like in Screenshot 5
    const existingModal = document.getElementById('pollResultsWhiteboardModal');
    if (existingModal) {
        existingModal.remove();
    }

    const modal = document.createElement('div');
    modal.id = 'pollResultsWhiteboardModal';
    modal.style.position = 'absolute';
    modal.style.top = '10%';
    modal.style.left = '10%';
    modal.style.width = '320px';
    modal.style.background = 'white';
    modal.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
    modal.style.borderRadius = '8px';
    modal.style.padding = '16px';
    modal.style.zIndex = '60';

    const totalVotes = Object.values(pollState.results).reduce((sum, value) => sum + value, 0) || 0;
    
    let chartHtml = '';
    
    const labels = ['A', 'B', 'C', 'D', 'E', 'F'];
    
    Object.keys(pollState.results).forEach((option, index) => {
        const votes = pollState.results[option] || 0;
        const percentage = totalVotes > 0 ? Math.round((votes / totalVotes) * 100) : 0;
        const barStr = '|'.repeat(Math.ceil(percentage / 3)); // visual representation
        
        const label = pollState.type !== 'typed' ? labels[index] : option;
        
        chartHtml += `
            <div style="font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 8px; display: flex; gap: 8px;">
                <span style="flex-shrink: 0; width: 14px;">${label}:</span>
                <span style="flex-shrink: 0; width: 14px;">${votes}</span>
                <span style="flex: 1; letter-spacing: -1px; text-align: left; overflow: hidden; white-space: nowrap;">${barStr}</span>
                <span style="flex-shrink: 0; width: 35px; text-align: right;">${percentage}%</span>
            </div>
        `;
    });

    let optionsHtmlSection = '';
    if (pollState.type !== 'typed') {
        const optionsList = pollState.options.map((displayOption, index) => {
            return `
                <div style="font-size: 13px; font-weight: 500; color: #111827; margin-bottom: 4px;">
                    <span style="display: inline-block; width: 24px;">${labels[index]}:</span>
                    <span>${displayOption}</span>
                </div>
            `;
        }).join('');
        
        optionsHtmlSection = `
            <div style="font-weight: 600; text-align: center; margin-bottom: 12px; font-size: 13px; color: #111827;">Polling Options</div>
            <div style="display: flex; justify-content: center;">
                <div style="text-align: left;">
                    ${optionsList}
                </div>
            </div>
        `;
    }

    modal.innerHTML = `
        <div style="font-weight: 600; text-align: center; margin-bottom: 12px; font-size: 14px; color: #111827;">Polling Question</div>
        <div style="font-size: 14px; font-weight: 600; color: #000; margin-bottom: 24px; line-height: 1.5;">
            ${pollState.question}
        </div>
        <div style="margin-bottom: 24px;">
            ${chartHtml}
        </div>
        ${optionsHtmlSection}
    `;

    document.querySelector('.whiteboard-col').appendChild(modal);

    resetPoll();
}

function resetPoll() {
    pollState.mode = 'setup';
    pollState.type = null;
    pollState.question = '';
    pollState.options = [];
    pollState.results = {};
    
    // Clear sidebar UI
    const sidebarQuestion = document.getElementById('sidebarActivePollQuestion');
    if (sidebarQuestion) sidebarQuestion.style.display = 'none';
    const respNgan = document.getElementById('response-ngan');
    if (respNgan) respNgan.style.display = 'none';
    const respHuy = document.getElementById('response-huy');
    if (respHuy) respHuy.style.display = 'none';
    
    renderPollView();
}

window.addEventListener('load', () => {
    if (document.getElementById('pollView')) {
        renderPollView();
    }
});
