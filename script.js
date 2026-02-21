document.addEventListener('DOMContentLoaded', () => {
    // Render Speakers from JSON
    const renderSpeakers = () => {
        const speakersData = JSON.parse(document.getElementById('speakersData').textContent);
        const speakersContainer = document.getElementById('speakersContainer');
        
        if (!speakersContainer || !speakersData) return;

        const getInitials = (name) => {
            return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
        };

        speakersContainer.innerHTML = speakersData.map(speaker => {
            const initials = getInitials(speaker.name);
            const isPlaceholder = speaker.image.includes('placeholder');
            
            return `<div class="speaker-card">
                <div class="speaker-image${isPlaceholder ? ' speaker-image-placeholder' : ''}" ${isPlaceholder ? `data-initials="${initials}"` : ''}>
                    ${!isPlaceholder ? `<img src="${speaker.image}" alt="${speaker.name}" style="width:100%; height:100%; object-fit:cover; object-position: top;">` : ''}
                </div>
                <div class="speaker-content">
                    <h3 class="speaker-name">${speaker.name}</h3>
                    <p class="speaker-title">${speaker.title}</p>
                    <p class="speaker-organization">${speaker.organization}</p>
                    <p class="speaker-location"><i class="fas fa-map-marker-alt"></i> ${speaker.location}</p>
                    
                    <div class="speaker-details">
                        ${speaker.keynoteTitle ? `<strong>Keynote: ${speaker.keynoteTitle}</strong>` : ''}
                        ${speaker.date ? `<strong>Date:</strong> ${speaker.date}` : ''}
                        ${speaker.time ? `<strong>Time:</strong> ${speaker.time}${speaker.timezone ? ' (' + speaker.timezone + ')' : ''}` : ''}
                        ${speaker.duration ? `<strong>Duration:</strong> ${speaker.duration}` : ''}
                        ${speaker.role ? `<strong>Role:</strong> ${speaker.role}` : ''}
                        ${speaker.profile ? `<strong>Profile:</strong> ${speaker.profile}` : ''}
                        ${speaker.notes ? `<strong>Notes:</strong> ${speaker.notes}` : ''}
                    </div>

                    <div class="speaker-contact">
                        <div class="speaker-email">
                            <strong>Email:</strong><br>
                            <a href="mailto:${speaker.email}">${speaker.email}</a>
                        </div>
                        ${speaker.orcid ? `<div class="speaker-link">
                            <strong><a href="${speaker.orcid}" target="_blank"><i class="fas fa-link"></i> ORCID Profile</a></strong>
                        </div>` : ''}
                    </div>
                </div>
            </div>`;
        }).join('');

        // Add animation to speaker cards
        const speakerCards = document.querySelectorAll('.speaker-card');
        speakerCards.forEach(card => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px) scale(0.95)';
            card.style.transition = 'opacity 0.7s cubic-bezier(.2,.9,.2,1), transform 0.7s cubic-bezier(.2,.9,.2,1)';
        });

        // Use existing observer for animations
        const observerOptions = {
            threshold: 0.1
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    observer.unobserve(entry.target);
                }
            });
        }, observerOptions);

        speakerCards.forEach(card => observer.observe(card));
    };

    renderSpeakers();

    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    // Toggle Mobile Navigation
    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');

        // Animate Links
        links.forEach((link, index) => {
            if (link.style.animation) {
                link.style.animation = '';
            } else {
                link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.3}s`;
            }
        });

        // Burger Animation
        hamburger.classList.toggle('toggle');
    });

    // Smooth Scrolling for Anchors
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            // Close mobile menu if open
            if (navLinks.classList.contains('nav-active')) {
                navLinks.classList.remove('nav-active');
                hamburger.classList.remove('toggle');
                links.forEach(link => link.style.animation = '');
            }

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Navbar Scroll Effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 1)';
            navbar.style.boxShadow = '0 5px 20px rgba(0,0,0,0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
        }
    });

    // Intersection Observer for Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const animatedElements = document.querySelectorAll('.about-card, .committee-column, .topic-item, .fees-table, .publication-info, .brouchure img');

    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px) scale(0.95)';
        el.style.transition = 'opacity 0.7s cubic-bezier(.2,.9,.2,1), transform 0.7s cubic-bezier(.2,.9,.2,1)';
        observer.observe(el);
    });

    // Image Lightbox for Brochure
    const lightbox = document.getElementById('imageLightbox');
    const lightboxImg = lightbox ? lightbox.querySelector('.lightbox-img') : null;
    const lightboxClose = lightbox ? lightbox.querySelector('.lightbox-close') : null;

    function openLightbox(fromImgEl) {
        if (!lightbox || !lightboxImg || !fromImgEl) return;

        const rect = fromImgEl.getBoundingClientRect();
        lightboxImg.src = fromImgEl.src;
        lightboxImg.alt = fromImgEl.alt || '';

        lightbox.classList.add('open', 'animating');
        lightbox.setAttribute('aria-hidden', 'false');

        // Start from the clicked image's on-screen box
        Object.assign(lightboxImg.style, {
            top: rect.top + 'px',
            left: rect.left + 'px',
            width: rect.width + 'px',
            height: rect.height + 'px'
        });

        // Prevent scroll
        document.body.style.overflow = 'hidden';

        const animateToCenter = () => {
            const vw = window.innerWidth;
            const vh = window.innerHeight;
            const natW = lightboxImg.naturalWidth || rect.width;
            const natH = lightboxImg.naturalHeight || rect.height;
            const scale = Math.min((vw * 0.92) / natW, (vh * 0.85) / natH);
            const targetW = Math.round(natW * scale);
            const targetH = Math.round(natH * scale);
            const targetLeft = Math.round((vw - targetW) / 2);
            const targetTop = Math.round((vh - targetH) / 2);

            // Transition to centered box
            requestAnimationFrame(() => {
                Object.assign(lightboxImg.style, {
                    top: targetTop + 'px',
                    left: targetLeft + 'px',
                    width: targetW + 'px',
                    height: targetH + 'px'
                });
            });
        };

        if (lightboxImg.complete) {
            animateToCenter();
        } else {
            lightboxImg.addEventListener('load', animateToCenter, { once: true });
        }

        const onTransitionEnd = (e) => {
            if (e.target !== lightboxImg) return;
            lightbox.classList.remove('animating');
            lightboxImg.style.top = '';
            lightboxImg.style.left = '';
            lightboxImg.style.width = '';
            lightboxImg.style.height = '';
            lightboxImg.removeEventListener('transitionend', onTransitionEnd);
        };

        lightboxImg.addEventListener('transitionend', onTransitionEnd);
    }

    function closeLightbox() {
        if (!lightbox || !lightboxImg) return;
        lightbox.classList.remove('open');
        lightbox.classList.remove('animating');
        lightbox.setAttribute('aria-hidden', 'true');
        lightboxImg.src = '';
        lightboxImg.style.top = '';
        lightboxImg.style.left = '';
        lightboxImg.style.width = '';
        lightboxImg.style.height = '';
        document.body.style.overflow = '';
    }

    // Delegate click: open when clicking images inside .brouchure
    document.addEventListener('click', (e) => {
        const img = e.target.closest('img');
        if (img && img.closest('.brouchure')) {
            e.preventDefault();
            openLightbox(img);
            return;
        }

        // Close when clicking on overlay or close button
        if (lightbox && (e.target === lightbox || e.target === lightboxClose)) {
            closeLightbox();
        }
    });

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeLightbox();
        }
    });
});
