-- ═══════════════════════════════════════════════════════════════════════════
-- ปุ่ม "เผยแพร่" — คัดลอกฉบับร่างขึ้นเป็นสแนปช็อตที่เว็บจริงอ่าน
--
-- เป็น security invoker โดยตั้งใจ (ไม่ใช่ definer) เพราะสิทธิ์ครบอยู่แล้วในบทบาท
-- authenticated: execute private.*() ให้ไว้แล้ว และ update ตารางถูกคุมด้วย policy
-- *_cms ซึ่งอนุญาตเฉพาะคนที่มีแถวใน cms_users
-- ถ้าใช้ definer จะได้ผิวสัมผัสเพิ่มมาฟรีๆ โดยไม่จำเป็น (advisor 0029)
-- ส่วน is_cms_user() ที่เช็คไว้ต้นฟังก์ชันมีไว้ให้ error อ่านรู้เรื่องเท่านั้น
--
-- ผลงาน/FAQ อ้างด้วย id (ไม่มี slug) จึงรับ p_key เป็น text แล้วแปลงตามชนิด
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function public.cms_publish(p_entity text, p_key text)
returns jsonb
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_uid  uuid := (select auth.uid());
  v_snap jsonb;
begin
  if not private.is_cms_user() then
    raise exception 'ไม่มีสิทธิ์เผยแพร่เนื้อหา' using errcode = '42501';
  end if;

  if p_entity = 'product' then
    update public.products p
       set published = private.product_snapshot(p.*),
           published_at = now(), published_by = v_uid
     where p.slug = p_key
     returning p.published into v_snap;

  elsif p_entity = 'article' then
    update public.articles a
       set published = private.article_snapshot(a.*),
           published_at = now(), published_by = v_uid
     where a.slug = p_key
     returning a.published into v_snap;

  elsif p_entity = 'category' then
    update public.categories c
       set published = private.category_snapshot(c.*),
           published_at = now(), published_by = v_uid
     where c.slug = p_key
     returning c.published into v_snap;

  elsif p_entity = 'service' then
    update public.services s
       set published = private.service_snapshot(s.*),
           published_at = now(), published_by = v_uid
     where s.slug = p_key
     returning s.published into v_snap;

  elsif p_entity = 'project' then
    update public.projects p
       set published = private.project_snapshot(p.*),
           published_at = now(), published_by = v_uid
     where p.id = p_key::bigint
     returning p.published into v_snap;

  elsif p_entity = 'faq' then
    update public.faqs f
       set published = private.faq_snapshot(f.*),
           published_at = now(), published_by = v_uid
     where f.id = p_key::bigint
     returning f.published into v_snap;

  elsif p_entity = 'setting' then
    update public.site_settings s
       set published_value = s.draft_value,
           published_at = now(), published_by = v_uid
     where s.key = p_key
     returning s.published_value into v_snap;

  -- ข้อความในหน้าเว็บเผยแพร่ทั้งหน้าในครั้งเดียว เพราะลูกค้าแก้ทีละหน้า
  elsif p_entity = 'copy_page' then
    update public.site_copy c
       set published_value = c.draft_value,
           published_at = now(), published_by = v_uid
     where c.page = p_key;
    v_snap := to_jsonb(p_key);

  else
    raise exception 'ไม่รู้จักประเภทเนื้อหา: %', p_entity using errcode = '22023';
  end if;

  if v_snap is null then
    raise exception 'ไม่พบเนื้อหาที่จะเผยแพร่: % %', p_entity, p_key using errcode = 'P0002';
  end if;

  insert into public.content_revisions (entity, entity_key, snapshot, created_by)
  values (p_entity, p_key, v_snap, v_uid);

  return v_snap;
end;
$$;

revoke all on function public.cms_publish(text, text) from public, anon;
grant execute on function public.cms_publish(text, text) to authenticated;

-- ═══════════════════════════════════════════════════════════════════════════
-- เผยแพร่ทั้งชุดในครั้งเดียว — ใช้กับหน้ารายการที่กด "เผยแพร่ทั้งหมด"
-- เดินผ่าน cms_publish ทีละรายการ จึงได้ revision ครบเหมือนกดทีละอัน
-- ═══════════════════════════════════════════════════════════════════════════
create or replace function public.cms_publish_all(p_entity text)
returns int
language plpgsql
security invoker
set search_path = ''
as $$
declare
  v_key   text;
  v_count int := 0;
begin
  if not private.is_cms_user() then
    raise exception 'ไม่มีสิทธิ์เผยแพร่เนื้อหา' using errcode = '42501';
  end if;

  for v_key in
    select case p_entity
             when 'product'  then (select slug from public.products  where id = x.id)
             when 'article'  then (select slug from public.articles  where id = x.id)
             when 'category' then (select slug from public.categories where id = x.id)
             when 'service'  then (select slug from public.services  where id = x.id)
             else x.id::text
           end
      from (
        select id from public.products   where p_entity = 'product'  and has_draft
        union all select id from public.articles   where p_entity = 'article'  and has_draft
        union all select id from public.categories where p_entity = 'category' and has_draft
        union all select id from public.services   where p_entity = 'service'  and has_draft
        union all select id from public.projects   where p_entity = 'project'  and has_draft
        union all select id from public.faqs       where p_entity = 'faq'      and has_draft
      ) x
  loop
    perform public.cms_publish(p_entity, v_key);
    v_count := v_count + 1;
  end loop;

  return v_count;
end;
$$;

revoke all on function public.cms_publish_all(text) from public, anon;
grant execute on function public.cms_publish_all(text) to authenticated;
