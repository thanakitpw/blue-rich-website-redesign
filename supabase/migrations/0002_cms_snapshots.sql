-- ═══════════════════════════════════════════════════════════════════════════
-- สแนปช็อต "ฉบับเผยแพร่" + ธง "แก้แล้วยังไม่เผยแพร่"
--
-- ทั้งตอน seed และตอนกดเผยแพร่ในหลังบ้านใช้ฟังก์ชันชุดนี้ตัวเดียวกัน สแนปช็อต
-- จึงตรงกับคอลัมน์เสมอ ไม่มีทางหลุดจากกันเพราะลืมแก้ที่ใดที่หนึ่ง
--
-- รูปร่างที่คืนออกมาต้องตรงกับ type ใน src/data/*.ts เป๊ะ เพื่อให้หน้าเว็บอ่านจาก
-- DB ได้โดยไม่ต้องแก้ตรรกะเดิมเลย ฟิลด์ที่เป็น optional ต้อง "ไม่โผล่" เมื่อไม่มีค่า
-- ไม่ใช่โผล่เป็น null (เช่น cardImage/downloads/table ที่โค้ดเช็คด้วย ?? และ &&)
--
-- jsonb_strip_nulls ตัด null ให้ แต่ไม่ยุ่งกับ [] และ false จึงต้องตัดสองอย่างนั้นเอง
-- ═══════════════════════════════════════════════════════════════════════════

create or replace function private.category_snapshot(c public.categories)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'slug', c.slug, 'name', c.name, 'short', c.short,
    'description', c.description, 'image', c.image
  );
$$;

create or replace function private.product_snapshot(p public.products)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'slug',         p.slug,
    'name',         p.name,
    'category',     p.category_slug,
    'tagline',      p.tagline,
    'cardSummary',  p.card_summary,
    'badges',       coalesce(p.badges,      '[]'::jsonb),
    'quickSpecs',   coalesce(p.quick_specs, '[]'::jsonb),
    'image',        p.image,
    'gallery',      coalesce(p.gallery,     '[]'::jsonb),
    'description',  coalesce(p.description, '[]'::jsonb),
    'specs',        coalesce(p.specs,       '[]'::jsonb),
    'faq',          coalesce(p.faq,         '[]'::jsonb),
    'related',      coalesce(p.related,     '[]'::jsonb),
    'downloadNote',   nullif(p.download_note,   ''),
    'specNote',       nullif(p.spec_note,       ''),
    'legalStandards', nullif(p.legal_standards, ''),
    'table',        p.spec_table
  ))
  || case when jsonb_array_length(coalesce(p.downloads, '[]'::jsonb)) > 0
          then jsonb_build_object('downloads', p.downloads) else '{}'::jsonb end
  || case when jsonb_array_length(coalesce(p.lists, '[]'::jsonb)) > 0
          then jsonb_build_object('lists', p.lists) else '{}'::jsonb end
  || case when p.installation then '{"installation": true}'::jsonb else '{}'::jsonb end
  || case when p.featured     then '{"featured": true}'::jsonb     else '{}'::jsonb end
  || case when p.best_seller  then '{"bestSeller": true}'::jsonb   else '{}'::jsonb end;
$$;

create or replace function private.article_snapshot(a public.articles)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'slug', a.slug, 'title', a.title, 'excerpt', a.excerpt, 'image', a.image,
    'date', to_char(a.date_iso, 'YYYY-MM-DD'), 'dateLabel', a.date_label,
    'tag', a.tag, 'body', coalesce(a.body, '[]'::jsonb)
  ));
$$;

create or replace function private.project_snapshot(p public.projects)
returns jsonb language sql immutable set search_path = '' as $$
  -- span เป็น optional — ไม่มีค่า = การ์ดขนาดปกติในกริด
  select jsonb_strip_nulls(jsonb_build_object(
    'image', p.image, 'title', p.title, 'scope', p.scope, 'span', p.span
  ));
$$;

create or replace function private.faq_snapshot(f public.faqs)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object('q', f.question, 'a', f.answer);
$$;

create or replace function private.service_snapshot(s public.services)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_build_object(
    'slug', s.slug, 'label', s.label, 'eyebrow', s.eyebrow, 'title', s.title,
    'lede', s.lede, 'image', s.image,
    'highlights', coalesce(s.highlights, '[]'::jsonb),
    'blocks',     coalesce(s.blocks,     '[]'::jsonb),
    'products',   coalesce(s.products,   '[]'::jsonb),
    'faq',        coalesce(s.faq,        '[]'::jsonb)
  );
$$;

revoke all on function private.category_snapshot(public.categories) from public, anon;
revoke all on function private.product_snapshot(public.products)    from public, anon;
revoke all on function private.article_snapshot(public.articles)    from public, anon;
revoke all on function private.project_snapshot(public.projects)    from public, anon;
revoke all on function private.faq_snapshot(public.faqs)            from public, anon;
revoke all on function private.service_snapshot(public.services)    from public, anon;

grant execute on function private.category_snapshot(public.categories) to authenticated;
grant execute on function private.product_snapshot(public.products)    to authenticated;
grant execute on function private.article_snapshot(public.articles)    to authenticated;
grant execute on function private.project_snapshot(public.projects)    to authenticated;
grant execute on function private.faq_snapshot(public.faqs)            to authenticated;
grant execute on function private.service_snapshot(public.services)    to authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- updated_at ให้ฐานข้อมูลดูแลเอง แอปจะลืมไม่ได้
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function private.touch_updated_at()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- ═══════════════════════════════════════════════════════════════════════════
-- has_draft — คำนวณด้วยฟังก์ชันสแนปช็อตตัวเดียวกับที่ปุ่มเผยแพร่ใช้
-- ความหมายของ "มีร่างค้าง" จึงตรงกับ "กดเผยแพร่แล้วเนื้อหาบนเว็บจะเปลี่ยน" เสมอ
-- ถ้าปล่อยให้ฝั่ง JS คำนวณเอง ตรรกะจะแตกเป็นสองที่แล้วมีวันหลุดจากกัน
--
-- แยกเป็นฟังก์ชันละตาราง ไม่รวมเป็นตัวเดียวที่ดู tg_table_name แล้วแคสต์ new
-- เพราะการแคสต์ row ข้ามชนิดตารางเป็นเรื่องที่ Postgres ไม่รับประกัน
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function private.mark_category_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.category_snapshot(new);
  return new;
end;
$$;

create or replace function private.mark_product_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.product_snapshot(new);
  return new;
end;
$$;

create or replace function private.mark_article_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.article_snapshot(new);
  return new;
end;
$$;

create or replace function private.mark_project_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.project_snapshot(new);
  return new;
end;
$$;

create or replace function private.mark_faq_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.faq_snapshot(new);
  return new;
end;
$$;

create or replace function private.mark_service_draft()
returns trigger language plpgsql set search_path = '' as $$
begin
  new.has_draft := new.published is distinct from private.service_snapshot(new);
  return new;
end;
$$;

drop trigger if exists categories_draft_flag on public.categories;
drop trigger if exists products_draft_flag   on public.products;
drop trigger if exists articles_draft_flag   on public.articles;
drop trigger if exists projects_draft_flag   on public.projects;
drop trigger if exists faqs_draft_flag       on public.faqs;
drop trigger if exists services_draft_flag   on public.services;

create trigger categories_draft_flag before insert or update on public.categories
  for each row execute function private.mark_category_draft();
create trigger products_draft_flag   before insert or update on public.products
  for each row execute function private.mark_product_draft();
create trigger articles_draft_flag   before insert or update on public.articles
  for each row execute function private.mark_article_draft();
create trigger projects_draft_flag   before insert or update on public.projects
  for each row execute function private.mark_project_draft();
create trigger faqs_draft_flag       before insert or update on public.faqs
  for each row execute function private.mark_faq_draft();
create trigger services_draft_flag   before insert or update on public.services
  for each row execute function private.mark_service_draft();

-- ── updated_at ──────────────────────────────────────────────────────────────
drop trigger if exists categories_touch    on public.categories;
drop trigger if exists products_touch      on public.products;
drop trigger if exists articles_touch      on public.articles;
drop trigger if exists projects_touch      on public.projects;
drop trigger if exists faqs_touch          on public.faqs;
drop trigger if exists services_touch      on public.services;
drop trigger if exists site_copy_touch     on public.site_copy;
drop trigger if exists site_settings_touch on public.site_settings;

create trigger categories_touch    before update on public.categories
  for each row execute function private.touch_updated_at();
create trigger products_touch      before update on public.products
  for each row execute function private.touch_updated_at();
create trigger articles_touch      before update on public.articles
  for each row execute function private.touch_updated_at();
create trigger projects_touch      before update on public.projects
  for each row execute function private.touch_updated_at();
create trigger faqs_touch          before update on public.faqs
  for each row execute function private.touch_updated_at();
create trigger services_touch      before update on public.services
  for each row execute function private.touch_updated_at();
create trigger site_copy_touch     before update on public.site_copy
  for each row execute function private.touch_updated_at();
create trigger site_settings_touch before update on public.site_settings
  for each row execute function private.touch_updated_at();

-- anon ไม่ต้องรู้ว่ามีร่างค้างไหม จึงไม่ให้สิทธิ์คอลัมน์นี้ (ดู 0003)
create index if not exists categories_draft_idx on public.categories (has_draft) where has_draft;
create index if not exists products_draft_idx   on public.products   (has_draft) where has_draft;
create index if not exists articles_draft_idx   on public.articles   (has_draft) where has_draft;
create index if not exists projects_draft_idx   on public.projects   (has_draft) where has_draft;
create index if not exists faqs_draft_idx       on public.faqs       (has_draft) where has_draft;
create index if not exists services_draft_idx   on public.services   (has_draft) where has_draft;
