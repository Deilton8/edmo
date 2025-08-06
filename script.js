document.addEventListener('DOMContentLoaded', () => {
    // Seletores principais
    const mobileMenu = document.querySelector('.mobile-menu');
    const mobileMenuButton = document.querySelector('.mobile-menu-button');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const carousel = document.getElementById('partnerCarousel');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const whatsappForm = document.getElementById('whatsappForm');
    const sections = document.querySelectorAll('.section');

    // 1. Fecha o menu mobile ao carregar a página (se estiver aberto)
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }

    // 2. Toggle menu mobile
    if (mobileMenuButton && mobileMenu) {
        mobileMenuButton.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
        });
    }

    // 3. Smooth scroll para links de navegação
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = anchor.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                // Fecha menu mobile ao clicar em link
                if (mobileMenu) {
                    mobileMenu.classList.add('hidden');
                }

                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // 4. Animação ao scroll para seções
    function checkSectionsVisibility() {
        const windowHeight = window.innerHeight;

        sections.forEach(section => {
            const sectionTop = section.getBoundingClientRect().top;

            if (sectionTop < windowHeight - 100) {
                section.classList.add('visible');
            }
        });
    }

    checkSectionsVisibility(); // Inicial

    window.addEventListener('scroll', checkSectionsVisibility);

    // 5. Carrossel de parceiros
    if (carousel && prevBtn && nextBtn) {
        let currentIndex = 0;
        const totalSlides = carousel.children.length;

        function showSlide(index) {
            carousel.style.transform = `translateX(${-index * 100}%)`;
        }

        nextBtn.addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        });

        prevBtn.addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            showSlide(currentIndex);
        });

        // Auto-slide a cada 4 segundos
        setInterval(() => {
            currentIndex = (currentIndex + 1) % totalSlides;
            showSlide(currentIndex);
        }, 4000);
    }

    // 6. Envio do formulário via WhatsApp
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const phoneNumber = "258876063000";

            const name = document.getElementById('name')?.value.trim() || '';
            const email = document.getElementById('email')?.value.trim() || '';
            const phone = document.getElementById('phone')?.value.trim() || '';
            const service = document.getElementById('service')?.value.trim() || '';
            const message = document.getElementById('message')?.value.trim() || '';

            const whatsappMessage = `*New Contact Request - EDMO Africa Trading*\n` +
                `*Name:* ${name}\n` +
                `*Email:* ${email}\n` +
                `*Phone:* ${phone}\n` +
                `*Service:* ${service}\n` +
                `*Message:* ${message}`;

            const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
            window.open(url, '_blank');
        });
    }

    // 7. Botão voltar ao topo
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 300) {
                backToTopBtn.classList.remove('hidden');
            } else {
                backToTopBtn.classList.add('hidden');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }
});

// 8. Integração Google Translate (fora do DOMContentLoaded para global)
// Inicializa o widget do Google Translate
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
        includedLanguages: 'pt,en',
        autoDisplay: false
    }, 'google_translate_element');
}

// Função para trocar idioma via Google Translate
function translatePage(lang) {
    const select = document.querySelector('.goog-te-combo');
    if (select) {
        select.value = lang;
        select.dispatchEvent(new Event('change'));
    }
}