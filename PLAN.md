# HUST Graduation Invitation Website — Implementation Plan

## Context

Huy (Trần Quang Huy, HUST/SOICT, graduating Sept 12 2026) wants a premium, personalized graduation-invitation website driven by two detailed spec files already in the project folder (`spec_prompt.md`, `spec_for_sash.md`), a visual reference mockup (`Mẫu demo template.png`), and 9 personal photos in `pic/`. Each invited guest gets their own URL (`/s1`, `/s2`, …) showing the same template with personalized text. The folder is currently empty of code — this is a greenfield Next.js build.

**Resolved during planning:** the HUST crest in the demo mockup is AI-generated with garbled Vietnamese text (confirmed by cropping/inspecting it at 3x) — not a real logo asset. Per Huy's choice, the sash's crest will be a **custom-drawn stylized emblem** (laurel wreath, star, compass motif, "1956" band) inspired by the real HUST seal's layout, monochrome ivory-on-maroon — clearly a decorative motif, not a claim of the official mark. `GraduationSash` will accept an optional `logoSrc` override so a real logo asset can drop in later with zero layout changes.

## Tech Stack

Next.js (App Router) + TypeScript + Tailwind CSS + Framer Motion + lucide-react, per spec section 23. `next/font/google` for Playfair Display (headings), Inter (body), Cormorant Garamond italic (guest name + signature only — supports Vietnamese subset, safer than script fonts for diacritics).

## Dockerized Workflow (per Huy's request — no dependency on host Node/npm)

Everything — scaffolding, installs, and the dev server — runs inside Docker; only the git-trackable source files touch the host.

- `Dockerfile`: `node:20-alpine`, `WORKDIR /app`, exposes 3000, no build-time `COPY` (source is bind-mounted, not baked in) so the image builds even before the project exists.
- `docker-compose.yml`: one `web` service, bind-mounts the repo to `/app`, anonymous volumes over `/app/node_modules` and `/app/.next` (keeps container-installed deps off the host image but they still land in the mounted repo path since npm installs into `/app/node_modules` which *is* the mount — this just prevents host-side leftovers from an earlier host run bleeding in), port `3000:3000`, command `npm run dev -- -H 0.0.0.0` (bind to all interfaces so it's reachable from the host browser).
- All commands go through Docker: `docker compose run --rm web <cmd>` for one-offs (scaffold, `npm install <pkg>`), `docker compose up` for the long-running dev server.
- Plan file also saved as `PLAN.md` at the project root (in addition to the harness's own plan-mode copy) so it lives with the code.

Scaffold sequence:
1. `docker compose build`
2. `docker compose run --rm web npx create-next-app@latest . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm` (non-interactive flags; existing non-conflicting files like `pic/`, `*.md`, `*.png` are left alone)
3. `docker compose run --rm web npm install framer-motion lucide-react`

## Visual System

- Colors as CSS variables / Tailwind tokens: maroon `#8B1E1E`, deep-maroon `#681314`, ivory `#FAF7F2`, warm-white `#FFFDFC`, charcoal `#202020`, muted-gray `#77736D`, gold `#C49A58`, border `#E8E1D8`.
- Radius 18–28px, shadow `0 12px 40px rgba(40,20,15,0.08)`, 2–5% opacity paper-grain texture (SVG turbulence filter, no image asset needed).
- Mobile-first, verified at 390×844; desktop wraps the whole experience in a centered `max-w-[520px]` card on a neutral background (spec §18).

## Photo Assignment

From `pic/`, no actual cap-and-gown photo exists yet (ceremony is in the future), so:
- **Hero ("KHOẢNH KHẮC TỐT NGHIỆP")**: the SOICT Graduation Day 2026 banner portrait (`...032_...d6a31e...jpg`) — portrait-oriented, on-theme.
- **Gallery ("Khoảnh khắc tại HUST")**: curated ~6 of the remaining 8 (C1 building + certificate, studio portrait with laptop, classroom candid, podium speech, presidium table, award/flowers backstage) laid out large/small/large/portrait per spec §11.
Images copied into `public/images/graduation/` and `public/images/moments/` with descriptive filenames + Vietnamese alt text; served via `next/image` (automatic AVIF/WebP, lazy-load below the fold).

## Project Structure

```
src/
  app/
    layout.tsx            # fonts, metadata, global providers
    globals.css            # tokens, texture, base styles
    page.tsx                # "/" → generic invitation (no slug)
    [slug]/page.tsx         # "/s1" etc. → personalized invitation
  components/invitation/
    Envelope.tsx             # closed screen + open animation + orchestrates reveal
    GraduationSash.tsx        # full/compact variants, props per spec §24
    InvitationCard.tsx
    EventDate.tsx
    LocationCard.tsx           # + Maps CTA + "Lưu lịch" (.ics)
    HeroPhoto.tsx
    HustMoments.tsx + Lightbox.tsx
    JourneyTimeline.tsx
    PersonalMessage.tsx
    FinalSection.tsx
    RevealOnScroll.tsx        # shared Framer Motion wrapper (opacity/translateY, respects prefers-reduced-motion)
  data/guests.json
  config/event.ts
  lib/guests.ts               # getGuestBySlug(), generic fallback
  lib/ics.ts                   # builds & downloads .ics client-side
public/images/{sash,graduation,moments}/
```

## Key Component Notes

- **GraduationSash**: CSS/SVG ribbon, `clip-path: polygon(...)` for the V-point, gold double-border, vertical "HUST" (large, bold, ivory), gold divider, stacked guest-of-honor name (full variant only), gold divider, "2026", custom inline SVG crest at top. Width via `clamp(64px, 18vw, 92px)`. Used: full on the invitation card, compact on hero-photo caption and final section, per spec §4.
- **Envelope**: closed state (HUST wordmark, name, "Chạm để mở", subtle bounce chevron) → tap → Framer Motion sequence (lift → flap rotateX open → card rises/fades in → scene collapses) ~1000ms total, `useReducedMotion` skips to a simple fade, then reveals the scrollable invitation below.
- **LocationCard**: primary CTA opens a Google Maps search URL for "Đại học Bách khoa Hà Nội, Hội trường C2, Số 1 Đại Cồ Việt"; secondary "LƯU LỊCH" builds an .ics blob client-side from `config/event.ts` (no backend).
- **HustMoments/Lightbox**: custom full-screen overlay (Framer Motion `AnimatePresence` + drag-to-swipe), no external lightbox lib.
- **Data**: `data/guests.json` seeded with the spec's sample guests (s1 Anh Minh, s2 Đức Anh, s3 Gia đình cô Lan); `[slug]/page.tsx` renders the generic "THÂN MỜI BẠN" version for unknown slugs instead of a 404, per spec §17.

## Build Order (mobile-first, matches spec §30)

1. Scaffold Next.js + Tailwind + fonts + folder structure + color tokens.
2. `GraduationSash` (full + compact) in isolation.
3. `Envelope` + `InvitationCard` — first visual prototype, check at 390×844.
4. `EventDate`, `LocationCard` (Maps + ICS).
5. `HeroPhoto`, `HustMoments` + `Lightbox`.
6. `JourneyTimeline`, `PersonalMessage`, `FinalSection`.
7. Wire `[slug]` routing + generic fallback + desktop centering + a11y pass (44px touch targets, alt text, focus states, reduced-motion).

## Verification

- `docker compose up -d`, then drive Chrome via the browser tool against `http://localhost:3000` at 390×844 for `/s1`, `/s2`, and an unknown slug (generic fallback), plus a desktop width to confirm the centered-card layout.
- Confirm: envelope tap → open animation → auto-reveal works; no horizontal overflow 360–430px; Maps button opens correct URL; "Lưu lịch" downloads a valid .ics; gallery lightbox opens and swipes; personalized name renders per slug; reduced-motion path (via devtools emulation) skips heavy animation.
- Screenshot the mobile flow and share before further polish.
