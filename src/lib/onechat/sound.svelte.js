// เสียงแจ้งเตือนแชท (เจ้าของงานสั่ง 15 ต.ค. 2026) — สร้างเสียงด้วย Web Audio ไม่ต้องมีไฟล์เสียง
//   on = เปิด/ปิด · tone = แบบเสียง · vol = ความดัง (0–1) · จำค่าไว้ใน localStorage ของเบราว์เซอร์นี้ (อ่าน/เขียนไม่ได้ก็ใช้ค่าเริ่มต้น)
//   ข้อความเข้าติดกันหลายข้อความในเสี้ยววินาทีดังครั้งเดียว
const KEY = "onechat.sound";
const DEF = { on: true, tone: "chime", vol: 0.6 };

export const TONES = [
    ["chime", "กริ๊ง"],
    ["pop", "ป๊อป"],
    ["bell", "ระฆัง"],
];
export const VOLS = [
    [0.3, "เบา"],
    [0.6, "กลาง"],
    [1, "ดัง"],
];

function load() {
    try {
        return { ...DEF, ...JSON.parse(localStorage.getItem(KEY) || "{}") };
    } catch {
        return { ...DEF };
    }
}

export const snd = $state(load());

/* เปลี่ยนค่า แล้วบันทึก · preview = เล่นเสียงให้ฟังทันที (ตอนเปิดเสียง/เลือกแบบเสียง/ความดัง) */
export function setSound(patch, preview) {
    Object.assign(snd, patch);
    try {
        localStorage.setItem(KEY, JSON.stringify(snd));
    } catch {
        /* โหมดส่วนตัว/บล็อกที่เก็บข้อมูล ⇒ จำได้แค่ระหว่างเปิดหน้านี้ */
    }
    if (preview && snd.on) playChime(true);
}

// [ความถี่ Hz, เริ่มที่วินาที, ยาววินาที, รูปคลื่น]
const NOTES = {
    chime: [[880, 0, 0.18, "sine"], [1318.5, 0.12, 0.3, "sine"]],
    pop: [[620, 0, 0.09, "triangle"], [930, 0.07, 0.12, "triangle"]],
    bell: [[1046.5, 0, 0.9, "sine"], [2093, 0, 0.5, "sine"]],
};

let ac = null;
let last = 0;
export function playChime(force) {
    if (!force && !snd.on) return;
    const now = Date.now();
    if (!force && now - last < 800) return;
    last = now;
    try {
        ac = ac || new AudioContext();
        if (ac.state === "suspended") ac.resume();
        const t0 = ac.currentTime + 0.01;
        for (const [f, at, dur, wave] of NOTES[snd.tone] || NOTES.chime) {
            const o = ac.createOscillator(), g = ac.createGain();
            o.type = wave;
            o.frequency.value = f;
            g.gain.setValueAtTime(0.0001, t0 + at);
            g.gain.exponentialRampToValueAtTime(0.25 * snd.vol, t0 + at + 0.015);
            g.gain.exponentialRampToValueAtTime(0.0001, t0 + at + dur);
            o.connect(g).connect(ac.destination);
            o.start(t0 + at);
            o.stop(t0 + at + dur + 0.05);
        }
    } catch {
        /* เบราว์เซอร์ไม่รองรับ Web Audio ⇒ เงียบ */
    }
}
