-- ═══════════════════════════════════════════════════════════════════════════
-- ความปลอดภัย — RLS + สิทธิ์ระดับคอลัมน์
--
-- สองอย่างนี้ตอบคนละคำถามและต้องมาคู่กัน
--   RLS   ตอบว่า "เห็นแถวไหน"
--   GRANT ตอบว่า "แตะตาราง/คอลัมน์ไหนได้ตั้งแต่แรก"
-- ถ้ามีแค่ RLS ฉบับร่างจะหลุดออกเว็บ เพราะ anon ยังอ่านคอลัมน์ร่างของแถวที่
-- เผยแพร่แล้วได้อยู่
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.cms_users         enable row level security;
alter table public.categories        enable row level security;
alter table public.products          enable row level security;
alter table public.articles          enable row level security;
alter table public.projects          enable row level security;
alter table public.faqs              enable row level security;
alter table public.services          enable row level security;
alter table public.site_copy         enable row level security;
alter table public.site_settings     enable row level security;
alter table public.media             enable row level security;
alter table public.content_revisions enable row level security;

-- ทีมงานเห็นเฉพาะแถวของตัวเอง (ยังไม่มีหน้าจัดการผู้ใช้ จึงไม่ต้องเปิดให้เห็นกันเอง)
drop policy if exists cms_users_self on public.cms_users;
create policy cms_users_self on public.cms_users
  for select to authenticated using (id = (select auth.uid()));

-- ── ทีมงานแก้เนื้อหาได้ทุกอย่าง ────────────────────────────────────────────
-- is_cms_user() เป็น security definer + stable → Postgres เรียกครั้งเดียวต่อคำสั่ง
-- ไม่ใช่ต่อแถว (ดู references/security-rls-performance.md)
do $do$
declare t text;
begin
  foreach t in array array[
    'categories','products','articles','projects','faqs','services',
    'site_copy','site_settings','media','content_revisions'
  ] loop
    execute format('drop policy if exists %I on public.%I', t || '_cms', t);
    execute format(
      'create policy %I on public.%I for all to authenticated
         using (private.is_cms_user()) with check (private.is_cms_user())',
      t || '_cms', t);
  end loop;
end
$do$;

-- ── เว็บหน้าบ้าน (anon) อ่านได้เฉพาะที่เผยแพร่แล้ว ─────────────────────────
drop policy if exists categories_published_read on public.categories;
create policy categories_published_read on public.categories
  for select to anon using (published is not null);

drop policy if exists products_published_read on public.products;
create policy products_published_read on public.products
  for select to anon using (published is not null);

drop policy if exists articles_published_read on public.articles;
create policy articles_published_read on public.articles
  for select to anon using (published is not null);

drop policy if exists projects_published_read on public.projects;
create policy projects_published_read on public.projects
  for select to anon using (published is not null);

drop policy if exists faqs_published_read on public.faqs;
create policy faqs_published_read on public.faqs
  for select to anon using (published is not null);

drop policy if exists services_published_read on public.services;
create policy services_published_read on public.services
  for select to anon using (published is not null);

drop policy if exists site_copy_published_read on public.site_copy;
create policy site_copy_published_read on public.site_copy
  for select to anon using (published_value is not null);

drop policy if exists site_settings_published_read on public.site_settings;
create policy site_settings_published_read on public.site_settings
  for select to anon using (published_value is not null);

-- ═══════════════════════════════════════════════════════════════════════════
-- สิทธิ์ระดับตาราง/คอลัมน์
--
-- Supabase แจก default privileges ให้ anon/authenticated ตอนสร้างตารางใน public
-- จึงต้อง revoke ทิ้งก่อน แล้วให้ใหม่เฉพาะที่ตั้งใจ
-- ═══════════════════════════════════════════════════════════════════════════
grant usage on schema public to anon, authenticated;

grant select, insert, update, delete on public.cms_users         to authenticated;
grant select, insert, update, delete on public.categories        to authenticated;
grant select, insert, update, delete on public.products          to authenticated;
grant select, insert, update, delete on public.articles          to authenticated;
grant select, insert, update, delete on public.projects          to authenticated;
grant select, insert, update, delete on public.faqs              to authenticated;
grant select, insert, update, delete on public.services          to authenticated;
grant select, insert, update, delete on public.site_copy         to authenticated;
grant select, insert, update, delete on public.site_settings     to authenticated;
grant select, insert, update, delete on public.media             to authenticated;
grant select, insert, update, delete on public.content_revisions to authenticated;

revoke all on public.cms_users         from anon;
revoke all on public.categories        from anon;
revoke all on public.products          from anon;
revoke all on public.articles          from anon;
revoke all on public.projects          from anon;
revoke all on public.faqs              from anon;
revoke all on public.services          from anon;
revoke all on public.site_copy         from anon;
revoke all on public.site_settings     from anon;
revoke all on public.media             from anon;
revoke all on public.content_revisions from anon;

/* anon ได้เฉพาะคอลัมน์ที่เป็นของสาธารณะอยู่แล้ว
   คอลัมน์ร่าง (name, description, draft_value, has_draft ฯลฯ) ติด permission
   denied ตั้งแต่ระดับคอลัมน์ ต่อให้ยิงตรงเข้า REST API ก็ไม่เห็น */
grant select (id, slug, sort_order, published, published_at) on public.categories to anon;
grant select (id, slug, sort_order, published, published_at) on public.products   to anon;
grant select (id, slug, date_iso, published, published_at)   on public.articles   to anon;
grant select (id, sort_order, published, published_at)       on public.projects   to anon;
grant select (id, page, sort_order, published, published_at) on public.faqs       to anon;
grant select (id, slug, sort_order, published, published_at) on public.services   to anon;
grant select (page, key, published_value, source_hash)       on public.site_copy  to anon;
grant select (key, published_value)                          on public.site_settings to anon;

-- ── Storage bucket สำหรับรูปที่อัปโหลดจากหลังบ้าน ──────────────────────────
insert into storage.buckets (id, name, public)
values ('media', 'media', true)
on conflict (id) do nothing;

drop policy if exists br_media_public_read on storage.objects;
create policy br_media_public_read on storage.objects
  for select to public using (bucket_id = 'media');

drop policy if exists br_media_cms_write on storage.objects;
create policy br_media_cms_write on storage.objects
  for insert to authenticated with check (bucket_id = 'media' and private.is_cms_user());

drop policy if exists br_media_cms_update on storage.objects;
create policy br_media_cms_update on storage.objects
  for update to authenticated using (bucket_id = 'media' and private.is_cms_user());

drop policy if exists br_media_cms_delete on storage.objects;
create policy br_media_cms_delete on storage.objects
  for delete to authenticated using (bucket_id = 'media' and private.is_cms_user());
