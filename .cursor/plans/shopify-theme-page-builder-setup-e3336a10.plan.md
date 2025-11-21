<!-- e3336a10-384d-4bd7-87aa-c357249de0bd 30d935e4-1ea8-4f9a-adbf-16ff1de25059 -->
# Shopify Theme Page Builder Setup

## Overview

Transform all theme sections into fully customizable, page-builder-ready components with comprehensive schema settings, blocks support, and proper integration with Shopify's theme customizer. All sections will support full customization (text, images, colors, layout options) with both blocks AND settings options for repeatable content, and work as both page builder sections (addable anywhere) and template-specific sections.

## User Requirements

- **Full customization**: Text, images, colors, layout options, repeatable blocks for all sections
- **Dual content management**: Both blocks (dynamic add/remove) AND settings (fixed fields) for repeatable content
- **Flexible deployment**: Sections work as both page builder (addable to any page) and template-specific (locked to templates)

## Current State Analysis

- **Basic structure exists**: config.yml, settings_schema.json, multiple sections
- **Limited customization**: Most sections have empty or minimal schema settings
- **Hardcoded content**: Benefits, testimonials, FAQ items are hardcoded
- **Partial integration**: Hero and ingredients have some settings but need enhancement
- **No blocks support**: Repeatable content items cannot be added/removed dynamically

## Implementation Plan

### Phase 1: Enhance Theme Configuration

1. **Update config.yml** - Add proper theme metadata (name, version, author)
2. **Expand settings_schema.json** - Add comprehensive global theme settings (colors, typography, layout, social media, footer)

### Phase 2: Convert Sections to Use Blocks AND Settings (Dual Content Management)

3. **Benefits Section** - Blocks support + Settings fallback (3-6 fixed fields), content mode toggle, full customization
4. **Testimonials Section** - Blocks support + Settings fallback (3-6 fixed fields), content mode toggle, full customization
5. **FAQ Section** - Blocks support + Settings fallback (5-10 fixed fields), content mode toggle, full customization
6. **Ingredients Section** - Blocks support + Settings fallback (5-8 fixed fields), content mode toggle, full customization

### Phase 3: Enhance Existing Sections with Full Customization

7. **Hero Section** - Text, pricing, CTA, discount badge, background, layout options, quantity selector
8. **Header Section** - Logo, menu, cart, sticky header, styling options
9. **Footer Section** - Footer text, social media blocks, newsletter, footer column blocks, payment icons
10. **Main Page Section** - Page title, featured image, custom CSS class

### Phase 4: Product & Collection Integration

11. **Main Product Section** - Verify integration, add layout options, related products, trust badges, product tabs
12. **Product Recommendations Section** - Verify integration, heading, products count, layout options

### Phase 5: Add New Utility Sections for Page Builder

13. **Rich Text Section** (new) - Full WYSIWYG content block
14. **Image Banner Section** (new) - Image with overlay text and CTA
15. **Collection List Section** (new) - Display featured collections
16. **Featured Collection Section** (new) - Single collection with products

### Phase 6: Template Configuration & Page Builder Setup

17. **Update index.json** - All sections properly ordered, presets, visibility settings
18. **Update product.json** - Verify integration, add presets
19. **Create/Update collection.json** - Collection template with page builder
20. **Create page.json** - Full page builder template (all sections addable)
21. **Update cart.json** - Cart template customization

### Phase 7: Testing & Validation

22. **Theme Customizer Testing** - All settings, blocks add/remove/reorder, visibility, responsive
23. **Data Integration Testing** - Product/collection data, cart functionality, variants
24. **Cross-browser & Device Testing** - Mobile, desktop, theme customizer preview

## Key Implementation Details

### Dual Content Management Pattern

For repeatable content (benefits, testimonials, FAQ, ingredients):

- **Content mode toggle**: Settings field to switch between "blocks" and "settings" mode
- **Blocks mode**: Use `{% for block in section.blocks %}` for dynamic content
- **Settings mode**: Use fixed numbered fields (item_1, item_2, etc.) for simpler management
- **Conditional rendering**: `{% if section.settings.content_mode == 'blocks' %}` to switch logic

### Schema Structure Pattern

```liquid
{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "class": "section-class",
  "settings": [
    {
      "type": "select",
      "id": "content_mode",
      "label": "Content Management",
      "options": [
        { "value": "blocks", "label": "Use Blocks (Dynamic)" },
        { "value": "settings", "label": "Use Settings (Fixed)" }
      ],
      "default": "blocks"
    }
    // Section-level settings with full customization
  ],
  "blocks": [
    {
      "type": "content_block",
      "name": "Content Item",
      "settings": [
        // Block-level settings (text, images, colors)
      ]
    }
  ],
  "presets": [
    {
      "name": "Section Name",
      "blocks": [
        // Default blocks
      ]
    }
  ],
  "templates": ["index", "page", "product", "collection"]
}
{% endschema %}
```

### Page Builder vs Template-Specific

- **Page builder sections**: Add `"templates": ["index", "page", "product", "collection"]` to schema
- **Template-specific**: Limit `"templates"` array to specific templates
- **Global sections**: Header, footer should be in layout/theme.liquid
- **Optional sections**: Use `"limit": 1` or remove limit for multiple instances

## Files to Modify

- `config.yml` - Theme configuration
- `config/settings_schema.json` - Global theme settings
- `sections/benefits.liquid` - Add blocks + settings dual mode
- `sections/testimonials.liquid` - Add blocks + settings dual mode
- `sections/faq.liquid` - Add blocks + settings dual mode
- `sections/ingredients.liquid` - Add blocks + settings dual mode
- `sections/hero.liquid` - Full customization
- `sections/header.liquid` - Full customization
- `sections/footer.liquid` - Full customization with blocks
- `sections/main-page.liquid` - Enhance settings
- `sections/main-product.liquid` - Verify and enhance
- `sections/product-recommendations.liquid` - Verify and enhance
- `sections/rich-text.liquid` - New section
- `sections/image-banner.liquid` - New section
- `sections/collection-list.liquid` - New section
- `sections/featured-collection.liquid` - New section
- `templates/index.json` - Update configuration
- `templates/product.json` - Verify configuration
- `templates/collection.json` - Create/update
- `templates/page.json` - Create full page builder template
- `templates/cart.json` - Update (if exists)

## Success Criteria

- ✅ All sections appear in Shopify theme customizer with comprehensive settings
- ✅ All sections support full customization (text, images, colors, layout options)
- ✅ Repeatable content supports both blocks (dynamic) AND settings (fixed) modes
- ✅ Sections can be added/removed/reordered on pages via theme customizer
- ✅ Sections work on multiple template types (index, page, product, collection)
- ✅ Product and collection data displays correctly
- ✅ All settings save and preview correctly
- ✅ Theme works with existing Shopify store data without breaking