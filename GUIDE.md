MIDDLEWARE REQUIREMENTS

1. Protect dashboard routes
   - Must be authenticated

2. Protect admin routes
   - Must have role = admin

3. Invitation page:
   - Must check expires_at
   - If expired → return 404

4. Upgrade routes:
   - Only user role allowed

5. Block editing expired events

SaaS Architecture Design

1. Subscription System
   - user_subscriptions table
   - expiration logic
   - auto-downgrade to free after expiry

2. Payment Approval
   - manual admin approval
   - change subscription on approve

3. Plan Enforcement
   - backend service validation
   - never rely on frontend

4. Cron Job Ready
   - daily job to deactivate expired events

5. Theme System
   - dynamic theme rendering
   - theme_id stored in events

6. Scaling Ready
   - Neon serverless
   - Edge-ready Next.js
   - Cloudinary CDN

7. Monetization Expansion
   - Add Stripe later
   - Add Add-ons (music, animation, RSVP)

# AI_PROJECT_CONTEXT.md

# PROJECT NAME
Niche E-Invitation (SaaS Wedding Invitation Platform)

---

# PROJECT TYPE
Fullstack SaaS Web Application  
Mobile-first Responsive  
Subscription-based system (Free & Paid Plan)

---

# TECH STACK (MANDATORY)

Frontend:
- Next.js (App Router)
- TypeScript
- TailwindCSS
- shadcn/ui
- React Server Components

Backend:
- Next.js Route Handlers
- Drizzle ORM
- PostgreSQL (Neon)

Authentication:
- Better Auth
- Role-based Access Control (admin | user)

Storage:
- Cloudinary (Image Upload & CDN)

Lint:
- Biome

Deployment Target:
- Vercel (Frontend + API)
- Neon (Database)

---

# CORE BUSINESS MODEL

Users create wedding e-invitation pages.

There are 2 subscription plans:

1) FREE
2) PAID (329 THB via QR Code payment)

All plan limitations MUST be enforced in backend service layer.
Never rely on frontend validation.

---

# USER ROLES

## ROLE: user

Permissions:
- Register / Login
- Create invitation
- Edit invitation (if not expired)
- Upload 2 images
- Add event schedule
- Upgrade plan
- View own invitations

Restrictions:
- Limited by subscription plan

---

## ROLE: admin

Back-office only.

Permissions:
- Manage themes
- Add / Edit theme
- Configure theme sections
- Approve or reject payments
- View all users
- Manage subscription overrides

Admin routes must be protected by role middleware.

---

# SUBSCRIPTION PLANS

## FREE PLAN

Price: 0 THB

Rules:
- maxEvents = 1 active event
- maxSchedule = 4 items
- allowSlug = false
- allowQuote = false
- allowMaps = false
- duration = until 24 hours after event date
- only 4 predefined themes available

Slug format (auto-generated):
niche-{eventDate}-{randomCode}

Example:
niche-2026-03-20-4821

User can only create one event at a time.
If expired, they can create new one.

---

## PAID PLAN (329 THB)

Price: 329 THB

Rules:
- maxEvents = 5 active events
- maxSchedule = unlimited
- allowSlug = true
- allowQuote = true
- allowMaps = true
- duration = 30 days from approval
- unlimited theme access
- custom slug allowed

---

# DATABASE STRUCTURE (DRIZZLE + POSTGRESQL)

## TABLE: users
- id (uuid primary key)
- email (unique)
- password
- role (admin | user)
- created_at

---

## TABLE: plans
- id
- name (free | paid)
- price
- duration_days
- max_events
- max_schedule
- allow_slug
- allow_quote
- allow_maps

---

## TABLE: user_subscriptions
- id
- user_id
- plan_id
- expires_at
- created_at

Only one active subscription per user.

---

## TABLE: themes
- id
- title
- primary_color
- secondary_color
- accent_color
- background_color
- font_family
- show_date (boolean)
- show_schedule (boolean)
- show_quote (boolean)
- show_image1 (boolean)
- show_image2 (boolean)
- created_at

---

## TABLE: events
- id
- user_id
- plan_id
- theme_id
- groom_name
- bride_name
- image1_url
- image2_url
- event_date
- location_text
- google_maps_url
- quote
- slug (unique)
- expires_at
- created_at

Expired events must return 404.

---

## TABLE: schedules
- id
- event_id
- time
- title
- order

---

## TABLE: payments
- id
- user_id
- slip_url
- amount
- status (pending | approved | rejected)
- created_at

---

# BUSINESS LOGIC RULES (CRITICAL)

All validation MUST happen in service layer.

Never trust frontend.

---

## EVENT CREATION FLOW

1. Verify authentication
2. Fetch active subscription
3. Count active events
4. Validate maxEvents
5. Validate schedule count
6. Validate plan features:
   - If free:
       - Remove custom slug
       - Remove quote
       - Remove maps
7. Generate slug:
   - Free → auto
   - Paid → use custom
8. Calculate expires_at:
   - Free → event_date + 1 day
   - Paid → subscription expiry
9. Insert event
10. Insert schedules

---

## EVENT EDIT RULES

- User must own event
- Event must not be expired
- Re-check plan limits if schedule modified

---

## PAYMENT FLOW

1. User selects upgrade
2. System displays QR code
3. User uploads slip (Cloudinary)
4. Payment status = pending
5. Admin approves
6. Create or update subscription (30 days)
7. Plan becomes PAID

---

# INVITATION PAGE STRUCTURE (FRONTEND RENDER)

Each invitation page must render in this order:

1. Groom & Bride Name
2. Image 1
3. Quote (Paid only)
4. Event Date
5. Location Text
6. Google Maps button (Paid only)
7. Image 2
8. Schedule Section

Sections visibility controlled by theme settings.

---

# THEME SYSTEM

Themes stored in database.
Events reference theme_id.

On render:
- Fetch event
- Fetch theme
- Match theme component by theme_id
- Apply theme colors as CSS variables
- Apply font from Google Fonts

---

# DEFAULT THEME COMPONENTS

Create in:

/components/themes/

- ThemeClassic.tsx
- ThemeRomantic.tsx
- ThemeMinimal.tsx
- ThemeLuxury.tsx

Each theme:
- Accept props: event + theme
- Render conditional sections
- Apply dynamic styles

---

# GOOGLE FONTS TO INCLUDE

- Playfair Display
- Cormorant Garamond
- Great Vibes
- Montserrat
- Lora

Admin can assign font per theme.

---

# NAVBAR (USER DASHBOARD)

Must show:

- Brand logo: "Niche E-Invitation"
- Plan badge (Free / Paid)
- My Invitations
- Create Event button
- Logout

User must be authenticated.

---

# ROUTE STRUCTURE

app/
  (auth)/
  dashboard/
  invitation/[slug]/
  admin/
  api/

---

# MIDDLEWARE REQUIREMENTS

1. Protect dashboard routes → must be authenticated
2. Protect admin routes → must be role = admin
3. Block expired event access → return 404
4. Block editing expired events
5. Enforce plan limits

---

# SECURITY RULES

- Validate image file type before upload
- Limit image size
- Validate slug uniqueness
- Protect admin API routes
- Sanitize user input
- Enforce backend validation

---

# SAAS SCALABILITY DESIGN

System must support:

- Subscription expiration logic
- Future Stripe integration
- Add-ons (music, animation, RSVP)
- Cron job for auto-expire events
- Analytics (future)
- Multi-language support (future)

---

# PERFORMANCE REQUIREMENTS

- Use Next.js server components
- Optimize images via Cloudinary
- Use dynamic metadata for invitation SEO
- Mobile-first responsive design

---

# FUTURE EXTENSION READY

System should be easily extendable to:

- RSVP system
- Guest list management
- Event analytics
- Stripe auto-payment
- Background music
- Animation themes
- Multi-tenant white-label SaaS

---

# IMPORTANT DEVELOPMENT RULES

- All business logic must live in service layer
- Never mix validation inside UI
- Keep theme rendering separated
- Maintain strict TypeScript types
- Follow clean architecture separation:
    UI → Service → DB
- Prepare for production deployment

---

# END OF AI PROJECT CONTEXT
