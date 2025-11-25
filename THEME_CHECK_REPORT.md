# Shopify Theme Check Report

**Generated:** November 25, 2025  
**Theme:** Pure + Vida

## Summary

- **Files Inspected:** 199
- **Total Offenses:** 203 across 61 files
- **Errors:** 133 ❌
- **Warnings:** 70 ⚠️

---

## Issues by Category

### 🔴 Critical Issues (Errors)

#### 1. Missing Image Width/Height Attributes (ImgWidthAndHeight)
**Total Occurrences:** ~35 files

Images without explicit width and height attributes can cause layout shifts (CLS) which negatively impacts SEO and user experience.

**Affected Files:**
- `sections/main-blog.liquid` (2 occurrences)
- `sections/main-cart.liquid` (3 occurrences)
- `sections/main-collections-list.liquid` (1 occurrence)
- `snippets/block-benefit.liquid` (1 occurrence)
- `snippets/block-blog-card.liquid` (1 occurrence)
- `snippets/block-collection-item.liquid` (1 occurrence)
- `snippets/block-ingredient.liquid` (1 occurrence)
- `snippets/image-seo.liquid` (2 occurrences)
- `snippets/payment-icons.liquid` (6 occurrences)
- `snippets/product-bundle-builder.liquid` (1 occurrence)
- `snippets/product-size-guide.liquid` (1 occurrence)
- `snippets/product-trust-badges.liquid` (3 occurrences)
- `snippets/product-variant-picker.liquid` (1 occurrence)
- `snippets/seo-preview.liquid` (2 occurrences)
- `snippets/testimonial-card.liquid` (4 occurrences)
- `templates/gift_card.liquid` (1 occurrence)

**Example Issue:**
```liquid
<img
  src="{{ article.image | image_url: width: 800 }}"
  alt="{{ article.title | escape }}"
  loading="lazy"
>
```

**Recommended Fix:**
```liquid
<img
  src="{{ article.image | image_url: width: 800 }}"
  alt="{{ article.title | escape }}"
  width="800"
  height="600"
  loading="lazy"
>
```

---

#### 2. Invalid Schema Properties (ValidSchema)
**Total Occurrences:** 9 files

The `templates` property in schema is not allowed in section schemas.

**Affected Files:**
- `sections/main-customer-activate-account.liquid` - Line 243
- `sections/main-customer-addresses.liquid` - Line 989
- `sections/main-customer-order.liquid` - Line 907
- `sections/main-customer-reset-password.liquid` - Line 231
- `sections/main-product.liquid` - Line 1405
- `sections/product-recommendations.liquid` - Line 389
- `sections/recently-viewed-products.liquid` - Line 195
- `sections/rich-text.liquid` - Line 464
- `sections/shipping-info.liquid` - Line 591
- `sections/testimonials.liquid` - Line 1421

**Example:**
```json
"templates": ["customers/activate_account"]
```

**Fix:** Remove the `templates` property from section schemas.

---

#### 3. Missing Asset File (MissingAsset)
**File:** `sections/shopdev-myco-matcha-product-hero.liquid` - Line 1

Missing CSS file: `assets/shopdev-myco-matcha-product-hero.css`

**Fix:** Either create the missing CSS file or remove the reference.

---

#### 4. Unknown Filter (UnknownFilter)
**File:** `sections/product-recommendations.liquid`

The `limit` filter is not recognized. This occurs 3 times in lines 53, 55, and 57.

**Example:**
```liquid
assign products_list = collections.all.products | where: 'tags', product_tags[0] | limit: products_to_show
```

**Fix:** Use array slicing or a for loop with a break instead:
```liquid
{% for product in collections.all.products %}
  {% if forloop.index <= products_to_show %}
    {# process product #}
  {% else %}
    {% break %}
  {% endif %}
{% endfor %}
```

---

#### 5. Liquid HTML Syntax Error
**File:** `sections/product-hero-landing.liquid` - Line 7

```liquid
assign use_product = section.settings.use_product_data and section.settings.product != blank
```

**Issue:** Missing `%}` delimiter.

**Fix:**
```liquid
{% assign use_product = section.settings.use_product_data and section.settings.product != blank %}
```

---

#### 6. Unsupported Doc Tag (UnsupportedDocTag)
**File:** `temp/blocks/281982435540/unconfirmed/ai_gen_block_946fa2b.liquid`

The `{% doc %}` tag can only be used within snippets or blocks, not in temp files.

**Recommendation:** Move this file to the proper location or delete if not needed.

---

### ⚠️ Warnings

#### 1. Undefined Object (UndefinedObject)
**Multiple Files**

**Pagination Issues:**
- `sections/main-blog.liquid` (7 occurrences)
- `sections/main-search.liquid` (6 occurrences)

These are likely **false positives** if the sections are properly using `{% paginate %}` tags.

**Form Issues:**
- `sections/main-password.liquid` (2 occurrences)

**Block Issues:**
- `temp/blocks/281982435540/unconfirmed/ai_gen_block_946fa2b.liquid` (38 occurrences)

---

#### 2. Hardcoded Routes (HardcodedRoutes)
**File:** `sections/main-password-header.liquid`

**Lines:** 9, 19

**Current:**
```liquid
<a href="/" class="password-header__logo">
```

**Recommended:**
```liquid
<a href="{{ routes.root_url }}" class="password-header__logo">
```

---

#### 3. Remote Asset (RemoteAsset)
**File:** `sections/main-product.liquid` - Line 344

```liquid
<source src="{{ product.metafields.custom.video_url }}" type="video/mp4">
```

**Recommendation:** Use asset filters for better performance when possible, or ensure the video URL is properly optimized.

---

#### 4. Unused Assign (UnusedAssign)

**Files:**
- `snippets/block-collapsible-row.liquid` - Line 55
  - Variable: `row_border_w`
  
- `snippets/product-badges.liquid` - Line 10
  - Variable: `badges`
  
- `snippets/product-variant-picker.liquid` - Line 112
  - Variable: `swatch_color`

**Fix:** Remove unused variables or use them in the code.

---

## Priority Fix Recommendations

### 🔥 High Priority (Fix Immediately)

1. **Add width/height to all images** - Prevents layout shift (CLS), improves SEO
2. **Fix Liquid syntax error** in `product-hero-landing.liquid`
3. **Remove invalid `templates` properties** from section schemas
4. **Fix or remove missing CSS file** for myco-matcha product hero

### 🔶 Medium Priority (Fix Soon)

5. **Replace hardcoded routes** with `{{ routes.root_url }}`
6. **Fix unknown filter usage** in product recommendations
7. **Remove unused variables** to clean up code

### 🔵 Low Priority (Nice to Have)

8. **Review undefined object warnings** - Most are likely false positives
9. **Clean up temp folder** with unconfirmed blocks
10. **Optimize remote video assets**

---

## Action Items by File Type

### Sections (17 files with issues)
- main-blog.liquid
- main-cart.liquid
- main-collections-list.liquid
- main-customer-* (4 files)
- main-password.liquid
- main-password-header.liquid
- main-product.liquid
- main-search.liquid
- product-hero-landing.liquid
- product-recommendations.liquid
- recently-viewed-products.liquid
- rich-text.liquid
- shipping-info.liquid
- shopdev-myco-matcha-product-hero.liquid
- testimonials.liquid

### Snippets (15 files with issues)
- block-benefit.liquid
- block-blog-card.liquid
- block-collapsible-row.liquid
- block-collection-item.liquid
- block-ingredient.liquid
- image-seo.liquid
- payment-icons.liquid
- product-badges.liquid
- product-bundle-builder.liquid
- product-size-guide.liquid
- product-trust-badges.liquid
- product-variant-picker.liquid
- seo-preview.liquid
- testimonial-card.liquid

### Templates (1 file with issues)
- gift_card.liquid

### Temp Files (1 file)
- temp/blocks/281982435540/unconfirmed/ai_gen_block_946fa2b.liquid (should be reviewed/deleted)

---

## Notes

- Many of the **UndefinedObject** warnings for `paginate` and `form` objects are likely **false positives** if proper Liquid tags are used in the templates
- The **temp folder** should be cleaned up or files moved to proper locations
- Consider creating a **helper snippet** for images with proper width/height attributes to ensure consistency across the theme

---

## Next Steps

1. Create a task list prioritizing High Priority fixes
2. Run theme check again after fixes to verify improvements
3. Test theme thoroughly on staging environment
4. Deploy fixes to production

---

**Report Generated by:** Shopify Theme Check CLI  
**Command:** `shopify theme check --output text`

