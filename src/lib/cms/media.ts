import publicImages from "@/data/public-images.json";
import { serverClient } from "@/lib/supabase/server";

export type MediaItem = {
  /** null = รูปเดิมที่อยู่ในโปรเจค ลบจากหลังบ้านไม่ได้ */
  id: string | null;
  path: string | null;
  url: string;
  filename: string;
  folder: string;
  bytes: number | null;
  alt: string | null;
  uploaded: boolean;
};

/**
 * คลังรูป = รูปที่อัปโหลดใหม่ (Supabase Storage) + รูปเดิมที่อยู่ในโปรเจค
 *
 * รูปเดิมมาจาก src/data/public-images.json ที่สร้างตอน build ไม่ใช่การอ่าน
 * โฟลเดอร์ public ตอน runtime (เหตุผลอยู่ใน scripts/build-image-manifest.mts)
 */
export async function listMedia(): Promise<MediaItem[]> {
  const bundled: MediaItem[] = publicImages.map((m) => ({
    ...m,
    id: null,
    path: null,
    alt: null,
    uploaded: false,
  }));

  const sb = await serverClient();
  if (!sb) return bundled;

  const { data } = await sb
    .from("media")
    .select("id, path, url, filename, folder, bytes, alt")
    .order("created_at", { ascending: false });

  const uploaded: MediaItem[] = (data ?? []).map((m) => ({
    id: m.id as string,
    path: m.path as string,
    url: m.url as string,
    filename: m.filename as string,
    folder: (m.folder as string) ?? "ทั่วไป",
    bytes: (m.bytes as number) ?? null,
    alt: (m.alt as string) ?? null,
    uploaded: true,
  }));

  return [...uploaded, ...bundled];
}
