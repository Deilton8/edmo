document.addEventListener('DOMContentLoaded', () => {
    // ========== 1. CONSTANTS AND SELECTORS ==========
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const carousel = document.getElementById('partnerCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const whatsappForm = document.getElementById('whatsappForm');
    const sections = document.querySelectorAll('.section');
    const carouselDots = document.getElementById('carouselDots');

    // ========== 2. UTILITY FUNCTIONS ==========
    const debounce = (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    const createElement = (tag, className = '', innerHTML = '') => {
        const el = document.createElement(tag);
        if (className) el.className = className;
        if (innerHTML) el.innerHTML = innerHTML;
        return el;
    };

    // ========== 3. MOBILE MENU ==========
    if (mobileMenuButton && mobileMenu) {
        // Close menu on load
        mobileMenu.classList.add('hidden');

        // Toggle menu with animation
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenuButton.classList.toggle('active');

            // Add slide animation
            if (!mobileMenu.classList.contains('hidden')) {
                mobileMenu.style.animation = 'slideDown 0.3s ease-out forwards';
            }
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!mobileMenu.contains(e.target) &&
                !mobileMenuButton.contains(e.target) &&
                !mobileMenu.classList.contains('hidden')) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.classList.remove('active');
            }
        });
    }

    // ========== 4. SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            const targetId = anchor.getAttribute('href');
            if (targetId === '#') return;

            e.preventDefault();
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Close mobile menu
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                    mobileMenuButton.classList.remove('active');
                }

                // Calculate scroll position with offset for fixed header
                const headerOffset = 80;
                const elementPosition = targetElement.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                // Smooth scroll
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== 5. SCROLL ANIMATIONS ==========
    function checkSectionsVisibility() {
        const windowHeight = window.innerHeight;
        const triggerPoint = 100;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < windowHeight - triggerPoint) {
                section.classList.add('visible');
            }
        });
    }

    // Initial check and debounced scroll listener
    checkSectionsVisibility();
    window.addEventListener('scroll', debounce(checkSectionsVisibility, 50));

    // ========== 6. CLEAN AUTO CAROUSEL ==========
    function initCleanAutoCarousel() {
        const carousel = document.getElementById('autoCarousel');
        if (!carousel) return;

        // Partner logos array
        const partnerLogos = [
            'images/ayuda-en-accion.png',
            'images/bci.png',
            'images/cdm.png',
            'images/cummins.png',
            'images/cvm.png',
            'images/dupont.png',
            'images/fedexpng.png',
            'images/Fipag.png',
            'images/Honeywell-Logo.png',
            'images/Intercape-Logo.png',
            'images/kb.png',
            'images/logo-dhl.png',
            'images/msf.png',
            'images/pd.png',
            'images/pna.png',
            'images/stc.png',
            'images/tcg.png',
            'images/tmcel.png',
            'images/UD-Trucks-Logo.png',
            'images/unicef.png',
            'images/waltons.png',
            'images/woodmead.png'
        ];

        // Create duplicate set for seamless loop
        const allLogos = [...partnerLogos, ...partnerLogos];

        // Create carousel track
        const carouselTrack = document.createElement('div');
        carouselTrack.className = 'auto-carousel-track';
        carousel.appendChild(carouselTrack);

        // Create logo elements - versão simplificada
        allLogos.forEach((logo, index) => {
            const logoContainer = document.createElement('div');
            logoContainer.className = 'partner-logo';

            const img = document.createElement('img');
            img.src = logo;
            img.alt = `Partner Logo`;
            img.loading = 'lazy';
            // Fallback para imagens quebradas
            img.onerror = function () {
                this.style.display = 'none';
                const placeholder = document.createElement('div');
                placeholder.className = 'w-12 h-12 bg-gray-100 rounded';
                logoContainer.appendChild(placeholder);
            };

            logoContainer.appendChild(img);
            carouselTrack.appendChild(logoContainer);
        });

        // Ajustar velocidade baseada no tamanho da tela
        function adjustAnimationSpeed() {
            const isMobile = window.innerWidth < 768;
            const duration = isMobile ? '40s' : '60s';
            carouselTrack.style.animationDuration = duration;
        }

        // Ajustar na inicialização e redimensionamento
        window.addEventListener('load', adjustAnimationSpeed);
        window.addEventListener('resize', debounce(adjustAnimationSpeed, 250));

        // Ajuste inicial
        setTimeout(adjustAnimationSpeed, 100);

        // Suporte a touch para mobile
        let touchStartX = 0;
        let isDragging = false;

        carouselTrack.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
            isDragging = true;
            carouselTrack.style.animationPlayState = 'paused';
        });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!isDragging) return;
            e.preventDefault();
            const touchX = e.touches[0].clientX;
            const diff = touchStartX - touchX;
            carouselTrack.scrollLeft += diff;
            touchStartX = touchX;
        });

        carouselTrack.addEventListener('touchend', () => {
            isDragging = false;
            // Retomar animação após 2 segundos
            setTimeout(() => {
                carouselTrack.style.animationPlayState = 'running';
            }, 2000);
        });

        // Suporte a scroll do mouse (opcional)
        let scrollTimer;
        carouselTrack.addEventListener('wheel', (e) => {
            e.preventDefault();
            carouselTrack.style.animationPlayState = 'paused';

            // Scrolling manual
            carouselTrack.scrollLeft += e.deltaY;

            // Limpar timer anterior
            clearTimeout(scrollTimer);

            // Retomar animação após 3 segundos de inatividade
            scrollTimer = setTimeout(() => {
                carouselTrack.style.animationPlayState = 'running';
            }, 3000);
        });

        // Pause/play com tecla espaço
        document.addEventListener('keydown', (e) => {
            if (e.code === 'Space' && document.activeElement === document.body) {
                e.preventDefault();
                if (carouselTrack.style.animationPlayState === 'paused') {
                    carouselTrack.style.animationPlayState = 'running';
                } else {
                    carouselTrack.style.animationPlayState = 'paused';
                }
            }
        });
    }

    initCleanAutoCarousel();

    // ========== 7. WHATSAPP FORM ==========
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            // Show loading state
            const submitBtn = whatsappForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.innerHTML;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i>Sending...';
            submitBtn.disabled = true;

            // Get form data
            const phoneNumber = "258844862630";
            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const service = document.getElementById('service')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            // Format message
            const whatsappMessage = `*New Contact Request - EDMO Africa Trading*\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n` +
                `*Service:* ${service}\n` +
                `*Message:* ${message}\n\n` +
                `_Sent via website contact form_`;

            // Create WhatsApp URL
            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;

            // Open WhatsApp with delay to show loading state
            setTimeout(() => {
                window.open(url, '_blank');

                // Reset button after delay
                setTimeout(() => {
                    submitBtn.innerHTML = originalText;
                    submitBtn.disabled = false;

                    // Show success message
                    showNotification('Message ready to send! Opening WhatsApp...', 'success');

                    // Reset form
                    whatsappForm.reset();
                }, 1000);
            }, 1500);
        });

        // Form validation
        const formInputs = whatsappForm.querySelectorAll('input, textarea, select');
        formInputs.forEach(input => {
            input.addEventListener('blur', () => {
                if (input.value.trim() && input.hasAttribute('required')) {
                    input.classList.add('valid');
                    input.classList.remove('invalid');
                } else if (!input.value.trim() && input.hasAttribute('required')) {
                    input.classList.add('invalid');
                    input.classList.remove('valid');
                }
            });
        });
    }

    // ========== 8. BACK TO TOP BUTTON ==========
    if (backToTopBtn) {
        // Show/hide based on scroll
        const toggleBackToTop = () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
                backToTopBtn.classList.add('animate-fade-in');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        };

        window.addEventListener('scroll', debounce(toggleBackToTop, 100));

        // Click handler
        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // ========== 9. ACTIVE NAV LINK HIGHLIGHTING ==========
    function updateActiveNavLink() {
        const scrollPosition = window.scrollY + 100;

        document.querySelectorAll('section[id]').forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            const sectionId = section.getAttribute('id');

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                document.querySelectorAll('nav a').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', debounce(updateActiveNavLink, 100));

    // ========== 10. NOTIFICATION SYSTEM ==========
    function showNotification(message, type = 'info') {
        const notification = createElement('div',
            `fixed top-6 right-6 z-50 p-4 rounded-lg shadow-xl transform translate-x-full transition-transform duration-300 notification ${type}`);

        const icon = type === 'success' ? 'fa-check-circle' :
            type === 'error' ? 'fa-exclamation-circle' :
                type === 'warning' ? 'fa-exclamation-triangle' : 'fa-info-circle';

        notification.innerHTML = `
            <div class="flex items-center gap-3">
                <i class="fas ${icon} text-lg ${type === 'success' ? 'text-emerald-300' :
                type === 'error' ? 'text-red-300' :
                    type === 'warning' ? 'text-yellow-300' : 'text-blue-300'}"></i>
                <span class="text-white">${message}</span>
            </div>
        `;

        // Style based on type
        const bgColor = type === 'success' ? 'bg-emerald-600' :
            type === 'error' ? 'bg-red-600' :
                type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600';
        notification.classList.add(bgColor);

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.classList.remove('translate-x-full');
        }, 10);

        // Remove after delay
        setTimeout(() => {
            notification.classList.add('translate-x-full');
            setTimeout(() => {
                notification.remove();
            }, 300);
        }, 5000);
    }

    // ========== 11. PARALLAX EFFECT ==========
    function initParallax() {
        const heroSection = document.querySelector('.hero-bg');
        if (!heroSection) return;

        window.addEventListener('scroll', () => {
            const scrolled = window.pageYOffset;
            const rate = scrolled * -0.5;
            heroSection.style.transform = `translate3d(0px, ${rate}px, 0px)`;
        });
    }

    initParallax();

    // ========== 12. LAZY LOADING IMAGES ==========
    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src || img.src;
                    img.classList.add('loaded');
                    observer.unobserve(img);
                }
            });
        });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    initLazyLoading();

    // ========== 13. SCROLL PROGRESS BAR ==========
    function initScrollProgress() {
        const progressBar = createElement('div', 'scroll-progress');
        document.body.appendChild(progressBar);

        window.addEventListener('scroll', () => {
            const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
            const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const scrolled = (winScroll / height) * 100;
            progressBar.style.width = scrolled + "%";
        });
    }

    initScrollProgress();

    // ========== 15. COPYRIGHT YEAR ==========
    function updateCopyrightYear() {
        const yearElements = document.querySelectorAll('[data-current-year]');
        const currentYear = new Date().getFullYear();
        yearElements.forEach(el => {
            el.textContent = currentYear;
        });
    }

    updateCopyrightYear();

    // ========== 16. INITIAL ANIMATIONS ==========
    function initPageAnimations() {
        // Add initial animation classes
        document.querySelectorAll('.animate-on-load').forEach((el, index) => {
            el.style.animationDelay = `${index * 0.1}s`;
        });

        // Add loading animation
        const loader = createElement('div',
            'fixed inset-0 bg-gradient-to-br from-blue-900 to-emerald-600 z-50 flex items-center justify-center transition-opacity duration-500');
        loader.innerHTML = `
            <div class="text-center">
                <div class="w-20 h-20 border-4 border-white border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <div class="text-white text-lg font-semibold">Loading...</div>
            </div>
        `;

        document.body.appendChild(loader);

        // Remove loader after page load
        window.addEventListener('load', () => {
            setTimeout(() => {
                loader.style.opacity = '0';
                setTimeout(() => loader.remove(), 500);
            }, 500);
        });
    }

    initPageAnimations();
});

// ========== 17. GOOGLE TRANSLATE INTEGRATION ==========
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'pt,en',
        autoDisplay: false
    }, 'google_translate_element');
}

function translatePage(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
}

// ========== 18. GLOBAL FUNCTIONS ==========
window.showNotification = function (message, type = 'info') {
    // Simple notification if the main one isn't available
    const notification = document.createElement('div');
    notification.className = `fixed bottom-4 right-4 bg-${type === 'success' ? 'green' : 'blue'}-600 text-white px-4 py-2 rounded-lg shadow-lg`;
    notification.textContent = message;
    notification.style.zIndex = '9999';

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
};

// ========== 19. PERFORMANCE OPTIMIZATIONS ==========
// Preload critical images
function preloadImages() {
    const criticalImages = [
        'images/logo.png',
        'images/logo2.png'
    ];

    criticalImages.forEach(src => {
        const img = new Image();
        img.src = src;
    });
}

preloadImages();

// ========== DOCUMENTS SECTION FUNCTIONALITY ==========
function initDocumentsSection() {
    // Track document views
    const documentLinks = document.querySelectorAll('a[href*=".pdf"]');

    documentLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            const documentName = this.closest('.document-card')?.querySelector('h3')?.textContent || 'Unknown Document';

            // Log document view (you can send this to analytics)
            console.log(`Document viewed: ${documentName}`);

            // Optional: Show loading state
            const originalText = this.innerHTML;
            this.innerHTML = '<i class="fas fa-spinner fa-spin mr-2"></i> Opening...';
            this.disabled = true;

            // Reset button after 2 seconds
            setTimeout(() => {
                this.innerHTML = originalText;
                this.disabled = false;
            }, 2000);

            // Optional: Send analytics event
            if (typeof gtag !== 'undefined') {
                gtag('event', 'document_view', {
                    'document_name': documentName,
                    'event_category': 'Documents',
                    'event_label': 'PDF View'
                });
            }
        });
    });

    // Add download progress simulation
    const downloadButtons = document.querySelectorAll('.download-btn');

    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            if (!this.href.includes('.pdf')) return;

            e.preventDefault();
            const url = this.href;
            const fileName = url.split('/').pop();

            // Show download progress
            const progress = document.createElement('div');
            progress.className = 'fixed bottom-4 right-4 bg-blue-900 text-white p-4 rounded-lg shadow-xl z-50';
            progress.innerHTML = `
                <div class="flex items-center gap-3">
                    <i class="fas fa-download text-emerald-300"></i>
                    <div>
                        <div class="font-medium">Downloading ${fileName}</div>
                        <div class="w-32 h-1 bg-gray-700 mt-2 rounded-full overflow-hidden">
                            <div class="h-full bg-emerald-300 progress-bar" style="width: 0%"></div>
                        </div>
                    </div>
                </div>
            `;

            document.body.appendChild(progress);

            // Simulate download progress
            let width = 0;
            const interval = setInterval(() => {
                width += 10;
                const progressBar = progress.querySelector('.progress-bar');
                if (progressBar) {
                    progressBar.style.width = `${width}%`;
                }

                if (width >= 100) {
                    clearInterval(interval);
                    setTimeout(() => {
                        // Actually trigger download
                        window.open(url, '_blank');

                        // Remove progress indicator
                        progress.style.opacity = '0';
                        progress.style.transform = 'translateY(20px)';
                        setTimeout(() => progress.remove(), 300);
                    }, 300);
                }
            }, 50);
        });
    });

    // Document search functionality (optional)
    const documentSearch = document.createElement('div');
    documentSearch.className = 'max-w-md mx-auto mb-12';
    documentSearch.innerHTML = `
        <div class="relative group">
            <input type="text" 
                   placeholder="Search documents by company or type..." 
                   class="w-full px-4 py-3 pl-12 bg-white border border-gray-300 rounded-xl focus:outline-none focus:border-emerald-300 focus:ring-2 focus:ring-emerald-300/20 transition-all duration-300"
                   id="documentSearch">
            <div class="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-300 transition-colors duration-300">
                <i class="fas fa-search"></i>
            </div>
        </div>
    `;

    // Insert search if needed (optional)
    const documentsSection = document.getElementById('documents');
    if (documentsSection) {
        const grid = documentsSection.querySelector('.grid');
        if (grid) {
            // Insert search before grid (optional)
            // grid.parentNode.insertBefore(documentSearch, grid);
        }
    }

    // Add keyboard shortcuts for document navigation
    document.addEventListener('keydown', (e) => {
        if (e.ctrlKey && e.key === 'f' && documentsSection) {
            e.preventDefault();
            const searchInput = document.getElementById('documentSearch');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
    });

    // Add PDF preview modal functionality
    const pdfViewButtons = document.querySelectorAll('[data-pdf-preview]');

    pdfViewButtons.forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            const pdfUrl = this.getAttribute('data-pdf-preview');

            // Create modal
            const modal = document.createElement('div');
            modal.className = 'fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4';
            modal.innerHTML = `
                <div class="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
                    <div class="flex items-center justify-between p-4 border-b">
                        <h3 class="text-lg font-semibold text-gray-800">PDF Preview</h3>
                        <button class="text-gray-400 hover:text-gray-600 p-2 rounded-full hover:bg-gray-100 transition-colors duration-200 close-modal">
                            <i class="fas fa-times text-xl"></i>
                        </button>
                    </div>
                    <div class="p-4 h-[calc(90vh-80px)]">
                        <iframe src="${pdfUrl}" class="w-full h-full border-0 rounded-lg" loading="lazy"></iframe>
                    </div>
                    <div class="p-4 border-t bg-gray-50 flex justify-between items-center">
                        <div class="text-sm text-gray-600">
                            <i class="fas fa-info-circle mr-2"></i>
                            Use Ctrl + scroll to zoom in/out
                        </div>
                        <a href="${pdfUrl}" download class="inline-flex items-center gap-2 bg-emerald-300 hover:bg-emerald-400 text-white px-4 py-2 rounded-lg transition-colors duration-200">
                            <i class="fas fa-download"></i>
                            Download
                        </a>
                    </div>
                </div>
            `;

            document.body.appendChild(modal);
            document.body.style.overflow = 'hidden';

            // Close modal functionality
            const closeBtn = modal.querySelector('.close-modal');
            closeBtn.addEventListener('click', () => {
                modal.style.opacity = '0';
                setTimeout(() => {
                    modal.remove();
                    document.body.style.overflow = '';
                }, 300);
            });

            // Close on escape key
            modal.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') {
                    closeBtn.click();
                }
            });

            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    closeBtn.click();
                }
            });
        });
    });

    // Add document counter
    const documentCount = document.querySelectorAll('.document-card').length;
    const countElement = document.querySelector('[data-document-count]');
    if (countElement) {
        countElement.textContent = documentCount;
    }
}
initDocumentsSection();