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
import LandmarkIcon from "@lucide/svelte/icons/landmark";
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

export const ME = "admin01";

// LINE Channel (ไลน์ OA) — เว็บละหลายช่อง ตั้งชื่อตามเว็บ (เจ้าของงานให้ม็อคอัพแบบนี้ 14 ต.ค. 2026: "LSM55Goal → 55Goal 1 · สำรอง · VIP · Support")
// id = LINE ID ที่แสดงเป็น @id บนหัวห้องแชทและการ์ดสถานะไลน์ · เรียงตามเว็บ แล้วตามลำดับช่อง
export const merchants = [
    { id: "55goal1", name: "55Goal 1", chats: 3482 },
    { id: "55goal2", name: "55Goal สำรอง", chats: 4863 },
    { id: "55goalvip", name: "55Goal VIP", chats: 59216 },
    { id: "55goalcs", name: "55Goal Support", chats: 2371 },
    { id: "99queen1", name: "99Queen 1", chats: 25422 },
    { id: "99queen2", name: "99Queen สำรอง", chats: 14912 },
    { id: "99queenvip", name: "99Queen VIP", chats: 5982 },
    { id: "99queencs", name: "99Queen Support", chats: 18107 },
    // ⚠ 2 ช่องนี้ไม่มีในต้นฉบับ — ทดสอบ Channel ที่ใช้ LINE LIFF เท่านั้น (ไม่มีแชต ⇒ ไม่แสดงในแผงซ้าย)
    { id: "99queenmember", name: "99Queen Member", chats: 0 },
    { id: "88kingpromo", name: "88King Promo", chats: 0 },
];
export const merch = (id) => merchants.filter((m) => m.id === id)[0];

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
    "99queen1": { agent: "agB", chat: true, liff: false },
    "99queen2": { agent: "agB", chat: true, liff: false },
    "99queenvip": { agent: "agB", chat: true, liff: true },
    "99queencs": { agent: "agB", chat: true, liff: false },
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
];
export const usernameOf = (n) => (PEOPLE[n - 1] ? PEOPLE[n - 1][0] : "member" + String(n).padStart(4, "0"));
// เลขบัญชี 10 หลักแบบ XXX-X-XXXXX-X และเบอร์มือถือ ที่คงที่ตามลำดับลูกค้า (ไม่สุ่มใหม่ทุกครั้งที่โหลด)
const digits = (seed, len) => String((seed * 2654435761) % 10 ** len).padStart(len, "0");
export const acctNo = (seed) => {
    const d = digits(seed + 7, 10);
    return d.slice(0, 3) + "-" + d[3] + "-" + d.slice(4, 9) + "-" + d[9];
};
const mobileOf = (n) => "0" + "896"[n % 3] + digits(n + 3, 1) + "-" + digits(n * 11 + 5, 3) + "-" + digits(n * 13 + 1, 4);

function mkUser(n) {
    const b = BANKS[n % BANKS.length];
    return { no: n, username: usernameOf(n), fullname: PEOPLE[n - 1] ? PEOPLE[n - 1][1] : usernameOf(n), bank: b.name, bankCode: b.code, number: acctNo(n), mobile: mobileOf(n), picture: avatarOf(n) };
}

export function makeHist(n, kind) {
    if (n === 6 || (n === 3 && kind === "wd")) return [];
    const amts = [100, 200, 253, 300, 500, 1000, 150, 400, 800];
    const cnt = 3 + ((n + (kind === "wd" ? 2 : 0)) % 7);
    const pad = (v) => ("0" + v).slice(-2);
    const out = [];
    for (let i = 0; i < cnt; i++) {
        out.push({
            amt: amts[(n * 3 + i * 2 + (kind === "wd" ? 1 : 0)) % amts.length],
            time: 5 - Math.floor(i / 2) + " ต.ค. 2569 " + pad(9 + ((n + i * 3) % 12)) + ":" + pad((n * 7 + i * 13) % 60),
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
        { id: "c7", name: "ณัฐชา", type: "deposit", merchant: "99queencs", status: "open", admin: "admin01", secs: 80, ago: "14 นาที", lineOk: true, wd: 0, user: mkUser(7),
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
        mkSlipCase("c16", 16, "Pongsak", "deposit", "55goalcs", "waiting", null, 15, "30 วินาที", "bbl", "fake", [["cust", "ฝาก {amt} ครับ"], ["cust", "โอนแล้วนะครับ"]]),
    );
    const byId = (id) => cases.filter((c) => c.id === id)[0];
    byId("c2").extraWd = [{ amt: 500, time: "12:10", st: "รอทำรายการ" }];
    byId("c5").extraWd = [{ amt: 300, time: "11:20", st: "รอทำรายการ" }];
    byId("c9").extraDep = [{ amt: 200, time: "13:05", st: "รอเติมเงิน" }];
    byId("c12").extraDep = [{ amt: 350, time: "12:40", st: "รอตรวจสลิป" }, { amt: 100, time: "11:55", st: "รอเติมเงิน" }];
    byId("c15").extraWd = [{ amt: 300, time: "11:40", st: "รอทำรายการ" }];
    const now = Date.now();
    cases.forEach((c) => {
        c.at = now - agoSecs(c.ago) * 1000; // เวลาข้อความล่าสุด (ms) — ใช้เรียงรายการแชท
        const n = c.user.no;
        c.histDep = makeHist(n, "dep");
        c.histWd = makeHist(n, "wd");
        c.credit = n % 3 === 0 ? 0 : Math.round(n * 125.5 * 100) / 100;
        if (n % 4 === 0 || n % 4 === 1) c.turn = { need: 500 + n * 100, done: n * 37 };
        if (n % 4 === 0 || n % 4 === 2) c.promo = ["โปรสมาชิกใหม่ 100%", "โปรฝากทุกวัน 10%", "โปรคืนยอดเสีย"][n % 3];
    });
    return cases;
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
export const tabOf = (c) => (c.type === "general" ? "line" : "payment");
export const cls = (c) => (c.status === "closed" ? "st-white" : c.type === "deposit" ? "st-yellow" : c.type === "withdraw" ? "st-orange" : "st-red");

export const nowT = () => new Date().toTimeString().slice(0, 5);
// ชื่อสติ๊กเกอร์จากรหัส: "789-5" = ชุด 789 ลำดับที่ 6 · "id-123" = Sticker ID ที่เพิ่มเอง
// Sticker ID แรกของชุดพื้นฐานใน LINE Messaging API (ลำดับในชุดเรียงต่อกัน) ⇒ ลิงก์รูปบน CDN ของ LINE
const PACK_FIRST = { 446: 1988, 789: 10855, 1070: 17839, 6136: 10551376, 6325: 10979904, 6359: 11069848 };
export const stickerSrc = (k) => {
    const id = k.startsWith("id-") ? +k.slice(3) : PACK_FIRST[k.split("-")[0]] + +k.split("-")[1];
    return id ? "https://stickershop.line-scdn.net/stickershop/v1/sticker/" + id + "/android/sticker.png" : "";
};
export const isStickerKey = (k) => /^(\d+-\d+|id-\d+)$/.test(k || "");
export const stickerLabel = (k) => (k.startsWith("id-") ? "ID " + k.slice(3) : "ชุด " + k.split("-")[0] + " #" + (+k.split("-")[1] + 1));
// ข้อความสรุปของข้อความล่าสุดในรายการแชต
export const msgPreview = (m) => (m.action === "slip" ? "[สลิปโอนเงิน]" : m.action === "sticker" ? "[สติ๊กเกอร์]" : m.text);
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
    const out = [{ bank: c.user.bankCode, no: c.user.number, main: true, on: true }];
    for (let k = 1; k < cnt; k++) out.push({ bank: BANKS[(n + k) % BANKS.length].code, no: acctNo(n * 10 + k), main: false, on: k % 3 !== 0 });
    return out;
}

/* ---------- settings ---------- */
// เปลี่ยนรหัสผ่าน (pw) = รหัสของ Agent / แอดมินที่ล็อกอินอยู่ — เปิดเป็นแท็บตาม Flow ใน Figma (เจ้าของงาน 14 ต.ค. 2026)
export const SET_TABS = [["stk", StickerIcon, "ชุดสติ๊กเกอร์"], ["qr", ZapIcon, "คีย์ลัด"], ["bc", MegaphoneIcon, "Broadcast (ยิงทั้งหมด)"], ["am", BotIcon, "ข้อความอัตโนมัติ"], ["ba", LandmarkIcon, "บัญชี"], ["tg", SendIcon, "โพสต์ Telegram"], ["pw", KeyRoundIcon, "เปลี่ยนรหัสผ่าน"], ["gd", BookOpenIcon, "คู่มือการใช้งาน"]];
export const PACKS = [[446, 40], [789, 40], [1070, 40], [6136, 24], [6325, 24], [6359, 24]];
export const TYPE_LBL = { text: "ข้อความ", sticker: "สติ๊กเกอร์", image: "รูปภาพ" };
// คู่มือ — ตรงกับหน้าจอปัจจุบัน (ปรับ 12 ต.ค. 2026: Org → Agent → Channel · สีเคส · แผงขวา · ตั้งค่าแบบแผงสไลด์ · สติ๊กเกอร์จากรูป)
export const GUIDE = [
    [BuildingIcon, "เลือก Channel ที่จะดูแชท", [
        "แถบซ้ายเรียงเป็น Organization → Agent → LINE Channel (แสดงเฉพาะ Channel ที่เปิดแชทรวม)",
        "ติ๊ก Channel ที่ต้องการดูแชท · ติ๊กที่ชื่อ Agent = เลือกทุก Channel ของ Agent นั้น · ติ๊กแถว \"ทั้งหมด\" = เลือกทุก Channel",
        "ไม่ติ๊กเลย = ไม่แสดงแชท · เปิดระบบมาจะติ๊กไว้ทุก Channel ให้แล้ว",
        "กดลูกศรท้ายชื่อ Agent เพื่อพับ/ขยาย · ตัวเลขท้าย Channel คือจำนวนแชทที่เคยทักเข้ามา",
    ]],
    [InboxIcon, "อ่านรายการสนทนา", [
        "กรองรายการด้วยแท็บ All / Line / Payment ที่หัวรายการ",
        "สีพื้นและแถบซ้ายบอกประเภทเคส: เหลือง = ฝาก · ส้ม = ถอน · แดง = เรื่องทั่วไป · ขาว = ปิดเคสแล้ว (ดูคำอธิบายสีท้ายรายการ)",
        "ป้าย \"รอแอดมินรับเคส\" = ยังไม่มีใครรับ · ป้ายชื่อแอดมิน = คนที่รับเคสอยู่ (ตัวเลขในวงเล็บคือวินาทีที่ผ่านไป)",
        "ลำดับ: แชทที่ยังไม่ปิดอยู่บน ข้อความล่าสุดขึ้นก่อน · แชทที่ปิดเคสแล้วลงไปอยู่ล่างสุด เรียงตามเวลาเหมือนกัน · ตอบแชทแล้วแถวนั้นขึ้นบนสุด",
        "กดที่แถวเพื่อเปิดห้องแชทของลูกค้าคนนั้น",
    ]],
    [MessageCircleIcon, "ตอบแชทลูกค้า", [
        "หัวห้องแชทแสดงชื่อลูกค้า ประเภทเคส และ LINE Channel ที่ลูกค้าทักเข้ามา",
        "พิมพ์ข้อความแล้วกด Enter หรือปุ่ม \"ส่ง\" — ส่งครั้งแรกระบบรับเคสให้อัตโนมัติ",
        "ปุ่มสติ๊กเกอร์ (ซ้ายของช่องพิมพ์) ส่งจากสติ๊กเกอร์โปรดหรือชุดที่บันทึกไว้",
        "ปุ่มคีย์ลัดใต้ห้องแชทส่งข้อความสำเร็จรูปในคลิกเดียว · \"ขอเลขบัญชีลูกค้า\" ส่งคำขอเลขบัญชีให้ลูกค้า",
        "แก้ชื่อ/ไอดีลูกค้าแล้วกด \"Save\" · ช่อง Note พิมพ์แล้วกด Enter เพื่อบันทึก",
        "คุยจบ กดปุ่มแดง \"ปิดเคส (F4)\" หรือกด F4 — ห้องแชทขึ้นแถบแดง \"ปิดเคส โดย … - เวลา\"",
    ]],
    [ReceiptIcon, "ตรวจสลิปโอนเงิน", [
        "เมื่อลูกค้าส่งสลิป กดปุ่ม \"ตรวจสอบสลิป\" ใต้รูปสลิปในห้องแชท",
        "ผลตรวจขึ้นในการ์ด \"ตรวจสอบสลิป\" ที่แผงขวา",
    ]],
    [UserSearchIcon, "ข้อมูลลูกค้า (แผงขวา)", [
        "ค้นหาลูกค้าด้วยชื่อ / ไอดี / เบอร์ ที่ช่องค้นหาบนสุดของแผงขวา แล้วเลือกจากผลค้นหา ข้อมูลลูกค้าจะขึ้นในแผงขวาโดยไม่เปิดแชท · กด \"เปิดแชท\" เมื่อต้องการคุย · กด × เพื่อปิด",
        "ตรวจสอบสถานะไลน์: ถ้าขึ้น \"หลุด\" กดปุ่มฟ้า \"Verify\" เพื่อเชื่อมต่อใหม่ · \"Update\" = รีเฟรชสถานะ",
        "การ์ดตรวจสอบ: กรอก username แล้วกด \"ตรวจสอบ\" เพื่อดูข้อมูลบัญชี เทิร์น และโปรโมชั่น · ดูบัญชีธนาคารลูกค้าได้จากการ์ดนี้ · \"เปลี่ยนรหัสผ่านลูกค้า\" ใส่รหัสผ่านใหม่ 2 ครั้ง (กดรูปลูกตาท้ายช่องเพื่อดูสิ่งที่พิมพ์) แล้วกดบันทึก",
        "สถานะยอดค้าง และประวัติฝาก/ถอน (ป้ายฝากสีเหลือง ถอนสีส้ม) · กด \"ดูทั้งหมด / แยกฝาก-ถอน\" เพื่อดูครบทุกรายการ",
        "จัดการเครดิต: เลือก เติม หรือ ถอน ใส่จำนวนเงินและรหัสผ่านแอดมิน แล้วกด \"บันทึก\" · สมัครสมาชิก Player ได้จากการ์ดล่างสุด",
    ]],
    [SettingsIcon, "เข้าหน้าตั้งค่าและใช้ฟอร์ม", [
        "กดไอคอนเฟืองที่หัว Agent ในแถบซ้าย (ตั้งค่าของ Agent นั้น) หรือเลือกจากเมนูมุมขวาบน",
        "หน้าที่มีรายการ: กดปุ่ม \"สร้าง…ใหม่\" ที่หัวการ์ดรายการ แผงฟอร์มจะเลื่อนออกมาจากด้านขวา",
        "กด \"แก้ไข\" ที่แถว หัวแผงจะบอกชื่อรายการที่กำลังแก้ และแถวนั้นมีป้าย \"กำลังแก้ไข\" · ปิดแผงหรือกด \"ยกเลิก\" = ไม่บันทึก",
        "เปลี่ยนรหัสผ่านของตัวเอง (Agent / แอดมินที่ล็อกอินอยู่): ตั้งค่า → เปลี่ยนรหัสผ่าน หรือเมนูมุมขวาบน → เปลี่ยนรหัสผ่าน · ใส่รหัสปัจจุบัน รหัสใหม่ และยืนยันรหัสใหม่ · ทุกช่องมีรูปลูกตาไว้แสดง/ซ่อนรหัส",
    ]],
    [StickerIcon, "สติ๊กเกอร์โปรดและชุดสติ๊กเกอร์", [
        "ตั้งค่า → ชุดสติ๊กเกอร์",
        "สติ๊กเกอร์โปรด: เลือกชุดในคลัง LINE แล้วกดที่รูปเพื่อติดดาว / เอาดาวออก หรือกด \"ติดดาวทั้งชุด\" — สติ๊กเกอร์โปรดขึ้นก่อนในปุ่มสติ๊กเกอร์ของหน้าแชท",
        "สร้างชุด: กด \"สร้างชุดใหม่\" ตั้งชื่อ กดเลือกรูปจากคลัง (หรือเพิ่มด้วย Sticker ID) แล้วกด \"สร้างชุด\"",
        "ปุ่มสติ๊กเกอร์ในหน้าแชท: เปิดมาเจอแท็บ \"บันทึกไว้\" (สติ๊กเกอร์โปรด + ชุดที่สร้างไว้) ก่อนเสมอ · แถบด้านบนมีทุกชุดในคลัง LINE กดรูปปกเพื่อเปลี่ยนชุด · กดสติ๊กเกอร์ = ส่งทันที",
    ]],
    [ZapIcon, "คีย์ลัด (คำตอบหลายรายการ)", [
        "ตั้งค่า → คีย์ลัด → \"สร้างคีย์ลัดใหม่\"",
        "เพิ่มรายการ ข้อความ / สติ๊กเกอร์ (กดเลือกจากรูป ไม่ต้องจำ ID) / รูปภาพ (อัปโหลด JPG หรือ PNG ไม่เกิน 10 MB)",
        "ลากที่ปุ่มจับหน้าแถวเพื่อเรียงลำดับ (หรือกดลูกศรขึ้น/ลงบนปุ่มจับ) แล้วดูตัวอย่างในแชทก่อนบันทึก",
    ]],
    [MegaphoneIcon, "Broadcast ถึงทุกห้องแชท", [
        "ตั้งค่า → Broadcast · เพิ่ม part ข้อความ / สติ๊กเกอร์ / รูปภาพ ได้สูงสุด 10 part",
        "กด \"ส่ง Broadcast\" แล้วกดยืนยันอีกครั้ง — ส่งถึงทุกห้องแชทของ OA นี้และยกเลิกไม่ได้",
    ]],
    [BotIcon, "ข้อความอัตโนมัติ (Keyword)", [
        "ตั้งค่า → ข้อความอัตโนมัติ → \"สร้างกฎใหม่\"",
        "ใส่คำค้น เลือกประเภทการจับคู่ (มีคำนี้ / ตรงทั้งข้อความ) และข้อความตอบกลับ",
        "เปิด/ปิดแต่ละกฎด้วยสวิตช์ในรายการ",
    ]],
    [LandmarkIcon, "บัญชีบริษัท", [
        "ตั้งค่า → บัญชี → \"เพิ่มบัญชีใหม่\"",
        "เลือกธนาคาร กรอกเลขบัญชี 10–12 หลักและชื่อบัญชี แล้วกด \"บันทึกบัญชี\"",
    ]],
    [SendIcon, "โพสต์ไป Telegram", [
        "ตั้งค่า → โพสต์ Telegram → \"เขียนโพสต์\"",
        "แนบรูป ใส่ข้อความ และเพิ่มปุ่มเมนูได้สูงสุด 8 ปุ่ม",
        "กด \"โพสต์ไป Telegram\" แล้วดูรายการที่โพสต์ในการ์ด \"ข้อมูลที่โพสต์\"",
    ]],
    [MessageSquareTextIcon, "ปุ่มคีย์ลัดใต้ห้องแชท (Announce)", [
        "เมนูมุมขวาบน → จัดการข้อความอัตโนมัติ",
        "ข้อความที่สถานะ \"ใช้งาน\" จะเป็นปุ่มคีย์ลัดใต้ห้องแชท เรียงตามลำดับที่ตั้งไว้",
    ]],
];

/* ---------- menu — ไอคอน lucide นำหน้าทุกรายการ (DESIGN-SYSTEM §10.1 · แทนจุดสีของต้นฉบับ) ---------- */
export const MENU_GROUPS = [
    [["หน้าหลัก", HouseIcon, "home"]],
    [["จัดการข้อความอัตโนมัติ", MessageSquareTextIcon, "announce"], ["Telegram post", SendIcon, "tg"]],
    [["จัดการไลน์", MessageCircleIcon, "x"]],
    [["จัดการแอดมิน", UserCogIcon, "x"], ["คู่มือการใช้งาน", BookOpenIcon, "gd"], ["จัดการสติ๊กเกอร์", StickerIcon, "stk"]],
    [["อัพเดต", RefreshCwIcon, "update"], ["เคลียร์ภาพ", ImageOffIcon, "clear"]],
    [["เปลี่ยนรหัสผ่าน", KeyRoundIcon, "pw"], ["ออกจากระบบ", LogOutIcon, "logout"]],
];
export const SETMAP = { tg: "tg", gd: "gd", stk: "stk", pw: "pw" };
