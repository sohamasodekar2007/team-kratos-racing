document.addEventListener('DOMContentLoaded', () => {
    
    // 1. PRELOADER LOGIC
    const preloader = document.getElementById('preloader');
    
    if (preloader) {
        // Wait for animations to complete (3 seconds - text finishes at ~2.4s)
        setTimeout(() => {
            preloader.style.opacity = '0';
            setTimeout(() => {
                preloader.style.display = 'none';
                // Trigger Hero Animations after preloader is gone
                triggerHeroAnimations();
            }, 500);
        }, 4000); 
    } else {
        // If no preloader (subpages), trigger animations immediately
        triggerHeroAnimations();
    }

    // 2. SCROLL OBSERVER (Enhanced)
    const observerOptions = {
        threshold: 0.05, // Trigger earlier (better for long grids on mobile)
        rootMargin: "0px 0px -50px 0px"
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                // Standard Fade elements
                if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // Run once
                }

                // Staggered Grids (.gallery-grid, .team-grid, .sponsor-grid)
                if (entry.target.classList.contains('stagger-grid')) {
                    const children = entry.target.children;
                    Array.from(children).forEach((child, index) => {
                        child.style.transitionDelay = `${index * 100}ms`; // 100ms delay per item
                        child.classList.add('visible');
                    });
                     observer.unobserve(entry.target);
                }
            }
        });
    }, observerOptions);

    // Observe standard elements
    document.querySelectorAll('.fade-in-up').forEach(el => observer.observe(el));

    // Observe Grids for Staggering
    // We need to add 'stagger-grid' class to containers and 'stagger-item' to children
    // Let's do this dynamically to avoid editing all HTML files manually
    const grids = document.querySelectorAll('.gallery-grid, .team-grid, .sponsor-grid, .stats-grid');
    grids.forEach(grid => {
        grid.classList.add('stagger-grid'); // Add marker class
        observer.observe(grid); // Observe the container
        
        // Prepare children
        Array.from(grid.children).forEach(child => {
            child.classList.add('stagger-item');
            // Remove legacy fade classes if present to avoid conflict
            child.classList.remove('fade-in-up'); 
        });
    });


    function triggerHeroAnimations() {
        const heroElements = document.querySelectorAll('.hero-content .fade-in-up');
        heroElements.forEach(el => {
            el.classList.add('visible');
        });
    }

    // 3. NAVBAR SCROLL EFFECT
    const navbar = document.querySelector('.navbar');
    
    // Check if we are on homepage (transparent to solid) or subpage (always solid)
    // On subpages, we updated the inline style for background, but the class logic is good to keep
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // 4. ACTIVE LINK HIGHLIGHTING (URL Based)
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-links a');
    
    navLinks.forEach(link => {
        link.classList.remove('active');
        const href = link.getAttribute('href');
        if (href === currentPath) {
            link.classList.add('active');
        }
        
        // Mobile: Close menu on click
        link.addEventListener('click', () => {
             const navMenu = document.querySelector('.nav-links');
             const hamburger = document.querySelector('.hamburger');
             navMenu.classList.remove('active');
             hamburger.classList.remove('active');
        });
    });

    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-links');

    if(hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }

    // 5. ANIMATED COUNTERS
    // We want to start counting when the stats section is visible
    const statsSection = document.querySelector('.stats-grid, .modern-stats-grid');
    let counted = false;

    const statsObserver = new IntersectionObserver((entries) => {
        if(entries[0].isIntersecting && !counted) {
            counted = true;
            // Support both old (.count) and new (.stat-number) selectors
            document.querySelectorAll('.count, .stat-number').forEach(counter => {
                const target = +counter.getAttribute('data-target');
                const startValue = +counter.getAttribute('data-start') || 0;
                const duration = +counter.getAttribute('data-duration') || 2000; // ms
                
                let currentCount = startValue;
                const startTime = performance.now();
                
                const updateCounter = (currentTime) => {
                    const elapsed = currentTime - startTime;
                    const progress = Math.min(elapsed / duration, 1);
                    
                    // Easing: easeOutExpo (more dramatic)
                    const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                    
                    currentCount = startValue + (target - startValue) * easeProgress;
                    
                    if (progress < 1) {
                        counter.innerText = Math.round(currentCount);
                        requestAnimationFrame(updateCounter);
                    } else {
                        counter.innerText = target;
                    }
                };
                requestAnimationFrame(updateCounter);
            });
        }
    }, { threshold: 0.5 });

    if(statsSection) {
        statsObserver.observe(statsSection);
    }

    // 6. THEME TOGGLE
    const themeToggle = document.getElementById('theme-toggle');
    
    // Check for saved theme preference or default to 'dark'
    const currentTheme = localStorage.getItem('theme') || 'dark';
    if (currentTheme === 'light') {
        document.body.classList.add('light-theme');
    }
    
    if(themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            
            // Save theme preference
            const theme = document.body.classList.contains('light-theme') ? 'light' : 'dark';
            localStorage.setItem('theme', theme);
        });
    }

    // 5. GALLERY LIGHTBOX LOGIC
    const lightbox = document.getElementById('gallery-lightbox');
    
    if (lightbox) {
        const lightboxImg = document.getElementById('lightbox-img');
        const closeBtn = document.querySelector('.lightbox-close');
        
        // Open Lightbox
        document.querySelectorAll('.gallery-item').forEach(item => {
            item.addEventListener('click', function() {
                const img = this.querySelector('img');
                if (img) {
                    lightbox.style.display = "flex";
                    lightboxImg.src = img.src;
                    lightboxImg.alt = img.alt;
                    document.body.style.overflow = 'hidden'; // Prevent scrolling
                }
            });
        });
        
        // Close Lightbox (Button)
        closeBtn.addEventListener('click', () => {
            lightbox.style.display = "none";
            document.body.style.overflow = ''; // Restore scrolling
        });
        
        // Close Lightbox (Click Outside)
        lightbox.addEventListener('click', (e) => {
            if (e.target === lightbox) {
                lightbox.style.display = "none";
                document.body.style.overflow = '';
            }
        });
        
        // Close on Escape Key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && lightbox.style.display === "flex") {
                lightbox.style.display = "none";
                document.body.style.overflow = '';
            }
        });
    }

    // 6. GOD-TIER KINETIC SCROLL (Velocity + Skew + Lerp)
    // 6. GOD-TIER KINETIC SCROLL (Velocity + Skew + Lerp)
    const kineticSection = document.querySelector('.kinetic-scroll-section');
    if (kineticSection) {
        const trackLeft = document.querySelector('.track-left');
        const trackRight = document.querySelector('.track-right');
        
        let currentScroll = window.scrollY;
        let targetScroll = window.scrollY;
        let skew = 0;
        
        // Physics Configurations
        const ease = 0.075; // Smoothness
        
        function animate() {
            // 1. Calculate Velocity (Skew)
            targetScroll = window.scrollY;
            let diff = targetScroll - currentScroll;
            currentScroll += diff * ease;
            
            let skewForce = diff * 0.15;
            // Clamp skew
            if(skewForce > 15) skewForce = 15;
            if(skewForce < -15) skewForce = -15;

            // 2. Calculate Centered Position (Parallax)
            // We want the translation to be 0 when the section is in the middle of the viewport
            // sectionOffset is where the section starts.
            // When window.scrollY + window.innerHeight/2 approx equals kineticSection.offsetTop + height/2
            
            const sectionOffset = kineticSection.offsetTop;
            const sectionHeight = kineticSection.offsetHeight;
            const centerPoint = sectionOffset - (window.innerHeight / 2) + (sectionHeight / 2);
            
            // Distance from center
            const dist = window.scrollY - centerPoint;
            
            // Move tracks based on distance from center
            // Track 1 (Left): Moves left as we scroll down
            const posLeft = dist * -0.5; 
            
            // Track 2 (Right): Moves right as we scroll down
            const posRight = dist * 0.5;
            
            // Apply Transforms
            if(trackLeft) {
                trackLeft.style.transform = `translate3d(${posLeft}px, 0, 0) skewX(${skewForce}deg)`;
            }
            
            if(trackRight) {
                trackRight.style.transform = `translate3d(${posRight}px, 0, 0) skewX(${skewForce}deg)`;
            }

            requestAnimationFrame(animate);
        }
        
        requestAnimationFrame(animate);
    }

});

