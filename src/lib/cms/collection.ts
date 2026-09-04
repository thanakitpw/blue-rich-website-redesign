import { revalidateSite, withCms, type ActionResult } from "@/lib/cms/actions";

/**
 * บันทึกทั้งชุดในครั้งเดียว สำหรับเนื้อหาที่ลูกค้าแก้เป็น "รายการ" ไม่ใช่ทีละหน้า
 * (ผลงาน · คำถามที่พบบ่อย · หมวดหมู่)
 *
 * แถวใหม่ในหน้าจอจะมี id เป็นค่าติดลบชั่วคราว เพราะ id จริงมาจากฐานข้อมูล
 * ตอนบันทึกจึงแยกเป็น insert กับ update ด้วยเครื่องหมายของ id
 *
 * แถวที่หายไปจากรายการ = ถูกลบ ต้องล้างแคชเว็บทันทีแม้จะเป็นแค่การบันทึกร่าง
 * เพราะการลบมีผลกับเว็บจริงทันที (ไม่มีสแนปช็อตของแถวที่ไม่มีอยู่แล้ว)
 */
export async function saveCollection<T extends { id: number }>(
  table: string,
  rows: T[],
  toColumns: (row: T, index: number) => Record<string, unknown>,
  scope?: { column: string; value: string },
): Promise<ActionResult> {
  const res = await withCms(async (sb, userId) => {
    // ── ลบแถวที่หายไปจากรายการ ──
    let q = sb.from(table).select("id");
    if (scope) q = q.eq(scope.column, scope.value);
    const { data: existing, error: readError } = await q;
    if (readError) return { ok: false as const, error: readError.message };

    const keep = new Set(rows.filter((r) => r.id > 0).map((r) => r.id));
    const remove = (existing ?? []).map((r) => r.id as number).filter((id) => !keep.has(id));

    if (remove.length) {
      const { error } = await sb.from(table).delete().in("id", remove);
      if (error) return { ok: false as const, error: error.message };
    }

    // ── อัปเดตของเดิม / เพิ่มของใหม่ ──
    for (const [i, row] of rows.entries()) {
      const cols = { ...toColumns(row, i), updated_by: userId };
      const { error } =
        row.id > 0
          ? await sb.from(table).update(cols).eq("id", row.id)
          : await sb.from(table).insert(scope ? { ...cols, [scope.column]: scope.value } : cols);
      if (error) return { ok: false as const, error: error.message };
    }

    if (remove.length) revalidateSite();
    return { ok: true as const };
  });
  return res as ActionResult;
}
