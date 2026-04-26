Design a modern, professional, and scalable web application UI for:

"Doctor–Sales Executive Credit-Based Gift Exchange Platform"

This platform connects doctors and pharmaceutical sales representatives through a credit-based reward system where doctors can redeem products using assigned credits.

=================================
🔹 DESIGN STYLE & THEME
=================================
- Style: Clean, modern, professional (healthcare + corporate feel)
- Tone: Trustworthy, minimal, user-friendly
- Color Palette:
  - Primary: Deep Blue (#1E3A8A) → trust, professionalism
  - Secondary: Teal (#14B8A6) → healthcare vibe
  - Accent: Soft Green (#22C55E) → success/credit
  - Neutral: White, Light Gray (#F3F4F6), Dark Gray (#374151)
- Typography:
  - Headings: Inter / Poppins (bold, clean)
  - Body: Inter / Roboto (readable)
- UI Style:
  - Rounded corners (12px–16px)
  - Soft shadows
  - Card-based layout
  - Minimal icons (Heroicons / Lucide style)

=================================
🔹 DESIGN SYSTEM
=================================
Create reusable components:
- Buttons (Primary, Secondary, Danger, Disabled)
- Input fields (text, password, search)
- Cards (product, stats, order)
- Navbar (top + sidebar)
- Tables (for admin/sales rep)
- Modals (confirmation, edit forms)
- Badges (order status: Pending, Approved, Delivered)
- Alerts (success, error, warning)
- Pagination & filters

=================================
🔹 USER ROLES UI FLOWS
=================================
Design separate dashboards for:
1. Doctor
2. Sales Representative
3. Admin

=================================
🔹 LANDING PAGE (PUBLIC)
=================================
Sections:
1. Hero Section
   - Headline: “Smart Credit-Based Reward System for Doctors”
   - CTA buttons: “Login” / “Get Started”
   - Illustration (doctor + dashboard + rewards)

2. Features Section
   - Credit-based ordering
   - Easy product browsing
   - Sales rep management
   - Real-time order tracking

3. How It Works (3–4 steps)
   - Get credits → Browse → Order → Receive

4. Benefits Section
   - For Doctors
   - For Sales Representatives
   - For Companies

5. Testimonials / Trust section

6. Footer
   - Links, contact, copyright

=================================
🔹 AUTH PAGES
=================================
- Login Page
- Register Page (for external doctors)
- Forgot Password

Design:
- Centered card layout
- Clean input fields
- Branding on side panel

=================================
🔹 DOCTOR DASHBOARD
=================================
Pages:
1. Dashboard Home
   - Credit balance card (highlighted)
   - Quick stats (orders, pending, delivered)
   - Recent orders

2. Product Catalog
   - Grid layout
   - Search bar (e.g., “rice”)
   - Filters (category, credit range)
   - Product card: image, name, credit cost, stock, add to cart

3. Product Details Page
   - Large image
   - Description
   - Credit cost
   - Add to cart button

4. Cart Page
   - List of items
   - Total credit calculation
   - Checkout button

5. Orders Page
   - Order history
   - Status badges (Pending, Processing, Delivered)

=================================
🔹 SALES REPRESENTATIVE DASHBOARD
=================================
Pages:
1. Dashboard
   - Total doctors
   - Orders pending
   - Credits assigned

2. Doctor Management
   - Table of doctors
   - Edit credit button
   - Reset password

3. Order Queue
   - List of incoming orders
   - Order details view
   - “Mark as Delivered” button

=================================
🔹 ADMIN DASHBOARD
=================================
Pages:
1. Admin Overview
   - System stats (users, orders, products)

2. User Management
   - Add/Edit/Delete doctors & sales reps

3. Product Management
   - Add/Edit/Delete products
   - Upload product image
   - Set credit cost & stock

4. Order Monitoring
   - View all orders
   - Filter by status

=================================
🔹 UX REQUIREMENTS
=================================
- Responsive design (desktop first, mobile adaptive)
- Sidebar navigation for dashboards
- Breadcrumb navigation
- Loading states (skeleton UI)
- Empty states (no orders, no products)
- Error states (invalid login, no credit)

=================================
🔹 MICRO INTERACTIONS
=================================
- Hover effects on cards and buttons
- Smooth transitions
- Cart update animation
- Success confirmation after order

=================================
🔹 OUTPUT REQUIREMENTS
=================================
- Provide full page layouts (desktop)
- Include component variants
- Use auto-layout (Figma)
- Organize into pages:
  - Design System
  - Landing Page
  - Auth Pages
  - Doctor Dashboard
  - Sales Dashboard
  - Admin Dashboard

=================================
🔹 EXTRA (IMPORTANT)
=================================
- Keep UI developer-friendly for React + Tailwind conversion
- Maintain consistent spacing (8px grid system)
- Use reusable components only