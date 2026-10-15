// โหมดสว่าง/มืด — DESIGN-SYSTEM §9.5: ใส่ data-theme (+ data-palette สำหรับธีมมืดแบบอื่น) ที่ <html> · จำค่าที่เลือกแยกตามโดเมน · ครั้งแรกตามเครื่อง
// ไม่ใช้ mode-watcher (มันใส่คลาส .dark ซึ่งไม่ใช่สัญญาของงานนี้)
const keyOf = () => `${location.hostname}:theme`;

export const theme = $state({ mode: "light" });

/* ธีม: สว่าง · มืด + ธีมมืดอีก 3 แบบ (เจ้าของงานสั่ง 15 ต.ค. 2026 · เทาตามภาพตัวอย่าง 3 ภาพ · สีเขียวเดียวกับธีมมืด #06C755)
   ธีมมืดทุกแบบใส่ data-theme="dark" (ใช้กฎโหมดมืดเดิมทั้งหมด) + data-palette=<id> ทับโทเคนสีเทา/สีหลักใน app.css
   sw = สีตัวอย่างบนปุ่มเลือก [พื้นการ์ด, สีหลัก] — ค่าเดียวกับโทเคนใน app.css */
export const THEMES = [
    { id: "light", label: "สว่าง" },
    { id: "dark", label: "มืด" },
    { id: "teal", label: "ทีล", sw: ["#1a3036", "#06c755"] },
    { id: "slate", label: "สเลท", sw: ["#242c36", "#06c755"] },
    { id: "navy", label: "เนวี่", sw: ["#1a2540", "#06c755"] },
];
export const isDark = (m) => m !== "light";

export function bootTheme() {
    let saved = null;
    try {
        saved = localStorage.getItem(keyOf());
    } catch {}
    const prefersDark = window.matchMedia?.("(prefers-color-scheme: dark)").matches;
    theme.mode = saved ?? (prefersDark ? "dark" : "light");
    apply();
}

export function setTheme(mode) {
    if (!mode || mode === theme.mode) return;
    theme.mode = mode;
    try {
        localStorage.setItem(keyOf(), mode);
    } catch {}
    apply();
}

// ทาที่ <html> ⇒ พื้นที่ overscroll ได้สีของโหมดด้วย
function apply() {
    const el = document.documentElement;
    if (theme.mode === "charcoal") theme.mode = "teal"; // ชื่อเดิมของธีมทีล (เปลี่ยนชื่อ 15 ต.ค. 2026)
    if (!THEMES.some((t) => t.id === theme.mode)) theme.mode = "light";
    el.dataset.theme = isDark(theme.mode) ? "dark" : "light";
    if (theme.mode === "light" || theme.mode === "dark") delete el.dataset.palette;
    else el.dataset.palette = theme.mode;
}
