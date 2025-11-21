# Quick Reference: Shopify Theme Enhancements

## 🎯 Immediate Action Items

### 1. Add Liquid Doc to Snippets (High Priority)
**Why:** Required for Theme Store approval, improves developer experience

**Files to Update:**
- `snippets/product-card.liquid`
- `snippets/product-media.liquid`
- `snippets/cart-notification.liquid`
- All other snippets in `/snippets/`

**Example Template:**
```liquid
{%- liquid
  # @description Renders a product card component
  # @param product {Product} - The product object to display
  # @param show_price {Boolean} - Display product price (default: true)
  # @param show_vendor {Boolean} - Display product vendor (default: false)
  # @example
  #   {% render 'product-card', product: product, show_price: true %}
-%}
```

---

### 2. Implement CSS Custom Properties (Medium Priority)
**Why:** Better theme customization, easier color management

**Add to `layout/theme.liquid`:**
```liquid
{% style %}
  :root {
    --color-primary: {{ settings.color_primary | default: '#000000' }};
    --color-secondary: {{ settings.color_secondary | default: '#ffffff' }};
    --font-size-base: {{ settings.font_size_base | default: 16 }}px;
    --spacing-base: {{ settings.spacing_base | default: 20 }}px;
  }
{% endstyle %}
```

**Update `config/settings_schema.json`** to include these color settings.

---

### 3. Optimize Liquid Code (Medium Priority)
**Why:** Better performance, cleaner HTML output

**Replace:**
```liquid
{% if condition %}
  content
{% endif %}
```

**With:**
```liquid
{%- if condition -%}
  content
{%- endif -%}
```

**Apply to:** All section files, especially loops and conditionals.

---

### 4. Add Structured Data (High Priority for SEO)
**Why:** Better search engine visibility, rich snippets

**Add to `sections/main-product.liquid`:**
```liquid
<script type="application/ld+json">
{
  "@context": "https://schema.org/",
  "@type": "Product",
  "name": "{{ product.title | escape }}",
  "description": "{{ product.description | strip_html | escape }}",
  "image": [
    {%- for image in product.images -%}
      "{{ image | image_url: width: 1200 }}"{% unless forloop.last %},{% endunless %}
    {%- endfor -%}
  ],
  "offers": {
    "@type": "Offer",
    "url": "{{ shop.url }}{{ product.url }}",
    "priceCurrency": "{{ cart.currency.iso_code }}",
    "price": "{{ product.price | money_without_currency }}",
    "availability": "https://schema.org/{% if product.available %}InStock{% else %}OutOfStock{% endif %}"
  }
}
</script>
```

---

### 5. Enhance Metafields Usage (Based on Your Needs)
**Why:** Dynamic content without code changes

**Current Opportunities:**
- Product ingredients (already in use)
- Product benefits
- Usage instructions
- Custom product badges
- Collection descriptions

**Example Implementation:**
```liquid
{%- if product.metafields.custom.benefits != blank -%}
  <div class="product-benefits">
    <h3>Benefits</h3>
    {{ product.metafields.custom.benefits }}
  </div>
{%- endif -%}
```

---

## 📊 Performance Quick Wins

### Image Optimization
```liquid
{%- comment -%} Replace fixed image sizes with responsive images {%- endcomment -%}
<img 
  srcset="
    {{ image | image_url: width: 400 }} 400w,
    {{ image | image_url: width: 800 }} 800w,
    {{ image | image_url: width: 1200 }} 1200w
  "
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
  src="{{ image | image_url: width: 800 }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
>
```

### Lazy Loading
Add `loading="lazy"` to all images below the fold.

---

## 🔧 Section Enhancement Checklist

For each section, ensure:

- [ ] Liquid Doc comments added
- [ ] Whitespace control (`{%-` and `-%}`) implemented
- [ ] CSS custom properties used for colors
- [ ] Responsive images implemented
- [ ] Accessibility attributes (ARIA labels, alt text)
- [ ] Schema includes all customization options
- [ ] Blocks support for repeatable content (where applicable)
- [ ] Mobile-responsive design verified

---

## 🚀 Integration with Existing Plan

Your current page builder setup plan (`.cursor/plans/shopify-theme-page-builder-setup-e3336a10.plan.md`) focuses on:
- ✅ Section customization
- ✅ Blocks and settings dual mode
- ✅ Page builder functionality

**These enhancements complement by adding:**
- ✅ Code quality (Liquid Doc)
- ✅ Performance optimization
- ✅ SEO improvements
- ✅ Advanced Liquid techniques
- ✅ Modern best practices

---

## 📝 Next Steps

1. **Week 1:** Add Liquid Doc to all snippets
2. **Week 2:** Implement CSS custom properties
3. **Week 3:** Optimize Liquid code (whitespace control)
4. **Week 4:** Add structured data to product pages
5. **Week 5:** Enhance metafields usage
6. **Week 6:** Performance optimization (images, lazy loading)

---

## 🔗 Resources

- **Full Enhancement Guide:** See `ADVANCED_SHOPIFY_ENHANCEMENTS.md`
- **Page Builder Plan:** See `.cursor/plans/shopify-theme-page-builder-setup-e3336a10.plan.md`
- **Shopify Docs:** https://shopify.dev/docs/themes
- **Liquid Doc Guide:** https://www.howcommerce.com/shopify-liquid-doc/

---

*Quick reference for immediate implementation - See full guide for detailed explanations*

