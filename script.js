/* ================================================
   TRAVEL DESIGNER — Interactions & Animations
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {
    /* ---------- STICKY HEADER ---------- */
    const header = document.getElementById('header');
    const scrollThreshold = 80;

    function handleHeaderScroll() {
        if (window.scrollY > scrollThreshold) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    window.addEventListener('scroll', handleHeaderScroll, { passive: true });
    handleHeaderScroll();

    /* ---------- HAMBURGER MENU ---------- */
    const hamburger = document.getElementById('hamburger');
    const nav = document.getElementById('nav');

    hamburger.addEventListener('click', () => {
        hamburger.classList.toggle('active');
        nav.classList.toggle('open');
        document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    });

    // Close menu on resize if screen becomes large
    window.addEventListener('resize', () => {
        if (window.innerWidth > 768 && nav.classList.contains('open')) {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        }
    });

    // Close mobile menu on link click
    nav.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            nav.classList.remove('open');
            document.body.style.overflow = '';
        });
    });


    /* ---------- ACCORDION TOGGLE ---------- */
    const accordionToggle = (e) => {
        const header = e.target.closest('.accordion-header');
        if (!header) return;

        const item = header.closest('.accordion-item');
        const accordion = header.closest('.accordion');
        if (!item || !accordion) return;

        // Close all other items in the same container
        accordion.querySelectorAll('.accordion-item').forEach(otherItem => {
            if (otherItem !== item) {
                otherItem.classList.remove('active');
            }
        });

        // Toggle current item
        item.classList.toggle('active');
    };
    document.addEventListener('click', accordionToggle);

    

    /* ---------- SCROLL REVEAL ---------- */
    const revealElements = document.querySelectorAll('.reveal');

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObserver.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => revealObserver.observe(el));

    /* ---------- DESTINATIONS CAROUSEL ---------- */
    const track = document.getElementById('carouselTrack');
    const prevBtn = document.getElementById('carouselPrev');
    const nextBtn = document.getElementById('carouselNext');
    const dotsContainer = document.getElementById('carouselDots');
    const slides = track ? track.querySelectorAll('.carousel-slide') : [];

    let currentIndex = 0;
    let slidesPerView = 4;
    let totalPages = 1;

    function updateSlidesPerView() {
        const width = window.innerWidth;
        if (width <= 480) slidesPerView = 1;
        else if (width <= 768) slidesPerView = 2;
        else if (width <= 1024) slidesPerView = 3;
        else slidesPerView = 4;

        totalPages = Math.max(1, slides.length - slidesPerView + 1);
        if (currentIndex >= totalPages) currentIndex = totalPages - 1;
    }

    function moveCarousel() {
        if (!track || slides.length === 0) return;

        const slide = slides[0];
        const slideWidth = slide.offsetWidth;
        const gap = 12;
        const offset = currentIndex * (slideWidth + gap);
        track.style.transform = `translateX(-${offset}px)`;
        updateDots();
    }

    function createDots() {
        if (!dotsContainer) return;
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
            const dot = document.createElement('button');
            dot.className = `carousel-dot${i === currentIndex ? ' active' : ''}`;
            dot.setAttribute('aria-label', `Page ${i + 1}`);
            dot.addEventListener('click', () => {
                currentIndex = i;
                moveCarousel();
            });
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentIndex);
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(0, currentIndex - 1);
            moveCarousel();
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            currentIndex = Math.min(totalPages - 1, currentIndex + 1);
            moveCarousel();
        });
    }

    function initCarousel() {
        updateSlidesPerView();
        createDots();
        moveCarousel();
    }

    // Debounced resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            updateSlidesPerView();
            createDots();
            moveCarousel();
        }, 150);
    });

    initCarousel();

    /* ---------- TOUCH SWIPE FOR CAROUSEL ---------- */
    let touchStartX = 0;
    let touchEndX = 0;

    if (track) {
        track.addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        track.addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) {
                if (diff > 0) {
                    currentIndex = Math.min(totalPages - 1, currentIndex + 1);
                } else {
                    currentIndex = Math.max(0, currentIndex - 1);
                }
                moveCarousel();
            }
        }, { passive: true });
    }

    /* ---------- SMOOTH SCROLL FOR ANCHOR LINKS ---------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const href = anchor.getAttribute('href');
            if (href === '#' || href.length <= 1) return;

            const target = document.querySelector(href);
            if (target) {
                e.preventDefault();
                const offset = header.offsetHeight + 10;
                const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    /* ---------- PARALLAX HERO (subtle) ---------- */
    const heroBg = document.querySelector('.hero-bg');
    if (heroBg) {
        window.addEventListener('scroll', () => {
            const scrolled = window.scrollY;
            if (scrolled < window.innerHeight) {
                heroBg.style.transform = `scale(1.05) translateY(${scrolled * 0.15}px)`;
            }
        }, { passive: true });
    }

});
