// DoggoZ Official Website JavaScript - OpenSea API Version
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DoggoZ Website Loaded Successfully!');

    try {
        initWebsite();
        glitchLogo();
        initSlideshow();
    } catch (error) {
        console.error('❌ JavaScript initialization error:', error);
    }
});

function initWebsite() {
    console.log('🔧 Initializing website...');
    document.documentElement.style.scrollBehavior = 'smooth';
    setupNavigation();
    setupParallax();
    console.log('✅ Website initialized');
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const sectionId = this.onclick ? this.onclick.toString().match(/'([^']+)'/)?.[1] : null;
            if (sectionId) scrollToSection(sectionId);
        });
    });
}

function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

function glitchLogo() {
    const logo = document.querySelector('.logo h1');
    if (!logo) return;

    setInterval(() => {
        if (Math.random() < 0.1) {
            const originalText = logo.innerHTML;
            const glitchedText = originalText.replace('Z', 'Z̷̨̈̆͛̍‹');
            logo.innerHTML = glitchedText;

            setTimeout(() => {
                logo.innerHTML = originalText;
            }, 100);
        }
    }, 2000);
}

function setupParallax() {
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const scanlines = document.querySelector('.scanlines');
        if (scanlines) {
            scanlines.style.transform = `translateY(${scrolled * 0.1}px)`;
        }
    });
}

// ========== SLIDESHOW WITH OPENSEA API ==========
let currentSlide = 0;
let slideInterval;

function initSlideshow() {
    console.log('🎬 Initializing slideshow with OpenSea API...');
    setFeaturedGif();
    setupDynamicSlideshow();
    startSlideshow();
}

function setFeaturedGif() {
    const heroImage = document.querySelector('.hero-art');
    if (heroImage) {
        heroImage.src = 'featured-gifs/1.gif';
        heroImage.alt = 'Featured DoggoZ NFT';
        heroImage.onload = function() {
            this.style.opacity = 1;
        };
        heroImage.onerror = function() {
            this.src = 'https://via.placeholder.com/400x400/FF6B6B/FFFFFF?text=🐕+Featured+DoggoZ';
            this.style.opacity = 1;
        };
    }
}

async function setupDynamicSlideshow() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (!slideshowContainer) {
        const gallerySection = document.getElementById('gallery');
        if (gallerySection) {
            gallerySection.innerHTML = '';

            const container = document.createElement('div');
            container.className = 'slideshow-container';

            const wrapper = document.createElement('div');
            wrapper.className = 'slideshow-wrapper';
            wrapper.id = 'slideshow-wrapper';

            wrapper.innerHTML = `
                <div class="slide-loading">
                    <div class="loading-spinner"></div>
                    <p>Fetching DoggoZ from OpenSea...</p>
                    <small>Using OpenSea API for faster loading</small>
                </div>
            `;

            const prevBtn = document.createElement('button');
            prevBtn.className = 'slide-btn prev-btn';
            prevBtn.innerHTML = '&#8249;';
            prevBtn.onclick = previousSlide;

            const nextBtn = document.createElement('button');
            nextBtn.className = 'slide-btn next-btn';
            nextBtn.innerHTML = '&#8250;';
            nextBtn.onclick = nextSlide;

            const indicatorsContainer = document.createElement('div');
            indicatorsContainer.className = 'slide-indicators';
            indicatorsContainer.id = 'slide-indicators';

            container.appendChild(wrapper);
            container.appendChild(prevBtn);
            container.appendChild(nextBtn);
            container.appendChild(indicatorsContainer);

            gallerySection.appendChild(container);

            await loadSlideshowImages(wrapper, indicatorsContainer);
        }
    }
}

// Fetch NFTs from OpenSea API
async function loadSlideshowImages(wrapper, indicatorsContainer) {
    try {
        console.log('🚀 Fetching NFT data from OpenSea API...');

        const nftData = await fetchNFTsFromOpenSea();

        if (!nftData || nftData.length === 0) {
            throw new Error('No NFTs found in collection');
        }

        console.log(`✅ OpenSea data fetched successfully:`, nftData);

        // Shuffle if enabled
        const shuffledNFTs = NFT_CONFIG.slideshow.enableShuffle
            ? shuffleArray(nftData)
            : nftData;

        // Limit to configured max
        const limitedNFTs = shuffledNFTs.slice(0, NFT_CONFIG.slideshow.maxNFTs);

        console.log(`🎲 Displaying ${limitedNFTs.length} NFTs`);

        await createSlidesFromNFTs(limitedNFTs, wrapper, indicatorsContainer);
        console.log(`✅ Slideshow loaded with ${limitedNFTs.length} NFTs`);

    } catch (error) {
        console.error('❌ Error loading NFT data:', error);

        wrapper.innerHTML = `
            <div class="slide-error">
                <p>Failed to load NFTs from OpenSea</p>
                <small>${error.message}</small>
                <br><br>
                <small>Falling back to static images...</small>
            </div>
        `;

        setTimeout(async () => {
            await loadStaticImagesFallback(wrapper, indicatorsContainer);
        }, 2000);
    }
}

// Fetch NFTs using OpenSea API v2
async function fetchNFTsFromOpenSea() {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 15000);

    try {
        const apiKey = NFT_CONFIG.sales.opensea.apiKey;
        const contractAddress = NFT_CONFIG.collection.contractAddress;
        
        // OpenSea API v2 endpoint for NFTs in a collection
        const url = `https://api.opensea.io/api/v2/chain/base/contract/${contractAddress}/nfts?limit=50`;

        console.log('📡 Fetching from OpenSea:', url);

        const response = await fetch(url, {
            signal: controller.signal,
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });

        clearTimeout(timeoutId);

        if (!response.ok) {
            if (response.status === 401) {
                throw new Error('Invalid OpenSea API key');
            } else if (response.status === 429) {
                throw new Error('Rate limited. Please wait a moment');
            } else if (response.status === 404) {
                throw new Error('Collection not found on OpenSea');
            } else {
                throw new Error(`API error: ${response.status}`);
            }
        }

        const data = await response.json();

        if (!data.nfts || !Array.isArray(data.nfts)) {
            throw new Error('Invalid API response format');
        }

        if (data.nfts.length === 0) {
            throw new Error('No NFTs found in collection');
        }

        console.log(`📦 Found ${data.nfts.length} NFTs from OpenSea`);

        // Transform OpenSea data to our format
        return data.nfts.map((nft, index) => {
            const imageUrl = nft.image_url || nft.display_image_url || NFT_CONFIG.fallbacks.placeholderImage;
            
            return {
                id: nft.identifier || index,
                title: nft.name || `DoggoZ #${nft.identifier || index}`,
                description: nft.description || `A unique DoggoZ pixel art NFT`,
                image: {
                    src: imageUrl,
                    alt: nft.name || `DoggoZ NFT #${nft.identifier || index}`,
                    format: 'png',
                    raw: imageUrl
                },
                tokenId: nft.identifier,
                contractAddress: nft.contract,
                metadata: nft
            };
        });

    } catch (error) {
        clearTimeout(timeoutId);

        if (error.name === 'AbortError') {
            throw new Error('Request timed out');
        }

        console.error('❌ Error fetching from OpenSea:', error);
        throw error;
    }
}

function shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
}

async function createSlidesFromNFTs(nfts, wrapper, indicatorsContainer) {
    wrapper.innerHTML = '';

    nfts.forEach((nftData, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;

        const img = document.createElement('img');
        img.src = nftData.image.src;
        img.alt = nftData.title;
        img.onerror = function() {
            this.src = NFT_CONFIG.fallbacks.errorImage;
        };

        const overlay = document.createElement('div');
        overlay.className = 'nft-overlay';
        overlay.innerHTML = `
            <div class="nft-info">
                <h3 class="nft-title">${nftData.title}</h3>
                <p class="nft-token-id">Token ID: ${nftData.tokenId}</p>
            </div>
        `;

        slide.appendChild(img);
        slide.appendChild(overlay);
        wrapper.appendChild(slide);

        const indicator = document.createElement('span');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicator.title = nftData.title;
        indicatorsContainer.appendChild(indicator);
    });

    currentSlide = 0;
}

async function loadStaticImagesFallback(wrapper, indicatorsContainer) {
    console.log('🔄 Falling back to static images...');

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

    const shuffledImages = NFT_CONFIG.slideshow.enableShuffle ? shuffleArray(knownImages) : knownImages;
    const limitedImages = shuffledImages.slice(0, NFT_CONFIG.slideshow.maxNFTs);

    await createSlidesFromArray(limitedImages, wrapper, indicatorsContainer);
    console.log(`✅ Fallback: Loaded ${limitedImages.length} static images`);
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
            this.src = NFT_CONFIG.fallbacks.errorImage;
        };

        slide.appendChild(img);
        wrapper.appendChild(slide);

        const indicator = document.createElement('span');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });

    currentSlide = 0;
}

// Slideshow navigation
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

function startSlideshow() {
    slideInterval = setInterval(nextSlide, NFT_CONFIG.slideshow.autoPlayDelay);
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

// Button hover effects
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

// Easter egg - Konami Code
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