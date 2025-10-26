// DoggoZ Official Website - Updated for 80s Synthwave
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DoggoZ Website Loaded Successfully!');
    try {
        initWebsite();
        initSlideshow();
    } catch (error) {
        console.error('❌ JavaScript initialization error:', error);
    }
});

function initWebsite() {
    console.log('🔧 Initializing website...');
    document.documentElement.style.scrollBehavior = 'smooth';
    setupNavigation();
    console.log('✅ Website initialized');
}

function setupNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        if (button.onclick) {
            button.addEventListener('click', function() {
                const onClickStr = this.onclick.toString();
                const match = onClickStr.match(/scrollToSection\('([^']+)'\)/);
                if (match) scrollToSection(match[1]);
            });
        }
    });
}

function scrollToSection(sectionId) {
  const element = document.getElementById(sectionId);
  if (element) {
    const offset = -80; // adjust this number: negative = higher, positive = lower
    const y = element.getBoundingClientRect().top + window.scrollY + offset;
    window.scrollTo({
      top: y,
      behavior: 'smooth'
    });
  }
}


// ========== SLIDESHOW ==========
let currentSlide = 0;
let slideInterval;

function initSlideshow() {
    console.log('🎬 Initializing slideshow...');
    setFeaturedGif();
    setupDynamicSlideshow();
    startSlideshow();
}

function setFeaturedGif() {
    const heroImage = document.querySelector('.hero-art');
    if (heroImage) {
        heroImage.src = 'featured-gifs/1.gif';
        heroImage.alt = 'Featured DoggoZ NFT';
        heroImage.onerror = function() {
            this.src = 'data:image/svg+xml,%3Csvg xmlns=%22http://www.w3.org/2000/svg%22 width=%22400%22 height=%22300%22%3E%3Crect fill=%22%230a0e27%22 width=%22400%22 height=%22300%22/%3E%3Ctext x=%2250%25%22 y=%2250%25%22 font-size=%2232%22 fill=%22%23FF006E%22 text-anchor=%22middle%22 dominant-baseline=%22middle%22 font-weight=%22bold%22%3E🐕 DOGGOZ 🐕%3C/text%3E%3C/svg%3E';
        };
    }
}

async function setupDynamicSlideshow() {
    const gallerySection = document.getElementById('gallery');
    if (gallerySection && !document.querySelector('.slideshow-container')) {
        console.log('📦 Setting up slideshow container...');
        
        const container = document.createElement('div');
        container.className = 'slideshow-container';
        
        const wrapper = document.createElement('div');
        wrapper.className = 'slideshow-wrapper';
        wrapper.id = 'slideshow-wrapper';
        
        wrapper.innerHTML = `
            <div class="slide-loading">
                <div class="loading-spinner"></div>
                <p>Loading DoggoZ Collection...</p>
            </div>
        `;
        
        const prevBtn = document.createElement('button');
        prevBtn.className = 'slide-btn';
        prevBtn.innerHTML = '⇚';
        prevBtn.onclick = previousSlide;
        
        const nextBtn = document.createElement('button');
        nextBtn.className = 'slide-btn';
        nextBtn.innerHTML = '⇛';
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

async function loadSlideshowImages(wrapper, indicatorsContainer) {
    try {
        console.log('🚀 Fetching NFT data from OpenSea API...');
        const nftData = await fetchNFTsFromOpenSea();
        
        if (!nftData || nftData.length === 0) {
            throw new Error('No NFTs found');
        }
        
        console.log(`✅ Loaded ${nftData.length} NFTs`);
        
        const shuffled = NFT_CONFIG.slideshow.enableShuffle ? shuffleArray(nftData) : nftData;
        const limited = shuffled.slice(0, NFT_CONFIG.slideshow.maxNFTs);
        
        await createSlidesFromNFTs(limited, wrapper, indicatorsContainer);
        
    } catch (error) {
        console.error('❌ Error:', error);
        await loadStaticImagesFallback(wrapper, indicatorsContainer);
    }
}

async function fetchNFTsFromOpenSea() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    const contractAddress = NFT_CONFIG.collection.contractAddress;
    
    const url = `https://api.opensea.io/api/v2/chain/base/contract/${contractAddress}/nfts?limit=50`;
    
    const response = await fetch(url, {
        headers: {
            'X-API-KEY': apiKey,
            'Accept': 'application/json'
        },
        timeout: 15000
    });
    
    if (!response.ok) throw new Error(`API error: ${response.status}`);
    
    const data = await response.json();
    if (!data.nfts) throw new Error('Invalid API response');
    
    return data.nfts.map((nft, index) => ({
        id: nft.identifier || index,
        title: nft.name || `DoggoZ #${nft.identifier}`,
        image: nft.image_url || nft.display_image_url || NFT_CONFIG.fallbacks.placeholderImage,
        tokenId: nft.identifier
    }));
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
    indicatorsContainer.innerHTML = '';
    
    nfts.forEach((nft, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;
        
        const img = document.createElement('img');
        img.src = nft.image;
        img.alt = nft.title;
        img.onerror = function() {
            this.src = NFT_CONFIG.fallbacks.errorImage;
        };
        
        slide.appendChild(img);
        wrapper.appendChild(slide);
        
        const indicator = document.createElement('span');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicator.title = nft.title;
        indicatorsContainer.appendChild(indicator);
    });
    
    currentSlide = 0;
}

async function loadStaticImagesFallback(wrapper, indicatorsContainer) {
    console.log('📄 Loading fallback images...');
    
    const images = Array.from({length: 11}, (_, i) => ({
        src: `slideshow-images/${i + 1}.png`,
        alt: `DoggoZ ${i + 1}`
    }));
    
    const shuffled = NFT_CONFIG.slideshow.enableShuffle ? shuffleArray(images) : images;
    const limited = shuffled.slice(0, NFT_CONFIG.slideshow.maxNFTs);
    
    wrapper.innerHTML = '';
    indicatorsContainer.innerHTML = '';
    
    limited.forEach((img, index) => {
        const slide = document.createElement('div');
        slide.className = `slide${index === 0 ? ' active' : ''}`;
        
        const image = document.createElement('img');
        image.src = img.src;
        image.alt = img.alt;
        image.onerror = function() {
            this.src = NFT_CONFIG.fallbacks.errorImage;
        };
        
        slide.appendChild(image);
        wrapper.appendChild(slide);
        
        const indicator = document.createElement('span');
        indicator.className = `indicator${index === 0 ? ' active' : ''}`;
        indicator.onclick = () => goToSlide(index);
        indicatorsContainer.appendChild(indicator);
    });
    
    currentSlide = 0;
}

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
    if (slideInterval) clearInterval(slideInterval);
}

// Pause on hover
document.addEventListener('DOMContentLoaded', function() {
    const slideshowContainer = document.querySelector('.slideshow-container');
    if (slideshowContainer) {
        slideshowContainer.addEventListener('mouseenter', stopSlideshow);
        slideshowContainer.addEventListener('mouseleave', startSlideshow);
    }
});