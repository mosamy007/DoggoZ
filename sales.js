// DoggoZ Sales Activity Dashboard - Complete Fix
// Fixes: addresses (correct API fields), responsive layout, mobile optimization

document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing DoggoZ Sales Dashboard...');
    initializeSalesDashboard();
    
    // Auto-refresh every 5 minutes
    setInterval(initializeSalesDashboard, 300000);
});

async function initializeSalesDashboard() {
    try {
        showLoadingState();
        
        const [stats, sales] = await Promise.all([
            fetchCollectionStats(),
            fetchRecentSales()
        ]);
        
        updateStatsCards(stats, sales);
        updateFeaturedSale(sales);
        updateRecentSales(sales);
        updateTrendCharts(stats);
        
        console.log('✅ Dashboard loaded successfully');
        
    } catch (error) {
        console.error('❌ Error loading dashboard:', error);
        showErrorState(error.message);
    }
}

// Fetch collection statistics
async function fetchCollectionStats() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    const slug = NFT_CONFIG.collection.openseaSlug;
    
    try {
        console.log('📡 Fetching collection stats...');
        
        const response = await fetch(`https://api.opensea.io/api/v2/collections/${slug}/stats`, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            throw new Error(`OpenSea API error: ${response.status}`);
        }
        
        const data = await response.json();
        
        return {
            totalVolume: data.total.volume || 0,
            floorPrice: data.total.floor_price || 0,
            totalSales: data.total.sales || 0,
            numOwners: data.total.num_owners || 0,
            totalSupply: data.total.supply || 0,
            oneDayVolume: data.intervals?.[0]?.volume || 0,
            oneDaySales: data.intervals?.[0]?.sales || 0,
            oneDayChange: data.intervals?.[0]?.volume_change || 0
        };
        
    } catch (error) {
        console.error('❌ Error fetching stats:', error);
        throw error;
    }
}

// Fetch recent sales - FIXED to get correct buyer/seller fields
async function fetchRecentSales() {
    const apiKey = NFT_CONFIG.sales.opensea.apiKey;
    const contractAddress = NFT_CONFIG.collection.contractAddress;
    
    try {
        console.log('📡 Fetching recent sales...');
        
        const url = `https://api.opensea.io/api/v2/events/collection/${NFT_CONFIG.collection.openseaSlug}?event_type=sale&limit=50`;
        
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'X-API-KEY': apiKey,
                'Accept': 'application/json'
            }
        });
        
        if (!response.ok) {
            console.warn('⚠️ Sales endpoint error:', response.status);
            return [];
        }
        
        const data = await response.json();
        console.log('💰 Raw API response:', data);
        
        if (!data.asset_events || data.asset_events.length === 0) {
            console.log('ℹ️ No recent sales found');
            return [];
        }
        
        // Process sales with CORRECT field mapping
        return data.asset_events.map(event => {
            // OpenSea API v2 has buyer and seller as direct fields
            const buyer = event.buyer || 'Unknown';
            const seller = event.seller || 'Unknown';
            
            // Price is in wei, convert to ETH
            const priceInWei = event.payment?.quantity || '0';
            const priceInEth = parseFloat(priceInWei) / 1e18;
            
            // Timestamp is Unix seconds - convert to milliseconds
            const timestamp = event.event_timestamp ? 
                new Date(event.event_timestamp * 1000) : 
                new Date();
            
            console.log('✅ Parsed sale:', {
                token: event.nft?.identifier,
                buyer: buyer,
                seller: seller,
                price: priceInEth,
                time: timestamp
            });
            
            return {
                tokenId: event.nft?.identifier || 'Unknown',
                tokenName: event.nft?.name || `DoggoZ #${event.nft?.identifier || '?'}`,
                price: priceInEth,
                priceUSD: parseFloat(event.payment?.quantity_in_usd || 0),
                timestamp: timestamp,
                buyer: buyer,
                seller: seller,
                imageUrl: event.nft?.image_url || NFT_CONFIG.fallbacks.placeholderImage,
                openseaUrl: `https://opensea.io/assets/base/${contractAddress}/${event.nft?.identifier}`,
                transactionHash: event.transaction || 'Unknown'
            };
        });
        
    } catch (error) {
        console.error('❌ Error fetching sales:', error);
        return [];
    }
}

function showLoadingState() {
    document.getElementById('todayVolume').innerHTML = '<span class="loading-dots">Loading</span>';
    document.getElementById('todaySales').innerHTML = '<span class="loading-dots">...</span>';
    document.getElementById('uniqueBuyers').innerHTML = '<span class="loading-dots">...</span>';
    
    document.getElementById('featuredSale').innerHTML = `
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <p>Loading data...</p>
        </div>
    `;
    
    document.getElementById('salesGrid').innerHTML = `
        <div class="loading-card">
            <div class="loading-spinner"></div>
            <p>Fetching sales...</p>
        </div>
    `;
}

function showErrorState(message) {
    document.getElementById('featuredSale').innerHTML = `
        <div class="error-card">
            <span class="error-icon">⚠️</span>
            <p>Unable to load data</p>
            <small>${message}</small>
            <button class="btn-secondary" onclick="initializeSalesDashboard()" style="margin-top: 1rem;">
                🔄 Retry
            </button>
        </div>
    `;
}

function updateStatsCards(stats, sales) {
    // Use actual API data for stats - no manual calculation
    document.getElementById('todayVolume').textContent = 
        `${stats.oneDayVolume.toFixed(4)} ETH`;
    
    document.getElementById('todaySales').textContent = stats.oneDaySales;
    
    // Use numOwners which is the actual holder/owner count from OpenSea
    document.getElementById('uniqueBuyers').textContent = stats.numOwners;
    
    animateStatsCards();
}

function animateStatsCards() {
    const cards = document.querySelectorAll('.stat-card');
    cards.forEach((card, index) => {
        setTimeout(() => {
            card.style.animation = 'popIn 0.3s ease-out';
        }, index * 100);
    });
}

function updateFeaturedSale(sales) {
    const container = document.getElementById('featuredSale');
    
    if (!sales || sales.length === 0) {
        container.innerHTML = `
            <div class="no-sales-card">
                <span class="info-icon">💎</span>
                <h3>No Recent Sales</h3>
                <p>Check back soon!</p>
                <a href="https://opensea.io/collection/doggoz-official" target="_blank" class="view-opensea-btn">
                    🌊 View on OpenSea
                </a>
            </div>
        `;
        return;
    }
    
    const biggestSale = sales.reduce((max, sale) => sale.price > max.price ? sale : max, sales[0]);
    const timeAgo = getTimeAgo(biggestSale.timestamp);
    
    container.innerHTML = `
        <div class="featured-sale-card">
            <div class="featured-badge">🏆 HIGHEST RECENT SALE</div>
            <div class="featured-content">
                <div class="featured-image">
                    <img src="${biggestSale.imageUrl}" alt="${biggestSale.tokenName}" 
                         onerror="this.src='${NFT_CONFIG.fallbacks.placeholderImage}'">
                </div>
                <div class="featured-info">
                    <h3 class="featured-title">${biggestSale.tokenName}</h3>
                    <div class="featured-price-section">
                        <span class="price-value">${biggestSale.price.toFixed(6)} ETH</span>
                        ${biggestSale.priceUSD > 0 ? `<span class="price-usd">≈ $${biggestSale.priceUSD.toFixed(2)}</span>` : ''}
                    </div>
                    <div class="featured-details">
                        <div class="detail-row">
                            <span class="detail-label">From:</span>
                            <span class="detail-value">${formatAddress(biggestSale.seller)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">To:</span>
                            <span class="detail-value">${formatAddress(biggestSale.buyer)}</span>
                        </div>
                        <div class="detail-row">
                            <span class="detail-label">When:</span>
                            <span class="detail-value">${timeAgo}</span>
                        </div>
                    </div>
                    <a href="${biggestSale.openseaUrl}" target="_blank" class="btn-view">
                        👁️ View on OpenSea
                    </a>
                </div>
            </div>
        </div>
    `;
}

function updateRecentSales(sales) {
    const container = document.getElementById('salesGrid');
    
    if (!sales || sales.length === 0) {
        container.innerHTML = `
            <div class="no-sales-card">
                <span class="info-icon">📊</span>
                <h3>No Recent Activity</h3>
                <p>Sales will appear here!</p>
            </div>
        `;
        return;
    }
    
    const recentSales = sales.slice(0, 15);
    
    container.innerHTML = `
        <div class="sales-list">
            ${recentSales.map(sale => {
                const timeAgo = getTimeAgo(sale.timestamp);
                
                return `
                    <div class="sale-list-item">
                        <div class="sale-list-image">
                            <img src="${sale.imageUrl}" alt="${sale.tokenName}"
                                 onerror="this.src='${NFT_CONFIG.fallbacks.placeholderImage}'">
                        </div>
                        <div class="sale-list-content">
                            <div class="sale-list-header">
                                <h4 class="sale-list-title">${sale.tokenName}</h4>
                                <span class="sale-list-price">${sale.price.toFixed(6)} ETH</span>
                            </div>
                            <div class="sale-list-details">
                                <div class="sale-list-row">
                                    <span class="label">From:</span>
                                    <span class="value">${formatAddress(sale.seller)}</span>
                                </div>
                                <div class="sale-list-row">
                                    <span class="label">To:</span>
                                    <span class="value">${formatAddress(sale.buyer)}</span>
                                </div>
                                <div class="sale-list-row">
                                    <span class="label">Time:</span>
                                    <span class="value">${timeAgo}</span>
                                </div>
                            </div>
                            <a href="${sale.openseaUrl}" target="_blank" class="sale-list-link">
                                View Details →
                            </a>
                        </div>
                    </div>
                `;
            }).join('')}
        </div>
    `;
}

function updateTrendCharts(stats) {
    const priceContainer = document.getElementById('priceTrend');
    const volumeContainer = document.getElementById('volumeTrend');
    
    priceContainer.innerHTML = `
        <div class="trend-display">
            <div class="trend-main-value">
                <span class="trend-number">${stats.floorPrice.toFixed(6)}</span>
                <span class="trend-unit">ETH</span>
            </div>
            <div class="trend-label">Floor Price</div>
        </div>
    `;
    
    volumeContainer.innerHTML = `
        <div class="trend-display">
            <div class="trend-main-value">
                <span class="trend-number">${stats.oneDayVolume.toFixed(4)}</span>
                <span class="trend-unit">ETH</span>
            </div>
            <div class="trend-label">24h Volume</div>
            ${stats.oneDayChange !== 0 ? `
                <div class="trend-change ${stats.oneDayChange >= 0 ? 'positive' : 'negative'}">
                    ${stats.oneDayChange >= 0 ? '↗' : '↘'} ${Math.abs(stats.oneDayChange).toFixed(1)}%
                </div>
            ` : ''}
        </div>
    `;
}

function formatAddress(address) {
    if (!address || address === 'Unknown') return 'Unknown';
    if (address.length < 10) return address;
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
}

function getTimeAgo(date) {
    const saleDate = date instanceof Date ? date : new Date(date);
    const now = new Date();
    const seconds = Math.floor((now - saleDate) / 1000);
    
    if (seconds < 0 || seconds > 31536000 * 2) {
        return 'Recently';
    }
    
    const intervals = [
        { label: 'year', seconds: 31536000 },
        { label: 'month', seconds: 2592000 },
        { label: 'week', seconds: 604800 },
        { label: 'day', seconds: 86400 },
        { label: 'hour', seconds: 3600 },
        { label: 'minute', seconds: 60 }
    ];
    
    for (const interval of intervals) {
        const count = Math.floor(seconds / interval.seconds);
        if (count >= 1) {
            return `${count} ${interval.label}${count === 1 ? '' : 's'} ago`;
        }
    }
    
    return 'Just now';
}

async function refreshSalesData() {
    const btn = document.querySelector('.btn-secondary');
    if (!btn) return;
    
    const originalText = btn.textContent;
    
    try {
        btn.textContent = '🔄 Refreshing...';
        btn.disabled = true;
        
        await initializeSalesDashboard();
        
        btn.textContent = '✅ Updated!';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
        
    } catch (error) {
        btn.textContent = '❌ Error';
        setTimeout(() => {
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }
}

window.refreshSalesData = refreshSalesData;

// Enhanced responsive CSS
const style = document.createElement('style');
style.textContent = `
    /* Container centering */
    .container {
        max-width: 1400px;
        margin: 0 auto;
        padding: 0 1rem;
    }
    
    .main-content {
        max-width: 1200px;
        margin: 0 auto;
    }
    
    .hero-sales {
        max-width: 1200px;
        margin: 0 auto;
        text-align: center;
    }
    
    @keyframes popIn {
        0% { transform: scale(0.8); opacity: 0; }
        100% { transform: scale(1); opacity: 1; }
    }
    
    .loading-dots::after {
        content: '...';
        animation: dots 1.5s steps(4, end) infinite;
    }
    
    @keyframes dots {
        0%, 20% { content: '.'; }
        40% { content: '..'; }
        60%, 100% { content: '...'; }
    }
    
    .loading-card, .error-card, .no-sales-card {
        text-align: center;
        padding: 2rem;
        background: rgba(0, 0, 0, 0.5);
        border-radius: 12px;
        border: 2px dashed var(--text-secondary);
    }
    
    .info-icon, .error-icon {
        font-size: 2.5rem;
        display: block;
        margin-bottom: 1rem;
    }
    
    /* Featured Sale */
    .featured-sale-card {
        background: linear-gradient(135deg, rgba(255, 107, 107, 0.15) 0%, rgba(78, 205, 196, 0.15) 100%);
        border: 3px solid var(--neon-pink);
        border-radius: 12px;
        padding: 1.5rem;
        position: relative;
    }
    
    .featured-badge {
        text-align: center;
        background: linear-gradient(45deg, var(--neon-pink), var(--primary-color));
        color: var(--dark-bg);
        padding: 0.4rem 1rem;
        border-radius: 20px;
        font-size: 0.75rem;
        font-weight: bold;
        animation: glow 2s ease-in-out infinite alternate;
        margin-bottom: 1rem;
        display: inline-block;
    }
    
    @keyframes glow {
        from { box-shadow: 0 0 5px var(--neon-pink); }
        to { box-shadow: 0 0 15px var(--neon-pink); }
    }
    
    .featured-content {
        display: grid;
        grid-template-columns: 200px 1fr;
        gap: 1.5rem;
        align-items: start;
    }
    
    .featured-image img {
        width: 100%;
        border-radius: 10px;
        border: 2px solid var(--secondary-color);
    }
    
    .featured-title {
        font-size: 1.3rem;
        color: var(--neon-pink);
        margin-bottom: 1rem;
        text-shadow: 0 0 8px var(--neon-pink);
    }
    
    .featured-price-section {
        background: rgba(0, 0, 0, 0.6);
        padding: 1rem;
        border-radius: 8px;
        margin-bottom: 1rem;
        border: 2px solid var(--neon-green);
    }
    
    .price-value {
        display: block;
        font-size: 1.5rem;
        font-weight: bold;
        color: var(--neon-green);
        text-shadow: 0 0 10px var(--neon-green);
        margin-bottom: 0.3rem;
    }
    
    .price-usd {
        display: block;
        font-size: 0.95rem;
        color: var(--text-secondary);
    }
    
    .featured-details {
        display: flex;
        flex-direction: column;
        gap: 0.6rem;
        margin-bottom: 1rem;
    }
    
    .detail-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.6rem;
        background: rgba(255, 107, 107, 0.1);
        border-radius: 6px;
        font-size: 0.85rem;
    }
    
    .detail-label {
        color: var(--text-secondary);
        font-size: 0.75rem;
        text-transform: uppercase;
    }
    
    .detail-value {
        color: var(--text-color);
        font-weight: bold;
        font-family: 'Courier New', monospace;
        font-size: 0.8rem;
    }
    
    .btn-view, .view-opensea-btn {
        display: inline-block;
        padding: 0.8rem 1.5rem;
        background: var(--secondary-color);
        color: var(--dark-bg);
        text-decoration: none;
        border-radius: 8px;
        font-weight: bold;
        font-size: 0.85rem;
        transition: all 0.3s ease;
    }
    
    .btn-view:hover, .view-opensea-btn:hover {
        background: var(--neon-green);
        transform: translateY(-2px);
    }
    
    /* Sales List */
    .sales-list {
        display: flex;
        flex-direction: column;
        gap: 0.8rem;
    }
    
    .sale-list-item {
        background: rgba(0, 0, 0, 0.8);
        border: 2px solid var(--secondary-color);
        border-radius: 10px;
        padding: 0.8rem;
        display: grid;
        grid-template-columns: 80px 1fr;
        gap: 1rem;
        transition: all 0.3s ease;
    }
    
    .sale-list-item:hover {
        transform: translateX(5px);
        border-color: var(--neon-green);
    }
    
    .sale-list-image {
        width: 80px;
        height: 80px;
        border-radius: 8px;
        overflow: hidden;
        border: 2px solid var(--primary-color);
    }
    
    .sale-list-image img {
        width: 100%;
        height: 100%;
        object-fit: cover;
    }
    
    .sale-list-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-wrap: wrap;
        gap: 0.5rem;
        padding-bottom: 0.5rem;
        border-bottom: 1px solid rgba(78, 205, 196, 0.3);
    }
    
    .sale-list-title {
        font-size: 0.9rem;
        color: var(--secondary-color);
        margin: 0;
    }
    
    .sale-list-price {
        font-size: 0.85rem;
        font-weight: bold;
        color: var(--neon-green);
        background: rgba(57, 255, 20, 0.1);
        padding: 0.2rem 0.6rem;
        border-radius: 15px;
    }
    
    .sale-list-details {
        display: flex;
        flex-direction: column;
        gap: 0.3rem;
        font-size: 0.75rem;
    }
    
    .sale-list-row {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    
    .sale-list-row .label {
        color: var(--text-secondary);
        text-transform: uppercase;
        font-size: 0.7rem;
    }
    
    .sale-list-row .value {
        color: var(--text-color);
        font-family: 'Courier New', monospace;
        background: rgba(78, 205, 196, 0.1);
        padding: 0.15rem 0.4rem;
        border-radius: 4px;
        font-size: 0.7rem;
    }
    
    .sale-list-link {
        color: var(--neon-blue);
        text-decoration: none;
        font-size: 0.75rem;
        font-weight: bold;
        margin-top: 0.3rem;
    }
    
    .sale-list-link:hover {
        color: var(--neon-green);
    }
    
    /* Trends */
    .trend-display {
        text-align: center;
        padding: 1.5rem;
        background: rgba(0, 0, 0, 0.6);
        border-radius: 12px;
        border: 2px solid var(--secondary-color);
    }
    
    .trend-main-value {
        display: flex;
        align-items: baseline;
        justify-content: center;
        gap: 0.5rem;
        margin-bottom: 0.8rem;
    }
    
    .trend-number {
        font-size: 1.8rem;
        font-weight: bold;
        color: var(--neon-green);
        text-shadow: 0 0 8px var(--neon-green);
    }
    
    .trend-unit {
        font-size: 1rem;
        color: var(--text-secondary);
    }
    
    .trend-label {
        font-size: 0.75rem;
        color: var(--text-secondary);
        text-transform: uppercase;
    }
    
    .trend-change {
        font-size: 0.9rem;
        font-weight: bold;
        margin-top: 0.5rem;
    }
    
    .trend-change.positive { color: var(--neon-green); }
    .trend-change.negative { color: var(--neon-pink); }
    
    /* Tablet */
    @media (max-width: 768px) {
        .featured-content {
            grid-template-columns: 150px 1fr;
            gap: 1rem;
        }
        
        .featured-image {
            width: 150px;
        }
        
        .featured-title {
            font-size: 1.1rem;
        }
        
        .price-value {
            font-size: 1.2rem;
        }
        
        .trend-number {
            font-size: 1.5rem;
        }
        
        .sale-list-item {
            grid-template-columns: 70px 1fr;
        }
        
        .sale-list-image {
            width: 70px;
            height: 70px;
        }
    }
    
    /* Mobile */
    @media (max-width: 480px) {
        .featured-content {
            grid-template-columns: 1fr;
            text-align: center;
        }
        
        .featured-image {
            width: 120px;
            height: 120px;
            margin: 0 auto;
        }
        
        .featured-title {
            font-size: 1rem;
        }
        
        .price-value {
            font-size: 1.1rem;
        }
        
        .detail-row {
            flex-direction: column;
            gap: 0.3rem;
            text-align: center;
        }
        
        .btn-view, .view-opensea-btn {
            padding: 0.7rem 1.2rem;
            font-size: 0.75rem;
        }
        
        .sale-list-item {
            grid-template-columns: 60px 1fr;
            padding: 0.6rem;
        }
        
        .sale-list-image {
            width: 60px;
            height: 60px;
        }
        
        .sale-list-title {
            font-size: 0.8rem;
        }
        
        .sale-list-price {
            font-size: 0.75rem;
        }
        
        .sale-list-row .label,
        .sale-list-row .value {
            font-size: 0.65rem;
        }
        
        .trend-number {
            font-size: 1.3rem;
        }
        
        .trend-unit {
            font-size: 0.85rem;
        }
        
        .trend-label {
            font-size: 0.7rem;
        }
    }
`;
document.head.appendChild(style);