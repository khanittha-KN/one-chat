// ข้อมูลตัวอย่าง (mock) ของ OneChat — ยกมาจากต้นฉบับครบทุกค่า ทุกข้อความ ทุกตัวสร้างข้อมูล
// ไอคอนใช้ lucide (ชุดไอคอนของ shadcn) แทนอีโมจิของต้นฉบับ
import StickerIcon from "@lucide/svelte/icons/sticker";
import SettingsIcon from "@lucide/svelte/icons/settings";
import ZapIcon from "@lucide/svelte/icons/zap";
import BotIcon from "@lucide/svelte/icons/bot";
import SendIcon from "@lucide/svelte/icons/send";
import BookOpenIcon from "@lucide/svelte/icons/book-open";
import MessageCircleIcon from "@lucide/svelte/icons/message-circle";
import HouseIcon from "@lucide/svelte/icons/house";
import MessageSquareTextIcon from "@lucide/svelte/icons/message-square-text";
import UserCogIcon from "@lucide/svelte/icons/user-cog";
import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
import ImageOffIcon from "@lucide/svelte/icons/image-off";
import KeyRoundIcon from "@lucide/svelte/icons/key-round";
import LogOutIcon from "@lucide/svelte/icons/log-out";
import CircleHelpIcon from "@lucide/svelte/icons/circle-help";

export const ME = "admin01";
// วันที่วันนี้แบบ วว/ดด/ปป (พ.ศ.) — ใช้ใต้ฟองแชทและในโน้ต (เว็บต้นฉบับ 15 ต.ค. 2026: "15/10/69 14:35")
const d0 = new Date();
export const TODAY = String(d0.getDate()).padStart(2, "0") + "/" + String(d0.getMonth() + 1).padStart(2, "0") + "/" + String((d0.getFullYear() + 543) % 100).padStart(2, "0");
// วันที่ในรายการสนทนา แบบ "15 Oct" (เจ้าของงานสั่ง 15 ต.ค. 2026 — แสดงเป็น "15 Oct - 13:30")
export const DAY_SHORT = d0.getDate() + " " + d0.toLocaleString("en-US", { month: "short" });

// Channel ของเว็บ — LINE OA หรือ Telegram (platform · เจ้าของงานสั่งเพิ่ม Telegram 15 ต.ค. 2026) · เว็บละหลายช่อง ตั้งชื่อตามเว็บ (เจ้าของงานให้ม็อคอัพแบบนี้ 14 ต.ค. 2026: "Alpha Shop → Alpha 1 · สำรอง · VIP · Support")
// id = LINE ID ที่แสดงเป็น @id บนหัวห้องแชทและการ์ดสถานะไลน์ · เรียงตามเว็บ แล้วตามลำดับช่อง
export const merchants = [
    { id: "alpha1", name: "Alpha 1", chats: 3482, platform: "line" },
    { id: "alpha2", name: "Alpha สำรอง", chats: 4863, platform: "line" },
    { id: "alphavip", name: "Alpha VIP", chats: 59216, platform: "line" },
    { id: "alphacs", name: "Alpha Support", chats: 2371, platform: "line" },
    { id: "alphatg", name: "Alpha Telegram", chats: 1284, platform: "telegram" },
    { id: "beta1", name: "Beta 1", chats: 25422, platform: "line" },
    { id: "beta2", name: "Beta สำรอง", chats: 14912, platform: "line" },
    { id: "betavip", name: "Beta VIP", chats: 5982, platform: "line" },
    { id: "betacs", name: "Beta Support", chats: 18107, platform: "line" },
    { id: "betatg", name: "Beta Telegram", chats: 932, platform: "telegram" },
    // OA ใหม่ที่ยังไม่มีใครทัก — ตัวอย่างผู้รับ Broadcast ว่าง (เจ้าของงานขอ 15 ต.ค. 2026)
    { id: "betapromo", name: "Beta โปรโมชั่น", chats: 0, platform: "line" },
    // ⚠ 2 ช่องนี้ไม่มีในต้นฉบับ — ทดสอบ Channel ที่ใช้ LINE LIFF เท่านั้น (ไม่มีแชต ⇒ ไม่แสดงในแผงซ้าย)
    { id: "betamember", name: "Beta Member", chats: 0, platform: "line" },
    { id: "gammapromo", name: "Gamma Promo", chats: 0, platform: "line" },
];
export const merch = (id) => merchants.filter((m) => m.id === id)[0];
export const chanByName = (name) => merchants.filter((m) => m.name === name)[0];
// ช่องทางของ Channel — ใช้กับสัญลักษณ์ ui/PlatformIcon และข้อความ "ส่งทาง …"
export const PLATFORM = { line: "LINE", telegram: "Telegram" };
export const platformOf = (id) => (merch(id) || {}).platform || "line";

/* ---------- Organization → Agent → LINE Channel (เอกสารส่งต่องาน 9 ต.ค. 2026 ฉบับแก้) ----------
   ⚠ ข้อมูลสมมติทั้งหมด — ของจริงต้องจัดกลุ่มด้วยรหัส Org · Agent · Channel ของระบบ ไม่เดาจากชื่อหรือเลข
   · Agent = ชื่อเว็บ (เช่น Alpha Shop) · รายการใน merchants = LINE Channel ของเว็บนั้น เว็บละกี่ช่องก็ได้ (เจ้าของงานยืนยัน 9 และ 14 ต.ค. 2026) ⇒ ไม่มีข้อมูลเว็บแยกจาก Agent
   · ฟังก์ชันอ่านแยกต่อ Channel: chat (แชทรวม) · liff (LINE LIFF) — Agent เดียวกันเปิดต่างกันได้ · เปิดแชทไม่ได้แปลว่าปิด LIFF
   · checkbox ในหน้าแชตเป็นตัวกรองรายการสนทนาเท่านั้น ไม่แตะค่าฟังก์ชันหรือ Permissions
   · ต้นแบบนี้ไม่มีระบบสิทธิ์ ⇒ ผู้ใช้เห็นทุก Channel (ของจริงกรองด้วยสิทธิ์เดิมก่อนแสดง) */
export const org = { id: "org1", name: "Demo Group" };
export const agents = [
    { id: "agA", org: "org1", name: "Alpha Shop" },
    { id: "agB", org: "org1", name: "Beta Shop" },
    { id: "agC", org: "org1", name: "Gamma Shop" },
];
const CHANNEL_META = {
    "alpha1": { agent: "agA", chat: true, liff: false },
    "alpha2": { agent: "agA", chat: true, liff: true },
    "alphavip": { agent: "agA", chat: true, liff: false },
    "alphacs": { agent: "agA", chat: true, liff: false },
    "alphatg": { agent: "agA", chat: true, liff: false }, // Telegram ไม่มี LIFF
    "beta1": { agent: "agB", chat: true, liff: false },
    "beta2": { agent: "agB", chat: true, liff: false },
    "betavip": { agent: "agB", chat: true, liff: true },
    "betacs": { agent: "agB", chat: true, liff: false },
    "betatg": { agent: "agB", chat: true, liff: false },
    "betapromo": { agent: "agB", chat: true, liff: false },
    "betamember": { agent: "agB", chat: false, liff: true },
    "gammapromo": { agent: "agC", chat: false, liff: true }, // Gamma Shop ไม่มี Channel สำหรับแชต ⇒ ไม่แสดงทั้งกลุ่ม
};
const metaOf = (id) => CHANNEL_META[id] || { agent: null, chat: false, liff: false };
// ทุก Channel มีเจ้าของเสมอ (เจ้าของงานยืนยัน 9 ต.ค. 2026 — ไม่มีกรณีไม่พบข้อมูล Agent)
export const agentOf = (id) => agents.filter((a) => a.id === metaOf(id).agent)[0];
export const canChat = (id) => metaOf(id).chat; // && สิทธิ์ของผู้ใช้ (ระบบจริง)
export const hasLiff = (id) => metaOf(id).liff;
export const chatChannels = () => merchants.filter((m) => canChat(m.id));
// แถบ Merchant แสดงเฉพาะ Channel ที่เปิดแชทรวม — LINE LIFF เท่านั้นไม่แสดง (เจ้าของงานสั่ง 9 ต.ค. 2026) · Agent ที่ไม่เหลือ Channel ก็ไม่แสดง
// ลำดับ: Agent ตามลำดับใน agents · Channel ตามลำดับเดิมของ merchants
export const agentGroups = () =>
    agents
        .map((a) => ({ agent: a, channels: merchants.filter((m) => metaOf(m.id).agent === a.id && canChat(m.id)) }))
        .filter((g) => g.channels.length);
export const lineNo = { "alpha1": 11, "beta1": 12, "betavip": 13, "alpha2": 14, "beta2": 26, "alphavip": 31, "betacs": 32, "alphacs": 33 };

// โลโก้ธนาคาร: รูปโลโก้จริงจาก github.com/omise/banks-logo (MIT · static/banks/<code>.svg · เจ้าของงานให้ใช้ 14 ต.ค. 2026)
// bg = สีประจำธนาคารตาม banks.json ของ omise · fg = สีโลโก้ (กรุงศรีพื้นเหลืองใช้โลโก้สีเข้ม)
// TTB: banks.json ให้ #ECF0F1 (เทาอ่อน) โลโก้ขาวจะหาย ⇒ ใช้กรมท่า #002D63 ของ ttb แทน
/* ผู้ติดตาม / ห้องแชทของ Channel สำหรับเลือกผู้รับ Broadcast (ข้อมูลจำลอง · เจ้าของงานขอ 15 ต.ค. 2026)
   แสดงสถานการณ์ครบ: ว่าง (Beta โปรโมชั่น 0 คน) · น้อย · เยอะ (Alpha VIP 150 คน · Beta 1 80 คน)
   ระบบจริงดึงรายชื่อห้องแชทของ OA จาก API · id ไม่ซ้ำกับ id เคส (ขึ้นต้นด้วย id ของ Channel) */
const FOLLOWERS = { "alphavip": 150, "beta1": 80, "alpha1": 36, "beta2": 24, "betavip": 18, "alpha2": 12, "betacs": 9, "alphacs": 6, "alphatg": 4, "betatg": 3, "betapromo": 0 };
const F_FIRST = ["สมชาย", "สุดา", "Nok", "Ton", "มานี", "ปิยะ", "Bee", "กิตติ", "Fah", "วิภา", "Mild", "อนันต์", "Pond", "ศิริ", "June", "ธนา", "Ploy", "ชาตรี", "Mint", "รัตนา"];
const F_LAST = ["ใจดี", "S.", "รุ่งเรือง", "K.", "ทองคำ", "P.", "ศรีสุข", "W.", "บุญมา", "T."];
export function followersOf(chId) {
    const n = FOLLOWERS[chId] ?? 8;
    return Array.from({ length: n }, (_, i) => {
        const name = F_FIRST[(i * 7 + chId.length) % F_FIRST.length] + " " + F_LAST[(i * 3) % F_LAST.length];
        return { id: chId + "-f" + i, name, user: "U" + (1000 + ((i * 7919 + chId.length * 31) % 9000)) };
    });
}

export const BANKS = [
    { code: "KBANK", name: "กสิกรไทย", bg: "#138f2d", fg: "#ffffff" },
    { code: "SCB", name: "ไทยพาณิชย์", bg: "#4e2e7f", fg: "#ffffff" },
    { code: "KTB", name: "กรุงไทย", bg: "#1ba5e1", fg: "#ffffff" },
    { code: "BBL", name: "กรุงเทพ", bg: "#1e4598", fg: "#ffffff" },
    { code: "BAY", name: "กรุงศรีอยุธยา", bg: "#fec43b", fg: "#1a1d22" },
    { code: "TTB", name: "ทหารไทยธนชาต", bg: "#002d63", fg: "#ffffff" },
];
export const bankLogoSrc = (code) => "/banks/" + code.toLowerCase() + ".svg";
export function bankOf(code) {
    return BANKS.filter((x) => x.code === code)[0] || BANKS[0];
}

// รูปโปรไฟล์ลูกค้า (เจ้าของงานให้ใช้ 14 ต.ค. 2026 · static/avatars/cust-01…13.jpg 150px · ต้นฉบับอยู่โฟลเดอร์ avatar/)
// ลูกค้า 1–13 มีรูป · 14–16 ไม่มีรูป ⇒ แสดงตัวอักษรในวงกลมเหมือนผู้ใช้ LINE ที่ไม่ได้ตั้งรูป
const AVATARS = 13;
const avatarOf = (n) => (n >= 1 && n <= AVATARS ? "/avatars/cust-" + String(n).padStart(2, "0") + ".jpg" : undefined);

// ชื่อ-นามสกุล + Username ลูกค้าแบบที่เห็นจริง (ชื่อ + เลข 4 หลัก · เจ้าของงานสั่ง 14 ต.ค. 2026)
// ลูกค้า 1–7 รูปผู้หญิง · 8–13 รูปผู้ชาย ⇒ ชื่อตรงกับรูป · no = ลำดับลูกค้า ใช้สร้างประวัติ/บัญชี
const PEOPLE = [
    ["pimchanok4551", "พิมพ์ชนก แก้วมณี"], ["nattaya2208", "ณัฐยา ทองดี"], ["kanokwan7731", "กนกวรรณ จันทร์เพ็ญ"], ["ploynapat0915", "พลอยนภัส สุขเจริญ"],
    ["benjamas3368", "เบญจมาศ ทองคำ"], ["mintra8842", "มินตรา แสงทอง"], ["natcha5517", "ณัฐชา รัตนพันธ์"], ["somchai1290", "สมชาย ศรีสุข"],
    ["kritsada6603", "กฤษดา บุญมา"], ["thanawat4475", "ธนวัฒน์ วงศ์ไทย"], ["arthit8126", "อาทิตย์ ศรีวงศ์"], ["wanchai3054", "วันชัย ใจกล้า"],
    ["teerapat7789", "ธีรภัทร์ มั่นคง"], ["sorawit2461", "สรวิศ พรหมมา"], ["jirapat9930", "จิรภัทร นาคประเสริฐ"], ["pongsak1187", "พงศ์ศักดิ์ อินทร์แก้ว"],
    ["natthapong5402", "ณัฐพงษ์ ศรีสวัสดิ์"], ["phakhin3317", "ภาคิน ทองประเสริฐ"], ["chalisa6624", "ชลิสา วงศ์สุวรรณ"],
    ["chanon4418", "ชานนท์ ใจดี"], ["kittipong2750", "กิตติพงษ์ แสนสุข"], ["sunisa6083", "สุนิสา บุญเรือง"],
];
export const usernameOf = (n) => (PEOPLE[n - 1] ? PEOPLE[n - 1][0] : "member" + String(n).padStart(4, "0"));
// เลขบัญชี 10 หลักแบบ XXX-X-XXXXX-X และเบอร์มือถือ ที่คงที่ตามลำดับลูกค้า (ไม่สุ่มใหม่ทุกครั้งที่โหลด)
const digits = (seed, len) => String((seed * 2654435761) % 10 ** len).padStart(len, "0");
export const acctNo = (seed) => {
    const d = digits(seed + 7, 10);
    return d;
};
// เว็บจริงแสดงเลขบัญชีและเบอร์เป็นตัวเลขล้วน (27 ต.ค. 2026)
const mobileOf = (n) => "0" + "896"[n % 3] + digits(n + 3, 1) + digits(n * 11 + 5, 3) + digits(n * 13 + 1, 4);

// ปิดเลขบางส่วนในแผงขวา (เว็บต้นฉบับ 15 ต.ค. 2026): เลขบัญชี 3 ตัวแรก + XXXX + 3 ตัวท้าย · เบอร์ 3 ตัวแรก + XXXX + 3 ตัวท้าย
export const maskNo = (s) => {
    const d = String(s).replace(/\D/g, "");
    return d.slice(0, 3) + "XXXX" + d.slice(-3);
};
// ค่า Ping ของไลน์ (ms) — ตัวอย่างคงที่ตามลูกค้า · ไลน์หลุด ⇒ null
export const pingOf = (c) => (c.lineOk ? 90 + ((c.user.no || 1) * 17) % 90 : null);

function mkUser(n) {
    const b = BANKS[n % BANKS.length];
    return { no: n, username: usernameOf(n), fullname: PEOPLE[n - 1] ? PEOPLE[n - 1][1] : usernameOf(n), bank: b.name, bankCode: b.code, number: acctNo(n), mobile: mobileOf(n), picture: avatarOf(n) };
}

export function makeHist(n, kind) {
    if (n === 6 || (n === 3 && kind === "wd")) return [];
    const amts = [100, 200, 253, 300, 500, 1000, 150, 400, 800];
    const cnt = 6 + ((n * 3 + (kind === "wd" ? 2 : 0)) % 10); // อย่างละ 6–15 รายการ ⇒ ประวัติมีหลายหน้า (หน้าละ 10)
    const pad = (v) => ("0" + v).slice(-2);
    const out = [];
    for (let i = 0; i < cnt; i++) {
        out.push({
            amt: amts[(n * 3 + i * 2 + (kind === "wd" ? 1 : 0)) % amts.length],
            time: 14 - Math.floor(i / 2) + " ต.ค. 2569 " + pad(9 + ((n + i * 3) % 12)) + ":" + pad((n * 7 + i * 13) % 60),
            ok: kind === "dep" ? i % 4 !== 3 : i % 3 !== 2,
            ref: (kind === "dep" ? "D" : "W") + (100000 + n * 1111 + i * 37),
        });
    }
    return out;
}

export const ACC = "กรุณาโอนเข้าบัญชี กสิกรไทย 038-8-41275-6 แล้วส่งสลิปในแชทนี้ค่ะ";

/* สลิปโอนเงินเป็นรูปจริง (เจ้าของงานส่งรูปมา 14 ต.ค. 2026 · แทนกล่องสลิปจำลอง) — ไฟล์อยู่ static/slips/
   รายละเอียดอ่านจากรูป ⇒ ยอด วันที่ เวลา ผู้โอน/ผู้รับ ในผลตรวจที่แผงขวาตรงกับรูปเสมอ · จริง/ปลอม ยังมาจาก variant ของข้อความ
   w/h = ขนาดจริงของรูป ใส่ที่ <img> ให้จองพื้นที่ก่อนโหลด ⇒ ห้องแชทเลื่อนลงล่างสุดได้ตรง */
export const SLIPS = {
    kbank: {
        src: "/slips/kbank-scb-10000.png", w: 429, h: 466, amt: 10000, date: "28 เม.ย. 2568", time: "21:19 น.", ref: "014268162500COR09547",
        fromName: "นาย สมชาย ใ", fromBank: "KBANK", fromNo: "xxx-x-x7364-x", toName: "บจก. วันแชท", toBank: "SCB", toNo: "xxx-x-x4612-x",
    },
    bbl: {
        src: "/slips/bbl-400000.png", w: 452, h: 678, amt: 400000, date: "25 มี.ค. 2568", time: "13:13 น.", ref: "20250325131352300012234567",
        fromName: "SOMSRI JAIDEE", fromBank: "BBL", fromNo: "012-3-xxx45", toName: "ONECHAT CO., LTD.", toBank: "BBL", toNo: "000-0-xxx000",
    },
};
export const slipOf = (m) => SLIPS[m.img] || SLIPS.kbank;
const slipMsg = (img, t, extra) => ({ who: "cust", text: "", t, action: "slip", img, amt: SLIPS[img].amt, ...extra });
// ยอดที่ลูกค้าพิมพ์ในแชท เช่น "10,000" — ใช้กับเคสที่มีสลิป ให้ยอดที่แจ้ง · ยอดค้าง · รูปสลิป ตรงกัน (เจ้าของงานสั่ง 14 ต.ค. 2026)
const said = (img) => SLIPS[img].amt.toLocaleString("en-US");

// "20 วินาที" · "2 นาที" · "11 ชม." ⇒ จำนวนวินาที (ป้ายเวลาในรายการแชท แปลงเป็นเวลาไว้เรียง) · "เมื่อสักครู่" ⇒ 0
const AGO_UNIT = { "วินาที": 1, "นาที": 60, "ชม.": 3600 };
const agoSecs = (ago) => {
    const [n, u] = ago.split(" ");
    return (+n || 0) * (AGO_UNIT[u] || 0);
};

// claim (ยอดที่ลูกค้าแจ้ง = ยอดค้าง) เท่ากับยอดในรูปสลิปเสมอ · "{amt}" ในข้อความถูกแทนด้วยยอดนั้น
function mkSlipCase(id, n, name, type, merchant, status, admin, secs, ago, img, variant, lines) {
    const c = { id, name, type, merchant, status, admin, secs, ago, lineOk: true, wd: 0, user: mkUser(n), claim: SLIPS[img].amt, msgs: [] };
    lines.forEach((l, i) => {
        c.msgs.push({ who: l[0], by: l[2], text: l[1].replace("{amt}", said(img)), t: "14:" + (10 + i) });
    });
    // สลิปซ้ำ ⇒ จำว่าเคยส่งมาเมื่อไร (เว็บจริงบอกเวลาที่เคยส่ง)
    c.msgs.push(slipMsg(img, "14:30", { variant, ...(variant === "dup" ? { dupAt: "26 ต.ค. 2569 18:42" } : {}) }));
    c.slip = { state: "pending", amt: SLIPS[img].amt, variant };
    return c;
}

export function seedCases() {
    const cases = [
        { id: "c1", name: "Pim Pimchanok", type: "deposit", merchant: "beta2", status: "waiting", admin: null, secs: 128, ago: "2 นาที", lineOk: true, wd: 0, user: mkUser(1),
            msgs: [{ who: "cust", text: "สวัสดีค่ะ", t: "13:45" }, { who: "cust", text: "ขอแจ้งฝากหน่อยค่ะ ยูส " + usernameOf(1) + " ฝาก 253 บาทค่ะ", t: "13:46" }, { who: "cust", text: "ต้องโอนเข้าบัญชีไหนคะ", t: "13:46" }] },
        { id: "c2", name: "Nattaya.T", type: "withdraw", merchant: "alphavip", status: "open", admin: "admin02", secs: 35, ago: "5 นาที", lineOk: true, wd: 2, user: mkUser(2),
            msgs: [{ who: "cust", text: "ขอถอนเงินหน่อยค่ะ", t: "13:47" }, { who: "cust", text: "ถอน200", t: "13:48" }, { who: "cust", text: "ถอนแล้วยังไม่เข้าเลยค่ะ", t: "13:49" }] },
        { id: "c3", name: "แนน กนกวรรณ", type: "general", merchant: "betacs", status: "open", admin: "admin03", secs: 12, ago: "9 นาที", lineOk: false, wd: 0, user: mkUser(3),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นหน่อยค่ะ", t: "13:50" }, { who: "cust", text: "ทักไปหลายรอบแล้วไม่เห็นตอบเลยค่ะ", t: "13:51" }, { who: "sys", text: "ไลน์หลุด กรุณากด Verify ที่แผงขวา", t: "13:51" }] },
        { id: "c4", name: "Ploy", type: "deposit", merchant: "alpha1", status: "closed", admin: "admin02", secs: 210, ago: "36 นาที", lineOk: true, wd: 0, user: mkUser(4),
            msgs: [{ who: "cust", text: "ฝาก " + said("kbank") + " ค่ะ", t: "13:10" }, { who: "admin", by: "admin02", text: ACC, t: "13:11" }, { who: "cust", text: "โอนแล้วค่ะ", t: "13:13" }, slipMsg("kbank", "13:13", { checked: true, v: "real" }), { who: "sys", text: "เติมเงิน " + money(SLIPS.kbank.amt) + " บาท ให้ " + usernameOf(4) + " เรียบร้อย", t: "13:14" },
                // ข้อความระบบลูกค้าไม่เห็น ⇒ แอดมินแจ้งลูกค้าก่อน ลูกค้าจึงตอบกลับได้ (เจ้าของงานทัก 16 ต.ค. 2026)
                { who: "admin", by: "admin02", text: "เติมเงิน " + money(SLIPS.kbank.amt) + " บาท เข้ายูส " + usernameOf(4) + " เรียบร้อยแล้วค่ะ ตรวจสอบยอดในเกมได้เลยนะคะ", t: "13:14" }, { who: "cust", text: "ได้รับแล้วค่ะ ขอบคุณค่ะ", t: "13:15" }], closedBy: "admin02", closedAt: "13:19" },
        { id: "c5", name: "เบญ", type: "withdraw", merchant: "alpha2", status: "waiting", admin: null, secs: 64, ago: "1 นาที", lineOk: true, wd: 0, user: mkUser(5),
            msgs: [{ who: "cust", text: "ขอถอน 500 ค่ะ", t: "13:52" }, { who: "cust", text: "รอนานแล้วนะคะ ยังไม่เข้าเลย", t: "13:53" }] },
        { id: "c6", name: "Mintra S.", type: "general", merchant: "alphacs", status: "waiting", admin: null, secs: 20, ago: "20 วินาที", lineOk: true, wd: 0, user: mkUser(6),
            msgs: [{ who: "cust", text: "สมัครสมาชิกยังไงคะ", t: "13:55" }, { who: "cust", text: "มีโปรสมาชิกใหม่ไหมคะ", t: "13:55" }] },
        { id: "c7", name: "ณัฐชา", type: "deposit", merchant: "betatg", status: "open", admin: "admin01", secs: 80, ago: "14 นาที", lineOk: true, wd: 0, user: mkUser(7),
            msgs: [{ who: "cust", text: "สวัสดีค่ะ", t: "13:36" }, { who: "admin", by: "admin01", text: "สวัสดีค่ะ ต้องการแจ้งฝากใช่ไหมคะ", t: "13:37" }, { who: "cust", text: "ใช่ค่ะ ฝาก " + said("bbl"), t: "13:38" }, { who: "admin", by: "admin01", text: ACC, t: "13:39" }, { who: "cust", text: "โอนแล้วนะคะ", t: "13:40" }, slipMsg("bbl", "13:41", { variant: "real" })] },
        { id: "c8", name: "Somchai", type: "general", merchant: "alphavip", status: "closed", admin: "admin03", secs: 95, ago: "11 ชม.", lineOk: true, wd: 0, user: mkUser(8),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นฝากครั้งแรกหน่อยครับ", t: "12:25" }, { who: "admin", by: "admin03", text: "ฝากครั้งแรกรับโบนัสตามเงื่อนไขโปรโมชั่นค่ะ", t: "12:27" }, { who: "cust", text: "ขอบคุณครับ", t: "12:30" }], closedBy: "admin03", closedAt: "12:41" },
    ];
    cases[0].claim = 253;
    cases[1].claim = 200;
    cases[4].claim = 500;
    cases[6].claim = SLIPS.bbl.amt;
    cases[6].slip = { state: "pending", amt: SLIPS.bbl.amt, variant: "real" };
    // รูปสลิปสลับกัน (kbank · bbl) ไม่ผูกกับผลจริง/ปลอม · ยอดในข้อความ ({amt}) และยอดค้างมาจากรูปสลิป
    cases.push(
        mkSlipCase("c9", 9, "กฤษดา บุญมา", "deposit", "beta2", "open", "admin01", 70, "3 นาที", "kbank", "fake", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin01"], ["cust", "โอนแล้วครับ"]]),
        mkSlipCase("c10", 10, "Thanawat W.", "deposit", "beta1", "open", "admin02", 55, "4 นาที", "bbl", "real", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin02"], ["cust", "โอนจากบัญชีแฟนครับ"]]),
        mkSlipCase("c11", 11, "อาร์ต", "deposit", "betavip", "open", "admin03", 90, "6 นาที", "kbank", "dup", [["cust", "ฝาก {amt} นะครับ"], ["admin", ACC, "admin03"], ["cust", "โอนผ่านแอปอีกธนาคารครับ"]]),
        mkSlipCase("c12", 12, "วันชัย", "deposit", "alpha2", "open", "admin01", 40, "7 นาที", "bbl", "noqr", [["cust", "ขอฝาก {amt} ครับ"], ["cust", "โอนเข้าบัญชีที่เคยใช้ครับ"]]),
        mkSlipCase("c13", 13, "Teerapat M.", "deposit", "alphavip", "open", "admin02", 30, "8 นาที", "kbank", "notfound", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin02"], ["cust", "โอนแล้วครับ"]]),
        mkSlipCase("c14", 14, "Sorawit", "withdraw", "betacs", "open", "admin03", 20, "10 นาที", "bbl", "wait", [["cust", "ถอน {amt} ครับ"], ["cust", "ส่งสลิปให้ตรวจสอบครับ"]]),
        mkSlipCase("c15", 15, "จิรภัทร", "withdraw", "alpha1", "open", "admin01", 25, "12 นาที", "kbank", "error", [["cust", "ขอถอน {amt} ค่ะ"], ["cust", "ส่งสลิปให้แล้วนะคะ"]]),
        mkSlipCase("c16", 16, "Pongsak", "deposit", "alphatg", "waiting", null, 15, "30 วินาที", "bbl", "fake", [["cust", "ฝาก {amt} ครับ"], ["cust", "โอนแล้วนะครับ"]]),
    );
    /* เคสสถานการณ์ใหม่จากเว็บต้นฉบับ (15 ต.ค. 2026) — ยูสโดนล็อก · ถอนติดเทิร์น · ลูกค้าใหม่ยังไม่ผูกสมาชิก */
    const line3 = (who, text, by) => ({ who, text, by });
    const mk = (id, n, name, type, merchant, status, admin, secs, ago, lines, extra) => {
        const c = { id, name, type, merchant, status, admin, secs, ago, lineOk: true, wd: 0, user: mkUser(n), msgs: [] };
        lines.forEach((l, i) => c.msgs.push({ ...l, t: "14:" + String(35 + i).padStart(2, "0") }));
        return Object.assign(c, extra || {});
    };
    cases.push(
        mk("c17", 17, "ณัฐพงษ์", "general", "alpha1", "open", "admin02", 45, "2 นาที", [
            line3("cust", "ยูสโดนล็อกครับ ขึ้นว่าล็อกอินผิดหลายครั้ง"),
            line3("admin", "ขอทราบยูสเซอร์ และชื่อ-นามสกุลที่สมัครไว้ด้วยนะคะ", "admin02"),
            line3("cust", "ยูส " + usernameOf(17) + " ครับ ชื่อ" + PEOPLE[16][1]),
        ]),
        mk("c18", 18, "Phakhin", "withdraw", "beta1", "open", "admin03", 38, "3 นาที", [
            line3("cust", "ถอน 1000 ไม่ได้ครับ ขึ้นว่าไม่ผ่านเงื่อนไข"),
            line3("admin", "ตรวจสอบแล้ว ยอดเทิร์นยังไม่ครบตามโปรโมชั่นที่รับไว้ค่ะ", "admin03"),
            line3("cust", "ต้องทำเทิร์นอีกเท่าไหร่ครับ"),
        ], { claim: 1000 }),
        mk("c19", 19, "ชลิสา", "general", "betavip", "waiting", null, 12, "15 วินาที", [
            line3("cust", "สวัสดีค่ะ เพิ่งเห็นเพจนี้ค่ะ"),
            line3("cust", "ฝากขั้นต่ำเท่าไหร่คะ แล้วต้องสมัครก่อนไหม"),
        ], { unbound: true }),
        /* เคสสำหรับภาพในคู่มือ (28 ต.ค. 2026) — บทสนทนาตรงกับขั้นตอนที่อธิบาย
           c20 คุยจบแล้ว รอปิดเคส · c21 สมาชิกเดิมทักจากไลน์ใหม่ (ยังไม่ผูกแชท แต่ค้นหาเจอ) · c22 ลืมรหัสผ่าน */
        mk("c20", 20, "ชานนท์", "deposit", "beta1", "open", "admin01", 60, "1 นาที", [
            line3("cust", "ฝาก " + said("kbank") + " ครับ"),
            line3("admin", ACC, "admin01"),
            line3("cust", "โอนแล้วครับ"),
            slipMsg("kbank", "", { checked: true, v: "real" }),
            line3("sys", "เติมเงิน " + money(SLIPS.kbank.amt) + " บาท ให้ " + usernameOf(20) + " เรียบร้อย"),
            line3("admin", "เติมเงิน " + money(SLIPS.kbank.amt) + " บาท เข้ายูส " + usernameOf(20) + " เรียบร้อยแล้วครับ ตรวจสอบยอดในเกมได้เลยนะครับ", "admin01"),
            line3("cust", "ได้รับแล้วครับ ขอบคุณครับ"),
        ]),
        mk("c21", 21, "Kittipong", "general", "alpha1", "waiting", null, 18, "40 วินาที", [
            line3("cust", "สวัสดีครับ เปลี่ยนไลน์ใหม่ครับ"),
            line3("cust", "เป็นสมาชิกอยู่แล้วครับ ยูส " + usernameOf(21)),
        ], { unbound: true, known: true }),
        mk("c22", 22, "สุนิสา", "general", "beta2", "open", "admin01", 50, "2 นาที", [
            line3("cust", "ลืมรหัสผ่านค่ะ เข้าเกมไม่ได้"),
            line3("admin", "รบกวนแจ้งชื่อ-นามสกุลและธนาคารที่ผูกไว้ เพื่อยืนยันตัวตนค่ะ", "admin01"),
            line3("cust", PEOPLE[21][1] + " ธนาคาร" + BANKS[22 % BANKS.length].name + " ค่ะ"),
        ]),
    );
    const byId = (id) => cases.filter((c) => c.id === id)[0];
    // ลูกค้าใหม่ที่ยังไม่ผูกสมาชิก (unbound) ⇒ แผงขวาแสดงแค่ค้นหาเพื่อผูก + สมัครสมาชิก
    byId("c6").unbound = true;
    // โน้ตของเคส (แสดงใต้ช่องโน้ตในหัวห้องแชท)
    byId("c2").notes = [{ t: TODAY + " 13:52", text: "ลูกค้าถอนบ่อย ตรวจเทิร์นก่อนทุกครั้ง", by: "admin02" }];
    byId("c2").extraWd = [{ amt: 500, time: "12:10", st: "รอทำรายการ" }];
    byId("c5").extraWd = [{ amt: 300, time: "11:20", st: "รอทำรายการ" }];
    byId("c9").extraDep = [{ amt: 200, time: "13:05", st: "รอเติมเงิน" }];
    byId("c12").extraDep = [{ amt: 350, time: "12:40", st: "รอตรวจสลิป" }, { amt: 100, time: "11:55", st: "รอเติมเงิน" }];
    byId("c15").extraWd = [{ amt: 300, time: "11:40", st: "รอทำรายการ" }];
    const now = Date.now();
    // แสดงครบทุกสีในคำอธิบาย (เจ้าของงานสั่ง 15 ต.ค. 2026): ฝาก c1 c9 · ถอน c2 c18 c5 · เรื่องทั่วไป c3 c17 c6 c19 · ปิดเคส c4 c8 · c7 · c16 = ลูกค้าจาก Telegram (Beta · Alpha)
    // c6 · c19 = ลูกค้าใหม่ยังไม่ผูกสมาชิก
    // เคสอื่นข้างบนเก็บไว้ ไม่แสดง — เพิ่ม id ใน SHOWN เพื่อเอากลับมา
    // c10–c15 = ผลตรวจสลิปครบทุกแบบ (จริง · ซ้ำ · อ่าน QR ไม่ได้ · ยังไม่พบรายการ · รอผล · ตรวจไม่สำเร็จ) ตามเว็บจริง 27 ต.ค. 2026
    const SHOWN = ["c1", "c9", "c2", "c18", "c3", "c17", "c6", "c19", "c5", "c4", "c8", "c7", "c16", "c10", "c11", "c12", "c13", "c14", "c15", "c20", "c21", "c22"];
    const shown = SHOWN.map(byId);
    // เคสที่ปิดแล้ว ⇒ แถบ "ปิดเคส โดย …" ต่อท้ายข้อความ (เว็บจริง: แถบอยู่ในลำดับข้อความ)
    shown.filter((c) => c.status === "closed" && !c.msgs.some((m) => m.action === "closed")).forEach((c) => c.msgs.push({ who: "sys", text: "", t: c.closedAt, action: "closed", by: c.closedBy }));
    shown.forEach((c) => {
        c.at = now - agoSecs(c.ago) * 1000; // เวลาข้อความล่าสุด (ms) — ใช้เรียงรายการแชท
        const n = c.user.no;
        c.histDep = makeHist(n, "dep");
        c.histWd = makeHist(n, "wd");
        c.credit = n % 3 === 0 ? 0 : Math.round(n * 125.5 * 100) / 100;
        if (n % 4 === 0 || n % 4 === 1) c.turn = { need: 500 + n * 100, done: n * 37 };
        if (n % 4 === 0 || n % 4 === 2) c.promo = ["โปรสมาชิกใหม่ 100%", "โปรฝากทุกวัน 10%", "โปรคืนยอดเสีย"][n % 3];
    });
    byId("c18").turn = { need: 3000, done: 1200 };
    byId("c18").promo = "โปรสมาชิกใหม่ 100%";
    // c10 สลิปจริง ⇒ ใช้เป็นตัวอย่างเติมเครดิตในคู่มือ (ไม่ติดโปร จึงปรับเครดิตได้)
    byId("c10").promo = null;
    byId("c20").promo = null; // c20 เติมเงินตามสลิปแล้ว ⇒ ไม่ติดโปร ให้ภาพไม่ขัดกับเงื่อนไขปรับเครดิต
    return shown;
}

export function seedAnnounces() {
    return [
        { id: 1, sort: 1, type: "ส่วนเสริม", name: "รับเรื่องแจ้งฝาก", text: "รับเรื่องแจ้งฝากเรียบร้อยค่ะ รบกวนรอแอดมินตรวจสอบยอดสักครู่นะคะ", status: "ยกเลิก" },
        { id: 2, sort: 1, type: "ส่วนเสริม", name: "แจ้งกรุงไทย", text: "กรุณาโอนเข้าบัญชีกรุงไทย 981-0-23476-5 ชื่อบัญชี บจก. เดโม่ กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 3, sort: 1, type: "ส่วนเสริม", name: "แจ้งไทยพาณิชย์", text: "กรุณาโอนเข้าบัญชีไทยพาณิชย์ 412-2-90564-1 ชื่อบัญชี บจก. เดโม่ กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 4, sort: 1, type: "ส่วนเสริม", name: "แจ้งกสิกร", text: "กรุณาโอนเข้าบัญชีกสิกรไทย 038-8-41275-6 ชื่อบัญชี บจก. เดโม่ กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
    ];
}

// บัญชีบริษัท (ใช้ใน CompanyAccountsBlock — ต้นฉบับประกาศไว้แต่ไม่ได้วางในแผงขวา)
export const COACC = [
    { bank: "KBANK", name: "บจก. เดโม่ กรุ๊ป", no: "038-8-41275-6" },
    { bank: "SCB", name: "บจก. เดโม่ กรุ๊ป", no: "412-2-90564-1" },
    { bank: "KTB", name: "บจก. เดโม่ กรุ๊ป", no: "981-0-23476-5" },
];
// ต้นฉบับประกาศตัวแปรนี้ไว้แต่ไม่ได้ใช้ที่ใด — เก็บไว้ครบตามต้นฉบับ
export const accounts = ["กสิกรไทย  038-8-41275-6", "ไทยพาณิชย์  412-2-90564-1"];

export const typeLabel = { deposit: "ฝาก", withdraw: "ถอน", general: "เรื่องทั่วไป" };
// แท็บ Payment = ฝาก/ถอน · เรื่องทั่วไปอยู่แท็บ Line
export const tabOf = (c) => (c.type === "deposit" || c.type === "withdraw" ? "payment" : "line");
export const cls = (c) => (c.status === "closed" ? "st-white" : c.type === "deposit" ? "st-yellow" : c.type === "withdraw" ? "st-orange" : "st-red");

export const nowT = () => new Date().toTimeString().slice(0, 5);
// ชื่อสติ๊กเกอร์จากรหัส: "789-5" = ชุด 789 ลำดับที่ 6 · "id-123" = Sticker ID ที่เพิ่มเอง
// Sticker ID แรกของชุดพื้นฐานใน LINE Messaging API (ลำดับในชุดเรียงต่อกัน) ⇒ ลิงก์รูปบน CDN ของ LINE
// ชุด 4 เลข Sticker ID ไม่ต่อเนื่อง ⇒ เก็บทั้งรายการ
const PACK_IDS = { 4: [260, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 272, 273, 274, 275, 276, 277, 278, 279, 280, 281, 282, 283, 284, 285, 286, 287, 288, 289, 290, 291, 292, 293, 294, 295, 296, 297, 298, 299, 300, 301, 302, 303, 304, 305, 306, 307, 601, 602, 603, 604, 605, 606, 607, 608, 609, 610, 611, 612, 613, 614, 615, 616, 617, 618, 619, 620, 621, 622, 623, 624, 625, 626, 627, 628, 629, 630, 631, 632] };
const PACK_FIRST = {
    3: 180,
    446: 1988, 789: 10855, 1070: 17839, 6136: 10551376, 6325: 10979904, 6359: 11069848,
    6362: 11087920, 6370: 11088016, 6632: 11825374, 8515: 16581242, 8522: 16581266, 8525: 16581290,
    11537: 52002734, 11538: 51626494, 11539: 52114110,
};
// คีย์สติ๊กเกอร์ 3 แบบ: "446-3" ลำดับในชุดของคลัง · "id-123" Sticker ID เดิม · "x-446-1990" packageId + stickerId (เพิ่มด้วย ID)
export const stickerSrc = (k) => {
    if (k.startsWith("tg-")) return "https://fonts.gstatic.com/s/e/notoemoji/latest/" + k.slice(3) + "/512.webp";
    const id = k.startsWith("x-") ? +k.split("-")[2] : k.startsWith("id-") ? +k.slice(3) : (PACK_IDS[k.split("-")[0]] ? PACK_IDS[k.split("-")[0]][+k.split("-")[1]] : PACK_FIRST[k.split("-")[0]] + +k.split("-")[1]);
    return id ? "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + id + "/android/sticker.png" : "";
};
export const isStickerKey = (k) => /^(\d+-\d+|id-\d+|x-\d+-\d+|tg-[0-9a-f_]+)$/.test(k || "");
const tgChar = (k) => k.slice(3).split("_").map((h) => String.fromCodePoint(parseInt(h, 16))).join("");
export const stickerLabel = (k) =>
    k.startsWith("tg-") ? "Telegram " + tgChar(k) : k.startsWith("x-") ? "ชุด " + k.split("-")[1] + " · ID " + k.split("-")[2] : k.startsWith("id-") ? "ID " + k.slice(3) : "ชุด " + k.split("-")[0] + " #" + (+k.split("-")[1] + 1);
// ข้อความสรุปของข้อความล่าสุดในรายการแชต
export const msgPreview = (m) =>
    m.action === "slip" ? "[สลิปโอนเงิน]" : m.action === "sticker" ? "[สติ๊กเกอร์]" : m.action === "image" ? "[รูปภาพ]" : m.action === "card" ? "[การ์ดข้อความ] " + m.card : m.text;
export const money = (v) => v.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

/* ผลตรวจสลิป (ตามเว็บจริง 27 ต.ค. 2026) — variant ของข้อความสลิปบอกว่าผู้ให้บริการตอบอะไร
   label = หัวผลในแผงขวา · short = ป้ายใต้รูปในแชท · hint = บอกแอดมินว่าต้องทำอะไรต่อ · retry = มีปุ่ม "ตรวจอีกครั้ง"
   detail = มีรายละเอียดจากสลิป (ยอด วันที่ ผู้โอน/ผู้รับ) */
export const VERDICT = {
    real: { label: "สลิปจริง", short: "จริง", tone: "success", detail: true },
    fake: { label: "สลิปปลอม", short: "ปลอม", tone: "destructive", detail: true, hint: "ผู้ให้บริการยืนยันว่าไม่ใช่สลิปที่ถูกต้อง — ไม่ต้องตรวจซ้ำ ห้ามเติมเครดิต" },
    dup: { label: "สลิปซ้ำ", short: "ซ้ำ", tone: "destructive", detail: true, hint: "เคยมีรูปสลิปใบนี้ส่งมาแล้วเมื่อ {when} — ห้ามเติมเครดิตซ้ำ" },
    notfound: { label: "ยังไม่พบรายการ", short: "ยังไม่พบ", tone: "warning", retry: true, hint: "ธนาคารยังไม่มีรายการนี้ — รอสักครู่แล้วกด “ตรวจอีกครั้ง”" },
    noqr: { label: "อ่าน QR ไม่ได้", short: "ไม่มี QR", tone: "warning", hint: "อ่าน QR ในรูปไม่ได้ — ขอรูปสลิปที่เห็น QR ชัดเจนจากลูกค้า" },
    wait: { label: "รอผลตรวจ", short: "รอผล", tone: "info", retry: true, hint: "ผู้ให้บริการยังตรวจไม่เสร็จ — รอสักครู่แล้วกด “ตรวจอีกครั้ง”" },
    error: { label: "ตรวจไม่สำเร็จ", short: "ตรวจไม่ได้", tone: "warning", retry: true, hint: "ผู้ให้บริการตรวจสลิปขัดข้องหรือไม่ว่าง — กด “ตรวจอีกครั้ง”" },
};
export const verdictOf = (s) => VERDICT[(s && s.v) || "real"] || VERDICT.real;
// ผลตรวจ — อ่านจากรูปสลิปที่ลูกค้าส่ง (SLIPS) · ผลตาม variant ของข้อความ · by = แอดมินที่กดตรวจ
export function slipData(sm, by) {
    const v = VERDICT[sm.variant] ? sm.variant : "real";
    return { ...slipOf(sm), state: "ready", v, fake: v === "fake" || v === "dup", by, dupAt: sm.dupAt, idx: sm.idx };
}

export function pendingDep(c) {
    const rows = [];
    if (c.type === "deposit" && c.status !== "closed" && c.claim) {
        const s = c.slip;
        const st2 = !s ? "รอลูกค้าโอนและส่งสลิป" : s.state === "pending" ? "รอตรวจสลิป" : s.state === "reading" ? "กำลังตรวจสลิป" : s.v === "real" ? "สลิปจริง รอเติมเงิน" : verdictOf(s).label + " รอตรวจสอบ";
        rows.push({ amt: c.claim, time: c.msgs.length ? c.msgs[c.msgs.length - 1].t : "", st: st2 });
    }
    return rows.concat(c.extraDep || []);
}
export function pendingWd(c) {
    const rows = [];
    if (c.type === "withdraw" && c.status !== "closed" && c.claim) rows.push({ amt: c.claim, time: c.msgs.length ? c.msgs[c.msgs.length - 1].t : "", st: c.status === "waiting" ? "รอทำรายการ" : "รอดำเนินการ" });
    return rows.concat(c.extraWd || []);
}

function histKey(r) {
    const m = /^(\d+) .* (\d+):(\d+)$/.exec(r.time);
    return m ? +m[1] * 10000 + +m[2] * 100 + +m[3] : 0;
}
export function histAll(c) {
    const all = c.histDep.map((r) => ({ r, k: "dep" })).concat(c.histWd.map((r) => ({ r, k: "wd" })));
    return all.sort((a, b) => histKey(b.r) - histKey(a.r));
}
export function histSums(items) {
    let d = 0, w = 0;
    items.forEach((x) => {
        if (x.r.ok) {
            if (x.k === "dep") d += x.r.amt;
            else w += x.r.amt;
        }
    });
    return "ฝากสำเร็จ " + d.toFixed(2) + " · ถอนสำเร็จ " + w.toFixed(2) + " บาท";
}
export function accountsOf(c) {
    const n = c.user.no || 1, cnt = 1 + (n % 5);
    // st = สถานะอนุมัติบัญชี (อนุมัติ · รออนุมัติ · ไม่อนุมัติ) · nm = ชื่อบัญชีตรงกับสมาชิก (เว็บต้นฉบับ 15 ต.ค. 2026)
    const out = [{ bank: c.user.bankCode, no: c.user.number, main: true, st: "อนุมัติ", nm: true }];
    for (let k = 1; k < cnt; k++) out.push({ bank: BANKS[(n + k) % BANKS.length].code, no: acctNo(n * 10 + k), main: false, st: ["อนุมัติ", "รออนุมัติ", "ไม่อนุมัติ"][(n + k) % 3], nm: (n + k) % 4 !== 0 });
    return out;
}

/* ---------- settings ---------- */
// เปลี่ยนรหัสผ่าน (pw) = รหัสของ Agent / แอดมินที่ล็อกอินอยู่ — เปิดเป็นแท็บตาม Flow ใน Figma (เจ้าของงาน 14 ต.ค. 2026)
// เว็บต้นฉบับ 15 ต.ค. 2026: เพิ่ม "ตั้งค่าทั่วไป" · เอาแท็บ บัญชี และ โพสต์ Telegram ออก · ท้ายเมนูมีลิงก์ไปหน้า Line Liff (ใน SettingsPage)
// เว็บจริง 27 ต.ค. 2026: เมนูตั้งค่า LINE = ทั่วไป · ชุดสติ๊กเกอร์ · คีย์ลัด · ข้อความอัตโนมัติ · คู่มือ — Telegram ไม่มีชุดสติ๊กเกอร์ แต่มีหน้า Telegram Bot
//   (Broadcast / เปลี่ยนรหัสผ่าน ยังมีหน้าอยู่แต่ไม่แสดงในเมนู · ช่องที่ 4 = แสดงเฉพาะ line | telegram)
export const SET_TABS = [
    ["gen", SettingsIcon, "ตั้งค่าทั่วไป"], ["stk", StickerIcon, "ชุดสติ๊กเกอร์", "line"], ["qr", ZapIcon, "คีย์ลัด"], ["am", BotIcon, "ข้อความอัตโนมัติ"],
    ["gd", BookOpenIcon, "คู่มือแอดมิน"],
];
// คู่มือการใช้งาน: เนื้อหาชุดเดียว (GUIDE) ทุก Channel / Agent เปิดอ่านจากที่เดียวกัน (เจ้าของงานให้กลับมาอยู่ในเมนูตั้งค่า 29 ต.ค. 2026)
// บอท Telegram ที่เชื่อมกับ Channel (ต้นแบบ) — null = ยังไม่เชื่อม ⇒ หน้า Telegram Bot แสดงขั้นตอนและช่องวาง Token
// หน้า Telegram Bot มีในระบบแต่ไม่อยู่ในเมนูตั้งค่า (เว็บจริง 27 ต.ค. 2026: เปิดได้จากลิงก์ /settings/telegram เท่านั้น)
export const TG_BOTS = { "alphatg": { user: "alpha_support_bot", at: "20/10/2569 14:05:12", by: "admin01" }, "betatg": null };
// ชุดสติ๊กเกอร์พื้นฐานใน LINE Messaging API — 15 ชุด (เว็บต้นฉบับ 15 ต.ค. 2026 · เดิม 6)
/* สติ๊กเกอร์สำหรับ Channel Telegram (เจ้าของงานขอ 15 ต.ค. 2026) — คีย์ "tg-<รหัสอีโมจิ>"
   ⚠ ต้นแบบ: ดึงสติ๊กเกอร์ Telegram จริงต้องใช้ Bot API (getStickerSet + getFile) ด้วย bot token ของ OA ฝั่งเซิร์ฟเวอร์ ⇒ ต้นแบบนี้ใช้
   Noto Animated Emoji ของ Google (CC BY 4.0 · ภาพเคลื่อนไหวแบบอีโมจิ Telegram) จาก fonts.gstatic.com แทน · ทุกรหัสทดสอบแล้วว่าโหลดได้ */
export const TG_PACKS = [
    { id: "tgface", name: "หน้ายิ้ม", codes: ["1f600", "1f603", "1f604", "1f601", "1f606", "1f605", "1f602", "1f923", "1f60a", "1f607", "1f642", "1f609", "1f60d", "1f970", "1f618", "1f60e", "1f914", "1f62e", "1f97a", "1f62d"] },
    { id: "tghand", name: "ท่าทาง", codes: ["1f44d", "1f44e", "1f44f", "1f64f", "1f44b", "1f44c", "270c_fe0f", "1f91e", "1f4aa", "1f64c", "1f449", "1f446", "1f447", "270d_fe0f", "1f91d"] },
    { id: "tgheart", name: "หัวใจ & ฉลอง", codes: ["2764_fe0f", "1f9e1", "1f49b", "1f49a", "1f499", "1f49c", "1f496", "1f525", "2728", "1f389", "1f38a", "1f381", "1f3c6", "1f31f", "1f4af"] },
    { id: "tgluck", name: "เงิน & โชค", codes: ["1f4b8", "1f911", "1f48e", "1f4c8", "1f3b0", "1f340", "1f680", "1f514", "23f3", "2705", "274c", "1f973", "1f929", "1faf6"] },
];
// คลังสติ๊กเกอร์ LINE ตามเว็บจริง 27 ต.ค. 2026 (9 ชุด)
export const PACKS = [[3, 80], [4, 80], [446, 40], [789, 40], [6359, 24], [8522, 24], [11537, 40], [11538, 40], [11539, 40]];
/* อิโมจิ (ปุ่มอิโมจิของแชท Telegram และแท็บอิโมจิในแผงสติ๊กเกอร์ LINE) — 4 หมวด หมวดละ 26 ตัว ตามเว็บจริง 27 ต.ค. 2026 */
export const EMOJI = [
    ["😊 ยิ้ม", "😊 😄 😂 🤣 😅 😍 🥰 😘 😎 🤩 😇 🙏 👍 👌 ✅ ❤️ 💕 💯 🔥 ⭐ 🎉 🎊 🥳 💰 💸 🏆"],
    ["💬 สนทนา", "✍️ 📝 📞 📲 💬 🔔 📢 📣 ℹ️ ❓ ❗ ✔️ ➕ ➖ 🆗 🆒 🆕 🆙 🔴 🟡 🟢 🔵 ⚠️ 🚫 ✅ ❌"],
    ["🏦 การเงิน", "💰 💳 🏦 💵 💴 💶 💷 💸 🤑 📈 📉 📊 🪙 💹 🧾 🏧 💲 ✅ ❌ ⏳ ⏰ 🔐 🔒 📌 🎯 🌟"],
    ["😢 อารมณ์", "😢 😭 😤 😡 🤔 😑 😶 🙄 😬 🤯 😱 😨 😰 😓 🥺 😔 😞 😣 😖 😫 😩 🤮 🤢 😴 😪 🤒"],
].map(([label, list]) => ({ label, list: list.split(" ") }));
// การ์ดข้อความ (ปุ่ม 💳 ในช่องพิมพ์) — ส่งการ์ดให้ลูกค้าในแชท
export const CARDS = [
    { name: "การ์ดโปรโมชั่น", desc: "โปรโมชั่นปัจจุบัน" },
    { name: "การ์ดวิธีฝากเงิน", desc: "ขั้นตอนการฝาก" },
    { name: "การ์ดวิธีสมัครสมาชิก", desc: "ขั้นตอนการสมัคร" },
];
export const TYPE_LBL = { text: "ข้อความ", sticker: "สติ๊กเกอร์", image: "รูปภาพ" };
// คู่มือแอดมิน (ตั้งค่า › คู่มือแอดมิน) — เหลือเฉพาะ "ปัญหาที่พบบ่อย" (เจ้าของงานสั่ง 29 ต.ค. 2026)
//   เนื้อหายกมาจากคู่มือ HTML · รูปแยกไว้ที่ static/guide (แคปจากแอปปัจจุบัน ไม่ปนกับรูปของคู่มือ HTML) · รายการเป็น { q ปัญหา, cause สาเหตุ, fix วิธีแก้, img รูปจากคู่มือ, alt }
const MIMG = (f) => "/guide/" + f + ".webp?v=20261029j";
export const GUIDE = [
    [CircleHelpIcon, "ปัญหาที่พบบ่อย", [
        { q: "ส่งข้อความหาลูกค้าไม่ได้", img: MIMG("lineoa-down"), alt: "การ์ด LINE ขาดการเชื่อมต่อ วงป้ายและปุ่ม Verify", cause: "LINE ขาดการเชื่อมต่อ หรือผู้ช่วย (OA) หมดอายุ การ์ด LINE และผู้ช่วย (OA) ในแผงขวาจะกางออกพร้อมป้ายสีแดง", fix: "กด Verify หรือ QR Login แล้วเข้าสู่ระบบใหม่ จากนั้นกด \"เช็คทั้งหมด\" เพื่อตรวจผู้ช่วยทุกคน ถ้ายังส่งไม่ได้ ให้แจ้งหัวหน้าทีม" },
        { q: "ไม่เห็นแชทของบาง Channel", img: MIMG("filter"), alt: "แผงเลือกแชทที่แสดง วงช่องทั้งหมด", cause: "ไม่ได้เลือก Channel นั้นในแผง \"เลือกแชทที่แสดง\"", fix: "กด \"เลือกแชทที่แสดง\" แล้วเลือก Channel ที่ต้องการ หรือเลือก \"ทั้งหมด\"" },
        { q: "ไม่มีเสียงแจ้งเตือนเมื่อลูกค้าส่งข้อความ", img: MIMG("set-sound"), alt: "วงการ์ดเสียงแจ้งเตือน", cause: "ปิดเสียงไว้ หรือเบราว์เซอร์ยังไม่อนุญาตให้เล่นเสียง", fix: "ตรวจปุ่มลำโพงบนแถบบน แล้วเปิดเสียงในตั้งค่าทั่วไปและกด \"ทดสอบเสียง\" ถ้าเพิ่งเปิดหน้าเว็บ ให้คลิกที่หน้าเว็บ 1 ครั้งก่อน" },
        { q: "ปิดเคสแล้วลูกค้าไม่ได้รับข้อความปิดเคส", img: MIMG("set-closeset"), alt: "วงปุ่มใช้ชุดนี้และปุ่มหยุดใช้ชุดนี้", cause: "บันทึกชุดข้อความไว้แต่ยังไม่ได้เลือกใช้ หรือกดหยุดใช้ชุดไว้", fix: "ในตั้งค่าทั่วไป กด \"ใช้ชุดนี้\" ที่ชุดข้อความที่ต้องการ" },
        { q: "กดปุ่ม \"ปิดเคส\" ไม่ได้", img: MIMG("close-other"), alt: "วงป้ายรับโดยแอดมินคนอื่นและปุ่มปิดเคส", cause: "แอดมินคนอื่นรับเคสนี้ไว้ ดูชื่อได้ที่ป้าย \"รับโดย …\" บนหัวห้องแชท", fix: "ให้คนที่รับเคสเป็นคนปิด" },
        { q: "ไม่มีปุ่มคีย์ลัดใต้ห้องแชท", img: MIMG("set-quick"), alt: "วงปุ่มติดดาวคีย์ลัด", cause: "ยังไม่ได้ติดดาวคีย์ลัด", fix: "ไปที่ตั้งค่า › คีย์ลัด แล้วกด \"ติ๊กดาว\" ที่คีย์ลัดที่ต้องการ" },
        { q: "ข้อความอัตโนมัติไม่ตอบ", img: MIMG("set-auto"), alt: "วงสวิตช์เปิดปิดข้อความอัตโนมัติ", cause: "รายการนั้นปิดอยู่ หรือตั้งเป็น \"ตรงทั้งข้อความ\" แต่ลูกค้าพิมพ์คำอื่นปนมา", fix: "ตรวจว่าสวิตช์เปิดอยู่ หรือเปลี่ยนเป็นแบบ \"มีคำนี้\"" },
        { q: "ตรวจสลิปแล้วแสดง \"ยังไม่พบรายการ\" หรือ \"รอผลตรวจ\"", img: MIMG("slip-notfound"), alt: "วงผลตรวจยังไม่พบรายการและปุ่มตรวจอีกครั้ง", cause: "ธนาคารยังไม่มีรายการนี้ หรือผู้ให้บริการยังตรวจไม่เสร็จ", fix: "รอสักครู่แล้วกด \"ตรวจอีกครั้ง\" ถ้าแสดงว่าอ่าน QR ไม่ได้ ให้ขอรูปสลิปที่เห็น QR ชัดเจนจากลูกค้า" },
        { q: "ค้นหาสมาชิกไม่พบ", img: MIMG("member-notfound"), alt: "วงช่องค้นหาและข้อความไม่พบสมาชิก", cause: "พิมพ์ผิด หรือลูกค้ายังไม่ได้สมัคร", fix: "ตรวจตัวสะกดและเบอร์โทร ถ้าลูกค้ายังไม่เป็นสมาชิก ให้สมัครให้ที่การ์ด \"สมัครสมาชิก Player\"" },
        { q: "รูปหรือวิดีโอที่ลูกค้าส่งมาไม่แสดง", img: MIMG("media-reload"), alt: "วงกรอบรูปภาพที่มีปุ่มโหลดรูปใหม่ และกรอบวิดีโอที่มีปุ่มโหลดวิดีโอใหม่", cause: "ไฟล์ยังโหลดไม่เสร็จหรือโหลดไม่สำเร็จ ห้องแชทจะแสดงเป็นกรอบรูปภาพหรือกรอบวิดีโอแทนตัวไฟล์", fix: "กด \"โหลดรูปใหม่\" หรือ \"โหลดวิดีโอใหม่\" ในกรอบนั้น (แชท Telegram ไม่มีปุ่มนี้)" },
        { q: "ปรับเครดิตไม่ได้", img: MIMG("credit-error"), alt: "วงข้อความสมาชิกกำลังติดโปรโมชั่น", cause: "สมาชิกติดโปรโมชั่น ถอนเกินเครดิตคงเหลือ หรือรหัสผ่านแอดมินไม่ถูกต้อง", fix: "อ่านข้อความสีแดงใต้ช่อง ถ้าสมาชิกติดโปรโมชั่น ต้องรอให้โปรโมชั่นสิ้นสุดก่อน หรือแจ้งหัวหน้าทีม" },
    ]],
];

/* ---------- menu — ไอคอน lucide นำหน้าทุกรายการ (DESIGN-SYSTEM §10.1 · แทนจุดสีของต้นฉบับ) ---------- */
// เว็บจริง 27 ต.ค. 2026: เมนู ☰ = ชื่อแอดมิน · หน้าหลัก · ออกจากระบบ (รายการอื่นเอาออกจากเว็บจริงแล้ว)
export const MENU_GROUPS = [[["หน้าหลัก", HouseIcon, "home"]], [["ออกจากระบบ", LogOutIcon, "logout"]]];
export const MENU_GROUPS_OLD = [
    [["หน้าหลัก", HouseIcon, "home"]],
    [["จัดการข้อความอัตโนมัติ", MessageSquareTextIcon, "announce"], ["Telegram post", SendIcon, "x"]], // Telegram post ไม่มีหน้าในตั้งค่าแล้ว (เว็บต้นฉบับ 15 ต.ค. 2026)
    [["จัดการไลน์", MessageCircleIcon, "x"]],
    [["จัดการแอดมิน", UserCogIcon, "x"], ["คู่มือการใช้งาน", BookOpenIcon, "gd"], ["จัดการสติ๊กเกอร์", StickerIcon, "stk"]],
    [["อัพเดต", RefreshCwIcon, "update"], ["เคลียร์ภาพ", ImageOffIcon, "clear"]],
    [["เปลี่ยนรหัสผ่าน", KeyRoundIcon, "pw"], ["ออกจากระบบ", LogOutIcon, "logout"]],
];
export const SETMAP = { gd: "gd", stk: "stk", pw: "pw" };
