/**
 * EDMO Africa Trading - Core Script
 * Professional, Fluid & Awwwards-inspired interactions
 */

document.addEventListener('DOMContentLoaded', () => {

    // --- 1. SELETORES GLOBAIS ---
    const nav = document.getElementById('main-nav');
    const menuToggle = document.getElementById('menu-toggle');
    const menuOverlay = document.getElementById('menu-overlay');
    const overlayLinks = document.querySelectorAll('.overlay-link');
    const backToTopBtn = document.getElementById('backToTopBtn');
    const sections = document.querySelectorAll('.section');

    // --- 2. GESTÃO DO MENU & NAVEGAÇÃO ---

    // Toggle do Menu Overlay
    const toggleMenu = () => {
        const isOpen = menuToggle.classList.toggle('active'); // Adiciona/remove 'active' no botão
        menuOverlay.classList.toggle('active');             // Adiciona/remove 'active' no menu
        document.body.style.overflow = isOpen ? 'hidden' : '';
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Fecha ao clicar nos links (smooth scroll interno)
    overlayLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            // Se for um link interno, fecha o menu
            if (link.getAttribute('href').startsWith('#')) {
                toggleMenu();
            }
        });
    });

    // Efeito de Scroll no Header
    const handleScroll = () => {
        const scrollY = window.scrollY;
        const navLogo = document.getElementById('nav-logo');

        if (scrollY > 100) {
            nav.classList.add('nav-scrolled');
            navLogo.classList.remove('brightness-0', 'invert'); // Volta às cores originais
        } else {
            nav.classList.remove('nav-scrolled');
            navLogo.classList.add('brightness-0', 'invert');
        }

        // Botão Back to Top
        if (scrollY > 600) {
            backToTopBtn.classList.remove('hidden', 'animate__fadeOutDown');
            backToTopBtn.classList.add('block', 'animate__animated', 'animate__fadeInUp');
        } else {
            backToTopBtn.classList.add('animate__fadeOutDown');
        }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    // --- 3. REVEAL ANIMATIONS (Intersection Observer) ---
    // Faz as seções surgirem suavemente enquanto o usuário desce a página
    const revealOptions = {
        threshold: 0.15,
        rootMargin: "0px 0px -50px 0px"
    };

    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // Opcional: parar de observar após animar
                // revealObserver.unobserve(entry.target);
            }
        });
    }, revealOptions);

    sections.forEach(section => {
        revealObserver.observe(section);
    });

    // --- 4. CARROSSEL DE PARCEIROS (Logística) ---
    const initCarousel = () => {
        const carousel = document.getElementById('partnerCarousel');
        if (!carousel) return;

        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');

        const scrollAmount = 300;

        nextBtn?.addEventListener('click', () => {
            carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn?.addEventListener('click', () => {
            carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });
    };
    initCarousel();

    // --- 5. WHATSAPP FORM HANDLER ---
    const whatsappForm = document.getElementById('whatsappForm');
    if (whatsappForm) {
        whatsappForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const service = document.getElementById('service').value;
            const message = document.getElementById('message').value;

            // Número da EDMO (Exemplo)
            const phone = "258840000000";

            const text = `Olá, meu nome é ${name}. Gostaria de falar sobre ${service}. %0A Mensagem: ${message}`;
            const whatsappUrl = `https://wa.me/${phone}?text=${text}`;

            window.open(whatsappUrl, '_blank');
        });
    }

    // --- 6. DOCUMENT MODAL (Secção de Downloads) ---
    // Caso tenha a funcionalidade de ver documentos/certificados
    window.initDocumentsSection = () => {
        const docCards = document.querySelectorAll('.document-card');

        docCards.forEach(card => {
            card.addEventListener('click', () => {
                const docTitle = card.querySelector('h3').innerText;
                // Aqui você poderia abrir um modal real ou baixar o arquivo
                console.log(`A abrir: ${docTitle}`);

                // Feedback visual de clique profissional
                card.style.transform = 'scale(0.98)';
                setTimeout(() => card.style.transform = '', 150);
            });
        });
    };
    initDocumentsSection();

    // --- 7. BACK TO TOP CLICK ---
    backToTopBtn?.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

});

/**
 * BÓNUS: Efeito de Cursor Personalizado (Típico Awwwards)
 * Adicione apenas se quiser um toque extra de luxo.
 */
const initCustomCursor = () => {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor hidden md:block';
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Estilo básico para o cursor via JS (para não sujar o CSS se não quiser)
    Object.assign(cursor.style, {
        position: 'fixed',
        width: '20px',
        height: '20px',
        background: 'rgba(16, 185, 129, 0.3)',
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: '9999',
        transition: 'transform 0.1s ease',
        backdropFilter: 'blur(2px)'
    });
};
initCustomCursor(); // Descomente para ativar