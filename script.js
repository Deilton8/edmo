// Fecha o menu mobile ao carregar a página
document.addEventListener('DOMContentLoaded', () => {
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.mobile-menu-button');
const mobileMenu = document.querySelector('.mobile-menu');

mobileMenuButton.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();

        const targetId = this.getAttribute('href');
        const targetElement = document.querySelector(targetId);

        if (targetElement) {
            // Close mobile menu if open
            mobileMenu.classList.add('hidden');

            window.scrollTo({
                top: targetElement.offsetTop - 80,
                behavior: 'smooth'
            });
        }
    });
});

// Scroll animation for sections
const sections = document.querySelectorAll('.section');

function checkScroll() {
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const windowHeight = window.innerHeight;

        if (sectionTop < windowHeight - 100) {
            section.classList.add('visible');
        }
    });
}

// Partner carousel functionality
const carousel = document.getElementById('partnerCarousel');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');

let index = 0;
const totalSlides = carousel.children.length;

function showSlide(i) {
    carousel.style.transform = `translateX(${-i * 100}%)`;
}

nextBtn.addEventListener('click', () => {
    index = (index + 1) % totalSlides;
    showSlide(index);
});

prevBtn.addEventListener('click', () => {
    index = (index - 1 + totalSlides) % totalSlides;
    showSlide(index);
});

// Auto-slide every 4 seconds
setInterval(() => {
    index = (index + 1) % totalSlides;
    showSlide(index);
}, 4000);

// WhatsApp form submission
document.getElementById('whatsappForm').addEventListener('submit', function (e) {
    e.preventDefault();

    // Replace with your WhatsApp number in international format (without + or spaces)
    const phoneNumber = "258844862630";

    // Get form values
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const service = document.getElementById('service').value.trim();
    const message = document.getElementById('message').value.trim();

    // Create WhatsApp message
    const whatsappMessage = `Hello, my name is ${name}.
Email: ${email}
Phone: ${phone}
Service Needed: ${service}
Message: ${message}`;

    // Encode and open WhatsApp
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(url, '_blank');
});

const backToTopBtn = document.getElementById('backToTopBtn');

// Show or hide button on scroll
window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
        backToTopBtn.classList.remove('hidden');
    } else {
        backToTopBtn.classList.add('hidden');
    }
});

// Smooth scroll to top
backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Google Translate integration
function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'pt',
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

    // Fechar menu mobile após clicar num botão de tradução
    const mobileMenu = document.querySelector('.mobile-menu');
    if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
        mobileMenu.classList.add('hidden');
    }
}

// Initial check
checkScroll();

// Check on scroll
window.addEventListener('scroll', checkScroll);