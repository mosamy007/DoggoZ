# DoggoZ Official Website

A retro 80s-styled website for showcasing your pixel art NFT collection.

## Features

✨ **Retro 80s Design** - Nostalgic pixel art aesthetic with neon colors and scanlines
🎨 **Dynamic NFT Gallery** - Fetches and displays 10 random NFTs from blockchain via Alchemy API
🔗 **Social Links** - Easy access to OpenSea, Magic Eden, Twitter, and Discord
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
⚡ **Smooth Animations** - Subtle parallax effects and hover animations
🎮 **Easter Eggs** - Hidden surprises for curious visitors
🔄 **Automatic Fallback** - Falls back to static images if API fails

## Quick Start

1. **Get an Alchemy API Key**: Sign up at [Alchemy.com](https://alchemy.com) and create a new app
2. **Configure API settings**: Update the API key in `config.js`
3. **Open the website**: Simply open `index.html` in your browser
4. **Deploy**: Upload to any web hosting service

## NFT API Configuration

The website now fetches real NFT data from the blockchain using Alchemy's API. To set this up:

1. **Get your API key** from [Alchemy Dashboard](https://dashboard.alchemy.com/)
2. **Update `config.js`** with your API key and collection details:
   ```javascript
   const NFT_CONFIG = {
       alchemy: {
           apiKey: 'your-api-key-here',
           baseUrl: 'https://base-mainnet.g.alchemy.com/nft/v3',
           network: 'base-mainnet'
       },
       collection: {
           contractAddress: '0x...', // Your NFT contract address
           name: 'Your Collection Name',
           description: 'Your collection description'
       }
   };
   ```

### API Response Structure

The v3 API returns NFTs with this structure:

```json
{
  "tokenId": "1",
  "name": "DoggoZ #1",
  "image": {
    "cachedUrl": "https://nft-cdn.alchemy.com/base-mainnet/...",
    "originalUrl": "https://ipfs.io/ipfs/QmbbFEZGMeV4JmvJCCYYptxDJUW8ca89EnQkMBX7n8Wh5S/1",
    "pngUrl": "https://res.cloudinary.com/alchemyapi/image/upload/convert-png/...",
    "thumbnailUrl": "https://res.cloudinary.com/alchemyapi/image/upload/thumbnailv2/..."
  }
}
```

**Note**: The `cachedUrl` often shows the collection's profile picture, but the `originalUrl` contains the actual unique NFT image with the token ID.

### Randomization Feature

The slideshow now displays **exactly 10 NFTs** in **random order every time** the page loads:
- Fetches all available NFTs from your collection
- Shuffles them randomly using JavaScript's `Math.random()`
- Displays the first 10 in the shuffled order
- **Refreshes the page = new random order!** 🎲

## Fallback System

The website includes an intelligent fallback system:

- **Primary**: Fetches NFTs from blockchain via Alchemy API
- **Fallback**: If API fails, automatically loads static images from `slideshow-images/` folder
- **Error Handling**: Displays helpful error messages for different API failure scenarios

### Slideshow Configuration

Customize the slideshow behavior in `config.js`:

```javascript
slideshow: {
    maxNFTs: 10,        // Maximum number of NFTs to fetch and display
    imageSize: 'medium', // 'small', 'medium', 'large'
    autoPlayDelay: 2000, // milliseconds
    enableShuffle: true  // Randomize NFT order every time
}
```

## File Structure

```
DoggoZ/
├── index.html      # Main website file
├── config.js       # NFT API configuration (⚠️  Add to .gitignore)
├── styles.css      # Retro 80s styling
├── script.js       # Interactive functionality & NFT fetching
├── slideshow-images/ # Fallback static images (optional)
├── sales.html      # Sales activity dashboard
└── README.md       # This file
```

## Sales Activity Dashboard

The sales page fetches real NFT sales data from blockchain APIs and displays:

- **📊 Daily Statistics** - Volume, sales count, active buyers
- **🏆 Featured Sale** - Biggest sale of the day with full details
- **📋 Recent Sales** - Grid of recent transactions with images
- **📈 Market Trends** - Price and volume charts over time
- **🔄 Auto-Refresh** - Updates every minute

### Sales API Integration

The sales dashboard supports multiple NFT sales APIs:

## API Configuration

### Primary Setup: OpenSea API

1. **Get API Key** from [OpenSea Developer Portal](https://docs.opensea.io/)
2. **Find Collection Slug** - Go to your collection on OpenSea and copy the slug from the URL (e.g., `doggoz-official`)
3. **Add to config.js**:
   ```javascript
   sales: {
       opensea: {
           apiKey: 'your-opensea-api-key',
           baseUrl: 'https://api.opensea.io/api/v2'
       }
   }
   // Also add the collection slug to your collection config:
   collection: {
       contractAddress: '0x...',
       name: 'DoggoZ Official',
       description: 'Retro Pixel Art Collection',
       openseaSlug: 'doggoz-official' // ← Your OpenSea collection slug
   }
   ```

### Alternative APIs (Optional Fallbacks)

#### NFTScan API (Good for Base chain)
1. **Get API Key** from [NFTScan](https://docs.nftscan.com/)
2. **Add to config.js**:
   ```javascript
   sales: {
       nftscan: {
           apiKey: 'your-nftscan-api-key',
           baseUrl: 'https://restapi.nftscan.com/api/v2',
           chain: 'base'
       }
   }
   ```

#### SimpleHash API (Excellent aggregation)
1. **Get API Key** from [SimpleHash](https://simplehash.com/)
2. **Add to config.js**:
   ```javascript
   sales: {
       simplehash: {
           apiKey: 'your-simplehash-api-key',
           baseUrl: 'https://api.simplehash.com/api/v2'
       }
   }
   ```

#### Covalent API (Unified blockchain data)
1. **Get API Key** from [Covalent](https://www.covalenthq.com/)
2. **Add to config.js**:
   ```javascript
   sales: {
       covalent: {
           apiKey: 'your-covalent-api-key',
           baseUrl: 'https://api.covalenthq.com/v1',
           chainId: 8453 // Base chain ID
       }
   }
   ```

#### Moralis API (Blockchain transfers)
1. **Get API Key** from [Moralis Dashboard](https://moralis.io/)
2. **Add to config.js**:
   ```javascript
   sales: {
       moralis: {
           apiKey: 'your-moralis-api-key',
           baseUrl: 'https://deep-index.moralis.io/api/v2'
       }
   }
   ```

#### Dune Analytics API (Advanced analytics)
1. **Get API Key** from [Dune Analytics](https://dune.com/)
2. **Add to config.js**:
   ```javascript
   sales: {
       dune: {
           apiKey: 'your-dune-api-key',
           baseUrl: 'https://api.dune.com/api/v1'
       }
   }
   ```

### Features

- **🔗 Real-time Data** - Live sales from blockchain
- **💰 Price Tracking** - USD and ETH values
- **👥 User Analytics** - Buyer/seller addresses
- **📱 Responsive Design** - Works on all devices
- **⚡ Fast Loading** - Optimized API calls with caching

### Navigation

- **Main Page**: `index.html` - NFT gallery and collection showcase
- **Sales Page**: `sales.html` - Sales activity dashboard
- **Easy Switching** - Navigation buttons between pages

## Security Notes

⚠️ **Important**: The `config.js` file contains your API key. Make sure to:
- Add `config.js` to your `.gitignore` file before deploying
- Never commit API keys to version control
- Use environment variables in production if needed

**For local development only**: `config.js` is temporarily accessible. Uncomment the `config.js` line in `.gitignore` before pushing to production.

### Adding Your Pixel Art (Fallback)

If you want to use static images as fallback or backup:

1. **Prepare your images**: Use PNG format with transparent backgrounds
2. **Add images to `slideshow-images/` folder**: Name them `1.png`, `2.png`, etc.
3. **Update fallback list** in `script.js` if needed

## Deployment

### Option 1: GitHub Pages (Free)
1. Create a new GitHub repository
2. Upload your files
3. Enable Pages in repository settings
4. Access at `https://username.github.io/repository-name`

### Option 2: Netlify (Free)
1. Connect your GitHub repository to Netlify
2. Deploy automatically on push
3. Get a custom domain if desired

### Option 3: Any Web Hosting
- Upload files via FTP or file manager
- Most shared hosting plans work perfectly

## Tips for Best Results

1. **Image Optimization**: Keep pixel art files under 500KB each
2. **Consistent Sizing**: Use similar dimensions for all gallery images
3. **PNG with Transparency**: Ensure your art has transparent backgrounds
4. **Mobile Testing**: Test on various screen sizes
5. **Loading Speed**: Optimize images for web delivery

## Browser Compatibility

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## Need Help?

The website includes:
- Hover effects on all interactive elements
- Smooth scrolling navigation
- Mobile-responsive design
- Accessibility features
- SEO-optimized structure

Just replace the placeholder content with your actual DoggoZ collection details and you'll be ready to showcase your pixel art in true 80s style!

---

*Built with ❤️ for the DoggoZ community*
