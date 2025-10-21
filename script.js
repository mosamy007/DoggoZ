// DoggoZ Official Website JavaScript - Simplified with Slideshow
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DoggoZ Website Loaded Successfully!');

    try {
        // Initialize the website
        initWebsite();

        // Add glitch effect to logo
        glitchLogo();

        // Initialize slideshow
        initSlideshow();

    } catch (error) {
        console.error('❌ JavaScript initialization error:', error);
    }
});

// Initialize website functionality
function initWebsite() {
    console.log('🔧 Initializing website...');

    // Add smooth scrolling behavior
    document.documentElement.style.scrollBehavior = 'smooth';

    // Add click handlers for navigation buttons
    setupNavigation();

    // Add parallax effect to scanlines
    setupParallax();

    console.log('✅ Website initialized');
}

// Setup navigation functionality
function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');

    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.onclick.toString().match(/'([^']+)'/)[1];
            scrollToSection(sectionId);
        });
    });
}

// Smooth scroll to section
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// Add glitch effect to logo
function glitchLogo() {
    const logo = document.querySelector('.logo h1');
    if (!logo) return;

    setInterval(() => {
        if (Math.random() < 0.1) { // 10% chance every interval
            const originalText = logo.innerHTML;
            const glitchedText = originalText.replace('Z', 'Z̷̨͈̆͛̍͋');
            logo.innerHTML = glitchedText;

            setTimeout(() => {
                logo.innerHTML = originalText;
            }, 100);
        }
    }, 2000);
}

// Setup parallax effect for scanlines
function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
            scanlines.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// Slideshow functionality
let currentSlide = 0;
let slideInterval;

// Initialize slideshow
function initSlideshow() {
    console.log('🎬 Initializing slideshow...');

    // Featured GIF for hero section
    setFeaturedGif();

    // Setup dynamic slideshow from folder
    setupDynamicSlideshow();

    // Start auto-advance
    startSlideshow();
}

// Set featured GIF in hero section
function setFeaturedGif() {
    const heroImage = document.querySelector('.hero-art');
    if (heroImage) {
        // Use the featured NFT from your featured-gifs folder
        heroImage.src = 'featured-gifs/1.gif';
        heroImage.alt = 'Featured DoggoZ NFT';
        heroImage.onload = function() {
            this.style.opacity = 1;
        };
        heroImage.onerror = function() {
            // Fallback to static image if GIF not found
            this.src = 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=🐕+Featured+DoggoZ';
            this.style.opacity = 1;
        };
    }
}

// Setup dynamic slideshow from images folder
async function setupDynamicSlideshow() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) {
        // Create slideshow container if it doesn't exist
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            // Clear existing content
            gallerySection.innerHTML = '';

            // Create slideshow container
            const container = document.createElement('div');
            container.className = 'slideshow-container';

            const wrapper = document.createElement('div');
            wrapper.className = 'slideshow-wrapper';
            wrapper.id = 'slideshow-wrapper';

            // Add loading indicator initially
            wrapper.innerHTML = '<div class="slide-loading">Loading slideshow images...</div>';

            // Create navigation buttons
            const prevBtn = document.createElement('button');
            prevBtn.className = 'slide-btn prev-btn';
            prevBtn.innerHTML = '&#8249;';
            prevBtn.onclick = previousSlide;

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slide-btn next-btn';
            nextBtn.innerHTML = '&#8250;';
            nextBtn.onclick = nextSlide;

            // Create indicators container
            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slide-indicators';
            indicatorsContainer.id = 'slide-indicators';

            // Assemble slideshow
            container.appendChild(wrapper);
            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
            container.appendChild(indicatorsContainer);

            gallerySection.appendChild(container);

            // Load images dynamically
            await loadSlideshowImages(wrapper, indicatorsContainer);
        }
    }
}

// Load slideshow images from folder
async function loadSlideshowImages(wrapper, indicatorsContainer) {
    try {
        // Since browsers can't list directories, we'll directly try to load known images
        console.log('🚀 Loading slideshow images...');

        // Known images from your folder (all 11 PNG files)
        const knownImages = [
            { src: 'slideshow-images/1.png', alt: 'Image 1' },
            { src: 'slideshow-images/2.png', alt: 'Image 2' },
            { src: 'slideshow-images/3.png', alt: 'Image 3' },
            { src: 'slideshow-images/4.png', alt: 'Image 4' },
            { src: 'slideshow-images/5.png', alt: 'Image 5' },
            { src: 'slideshow-images/6.png', alt: 'Image 6' },
            { src: 'slideshow-images/7.png', alt: 'Image 7' },
            { src: 'slideshow-images/8.png', alt: 'Image 8' },
            { src: 'slideshow-images/9.png', alt: 'Image 9' },
            { src: 'slideshow-images/10.png', alt: 'Image 10' },
            { src: 'slideshow-images/11.png', alt: 'Image 11' }
        ];

        // Shuffle the images for random order
        const shuffledImages = shuffleArray(knownImages);

        await createSlidesFromArray(shuffledImages, wrapper, indicatorsContainer);
        console.log(`✅ Slideshow loaded with ${shuffledImages.length} images (shuffled order)`);

    } catch (error) {
        console.error('❌ Error loading slideshow images:', error);
        wrapper.innerHTML = '<div class="slide-error">Error loading slideshow</div>';
    }
}

// Shuffle array utility function
function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}
async function createSlidesFromArray(images, wrapper, indicatorsContainer) {
    wrapper.innerHTML = '';

    images.forEach((imageData, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;

        const img = document.createElement('img');
        img.src = imageData.src;
        img.alt = imageData.alt;
        img.onerror = function() {
            this.src = 'https://via.placeholder.com/600x400/1a1a1a/FF6B6B?text=Image+Error';
        };

        slide.appendChild(img);
        wrapper.appendChild(slide);

        // Create indicator
        const indicator = document.createElement('span');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    // Update current slide count
    currentSlide = 0;
}

// Slideshow navigation functions
function nextSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    currentSlide = (currentSlide + 1) % slides.length;

    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
}

function previousSlide() {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0) return;

    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    currentSlide = currentSlide === 0 ? slides.length - 1 : currentSlide - 1;

    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
}

function goToSlide(index) {
    const slides = document.querySelectorAll('.slide');
    if (slides.length === 0 || index < 0 || index >= slides.length) return;

    slides[currentSlide].classList.remove('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.remove('active');

    currentSlide = index;

    slides[currentSlide].classList.add('active');
    document.querySelectorAll('.indicator')[currentSlide].classList.add('active');
}

// Auto-advance slideshow
function startSlideshow() {
    slideInterval = setInterval(nextSlide, 2000); // Change slide every 2 seconds (faster)
}

function stopSlideshow() {
    if (slideInterval) {
        clearInterval(slideInterval);
    }
}

// Pause slideshow on hover
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }
});

// Add hover effects to buttons
document.addEventListener('DOMContentLoaded', function() {
    const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');

    buttons.forEach(button => {
        button.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-2px) scale(1.05)';
        });

        button.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
});

// Easter egg functionality
let konami = [];
const konamiCode = [
    'ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown',
    'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight',
    'KeyB', 'KeyA'
];

document.addEventListener('keydown', function(e) {
    konami.push(e.code);
    if (konami.length > konamiCode.length) {
        konami.shift();
    }

    if (konami.join('') === konamiCode.join('')) {
        document.body.style.animation = 'rainbow 2s linear infinite';
        const style = document.createElement('style');
        style.textContent = `
            @keyframes rainbow {
                0% { filter: hue-rotate(0deg); }
                100% { filter: hue-rotate(360deg); }
            }
        `;
        document.head.appendChild(style);

        setTimeout(() => {
            document.body.style.animation = '';
            konami = [];
        }, 4000);
    }
});
