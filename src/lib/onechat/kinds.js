// ประเภทเคส — สีตามต้นฉบับ (เจ้าของงานสั่ง 12 ต.ค. 2026): ฝาก เหลือง · ถอน ส้ม · ทั่วไป แดง · ปิดเคส ขาว
//   row    = พื้นแถว + แถบซ้าย 4px ในรายการแชต (เหมือนการ์ดของต้นฉบับ)
//   badge  = ป้ายสถานะบนหัวห้องแชต (พื้น · ขอบ · ตัวอักษรสีเดียวกัน แบบ .status ของต้นฉบับ)
//   swatch = สี่เหลี่ยมสีในคำอธิบายท้ายการ์ด
//   name   = สีชื่อลูกค้าตามประเภทเคส ในรายการแชทและหัวห้องแชท (เว็บต้นฉบับ 15 ต.ค. 2026)
//   หน้าแถวเป็นรูปโปรไฟล์ลูกค้า ไม่ใช่ไอคอนประเภท · ประเภทยังมีคำกำกับในป้ายของแถวเสมอ
//   โทเคน --case-* อยู่ใน app.css · ตัวอักษรบนพื้นทุกสีผ่าน 4.5:1 ทั้งสองโหมด
import { typeLabel } from "./data.js";

const LOOK = {
    yellow: {
        row: "bg-case-yellow-bg hover:bg-case-yellow/25 border-l-case-yellow",
        badge: "border-case-yellow bg-case-yellow-bg text-case-yellow-fg",
        name: "text-case-yellow-fg",
        swatch: "bg-case-yellow",
    },
    orange: {
        row: "bg-case-orange-bg hover:bg-case-orange/25 border-l-case-orange",
        badge: "border-case-orange bg-case-orange-bg text-case-orange-fg",
        name: "text-case-orange-fg",
        swatch: "bg-case-orange",
    },
    red: {
        row: "bg-case-red-bg hover:bg-case-red/20 border-l-case-red",
        badge: "border-case-red bg-case-red-bg text-case-red-fg",
        name: "text-case-red-fg",
        swatch: "bg-case-red",
    },
    white: {
        row: "bg-case-white-bg hover:bg-case-white/20 border-l-case-white", // ชี้แล้วสว่างขึ้น (โหมดมืดพื้นปิดเคสอ่อนกว่า muted)
        badge: "border-case-white bg-case-white-bg text-case-white-fg",
        name: "text-case-white-fg",
        swatch: "bg-case-white-bg ring-1 ring-case-white",
    },
};

const TYPE = { deposit: LOOK.yellow, withdraw: LOOK.orange, general: LOOK.red };

export function kindOf(c) {
    const look = c.status === "closed" ? LOOK.white : TYPE[c.type];
    return { ...look, label: typeLabel[c.type] };
}

export const KINDS = [
    { key: "deposit", legend: "ฝาก", ...LOOK.yellow },
    { key: "withdraw", legend: "ถอน", ...LOOK.orange },
    { key: "general", legend: "ทั่วไป", ...LOOK.red },
    { key: "closed", legend: "ปิดเคส", ...LOOK.white },
];

// ป้ายฝาก/ถอนในประวัติ — สีเดียวกับประเภทเคสในรายการสนทนา (ฝาก เหลือง · ถอน ส้ม)
export const typeBadge = (dep) => (dep ? LOOK.yellow.badge : LOOK.orange.badge);

// ปุ่มเปลี่ยนประเภทเคสในหัวห้องแชท — ที่เลือกอยู่ใช้สีของประเภทนั้น · ที่ไม่ได้เลือกเป็นเทา (เจ้าของงานสั่ง 15 ต.ค. 2026)
//   [ประเภท, คำ, ที่เลือกอยู่ (พื้นสี + ✓), ยังไม่เลือก (เทา)] · dark: ทับขอบ/พื้นของปุ่ม outline โหมดมืด
export const TYPE_BTNS = [
    ["deposit", "ฝาก", LOOK.yellow.badge + " dark:border-case-yellow dark:bg-case-yellow-bg", "text-muted-foreground"],
    ["withdraw", "ถอน", LOOK.orange.badge + " dark:border-case-orange dark:bg-case-orange-bg", "text-muted-foreground"],
    ["general", "เรื่องทั่วไป", LOOK.red.badge + " dark:border-case-red dark:bg-case-red-bg", "text-muted-foreground"],
];
