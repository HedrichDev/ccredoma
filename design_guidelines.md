# Design Guidelines: ERP Centro Comercial

## Design Approach

**Hybrid Strategy**: Public-facing pages inspired by **Airbnb** and **Zillow** (property showcasing), while admin dashboards follow **Material Design** principles for data-dense interfaces.

**Justification**: The system serves dual purposes—attractive property presentation for visitors and efficient data management for administrators. This requires balancing visual appeal with functional clarity.

---

## Typography

**Font Families** (Google Fonts):
- **Primary**: Inter (headers, UI elements, buttons)
- **Secondary**: Work Sans (body text, descriptions)

**Hierarchy**:
- H1: 2.5rem/3rem (60/72px), font-bold, tracking-tight
- H2: 2rem/2.5rem (48/60px), font-semibold
- H3: 1.5rem/2rem (36/48px), font-semibold
- Body Large: 1.125rem (18px), font-normal
- Body Regular: 1rem (16px), font-normal
- Small/Caption: 0.875rem (14px), font-normal
- Button Text: 1rem (16px), font-medium

---

## Layout System

**Spacing Primitives**: Use Tailwind units of **2, 4, 8, 12, 16, 20, 24** (e.g., p-4, m-8, gap-12)

**Grid Structure**:
- Container: max-w-7xl for content, max-w-full for hero sections
- Cards Grid: grid-cols-1 md:grid-cols-2 lg:grid-cols-3 for property listings
- Dashboard: 12-column grid with sidebar navigation

**Responsive Breakpoints**:
- Mobile: base (single column)
- Tablet: md (2 columns max)
- Desktop: lg (3-4 columns)

---

## Component Library

### Core Components

**Cards (Property/Local Listings)**:
- Border-radius: rounded-xl (12px)
- Shadow: shadow-md with hover:shadow-xl transition
- Image aspect ratio: 4:3 for property photos
- Padding: p-6 for card content
- Include: Image, title, area (m²), price, status badge, action button

**Navigation**:
- **Public Header**: Transparent overlay on hero, becomes solid white on scroll, sticky top-0
- **Dashboard Sidebar**: Fixed w-64, dark background, collapsible on mobile
- Logo placement: top-left, h-8 to h-10
- Navigation items: py-3 px-4 with hover states

**Forms & Inputs**:
- Height: h-12 for all inputs
- Border: border border-gray-300 with focus:ring-2
- Rounded: rounded-lg
- Label position: above input with mb-2
- Helper text: text-sm text-gray-600 below input

**Buttons**:
- Primary: h-12, px-8, rounded-lg, font-medium
- Secondary: Same dimensions, outlined variant
- Icon buttons: h-10 w-10, rounded-full for actions
- On images: Backdrop blur (backdrop-blur-md) with semi-transparent background

**Data Tables (Dashboards)**:
- Alternating row backgrounds for readability
- Sticky header: top-0
- Actions column: right-aligned
- Row height: h-16 for comfortable touch targets
- Include: sortable columns, filters, search, pagination

**Status Badges**:
- Pill shape: rounded-full, px-3 py-1
- Semantic colors: Available (green), Occupied (blue), Maintenance (yellow), Overdue (red)
- Text: text-sm font-medium

**Metrics Cards (KPI Display)**:
- Grid layout: 2-4 cards per row
- Include: Large number, label, trend indicator (↑↓), icon
- Padding: p-6
- Border or subtle shadow

---

## Page-Specific Guidelines

### Public Landing Page (VisitanteExterno)

**Hero Section**:
- Full-width background image of modern shopping mall interior
- Height: min-h-screen on desktop, min-h-[60vh] on mobile
- Overlay: Semi-transparent dark gradient (bg-gradient-to-b from-black/40 to-black/60)
- Content: Centered, includes H1 headline, subtitle, primary CTA button with backdrop-blur
- Search bar: Large, prominent, with filters (type, area, price range)

**Sections** (5-7 total):
1. **Available Locals Showcase**: 3-column grid of property cards with filtering sidebar
2. **Featured Properties**: Larger cards with detailed specs (2-column layout)
3. **Benefits/Features**: 4-column grid with icons, titles, descriptions (why rent here)
4. **Location & Amenities**: Map integration + 3-column amenities list
5. **Statistics**: 4 KPI cards (total spaces, occupancy rate, average size, years in business)
6. **Testimonials**: 2-column layout with LocalOwner quotes and photos
7. **Contact/CTA**: Form + contact information, 2-column split

**Spacing**: py-20 to py-32 between sections on desktop, py-12 on mobile

### Dashboard (CentroComercialAdmin)

**Layout**:
- Sidebar navigation (w-64): Logo, role indicator, menu items grouped by function
- Main content area: max-w-7xl, px-8
- Top bar: Breadcrumbs, search, notifications, user profile

**Main Dashboard View**:
- KPI row: 4 metric cards (Occupancy Rate, Monthly Revenue, Available Locals, Overdue Payments)
- Revenue chart: Full-width card with line/bar chart
- Recent Activity: Table with latest contracts, payments, requests (h-96, scrollable)
- Quick Actions: 4 prominent buttons for common tasks

### Panel LocalOwner

**Contract Overview Card**: Full-width, prominent positioning
- Split layout: Contract details (left) | Payment status (right)
- Include: Property photo, contract dates, rental amount, status badge

**Payment History**: Data table with filters by month/year

**Documents Section**: Grid of downloadable PDFs with icons and dates

### SystemDeveloper Panel

**Monitoring Dashboard**: Technical metrics in grid layout
- System health indicators
- Activity logs table (monospace font for technical data)
- Database stats visualization

---

## Images

**Hero Image**: High-quality photograph of modern shopping mall interior—bright, spacious, with visible storefronts and natural lighting. Position: full-width background, object-fit: cover, centered.

**Property Cards**: Exterior and interior photos of commercial spaces, 4:3 aspect ratio, well-lit professional photography showing the space's potential.

**Testimonial Section**: Authentic headshots of business owners (circular crop, w-16 h-16).

**Amenities Section**: Icons paired with modern photography showing mall facilities (parking, security, common areas).

---

## Animations

**Minimal Use Only**:
- Card hover: Subtle lift (translate-y-1) with shadow increase
- Button hover: Scale slightly (scale-105)
- Page transitions: Fade only, no complex animations
- Loading states: Simple spinner, no elaborate skeletons

**No scroll animations or parallax effects**—prioritize performance and accessibility.

---

This design balances professional credibility for business users with approachable, visual appeal for potential renters, ensuring each role has an optimized experience.