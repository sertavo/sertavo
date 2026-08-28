# Sertavo Instagram Generator - Locked Spec + v2 Roadmap

Status: ACTIVE SOURCE OF TRUTH  
Date locked: 2026-08-28

## 1. Production principles - locked

The generator is a brand system, not a one-off carousel builder. Every future template must preserve the same visual and copy language unless a tested conversion reason justifies a change.

### Brand system
- Primary font: Heebo.
- Primary colors: deep navy, warm cream/ivory, muted gold.
- Default logo: the updated full Sertavo wordmark currently embedded in the generator.
- The same logo treatment and top safe-zone logic must be used across all templates.
- Use the normal hyphen `-` only. Do not use en dash or em dash in customer-facing copy.
- RTL is mandatory for Hebrew customer-facing content.

### Copy language
- Public service term: `בדיקת התאמה`.
- Physical product term: `ערכת התנסות`.
- Use `כמה שאלות קצרות`, not `שאלון`.
- Second-person singular Hebrew: `לך`.
- Locked slogan: `לפני שקונים, בודקים.`
- Avoid exaggerated certainty and empty marketing language.
- Headlines should be short and scan quickly on mobile.
- UI-style short list items should generally not end with periods.
- Full explanatory sentences may use normal punctuation.

### CTA
- Primary pilot CTA: `בדיקת התאמה - לינק בביו`.
- CTA is text, not a fake clickable Instagram button.

### Matching score
- Only the main direction receives a numeric score.
- Secondary comparison direction has no second score.
- The score component must be identical wherever reused.
- Display format: large numeric score, with `מתוך 100` as the denominator label.
- Never describe the score as a probability that the customer will love a fragrance.

### Assets
- Public creatives should avoid third-party perfume logos, official bottle imagery and trade-dress imitation unless clearly licensed/approved.
- Real Sertavo assets and original visuals are preferred.
- C3S4 should use a real customer-facing kit photo when a strong final photo exists. The illustration remains the fallback.

## 2. Pilot carousel structure - locked

Exactly 3 pilot carousels, 4 slides each.

1. Carousel 1 - Problem / Positioning
2. Carousel 2 - Product / Proof / Trust
3. Carousel 3 - Ease / Conversion / Trial Kit

Publish logic: problem -> trust/value -> ease/start.

## 3. Current production QA rules

### Must pass before publish
- No clipping or overlaps in 1080x1350 export.
- Hebrew RTL renders correctly.
- Logo-to-headline spacing remains visually consistent.
- Copy length warnings appear before text becomes visually crowded.
- Exported PNG matches preview.
- Copy Assist does not silently overwrite unrelated fields.
- Icons use a consistent stroke, circle, optical alignment and scale.
- Heart icon is optically centered inside its circle.
- Score component is centered and identical across templates.
- Mobile Safari and at least one additional mobile browser pass a smoke test.

## 4. Current production fixes - v1.2.11

### Must Fix
1. Standardize score denominator to `מתוך 100` everywhere.
2. Optically center the heart icon.
3. Preserve the updated uploaded logo as the built-in default.
4. Preserve the title/logo spacing system across all 12 slides.
5. Keep C3S2 icons semantic: heart / perfume use / checklist.
6. Remove unnecessary terminal periods from the C3S2 and C3S3 short UI list items.

### Should Fix / next visual pass
1. Make the WhatsApp mockup feel more phone-like while keeping instant WhatsApp recognition.
2. Replace the C3S4 kit illustration with a strong real kit photo once available.
3. Run final visual QA on all 12 exported PNGs after every component-level change.

## 5. v2 roadmap

### NOW - production hardening
- Finish v1.2.11 QA.
- Lock reusable component styles: logo, score, CTA, icons, WhatsApp mockup, recommendation card, kit block.
- Keep text-length guardrails and Copy Assist stable.

### NEXT - reusable content engine
- Template Library by objective: Awareness, Education, How It Works, FAQ, Trust, Case Study, Comparison, Recommendation Logic, Trial Kit.
- Reusable content blocks instead of hard-coded slide-only layouts.
- Stronger Copy Assist actions: shorter, clearer, more premium, more direct, stronger hook, stronger CTA, less marketing-heavy.
- Asset Manager for approved logos, kit photos, WhatsApp mockups, score components and backgrounds.
- Consistency Guard for spacing, density, CTA presence, text length and visual hierarchy.

### AFTER THAT - Stories + Highlights
- Story canvas: 1080x1920 with Instagram safe zones.
- Story sequence templates: 1, 3 and 5-frame flows.
- Story types: hook, FAQ, poll prompt, myth/truth, mini explainer, testimonial, kit, WhatsApp CTA.
- Highlight cover generator using the same icon and brand system.
- Suggested initial highlights: `איך זה עובד`, `התאמה`, `שאלות`, `ערכות`, `ביקורות`, `אודות`.

### LATER - campaign system
- Campaign Mode: one topic generates coordinated feed carousel + stories + highlight asset + CTA asset.
- Export bundles and consistent auto-naming.
- Testimonial/review templates once enough real customer proof exists.
- Optional A/B variants for hooks and CTA copy.

## 6. Product decision rule

Do not add a feature because it is interesting. A new feature enters the production roadmap only if it does at least one of the following:
- materially reduces time to publish,
- improves brand consistency,
- improves conversion/testing capability,
- prevents recurring production errors,
- enables a recurring content format Sertavo will actually use.

Brand polish is secondary to proving demand and conversion during the pilot.
