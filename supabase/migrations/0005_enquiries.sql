-- ═══════════════════════════════════════════════════════════════════════════
-- บันทึกข้อความจากฟอร์มสอบถาม / ขอใบเสนอราคา
--
-- ทำไมต้องเก็บลงฐานข้อมูล ทั้งที่ส่งเป็นอีเมลอยู่แล้ว
--   1. ตัวคัดกรองสแปมทิ้งข้อความบางส่วนแบบเงียบๆ (ตอบผู้ส่งว่า "ส่งแล้ว" เพื่อไม่ให้
--      บอตรู้ตัว) ถ้าไม่มีที่เก็บ ข้อความของลูกค้าจริงที่โดนคัดผิดจะหายไปโดยไม่มีใครรู้
--      ตารางนี้ทำให้ย้อนดูได้ที่ /admin/enquiries
--   2. จำกัดจำนวนครั้งต่อ IP — Vercel ไม่มีหน่วยความจำร่วมระหว่าง function จึงต้อง
--      นับจากที่นี่
--   3. Vercel เก็บ log แค่ชั่วโมงเดียวในแพลนนี้ ตามรอยเมลที่มาถึงเมื่อวานไม่ได้เลย
--
-- เว็บหน้าบ้านไม่มีสิทธิ์แตะตารางโดยตรง (anon ถูก revoke ทั้งหมด) เขียนได้ทางเดียว
-- คือผ่านฟังก์ชัน enquiry_log() ซึ่งเป็นตัวตัดสินเรื่อง rate limit ด้วย
-- Supabase advisor 0028 จะเตือนว่า anon เรียก security definer ได้ — ตั้งใจ
-- เพราะฟอร์มนี้สาธารณะอยู่แล้ว และฟังก์ชันทำได้แค่บันทึกหนึ่งแถว อ่านอะไรไม่ได้
-- ═══════════════════════════════════════════════════════════════════════════

create table if not exists public.enquiries (
  id          bigint generated always as identity primary key,
  created_at  timestamptz not null default now(),
  source      text not null,                       -- หน้าติดต่อเรา / หน้าแลนดิ้ง
  subject     text not null,                       -- subject ของเมลที่ (จะ) ส่ง
  fields      jsonb not null,                      -- [{label, value}] ตามลำดับที่กรอก
  ip          inet,
  country     text,                                -- ISO 3166-1 alpha-2 จาก Vercel
  city        text,
  user_agent  text,
  referer     text,
  turnstile   text not null
              check (turnstile in ('ok', 'fail', 'unverified', 'skip')),
  flags       text[] not null default '{}',        -- ข้อสังเกต เช่น no-thai, link
  verdict     text not null check (verdict in ('delivered', 'dropped')),
  reason      text                                 -- เหตุที่ทิ้ง เช่น honeypot, rate-limit
);

comment on table public.enquiries is
  'ข้อความจากฟอร์มทุกฉบับ รวมที่ตัวกรองสแปมทิ้งไป — ดูได้ที่ /admin/enquiries';

-- นับจำนวนครั้งต่อ IP ในช่วงเวลาสั้นๆ และหน้าหลังบ้านเรียงตามเวลาล่าสุด
create index if not exists enquiries_ip_recent_idx on public.enquiries (ip, created_at desc);
create index if not exists enquiries_created_idx   on public.enquiries (created_at desc);

-- ── สิทธิ์ ──────────────────────────────────────────────────────────────────
alter table public.enquiries enable row level security;

drop policy if exists enquiries_cms on public.enquiries;
create policy enquiries_cms on public.enquiries
  for all to authenticated
  using (private.is_cms_user()) with check (private.is_cms_user());

revoke all on public.enquiries from anon, authenticated;
grant select, delete on public.enquiries to authenticated;

-- ── ทางเข้าเดียวของเว็บหน้าบ้าน ────────────────────────────────────────────
-- security definer เพราะ anon ไม่มีสิทธิ์อ่าน/เขียนตารางเอง ฟังก์ชันนี้จึงเป็น
-- ผิวสัมผัสทั้งหมดที่เปิดให้สาธารณะ: รับค่าที่เซิร์ฟเวอร์เว็บคัดกรองมาแล้ว
-- ตัดสินเรื่อง rate limit ต่อ IP เพิ่ม แล้วบันทึกหนึ่งแถว
--
-- ทำไมตัดสิน rate limit ในนี้ ไม่ใช่ที่เว็บ — ต้องนับกับข้อมูลชุดเดียวกันที่บันทึก
-- ถ้าแยกเป็นสองคำสั่ง (นับแล้วค่อยบันทึก) บอตที่ยิงพร้อมกันหลายคำขอจะลอดช่วง
-- ระหว่างสองคำสั่งนั้นได้
create or replace function public.enquiry_log(
  p_source     text,
  p_subject    text,
  p_fields     jsonb,
  p_ip         inet,
  p_country    text,
  p_city       text,
  p_user_agent text,
  p_referer    text,
  p_turnstile  text,
  p_flags      text[],
  p_verdict    text,
  p_reason     text
) returns jsonb
language plpgsql
security definer
set search_path = ''
as $$
declare
  c_window  constant interval := interval '10 minutes';
  c_max     constant int      := 5;       -- ครั้งต่อ IP ต่อช่วง — ลูกค้าจริงไม่ถึง
  c_keep    constant interval := interval '180 days';
  v_recent  int;
  v_verdict text := p_verdict;
  v_reason  text := p_reason;
  v_id      bigint;
begin
  -- ฟอร์มจริงส่งมาไม่กี่กิโลไบต์ ก้อนใหญ่กว่านี้ไม่ใช่ฟอร์ม
  if pg_column_size(p_fields) > 32768 then
    raise exception 'payload too large' using errcode = '22023';
  end if;

  if p_ip is not null then
    select count(*) into v_recent
      from public.enquiries e
     where e.ip = p_ip and e.created_at > now() - c_window;

    if v_recent >= c_max then
      v_verdict := 'dropped';
      v_reason  := 'rate-limit';
    end if;
  end if;

  insert into public.enquiries
    (source, subject, fields, ip, country, city, user_agent, referer,
     turnstile, flags, verdict, reason)
  values
    (left(p_source, 100), left(p_subject, 300), p_fields, p_ip,
     left(p_country, 2), left(p_city, 100), left(p_user_agent, 512), left(p_referer, 512),
     p_turnstile, (coalesce(p_flags, '{}'::text[]))[1:20], v_verdict, left(v_reason, 100))
  returning id into v_id;

  -- เก็บกวาดของเก่าไปในตัว จะได้ไม่ต้องตั้ง cron แยก (ใช้ enquiries_created_idx)
  delete from public.enquiries e where e.created_at < now() - c_keep;

  return jsonb_build_object('id', v_id, 'verdict', v_verdict, 'reason', v_reason);
end
$$;

revoke all on function public.enquiry_log(
  text, text, jsonb, inet, text, text, text, text, text, text[], text, text
) from public, authenticated;

grant execute on function public.enquiry_log(
  text, text, jsonb, inet, text, text, text, text, text, text[], text, text
) to anon;
