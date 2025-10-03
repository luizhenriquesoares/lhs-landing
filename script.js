// ========================================
// Mobile Navigation Toggle
// ========================================
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');

        // Animate hamburger
        const spans = hamburger.querySelectorAll('span');
        if (navMenu.classList.contains('active')) {
            spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
            spans[1].style.opacity = '0';
            spans[2].style.transform = 'rotate(-45deg) translate(7px, -6px)';
        } else {
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        }
    });

    // Close mobile menu when clicking on a link
    document.querySelectorAll('.nav-menu a').forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
            const spans = hamburger.querySelectorAll('span');
            spans[0].style.transform = 'none';
            spans[1].style.opacity = '1';
            spans[2].style.transform = 'none';
        });
    });
}

// ========================================
// Navbar Scroll Effect
// ========================================
let lastScroll = 0;
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;

    if (currentScroll <= 0) {
        navbar.style.boxShadow = 'none';
        return;
    }

    if (currentScroll > lastScroll) {
        // Scrolling down
        navbar.style.transform = 'translateY(-100%)';
    } else {
        // Scrolling up
        navbar.style.transform = 'translateY(0)';
        navbar.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.3)';
    }

    lastScroll = currentScroll;
});

// ========================================
// Specialization Select Functionality
// ========================================
const specializationSelect = document.getElementById('specialization');
const hireBtn = document.querySelector('.hire-btn');

if (specializationSelect && hireBtn) {
    hireBtn.addEventListener('click', () => {
        const selectedSpecialization = specializationSelect.value;
        
        if (!selectedSpecialization) {
            // Show notification or highlight the select
            specializationSelect.style.borderColor = '#FF6B6B';
            specializationSelect.focus();
            
            setTimeout(() => {
                specializationSelect.style.borderColor = '#666666';
            }, 2000);
            return;
        }

        // Simulate hiring process
        hireBtn.innerHTML = 'Processing... <span class="arrow">⏳</span>';
        hireBtn.disabled = true;

        setTimeout(() => {
            showNotification(`Great! We're finding ${selectedSpecialization} developers for you...`, 'success');
            hireBtn.innerHTML = 'Hire developer now <span class="arrow">→</span>';
            hireBtn.disabled = false;
        }, 2000);
    });
}

// ========================================
// Developer Cards Interaction
// ========================================
const developerCards = document.querySelectorAll('.developer-card');

developerCards.forEach(card => {
    card.addEventListener('click', () => {
        const devName = card.querySelector('.dev-name span:first-child').textContent;
        const devTitle = card.querySelector('.dev-title').textContent;
        
        showNotification(`Interested in ${devName} - ${devTitle}? Contact us to learn more!`, 'info');
    });

    // Add hover effects
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});

// ========================================
// Stats Counter Animation
// ========================================
function animateCounter(element, target, duration = 2000) {
    const start = 0;
    const increment = target / (duration / 16); // 60 FPS
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target + (element.dataset.suffix || '');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current) + (element.dataset.suffix || '');
        }
    }, 16);
}

// Trigger counter animation when stats are visible
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
            const statNumber = entry.target.querySelector('.stat-number');
            if (statNumber) {
                const text = statNumber.textContent;
                const number = parseInt(text.replace(/[^\d]/g, ''));
                const suffix = text.replace(/[\d]/g, '');
                
                if (number) {
                    statNumber.dataset.suffix = suffix;
                    animateCounter(statNumber, number, 2000);
                }
            }
            entry.target.classList.add('counted');
        }
    });
}, { threshold: 0.5 });

document.querySelectorAll('.stat-card').forEach(stat => {
    statsObserver.observe(stat);
});

// ========================================
// Notification System
// ========================================
function showNotification(message, type = 'success') {
    // Remove existing notifications
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;

    // Add styles
    const colors = {
        success: '#00FF88',
        error: '#FF6B6B',
        info: '#FFD700'
    };

    Object.assign(notification.style, {
        position: 'fixed',
        top: '100px',
        right: '20px',
        padding: '1rem 2rem',
        borderRadius: '10px',
        backgroundColor: colors[type] || colors.success,
        color: '#000000',
        fontWeight: '600',
        boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)',
        zIndex: '10000',
        animation: 'slideIn 0.3s ease',
        maxWidth: '400px',
        border: '1px solid rgba(255, 255, 255, 0.2)'
    });

    document.body.appendChild(notification);

    // Auto remove after 4 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 4000);
}

// Add animation keyframes
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }

    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// ========================================
// Smooth Scroll for Navigation Links
// ========================================
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));

        if (target) {
            const offsetTop = target.offsetTop - 80; // Account for fixed navbar
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ========================================
// Parallax Effect on Hero
// ========================================
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroContent = document.querySelector('.hero-content');
    const heroBackground = document.querySelector('.hero-background');

    if (heroContent && scrolled < window.innerHeight) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
    }

    if (heroBackground && scrolled < window.innerHeight) {
        heroBackground.style.transform = `translateY(${scrolled * 0.1}px)`;
    }
});

// ========================================
// Loading Animation
// ========================================
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s ease';
        document.body.style.opacity = '1';
    }, 100);
});

// ========================================
// Console Message
// ========================================
console.log('%c🚀 LHS Global Digital', 'font-size: 20px; font-weight: bold; color: #FFD700;');
console.log('%cHire experienced developers fast, on budget, and with flexibility', 'font-size: 14px; color: #00FF88;');
console.log('%cReady to build your next project? Let\'s get started!', 'font-size: 12px; color: #FFFFFF;');