# Maison Calla Theme

A booking-first Shopify Online Store 2.0 theme for med spas and high-end salon-spas. Built by **Cart & Canvas** as a concept/portfolio demonstration.

**Maison Calla is a concept brand created for demonstration purposes.**

## Overview

This theme is specifically designed for businesses that offer both appointment-based treatments and retail products. Unlike traditional product-first themes, Maison Calla prioritizes the booking experience while seamlessly integrating e-commerce capabilities.

### Key Features

- **Booking-First Design**: Prominent Book CTAs, mobile book bar, and treatment-focused templates
- **Treatment Pages**: Specialized product template that displays duration, price, what to expect, and aftercare — without shipping/stock UI
- **Booking App Support**: Native @app block slots for popular booking apps plus custom embed support
- **Book Click Tracking**: Built-in event tracking for Meta Pixel and GA4 integration
- **Clinical Design System**: Ivory, stone, and soft black palette with rose or gold accent
- **Mobile-Optimized**: Large tap targets, pinned booking bar, touch-friendly interactions
- **Accessibility**: WCAG 2.1 AA compliant with semantic HTML and keyboard navigation

## Design System

### Colors

- **Ivory** (#FAF9F7) - Primary background
- **Stone** (#E8E6E3) - Secondary background
- **Soft Black** (#2A2A2A) - Text and UI elements
- **Rose** (#D4A5A5) - Default accent (configurable)
- **Gold** (#C9A961) - Alternative accent (configurable)

### Typography

- **Headings**: Playfair Display (serif) - elegant, clinical
- **Body**: Assistant (sans-serif) - clean, readable
- Both fonts are configurable via theme settings with Shopify's font picker

### Spacing

- Base spacing: 24px (configurable 16-48px)
- Section spacing: 80px (configurable 48-120px)
- Generous whitespace for clinical, high-end feel

## Templates

### Home (`templates/index.json`)

Sections included:
- Hero with separate Book and Shop buttons
- Treatment cards (duration, price, Book/Consult CTA)
- Credentials strip (certifications, trust signals)
- Retail product row
- Booking app section with @app block slots
- FAQ accordion

### Treatments List (`templates/collection.json`)

- Collection banner with description
- Grid of treatment cards
- Pagination

### Treatment Page (`templates/product.treatment.json`)

Specialized template for appointment-based services:
- Large hero image (sticky on desktop)
- Price with "starting at" support
- Duration display
- Description
- What to Expect section (from metafields)
- Aftercare instructions (from metafields)
- Book/Consult CTA (based on consultation_required metafield)
- @app block slots for inline booking widgets
- Related treatments

**NO shipping, inventory, or add-to-cart UI** — this is for bookings only.

### Booking Page (`templates/page.booking.json`)

Dedicated booking page with:
- Page title and content
- Booking app section with @app slots
- Support for custom embeds

### Standard Pages (`templates/page.json`)

Clean page template for About, Contact, Service Menu, etc.

## Sections

### Core Sections

- **Header** (`sections/header.liquid`) - Sticky header with logo, nav, and book CTA
- **Footer** (`sections/footer.liquid`) - Multi-column footer with concept notice
- **Hero** (`sections/hero.liquid`) - Full-width hero with dual CTAs
- **Treatment Cards** (`sections/treatment-cards.liquid`) - Grid of featured treatments
- **Credentials** (`sections/credentials.liquid`) - Trust signals and certifications
- **FAQ** (`sections/faq.liquid`) - Accordion-style FAQs
- **Booking App** (`sections/booking-app.liquid`) - @app slots + custom embeds
- **Product Row** (`sections/product-row.liquid`) - Retail product showcase

### Product/Collection Sections

- **Main Product Treatment** (`sections/main-product-treatment.liquid`) - Treatment page blocks
- **Main Collection Banner** (`sections/main-collection-banner.liquid`)
- **Main Collection Product Grid** (`sections/main-collection-product-grid.liquid`)
- **Related Products** (`sections/related-products.liquid`)
- **Main Page** (`sections/main-page.liquid`)

## Booking App Integration

### Supported Apps (via @app blocks)

The theme includes @app block slots on:
- Home page booking section
- Treatment pages
- Dedicated booking page

**Compatible apps:**
- [Sesami](https://apps.shopify.com/sesami)
- [Cowlendar](https://apps.shopify.com/cowlendar)
- [Appointo](https://apps.shopify.com/appointo-appointments-and-bookings)
- [BookX](https://apps.shopify.com/appointment-booking-bookeasy)
- [Meety](https://apps.shopify.com/meety-appointment-booking)
- [Downpay](https://apps.shopify.com/downpay)

**How to add:**
1. Install the booking app from Shopify App Store
2. In Theme Editor, go to the Booking App section
3. Click "Add block" → "Apps" → Select your installed booking app
4. Configure the app block settings

### Custom Embeds

For booking systems like Acuity, Square, Zenoti, and Dingg:

1. Add a "Custom Booking Embed" block to the Booking App section
2. Enter your booking widget URL in "Embed URL", OR
3. Paste custom HTML/JavaScript in "Custom HTML/JavaScript"
4. The embed will render responsively with lazy loading

## Book Click Tracking

The theme fires tracking events on all Book/Consult CTA clicks (not confirmed bookings).

### CustomEvent

```javascript
document.addEventListener('maison:book_click', function(e) {
  console.log(e.detail.treatment_name);
  console.log(e.detail.treatment_price);
  console.log(e.detail.cta_type); // 'book' or 'consult'
});
```

### dataLayer Event

```javascript
// Automatically pushed to window.dataLayer
{
  event: 'book_click',
  treatment_name: 'Hydrafacial',
  treatment_price: '$150.00',
  cta_type: 'book'
}
```

### Integration Examples

**Meta Pixel (Facebook/Instagram):**
```html
<!-- Add to theme.liquid before </head> -->
<script>
document.addEventListener('maison:book_click', function(e) {
  fbq('trackCustom', 'BookClick', {
    treatment: e.detail.treatment_name,
    value: parseFloat(e.detail.treatment_price.replace(/[^0-9.]/g, '')),
    currency: 'USD'
  });
});
</script>
```

**Google Analytics 4:**
```html
<!-- Add to theme.liquid before </head> -->
<script>
window.dataLayer = window.dataLayer || [];
// GTM will automatically capture dataLayer pushes
// Or use gtag directly:
document.addEventListener('maison:book_click', function(e) {
  gtag('event', 'book_click', {
    'treatment_name': e.detail.treatment_name,
    'value': parseFloat(e.detail.treatment_price.replace(/[^0-9.]/g, ''))
  });
});
</script>
```

**Note:** Do NOT hardcode pixel IDs in theme files. Add tracking scripts via theme settings or the Online Store > Preferences > Additional Scripts section.

## Mobile Book Bar

Pinned booking button at the bottom of mobile screens (hidden on desktop).

### Configuration

**Theme Settings → Mobile Book Bar:**
- Enable/disable
- Button label (default: "Book Treatment")
- Button link (or leave empty to use global booking page)
- App trigger code (optional JavaScript to trigger booking modal)

### Template Override

To hide the book bar on specific templates, create a template with suffix `hidden-book-bar`:
- Example: `page.about.hidden-book-bar.json`

### Behavior

- Auto-hides when scrolling down
- Shows when scrolling up
- Always visible at top of page
- Respects reduced motion preferences

## Product Metafields

For treatment products, the theme uses these custom metafields:

| Namespace | Key | Type | Usage |
|-----------|-----|------|-------|
| `custom` | `treatment_duration` | Single line text | Display duration (e.g. "60 minutes") |
| `custom` | `consultation_required` | Boolean | Show "Schedule Consultation" vs "Book Treatment" |
| `custom` | `what_to_expect` | Rich text | "What to Expect" section content |
| `custom` | `aftercare` | Rich text | "Aftercare" section content |

**To add metafields:**
1. Go to Settings → Custom Data → Products
2. Add definitions for the fields above
3. Edit treatment products to populate metafields

## Accessibility

### Compliance

- WCAG 2.1 AA color contrast ratios
- Semantic HTML5 elements
- Proper heading hierarchy
- Keyboard navigation support
- Focus states on all interactive elements
- ARIA labels and roles where appropriate
- Skip to content link
- Reduced motion support via `prefers-reduced-motion`

### Large Tap Targets

Minimum tap target size: 44x44px on all interactive elements (buttons, links, mobile menu toggle).

## Development

### Theme Structure

```
maison-calla-theme/
├── assets/
│   ├── base.css              # Core styles
│   └── global.js             # Core JavaScript
├── config/
│   ├── settings_schema.json  # Theme settings
│   └── settings_data.json    # Default values
├── layout/
│   └── theme.liquid          # Main layout
├── locales/
│   └── en.default.json       # Translations
├── sections/
│   ├── *.liquid              # Reusable sections
│   └── group/                # Section groups
├── snippets/
│   ├── *.liquid              # Reusable snippets
│   ├── icon.liquid           # SVG icon system
│   ├── meta-tags.liquid      # SEO meta tags
│   ├── mobile-book-bar.liquid # Mobile book bar
│   ├── pagination.liquid     # Pagination UI
│   └── treatment-card.liquid # Treatment card component
└── templates/
    ├── *.json                # JSON templates
    ├── product.treatment.json # Treatment template
    └── page.booking.json     # Booking page
```

### Technology

- **Liquid** - Shopify's template language
- **Vanilla JavaScript** - No frameworks, minimal JS
- **CSS Custom Properties** - Theme-wide design tokens
- **CSS Grid** - Responsive layouts
- **Online Store 2.0** - JSON templates, sections everywhere

### Browser Support

- Modern evergreen browsers (Chrome, Firefox, Safari, Edge)
- Mobile Safari iOS 13+
- Chrome Android 90+

## Installation

1. Download/clone this theme
2. Zip the theme folder
3. In Shopify Admin: Online Store → Themes → Add theme → Upload zip file
4. Customize in the Theme Editor
5. Add booking app of your choice
6. Configure metafields for treatment products
7. Publish when ready

## Theme Check

This theme passes `shopify theme check` with no errors (see PR for output).

## Known Gaps / Future Work

This PR establishes the foundation. Future PRs will add:

- Packages and memberships template/sections
- Multi-location support (location selector, per-location booking)
- Team member pages with bios and booking links
- Before/after image slider/gallery
- Reviews/testimonials section
- Full FAQ page template
- Retail shop template enhancements
- Gift cards page
- Service menu page template
- Multi-location selector
- Enhanced product filtering and search
- Cart drawer (for retail products)
- Account pages styling

## Credits

**Theme:** Maison Calla  
**Developer:** Cart & Canvas  
**Base:** Built on Shopify Online Store 2.0 architecture  
**Concept Brand:** Maison Calla is a fictional brand created for demonstration

## License

Proprietary - Cart & Canvas. All rights reserved.

## Support

For questions or customization requests, please open an issue in the repository.
