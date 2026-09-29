document.addEventListener('DOMContentLoaded', () => {
    

        // Load Header
        fetch('header.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                document.getElementById('site-header').innerHTML = data;
                
                // Set active link based on current URL
                const currentPath = window.location.pathname.split('/').pop() || 'index.html';
                const navLinks = document.querySelectorAll('#site-header .nav-link');
                
                navLinks.forEach(link => {
                    link.classList.remove('active'); // Clear existing active classes
                    const linkHref = link.getAttribute('href');
                    if (linkHref === currentPath) {
                        link.classList.add('active');
                    }
                });
            })
            .catch(error => {
                console.error('Error loading header:', error);
                document.getElementById('site-header').innerHTML = '<div class="alert alert-danger m-3 text-center"><strong>Warning:</strong> Header could not be loaded. If you are opening this file locally without a server, please use a local server like Live Server to view it.</div>';
            });

        // Load Footer
        fetch('footer.html')
            .then(response => {
                if (!response.ok) throw new Error('Network response was not ok');
                return response.text();
            })
            .then(data => {
                document.getElementById('site-footer').innerHTML = data;
            })
            .catch(error => {
                console.error('Error loading footer:', error);
            });
            
});
