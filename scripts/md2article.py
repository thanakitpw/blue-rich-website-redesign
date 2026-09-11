#!/usr/bin/env python3
"""แปลงบทความ .md ใน content/articles/ เป็น HTML

ใช้:
  python3 scripts/md2article.py content/articles/NN-slug.md          # HTML ของเว็บ → content/articles/html/<slug>.html
  python3 scripts/md2article.py content/articles/NN-slug.md --doc    # HTML ธรรมดาสำหรับ Google Doc → stdout

.md คือต้นฉบับเดียว แก้บทความให้แก้ที่ .md แล้วรันสคริปต์นี้ใหม่ ห้ามแก้ HTML หรือ Doc ตรง ๆ

โหมดเว็บออก HTML เชิงความหมายล้วน (h2/h3/p/table/ol/ul/blockquote/a) ไม่มี inline style
เพราะหน้า /news/[slug] ของเว็บนี้ใช้ Tailwind — สไตล์ของบทความอยู่ที่ class `.article-body`
ใน src/app/globals.css (เพิ่มตอนเปิดใช้คอลัมน์ content_html ในตาราง articles)
ตัดส่วน # (H1) ออก เพราะหน้าเว็บใส่ h1 จากชื่อบทความในฐานข้อมูลอยู่แล้ว

โหมด --doc ใส่เฉพาะ ชื่อเรื่อง + บรรทัด "คีย์เวิร์ด:" + เนื้อหา ไม่มีสเปกรูป ลิงก์ หรือโน้ตภายใน
(ลูกค้ารีวิวเนื้อหาอย่างเดียว) ลิงก์ในเนื้อหาถูกถอดเหลือข้อความ

รองรับ: ย่อหน้า, ## / ###, **คำถาม** + คำตอบในส่วนคำถามที่พบบ่อย, รายการ 1. และ -,
ตาราง |, > callout, ลิงก์ [x](/path), **หนา**, *เอียง*
"""
import io
import pathlib
import re
import sys

ROOT = pathlib.Path(__file__).resolve().parent.parent


def esc(t):
    return t.replace("&", "&amp;").replace("<", "&lt;").replace(">", "&gt;")


def inline(t):
    t = esc(t)
    t = re.sub(r"\[([^\]]+)\]\((/[^)]+)\)", r'<a href="\2">\1</a>', t)
    t = re.sub(r"\*\*(.+?)\*\*", r"<strong>\1</strong>", t)
    t = re.sub(r"(?<!\*)\*(?!\*)(.+?)(?<!\*)\*(?!\*)", r"<em>\1</em>", t)
    return t


def split(md):
    if md.startswith("---"):
        end = md.find("\n---", 3)
        if end != -1:
            return md[:end], md[end + 4 :]
    return "", md


def blocks(body, faq_question_tag="h3", faq_wrap=None):
    """แปลงเนื้อหาเป็นรายการ HTML block — ใช้ร่วมกันทั้งสองโหมด"""
    lines = body.split("\n")
    out, i, in_faq = [], 0, False
    while i < len(lines):
        l = lines[i].rstrip()
        if not l.strip():
            i += 1
            continue
        if l.startswith("# "):
            out.append(("h1", esc(l[2:].strip())))
            i += 1
            continue
        if l.startswith("## "):
            t = l[3:].strip()
            in_faq = t.startswith("คำถามที่พบบ่อย")
            out.append(("html", f"<h2>{inline(t)}</h2>"))
            i += 1
            continue
        if l.startswith("### "):
            out.append(("html", f"<h3>{inline(l[4:].strip())}</h3>"))
            i += 1
            continue
        if l.startswith("|"):
            rows = []
            while i < len(lines) and lines[i].startswith("|"):
                rows.append([c.strip() for c in lines[i].strip().strip("|").split("|")])
                i += 1
            rows = [r for r in rows if not all(re.match(r"^:?-+:?$", c) for c in r)]
            head = "".join(f"<th>{inline(c)}</th>" for c in rows[0])
            data = "".join("<tr>" + "".join(f"<td>{inline(c)}</td>" for c in r) + "</tr>" for r in rows[1:])
            out.append(("html", f"<table><thead><tr>{head}</tr></thead><tbody>{data}</tbody></table>"))
            continue
        if l.startswith(">"):
            q = []
            while i < len(lines) and lines[i].startswith(">"):
                q.append(lines[i].lstrip("> ").strip())
                i += 1
            out.append(("html", f"<blockquote><p>{inline(' '.join(q))}</p></blockquote>"))
            continue
        m = re.match(r"^(\d+)\.\s+(.*)", l)
        if m or l.startswith("- "):
            ordered = bool(m)
            items = []
            while i < len(lines):
                mm = re.match(r"^(\d+)\.\s+(.*)", lines[i]) if ordered else re.match(r"^-\s+(.*)", lines[i])
                if not mm:
                    break
                items.append(mm.group(2) if ordered else mm.group(1))
                i += 1
            tag = "ol" if ordered else "ul"
            out.append(("html", f"<{tag}>" + "".join(f"<li>{inline(x)}</li>" for x in items) + f"</{tag}>"))
            continue
        # FAQ: บรรทัด **คำถาม** ตามด้วยย่อหน้าคำตอบ
        if in_faq and re.match(r"^\*\*[^*]+\*\*\s*$", l):
            q = esc(l.strip("*").strip())
            i += 1
            ans = []
            while i < len(lines) and lines[i].strip() and not lines[i].startswith(("**", "#")):
                ans.append(lines[i].strip())
                i += 1
            a = f"<p>{inline(' '.join(ans))}</p>" if ans else ""
            if faq_wrap:
                out.append(("html", faq_wrap(q, a)))
            else:
                out.append(("html", f"<{faq_question_tag}>{q}</{faq_question_tag}>{a}"))
            continue
        para = []
        while (
            i < len(lines)
            and lines[i].strip()
            and not lines[i].startswith(("#", "|", ">", "- "))
            and not re.match(r"^\d+\.\s", lines[i])
        ):
            para.append(lines[i].strip())
            i += 1
        out.append(("html", f"<p>{inline(' '.join(para))}</p>"))
    return out


def convert_web(md):
    """HTML fragment สำหรับคอลัมน์ content_html — ไม่มี h1, FAQ เป็น details/summary"""
    _, body = split(md)
    faq = lambda q, a: f"<details><summary>{q}</summary>{a}</details>"
    parts = [h for kind, h in blocks(body, faq_wrap=faq) if kind == "html"]
    return "\n".join(parts) + "\n"


def convert_doc(md):
    """HTML ธรรมดาสำหรับอัปเป็น Google Doc: ชื่อเรื่อง + คีย์เวิร์ด + เนื้อหา ไม่มีลิงก์"""
    fm, body = split(md)
    kw = re.search(r'^keyword_หลัก:\s*"?([^"\n]+)"?', fm, re.M)
    out = []
    for kind, h in blocks(body, faq_question_tag="h3"):
        if kind == "h1":
            out.append(f"<h1>{h}</h1>")
            if kw:
                out.append(f"<p><b>คีย์เวิร์ด:</b> {esc(kw.group(1).strip())}</p>")
        else:
            out.append(h)
    html = "\n".join(out)
    html = re.sub(r'<a href="[^"]*">(.*?)</a>', r"\1", html)
    html = html.replace("<table>", '<table border="1" cellpadding="6" cellspacing="0">')
    return '<html><head><meta charset="utf-8"></head><body>\n' + html + "\n</body></html>\n"


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if not args:
        sys.exit(__doc__)
    src = pathlib.Path(args[0])
    md = io.open(src, encoding="utf-8").read()
    if "--doc" in sys.argv:
        sys.stdout.write(convert_doc(md))
        return
    m = re.search(r"^slug:\s*(\S+)", md, re.M)
    if not m:
        sys.exit("ไม่พบ slug ใน frontmatter")
    dst = ROOT / "content" / "articles" / "html" / f"{m.group(1)}.html"
    dst.parent.mkdir(parents=True, exist_ok=True)
    html = convert_web(md)
    io.open(dst, "w", encoding="utf-8").write(html)
    print(f"{src.name} -> {dst.relative_to(ROOT)}  ({len(html):,} bytes)")


if __name__ == "__main__":
    main()
