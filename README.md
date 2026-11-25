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

## Additional Features (PR #2)

### Packages & Memberships
- **Package Tiles Section** (`sections/package-tiles.liquid`) - Display treatment packages and membership programs with pricing tiers, included sessions, savings, features, and Book/Consult CTAs
- **Package Page Template** (`templates/page.packages.json`) - Dedicated page with package tiles, booking app slots, and FAQ
- @app block support for Downpay (deposits) and subscription apps

### Multi-Location Support
- **Locations List Section** (`sections/locations-list.liquid`) - Grid of locations with addresses, hours, phone, and location-specific booking
- **Location Page** (`sections/main-location.liquid`, `templates/page.location.json`) - Individual location pages showing address, hours, map embed, treatments offered, and location-specific booking with @app slots
- Google Maps embed support with responsive iframe

### Team & Providers
- **Team Grid Section** (`sections/team-grid.liquid`) - Display team members with photos, credentials, specialties, and "Book with this provider" CTAs
- **Team Member Page** (`sections/main-team-member.liquid`, `templates/page.team-member.json`) - Individual provider profiles with bio, credentials, specialties, education, and provider-specific booking

### Before/After Gallery
- **Before/After Slider Section** (`sections/before-after-slider.liquid`) - Accessible image comparison slider
  - Keyboard navigable (arrow keys)
  - Range input based for screen readers
  - Properly labeled for assistive tech
  - Respects `prefers-reduced-motion`
  - Consent/disclaimer text setting

### Reviews & Testimonials
- **Reviews Section** (`sections/reviews.liquid`) - Display testimonials with @app block support for review apps (Stamped.io, Judge.me, Loox, etc.) or manual testimonial blocks with ratings, quotes, and author info

### Full FAQ Page
- **FAQ Page** (`sections/main-faq-page.liquid`, `templates/page.faq.json`) - Comprehensive FAQ with:
  - Grouped accordion sections
  - FAQPage JSON-LD structured data for SEO
  - Keyboard accessible
  - Five default groups: Booking & Appointments, Treatments & Services, Pricing & Packages, Safety & Credentials, Locations & Hours

### Shop & Retail
- **Retail Collection Template** (`templates/collection.retail.json`) - Standard product browsing with normal ecommerce UI
- **Retail Product Section** (`sections/main-product-retail.liquid`, `templates/product.retail.json`) - Full ecommerce product pages with:
  - Variant selection
  - Quantity input
  - Inventory display
  - Add to cart button
  - Image thumbnails
  - Compare at price
  - **Distinct from treatment pages** - includes all standard cart/shipping UI
- **Gift Card Template** (`sections/main-gift-card.liquid`, `templates/product.gift-card.json`) - Beautiful gift card product page with amount selection, preview card design, and feature list
- **Gift Card Promo Section** (`sections/gift-card-promo.liquid`) - Promotional section for gift cards with features and CTA

### Contact & Service Area
- **Contact Page** (`sections/main-contact.liquid`, `templates/page.contact.json`) - Contact form with:
  - Contact information (phone, email, hours, address)
  - Contact form (name, email, phone, message)
  - Service area list (displays all cities/regions served)

## Templates Map

**Updated Template Count:** 11 JSON templates

| Template | Purpose |
|----------|---------|
| `index.json` | Home page |
| `collection.json` | Treatments list |
| `collection.retail.json` | Retail products list |
| `product.treatment.json` | Treatment pages (no cart) |
| `product.retail.json` | Retail product pages (with cart) |
| `product.gift-card.json` | Gift card product |
| `page.json` | Standard pages |
| `page.booking.json` | Booking page |
| `page.packages.json` | Packages & memberships |
| `page.location.json` | Individual location |
| `page.team-member.json` | Team member profile |
| `page.faq.json` | Full FAQ page |
| `page.contact.json` | Contact & service area |

## Sections Map

**Updated Section Count:** 26 sections (+ 2 section groups)

| Section | Type | Description |
|---------|------|-------------|
| `header.liquid` | Global | Sticky header with nav and book CTA |
| `footer.liquid` | Global | Multi-column footer with concept notice |
| `hero.liquid` | Home | Full-width hero with Book/Shop CTAs |
| `treatment-cards.liquid` | Treatments | Grid of treatments with booking |
| `package-tiles.liquid` | Packages | Package/membership tiles |
| `credentials.liquid` | Trust | Certifications and trust signals |
| `faq.liquid` | Home | Accordion FAQ section |
| `booking-app.liquid` | Booking | @app slots + custom embeds |
| `product-row.liquid` | Retail | Retail product showcase |
| `locations-list.liquid` | Locations | Grid of all locations |
| `team-grid.liquid` | Team | Team members grid |
| `before-after-slider.liquid` | Gallery | Accessible before/after comparisons |
| `reviews.liquid` | Social Proof | Testimonials and review apps |
| `gift-card-promo.liquid` | Promo | Gift card promotional section |
| `main-collection-banner.liquid` | Collection | Collection header |
| `main-collection-product-grid.liquid` | Collection | Product grid with pagination |
| `main-product-treatment.liquid` | Product | Treatment page (no cart UI) |
| `main-product-retail.liquid` | Product | Retail product (with cart UI) |
| `main-gift-card.liquid` | Product | Gift card product page |
| `main-location.liquid` | Page | Individual location page |
| `main-team-member.liquid` | Page | Team member profile page |
| `main-faq-page.liquid` | Page | Full FAQ page with JSON-LD |
| `main-contact.liquid` | Page | Contact form and service areas |
| `main-page.liquid` | Page | Standard page content |
| `related-products.liquid` | Product | Recommended products |

## Known Gaps / Future Work

Future enhancements:
- Enhanced product filtering and search
- Cart drawer UI for retail products
- Account pages styling
- Blog/articles template
- Advanced analytics dashboard
- Multi-language support (Shopify Markets)
- Product review aggregation
- Loyalty program integration

## Credits

**Theme:** Maison Calla  
**Developer:** Cart & Canvas  
**Base:** Built on Shopify Online Store 2.0 architecture  
**Concept Brand:** Maison Calla is a fictional brand created for demonstration

## License

Proprietary - Cart & Canvas. All rights reserved.

## Support

For questions or customization requests, please open an issue in the repository.
