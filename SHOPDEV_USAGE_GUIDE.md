# Shopdev Section Usage Guide

## What is "shopdev"?

The `shopdev` class is a CSS namespace used in the **MycoMatcha Product Page** section to scope all styles and prevent conflicts with your existing theme. All styles are prefixed with `.shopdev` so they only apply within this section.

## How to Use the Shopdev Section

### Option 1: Create a Dedicated Product Template (Recommended)

I've created a new template file: `templates/product.mycomatcha.json`

**To use it:**

1. **In Shopify Admin:**
   - Go to **Online Store > Themes > Customize**
   - Navigate to a product page
   - Click the **Theme settings** icon (gear) at the top
   - Select **Change template**
   - Choose **product.mycomatcha** from the dropdown
   - Save

2. **Assign to Specific Products:**
   - Go to **Products** in Shopify admin
   - Click on a product
   - Scroll to **Theme templates** section
   - Select **product.mycomatcha** from the dropdown
   - Save

### Option 2: Add to Existing Product Template

You can add the shopdev section to your existing `product.json` template:

```json
{
  "sections": {
    "main": {
      "type": "main-product",
      ...
    },
    "mycomatcha_section": {
      "type": "mycomatcha-product-page",
      "settings": {
        "product_title": "MycoMatcha",
        "badge_text": "Get 33% off today",
        ...
      }
    }
  },
  "order": [
    "main",
    "mycomatcha_section"
  ]
}
```

### Option 3: Use in Theme Customizer

1. Go to **Online Store > Themes > Customize**
2. Navigate to any product page
3. Click **Add section**
4. Look for **"MycoMatcha Product Page"** in the section list
5. Add it and configure the settings

## Section Settings

The section includes these customizable settings:

### Main Settings
- **Custom Font File** - Upload a custom font (.woff, .woff2, .ttf, .otf)
- **Product Image** - Main product image
- **Product Title** - Product name
- **Badge Text** - Promotional badge text (e.g., "Get 33% off today")
- **Original Price** - Strikethrough price
- **Sale Price** - Current price
- **Product Description** - Product description text
- **Button Text** - Add to cart button text
- **Comparison Title** - Title for comparison table
- **Shipping Title** - Shipping section title
- **Shipping Content** - Shipping and returns information
- **FAQ Title** - FAQ section title

### Blocks

You can add multiple blocks:

1. **Customer Review** - Testimonials with reviewer name
2. **Benefit** - Product benefits with icon, title, and description
3. **Comparison Row** - Feature comparison (MycoMatcha vs Coffee)
4. **FAQ Item** - Frequently asked questions with answers

## Customization Tips

### Using Product Data Dynamically

To make the section use actual product data, you can modify the section to use Shopify's `product` object:

```liquid
{%- if product -%}
  <h2>{{ product.title }}</h2>
  <p>{{ product.price | money }}</p>
  <p>{{ product.description }}</p>
{%- endif -%}
```

### Styling Customization

All styles are scoped to `.shopdev`, so you can:

1. **Override styles in your theme CSS:**
```css
.shopdev .bg-cream {
  background-color: #YOUR_COLOR;
}
```

2. **Add custom CSS in theme settings:**
   - Go to **Theme Settings > Custom CSS**
   - Add your overrides there

### Color Customization

The section uses these color classes:
- `.bg-cream` - `#F5F3EE`
- `.bg-teal` - `#5E8778`
- `.bg-orange` - `#E8983B`
- `.bg-dark-green` - `#516D55`
- `.bg-dark-olive` - `#4E4E33`
- `.bg-amber` - `#F9A000`

You can modify these in the `<style>` section of `sections/mycomatcha-product-page.liquid`.

## Integration with Existing Theme

The `shopdev` class ensures:
- ✅ No style conflicts with your existing theme
- ✅ Isolated CSS that only affects this section
- ✅ Easy to remove without breaking other pages
- ✅ Can be used alongside other sections

## Troubleshooting

### Styles Not Showing
- Make sure the section is properly added to your template
- Check that the `.shopdev` wrapper div is present
- Verify CSS is loading (check browser DevTools)

### Liquid Code Showing as Text
- Ensure all Liquid tags are properly closed
- Check for syntax errors in the section file
- Clear Shopify cache by saving the theme

### Mobile Menu Not Working
- Verify JavaScript is loading
- Check browser console for errors
- Ensure Phosphor Icons CSS is loaded

## Next Steps

1. **Test the template** on a product page
2. **Customize the content** in theme customizer
3. **Add your product images** and content
4. **Configure blocks** (reviews, benefits, FAQs)
5. **Test on mobile** to ensure responsive design works

## Support

If you encounter issues:
1. Check browser console for JavaScript errors
2. Verify all section settings are configured
3. Test with a fresh product page
4. Clear browser and Shopify cache

