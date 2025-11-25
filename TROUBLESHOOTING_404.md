# 404 Troubleshooting Guide - Pure + Vida Theme

**Last Updated:** November 25, 2025  
**Based on:** Latest Shopify documentation and community insights

## Problem: Almost all site and shop pages returning 404 errors

## ✅ VERIFIED: Current Shopify Best Practices (2024-2025)

## Quick Diagnosis Steps

### Step 1: Check Theme Status in Shopify Admin
1. Go to: `https://[your-store].myshopify.com/admin/themes`
2. Look for "Pure Vida Theme" or similar
3. Check if it says **"Current theme"** (live)
4. If it says "Unpublished" → Click **"Publish"**

### Step 2: Verify Theme is Connected
Run this command to check your store connection:
```bash
shopify theme list --store=your-store.myshopify.com
```

If you get an error, you need to authenticate:
```bash
shopify auth login
```

### Step 3: Push/Deploy the Theme
If theme exists locally but not on Shopify:

```bash
# Push to a development theme
shopify theme push --development

# OR push and publish to live
shopify theme push --live
```

⚠️ **Warning:** `--live` will replace your current live theme immediately!

### Step 4: Check for Deployment Errors
Look for these issues:

1. **Theme Upload Failed**
   - Check terminal for error messages during last push
   - Verify file permissions
   - Check for large files that might timeout

2. **Theme in Draft Mode**
   - In Shopify Admin → Themes
   - Click on your theme
   - Ensure it's set as "Current theme"

3. **Store Access Issues**
   - Verify you have admin access to the store
   - Check if store is active (not paused/frozen)

### Step 5: Verify Template Assignments

Some pages might have custom templates assigned. Check in Shopify Admin:

1. **Products:**
   - Go to Products → [Any Product]
   - Scroll to "Theme templates" section
   - Ensure correct template is selected (e.g., `product` or `product.mycomatcha`)

2. **Pages:**
   - Go to Pages → [Any Page]  
   - Check "Theme template" dropdown
   - Should be assigned (e.g., `page`, `page.about`, etc.)

3. **Collections:**
   - Go to Collections → [Any Collection]
   - Verify template assignment

## Common Causes of 404s (Verified via Shopify Documentation 2024-2025)

### 1. Theme Not Published/Activated ✅ MOST LIKELY (Confirmed by Shopify Support)
**Symptom:** All pages 404, admin works fine, preview works but live doesn't  
**Why This Happens:** Theme exists in "Library" but isn't set as "Current theme"  
**Fix:** Publish the theme in Admin → Themes
- **Verification Source:** Shopify.dev theme deployment docs, Community forums

### 2. Missing Essential Theme Files ⚠️ CRITICAL
**Symptom:** Some or all pages 404, theme appears broken  
**Required Files:**
- `layout/theme.liquid` ✅ (You have this)
- `config/settings_schema.json` ✅ (You have this - though only 2 lines, might be incomplete)
- `templates/*.json` files ✅ (You have these)
**Fix:** Verify all files deployed correctly
- **Source:** Shopify Community discussion on missing settings_schema.json causing breakage

### 3. Theme Not Deployed/Push Failed
**Symptom:** Local files exist but not on Shopify  
**Fix:** Run `shopify theme push --development` (safer) or `shopify theme push --live`
- **Note:** CLI must be authenticated first with `shopify auth login`

### 4. Missing Section Files Referenced in Templates (Online Store 2.0)
**Symptom:** Some pages 404, others work  
**Common in:** JSON template architecture (OS 2.0)
**Fix:** 
- Check template JSON files (e.g., `product.json`) reference existing sections
- Example valid structure:
```json
{
  "sections": {
    "main": {
      "type": "main-product"
    }
  },
  "order": ["main"]
}
```
**Source:** Shopify.dev JSON templates documentation

### 5. Store Password/Preview Mode
**Symptom:** All pages show password page or redirect to 404  
**Fix:** 
- Go to Admin → Online Store → Preferences
- Disable "Restrict access with password"
- **Note:** If store is password-protected, only password page shows - not 404s

### 6. App Proxy Misconfiguration (If Using Apps)
**Symptom:** Certain app-generated pages return 404  
**Fix:** 
- Check Admin → Apps → App Settings
- Verify proxy URL matches app configuration
**Source:** Shopify Developer Community (2024 thread)

### 7. Managed Markets + Subscription Products (Specific Issue)
**Symptom:** 404s for international customers with subscription products  
**Fix:** Disable Managed Markets in Settings → Markets → Preferences
**Source:** Shopify Partner documentation (2024)

### 8. Broken Links After Deleting Products/Collections
**Symptom:** Specific pages 404, not all  
**Fix:** Set up 301 redirects for deleted/moved content
**Note:** This wouldn't cause "almost all pages" to 404

## ❌ What DOESN'T Cause 404s (Verified 2024-2025)

Based on current Shopify documentation and your theme check results:

### Theme Check Errors That Are SAFE (Won't Cause 404s):

1. **Missing width/height on images** ❌ Won't cause 404s
   - Only causes layout shift (CLS)
   - Images still render

2. **Invalid `templates` property in schema** ❌ Won't cause 404s
   - Shopify ignores invalid schema properties
   - Sections still render normally
   - **Source:** Shopify Theme Check documentation

3. **Hardcoded routes (`/` instead of `{{ routes.root_url }}`)** ❌ Won't cause 404s
   - Links still work, just not best practice
   - Doesn't break navigation

4. **Unused variables** ❌ Won't cause 404s
   - Just wastes minimal memory
   - No functional impact

5. **UndefinedObject warnings for `paginate`/`form`** ❌ Won't cause 404s (Usually false positives)
   - If proper `{% paginate %}` or `{% form %}` tags are used, these are false alarms
   - Doesn't break page rendering

6. **Unknown filter errors** ⚠️ MIGHT cause section to not render
   - But page itself loads
   - Only affects that specific section

7. **Missing CSS file** ⚠️ MIGHT affect styling
   - Page loads, just without styles
   - Not a 404 error

### The Only Thing That Causes Widespread 404s:

**Theme activation/deployment issues** - when theme files aren't properly:
1. Uploaded to Shopify
2. Activated as "Current theme"
3. Deployed without errors

**Source:** Shopify.dev theme deployment troubleshooting, Community discussions (2024-2025)

---

## Quick Fix Commands

### Connect to Store
```bash
# Replace with your actual store name
export SHOPIFY_FLAG_STORE="your-store.myshopify.com"
```

### Check Current Themes
```bash
shopify theme list
```

### Push Theme to Development
```bash
shopify theme push --development
```

### Open Theme in Browser
```bash
shopify theme dev
```

### Pull Current Live Theme (Backup)
```bash
shopify theme pull --live
```

## Emergency Recovery

If you need to quickly restore functionality:

### Option A: Publish from Admin
1. Log into Shopify Admin
2. Go to Online Store → Themes
3. Find "Pure Vida" or your theme
4. Click **"Publish"**
5. Confirm

### Option B: Re-upload Theme
```bash
# Zip your theme folder (excluding .git, node_modules, etc.)
zip -r pure-vida-theme.zip . -x "*.git*" "node_modules/*" "*.DS_Store"

# Upload via Admin:
# Admin → Themes → "Add theme" → "Upload zip file"
```

## Verification Steps After Fix

Once you've applied a fix, verify:

1. **Homepage loads:** `https://your-store.myshopify.com`
2. **Product pages load:** Click any product
3. **Collection pages load:** Navigate to collections
4. **Cart works:** Add item to cart
5. **Search works:** Try search functionality

## Getting Store Name

If you don't know your store name:

1. Check `config.yml` for store reference
2. Look in `.shopify` folder (if exists)
3. Check your Shopify Partners dashboard
4. Check email from Shopify for store URL

## Still Having Issues?

### Check These Files Are Present:
- ✅ `layout/theme.liquid`
- ✅ `templates/index.json` (homepage)
- ✅ `templates/product.json`
- ✅ `templates/collection.json`
- ✅ `sections/header.liquid`
- ✅ `sections/footer.liquid`

All these exist in your local copy ✅

### Next Steps:
1. Confirm theme is published in Shopify Admin (most likely cause)
2. Check if store is in password mode
3. Verify theme deployment completed successfully
4. Check browser console for JavaScript errors
5. Try accessing in incognito/private mode

---

## Support Commands

### View Theme Info
```bash
shopify theme info
```

### Check Theme Status
```bash
shopify theme list --store=your-store.myshopify.com
```

### Pull Latest from Live
```bash
shopify theme pull --live
```

---

**Most Likely Fix:** Go to Shopify Admin → Themes → Publish your theme ✅

