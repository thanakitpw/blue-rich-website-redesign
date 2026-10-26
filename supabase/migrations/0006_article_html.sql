-- บทความ SEO ชุดใหม่มีหัวข้อ ตาราง และ FAQ ซึ่ง body (อาร์เรย์ย่อหน้า) เก็บไม่ได้
-- จึงเพิ่มคอลัมน์ HTML ของเนื้อหา กับ title/description สำหรับ <head> แยกจากชื่อบนหน้า
--
-- ที่มาของค่า: seo/published/<slug>.{html,json} ที่ scripts/blog/md-to-article.mts สร้าง
-- จาก seo/blog/*.md แล้ว scripts/blog/publish-sql.mts เขียนเข้าตาราง (ดูสกิล bluerich-blog-publish)
-- บทความเก่าที่ไม่มี HTML ยังใช้ body ได้เหมือนเดิม — หน้าเว็บเลือกเองว่ามี html หรือไม่
--
-- anon ไม่ได้สิทธิ์คอลัมน์ใหม่ (grant ระดับคอลัมน์ใน 0003) อ่านผ่านสแนปช็อต published เท่านั้น

alter table public.articles
  add column if not exists content_html    text not null default '',
  add column if not exists seo_title       text not null default '',
  add column if not exists seo_description text not null default '';

-- nullif + jsonb_strip_nulls: บทความที่ไม่มีค่าจะไม่มีคีย์นั้นในสแนปช็อตเลย
-- รูปร่างของบทความเก่าจึงไม่เปลี่ยน และ has_draft ของแถวเดิมไม่ถูกตั้งขึ้นมาเอง
create or replace function private.article_snapshot(a public.articles)
returns jsonb language sql immutable set search_path = '' as $$
  select jsonb_strip_nulls(jsonb_build_object(
    'slug', a.slug, 'title', a.title, 'excerpt', a.excerpt, 'image', a.image,
    'date', to_char(a.date_iso, 'YYYY-MM-DD'), 'dateLabel', a.date_label,
    'tag', a.tag, 'body', coalesce(a.body, '[]'::jsonb),
    'html', nullif(a.content_html, ''),
    'seoTitle', nullif(a.seo_title, ''),
    'seoDescription', nullif(a.seo_description, '')
  ));
$$;
