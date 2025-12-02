// Portfolio Website - Main JavaScript
// ============================================================================

// ============================================================================
// Navigation & Scroll Effects
// ============================================================================

// Navbar scroll effect
const navbar = document.getElementById('navbar');
const hamburger = document.getElementById('hamburger');
const navMenu = document.getElementById('navMenu');
const navLinks = document.querySelectorAll('.nav-link');

window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Mobile menu toggle
hamburger.addEventListener('click', () => {
    navMenu.classList.toggle('active');
    hamburger.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        hamburger.classList.remove('active');
    });
});

// Active nav link on scroll
const sections = document.querySelectorAll('.section, .hero');
const observerOptions = {
    threshold: 0.3,
    rootMargin: '-100px'
};

const observerCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const id = entry.target.id;
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${id}`) {
                    link.classList.add('active');
                }
            });
        }
    });
};

const observer = new IntersectionObserver(observerCallback, observerOptions);
sections.forEach(section => observer.observe(section));

// ============================================================================
// Back to Top Button
// ============================================================================

const backToTopButton = document.getElementById('backToTop');

window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
        backToTopButton.classList.add('show');
    } else {
        backToTopButton.classList.remove('show');
    }
});

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// ============================================================================
// Contact Form Handler
// ============================================================================

const contactForm = document.getElementById('contactForm');

contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Log to console (in production, this would send to a backend)
    console.log('Form submitted:', formData);

    // Show success message
    alert('Message sent successfully! (Note: This is a demo. In production, this would send to a backend service.)');

    // Reset form
    contactForm.reset();
});

// ============================================================================
// Skill Progress Bars Animation
// ============================================================================

const skillObserverOptions = {
    threshold: 0.5
};

const skillObserverCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const progressBars = entry.target.querySelectorAll('.skill-progress');
            progressBars.forEach(bar => {
                bar.style.width = bar.parentElement.parentElement.dataset.progress || bar.style.width;
            });
        }
    });
};

const skillObserver = new IntersectionObserver(skillObserverCallback, skillObserverOptions);
const skillsSections = document.querySelectorAll('.skill-category');
skillsSections.forEach(section => skillObserver.observe(section));

// ============================================================================
// Smooth Scroll for Anchor Links
// ============================================================================

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// ============================================================================
// Intersection Observer for Fade-in Animations
// ============================================================================

const fadeInOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const fadeInCallback = (entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
};

const fadeInObserver = new IntersectionObserver(fadeInCallback, fadeInOptions);

// Add fade-in effect to cards
const cards = document.querySelectorAll('.project-card, .blog-card, .skill-category, .timeline-item');
cards.forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    fadeInObserver.observe(card);
});

// ============================================================================
// Dynamic Year in Footer
// ============================================================================

const currentYear = new Date().getFullYear();
const footerYear = document.querySelector('.footer-bottom p');
if (footerYear) {
    footerYear.innerHTML = footerYear.innerHTML.replace('2024', currentYear);
}

// ============================================================================
// Particle Animation for Hero Section
// ============================================================================

function createParticles() {
    const heroParticles = document.querySelector('.hero-particles');
    if (!heroParticles) return;

    for (let i = 0; i < 20; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        particle.style.cssText = `
            position: absolute;
            width: ${Math.random() * 4 + 2}px;
            height: ${Math.random() * 4 + 2}px;
            background: radial-gradient(circle, rgba(99, 102, 241, 0.8), transparent);
            border-radius: 50%;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
            animation: float-particle ${Math.random() * 10 + 10}s linear infinite;
            animation-delay: ${Math.random() * 5}s;
        `;
        heroParticles.appendChild(particle);
    }
}

// Add particle animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes float-particle {
        0% {
            transform: translateY(0) translateX(0);
            opacity: 0;
        }
        10% {
            opacity: 1;
        }
        90% {
            opacity: 1;
        }
        100% {
            transform: translateY(-100vh) translateX(${Math.random() * 100 - 50}px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Initialize particles on load
window.addEventListener('load', createParticles);

// ============================================================================
// Typing Effect for Hero Subtitle
// ============================================================================

function typeWriter(element, text, speed = 100) {
    let i = 0;
    const originalText = element.textContent;
    element.textContent = '';

    function type() {
        if (i < text.length) {
            element.textContent += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }

    type();
}

// ============================================================================
// Medium RSS Feed Integration (REPLACED WITH DYNAMIC FETCHER)
// ============================================================================

// Initialize Social Data Fetcher
let socialDataFetcher;
let socialDataUI;

async function initializeSocialData() {
    // Initialize the fetcher and UI
    socialDataFetcher = new SocialDataFetcher();
    socialDataUI = new SocialDataUI(socialDataFetcher);

    // Load initial data (from cache or API)
    await socialDataUI.updateAllData(false);
}

// ============================================================================
// Initialize
// ============================================================================

document.addEventListener('DOMContentLoaded', () => {
    console.log('Portfolio website loaded successfully!');

    // Initialize social data fetcher
    initializeSocialData();

    // Add event listener to refresh button
    const refreshBtn = document.getElementById('refreshDataBtn');
    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            socialDataUI.updateAllData(true); // Force refresh
        });
    }
});


// ============================================================================
// Custom Cursor Effect (Optional Enhancement)
// ============================================================================

function initCustomCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    cursor.style.cssText = `
        position: fixed;
        width: 20px;
        height: 20px;
        border: 2px solid #6366f1;
        border-radius: 50%;
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.2s ease, border-color 0.2s ease;
        display: none;
    `;
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX - 10 + 'px';
        cursor.style.top = e.clientY - 10 + 'px';
        cursor.style.display = 'block';
    });

    document.querySelectorAll('a, button').forEach(element => {
        element.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.borderColor = '#ec4899';
        });
        element.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.borderColor = '#6366f1';
        });
    });
}

// Uncomment to enable custom cursor (optional)
// initCustomCursor();

// ============================================================================
// Analytics & Tracking (Placeholder)
// ============================================================================

function trackEvent(category, action, label) {
    // Placeholder for analytics tracking
    // In production, integrate with Google Analytics, Plausible, etc.
    console.log('Track Event:', { category, action, label });
}

// Track project clicks
document.querySelectorAll('.project-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Projects', 'Click', link.textContent);
    });
});

// Track blog article clicks
document.querySelectorAll('.blog-link').forEach(link => {
    link.addEventListener('click', () => {
        trackEvent('Blog', 'Click', link.closest('.blog-card').querySelector('h3').textContent);
    });
});

// ============================================================================
// Dark Mode Toggle (Future Enhancement)
// ============================================================================

// Placeholder for dark mode toggle functionality
// The current design is already dark-themed
function toggleDarkMode() {
    document.body.classList.toggle('light-mode');
    localStorage.setItem('theme', document.body.classList.contains('light-mode') ? 'light' : 'dark');
}

// Check for saved theme preference
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'light') {
    document.body.classList.add('light-mode');
}
