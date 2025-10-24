// NFT Configuration for DoggoZ Collection
// IMPORTANT: Never commit API keys to version control!
// Add this file to .gitignore

const NFT_CONFIG = {
    // Alchemy API Configuration
    alchemy: {
        apiKey: '51ovAh2TG206eo3DVmTYDEeYtL1gl91m', // Replace with your own API key
        baseUrl: 'https://base-mainnet.g.alchemy.com/nft/v3',
        network: 'base-mainnet'
    },

    // NFT Collection Details
    collection: {
        contractAddress: '0xcd84a49328b41549306833c8dfb7d800708b4f3c',
        name: 'DoggoZ Official',
        description: 'Retro Pixel Art Collection',
        openseaSlug: 'doggoz-official' // OpenSea collection slug
    },

    // Slideshow Configuration
    slideshow: {
        maxNFTs: 10,        // Maximum number of NFTs to fetch and display
        imageSize: 'medium', // 'small', 'medium', 'large'
        autoPlayDelay: 2000, // milliseconds
        enableShuffle: true  // Randomize NFT order every time
    },

    // Sales API Configuration
    sales: {
        // OpenSea API for marketplace data (primary choice)
        opensea: {
            apiKey: '8e176bd9e1094546a2a6c5de28f5140d', // ← ADD YOUR FRESH OPENSEA API KEY HERE (get from https://docs.opensea.io/)
            baseUrl: 'https://api.opensea.io/api/v2'
        },

        // Find your OpenSea collection slug by visiting your collection page
        // and copying the slug from the URL: https://opensea.io/collection/YOUR_SLUG
        // Update the openseaSlug in collection config below

        // Moralis API for blockchain transfers
        moralis: {
            apiKey: '', // Get from https://moralis.io/
            baseUrl: 'https://deep-index.moralis.io/api/v2'
        },

        // NFTScan API for comprehensive NFT data
        nftscan: {
            apiKey: '', // Get from https://docs.nftscan.com/
            baseUrl: 'https://restapi.nftscan.com/api/v2',
            chain: 'base' // base for Base chain
        },

        // SimpleHash API for NFT data aggregation
        simplehash: {
            apiKey: '', // Get from https://simplehash.com/
            baseUrl: 'https://api.simplehash.com/api/v2'
        },

        // Covalent API for unified blockchain data
        covalent: {
            apiKey: '', // Get from https://www.covalenthq.com/
            baseUrl: 'https://api.covalenthq.com/v1',
            chainId: 8453 // Base chain ID
        },

        // Dune Analytics API for on-chain analytics
        dune: {
            apiKey: '', // Get from https://dune.com/
            baseUrl: 'https://api.dune.com/api/v1'
        }
    },

    // Fallback Images (in case API fails)
    fallbacks: {
        placeholderImage: 'https://via.placeholder.com/600x400/1a1a1a/FF6B6B?text=DoggoZ+NFT',
        errorImage: 'https://via.placeholder.com/600x400/1a1a1a/FF4444?text=Error+Loading'
    }
};

// Make config available globally
window.NFT_CONFIG = NFT_CONFIG;
