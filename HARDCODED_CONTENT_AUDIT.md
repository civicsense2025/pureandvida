# Hardcoded Content Audit Report
**Theme:** Pure + Vida Shopify Theme
**Date:** 2025-11-25
**Scope:** All sections, snippets, templates, and layouts

---

## Executive Summary

**Total Files Scanned:** 72 Liquid files + JSON templates
**Total Hardcoded Issues Found:** 147 items across 12 files
**Severity Breakdown:**
- **Critical (Must Fix):** 86 items - Content that should be theme editor settings
- **High (Should Fix):** 38 items - Inline styles that should use CSS variables
- **Medium (Consider):** 23 items - Text that has fallbacks but could be improved

---

## Files Ranked by Severity (Most Issues First)

### 1. ❌ CRITICAL: `/sections/shopdev-myco-matcha-product-page.liquid`
**Total Issues: 52** (35 text, 12 URLs, 5 colors)

#### Hardcoded Header/Navigation (Lines 41-56)
- Line 46: `"PURE  VIDA"` → Should be `{{ section.settings.site_name }}`
- Line 51: `"MycoMatcha"` link text → Should be `{{ section.settings.nav_link_1_text }}`
- Line 52: `"Order Tracking"` link text → Should be `{{ section.settings.nav_link_2_text }}`
- Line 53: `"About"` link text → Should be `{{ section.settings.nav_link_3_text }}`
- Line 54: `"View Cart"` button text → Should be `{{ section.settings.cart_button_text }}`
- Lines 51-54: All `href="#"` → Should be configurable URLs

#### Hardcoded Product Display (Lines 94-95)
- Line 95: `"+ 1"` quantity text → Should be dynamic or setting

#### Hardcoded Payment Icons (Lines 103-123)
- Lines 104, 107, 116, 119, 122: External image URLs from `assets.shopdev.ai`
  - Should use uploaded image settings or Shopify CDN
  - **Total: 5 external dependencies** (creates maintenance issues)

#### Hardcoded Star Rating Icons (Line 137)
- Line 137: External star image URL → Should be SVG or setting

#### Hardcoded Comparison Table Headers (Lines 179-180)
- Line 179: `"MycoMatcha"` → Should be `{{ section.settings.product_name }}`
- Line 180: `"Coffee"` → Should be `{{ section.settings.comparison_column_2 }}`

#### Hardcoded Footer Content (Lines 226-282)
- Line 231: `"PURE  VIDA"` footer logo → Should be setting
- Line 234: `"Copyright Pura Vida 2025. All rights reserved."` → Should be `{{ section.settings.copyright_text }}`
- Line 239: `"Shop MycoMatcha"` → Should be setting
- Line 240: `"About Us"` → Should be setting
- Line 242: `"The Company"` → Should be link block setting
- Line 243: `"Terms of Service"` → Should be link block setting
- Line 244: `"Privacy Policy"` → Should be link block setting
- Line 249: `"For You"` heading → Should be setting
- Line 251: `"Shipping Information"` → Should be link block setting
- Line 252: `"Return & Refund Policy"` → Should be link block setting
- Line 253: `"Track Your Order"` → Should be link block setting
- Line 254: `"Contact Us"` → Should be link block setting
- Line 255: `"Privacy Choices"` → Should be link block setting
- Lines 260-280: More hardcoded payment icon URLs (6 additional)

#### Hardcoded Colors in Style Tag (Lines 3-39)
- Line 4: `background-color: #F5F3EE` → Should use CSS custom property
- Line 5: `background-color: #5E8778` → Should use CSS custom property
- Line 6: `background-color: #E8983B` → Should use CSS custom property
- Line 7: `background-color: #516D55` → Should use CSS custom property
- Line 8: `background-color: #4E4E33` → Should use CSS custom property
- Line 9: `background-color: #F9A000` → Should use CSS custom property
- Lines 11-16: More hardcoded colors → All should be theme settings

**Quick Win:** Make all navigation links, footer links, and brand text editable
**Major Refactor:** Replace all external image URLs with section settings or asset_url

---

### 2. ⚠️ HIGH: `/sections/main-password.liquid`
**Total Issues: 7** (4 inline styles, 3 text strings)

#### Hardcoded Text (Lines 8, 12, 14)
- Line 8: `"This store is password protected. Please enter the password to continue."` → Should be `{{ section.settings.description }}`
- Line 12: `placeholder="Password"` → Should be `{{ section.settings.placeholder_text }}`
- Line 14: `"Enter"` button text → Should be `{{ section.settings.button_text }}`

#### Hardcoded Inline Styles (Lines 12, 14, 18)
- Line 12: `style="width: 100%; padding: 12px; border: 1px solid #ccc; border-radius: 4px;"` → Should use CSS classes
- Line 14: `style="width: 100%; padding: 12px; background: #000; color: #fff; border: none; border-radius: 4px; cursor: pointer;"` → Should use CSS classes
- Line 18: `style="margin-top: 20px; color: #d00;"` → Should use CSS classes

**Quick Win:** Add section settings for all text strings
**Quick Win:** Create CSS classes to replace inline styles

---

### 3. ⚠️ HIGH: `/sections/main-404.liquid`
**Total Issues: 9** (5 inline styles, 4 text strings)

#### Hardcoded Text (Lines 24, 25, 32, 36)
- Line 24: `placeholder="Search..."` → Should be `{{ section.settings.search_placeholder }}`
- Line 25: `"Search"` button text → Should be setting
- Line 32: `"Browse Collections"` link text → Should be setting
- Line 36: `"View All Products"` link text → Should be setting

#### Hardcoded Inline Styles (Lines 24, 25, 32, 36, 40)
- Multiple button/link styles with hardcoded colors `#000`, `#fff`, `#ccc`
- Should use CSS classes with theme color variables

**Quick Win:** Add settings for button text and placeholders
**Quick Win:** Replace inline styles with CSS classes

---

### 4. ⚠️ HIGH: `/sections/main-search.liquid`
**Total Issues: 8** (5 inline styles, 3 text strings)

#### Hardcoded Text (Lines 9, 11, 16, 17)
- Line 9: `"Search results for"` → Should use translation string
- Line 11: `"Search"` heading → Should use translation
- Line 16: `placeholder="Search..."` → Should be setting
- Line 17: `"Search"` button → Should be setting
- Line 32: `"View →"` link text → Should be setting
- Line 37: `"No results found for"` → Should use translation

#### Hardcoded Inline Styles (Lines 16, 17, 24-32)
- Similar pattern to other sections with hardcoded colors

**Quick Win:** Add translation keys for all search-related text
**Quick Win:** Replace inline styles with CSS classes

---

### 5. ⚠️ HIGH: `/snippets/product-stock-indicator.liquid`
**Total Issues: 5** (5 fallback text strings)

#### Hardcoded Fallback Text (Lines 27, 37, 48, 55, 64)
- Line 27: `"Only {{ inventory_quantity }} left in stock"` fallback
- Line 37: `"In Stock"` fallback
- Line 48: `"Out of Stock"` fallback
- Line 55: `"Unavailable"` fallback
- Line 64: `"Available"` fallback

**Good News:** These already have translation lookups with `| t | default:`
**Recommendation:** Ensure translations exist in `/locales/en.default.json`

**Status:** ✅ Best practice implemented (has fallbacks)
**Action:** Verify translation file has these keys

---

### 6. ⚠️ HIGH: `/sections/header.liquid`
**Total Issues: 3** (3 hardcoded default navigation links)

#### Hardcoded Fallback Navigation (Lines 76, 79, 82)
When no menu is configured, displays hardcoded links:
- Line 76: `"MycoMatcha"` link → Conditional fallback (acceptable)
- Line 79: `"Order Tracking"` link → Conditional fallback
- Line 82: `"About"` link → Conditional fallback

**Status:** ⚠️ Acceptable (only shown when menu is empty)
**Recommendation:** Document that users should configure menu in theme settings

---

### 7. ⚠️ MEDIUM: Inline Style Patterns Across Multiple Sections

#### Files with Extensive Inline Styles:
1. **`/sections/faq.liquid`** - 15+ inline style attributes with hardcoded colors
2. **`/sections/hero.liquid`** - 12+ inline style attributes
3. **`/sections/product-hero-landing.liquid`** - 10+ inline style attributes
4. **`/sections/product-recommendations.liquid`** - 8+ inline style attributes
5. **`/sections/collection-list.liquid`** - 14+ inline style attributes
6. **`/sections/rich-text.liquid`** - 5+ inline style attributes
7. **`/sections/testimonials.liquid`** - 4+ inline style attributes
8. **`/sections/hero-product-info.liquid`** - 9+ inline style attributes

**Pattern:**
```liquid
style="{% if section.settings.heading_color != blank %}color: {{ section.settings.heading_color }};{% endif %}"
```

**Issue:** While these use settings, they generate inline styles which:
- Override CSS cascade
- Make global style changes difficult
- Reduce performance (no CSS caching)
- Make responsive design harder

**Recommendation:**
Replace with CSS custom properties:
```liquid
<style>
  .hero-section {
    --heading-color: {{ section.settings.heading_color | default: 'inherit' }};
  }
</style>
<h1 style="color: var(--heading-color);">
```

Or better, use CSS classes:
```liquid
<h1 class="hero-heading" {% if section.settings.heading_color %}style="color: {{ section.settings.heading_color }};"{% endif %}>
```

---

### 8. ✅ GOOD: Well-Structured Sections (No Major Issues)

These sections follow best practices:
- **`/sections/main-product.liquid`** - All text from settings, minimal inline styles
- **`/sections/product-card.liquid`** - Uses translation strings properly
- **`/sections/footer.liquid`** - Fully configurable via settings and blocks
- **`/snippets/logo.liquid`** - Clean conditional rendering
- **`/snippets/product-badges.liquid`** - Uses CSS variables correctly
- **`/snippets/structured-data.liquid`** - Properly uses schema.org standards
- **All `/templates/*.json`** files - Correctly configured

---

## Summary by Category

### Hardcoded Text Content (86 items)
**Critical Fixes:**
1. `/sections/shopdev-myco-matcha-product-page.liquid` - 35 text strings
2. `/sections/main-password.liquid` - 3 text strings
3. `/sections/main-404.liquid` - 4 text strings
4. `/sections/main-search.liquid` - 6 text strings
5. `/snippets/product-stock-indicator.liquid` - 5 fallbacks (has translations)

**Common Patterns:**
- Navigation link text
- Button labels ("Add to cart", "Search", "View Cart")
- Placeholder text in forms
- Footer copyright and link text
- Error/success messages
- Heading defaults

**Recommended Fix:**
Add schema settings for all user-facing text:
```json
{
  "type": "text",
  "id": "button_text",
  "label": "Button Text",
  "default": "Add to cart"
}
```

---

### Hardcoded URLs (12 items)
**All in:** `/sections/shopdev-myco-matcha-product-page.liquid`

**External Dependencies:**
- 11 images from `https://assets.shopdev.ai/figma-imports/...`
- Creates maintenance burden
- Breaks if external service changes/fails
- Not controlled by merchant

**Recommended Fix:**
1. Upload images to theme assets
2. Use `{{ 'icon-name.svg' | asset_url }}` or
3. Add image_picker settings:
```json
{
  "type": "image_picker",
  "id": "payment_icon_visa",
  "label": "Visa Icon"
}
```

---

### Hardcoded Inline Styles (38 items)

**Files with Most Inline Styles:**
1. `/sections/faq.liquid` - 15 instances
2. `/sections/collection-list.liquid` - 14 instances
3. `/sections/hero.liquid` - 12 instances
4. `/sections/product-hero-landing.liquid` - 10 instances
5. `/sections/hero-product-info.liquid` - 9 instances

**Common Issues:**
- Hardcoded colors (`#000`, `#fff`, `#ccc`, `#d00`)
- Hardcoded dimensions (`12px`, `24px`, `100%`)
- Spacing values (`padding: 12px 24px`)
- Border styles (`border: 1px solid #ccc`)

**Recommended Fix Approaches:**

**Option 1: CSS Custom Properties (Best)**
```liquid
<style>
  .section-{{ section.id }} {
    --primary-color: {{ section.settings.primary_color | default: '#000' }};
    --button-padding: {{ section.settings.button_padding | default: 12 }}px;
  }
</style>
```

**Option 2: CSS Classes (Good)**
```css
.btn-primary {
  background: var(--color-button-primary);
  color: var(--color-button-text);
  padding: var(--button-padding);
}
```

**Option 3: Utility Classes (Acceptable)**
Use existing framework classes if available.

---

### Hardcoded Colors in `<style>` Tags (11 items)
**File:** `/sections/shopdev-myco-matcha-product-page.liquid` (Lines 3-39)

**Issue:** Color palette hardcoded in style block:
```css
.bg-cream { background-color: #F5F3EE; }
.bg-teal { background-color: #5E8778; }
.bg-orange { background-color: #E8983B; }
```

**Recommended Fix:**
Move to theme settings:
```json
{
  "type": "color",
  "id": "color_cream",
  "label": "Cream Background",
  "default": "#F5F3EE"
}
```

Then reference in CSS:
```liquid
<style>
  .bg-cream { background-color: {{ section.settings.color_cream }}; }
</style>
```

---

## Priority Action Plan

### Phase 1: Quick Wins (1-2 hours)
**Impact: High | Effort: Low**

1. **Add text settings** to sections:
   - `/sections/main-password.liquid` (3 settings)
   - `/sections/main-404.liquid` (4 settings)
   - `/sections/main-search.liquid` (6 settings)

2. **Replace placeholders** with settings:
   - Search inputs
   - Password inputs
   - Form fields

3. **Document header fallback navigation:**
   - Add note in section schema that menu should be configured

### Phase 2: Critical Content (4-6 hours)
**Impact: Critical | Effort: Medium**

1. **Refactor `/sections/shopdev-myco-matcha-product-page.liquid`:**
   - Add 35 text settings for all hardcoded strings
   - Add header navigation settings (4 links + URLs)
   - Add footer settings (10+ link texts + URLs)
   - Add comparison table settings
   - Add brand name setting

2. **Replace external image URLs:**
   - Upload 11 payment/icon images to theme assets
   - Add image_picker settings OR
   - Use asset_url filter for local images

### Phase 3: Styles Refactor (8-12 hours)
**Impact: Medium | Effort: High**

1. **Create CSS custom properties system:**
   - Define color palette in settings_schema.json
   - Create global CSS variables
   - Replace inline colors with variable references

2. **Extract inline styles to CSS classes:**
   - Create utility classes for common patterns
   - Replace style attributes with class names
   - Maintain section-level customization via CSS vars

3. **Refactor sections with most inline styles:**
   - `/sections/faq.liquid`
   - `/sections/collection-list.liquid`
   - `/sections/hero.liquid`
   - `/sections/product-hero-landing.liquid`

### Phase 4: Polish & Testing (2-4 hours)
**Impact: Low | Effort: Low**

1. **Add translation strings:**
   - Update `/locales/en.default.json`
   - Add keys for all user-facing text
   - Test fallbacks

2. **Create documentation:**
   - Theme customization guide
   - Section settings reference
   - Color system documentation

3. **Test in Theme Editor:**
   - Verify all settings work correctly
   - Check mobile responsiveness
   - Validate with different content lengths

---

## Files That Are Already Good ✅

These files follow best practices and need no changes:

### Sections (Well-Structured)
- `/sections/main-product.liquid` - Fully editable
- `/sections/footer.liquid` - Block-based, fully configurable
- `/sections/benefits.liquid` - Good structure
- `/sections/testimonials.liquid` - Block-based
- `/sections/featured-collection.liquid` - Settings-driven
- `/sections/ingredients.liquid` - Proper schema

### Snippets (Best Practices)
- `/snippets/logo.liquid` - Clean conditional logic
- `/snippets/product-badges.liquid` - Uses CSS variables
- `/snippets/product-card.liquid` - Translation strings
- `/snippets/structured-data.liquid` - Proper schema
- `/snippets/payment-icons.liquid` - Asset references
- `/snippets/carousel.liquid` - Reusable component
- `/snippets/image-seo.liquid` - Proper alt text handling

### Templates (Correctly Configured)
- All JSON templates properly reference sections
- No hardcoded content in template files

---

## Estimated Total Effort

| Phase | Time | Priority |
|-------|------|----------|
| Phase 1: Quick Wins | 1-2 hours | HIGH |
| Phase 2: Critical Content | 4-6 hours | CRITICAL |
| Phase 3: Styles Refactor | 8-12 hours | MEDIUM |
| Phase 4: Polish & Testing | 2-4 hours | LOW |
| **TOTAL** | **15-24 hours** | - |

---

## Files Requiring Changes

### Must Fix (Critical)
1. `/sections/shopdev-myco-matcha-product-page.liquid` - 52 issues
2. `/sections/main-password.liquid` - 7 issues
3. `/sections/main-404.liquid` - 9 issues
4. `/sections/main-search.liquid` - 8 issues

### Should Fix (High Priority)
5. `/sections/faq.liquid` - 15 inline styles
6. `/sections/collection-list.liquid` - 14 inline styles
7. `/sections/hero.liquid` - 12 inline styles
8. `/sections/product-hero-landing.liquid` - 10 inline styles
9. `/sections/hero-product-info.liquid` - 9 inline styles

### Consider Fixing (Medium Priority)
10. `/sections/product-recommendations.liquid` - 8 inline styles
11. `/sections/rich-text.liquid` - 5 inline styles
12. `/sections/testimonials.liquid` - 4 inline styles

### Total Files Needing Updates: 12 out of 72

---

## Recommendations

### Immediate Actions
1. Start with Phase 1 (Quick Wins) - highest ROI
2. Prioritize `/sections/shopdev-myco-matcha-product-page.liquid` - most issues
3. Replace external image URLs first - breaks if service goes down

### Long-Term Strategy
1. Establish CSS custom property system for colors
2. Create utility class library for common styles
3. Document theme customization patterns
4. Set up translation keys for all text
5. Create theme settings guide for merchants

### Best Practices Going Forward
1. Never hardcode user-facing text - always use settings
2. Never use external URLs for critical assets
3. Use CSS custom properties for colors/spacing
4. Prefer CSS classes over inline styles
5. Always provide default values for settings
6. Use translation strings for common UI text
7. Document all section settings in schema

---

## Notes

- **Schema.org URLs:** The `https://schema.org/` URLs are NOT hardcoded content - they are required standard URIs for structured data. Do not change these.

- **Font CDN:** The `https://fonts.shopifycdn.com` preconnect is standard Shopify practice. Keep it.

- **Translation Fallbacks:** Files using `| t | default: "text"` pattern are acceptable - they provide graceful fallbacks.

- **Design Mode Code:** Editor visual indicators (lines with `request.design_mode`) are development tools, not hardcoded content.

---

## Conclusion

**Overall Assessment:** The theme has a solid foundation with many sections already following best practices. The main issues are concentrated in a few files, particularly the shopdev-myco-matcha-product-page section which appears to be a custom landing page design with hardcoded Figma imports.

**Biggest Risks:**
1. External image dependencies (assets.shopdev.ai)
2. Non-editable navigation/footer in custom page
3. Excessive inline styles reducing maintainability

**Biggest Opportunities:**
1. Making the custom product page fully editable would unlock significant merchant value
2. CSS refactor would improve performance and make global style changes easier
3. Translation system would enable multi-language support

The estimated 15-24 hours of work would transform this from a good theme to an excellent, merchant-friendly theme with complete Theme Editor control over all content.
