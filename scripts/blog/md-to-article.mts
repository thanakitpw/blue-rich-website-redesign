/**
 * แปลงต้นฉบับบทความ seo/blog/NN-*.md (แม่แบบเดียวกับทีมคอนเทนต์ของ hometools)
 * เป็นไฟล์คู่ที่ขึ้นเว็บได้ seo/published/<slug>.html + <slug>.json
 *
 *   node scripts/blog/md-to-article.mts seo/blog/*.md
 *
 * .md คือต้นฉบับเดียว จะแก้บทความให้แก้ที่ .md แล้วรันใหม่ ห้ามแก้ไฟล์ใน seo/published ตรง ๆ
 *
 * ต้นฉบับมีบล็อกคอมเมนต์ SEO META บนสุด (slug, คีย์เวิร์ด, ป้ายหมวด, วันขึ้นเว็บ, รูปปก,
 * Title tag, Meta desc) — อ่านเป็นข้อมูล ไม่ใช่เนื้อหา คอมเมนต์ท้ายไฟล์ (ลิงก์ภายใน,
 * FAQ schema) เป็นโน้ตให้คนอ่าน ตัดทิ้งทั้งหมด schema จริงหน้าเว็บสร้างจาก FAQ เอง
 *
 * HTML ที่ได้เป็นเนื้อหาล้วน ไม่มี <h1> (หน้าเว็บใส่จากชื่อบทความ) และใช้เฉพาะคลาสที่
 * .article-body ใน src/app/globals.css ประกาศไว้: lead, toc, toc-title, table-wrap, faq, faq-item
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";

const OUT_DIR = path.join(process.cwd(), "seo", "published");
const BRAND_SUFFIX = / \| Blue Rich$/;
const MONTHS = [
  "มกราคม", "กุมภาพันธ์", "มีนาคม", "เมษายน", "พฤษภาคม", "มิถุนายน",
  "กรกฎาคม", "สิงหาคม", "กันยายน", "ตุลาคม", "พฤศจิกายน", "ธันวาคม",
];

const thaiDate = (iso: string) => {
  const [y, m, d] = iso.split("-").map(Number);
  return `${d} ${MONTHS[m - 1]} ${y + 543}`;
};

const esc = (t: string) => t.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

function inline(t: string): string {
  return esc(t)
    .replace(/\[([^\]]+)\]\(((?:\/|https?:\/\/)[^)\s]+)\)/g, (_, text, href) =>
      href.startsWith("/")
        ? `<a href="${href}">${text}</a>`
        : `<a href="${href}" target="_blank" rel="noopener">${text}</a>`,
    )
    .replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>")
    .replace(/(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)/g, "<em>$1</em>");
}

/** อ่านบรรทัด "Key : value" ในบล็อก SEO META (ช่องว่างรอบ : ไม่แน่นอน) */
function readMeta(md: string): Record<string, string> {
  const block = md.match(/<!--([\s\S]*?)-->/)?.[1] ?? "";
  const meta: Record<string, string> = {};
  for (const line of block.split("\n")) {
    const m = line.match(/^([A-Za-z][A-Za-z ]*?)\s*(?:\(\d+\))?\s*:\s*(.+)$/);
    if (m) meta[m[1].trim()] = m[2].trim();
  }
  return meta;
}

const need = (meta: Record<string, string>, key: string, file: string) => {
  if (!meta[key]) throw new Error(`${file}: SEO META ไม่มีบรรทัด "${key}"`);
  return meta[key];
};

function toHtml(body: string): string {
  const lines = body.split("\n");
  const out: string[] = [];
  const toc: { id: string; text: string }[] = [];
  let i = 0;
  let section = 0;
  let inFaq = false;
  let leadDone = false;
  let tocAt = -1;

  const closeFaq = () => {
    if (inFaq) out.push("</div>");
    inFaq = false;
  };

  while (i < lines.length) {
    const l = lines[i].trimEnd();
    if (!l.trim() || l.trim() === "---") {
      i++;
      continue;
    }

    if (l.startsWith("## ")) {
      closeFaq();
      if (tocAt < 0) tocAt = out.length;
      const text = l.slice(3).replace(/\*\*/g, "").trim();
      const faq = text.startsWith("คำถามที่พบบ่อย");
      const id = faq ? "faq" : text.startsWith("ขั้นตอนถัดไป") ? "next-steps" : `section-${++section}`;
      const shown = faq ? "คำถามที่พบบ่อย" : text;
      toc.push({ id, text: shown });
      out.push(`<h2 id="${id}">${inline(shown)}</h2>`);
      if (faq) {
        out.push('<div class="faq">');
        inFaq = true;
      }
      i++;
      continue;
    }

    if (inFaq && /^\*\*Q:/.test(l)) {
      const q = l.replace(/^\*\*Q:\s*/, "").replace(/\*\*\s*$/, "");
      const answer: string[] = [];
      i++;
      while (i < lines.length && lines[i].trim() && !/^\*\*Q:/.test(lines[i]) && !lines[i].startsWith("## ")) {
        answer.push(lines[i].trim().replace(/^A:\s*/, ""));
        i++;
      }
      out.push(`<div class="faq-item"><h3>${inline(q)}</h3><p>${inline(answer.join(" "))}</p></div>`);
      continue;
    }

    if (l.startsWith("### ")) {
      out.push(`<h3>${inline(l.slice(4).replace(/\*\*/g, ""))}</h3>`);
      i++;
      continue;
    }

    if (l.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = lines[i].trim().replace(/^\||\|$/g, "").split("|").map((c) => c.trim());
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...rest] = rows;
      out.push(
        '<div class="table-wrap"><table><thead><tr>' +
          head.map((c) => `<th>${inline(c)}</th>`).join("") +
          "</tr></thead><tbody>" +
          rest.map((r) => "<tr>" + r.map((c) => `<td>${inline(c)}</td>`).join("") + "</tr>").join("") +
          "</tbody></table></div>",
      );
      continue;
    }

    const listKind = /^\d+\.\s/.test(l) ? "ol" : /^[-*]\s/.test(l) ? "ul" : null;
    if (listKind) {
      const items: string[] = [];
      const re = listKind === "ol" ? /^\d+\.\s+/ : /^[-*]\s+/;
      while (i < lines.length && re.test(lines[i].trim())) {
        items.push(`<li>${inline(lines[i].trim().replace(re, ""))}</li>`);
        i++;
      }
      out.push(`<${listKind}>${items.join("")}</${listKind}>`);
      continue;
    }

    if (l.startsWith(">")) {
      const quote: string[] = [];
      while (i < lines.length && lines[i].startsWith(">")) {
        quote.push(lines[i].replace(/^>\s?/, "").trim());
        i++;
      }
      out.push(`<blockquote><p>${inline(quote.filter(Boolean).join(" "))}</p></blockquote>`);
      continue;
    }

    const para: string[] = [];
    while (i < lines.length && lines[i].trim() && !/^(#{2,3} |\||>|---$|\d+\.\s|[-*]\s)/.test(lines[i].trim())) {
      para.push(lines[i].trim());
      i++;
    }
    const text = para.join(" ");
    if (!leadDone && /^\*\*[\s\S]+\*\*$/.test(text)) {
      out.push(`<p class="lead">${inline(text)}</p>`);
    } else {
      out.push(`<p>${inline(text)}</p>`);
    }
    leadDone = true;
  }
  closeFaq();

  if (toc.length >= 3 && tocAt >= 0) {
    out.splice(
      tocAt,
      0,
      '<nav class="toc" aria-label="สารบัญ"><p class="toc-title">ในบทความนี้</p><ol>' +
        toc.map((t) => `<li><a href="#${t.id}">${inline(t.text)}</a></li>`).join("") +
        "</ol></nav>",
    );
  }
  return out.join("\n") + "\n";
}

const files = process.argv.slice(2).filter((f) => f.endsWith(".md"));
if (!files.length) {
  console.error("ใช้: node scripts/blog/md-to-article.mts seo/blog/*.md");
  process.exit(1);
}
mkdirSync(OUT_DIR, { recursive: true });

for (const file of files) {
  const md = readFileSync(file, "utf8");
  const meta = readMeta(md);
  const body = md.replace(/<!--[\s\S]*?-->/g, "");
  const h1 = body.match(/^# (.+)$/m)?.[1].replace(/\*\*/g, "").trim();
  if (!h1) throw new Error(`${file}: ไม่มีหัวเรื่อง # บรรทัดแรก`);

  const slug = need(meta, "URL slug", file).replace(/^\/news\//, "").replace(/\/$/, "");
  const date = need(meta, "Publish date", file);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) throw new Error(`${file}: Publish date ต้องเป็น YYYY-MM-DD`);
  const cover = need(meta, "Cover image", file);
  const image = cover.split(/\s/)[0];
  const description = need(meta, "Meta desc", file);

  const html = toHtml(body.replace(/^# .+$/m, ""));
  const json = {
    slug,
    title: h1,
    seo_title: need(meta, "Title tag", file).replace(BRAND_SUFFIX, ""),
    seo_description: description,
    excerpt: description,
    tag: need(meta, "Tag", file),
    date,
    date_label: thaiDate(date),
    image,
    content_file: `${slug}.html`,
    _notes: {
      primary_kw: meta["Primary KW"] ?? "",
      secondary_kw: (meta["Secondary KW"] ?? "").split(/,\s*/).filter(Boolean),
      source_draft: path.relative(process.cwd(), file),
      cover_source: cover.match(/\((.+)\)/)?.[1] ?? "",
    },
  };

  writeFileSync(path.join(OUT_DIR, `${slug}.html`), html);
  writeFileSync(path.join(OUT_DIR, `${slug}.json`), JSON.stringify(json, null, 2) + "\n");
  console.log(`✓ ${path.basename(file)} → seo/published/${slug}.{html,json}  (${date})`);
}
