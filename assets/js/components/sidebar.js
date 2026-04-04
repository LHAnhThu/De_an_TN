function loadSidebar(role, activePage) {
    const container = document.getElementById('sidebar-container');
    if (!container) return;

    let html = '';

    if (role === 'admin') {
        html = `
            <div class="sidebar-header">
                <div class="logo">
                    <img src="../assets/img/XinkEdu_logo.png" alt="XINKEDU">
                    <span>XINKEDU</span>
                </div>
                <i class="fa-solid fa-bars menu-toggle" style="font-size: 20px; cursor: pointer; color: #64748b;"></i>
            </div>
            
            <div class="user-profile-box">
                <img src="../assets/img/user_avatar.png" alt="User">
                <div class="user-info">
                    <h4>Hi, Phuoc</h4>
                    <p>ADMIN</p>
                </div>
            </div>

            <nav class="sidebar-menu">
                <a href="courses_grid.html" class="menu-item ${activePage === 'courses' ? 'active' : ''}">
                    <i class="fa-solid fa-book"></i>
                    <span>Course Management</span>
                </a>
                <a href="students_list.html" class="menu-item ${activePage === 'students' ? 'active' : ''}">
                    <i class="fa-solid fa-user-graduate"></i>
                    <span>Student Management</span>
                </a>
                <a href="class_allocation.html" class="menu-item ${activePage === 'class_allocation' ? 'active' : ''}">
                    <i class="fa-solid fa-users-rectangle"></i>
                    <span>Class Allocation</span>
                </a>
                <a href="teaching_management.html" class="menu-item ${activePage === 'teaching_management' ? 'active' : ''}">
                    <i class="fa-solid fa-person-chalkboard"></i>
                    <span>Teaching Management</span>
                </a>
            </nav>
            <a href="../login.html" class="logout-btn">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>LOGOUT</span>
            </a>
        `;
    } else if (role === 'teacher') {
        html = `
            <div class="sidebar-header">
                <div class="logo">
                    <img src="../assets/img/XinkEdu_logo.png" alt="XINKEDU">
                    <span>XINKEDU</span>
                </div>
                <i class="fa-solid fa-bars menu-toggle" style="font-size: 20px; cursor: pointer; color: #64748b;"></i>
            </div>
            
            <div class="user-profile-box">
                <img src="../assets/img/user_avatar.png" alt="User">
                <div class="user-info">
                    <h4>Hi, Ngan</h4>
                    <p>TEACHER</p>
                </div>
            </div>

            <nav class="sidebar-menu">
                <a href="home.html" class="menu-item ${activePage === 'home' ? 'active' : ''}">
                    <i class="fa-solid fa-house"></i>
                    <span>Home</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'income' ? 'active' : ''}">
                    <i class="fa-solid fa-dollar-sign"></i>
                    <span>Income</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'your_classes' ? 'active' : ''}">
                    <i class="fa-solid fa-book-open"></i>
                    <span>Your classes</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'chat_with_xink' ? 'active' : ''}">
                    <i class="fa-solid fa-message"></i>
                    <span>Chat with Xink</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'notifications' ? 'active' : ''}">
                    <i class="fa-solid fa-bell"></i>
                    <span>Notifications</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'contracts' ? 'active' : ''}">
                    <i class="fa-solid fa-file-contract"></i>
                    <span>Contracts</span>
                </a>
                <a href="#" class="menu-item ${activePage === 'policies' ? 'active' : ''}">
                    <i class="fa-solid fa-scale-balanced"></i>
                    <span>Policies</span>
                </a>
            </nav>
            <a href="../login.html" class="logout-btn">
                <i class="fa-solid fa-right-from-bracket"></i>
                <span>LOGOUT</span>
            </a>
        `;
    }

    container.innerHTML = html;

    // Attach Toggle Event
    const toggleBtn = container.querySelector('.menu-toggle');
    if (toggleBtn) {
        toggleBtn.addEventListener('click', () => {
            document.body.classList.toggle('sidebar-collapsed');
        });
    }
}
