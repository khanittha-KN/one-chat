// ตารางชื่อ–ค่าในการ์ด — DESIGN-SYSTEM §10.7 "ตารางค่าตั้งในการ์ด": dl บนกล่อง rounded-lg border
// เส้นคั่นด้วยพื้น bg-border + gap-px ⇒ เส้นบางเท่ากันทุกด้านโดยไม่ต้องใส่ขอบทีละช่อง · แผงลูกค้าใช้ระยะใน 10×6px
export const DL = "grid grid-cols-(--grid-kv) gap-px overflow-hidden rounded-lg border bg-border text-sm";
export const DT = "bg-muted text-muted-foreground px-2.5 py-1.5";
export const DD = "bg-card px-2.5 py-1.5 wrap-anywhere";

// แบบแถวชิดซ้าย–ขวา ไม่มีเส้นตาราง (เจ้าของงานสั่ง 12 ต.ค. 2026 สำหรับค่าไม่กี่บรรทัด)
//   <dl class={ROWS}><div class={ROW}><dt class={RK}>ชื่อ</dt><dd class={RV}>ค่า</dd></div></dl>
export const ROWS = "flex flex-col gap-1 text-sm";
export const ROW = "flex items-baseline justify-between gap-3";
export const RK = "text-muted-foreground";
export const RV = "min-w-0 text-end wrap-anywhere";

// ตารางชื่อ–ค่าแบบกระชับ (ค่าไม่กี่บรรทัดในแผงลูกค้า) — โครงเดียวกับ DL แต่ตัวเล็ก ระยะใน 8×4px
export const DLS = "grid grid-cols-(--grid-kv) gap-px overflow-hidden rounded-md border bg-border text-xs";
export const DTS = "bg-muted text-muted-foreground px-2 py-1";
export const DDS = "bg-card px-2 py-1 wrap-anywhere";
