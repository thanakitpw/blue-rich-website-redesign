---
name: bluerich-blog-publish
description: Publish Thai SEO articles to the Blue Rich website (blue-rich.com/news) — turn a draft or a client Google Doc into the house-template markdown in `seo/blog/`, convert it to the site's article HTML, validate it, load it into Supabase, schedule it, and attach its cover image. Use this whenever the user says "เอาบทความขึ้นเว็บ", "ลงบทความ", "ตั้งเวลาลงบทความ", "ทยอยลง", "เปลี่ยนรูปปกบทความ", "แก้บทความที่ลงแล้ว", "ลบบทความ", hands over a Google Doc / .md of articles for this site, or asks why an article is missing, unstyled, or showing early/late. Writing new article copy from scratch belongs to bsc-seo-article-writing; come back here once the copy exists.
---

# Publishing an article to blue-rich.com

Articles live in the Supabase table `public.articles` (project `joxozwjhqkraafostdbd`) and are
rendered by `src/app/(site)/news/[slug]/page.tsx`. Nobody types them into the admin: the source
of truth is a markdown file in `seo/blog/`, and two scripts turn it into database rows.

```
seo/blog/NN-<keyword>.md      ← edit here (house template, one file per article)
   │  node scripts/blog/md-to-article.mts
   ▼
seo/published/<slug>.html + <slug>.json   ← generated, never hand-edit
   │  node scripts/blog/publish-sql.mts   (validates, prints SQL)
   ▼
public.articles  (content_html, seo_title, seo_description, published snapshot)
```

Work through the phases in order. Each one exists because skipping it broke something once.

## Phase 1 — get the copy into `seo/blog/` in the house template

The template is the one the hometools content team uses
(`../hometools-website-redesign/seo/blogs/01-สีทาบ้านภายนอก.md` is the original). Every file
starts with an SEO META comment block that the converter reads as data:

```
<!--
========================================================
SEO META (สำหรับทีมเว็บใส่ในระบบ / CMS)
========================================================
URL slug     : /news/<english-kebab-slug>
Primary KW   : …
Secondary KW : a, b, c
Tag          : ความรู้ | กฎหมาย | บริการ | สินค้า
Publish date : YYYY-MM-DD
Cover image  : /assets/news/<slug>.webp (ต้นฉบับ <source file>)

Title tag (n) : <title> | Blue Rich
Meta desc (n): …
========================================================
-->

# H1 title

**Bold lead — answers the title question in the first sentence.**

Intro paragraph.

---

## Section … (### subsections, tables, 1./- lists, > callouts, [text](/internal-path))

---

## ขั้นตอนถัดไป        ← closing CTA, before the FAQ

---

## คำถามที่พบบ่อย (FAQ)

**Q: question**
A: answer

<!-- INTERNAL LINKS / FAQ SCHEMA notes for humans — the converter drops every comment -->
```

Rules that matter on this site:

- **Keywords come from Blue Rich's own plan** — `/reports/seo-keywords` on blue-rich.com, built
  from `src/data/reports/seo-keywords.ts` and `content/articles/*.md` frontmatter. The page at
  infinitematerialtech.com/reports/seo-keywords looks identical but is a *different client*
  (Infinite Material & Technology) with a different 12-article list. Don't mix them.
- **Client copy arrives as a Google Doc.** Read it with the Drive connector
  (`download_file_content`, `exportMimeType: text/markdown`; the result is base64 — decode it).
  The Doc loses hyperlinks, so diff it against the repo copy and carry over only the text
  changes; the links live in the repo version.
- **No `___` blanks or "รอ…" notes may ship.** The validator rejects them. If the client hasn't
  supplied a number, rewrite the sentence so it stands without it, and tell the user which
  sentences you changed.
- `seo_title` is derived from `Title tag` minus `| Blue Rich` — the root layout appends
  `%s | Blue Rich` itself, so never write the brand into the H1 or seo title.
- Meta desc: 70–170 characters, primary keyword near the front.
- Facts: follow `content/articles/FACTS.md`. The three test reports support ≈1 hr; never invent
  hours, prices, or thicknesses that are not in the source documents.

## Phase 2 — cover image

Covers are 16:10 (the article hero renders 1200×750 and the cards use `aspect-16/10`). Client
art so far arrives as ~1600×1000 PNGs with the Thai headline burned in.

1. Download from Drive. Public-link folders download directly:
   `curl -sL "https://drive.usercontent.google.com/download?id=<fileId>&export=download&confirm=t"`
2. **Match art to articles by reading the headline in the image, never by filename** — the
   numbering in `รูปบทความ_N.png` does not follow article order (in the 2026-10 batch, art #12 was
   article 1 and #1 / #10 were duplicates for article 11). Build a contact sheet (PIL, ~640px
   thumbnails, 2 across, label each) and look at it.
3. Encode: `cwebp -q 82 -resize 1600 0 src.png -o public/assets/news/<slug>.webp` (~200 KB).
   Covers go through `next/image`, so the file just needs to be a sane master.
4. Put the path in `Cover image` and keep the source filename in the brackets.

Keep source PNGs out of git.

## Phase 3 — convert and validate

```bash
node scripts/blog/md-to-article.mts seo/blog/*.md          # → seo/published/<slug>.{html,json}
node scripts/blog/publish-sql.mts seo/published/*.json --dry
```

The converter writes body-only HTML — no `<h1>` (the page renders the title), `<h2 id>` on every
section (`section-N`, `next-steps`, `faq`), a table of contents, tables wrapped in
`.table-wrap`, and the FAQ as `.faq > .faq-item > h3 + p`. Only classes styled by `.article-body`
in `src/app/globals.css` are used; add new block types to both files at once.

The FAQ markup is also the FAQ schema: `src/lib/article-html.ts` parses `.faq-item` into
FAQPage JSON-LD next to Article and BreadcrumbList. Never hand-write JSON-LD into an article,
and never nest a `<div>` inside `.faq-item` (the parser reads to the first `</div>`).

`publish-sql.mts --dry` fails on: `<h1>` in the body, `___`/รอ… placeholders, brand in
`seo_title`, missing cover file, broken TOC anchors, nested FAQ divs, and internal links to
pages that don't exist (it knows the app routes, `src/data/products.ts` slugs, the
`/fireproofing/<service>` slugs and every article in `seo/published`). Fix the `.md`, not the
validator.

## Phase 4 — load into Supabase

`.env.local` has only the anon key, so the script prints SQL instead of writing:

```bash
node scripts/blog/publish-sql.mts seo/published/<slug>.json > /tmp/article.sql
```

How to run it, in order of preference:

1. **Supabase CLI** (needs `supabase login` once, done by the user with `! supabase login`, then
   `supabase link --project-ref joxozwjhqkraafostdbd`):
   `supabase db query --linked -f /tmp/article.sql`
2. **Supabase MCP `execute_sql`** — fine for one article (~25 KB of SQL). A whole batch is
   ~150 KB per six articles, which is too large to pass through a tool call.
3. Supabase SQL Editor in the dashboard (paste the file) if neither of the above is available.

⚠️ The Supabase MCP refuses destructive statements (`delete`, `drop`) with
`Invalid or expired requestState`. Deleting articles therefore needs the CLI or dashboard.

The SQL upserts on `slug` and then sets `published = private.article_snapshot(a.*)` — the same
function the admin "เผยแพร่" button uses, so the snapshot shape can't drift. Re-running keeps the
URL and the original `published_at`.

Migration `supabase/migrations/0006_article_html.sql` added `content_html`, `seo_title`,
`seo_description` and taught the snapshot about them. Articles without HTML still render from
`body` (the old paragraph array).

## Phase 5 — scheduling

There is no "scheduled" status. **The `Publish date` is the schedule**: load every article
right away, and `getArticles()` in `src/lib/cms/content.ts` hides any article whose date is after
today in Asia/Bangkok — from `/news`, the home page, `/sitemap.xml`, related lists, and
`/news/<slug>` itself (404 until the day).

Two things bring it out on the day:

- `/api/cron/publish-scheduled` (Vercel Cron, `vercel.json`, 17:05 UTC = 00:05 Bangkok) calls
  `revalidatePath("/", "layout")`. It only runs when the Vercel project has a `CRON_SECRET`
  environment variable (set on the agency project since 2026-10-26).
- `export const revalidate = 3600` on `/`, `/news`, `/news/[slug]` and `/sitemap.xml` is the
  fallback: without the cron, an article appears within about an hour of the first visit after midnight.

Cross-links between articles in the same batch are handled at render: `linkLiveArticlesOnly`
turns a link to an article that isn't live yet into plain text, and the link comes back when
that article goes live. The validator warns about these but doesn't fail.

Same-day ordering: `date_iso` desc, then `published_at` desc. When loading several articles for
the same day, set `published_at` a minute apart so the intended lead article sorts first:

```sql
update public.articles a set published_at = timestamptz '<date> 09:00+07' - make_interval(mins => o.n)
from (values ('<slug-1>',1),('<slug-2>',2)) as o(slug,n) where a.slug = o.slug;
```

## Phase 6 — verify and deploy

```bash
npx tsc --noEmit && npx eslint src scripts/blog
npm run build      # the build reads Supabase: /news/[slug] should list exactly the live articles
grep -o '<h1' .next/server/app/news/<slug>.html | wc -l      # 1
grep -c FAQPage .next/server/app/news/<slug>.html            # 1
```

Do not verify in Chrome; the user prefers build/curl checks. To smoke-test routes:
`PORT=3457 npm start`, then curl a live slug (200), a future slug (404), and an old redirected
URL (308).

**Content-only changes need no deploy.** A new row or edit reaches the live site through the
hourly ISR or the nightly cron, and the admin "เผยแพร่" button revalidates immediately. **Code
changes** (CSS, converter output classes, page) need a production deploy.

Hosting moved on 2026-10-26. The original Vercel account (team `team_0Ltx…`) was blocked, so the
site now runs on project `bluerich-website-redesign` in team **agencybestsolutions-9690**
(`prj_aWQP3tzazDU26WdL3etHQqeAPPph`, alias bluerich-website-redesign-ten.vercel.app).
`.vercel/project.json` points there. Until a GitHub Login Connection is added to that account,
pushing `main` does **not** deploy. Deploy with:

```bash
git push origin main            # keep GitHub in step first
vercel deploy --prod --yes      # builds remotely from the working tree
```

Check `git status` first, because the CLI uploads uncommitted files too. Env vars on the project:
NEXT_PUBLIC_SUPABASE_URL / _ANON_KEY (non-sensitive — Vercel refuses NEXT_PUBLIC_* as sensitive),
RESEND_API_KEY, CRON_SECRET. ENQUIRY_TO_EMAIL is deliberately unset, so form mail goes to the
company email set in the admin.

The live site sits behind a Vercel firewall challenge for unknown clients, so plain curl
against www.blue-rich.com can return 403 `x-vercel-mitigated: challenge`. Smoke-test against
the `.vercel.app` alias instead.

## Removing or renaming articles

Old URLs Google has indexed get a permanent redirect in `next.config.ts` → `redirects()`. Point
each one at the new article on the same topic, or at `/news` when there is none. Reusing a slug
(as `ministerial-regulation-2567` did) needs no redirect.

`src/data/news.ts` no longer holds fallback articles. If Supabase is down, `/news` renders empty
rather than showing deleted content. `scripts/cms-verify.mts` no longer compares articles with
that file.

## Reference

- `references/batch-2026-10.md` — what the first batch did: Doc id, image mapping, placeholder
  rewrites, schedule, and the one-off import mechanism
