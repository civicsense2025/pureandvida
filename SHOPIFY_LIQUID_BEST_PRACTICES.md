# Shopify Liquid Best Practices Guide (2024-2025)

**Last Updated:** 2025-11-25

This guide documents current best practices for Shopify Liquid theme development, specifically addressing common issues like whitespace artifacts and providing proper section/block architecture patterns.

---

## Table of Contents

1. [Whitespace Control and Tag Artifacts](#whitespace-control-and-tag-artifacts)
2. [Section Schema Best Practices](#section-schema-best-practices)
3. [Block Definitions](#block-definitions)
4. [Placeholder Handling](#placeholder-handling)
5. [Common Pitfalls to Avoid](#common-pitfalls-to-avoid)
6. [Code Examples](#code-examples)

---

## Whitespace Control and Tag Artifacts

### The Problem

"Random Liquid tag artifacts" appearing in designs typically occur due to improper whitespace control. When Liquid tags are rendered, they output blank lines where the tags exist in your code.

### The Solution: Hyphen Tags

Use the hyphen (`-`) in your Liquid tags to strip whitespace:

| Standard Tag | Whitespace-Stripped Tag | When to Use |
|--------------|------------------------|-------------|
| `{% if %}` | `{% if %}` | Inside HTML elements |
| `{% endif %}` | `{% endif %}` | Closing conditionals |
| `{% for %}` | `{% for %}` | Loop openings |
| `{% endfor %}` | `{% endfor %}` | Loop closings |
| `{{ variable }}` | `{{- variable -}}` | Variable output (when needed) |

### Best Practice Rules

1. **Always use `{%` and `%}` for control flow tags** (if, for, unless, case, etc.)
2. **Use `{{` and `}}` for output** unless you need to strip surrounding whitespace
3. **Exception:** The `{% schema %}` tag should NOT use whitespace control on its closing tag
4. **Comment tags** can safely use whitespace control: `{% comment %}` ... `{% endcomment %}`

### Example: Before and After

**WRONG (causes whitespace artifacts):**
```liquid
<div class="products">
  {% for product in collection.products %}
    {% if product.available %}
      <div class="product">{{ product.title }}</div>
    {% endif %}
  {% endfor %}
</div>
```

**CORRECT (clean output):**
```liquid
<div class="products">
  {% for product in collection.products %}
    {% if product.available %}
      <div class="product">{{ product.title }}</div>
    {% endif %}
  {% endfor %}
</div>
```

---

## Section Schema Best Practices

### Schema Structure

Every section can have only ONE `{% schema %}` tag containing valid JSON:

```liquid
{% schema %}
{
  "name": "Section Name",
  "tag": "section",
  "class": "section-class",
  "settings": [...],
  "blocks": [...],
  "presets": [...],
  "templates": [...]
}
{% endschema %}
```

### Required Attributes

| Attribute | Purpose | Notes |
|-----------|---------|-------|
| `name` | Display name in Theme Editor | Max 25 characters recommended |
| `settings` | Section-level configuration | Array of setting objects |
| `presets` | Enable section in Theme Editor | Required for dynamic sections |

### Settings Types Reference

```json
{
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Default Text"
    },
    {
      "type": "image_picker",
      "id": "image",
      "label": "Image"
    },
    {
      "type": "color",
      "id": "background_color",
      "label": "Background Color"
    },
    {
      "type": "range",
      "id": "padding",
      "label": "Padding",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "default": 40
    },
    {
      "type": "select",
      "id": "alignment",
      "label": "Alignment",
      "options": [
        { "value": "left", "label": "Left" },
        { "value": "center", "label": "Center" },
        { "value": "right", "label": "Right" }
      ],
      "default": "center"
    }
  ]
}
```

---

## Block Definitions

### Block Schema Structure

Blocks allow merchants to add, remove, and reorder content within sections.

```json
{
  "blocks": [
    {
      "type": "text_block",
      "name": "Text Block",
      "limit": 1,
      "settings": [
        {
          "type": "text",
          "id": "title",
          "label": "Title",
          "default": "Block Title"
        }
      ]
    }
  ]
}
```

### Block Limits

- **Maximum blocks per section:** 16 (enforced by Shopify)
- **Use `limit` attribute** to restrict specific block types
- **Use `max_blocks`** at section level to set overall limit

### Rendering Blocks

```liquid
{% for block in section.blocks %}
  {% case block.type %}
    {% when 'text_block' %}
      <div class="text-block" {{ block.shopify_attributes }}>
        <h3>{{ block.settings.title }}</h3>
      </div>
    {% when 'image_block' %}
      <div class="image-block" {{ block.shopify_attributes }}>
        {% if block.settings.image %}
          {{ block.settings.image | image_url: width: 800 | image_tag }}
        {% endif %}
      </div>
  {% endcase %}
{% endfor %}
```

**Important:** Always include `{{ block.shopify_attributes }}` for Theme Editor functionality.

---

## Placeholder Handling

### Always Provide Fallbacks

```liquid
{% if section.settings.image %}
  {{ section.settings.image | image_url: width: 800 | image_tag: class: 'section-image' }}
{% else %}
  {{ 'product-1' | placeholder_svg_tag: 'placeholder-image' }}
{% endif %}
```

### Text Fallbacks

```liquid
{{ section.settings.heading | default: 'Default Heading' }}
```

### Empty Block Handling

```liquid
{% if section.blocks.size > 0 %}
  {% for block in section.blocks %}
    {% comment %} Render blocks {% endcomment %}
  {% endfor %}
{% else %}
  <p class="no-content-message">Add content blocks in the Theme Editor.</p>
{% endif %}
```

---

## Common Pitfalls to Avoid

### 1. Missing Whitespace Control
**Problem:** Blank lines appear in rendered HTML
**Solution:** Use `{%` and `%}` consistently

### 2. Schema Tag Whitespace
**Problem:** Warning "'schema' tag was never closed"
**Solution:** Do NOT use `%}` on schema closing tag:
```liquid
{% schema %}
{...}
{% endschema %}
```

### 3. Unclosed Conditionals
**Problem:** Section breaks or shows raw Liquid code
**Solution:** Always match opening and closing tags:
- `{% if %}` needs `{% endif %}`
- `{% for %}` needs `{% endfor %}`
- `{% case %}` needs `{% endcase %}`

### 4. Invalid JSON in Schema
**Problem:** Section won't load in Theme Editor
**Solution:** Validate JSON before saving:
- No trailing commas in arrays/objects
- All strings in double quotes
- Proper escaping of special characters

### 5. Missing block.shopify_attributes
**Problem:** Blocks don't work properly in Theme Editor
**Solution:** Always add `{{ block.shopify_attributes }}` to block containers

### 6. Hardcoded Content
**Problem:** Merchants can't customize content
**Solution:** Use settings and blocks with sensible defaults

---

## Code Examples

### Complete Section Template

```liquid
{% liquid
  # @description Example section with proper whitespace control
  # @param heading {String} - Section heading from settings
  assign section_id = 'section-' | append: section.id
%}

<section id="{{ section_id }}" class="example-section"
         style="padding: {{ section.settings.padding_top }}px 0 {{ section.settings.padding_bottom }}px;">

  <div class="page-width">
    {% if section.settings.heading != blank %}
      <h2 class="section-heading">{{ section.settings.heading | escape }}</h2>
    {% endif %}

    {% if section.blocks.size > 0 %}
      <div class="blocks-container">
        {% for block in section.blocks %}
          {% case block.type %}
            {% when 'content_block' %}
              <div class="content-block" {{ block.shopify_attributes }}>
                {% if block.settings.image %}
                  {{ block.settings.image | image_url: width: 600 | image_tag: class: 'block-image', loading: 'lazy' }}
                {% endif %}
                {% if block.settings.text != blank %}
                  <p>{{ block.settings.text }}</p>
                {% endif %}
              </div>
          {% endcase %}
        {% endfor %}
      </div>
    {% endif %}
  </div>
</section>

{% schema %}
{
  "name": "Example Section",
  "tag": "section",
  "class": "section",
  "settings": [
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Section Heading"
    },
    {
      "type": "range",
      "id": "padding_top",
      "label": "Padding Top",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "default": 40
    },
    {
      "type": "range",
      "id": "padding_bottom",
      "label": "Padding Bottom",
      "min": 0,
      "max": 100,
      "step": 5,
      "unit": "px",
      "default": 40
    }
  ],
  "blocks": [
    {
      "type": "content_block",
      "name": "Content Block",
      "settings": [
        {
          "type": "image_picker",
          "id": "image",
          "label": "Image"
        },
        {
          "type": "textarea",
          "id": "text",
          "label": "Text"
        }
      ]
    }
  ],
  "presets": [
    {
      "name": "Example Section",
      "blocks": [
        { "type": "content_block" }
      ]
    }
  ]
}
{% endschema %}
```

### Liquid Tag Block Pattern

For complex logic, use the `{% liquid %}` tag to consolidate multiple operations:

```liquid
{% liquid
  assign current_variant = product.selected_or_first_available_variant
  assign compare_price = current_variant.compare_at_price
  assign current_price = current_variant.price
  assign on_sale = false

  if compare_price > current_price
    assign on_sale = true
    assign savings = compare_price | minus: current_price
    assign savings_percent = savings | times: 100.0 | divided_by: compare_price | round
  endif
%}
```

---

## Sources

- [Shopify Liquid Whitespace Control](https://shopify.github.io/liquid/basics/whitespace/)
- [Shopify Section Schema Documentation](https://shopify.dev/docs/storefronts/themes/architecture/sections/section-schema)
- [Shopify Settings Documentation](https://shopify.dev/docs/storefronts/themes/architecture/settings)
- [Shopify Theme Blocks](https://www.shopify.com/partners/blog/theme-blocks)
- [Online Store 2.0 Architecture](https://shopify.dev/docs/storefronts/themes/architecture)
- [Codilar Shopify Theme Developer Cheatsheet 2025](https://www.codilar.com/shopify-theme-developer-cheatsheet-2025-edition/)

---

## Issues Fixed in This Theme

The following files were updated to use proper whitespace control:

1. **`/sections/mycomatcha-product-page.liquid`**
   - Changed `{% if %}` to `{% if %}`
   - Changed `{% for %}` to `{% for %}`
   - Changed `{% endif %}` to `{% endif %}`
   - Changed `{% endfor %}` to `{% endfor %}`

These changes eliminate whitespace artifacts that were appearing in the rendered output.
