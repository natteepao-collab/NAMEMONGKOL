# SEO/AEO Image Alt Guideline

This guideline standardizes image alt text across the project for accessibility, SEO, and AEO.

## Core Rules

1. Describe image meaning, not implementation details.
2. Keep alt concise and specific. Target one clear idea.
3. Use the page language (Thai-first pages should use Thai alt text).
4. Do not use file paths, URLs, IDs, or raw variable names as alt text.
5. Do not keyword-stuff or repeat branding in every alt text.
6. Use empty alt only for decorative images, and pair with `aria-hidden="true"` or `role="presentation"`.

## Patterns

### Article cover image
- Good: "ภาพหน้าปกบทความ วิธีเลือกชื่อมงคล"
- Avoid: "ภาพหน้าปกบทความ ... - บทความชื่อมงคล NameMongkol" on every image

### User avatar
- Good: "รูปโปรไฟล์ของ {nickname} ผู้เขียนรีวิว"
- Avoid: only `{nickname}`

### Wallpaper or product image
- Good: "วอลเปเปอร์มงคล {name} สำหรับ{tags}"
- Avoid: adding long branding suffixes for every image

### Decorative background image
- Good: `alt=""` plus `aria-hidden="true"`
- Avoid: descriptive alt text for purely visual decoration

## Quick Checklist

- Non-decorative image has meaningful alt text.
- Alt text matches page language and context.
- Alt text has no path/URL and no raw identifiers.
- Decorative image is hidden from assistive technologies.
- Alt text does not duplicate nearby heading verbatim unless necessary.
