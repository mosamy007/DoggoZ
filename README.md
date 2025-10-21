# DoggoZ Official Website

A retro 80s-styled website for showcasing your pixel art NFT collection.

## Features

✨ **Retro 80s Design** - Nostalgic pixel art aesthetic with neon colors and scanlines
🎨 **Interactive Gallery** - Click-to-view lightbox for your pixel art pieces
🔗 **Social Links** - Easy access to OpenSea, Magic Eden, Twitter, and Discord
📱 **Responsive Design** - Works perfectly on desktop, tablet, and mobile
⚡ **Smooth Animations** - Subtle parallax effects and hover animations
🎮 **Easter Eggs** - Hidden surprises for curious visitors

## Quick Start

1. **Open the website**: Simply open `index.html` in your browser
2. **Customize links**: Update the social media and marketplace links in `index.html`
3. **Add your art**: Replace placeholder images with your actual pixel art PNGs
4. **Deploy**: Upload to any web hosting service

## Customization Guide

### Adding Your Pixel Art

The gallery is populated by JavaScript. To add your own art:

1. **Prepare your images**: Use PNG format with transparent backgrounds
2. **Update the gallery data** in `script.js`:

```javascript
const sampleArtworks = [
    {
        id: 1,
        title: "Your Art Title",
        image: "path/to/your/artwork.png",
        description: "Description of your artwork"
    },
    // Add more artworks...
];
```

### Social Media Links

Update the links in `index.html` with your actual URLs:

```html
<a href="https://twitter.com/yourusername" class="link-card twitter" target="_blank">
<a href="https://discord.gg/yourserver" class="link-card discord" target="_blank">
```

### Colors and Styling

The retro theme uses these main colors (defined in `styles.css`):

- **Primary Red**: `#FF6B6B` - Main brand color
- **Secondary Teal**: `#4ECDC4` - Accent color
- **Neon Pink**: `#FF0080` - Highlight color
- **Neon Blue**: `#00FFFF` - Secondary highlight
- **Neon Green**: `#39FF14` - Interactive elements

## File Structure

```
DoggoZ/
├── index.html      # Main website file
├── styles.css      # Retro 80s styling
├── script.js       # Interactive functionality
└── README.md       # This file
```

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
