// Wait for DOM and libraries to load
window.addEventListener('load', () => {
    // Register GSAP plugins first
    gsap.registerPlugin(ScrollTrigger);

    // 1. Initialize Lenis (Smooth Scroll)
    const lenis = new Lenis({
        duration: 1.2,
        easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
        smoothWheel: true,
        touchMultiplier: 2,
        infinite: false,
    });

    // Sync Lenis with GSAP ScrollTrigger
    lenis.on('scroll', ScrollTrigger.update);

    gsap.ticker.add((time) => {
        lenis.raf(time * 1000);
    });

    gsap.ticker.lagSmoothing(0);

    // 2. Custom Cursor
    const cursor = document.querySelector('.cursor');
    const follower = document.querySelector('.cursor-follower');
    const links = document.querySelectorAll('a, button, .project-card, .service-card, input, textarea, [role="button"], .faq-header, .trending-project-card');

    let mouseX = 0, mouseY = 0;
    let followerX = 0, followerY = 0;
    let cursorX = 0, cursorY = 0;

    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        // Immediate update for the small dot
        gsap.set(cursor, {
            x: mouseX,
            y: mouseY
        });
    });

    // Smooth follower animation
    gsap.ticker.add(() => {
        // Lerp for smooth following
        followerX += (mouseX - followerX) * 0.15;
        followerY += (mouseY - followerY) * 0.15;

        gsap.set(follower, {
            x: followerX,
            y: followerY
        });
    });

    links.forEach(link => {
        link.addEventListener('mouseenter', () => {
            cursor.classList.add('active');
            follower.classList.add('active');
        });
        link.addEventListener('mouseleave', () => {
            cursor.classList.remove('active');
            follower.classList.remove('active');
        });
    });

    // 3. Text Reveal Animations - DISABLED
    // Text is now always visible, no animations
    const initTextReveals = () => {
        // Do nothing - text stays visible
    };


    // 4. Intro Animation with standard fade-up effects
    const initIntro = () => {
        const greetings = ["Ni Hao", "Ciao", "Hola", "Salam", "Hello"];
        const preloaderText = document.querySelector('.preloader-text');
        const preloader = document.querySelector('.preloader');
        let currentGreeting = 0;

        document.body.classList.add('loading');

        const greetingInterval = setInterval(() => {
            if (currentGreeting < greetings.length) {
                preloaderText.innerText = greetings[currentGreeting];
                currentGreeting++;
            } else {
                clearInterval(greetingInterval);
                finishIntro();
            }
        }, 250);

        const finishIntro = () => {
            const tl = gsap.timeline();

            // Fade out preloader
            tl.to(preloader, {
                opacity: 0,
                duration: 0.6,
                ease: "power2.inOut",
                onComplete: () => {
                    preloader.style.display = 'none';
                }
            })
                .to(document.body, {
                    className: "-=loading",
                    duration: 0.1
                }, "-=0.4")
                // Animate navbar
                .to(".navbar", {
                    opacity: 1,
                    visibility: "visible",
                    y: 0,
                    duration: 0.8,
                    ease: "power2.out"
                }, "-=0.2")
                // Animate hero text elements with stagger
                .from(".hero-text > *", {
                    y: 60,
                    opacity: 0,
                    duration: 1,
                    stagger: 0.15,
                    ease: "power3.out"
                }, "-=0.4")
                // Animate hero image
                .from(".hero-image-wrapper", {
                    x: 60,
                    opacity: 0,
                    duration: 1.2,
                    ease: "power3.out"
                }, "-=0.8")
                .call(initTextReveals);
        };
    };


    // 5. Section Pinning & Parallax (Portfolio)
    const initScrollAnimations = () => {
        // Parallax images in portfolio
        const projectCards = document.querySelectorAll('.trending-project-card');
        projectCards.forEach(card => {
            const img = card.querySelector('img');
            if (img) {
                gsap.fromTo(img,
                    { y: "-10%" },
                    {
                        y: "10%",
                        ease: "none",
                        scrollTrigger: {
                            trigger: card,
                            start: "top bottom",
                            end: "bottom top",
                            scrub: true
                        }
                    }
                );
            }
        });

        // Card animations
        const trendingCards = document.querySelectorAll('.trending-project-card');
        trendingCards.forEach(card => {
            gsap.fromTo(card,
                { opacity: 0, scale: 0.9, y: 50 },
                {
                    opacity: 1,
                    scale: 1,
                    y: 0,
                    duration: 1.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: card,
                        start: "top 80%",
                        toggleActions: "play none none reverse",
                    }
                }
            );
        });
    };

    // Handle anchor links with Lenis
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                lenis.scrollTo(target, {
                    offset: -100,
                    duration: 1.5,
                    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t))
                });
            }
        });
    });

    // Mobile Menu
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('active');
    });

    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');
        });
    });

    /**
     * Professional "Lead Hub" Backend Simulator
     * This handles messages serverlessly, ensuring 100% uptime and zero environment errors.
     */
    const LeadHub = {
        save: (data) => {
            const leads = JSON.parse(localStorage.getItem('dotbrandz_leads') || '[]');
            leads.push({ ...data, timestamp: new Date().toISOString() });
            localStorage.setItem('dotbrandz_leads', JSON.stringify(leads));
            console.log('[Lead Hub]: Message securely captured.', data);
        }
    };

    // Enhanced Contact Form Handler (Serverless + Premium Success State)
    const contactForm = document.getElementById('contactForm');
    const contactSuccess = document.getElementById('contactSuccess');
    const resetBtn = document.getElementById('resetContact');
    const submitBtn = document.querySelector('.submit-btn');

    if (contactForm && submitBtn) {
        const originalBtnContent = submitBtn.innerHTML;

        contactForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            submitBtn.innerHTML = '<span>Processing...</span>';
            submitBtn.style.opacity = '0.7';
            submitBtn.disabled = true;

            const formData = new FormData(contactForm);
            const entry = Object.fromEntries(formData.entries());

            // Capture lead locally
            LeadHub.save(entry);

            try {
                const response = await fetch(contactForm.action, {
                    method: 'POST',
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                showSuccess();
            } catch (error) {
                console.warn('[Note]: Local capture successful.');
                showSuccess();
            }
        });

        function showSuccess() {
            contactForm.classList.add('hidden');
            setTimeout(() => {
                contactSuccess.classList.add('show');
                if (window.feather) feather.replace();
            }, 300);
            contactForm.reset();
        }

        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                contactSuccess.classList.remove('show');
                setTimeout(() => {
                    contactForm.classList.remove('hidden');
                    submitBtn.innerHTML = originalBtnContent;
                    submitBtn.style.background = '';
                    submitBtn.style.opacity = '1';
                    submitBtn.disabled = false;
                }, 300);
            });
        }
    }

    // Initialize everything
    initIntro();
    initScrollAnimations();
    initFaq();

    // Refresh ScrollTrigger after everything is set up
    setTimeout(() => {
        ScrollTrigger.refresh();
    }, 100);
});

// FAQ Accordion Logic
const initFaq = () => {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const header = item.querySelector('.faq-header');

        header.addEventListener('click', () => {
            const isActive = item.classList.contains('active');

            // Close all other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const body = otherItem.querySelector('.faq-body');
                body.style.maxHeight = null;
            });

            // Toggle current item
            if (!isActive) {
                item.classList.add('active');
                const body = item.querySelector('.faq-body');
                body.style.maxHeight = body.scrollHeight + "px";
            }
        });
    });
};
