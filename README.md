# Chamara Maduranga Silva — Portfolio

A responsive Next.js portfolio built around a live ROAS curve (0.25 → 10) in the hero, count-up impact numbers, a scroll-linked career timeline, real CV-derived content, original uploaded JPEG, LinkedIn CTAs and a Supabase-powered secure admin editor.

## Start locally

1. Install Node.js 20.9+.
2. Run `npm install`.
3. Run `npm run dev`.
4. Open http://localhost:3000.

The public portfolio works **without Supabase** using built-in content. The admin dashboard requires Supabase setup.

## Enable the admin backend

1. Create a Supabase project at https://supabase.com.
2. Copy `.env.example` to `.env.local` and fill in your project URL and **publishable/anon** key (never a service-role key).
3. In the Supabase SQL Editor, run `supabase/schema.sql`.
4. In Authentication > Users, create your own admin account with email/password (or invite yourself). Do not enable open public signup for this admin-only site.
5. Copy your Auth user UUID. In SQL Editor run:
   `insert into public.portfolio_admins(user_id) values ('YOUR-AUTH-USER-UUID');`
6. Restart the dev server. Visit http://localhost:3000/admin and sign in.
7. Edit content and select **Publish changes**. The website will refresh its published content within approximately 60 seconds. Until first publish, the site shows CV-derived defaults.

**Security:** All content updates use Supabase row-level security and an explicit admin allowlist. Public visitors can only read portfolio content. No password or private key is embedded in the website.

## Deploy

Deploy to Vercel from a private Git repository. Set the same two `NEXT_PUBLIC_SUPABASE_*` environment variables in Vercel project settings, then deploy. You can connect a custom domain. Test admin sign-in, content publishing and mobile layouts after deployment.

## Editing

- `/admin`: Edit profile, LinkedIn URL, metrics, expertise, experience, case studies and insights.
- Replace `public/chamara-profile.jpg` to change the original photograph (requires redeploy).
- Colours and type are CSS variables at the top of `app/globals.css` (font: Bricolage Grotesque, self-hosted via npm). Change theme, animations and layout in `app/globals.css` and `app/portfolio.tsx` (requires redeploy).
- The CV is the source for the initial content; review claims before publishing publicly.

## Privacy and content notes

Home address, personal phone number, email and reference contact information are deliberately omitted from the public site. The image is the original uploaded JPEG. The 40× ROAS statement is derived from 0.25 to 10 in the CV. The website does not imply independent verification of achievements.

## File structure

- `app/portfolio.tsx`: public website
- `app/_components/RoasCurve.tsx`: hero performance curve (scrub with mouse or arrow keys)
- `app/_components/CountUp.tsx`, `Timeline.tsx`: impact counters and scroll-linked timeline
- `app/globals.css`: responsive design
- `app/admin/page.tsx`: content management UI
- `lib/content.ts`: initial CV-derived content
- `lib/supabase.ts`: database connection
- `supabase/schema.sql`: database schema and policies
