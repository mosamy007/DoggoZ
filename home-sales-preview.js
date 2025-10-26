// Home Page Sales Preview - SAME DATA AS SALES PAGE
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Loading sales preview...');
    loadSalesPreview();
    setInterval(loadSalesPreview, 300000);
});

async function loadSalesPreview() {
    try {
        const [stats, sales] = await Promise.all([
            fetchStatsPreview(),
            fetchSalesPreview()
        ]);
        
        updatePreviewStats(stats);
        updateBiggestSalePreview(sales);
        
        console.log('✅ Preview loaded');
        
    } catch (error) {
        console.error('❌ Error:', error);
        showPreviewError();
    }
}

async function fetchStatsPreview() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    const slug = NFT_CONFIG.collection.openseaSlug;
    
    try {
        const response = await fetch(`https://api.opensea.io/api/v2/collections/${slug}/stats`, {
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('API Error');
        
        const data = await response.json();
        
        return {
            volume24h: data.intervals?.[0]?.volume || 0,
            sales24h: data.intervals?.[0]?.sales || 0,
            holders: data.total?.num_owners || 0
        };
        
    } catch (error) {
        console.error('❌ Stats error:', error);
        return { volume24h: 0, sales24h: 0, holders: 0 };
    }
}

async function fetchSalesPreview() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    
    try {
        const response = await fetch(
            `https://api.opensea.io/api/v2/events/collection/${NFT_CONFIG.collection.openseaSlug}?event_type=sale&limit=50`,
            {
                headers: {
                    'X-API-KEY': apiKey,
                    'Accept': 'application/json'
                }
            }
        );
        
        if (!response.ok) return [];
        
        const data = await response.json();
        
        if (!data.asset_events || data.asset_events.length === 0) return [];
        
        return data.asset_events.map(event => {
            const priceWei = event.payment?.quantity || '0';
            const priceEth = parseFloat(priceWei) / 1e18;
            
            return {
                tokenId: event.nft?.identifier || 'Unknown',
                name: event.nft?.name || `DoggoZ #${event.nft?.identifier}`,
                price: priceEth,
                priceUSD: parseFloat(event.payment?.quantity_in_usd || 0),
                timestamp: new Date(event.event_timestamp * 1000),
                buyer: event.buyer || 'Unknown',
                seller: event.seller || 'Unknown',
                image: event.nft?.image_url || NFT_CONFIG.fallbacks.placeholderImage,
                url: `https://opensea.io/assets/base/${NFT_CONFIG.collection.contractAddress}/${event.nft?.identifier}`
            };
        });
        
    } catch (error) {
        console.error('❌ Sales error:', error);
        return [];
    }
}

function updatePreviewStats(stats) {
    const volumeEl = document.getElementById('previewVolume');
    const salesEl = document.getElementById('previewSales');
    const holdersEl = document.getElementById('previewBuyers');
    
    if (volumeEl) volumeEl.textContent = `${stats.volume24h.toFixed(4)} ETH`;
    if (salesEl) salesEl.textContent = stats.sales24h;
    if (holdersEl) holdersEl.textContent = stats.holders;
}

function updateBiggestSalePreview(sales) {
    const container = document.getElementById('biggestSalePreview');
    if (!container) return;
    
    if (!sales || sales.length === 0) {
        container.innerHTML = `<div class="no-sales-card">💎 No recent sales yet</div>`;
        return;
    }
    
    const biggest = sales.reduce((max, s) => s.price > max.price ? s : max, sales[0]);
    const timeAgo = getTimeAgoPreview(biggest.timestamp);
    
    container.innerHTML = `
        <div class="featured-badge">🏆 BIGGEST SALE TODAY</div>
        <div class="featured-sale-card">
            <div class="featured-image">
                <img src="${biggest.image}" alt="${biggest.name}" 
                     onerror="this.src='${NFT_CONFIG.fallbacks.placeholderImage}'">
            </div>
            <div class="featured-info">
                <h3 class="featured-title">${biggest.name}</h3>
                <div class="featured-price-section">
                    <span class="price-value">${biggest.price.toFixed(6)} ETH</span>
                    ${biggest.priceUSD > 0 ? `<span class="price-usd">≈ $${biggest.priceUSD.toFixed(2)}</span>` : ''}
                </div>
                <div class="featured-details">
                    <div class="detail-row">
                        <span class="detail-label">From:</span>
                        <span class="detail-value">${formatAddrPreview(biggest.seller)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">To:</span>
                        <span class="detail-value">${formatAddrPreview(biggest.buyer)}</span>
                    </div>
                    <div class="detail-row">
                        <span class="detail-label">When:</span>
                        <span class="detail-value">${timeAgo}</span>
                    </div>
                </div>
                <a href="${biggest.url}" target="_blank" class="btn-view">View on OpenSea</a>
            </div>
        </div>
    `;
}

function formatAddrPreview(addr) {
    if (!addr || addr === 'Unknown') return 'Unknown';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function getTimeAgoPreview(date) {
    const seconds = Math.floor((new Date() - new Date(date)) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 604800) return `${Math.floor(seconds / 86400)}d ago`;
    return `${Math.floor(seconds / 604800)}w ago`;
}

function showPreviewError() {
    const volumeEl = document.getElementById('previewVolume');
    const salesEl = document.getElementById('previewSales');
    const holdersEl = document.getElementById('previewBuyers');
    const container = document.getElementById('biggestSalePreview');
    
    if (volumeEl) volumeEl.textContent = '0 ETH';
    if (salesEl) salesEl.textContent = '0';
    if (holdersEl) holdersEl.textContent = '0';
    
    if (container) {
        container.innerHTML = '<div class="no-sales-card">⚠️ Unable to load data</div>';
    }
}