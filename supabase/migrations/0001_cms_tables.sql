-- ═══════════════════════════════════════════════════════════════════════════
-- ระบบหลังบ้าน Blue Rich Material Products — CMS
--
-- เนื้อหาของเว็บนี้ "มีโครงสร้างอยู่แล้ว" ในไฟล์ src/data/*.ts จึงย้ายขึ้นเป็น
-- ตารางจริงได้ตรงๆ ผลคือลูกค้าเพิ่ม/ลบสินค้า บทความ ผลงาน และ FAQ ได้เอง
-- ไม่ใช่แค่แก้ข้อความที่มีอยู่
--
-- โครงร่างเดียวกันทุกตารางเนื้อหา:
--   คอลัมน์ปกติ = ฉบับร่าง (สิ่งที่กำลังแก้อยู่ในหลังบ้าน)
--   published   = สแนปช็อต jsonb ของตอนกดเผยแพร่ครั้งล่าสุด = สิ่งที่เว็บจริงอ่าน
-- แก้แล้วเว็บยังไม่ขยับจนกว่าจะกดเผยแพร่ และถ้าแก้ค้างไว้ครึ่งทางก็ไม่หลุดออกเว็บ
--
-- เว็บหน้าบ้านโหลดสินค้าทั้งชุดเข้าหน่วยความจำแล้วกรองด้วย JS อยู่แล้ว
-- (productsByCategory, related, featured ฯลฯ) การอ่านสแนปช็อต jsonb ทั้งก้อน
-- จึงพอดีกับของเดิม ไม่ต้องแก้ตรรกะหน้าเว็บ
-- ═══════════════════════════════════════════════════════════════════════════

create extension if not exists pgcrypto;

-- schema private ไว้เก็บฟังก์ชันที่ไม่ควรถูกเรียกผ่าน REST
-- (ฟังก์ชัน security definer ที่อยู่ใน public จะยิงผ่าน /rest/v1/rpc/ ได้)
create schema if not exists private;
grant usage on schema private to authenticated;

-- ── ผู้ใช้หลังบ้าน ─────────────────────────────────────────────────────────
-- ล็อกอิน Supabase ผ่านอย่างเดียวยังไม่พอ ต้องมีแถวที่นี่ด้วยถึงจะเข้าหลังบ้านได้
-- กันกรณีเผลอเปิด public signup แล้วมีคนสมัครเข้ามาเอง
create table if not exists public.cms_users (
  id           uuid primary key references auth.users(id) on delete cascade,
  email        text not null,
  display_name text,
  role         text not null default 'editor' check (role in ('editor', 'admin')),
  created_at   timestamptz not null default now()
);

-- stable = เรียกซ้ำในคำสั่งเดียวกันได้ผลเดิม Postgres จะไม่เรียกซ้ำทุกแถว
create or replace function private.is_cms_user()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.cms_users u where u.id = (select auth.uid())
  );
$$;

revoke all on function private.is_cms_user() from public, anon;
grant execute on function private.is_cms_user() to authenticated;

-- ── หมวดหมู่สินค้า ─────────────────────────────────────────────────────────
create table if not exists public.categories (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  name         text not null,
  short        text not null default '',   -- ชื่ออังกฤษใต้ชื่อไทย เช่น "Intumescent Paint"
  description  text not null default '',
  image        text not null default '',
  sort_order   int  not null default 0,
  published    jsonb,
  has_draft    boolean not null default false,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users(id) on delete set null
);

-- ── สินค้า ─────────────────────────────────────────────────────────────────
-- badges/quickSpecs/gallery/downloads/description/lists/specs/table/faq/related
-- รูปร่างไม่ตายตัวและ "แก้ทั้งก้อนพร้อมกันเสมอ" ไม่เคยถูก query ทีละชิ้น
-- และลำดับมีความหมาย → เก็บเป็น jsonb ตรงๆ ดีกว่าแตกเป็นตารางลูกสิบตาราง
create table if not exists public.products (
  id             bigint generated always as identity primary key,
  slug           text not null unique,
  name           text not null,
  category_slug  text not null references public.categories(slug) on update cascade,
  tagline        text not null default '',   -- คำโปรยยาวใต้ชื่อสินค้า
  card_summary   text not null default '',   -- บรรทัดเดียวบนการ์ดในหน้ารายการ
  badges         jsonb not null default '[]'::jsonb,
  quick_specs    jsonb not null default '[]'::jsonb,
  image          text not null default '',
  gallery        jsonb not null default '[]'::jsonb,
  downloads      jsonb not null default '[]'::jsonb,
  download_note  text,
  description    jsonb not null default '[]'::jsonb,
  lists          jsonb not null default '[]'::jsonb,
  specs          jsonb not null default '[]'::jsonb,
  spec_note      text,
  spec_table     jsonb,                      -- ชื่อฟิลด์ฝั่ง TS คือ "table"
  installation   boolean not null default false,  -- แสดงบล็อกขั้นตอนทา 4 ขั้นที่ใช้ร่วมกัน
  legal_standards text,                      -- แสดงบล็อกข้อกฎหมาย ค่าคือมาตรฐานที่อ้างถึง
  faq            jsonb not null default '[]'::jsonb,
  related        jsonb not null default '[]'::jsonb,
  featured       boolean not null default false,
  best_seller    boolean not null default false,
  sort_order     int  not null default 0,
  published      jsonb,
  has_draft      boolean not null default false,
  published_at   timestamptz,
  published_by   uuid references auth.users(id) on delete set null,
  updated_at     timestamptz not null default now(),
  updated_by     uuid references auth.users(id) on delete set null
);

-- FK ไม่ถูก index อัตโนมัติ ต้องสร้างเอง ไม่งั้นการลบหมวดหมู่จะสแกนทั้งตาราง
create index if not exists products_category_idx on public.products (category_slug);
create index if not exists products_sort_idx     on public.products (sort_order, id);

-- ── บทความ ─────────────────────────────────────────────────────────────────
create table if not exists public.articles (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  title        text not null,
  excerpt      text not null default '',
  image        text not null default '',
  date_iso     date,                        -- ใช้เรียงลำดับและใส่ใน schema.org
  date_label   text not null default '',    -- วันที่ไทยที่พิมพ์เอง "12 มิถุนายน 2567"
  tag          text not null default '',
  body         jsonb not null default '[]'::jsonb,
  published    jsonb,
  has_draft    boolean not null default false,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users(id) on delete set null
);

create index if not exists articles_date_idx on public.articles (date_iso desc nulls last);

-- ── ผลงาน (แกลเลอรีหน้า /projects และแถบผลงานหน้าแรก) ──────────────────────
create table if not exists public.projects (
  id           bigint generated always as identity primary key,
  image        text not null,
  title        text not null default '',
  scope        text not null default '',
  span         text check (span in ('wide', 'tall')),  -- ช่องในกริด masonry
  sort_order   int  not null default 0,
  published    jsonb,
  has_draft    boolean not null default false,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users(id) on delete set null
);

create index if not exists projects_sort_idx on public.projects (sort_order, id);

-- ── คำถามที่พบบ่อย ─────────────────────────────────────────────────────────
-- แยกด้วย page เผื่อหน้าอื่นอยากมีชุดของตัวเอง ตอนนี้ใช้ 'home' อย่างเดียว
create table if not exists public.faqs (
  id           bigint generated always as identity primary key,
  page         text not null default 'home',
  question     text not null,
  answer       text not null default '',
  sort_order   int  not null default 0,
  published    jsonb,
  has_draft    boolean not null default false,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users(id) on delete set null
);

create index if not exists faqs_page_idx on public.faqs (page, sort_order, id);

-- ── หน้าบริการรับรองสีกันไฟ (/fireproofing/[slug]) ─────────────────────────
create table if not exists public.services (
  id           bigint generated always as identity primary key,
  slug         text not null unique,
  label        text not null,               -- ชื่อสั้นที่ใช้ในเมนูและการ์ด
  eyebrow      text not null default '',
  title        text not null default '',
  lede         text not null default '',
  image        text not null default '',
  highlights   jsonb not null default '[]'::jsonb,
  blocks       jsonb not null default '[]'::jsonb,
  products     jsonb not null default '[]'::jsonb,  -- slug สินค้าที่ใช้ในงานนี้
  faq          jsonb not null default '[]'::jsonb,
  sort_order   int  not null default 0,
  published    jsonb,
  has_draft    boolean not null default false,
  published_at timestamptz,
  published_by uuid references auth.users(id) on delete set null,
  updated_at   timestamptz not null default now(),
  updated_by   uuid references auth.users(id) on delete set null
);

-- ── ข้อความประจำหน้า ───────────────────────────────────────────────────────
-- หน้า landing ทั้ง 6 หน้าเก็บข้อความไว้ในไฟล์ src/data/*-lp.ts เป็นก้อน object
-- อยู่แล้ว จึงไม่ต้องรื้อ JSX — อ้างอิงข้อความแต่ละจุดด้วย "เส้นทางในก้อนนั้น"
--   page = 'lp-neocoat' · key = 'hero.title' · key = 'faqs.2.a'
-- ค่าตั้งต้นอยู่ในโค้ด ฐานข้อมูลทับได้ ถ้าต่อ DB ไม่ติดก็ยังแสดงค่าตั้งต้นตามปกติ
--
-- source_hash = hash ของข้อความตั้งต้น ณ ตอนที่ลูกค้ากดแก้
-- ถ้านักพัฒนาแก้ข้อความในโค้ดทีหลังจนไม่ตรงกัน ระบบจะไม่ทับ แต่แสดงค่าจากโค้ดแทน
-- ปลอดภัยกว่าเอาข้อความไปแปะผิดจุด
create table if not exists public.site_copy (
  page            text not null,
  key             text not null,
  draft_value     text,
  published_value text,
  source_hash     text,
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users(id) on delete set null,
  published_at    timestamptz,
  published_by    uuid references auth.users(id) on delete set null,
  primary key (page, key)
);

-- ใช้นับ "มีร่างค้างกี่จุดในหน้าไหน" บนหน้ารายการ
create index if not exists site_copy_dirty_idx on public.site_copy (page)
  where draft_value is not null and draft_value is distinct from published_value;

-- ── ค่าตั้งค่าเว็บไซต์ ─────────────────────────────────────────────────────
-- company (ชื่อ ที่อยู่ เบอร์ อีเมล LINE เวลาทำการ) · nav (เมนู 9 รายการ)
-- standards · stats · images (รูปที่ถูกเปลี่ยนจากหลังบ้าน)
-- เก็บเป็น jsonb ต่อ key เพราะแต่ละอันรูปร่างต่างกันสิ้นเชิง
create table if not exists public.site_settings (
  key             text primary key,
  draft_value     jsonb,
  published_value jsonb,
  updated_at      timestamptz not null default now(),
  updated_by      uuid references auth.users(id) on delete set null,
  published_at    timestamptz,
  published_by    uuid references auth.users(id) on delete set null
);

-- ── คลังรูปภาพ ─────────────────────────────────────────────────────────────
create table if not exists public.media (
  id         uuid primary key default gen_random_uuid(),
  path       text not null unique,          -- path ใน storage bucket "media"
  url        text not null,
  filename   text not null,
  mime       text,
  bytes      bigint,
  width      int,
  height     int,
  alt        text,
  folder     text not null default 'ทั่วไป',
  created_at timestamptz not null default now(),
  created_by uuid references auth.users(id) on delete set null
);

create index if not exists media_created_idx on public.media (created_at desc);
create index if not exists media_folder_idx  on public.media (folder);

-- ── ประวัติการเผยแพร่ ──────────────────────────────────────────────────────
-- เก็บสแนปช็อตทุกครั้งที่กดเผยแพร่ เพื่อให้ย้อนดูได้ว่าเคยเผยแพร่อะไรไปเมื่อไหร่
create table if not exists public.content_revisions (
  id          bigint generated always as identity primary key,
  entity      text not null,   -- product | article | project | faq | service | category | copy_page | setting
  entity_key  text not null,   -- slug, id หรือ page/key
  snapshot    jsonb not null,
  created_at  timestamptz not null default now(),
  created_by  uuid references auth.users(id) on delete set null
);

create index if not exists content_revisions_entity_idx
  on public.content_revisions (entity, entity_key, created_at desc);
