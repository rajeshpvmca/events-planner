document.addEventListener('DOMContentLoaded', () => {
    // Auth Guard
    const user = JSON.parse(localStorage.getItem('loggedInUser'));
    if (!user) {
        window.location.href = 'login.html';
        return;
    }

    // Populate navbar
    const navUserName = document.getElementById('navUserName');
    const navUserEmail = document.getElementById('navUserEmail');
    const userAvatar = document.getElementById('userAvatar');
    const roleBadge = document.getElementById('roleBadge');

    if (navUserName) navUserName.textContent = user.name;
    if (navUserEmail) navUserEmail.textContent = user.email;
    if (userAvatar) userAvatar.textContent = user.name.charAt(0).toUpperCase();

    // Show role badge & correct nav
    const role = user.role || 'User';
    if (roleBadge) roleBadge.textContent = role;

    const navCustomer = document.getElementById('navCustomer');
    const navPlanner = document.getElementById('navPlanner');
    const navVendor = document.getElementById('navVendor');

    if (navCustomer) navCustomer.style.display = role === 'Customer' ? 'block' : 'none';
    if (navPlanner) navPlanner.style.display = role === 'Planner' ? 'block' : 'none';
    if (navVendor) navVendor.style.display = role === 'Vendor' ? 'block' : 'none';

    // Signout Logic
    const signoutBtn = document.getElementById('signoutBtn');
    if (signoutBtn) {
        signoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('loggedInUser');
            sessionStorage.removeItem('dashPage');
            window.location.href = 'index.html';
        });
    }

    // Active link & iframe navigation
    const frame = document.getElementById('dashFrame');
    const links = document.querySelectorAll('.sidebar-nav a');

    // Define default pages for each role
    const roleDefaults = {
        'Customer': 'customer_overview',
        'Planner': 'planner_overview',
        'Vendor': 'vendor_overview'
    };

    // Restore last page
    const lastPage = sessionStorage.getItem('dashPage') || roleDefaults[role];
    if (frame) {
        frame.src = 'dashboard/' + lastPage + '.html';
        links.forEach(a => {
            a.classList.toggle('active', a.dataset.page === lastPage);
        });
    }

    links.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const page = link.dataset.page;
            const href = link.getAttribute('href');

            if (!page || href === "#" || href === "") {
                window.location.href = 'index.html';
                return;
            }

            if (frame) frame.src = href;
            sessionStorage.setItem('dashPage', page);
            links.forEach(a => a.classList.remove('active'));
            link.classList.add('active');
            if (window.innerWidth < 992) closeSidebar();
        });
    });

    // Mobile sidebar toggle
    const sidebar = document.getElementById('dashSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const sidebarToggle = document.getElementById('sidebarToggle');

    function openSidebar() {
        if (sidebar) sidebar.classList.add('active');
        if (overlay) overlay.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeSidebar() {
        if (sidebar) sidebar.classList.remove('active');
        if (overlay) overlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.contains('active') ? closeSidebar() : openSidebar();
        });
    }
    if (overlay) overlay.addEventListener('click', closeSidebar);

    // Pass user to iframe pages via postMessage when frame loads
    if (frame) {
        frame.addEventListener('load', () => {
            try {
                frame.contentWindow.postMessage({ type: 'DASH_USER', user }, '*');
            } catch(e) {}
        });
    }
});

// Global Handler for Empty Links (404 Redirection)
document.addEventListener("click", function(e) {
    const target = e.target.closest("a");
    if (target) {
        const href = target.getAttribute("href");
        if (!href || href === "#" || href === "" || href.startsWith("#!")) {
            e.preventDefault();
            const currentPath = window.location.pathname;
            const inSubfolder = currentPath.includes('/dashboard/');
            window.location.href = inSubfolder ? '../404.html' : '404.html';
        }
    }
});
