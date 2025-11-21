# Custom Shopify Theme

A modern, customizable Shopify theme built from scratch with clean code and best practices.

## Features

- **Modern Design**: Clean, responsive design that works on all devices
- **Customizable**: Easy-to-use theme settings for colors, typography, and layout
- **Performance Optimized**: Fast loading times with optimized assets
- **SEO Friendly**: Proper meta tags and semantic HTML
- **Accessible**: WCAG compliant with proper ARIA labels and keyboard navigation
- **Product Features**: Full product page with variants, images, and add to cart
- **Flexible Sections**: Modular sections that can be customized in the theme editor

## Theme Structure

```
.
├── assets/              # CSS, JavaScript, and other assets
│   ├── base.css        # Main stylesheet
│   └── global.js       # Global JavaScript functionality
├── config/             # Theme configuration
│   └── settings_schema.json  # Theme settings schema
├── layout/             # Layout templates
│   └── theme.liquid    # Main theme layout
├── locales/            # Translation files
│   └── en.default.json # English translations
├── sections/           # Theme sections
│   ├── header.liquid   # Header section
│   ├── footer.liquid   # Footer section
│   ├── main-page.liquid
│   ├── main-product.liquid
│   └── product-recommendations.liquid
├── snippets/           # Reusable code snippets
│   ├── icon-*.liquid   # Icon components
│   ├── meta-tags.liquid
│   ├── product-card.liquid
│   └── product-media.liquid
├── templates/          # Page templates
│   ├── index.json      # Homepage template
│   └── product.json    # Product page template
└── config.yml          # Theme metadata

```

## Getting Started

### Prerequisites

- A Shopify store (development store or paid account)
- [Shopify CLI](https://shopify.dev/themes/tools/cli) installed
- Node.js (for Shopify CLI)

### Installation

1. **Install Shopify CLI** (if not already installed):
   ```bash
   npm install -g @shopify/cli @shopify/theme
   ```

2. **Login to Shopify**:
   ```bash
   shopify auth login
   ```
   This will open your browser to authenticate with Shopify.

3. **Navigate to your theme directory**:
   ```bash
   cd "pure and vida"
   ```

4. **Connect to your store** (choose one method):

   **Option A: Let CLI prompt you for store selection**
   ```bash
   shopify theme dev
   ```
   This will:
   - Prompt you to select your store
   - Create a development theme
   - Start a local development server
   - Provide a preview URL

   **Option B: Specify store directly**
   ```bash
   shopify theme dev --store=your-store.myshopify.com
   ```
   Replace `your-store.myshopify.com` with your actual store domain.

   **Option C: Set environment variable**
   ```bash
   export SHOPIFY_FLAG_STORE=your-store.myshopify.com
   shopify theme dev
   ```

### Troubleshooting Store Connection

If you get the error "A store is required":

1. **Make sure you're authenticated**:
   ```bash
   shopify auth login
   ```

2. **Check if you have access to any stores**:
   ```bash
   shopify auth status
   ```

3. **If you don't have a store yet**, create a free development store:
   - Go to [partners.shopify.com](https://partners.shopify.com)
   - Sign up for a Shopify Partners account (free)
   - Create a development store
   - Use that store's domain (e.g., `my-dev-store.myshopify.com`)

4. **Specify the store explicitly**:
   ```bash
   shopify theme dev --store=your-store.myshopify.com
   ```

### Development

1. **Start the development server**:
   ```bash
   shopify theme dev
   ```

2. **Open the preview URL** in your browser to see your theme

3. **Make changes** to your theme files - they will automatically sync to your development theme

4. **Push changes to a theme**:
   ```bash
   shopify theme push
   ```

### Theme Customization

#### Theme Settings

Customize your theme through the Shopify admin:

1. Go to **Online Store > Themes**
2. Click **Customize** on your theme
3. Use the theme settings panel to adjust:
   - Colors (Primary, Secondary, Background, Text)
   - Typography (Heading and Body fonts)
   - Layout (Container width)

#### Adding Sections

Sections can be added to templates through the theme editor. Available sections include:

- **Header**: Navigation and cart icon
- **Footer**: Links, newsletter signup, and copyright
- **Main Page**: Content for homepage
- **Main Product**: Product details and add to cart
- **Product Recommendations**: Related products

#### Customizing Styles

Edit `assets/base.css` to customize the theme's appearance. The CSS uses CSS custom properties (variables) for easy theming:

```css
:root {
  --color-primary: #000000;
  --color-secondary: #666666;
  --color-background: #ffffff;
  --color-text: #000000;
  --page-width: 1440px;
}
```

## Deployment

### Push to Live Theme

1. **Push to a specific theme**:
   ```bash
   shopify theme push --theme=THEME_ID
   ```

2. **Publish a theme**:
   ```bash
   shopify theme push --live
   ```
   ⚠️ **Warning**: This will publish directly to your live store!

### Best Practices

- Always test changes in a development theme first
- Use version control (Git) to track changes
- Create backups before major changes
- Test on multiple devices and browsers

## File Structure Details

### Sections

Sections are reusable components that can be added to templates:

- **header.liquid**: Site header with logo, navigation, and cart
- **footer.liquid**: Site footer with links and newsletter
- **main-product.liquid**: Product page with variants and add to cart
- **product-recommendations.liquid**: Related products section

### Snippets

Snippets are reusable code fragments:

- **icon-*.liquid**: SVG icons for cart, search, account, etc.
- **product-card.liquid**: Product card for product grids
- **product-media.liquid**: Product image/video display
- **meta-tags.liquid**: SEO meta tags

### Templates

Templates define the structure of different page types:

- **index.json**: Homepage template
- **product.json**: Product page template

## Customization Guide

### Adding a New Section

1. Create a new file in `sections/` (e.g., `my-section.liquid`)
2. Add the section schema at the bottom
3. Add the section to a template JSON file

### Adding a New Snippet

1. Create a new file in `snippets/` (e.g., `my-snippet.liquid`)
2. Use `{% render 'my-snippet' %}` to include it

### Modifying Colors

1. Go to **Theme Customizer > Theme Settings > Colors**
2. Or edit CSS variables in `assets/base.css`

## Troubleshooting

### Theme not syncing

- Check your internet connection
- Restart the development server: `shopify theme dev`
- Clear cache: `shopify theme dev --reset`

### Styles not updating

- Hard refresh your browser (Cmd+Shift+R / Ctrl+Shift+R)
- Check browser console for errors
- Verify CSS file is being loaded

### JavaScript errors

- Check browser console for errors
- Verify `assets/global.js` is included in `layout/theme.liquid`
- Ensure proper script loading order

## Resources

- [Shopify Theme Development Documentation](https://shopify.dev/themes)
- [Liquid Template Language](https://shopify.dev/api/liquid)
- [Shopify CLI Documentation](https://shopify.dev/themes/tools/cli)
- [Theme Development Best Practices](https://shopify.dev/themes/best-practices)

## Support

For issues or questions:
1. Check the [Shopify Community Forums](https://community.shopify.com/)
2. Review [Shopify Documentation](https://shopify.dev/)
3. Contact Shopify Support

## License

This theme is provided as-is for use with Shopify stores.

---

**Happy Theme Building! 🎨**
