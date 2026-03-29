function loadHeader(options) {
    const container = document.getElementById('header-container');
    if (!container) return;

    const { title, subtitle, userName, userAvatar, showIcon } = options;

    let actionsHtml = '';
    if (showIcon) {
        actionsHtml = `
            <button class="icon-btn"><i class="fa-regular fa-bell"></i></button>
            <button class="icon-btn"><i class="fa-regular fa-message"></i></button>
        `;
    }

    container.innerHTML = `
        <div class="header-titles">
            <h1>${title}</h1>
            <p>${subtitle}</p>
        </div>
        <div class="header-actions">
            ${actionsHtml}
            <div class="user-dropdown">
                <img src="${userAvatar}" alt="${userName}">
                <span style="font-weight: 500; font-size: 14px;">${userName}</span>
                <i class="fa-solid fa-caret-down" style="padding-left: 5px;"></i>
            </div>
        </div>
    `;
}
