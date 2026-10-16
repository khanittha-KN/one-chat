// ข้อมูลตัวอย่าง (mock) ของ OneChat — ยกมาจากต้นฉบับครบทุกค่า ทุกข้อความ ทุกตัวสร้างข้อมูล
// ไอคอนใช้ lucide (ชุดไอคอนของ shadcn) แทนอีโมจิของต้นฉบับ
import StickerIcon from "@lucide/svelte/icons/sticker";
import BuildingIcon from "@lucide/svelte/icons/building-2";
import InboxIcon from "@lucide/svelte/icons/inbox";
import ReceiptIcon from "@lucide/svelte/icons/receipt";
import SettingsIcon from "@lucide/svelte/icons/settings";
import ZapIcon from "@lucide/svelte/icons/zap";
import MegaphoneIcon from "@lucide/svelte/icons/megaphone";
import BotIcon from "@lucide/svelte/icons/bot";
import SendIcon from "@lucide/svelte/icons/send";
import BookOpenIcon from "@lucide/svelte/icons/book-open";
import MessageCircleIcon from "@lucide/svelte/icons/message-circle";
import UserSearchIcon from "@lucide/svelte/icons/user-search";
import HouseIcon from "@lucide/svelte/icons/house";
import MessageSquareTextIcon from "@lucide/svelte/icons/message-square-text";
import UserCogIcon from "@lucide/svelte/icons/user-cog";
import RefreshCwIcon from "@lucide/svelte/icons/refresh-cw";
import ImageOffIcon from "@lucide/svelte/icons/image-off";
import KeyRoundIcon from "@lucide/svelte/icons/key-round";
import LogOutIcon from "@lucide/svelte/icons/log-out";
import WalletIcon from "@lucide/svelte/icons/wallet";

export const ME = "admin01";
// วันที่วันนี้แบบ วว/ดด/ปป (พ.ศ.) — ใช้ใต้ฟองแชทและในโน้ต (เว็บต้นฉบับ 15 ต.ค. 2026: "15/10/69 14:35")
const d0 = new Date();
export const TODAY = String(d0.getDate()).padStart(2, "0") + "/" + String(d0.getMonth() + 1).padStart(2, "0") + "/" + String((d0.getFullYear() + 543) % 100).padStart(2, "0");
// วันที่ในรายการสนทนา แบบ "15 Oct" (เจ้าของงานสั่ง 15 ต.ค. 2026 — แสดงเป็น "15 Oct - 13:30")
export const DAY_SHORT = d0.getDate() + " " + d0.toLocaleString("en-US", { month: "short" });

// Channel ของเว็บ — LINE OA หรือ Telegram (platform · เจ้าของงานสั่งเพิ่ม Telegram 15 ต.ค. 2026) · เว็บละหลายช่อง ตั้งชื่อตามเว็บ (เจ้าของงานให้ม็อคอัพแบบนี้ 14 ต.ค. 2026: "LSM55Goal → 55Goal 1 · สำรอง · VIP · Support")
// id = LINE ID ที่แสดงเป็น @id บนหัวห้องแชทและการ์ดสถานะไลน์ · เรียงตามเว็บ แล้วตามลำดับช่อง
export const merchants = [
    { id: "55goal1", name: "55Goal 1", chats: 3482, platform: "line" },
    { id: "55goal2", name: "55Goal สำรอง", chats: 4863, platform: "line" },
    { id: "55goalvip", name: "55Goal VIP", chats: 59216, platform: "line" },
    { id: "55goalcs", name: "55Goal Support", chats: 2371, platform: "line" },
    { id: "55goaltg", name: "55Goal Telegram", chats: 1284, platform: "telegram" },
    { id: "99queen1", name: "99Queen 1", chats: 25422, platform: "line" },
    { id: "99queen2", name: "99Queen สำรอง", chats: 14912, platform: "line" },
    { id: "99queenvip", name: "99Queen VIP", chats: 5982, platform: "line" },
    { id: "99queencs", name: "99Queen Support", chats: 18107, platform: "line" },
    { id: "99queentg", name: "99Queen Telegram", chats: 932, platform: "telegram" },
    // OA ใหม่ที่ยังไม่มีใครทัก — ตัวอย่างผู้รับ Broadcast ว่าง (เจ้าของงานขอ 15 ต.ค. 2026)
    { id: "99queenpromo", name: "99Queen โปรโมชั่น", chats: 0, platform: "line" },
    // ⚠ 2 ช่องนี้ไม่มีในต้นฉบับ — ทดสอบ Channel ที่ใช้ LINE LIFF เท่านั้น (ไม่มีแชต ⇒ ไม่แสดงในแผงซ้าย)
    { id: "99queenmember", name: "99Queen Member", chats: 0, platform: "line" },
    { id: "88kingpromo", name: "88King Promo", chats: 0, platform: "line" },
];
export const merch = (id) => merchants.filter((m) => m.id === id)[0];
export const chanByName = (name) => merchants.filter((m) => m.name === name)[0];
// ช่องทางของ Channel — ใช้กับสัญลักษณ์ ui/PlatformIcon และข้อความ "ส่งทาง …"
export const PLATFORM = { line: "LINE", telegram: "Telegram" };
export const platformOf = (id) => (merch(id) || {}).platform || "line";

/* ---------- Organization → Agent → LINE Channel (เอกสารส่งต่องาน 9 ต.ค. 2026 ฉบับแก้) ----------
   ⚠ ข้อมูลสมมติทั้งหมด — ของจริงต้องจัดกลุ่มด้วยรหัส Org · Agent · Channel ของระบบ ไม่เดาจากชื่อหรือเลข
   · Agent = ชื่อเว็บ (เช่น LSM55Goal) · รายการใน merchants = LINE Channel ของเว็บนั้น เว็บละกี่ช่องก็ได้ (เจ้าของงานยืนยัน 9 และ 14 ต.ค. 2026) ⇒ ไม่มีข้อมูลเว็บแยกจาก Agent
   · ฟังก์ชันอ่านแยกต่อ Channel: chat (แชทรวม) · liff (LINE LIFF) — Agent เดียวกันเปิดต่างกันได้ · เปิดแชทไม่ได้แปลว่าปิด LIFF
   · checkbox ในหน้าแชตเป็นตัวกรองรายการสนทนาเท่านั้น ไม่แตะค่าฟังก์ชันหรือ Permissions
   · ต้นแบบนี้ไม่มีระบบสิทธิ์ ⇒ ผู้ใช้เห็นทุก Channel (ของจริงกรองด้วยสิทธิ์เดิมก่อนแสดง) */
export const org = { id: "org1", name: "LSM Group" };
export const agents = [
    { id: "agA", org: "org1", name: "LSM55Goal" },
    { id: "agB", org: "org1", name: "LSM99Queen" },
    { id: "agC", org: "org1", name: "LSM88King" },
];
const CHANNEL_META = {
    "55goal1": { agent: "agA", chat: true, liff: false },
    "55goal2": { agent: "agA", chat: true, liff: true },
    "55goalvip": { agent: "agA", chat: true, liff: false },
    "55goalcs": { agent: "agA", chat: true, liff: false },
    "55goaltg": { agent: "agA", chat: true, liff: false }, // Telegram ไม่มี LIFF
    "99queen1": { agent: "agB", chat: true, liff: false },
    "99queen2": { agent: "agB", chat: true, liff: false },
    "99queenvip": { agent: "agB", chat: true, liff: true },
    "99queencs": { agent: "agB", chat: true, liff: false },
    "99queentg": { agent: "agB", chat: true, liff: false },
    "99queenpromo": { agent: "agB", chat: true, liff: false },
    "99queenmember": { agent: "agB", chat: false, liff: true },
    "88kingpromo": { agent: "agC", chat: false, liff: true }, // LSM88King ไม่มี Channel สำหรับแชต ⇒ ไม่แสดงทั้งกลุ่ม
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
export const lineNo = { "55goal1": 11, "99queen1": 12, "99queenvip": 13, "55goal2": 14, "99queen2": 26, "55goalvip": 31, "99queencs": 32, "55goalcs": 33 };

// โลโก้ธนาคาร: รูปโลโก้จริงจาก github.com/omise/banks-logo (MIT · static/banks/<code>.svg · เจ้าของงานให้ใช้ 14 ต.ค. 2026)
// bg = สีประจำธนาคารตาม banks.json ของ omise · fg = สีโลโก้ (กรุงศรีพื้นเหลืองใช้โลโก้สีเข้ม)
// TTB: banks.json ให้ #ECF0F1 (เทาอ่อน) โลโก้ขาวจะหาย ⇒ ใช้กรมท่า #002D63 ของ ttb แทน
/* ผู้ติดตาม / ห้องแชทของ Channel สำหรับเลือกผู้รับ Broadcast (ข้อมูลจำลอง · เจ้าของงานขอ 15 ต.ค. 2026)
   แสดงสถานการณ์ครบ: ว่าง (99Queen โปรโมชั่น 0 คน) · น้อย · เยอะ (55Goal VIP 150 คน · 99Queen 1 80 คน)
   ระบบจริงดึงรายชื่อห้องแชทของ OA จาก API · id ไม่ซ้ำกับ id เคส (ขึ้นต้นด้วย id ของ Channel) */
const FOLLOWERS = { "55goalvip": 150, "99queen1": 80, "55goal1": 36, "99queen2": 24, "99queenvip": 18, "55goal2": 12, "99queencs": 9, "55goalcs": 6, "55goaltg": 4, "99queentg": 3, "99queenpromo": 0 };
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
];
export const usernameOf = (n) => (PEOPLE[n - 1] ? PEOPLE[n - 1][0] : "member" + String(n).padStart(4, "0"));
// เลขบัญชี 10 หลักแบบ XXX-X-XXXXX-X และเบอร์มือถือ ที่คงที่ตามลำดับลูกค้า (ไม่สุ่มใหม่ทุกครั้งที่โหลด)
const digits = (seed, len) => String((seed * 2654435761) % 10 ** len).padStart(len, "0");
export const acctNo = (seed) => {
    const d = digits(seed + 7, 10);
    return d.slice(0, 3) + "-" + d[3] + "-" + d.slice(4, 9) + "-" + d[9];
};
const mobileOf = (n) => "0" + "896"[n % 3] + digits(n + 3, 1) + "-" + digits(n * 11 + 5, 3) + "-" + digits(n * 13 + 1, 4);

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
        fromName: "ผัว", fromBank: "KBANK", fromNo: "xxx-x-x7364-x", toName: "เมีย", toBank: "SCB", toNo: "xxx-x-x4612-x",
    },
    bbl: {
        src: "/slips/bbl-400000.png", w: 452, h: 678, amt: 400000, date: "25 มี.ค. 2568", time: "13:13 น.", ref: "20250325131352300012234567",
        fromName: "WARREN BUFFETT", fromBank: "BBL", fromNo: "012-3-xxx45", toName: "KAFAAK", toBank: "BBL", toNo: "000-0-xxx000",
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
    c.msgs.push(slipMsg(img, "14:30", { variant }));
    c.slip = { state: "pending", amt: SLIPS[img].amt, variant };
    return c;
}

export function seedCases() {
    const cases = [
        { id: "c1", name: "Pim Pimchanok", type: "deposit", merchant: "99queen2", status: "waiting", admin: null, secs: 128, ago: "2 นาที", lineOk: true, wd: 0, user: mkUser(1),
            msgs: [{ who: "cust", text: "สวัสดีค่ะ", t: "13:45" }, { who: "cust", text: "ขอแจ้งฝากหน่อยค่ะ ยูส " + usernameOf(1) + " ฝาก 253 บาทค่ะ", t: "13:46" }, { who: "cust", text: "ต้องโอนเข้าบัญชีไหนคะ", t: "13:46" }] },
        { id: "c2", name: "Nattaya.T", type: "withdraw", merchant: "55goalvip", status: "open", admin: "admin02", secs: 35, ago: "5 นาที", lineOk: true, wd: 2, user: mkUser(2),
            msgs: [{ who: "cust", text: "ขอถอนเงินหน่อยค่ะ", t: "13:47" }, { who: "cust", text: "ถอน200", t: "13:48" }, { who: "cust", text: "ถอนแล้วยังไม่เข้าเลยค่ะ", t: "13:49" }] },
        { id: "c3", name: "แนน กนกวรรณ", type: "general", merchant: "99queencs", status: "open", admin: "admin03", secs: 12, ago: "9 นาที", lineOk: false, wd: 0, user: mkUser(3),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นหน่อยค่ะ", t: "13:50" }, { who: "cust", text: "ทักไปหลายรอบแล้วไม่เห็นตอบเลยค่ะ", t: "13:51" }, { who: "sys", text: "ไลน์หลุด กรุณากด Verify ที่แผงขวา", t: "13:51" }] },
        { id: "c4", name: "Ploy", type: "deposit", merchant: "55goal1", status: "closed", admin: "admin02", secs: 210, ago: "36 นาที", lineOk: true, wd: 0, user: mkUser(4),
            msgs: [{ who: "cust", text: "ฝาก " + said("kbank") + " ค่ะ", t: "13:10" }, { who: "admin", by: "admin02", text: ACC, t: "13:11" }, { who: "cust", text: "โอนแล้วค่ะ", t: "13:13" }, slipMsg("kbank", "13:13", { checked: true }), { who: "sys", text: "เติมเงิน " + money(SLIPS.kbank.amt) + " บาท ให้ " + usernameOf(4) + " เรียบร้อย", t: "13:14" }, { who: "cust", text: "ได้รับแล้วค่ะ ขอบคุณค่ะ", t: "13:15" }], closedBy: "admin02", closedAt: "13:19" },
        { id: "c5", name: "เบญ", type: "withdraw", merchant: "55goal2", status: "waiting", admin: null, secs: 64, ago: "1 นาที", lineOk: true, wd: 0, user: mkUser(5),
            msgs: [{ who: "cust", text: "ขอถอน 500 ค่ะ", t: "13:52" }, { who: "cust", text: "รอนานแล้วนะคะ ยังไม่เข้าเลย", t: "13:53" }] },
        { id: "c6", name: "Mintra S.", type: "general", merchant: "55goalcs", status: "waiting", admin: null, secs: 20, ago: "20 วินาที", lineOk: true, wd: 0, user: mkUser(6),
            msgs: [{ who: "cust", text: "สมัครสมาชิกยังไงคะ", t: "13:55" }, { who: "cust", text: "มีโปรสมาชิกใหม่ไหมคะ", t: "13:55" }] },
        { id: "c7", name: "ณัฐชา", type: "deposit", merchant: "99queentg", status: "open", admin: "admin01", secs: 80, ago: "14 นาที", lineOk: true, wd: 0, user: mkUser(7),
            msgs: [{ who: "cust", text: "สวัสดีค่ะ", t: "13:36" }, { who: "admin", by: "admin01", text: "สวัสดีค่ะ ต้องการแจ้งฝากใช่ไหมคะ", t: "13:37" }, { who: "cust", text: "ใช่ค่ะ ฝาก " + said("bbl"), t: "13:38" }, { who: "admin", by: "admin01", text: ACC, t: "13:39" }, { who: "cust", text: "โอนแล้วนะคะ", t: "13:40" }, slipMsg("bbl", "13:41", { variant: "real" })] },
        { id: "c8", name: "Somchai", type: "general", merchant: "55goalvip", status: "closed", admin: "admin03", secs: 95, ago: "11 ชม.", lineOk: true, wd: 0, user: mkUser(8),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นฝากครั้งแรกหน่อยครับ", t: "12:25" }, { who: "admin", by: "admin03", text: "ฝากครั้งแรกรับโบนัสตามเงื่อนไขโปรโมชั่นค่ะ", t: "12:27" }, { who: "cust", text: "ขอบคุณครับ", t: "12:30" }], closedBy: "admin03", closedAt: "12:41" },
    ];
    cases[0].claim = 253;
    cases[1].claim = 200;
    cases[4].claim = 500;
    cases[6].claim = SLIPS.bbl.amt;
    cases[6].slip = { state: "pending", amt: SLIPS.bbl.amt, variant: "real" };
    // รูปสลิปสลับกัน (kbank · bbl) ไม่ผูกกับผลจริง/ปลอม · ยอดในข้อความ ({amt}) และยอดค้างมาจากรูปสลิป
    cases.push(
        mkSlipCase("c9", 9, "กฤษดา บุญมา", "deposit", "99queen2", "open", "admin01", 70, "3 นาที", "kbank", "fake", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin01"], ["cust", "โอนแล้วครับ"]]),
        mkSlipCase("c10", 10, "Thanawat W.", "deposit", "99queen1", "open", "admin02", 55, "4 นาที", "bbl", "real", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin02"], ["cust", "โอนจากบัญชีแฟนครับ"]]),
        mkSlipCase("c11", 11, "อาร์ต", "deposit", "99queenvip", "open", "admin03", 90, "6 นาที", "kbank", "real", [["cust", "ฝาก {amt} นะครับ"], ["admin", ACC, "admin03"], ["cust", "โอนผ่านแอปอีกธนาคารครับ"]]),
        mkSlipCase("c12", 12, "วันชัย", "deposit", "55goal2", "open", "admin01", 40, "7 นาที", "bbl", "fake", [["cust", "ขอฝาก {amt} ครับ"], ["cust", "โอนเข้าบัญชีที่เคยใช้ครับ"]]),
        mkSlipCase("c13", 13, "Teerapat M.", "deposit", "55goalvip", "open", "admin02", 30, "8 นาที", "kbank", "real", [["cust", "ฝาก {amt} ครับ"], ["admin", ACC, "admin02"], ["cust", "โอนแล้วครับ"]]),
        mkSlipCase("c14", 14, "Sorawit", "withdraw", "99queencs", "open", "admin03", 20, "10 นาที", "bbl", "real", [["cust", "ถอน {amt} ครับ"], ["cust", "ส่งสลิปให้ตรวจสอบครับ"]]),
        mkSlipCase("c15", 15, "จิรภัทร", "withdraw", "55goal1", "open", "admin01", 25, "12 นาที", "kbank", "fake", [["cust", "ขอถอน {amt} ค่ะ"], ["cust", "ส่งสลิปให้แล้วนะคะ"]]),
        mkSlipCase("c16", 16, "Pongsak", "deposit", "55goaltg", "waiting", null, 15, "30 วินาที", "bbl", "fake", [["cust", "ฝาก {amt} ครับ"], ["cust", "โอนแล้วนะครับ"]]),
    );
    /* เคสสถานการณ์ใหม่จากเว็บต้นฉบับ (15 ต.ค. 2026) — ยูสโดนล็อก · ถอนติดเทิร์น · ลูกค้าใหม่ยังไม่ผูกสมาชิก */
    const line3 = (who, text, by) => ({ who, text, by });
    const mk = (id, n, name, type, merchant, status, admin, secs, ago, lines, extra) => {
        const c = { id, name, type, merchant, status, admin, secs, ago, lineOk: true, wd: 0, user: mkUser(n), msgs: [] };
        lines.forEach((l, i) => c.msgs.push({ ...l, t: "14:" + String(35 + i).padStart(2, "0") }));
        return Object.assign(c, extra || {});
    };
    cases.push(
        mk("c17", 17, "ณัฐพงษ์", "general", "55goal1", "open", "admin02", 45, "2 นาที", [
            line3("cust", "ยูสโดนล็อกครับ ขึ้นว่าล็อกอินผิดหลายครั้ง"),
            line3("admin", "ขอทราบยูสเซอร์ และชื่อ-นามสกุลที่สมัครไว้ด้วยนะคะ", "admin02"),
            line3("cust", "ยูส " + usernameOf(17) + " ครับ ชื่อ" + PEOPLE[16][1]),
        ]),
        mk("c18", 18, "Phakhin", "withdraw", "99queen1", "open", "admin03", 38, "3 นาที", [
            line3("cust", "ถอน 1000 ไม่ได้ครับ ขึ้นว่าไม่ผ่านเงื่อนไข"),
            line3("admin", "ตรวจสอบแล้ว ยอดเทิร์นยังไม่ครบตามโปรโมชั่นที่รับไว้ค่ะ", "admin03"),
            line3("cust", "ต้องทำเทิร์นอีกเท่าไหร่ครับ"),
        ], { claim: 1000 }),
        mk("c19", 19, "ชลิสา", "general", "99queenvip", "waiting", null, 12, "15 วินาที", [
            line3("cust", "สวัสดีค่ะ เพิ่งเห็นเพจนี้ค่ะ"),
            line3("cust", "ฝากขั้นต่ำเท่าไหร่คะ แล้วต้องสมัครก่อนไหม"),
        ], { unbound: true }),
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
    // แสดงครบทุกสีในคำอธิบาย (เจ้าของงานสั่ง 15 ต.ค. 2026): ฝาก c1 c9 · ถอน c2 c18 c5 · เรื่องทั่วไป c3 c17 c6 c19 · ปิดเคส c4 c8 · c7 · c16 = ลูกค้าจาก Telegram (99Queen · 55Goal)
    // c6 · c19 = ลูกค้าใหม่ยังไม่ผูกสมาชิก
    // เคสอื่นข้างบนเก็บไว้ ไม่แสดง — เพิ่ม id ใน SHOWN เพื่อเอากลับมา
    const SHOWN = ["c1", "c9", "c2", "c18", "c3", "c17", "c6", "c19", "c5", "c4", "c8", "c7", "c16"];
    const shown = SHOWN.map(byId);
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
    return shown;
}

export function seedAnnounces() {
    return [
        { id: 1, sort: 1, type: "ส่วนเสริม", name: "รับเรื่องแจ้งฝาก", text: "รับเรื่องแจ้งฝากเรียบร้อยค่ะ รบกวนรอแอดมินตรวจสอบยอดสักครู่นะคะ", status: "ยกเลิก" },
        { id: 2, sort: 1, type: "ส่วนเสริม", name: "แจ้งกรุงไทย", text: "กรุณาโอนเข้าบัญชีกรุงไทย 981-0-23476-5 ชื่อบัญชี บจก. แอลเอสเอ็ม กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 3, sort: 1, type: "ส่วนเสริม", name: "แจ้งไทยพาณิชย์", text: "กรุณาโอนเข้าบัญชีไทยพาณิชย์ 412-2-90564-1 ชื่อบัญชี บจก. แอลเอสเอ็ม กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 4, sort: 1, type: "ส่วนเสริม", name: "แจ้งกสิกร", text: "กรุณาโอนเข้าบัญชีกสิกรไทย 038-8-41275-6 ชื่อบัญชี บจก. แอลเอสเอ็ม กรุ๊ป แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
    ];
}

// บัญชีบริษัท (ใช้ใน CompanyAccountsBlock — ต้นฉบับประกาศไว้แต่ไม่ได้วางในแผงขวา)
export const COACC = [
    { bank: "KBANK", name: "บจก. แอลเอสเอ็ม กรุ๊ป", no: "038-8-41275-6" },
    { bank: "SCB", name: "บจก. แอลเอสเอ็ม กรุ๊ป", no: "412-2-90564-1" },
    { bank: "KTB", name: "บจก. แอลเอสเอ็ม กรุ๊ป", no: "981-0-23476-5" },
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
const PACK_FIRST = {
    446: 1988, 789: 10855, 1070: 17839, 6136: 10551376, 6325: 10979904, 6359: 11069848,
    6362: 11087920, 6370: 11088016, 6632: 11825374, 8515: 16581242, 8522: 16581266, 8525: 16581290,
    11537: 52002734, 11538: 51626494, 11539: 52114110,
};
// คีย์สติ๊กเกอร์ 3 แบบ: "446-3" ลำดับในชุดของคลัง · "id-123" Sticker ID เดิม · "x-446-1990" packageId + stickerId (เพิ่มด้วย ID)
export const stickerSrc = (k) => {
    if (k.startsWith("tg-")) return "https://fonts.gstatic.com/s/e/notoemoji/latest/" + k.slice(3) + "/512.webp";
    const id = k.startsWith("x-") ? +k.split("-")[2] : k.startsWith("id-") ? +k.slice(3) : PACK_FIRST[k.split("-")[0]] + +k.split("-")[1];
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

// ผลตรวจสลิป — อ่านจากรูปสลิปที่ลูกค้าส่ง (SLIPS) · จริง/ปลอมตาม variant ของข้อความ
export function slipData(sm) {
    return { ...slipOf(sm), state: "ready", fake: sm.variant === "fake" };
}

export function pendingDep(c) {
    const rows = [];
    if (c.type === "deposit" && c.status !== "closed" && c.claim) {
        const s = c.slip;
        const st2 = !s ? "รอลูกค้าโอนและส่งสลิป" : s.state === "pending" ? "รอตรวจสลิป" : s.state === "reading" ? "กำลังตรวจสลิป" : s.fake ? "สลิปปลอม รอตรวจสอบ" : "สลิปจริง รอเติมเงิน";
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
export const SET_TABS = [["gen", SettingsIcon, "ตั้งค่าทั่วไป"], ["stk", StickerIcon, "ชุดสติ๊กเกอร์"], ["qr", ZapIcon, "คีย์ลัด"], ["bc", MegaphoneIcon, "Broadcast (ยิงทั้งหมด)"], ["am", BotIcon, "ข้อความอัตโนมัติ"], ["pw", KeyRoundIcon, "เปลี่ยนรหัสผ่าน"], ["gd", BookOpenIcon, "คู่มือการใช้งาน"]];
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
export const PACKS = [[446, 40], [789, 40], [1070, 40], [6136, 24], [6325, 24], [6359, 24], [6362, 24], [6370, 24], [6632, 24], [8515, 24], [8522, 24], [8525, 24], [11537, 40], [11538, 40], [11539, 40]];
// การ์ดข้อความ (ปุ่ม 💳 ในช่องพิมพ์) — ส่งการ์ดให้ลูกค้าในแชท
export const CARDS = [
    { name: "การ์ดโปรโมชั่น", desc: "โปรโมชั่นปัจจุบัน" },
    { name: "การ์ดวิธีฝากเงิน", desc: "ขั้นตอนการฝาก" },
    { name: "การ์ดวิธีสมัครสมาชิก", desc: "ขั้นตอนการสมัคร" },
];
export const TYPE_LBL = { text: "ข้อความ", sticker: "สติ๊กเกอร์", image: "รูปภาพ" };
// คู่มือ — ตรงกับหน้าจอปัจจุบัน (ปรับ 15 ต.ค. 2026 ตามเว็บต้นฉบับ: แถบเครื่องมือช่องพิมพ์ · โน้ต · ผูกสมาชิก · การ์ดพับได้ · ตั้งค่าทั่วไป)
export const GUIDE = [
    [BuildingIcon, "เลือกแชทที่แสดง", [
        "กดปุ่ม \"เลือกแชทที่แสดง\" ใต้หัวข้อการสนทนา — แผงจะเลื่อนออกมาจากด้านซ้าย ตัวเลขบนปุ่มคือจำนวน Channel ที่เลือกอยู่",
        "ในแผงเรียงเป็น Organization → Agent → LINE Channel · ติ๊ก Channel ที่ต้องการดูแชท · ติ๊กที่ชื่อ Agent = เลือกทุก Channel ของ Agent นั้น · ติ๊ก \"ทั้งหมด\" = เลือกทุก Channel · ไม่ติ๊กเลย = ไม่แสดงแชท",
        "ปุ่มเฟืองท้าย Channel เปิดหน้าตั้งค่าของ Channel นั้น",
        "โลโก้หน้าชื่อ Channel บอกช่องทาง: โลโก้ LINE (เขียว) = LINE · โลโก้ Telegram (ฟ้า เครื่องบินกระดาษ) = Telegram (มีในรายการสนทนาและหัวห้องแชทด้วย)",
    ]],
    [InboxIcon, "อ่านรายการสนทนา", [
        "กรองรายการด้วยแท็บ ทั้งหมด / ทั่วไป / การเงิน ที่หัวรายการ (การเงิน = ฝากและถอน)",
        "สีพื้นและแถบสีหน้าแถวบอกประเภทเคส: เหลือง = ฝาก · ส้ม = ถอน · แดง = เรื่องทั่วไป · ขาว = ปิดเคสแล้ว",
        "ป้ายตัวเลขสีแดงท้ายแถว = ข้อความใหม่ที่ยังไม่ได้เปิดอ่าน · มีข้อความลูกค้าเข้าจะมีเสียงแจ้งเตือน (เปิด/ปิดที่ปุ่มกระดิ่งบนแถบบน)",
        "ป้าย \"รอแอดมินรับเคส\" = ยังไม่มีใครรับ · ป้ายชื่อแอดมิน = คนที่รับเคสอยู่ · กดที่แถวเพื่อเปิดห้องแชท",
    ]],
    [MessageCircleIcon, "การรับแชทและตอบลูกค้า", [
        "ค้นหาลูกค้าที่ช่องค้นหาบนรายการสนทนา — เลือกผลแล้วข้อมูลขึ้นที่แผงลูกค้าโดยไม่เปิดแชท",
        "หัวห้องแชทแสดงรูปและชื่อลูกค้า ผู้รับเคส และ LINE Channel · กดปุ่มดินสอข้างชื่อเพื่อแก้ชื่อ/ไอดี",
        "เปลี่ยนประเภทเคสด้วยปุ่ม ฝาก / ถอน / เรื่องทั่วไป ในหัวห้องแชท",
        "พิมพ์ข้อความแล้วกด Enter — ส่งครั้งแรกระบบรับเคสให้อัตโนมัติ · แถบเครื่องมือหน้าช่องพิมพ์: คีย์ลัด · การ์ดข้อความ · สติ๊กเกอร์ · ส่งรูปภาพ",
        "พิมพ์ / ในช่องพิมพ์ที่ว่างอยู่เพื่อเรียกรายการคีย์ลัด",
        "เพิ่มโน้ตของลูกค้า: พิมพ์ในช่องโน้ตแล้วกด Enter — โน้ตแสดงเป็นรายการพร้อมเวลาและชื่อแอดมิน ลบได้ด้วยปุ่ม ×",
        "คุยจบ กดปุ่มแดง \"ปิดเคส [F4]\" หรือกด F4 — ระบบบันทึกว่าใครรับและปิดเมื่อไร และส่งข้อความหลังปิดเคสที่ตั้งไว้ให้ลูกค้า",
        "ปุ่ม ◫ ที่หัวห้องแชทซ่อน/แสดงแผงข้อมูลลูกค้า (จอกว้าง)",
    ]],
    [UserSearchIcon, "ตรวจสอบข้อมูลสมาชิก", [
        "แถบบน: ปุ่ม \"กลับหน้า Smart Liff\" ข้างโลโก้ · ปุ่ม \"ไปหน้า Auto fast\" ฝั่งขวา · แผงขวา: สถานะไลน์ / ตรวจสอบสลิป / ประวัติฝาก-ถอน / สมัครสมาชิก เป็นปุ่ม กดแล้วเปิดหน้าต่าง (ไลน์หลุดหรือมีสลิปรอตรวจจะกางเป็นการ์ดให้เอง) · การ์ดที่เหลือกดหัวการ์ดเพื่อพับ/กาง",
        "การ์ด \"ตรวจสอบ\": พิมพ์ username แล้วกด \"ตรวจสอบ\" — แชทที่ยังไม่ผูกสมาชิกจะผูกกับสมาชิกที่พบ · \"เลิกผูก\" เพื่อยกเลิก",
        "ดูสถานะ เทิร์น และโปรโมชั่นของสมาชิกที่ผูกไว้ · การ์ด \"บัญชีธนาคาร\" แสดงบัญชีพร้อมสถานะ อนุมัติ / รออนุมัติ / ไม่อนุมัติ และผลตรวจชื่อ",
        "เปลี่ยนรหัสผ่านสมาชิกที่ปุ่ม \"เปลี่ยนรหัสผ่านลูกค้า\" — กรอกรหัสใหม่สองครั้ง แล้วแจ้งรหัสใหม่ให้ลูกค้าทางแชทเอง",
        "สมัครสมาชิกใหม่ที่การ์ด \"สมัครสมาชิก Player\" — กด \"Check เลข\" เพื่อตรวจว่าเลขบัญชีซ้ำหรือไม่ · สมัครแล้วกด \"ส่งเบอร์และรหัสให้ลูกค้า\"",
        "สถานะไลน์ (OA): ถ้าส่งข้อความไม่ได้ กด Verify เพื่อ login ใหม่ · Ping / Update สถานะ เพื่อตรวจการเชื่อมต่อ",
    ]],
    [WalletIcon, "เครดิตและประวัติ", [
        "ปรับเครดิตสมาชิกที่การ์ด \"จัดการเครดิต\" — กรอกจำนวนเงิน เลือกเติมหรือถอน และกรอกรหัสผ่านแอดมินของคุณ",
        "ดูรายการฝาก/ถอนล่าสุดที่การ์ด \"สถานะยอดค้าง\" และ \"ประวัติฝาก/ถอน\"",
    ]],
    [ReceiptIcon, "ตรวจสลิปโอนเงิน", [
        "เมื่อลูกค้าส่งสลิป กดปุ่ม \"ตรวจสอบสลิป\" ใต้รูปสลิปในห้องแชท — ผลตรวจขึ้นในการ์ด \"ตรวจสอบสลิป\" ที่แผงขวา",
    ]],
    [SettingsIcon, "ตั้งค่า", [
        "ตั้งค่าทั่วไป → เสียงแจ้งเตือน: เปิด/ปิดเสียง เลือกเสียงและความดัง กด \"ทดสอบเสียง\" เพื่อฟัง",
        "ตั้งค่าทั่วไป → ส่งข้อความหลังปิดเคส: ข้อความที่ระบบส่งให้ลูกค้าทันทีเมื่อกดปิดเคส (สูงสุด 5 รายการ)",
        "หน้าที่มีรายการ: กดปุ่ม \"สร้าง…ใหม่\" ที่หัวการ์ดรายการ แผงฟอร์มจะเลื่อนออกมาจากด้านขวา",
        "ปุ่ม \"ไปหน้า Line Liff\" อยู่ท้ายเมนูตั้งค่า",
    ]],
    [StickerIcon, "จัดการชุดสติ๊กเกอร์", [
        "ไปที่ ตั้งค่า → ชุดสติ๊กเกอร์ · ค้นหาชุดในคลังด้วยเลขชุด (packageId)",
        "สร้างชุด: ตั้งชื่อ กดเลือกรูปจากคลัง หรือเพิ่มด้วย packageId + stickerId แล้วกดบันทึก",
    ]],
    [ZapIcon, "คีย์ลัด", [
        "ตั้งค่า → คีย์ลัด → \"สร้างคีย์ลัดใหม่\" · เพิ่มข้อความ / สติ๊กเกอร์ / รูปภาพ แล้วลากเรียงลำดับ",
        "ในห้องแชทกดปุ่มคีย์ลัด (หรือพิมพ์ /) แล้วเลือก — ระบบส่งทุกรายการตามลำดับ",
    ]],
    [MegaphoneIcon, "Broadcast", [
        "เลือกผู้รับ: ทุกคน หรือ เลือกผู้รับ · ติ๊ก \"ตั้งเวลาส่ง\" เพื่อส่งภายหลัง",
        "กด \"ส่ง Broadcast\" แล้วยืนยัน — ดูผลในการ์ด \"ประวัติ & คิวที่ตั้งเวลาไว้\"",
    ]],
    [BotIcon, "ข้อความอัตโนมัติ (Keyword)", [
        "ไปที่ ตั้งค่า → ข้อความอัตโนมัติ",
        "เพิ่มคำค้น (Keyword) และข้อความตอบกลับ",
        "เปิด/ปิดการใช้งานแต่ละรายการได้ตามต้องการ",
    ]],
    [MessageSquareTextIcon, "ปุ่มคีย์ลัดใต้ห้องแชท (Announce)", [
        "เมนูมุมขวาบน → จัดการข้อความอัตโนมัติ · ข้อความที่สถานะ \"ใช้งาน\" จะเป็นปุ่มใต้ห้องแชท",
    ]],
];

/* ---------- menu — ไอคอน lucide นำหน้าทุกรายการ (DESIGN-SYSTEM §10.1 · แทนจุดสีของต้นฉบับ) ---------- */
export const MENU_GROUPS = [
    [["หน้าหลัก", HouseIcon, "home"]],
    [["จัดการข้อความอัตโนมัติ", MessageSquareTextIcon, "announce"], ["Telegram post", SendIcon, "x"]], // Telegram post ไม่มีหน้าในตั้งค่าแล้ว (เว็บต้นฉบับ 15 ต.ค. 2026)
    [["จัดการไลน์", MessageCircleIcon, "x"]],
    [["จัดการแอดมิน", UserCogIcon, "x"], ["คู่มือการใช้งาน", BookOpenIcon, "gd"], ["จัดการสติ๊กเกอร์", StickerIcon, "stk"]],
    [["อัพเดต", RefreshCwIcon, "update"], ["เคลียร์ภาพ", ImageOffIcon, "clear"]],
    [["เปลี่ยนรหัสผ่าน", KeyRoundIcon, "pw"], ["ออกจากระบบ", LogOutIcon, "logout"]],
];
export const SETMAP = { gd: "gd", stk: "stk", pw: "pw" };
