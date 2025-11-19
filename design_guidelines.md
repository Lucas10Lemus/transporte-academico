# Design Guidelines: Academic Transport Management PWA

## Design Approach

**Selected Approach:** Material Design System adapted for mobile-first PWA
**Rationale:** This utility-focused application serves multiple user roles (Admin, Coordinator, Driver, Student) with complex data management needs. Material Design provides robust patterns for navigation, data tables, and role-based interfaces while maintaining excellent mobile performance.

**Key Design Principles:**
1. Role-based interface clarity - distinct navigation patterns per user type
2. Data accessibility - clear hierarchy for schedules, payments, routes
3. Mobile-first responsiveness - optimized for parents/students on-the-go
4. Trust and transparency - financial and logistical information must be immediately clear

---

## Core Design Elements

### A. Typography
- **Primary Font:** Inter (Google Fonts) - excellent readability for data-heavy interfaces
- **Headings:** Semi-bold (600) for page titles, medium (500) for section headers
- **Body Text:** Regular (400), size-16 for optimal mobile readability
- **Data Tables:** Size-14, medium (500) for labels, regular for values
- **Hierarchy:** Clear size distinction - h1 (2xl), h2 (xl), h3 (lg), body (base)

### B. Layout System
**Spacing Units:** Tailwind 4, 6, 8, 12, 16 units for consistent rhythm
- Card padding: p-6 on mobile, p-8 on desktop
- Section spacing: py-12 mobile, py-16 desktop
- Component gaps: gap-4 for lists, gap-6 for cards

**Grid System:**
- Mobile: Single column stack
- Tablet: 2-column for cards/stats
- Desktop: 3-column dashboard layout, 2-column forms

---

## C. Component Library

### Navigation
**Role-Based Sidebar (Desktop):**
- Fixed left sidebar with user role badge at top
- Grouped menu items: Dashboard, Routes, Payments, Users (admin only)
- Active state with left border accent, subtle background

**Mobile Bottom Navigation:**
- Persistent bottom bar with 4-5 core actions based on role
- Icons with labels for clarity

### Dashboard Components
**Stats Cards:**
- Clean cards with large numeric values, supporting labels below
- Icon on left, metric on right layout
- Grid of 2-4 cards showing key metrics (active routes, pending payments, etc.)

**Route Cards:**
- Horizontal cards showing route name, driver info, capacity, time
- Status indicators (active/inactive) with icon badges
- Quick action buttons (View Details, Edit)

**Payment Tables:**
- Sortable columns: Student, Route, Amount, Status, Due Date
- Color-coded status badges (green: paid, yellow: pending, red: overdue)
- Row actions menu (three-dot icon)

### Forms
**Standard Form Pattern:**
- Full-width inputs with floating labels
- Grouped sections with headers
- Helper text below inputs
- Primary action button bottom-right, secondary left

**Student Enrollment Form:**
- Multi-step wizard for complex enrollment
- Progress indicator at top
- Student selection → Route assignment → Payment setup

### Data Displays
**Route Schedule View:**
- Timeline visualization showing pickup/dropoff points
- Map integration placeholder for route visualization
- Student list with attendance indicators

**Payment History:**
- Accordion-style monthly breakdown
- Expandable rows showing transaction details
- Download receipt button per payment

---

## D. Images

**Dashboard Hero (Admin/Coordinator):**
- Top banner showing school bus illustration or photo
- Semi-transparent overlay with key stats
- Height: 240px mobile, 320px desktop

**Empty States:**
- Friendly illustrations for "No routes assigned", "No pending payments"
- Centered with descriptive text and primary action button

**User Avatars:**
- Circular avatars for drivers and students in lists
- Default color-based initials if no photo

---

## Layout Patterns by User Role

### Student/Parent View
- **Home:** Next pickup time (large display), payment status card, route details card
- **My Route:** Map view, driver contact, schedule
- **Payments:** History table, pay now CTA for pending

### Driver View
- **Today's Route:** Student checklist with check-in buttons
- **Schedule:** Calendar view with assigned routes
- **Students:** Contact list with emergency info access

### Admin/Coordinator View
- **Dashboard:** Comprehensive stats grid, recent activity feed, alerts
- **Routes Management:** Table with filters, bulk actions
- **Financial Overview:** Charts showing payment trends, overdue tracker
- **User Management:** Searchable table with role filters

---

## Critical UX Patterns

**Status Communication:**
- Use color-coded badges consistently: green (active/paid), yellow (pending), red (overdue/inactive)
- Icons accompany text labels for accessibility

**Quick Actions:**
- Floating action button (FAB) for primary actions per screen
- Context menus (three-dot) for row-level actions in tables

**Loading States:**
- Skeleton screens for data tables
- Spinner for form submissions
- Progress indicators for multi-step processes

**Responsive Behavior:**
- Tables convert to card lists on mobile
- Sidebar collapses to hamburger menu
- Forms stack vertically, maintaining single-column width

---

This design creates a professional, data-forward PWA optimized for quick information access while maintaining visual clarity across all user roles and device sizes.