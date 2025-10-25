// Home Page Sales Preview - Mini version of sales dashboard
document.addEventListener('DOMContentLoaded', function() {
    console.log('📊 Loading sales preview on homepage...');
    loadSalesPreview();
});

async function loadSalesPreview() {
    try {
        // Fetch stats and sales
        const [stats, sales] = await Promise.all([
            fetchCollectionStatsPreview(),
            fetchRecentSalesPreview()
        ]);
        
        // Update preview cards
        updatePreviewStats(stats, sales);
        updateBiggestSalePreview(sales);
        
        console.log('✅ Sales preview loaded');
        
    } catch (error) {
        console.error('❌ Error loading sales preview:', error);
        showPreviewError();
    }
}

async function fetchCollectionStatsPreview() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    const slug = NFT_CONFIG.collection.openseaSlug;
    
    try {
        const response = await fetch(`https://api.opensea.io/api/v2/collections/${slug}/stats`, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) throw new Error('API error');
        
        const data = await response.json();
        
        return {
            oneDayVolume: data.intervals?.[0]?.volume || 0,
            oneDaySales: data.intervals?.[0]?.sales || 0,
            numOwners: data.total.num_owners || 0
        };
        
    } catch (error) {
        console.error('Error fetching stats preview:', error);
        return { oneDayVolume: 0, oneDaySales: 0, numOwners: 0 };
    }
}

async function fetchRecentSalesPreview() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    
    try {
        const url = `https://api.opensea.io/api/v2/events/collection/${NFT_CONFIG.collection.openseaSlug}?event_type=sale&limit=10`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) return [];
        
        const data = await response.json();
        
        if (!data.asset_events || data.asset_events.length === 0) return [];
        
        return data.asset_events.map(event => ({
            tokenId: event.nft?.identifier || 'Unknown',
            tokenName: event.nft?.name || `DoggoZ #${event.nft?.identifier || '?'}`,
            price: parseFloat(event.payment?.quantity || 0) / 1e18,
            priceUSD: parseFloat(event.payment?.quantity_in_usd || 0),
            timestamp: new Date(event.event_timestamp * 1000),
            buyer: event.buyer || 'Unknown',
            seller: event.seller || 'Unknown',
            imageUrl: event.nft?.image_url || NFT_CONFIG.fallbacks.placeholderImage,
            openseaUrl: `https://opensea.io/assets/base/${NFT_CONFIG.collection.contractAddress}/${event.nft?.identifier}`
        }));
        
    } catch (error) {
        console.error('Error fetching sales preview:', error);
        return [];
    }
}

function updatePreviewStats(stats, sales) {
    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    
    const todaySales = sales.filter(sale => sale.timestamp >= todayStart);
    const todayVolume = todaySales.reduce((sum, sale) => sum + sale.price, 0);
    const uniqueBuyers = new Set(todaySales.map(sale => sale.buyer).filter(b => b !== 'Unknown')).size;
    
    document.getElementById('previewVolume').textContent = 
        todayVolume > 0 ? `${todayVolume.toFixed(4)} ETH` : `${stats.oneDayVolume.toFixed(4)} ETH`;
    
    document.getElementById('previewSales').textContent = 
        todaySales.length > 0 ? todaySales.length : stats.oneDaySales;
    
    document.getElementById('previewBuyers').textContent = 
        uniqueBuyers > 0 ? uniqueBuyers : stats.numOwners;
}

function updateBiggestSalePreview(sales) {
    const container = document.getElementById('biggestSalePreview');
    
    if (!sales || sales.length === 0) {
        container.innerHTML = `
            <div class="no-sale-preview">
                <p>💎 No recent sales</p>
                <small>Check back soon!</small>
            </div>
        `;
        return;
    }
    
    const biggestSale = sales.reduce((max, sale) => sale.price > max.price ? sale : max, sales[0]);
    const timeAgo = getTimeAgoPreview(biggestSale.timestamp);
    
    container.innerHTML = `
        <div class="biggest-sale-content">
            <div class="biggest-sale-image">
                <img src="${biggestSale.imageUrl}" alt="${biggestSale.tokenName}"
                     onerror="this.src='${NFT_CONFIG.fallbacks.placeholderImage}'">
            </div>
            <div class="biggest-sale-info">
                <h4>${biggestSale.tokenName}</h4>
                <div class="biggest-sale-price">${biggestSale.price.toFixed(6)} ETH</div>
                ${biggestSale.priceUSD > 0 ? `<div class="biggest-sale-usd">≈ $${biggestSale.priceUSD.toFixed(2)}</div>` : ''}
                <div class="biggest-sale-time">⏰ ${timeAgo}</div>
                <a href="${biggestSale.openseaUrl}" target="_blank" class="btn-view-small">
                    View on OpenSea →
                </a>
            </div>
        </div>
    `;
}

function getTimeAgoPreview(date) {
    const seconds = Math.floor((new Date() - date) / 1000);
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)} min ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hr ago`;
    return `${Math.floor(seconds / 86400)} day ago`;
}

function showPreviewError() {
    document.getElementById('previewVolume').textContent = '0 ETH';
    document.getElementById('previewSales').textContent = '0';
    document.getElementById('previewBuyers').textContent = '0';
    
    document.getElementById('biggestSalePreview').innerHTML = `
        <div class="no-sale-preview">
            <p>⚠️ Unable to load</p>
            <small>Try refreshing</small>
        </div>
    `;
}