# PROJECT SPEC — PERSONALIZED HUST GRADUATION INVITATION WEBSITE

Build a polished, mobile-first graduation invitation website for:

Name: TRẦN QUANG HUY
Display name in invitation content: Huy Trần
University: Hanoi University of Science and Technology (HUST)
Graduation year: 2026

The website will primarily be opened on smartphones in portrait orientation.

The overall visual direction is:

HUST CLASSIC
- Elegant
- Masculine
- Minimal
- Formal but not stiff
- Premium editorial feeling
- No floral/wedding-like decoration
- No excessive gradients
- No flashy animations
- No childish graduation icons
- Focus on whitespace, typography, photography, and the HUST graduation sash

The website must feel like a premium digital graduation invitation rather than a generic event landing page.

--------------------------------------------------
1. MAIN EXPERIENCE
--------------------------------------------------

The invitation must NOT immediately show all event information.

The user first sees a closed invitation/envelope screen.

Flow:

/s1
   ↓
Closed invitation / envelope
   ↓ tap
Envelope opens
   ↓
Invitation intro
   ↓ scroll
Personalized invitation
   ↓
Date & time
   ↓
Location
   ↓
Graduation photos
   ↓
“Khoảnh khắc tại HUST”
   ↓
Personal message
   ↓
Final closing

Example URLs:

/s1
/s2
/s3
/s4

Each URL represents one invited guest.

The same website template is reused.

Only guest-specific data changes.

Example:

/s1
“Thân mời Anh Minh”

/s2
“Thân mời Đức Anh”

/s3
“Thân mời Gia đình cô Lan”

Data will eventually come from Excel / Google Sheets.

Do NOT create separate hardcoded HTML pages for every guest.

Use one reusable template.

--------------------------------------------------
2. VISUAL IDENTITY
--------------------------------------------------

Primary colors:

HUST Maroon:
#8B1E1E

Deep Maroon:
#681314

Ivory:
#FAF7F2

Warm White:
#FFFDFC

Charcoal:
#202020

Muted Gray:
#77736D

Gold Accent:
#C49A58

Gold must only be an accent.

Avoid making the design look luxurious like a wedding invitation.

Main combination:

Ivory background
+
HUST maroon
+
charcoal text
+
very small amounts of muted gold

--------------------------------------------------
3. TYPOGRAPHY
--------------------------------------------------

Use a combination of:

Elegant serif:
- Cormorant Garamond
OR
- Libre Baskerville
OR
- Playfair Display

Clean sans-serif:
- Inter
OR
- Manrope

Suggested usage:

Large headings:
Cormorant Garamond / Playfair Display

Body:
Inter / Manrope

Avoid excessive script handwriting fonts.

A handwriting/script font may only be used in ONE OR TWO small places:
- invited guest's name
- final signature “Huy Trần”

If the script font hurts Vietnamese readability, use serif instead.

Vietnamese diacritics must render perfectly.

--------------------------------------------------
4. KEY DESIGN ELEMENT — HUST GRADUATION SASH
--------------------------------------------------

The uploaded graduation sash reference is an important visual identity.

Use the provided sash image/reference:
“Dải khăn.png”

The website SHOULD NOT display the entire U-shaped sash.

Instead, visually adapt ONE SIDE of the sash into a vertical decorative ribbon.

Approximate content:

HUST

TRẦN
QUANG HUY

HUST crest / emblem

2026

The design should resemble the physical graduation sash:

deep maroon fabric
white typography
subtle textile feeling
pointed bottom

This vertical sash becomes the main recurring visual motif of the website.

IMPORTANT:

The sash should appear automatically throughout the invitation.

However, it should NOT look like a fixed navigation sidebar.

It is decoration.

Mobile layout:

approximately:
60–78 px wide

Desktop:
80–110 px wide

Possible positioning:

left side of the invitation card.

Example:

┌────────────────────────────┐
│ ███                        │
│ ███       THÂN MỜI         │
│ ███                        │
│ ███       Anh Minh         │
│ ███                        │
│ ███   đến tham dự lễ       │
│ H █                        │
│ U █       TỐT NGHIỆP       │
│ S █                        │
│ T █       của              │
│ ███                        │
│ ███       Huy Trần         │
│ ███                        │
└────────────────────────────┘

The sash may move naturally with sections.

Do NOT make it permanently fixed to the browser viewport for the whole website.

Better approach:

Use it as a recurring vertical element integrated inside certain section layouts.

For example:

Invitation section:
full sash

Photo section:
small cropped sash label

Final message:
small sash again

This produces visual consistency without reducing usable mobile width.

--------------------------------------------------
5. PAGE 1 — CLOSED INVITATION
--------------------------------------------------

Full screen.

Minimum height:
100svh

Background:
warm ivory / subtle paper texture

Centered content.

Top:

small:
HUST
1956 — 2026

Then:

TRẦN QUANG HUY

small subtitle:
GRADUATION CEREMONY

Main object:

large maroon envelope.

Style:
realistic enough to feel tactile
but still clean and minimal.

Envelope color:
HUST maroon.

Wax seal:
HUST-inspired crest or simple monogram.

Avoid fake photorealistic rendering if it looks cheesy.

A tasteful CSS/SVG envelope is acceptable.

Text below:

“Bạn có một lời mời”

or

“Một lời mời dành cho bạn”

Then:

“Chạm để mở”

small downward indicator.

Interaction:

tap envelope.

--------------------------------------------------
6. ENVELOPE OPEN ANIMATION
--------------------------------------------------

The animation should feel smooth and premium.

Duration:
approximately 900–1400ms total.

Sequence:

1.
Envelope lifts slightly.

2.
Top flap opens.

3.
Invitation card slowly rises.

4.
Background becomes lighter.

5.
Invitation fills screen.

Do NOT:
- rotate excessively
- use confetti
- use particle explosion
- use loud sounds
- bounce aggressively

Use:
CSS transform
opacity
ease-out / cubic-bezier

Support prefers-reduced-motion.

After animation:

scroll automatically just enough to present the invitation card,
but do NOT suddenly jump far down the page.

--------------------------------------------------
7. PERSONALIZED INVITATION SECTION
--------------------------------------------------

This is one of the most important sections.

Card style:

warm white
rounded corners around 20–28px
very subtle shadow
large whitespace

Vertical sash on LEFT.

Right content:

small:

THÂN MỜI

then personalized guest name:

Anh Minh

or

Bạn Đức Anh

or

Gia đình cô Lan

Then:

đến tham dự

LỄ TỐT NGHIỆP

của

HUY TRẦN

The hierarchy should be elegant.

Example:

THÂN MỜI

       Anh Minh

    đến tham dự

   LỄ TỐT NGHIỆP

        của

     Huy Trần

The guest name should feel more personal than a normal heading.

--------------------------------------------------
8. EVENT DATE SECTION
--------------------------------------------------

Do not display event details as boring rows.

Create editorial calendar typography.

Example:

THỨ BẢY

────────  12  ────────

THÁNG 09     2026

09:00 — 12:00

The date number should be the visual focus.

Use large serif numerals.

Add a subtle horizontal separator.

Do NOT use huge calendar icons.

--------------------------------------------------
9. LOCATION SECTION
--------------------------------------------------

Structure:

ĐỊA ĐIỂM

ĐẠI HỌC BÁCH KHOA HÀ NỘI

Hội trường C2
Số 1 Đại Cồ Việt
Hai Bà Trưng, Hà Nội

CTA:

XEM CHỈ ĐƯỜNG →

Button style:
maroon background
ivory text
rounded 10–14px

Open Google Maps.

Button should be easy to tap on phone.

Minimum touch height:
44px.

Optional secondary action:

LƯU LỊCH

This may download/add an .ics calendar event.

--------------------------------------------------
10. GRADUATION HERO PHOTO
--------------------------------------------------

After event information:

add one strong graduation portrait.

Prefer:

portrait-oriented image.

Example heading:

KHOẢNH KHẮC

TỐT NGHIỆP

Image:
large
rounded 18–24px
almost full width

Do NOT surround image with decorative clutter.

Allow the photo to carry the emotion.

Optional small caption:

“Khép lại một hành trình,
mở ra một chặng đường mới.”

--------------------------------------------------
11. “KHOẢNH KHẮC TẠI HUST” PHOTO SECTION
--------------------------------------------------

This section contains personal photos supplied later.

Title:

KHOẢNH KHẮC
TẠI HUST

Subtitle:

“Một vài mảnh ký ức trong những năm tháng ở Bách Khoa.”

Gallery should NOT look like a standard ecommerce grid.

Mobile-first editorial gallery.

Suggested layout:

large photo
+
two smaller photos
+
large landscape photo
+
optional portrait photo

Example:

┌──────────────────────┐
│                      │
│      PHOTO 01        │
│                      │
└──────────────────────┘

┌──────────┐ ┌─────────┐
│ PHOTO 02 │ │PHOTO 03 │
│          │ │         │
└──────────┘ └─────────┘

┌──────────────────────┐
│      PHOTO 04        │
└──────────────────────┘

Photos may include:

- graduation gown
- HUST campus
- library
- C1/C2
- classroom
- friends
- research / laboratory
- presentation
- daily student life

Use object-fit: cover.

Lazy load images.

Use responsive srcset if possible.

On tapping a photo:

open a simple full-screen lightbox.

Swipe left/right.

No complex controls.

--------------------------------------------------
12. SMALL STORY / TIMELINE
--------------------------------------------------

Optional but recommended.

Keep it concise.

Heading:

MỘT CHẶNG ĐƯỜNG

Possible milestones:

2022
Bắt đầu hành trình tại Bách Khoa

2024
Những đồ án đầu tiên

2025
Những ngày chạy deadline

2026
Tốt nghiệp

Use a thin vertical maroon line.

Do not make it feel like a LinkedIn CV.

This section should be emotional/light-hearted.

Timeline content should be configurable.

--------------------------------------------------
13. PERSONAL MESSAGE
--------------------------------------------------

This section should feel quieter.

Lots of whitespace.

Heading:

ĐÔI LỜI NHẮN GỬI

Possible content:

“Bốn năm đại học là một hành trình không quá dài,
nhưng đủ để lưu lại rất nhiều kỷ niệm.

Có những ngày vui,
có những đêm chạy deadline,
có những lần tưởng như không kịp,
và có những người đã đồng hành cùng mình trong suốt chặng đường ấy.

Lễ tốt nghiệp lần này không chỉ là một dấu mốc của riêng mình,
mà còn là dịp để mình được gặp lại và chia sẻ khoảnh khắc này
với những người mình trân trọng.

Rất mong được gặp bạn tại lễ tốt nghiệp.”

Signature:

Huy Trần

2026

Use only subtle animation.

--------------------------------------------------
14. FINAL SECTION
--------------------------------------------------

Minimal closing.

Example:

SEE YOU AT MY
GRADUATION

12 . 09 . 2026

HUST

small decorative sash / HUST element.

Possible buttons:

XEM CHỈ ĐƯỜNG

THÊM VÀO LỊCH

Optional:

GỬI LỜI NHẮN

Footer:

Made for Graduation 2026
Huy Trần

No social media clutter.

--------------------------------------------------
15. PERSONALIZATION DATA
--------------------------------------------------

The website must support a centralized data source.

Initial development can use:

data/guests.json

Example:

[
  {
    "slug": "s1",
    "name": "Nguyễn Văn Minh",
    "displayName": "Anh Minh",
    "salutation": "Anh",
    "message": "",
    "active": true
  },
  {
    "slug": "s2",
    "name": "Nguyễn Đức Anh",
    "displayName": "Đức Anh",
    "salutation": "Bạn",
    "message": "",
    "active": true
  }
]

Later replace or sync it with Google Sheets.

Recommended Google Sheet columns:

slug
guest_name
display_name
salutation
custom_message
active

Example:

s1 | Nguyễn Văn Minh | Anh Minh | Anh | | TRUE
s2 | Nguyễn Đức Anh | Đức Anh | Bạn | | TRUE
s3 | Gia đình cô Lan | Gia đình cô Lan | | | TRUE

Do NOT expose private spreadsheet credentials in frontend code.

If Google Sheets is used:
fetch via server/API route or published read-only endpoint.

--------------------------------------------------
16. GLOBAL EVENT DATA
--------------------------------------------------

Do not duplicate event information for every guest.

Create separate shared configuration:

event.config.ts

Example:

graduate:
Tran Quang Huy

displayName:
Huy Trần

university:
Đại học Bách khoa Hà Nội

year:
2026

date:
2026-09-12

startTime:
09:00

endTime:
12:00

venue:
Hội trường C2

address:
Số 1 Đại Cồ Việt, Hai Bà Trưng, Hà Nội

mapUrl:
...

message:
...

photos:
[...]

This makes event details editable in one place.

--------------------------------------------------
17. URL BEHAVIOR
--------------------------------------------------

Examples:

/s1
/s2
/s3

Extract slug from route.

Find guest in guest dataset.

If guest exists and active:

render personalized invitation.

If guest does not exist:

show elegant generic invitation:

“THÂN MỜI BẠN”

Do NOT show a technical 404 page unless URL is unrelated to invitation routes.

Optional future support:

/invite/s1

But default desired style is:

domain.com/s1

--------------------------------------------------
18. RESPONSIVE DESIGN
--------------------------------------------------

PRIMARY TARGET:

mobile portrait.

Design width priority:

360px
375px
390px
393px
412px
430px

Must work especially well on:

iPhone 13/14/15/16
modern Android devices

Page content max width:

mobile:
100%

tablet / desktop:
approximately 480–560px centered

Desktop should look like a mobile invitation card centered on a neutral background.

Do NOT stretch invitation content across desktop.

Example desktop:

gray/ivory background

             ┌──────────────┐
             │              │
             │ invitation   │
             │              │
             └──────────────┘

--------------------------------------------------
19. SCROLL EXPERIENCE
--------------------------------------------------

Use subtle reveal animation.

Example:

opacity:
0 → 1

translateY:
20px → 0

duration:
500–700ms

stagger:
50–120ms

Sections should feel smooth.

Avoid ScrollTrigger-heavy effects.

Avoid parallax that affects readability.

Do not hijack scrolling.

Native scrolling must remain natural.

--------------------------------------------------
20. OPTIONAL PROGRESS INDICATOR
--------------------------------------------------

A tiny vertical progress marker can appear on one edge.

Example:

○
●
○
○

But only if it stays visually clean.

Not necessary for MVP.

--------------------------------------------------
21. PERFORMANCE
--------------------------------------------------

Target:

Lighthouse mobile performance > 90 if realistic.

Optimize images.

Use:

WebP / AVIF where possible.

Lazy load below-fold photos.

Do not load a heavy animation framework only for simple transitions.

Use CSS / Framer Motion if React framework already uses it.

Initial screen should load quickly even on 4G.

--------------------------------------------------
22. ACCESSIBILITY
--------------------------------------------------

Minimum body font size:
15–16px.

Ensure color contrast.

Buttons >= 44px tall.

Images must have alt text.

Respect:

prefers-reduced-motion.

Keyboard navigation should work on desktop.

Do not encode important information only as images.

--------------------------------------------------
23. RECOMMENDED TECH STACK
--------------------------------------------------

Preferred implementation:

Next.js
TypeScript
Tailwind CSS

Optional:
Framer Motion

Icons:
Lucide React

Use Next/Image for photos.

Suggested structure:

src/
  app/
    [slug]/
      page.tsx

  components/
    invitation/
      EnvelopeIntro.tsx
      InvitationCard.tsx
      GraduationSash.tsx
      EventDate.tsx
      LocationCard.tsx
      HeroPhoto.tsx
      HustMoments.tsx
      JourneyTimeline.tsx
      PersonalMessage.tsx
      FinalSection.tsx

  data/
    guests.ts

  config/
    event.ts

  lib/
    guests.ts

public/
  images/
    sash/
    graduation/
    moments/

Keep components focused.

Do not put the entire website in page.tsx.

--------------------------------------------------
24. GRADUATION SASH COMPONENT
--------------------------------------------------

Create:

<GraduationSash />

Props can include:

variant:
full
compact

showName:
boolean

showLogo:
boolean

showYear:
boolean

Possible full sash content:

[HUST LOGO]

HUST

TRẦN
QUANG HUY

[CREST]

2026

Possible compact sash:

HUST
2026

The physical sash image provided by the user should guide:
- maroon color
- proportions
- pointed end
- typography hierarchy

But implementation should integrate naturally with the UI.

Do not simply paste the entire original PNG into every page.

--------------------------------------------------
25. PHOTO DATA
--------------------------------------------------

Make gallery configurable.

Example:

photos: [
 {
   src: "/images/moments/hust-01.webp",
   alt: "Huy tại khuôn viên HUST",
   caption: "Một chiều ở Bách Khoa"
 },
 {
   src: "/images/moments/hust-02.webp",
   alt: "Khoảnh khắc cùng bạn bè tại HUST"
 }
]

Replacing photos later should not require layout changes.

--------------------------------------------------
26. VISUAL DETAILS
--------------------------------------------------

Use subtle paper texture.

Texture opacity:
2–5%.

Borders:
#E8E1D8

Border radius:
18–28px.

Shadow:
very light.

Example:

0 12px 40px rgba(40, 20, 15, 0.08)

Avoid:

neon
glassmorphism
heavy gradients
large drop shadows
3D cards
purple/blue gradients
generic SaaS design

--------------------------------------------------
27. DESIGN PHILOSOPHY
--------------------------------------------------

The overall experience should communicate:

“This is Huy's graduation invitation.”

NOT:

“This is a graduation website template.”

The most important personal identity elements are:

1. HUST maroon
2. Graduation sash
3. Guest's personalized name
4. Huy's photography
5. HUST memories
6. restrained typography
7. graduation date

--------------------------------------------------
28. UI PRIORITY
--------------------------------------------------

Priority order:

1. Mobile experience
2. Personalized guest
3. Envelope opening interaction
4. Sash identity
5. Event information clarity
6. Personal photos
7. Closing message
8. Desktop presentation

--------------------------------------------------
29. MVP REQUIREMENTS
--------------------------------------------------

Version 1 MUST include:

- /s1 dynamic route
- guest personalization
- envelope opening interaction
- reusable GraduationSash component
- invitation section
- event date
- event location
- Google Maps button
- hero graduation photo
- “Khoảnh khắc tại HUST” gallery
- final personal message
- responsive mobile design
- sample guests data
- clean animations

Do NOT spend time yet on:

- admin dashboard
- authentication
- RSVP database
- analytics dashboard
- photo uploads
- CMS
- complicated backend

--------------------------------------------------
30. IMPORTANT IMPLEMENTATION RULE
--------------------------------------------------

Before coding:

First create a clear component/layout plan.

Then implement the mobile layout first.

Test at:
390 × 844

Only after mobile looks polished:
adapt tablet and desktop.

Do not prematurely optimize desktop.

--------------------------------------------------
31. DEFINITION OF DONE
--------------------------------------------------

The MVP is complete when:

1. Visiting /s1 shows guest s1.
2. Visiting /s2 shows a different guest automatically.
3. Opening screen looks like a real invitation/envelope.
4. Tapping it produces a smooth opening transition.
5. Invitation clearly shows personalized guest name.
6. HUST sash is visible and visually consistent.
7. Event date and location are readable within seconds.
8. Google Maps CTA works.
9. Personal photos display beautifully.
10. “Khoảnh khắc tại HUST” works on phone.
11. Final message has an emotional but clean presentation.
12. No horizontal overflow on 360–430px mobile screens.
13. Website feels premium and personal.
14. Replacing photos or guest data does not require component rewrites.
15. Code is modular and maintainable.

--------------------------------------------------
32. FIRST TASK FOR CODING AGENT
--------------------------------------------------

Do NOT immediately build everything blindly.

First:

1. Inspect repository if one exists.
2. Propose project/component structure.
3. Confirm mobile page structure.
4. Build the first complete visual prototype using sample data:

Guest:
Anh Minh

Graduate:
Huy Trần

Then show the result / screenshots.

Once visual direction is correct:
continue implementing remaining polish and data integration.