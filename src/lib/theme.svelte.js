// โหมดสว่าง/มืด — DESIGN-SYSTEM §9.5: ใส่ data-theme ที่ <html> · จำค่าที่เลือกแยกตามโดเมน · ครั้งแรกตามเครื่อง
// ไม่ใช้ mode-watcher (มันใส่คลาส .dark ซึ่งไม่ใช่สัญญาของงานนี้)
const keyOf = () => `${location.hostname}:theme`;

export const theme = $state({ mode: "light" });

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
    document.documentElement.dataset.theme = theme.mode;
}
