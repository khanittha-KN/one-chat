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

export const merchants = [
    { id: "sbo55v1", name: "55GOAL V1 (VIP)", chats: 3482 },
    { id: "sbo55wn", name: "55GOAL WN", chats: 25422 },
    { id: "99qv1", name: "99QV1 (VIP)", chats: 5982 },
    { id: "99queen", name: "99QUEEN.COM", chats: 4863 },
    { id: "99cenv1", name: "99CENTER ใหม่", chats: 14912 },
    { id: "london789", name: "LONDON789", chats: 59216 },
    { id: "lsm99dna", name: "DNA", chats: 18107 },
    { id: "99king", name: "99KING.COM", chats: 2371 },
    // ⚠ 2 ช่องนี้ไม่มีในต้นฉบับ — เพิ่มเพื่อทดสอบ Channel ที่ใช้ LINE LIFF เท่านั้น (ไม่มีแชต)
    { id: "liffmember", name: "MEMBER LIFF", chats: 0 },
    { id: "liffpromo", name: "PROMO LIFF", chats: 0 },
];
export const merch = (id) => merchants.filter((m) => m.id === id)[0];

/* ---------- Organization → Agent → LINE Channel (เอกสารส่งต่องาน 9 ต.ค. 2026 ฉบับแก้) ----------
   ⚠ ข้อมูลสมมติทั้งหมด — ของจริงต้องจัดกลุ่มด้วยรหัส Org · Agent · Channel ของระบบ ไม่เดาจากชื่อหรือเลข
   · Agent = เว็บ · รายการใน merchants (เช่น "55GOAL V1 (VIP)") = LINE Channel ของ Agent นั้น (เจ้าของงานยืนยัน 9 ต.ค. 2026) ⇒ ไม่มีข้อมูลเว็บแยกจาก Agent
   · ฟังก์ชันอ่านแยกต่อ Channel: chat (แชทรวม) · liff (LINE LIFF) — Agent เดียวกันเปิดต่างกันได้ · เปิดแชทไม่ได้แปลว่าปิด LIFF
   · checkbox ในหน้าแชตเป็นตัวกรองรายการสนทนาเท่านั้น ไม่แตะค่าฟังก์ชันหรือ Permissions
   · ต้นแบบนี้ไม่มีระบบสิทธิ์ ⇒ ผู้ใช้เห็นทุก Channel (ของจริงกรองด้วยสิทธิ์เดิมก่อนแสดง) */
export const org = { id: "org1", name: "Organization ตัวอย่าง" };
export const agents = [
    { id: "agA", org: "org1", name: "Agent A" },
    { id: "agB", org: "org1", name: "Agent B" },
    { id: "agC", org: "org1", name: "Agent C" },
];
const CHANNEL_META = {
    sbo55v1: { agent: "agA", chat: true, liff: false },
    "99queen": { agent: "agA", chat: true, liff: true },
    london789: { agent: "agA", chat: true, liff: false },
    "99king": { agent: "agA", chat: true, liff: false },
    sbo55wn: { agent: "agB", chat: true, liff: false },
    "99cenv1": { agent: "agB", chat: true, liff: false },
    "99qv1": { agent: "agB", chat: true, liff: true },
    liffmember: { agent: "agB", chat: false, liff: true },
    liffpromo: { agent: "agC", chat: false, liff: true }, // Agent C ไม่มี Channel สำหรับแชต
    lsm99dna: { agent: "agB", chat: true, liff: false },
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
export const lineNo = { sbo55v1: 11, sbo55wn: 12, "99qv1": 13, "99queen": 14, "99cenv1": 26, london789: 31, lsm99dna: 32, "99king": 33 };

// สีโลโก้ธนาคาร = สีแบรนด์ของแต่ละธนาคาร (คงเดิมทั้งสองโหมด)
export const BANKS = [
    { code: "KBANK", name: "กสิกรไทย", bg: "#1a9f4a", fg: "#ffffff" },
    { code: "SCB", name: "ไทยพาณิชย์", bg: "#4e2a84", fg: "#ffffff" },
    { code: "KTB", name: "กรุงไทย", bg: "#1ba1e2", fg: "#ffffff" },
    { code: "BBL", name: "กรุงเทพ", bg: "#1e4598", fg: "#ffffff" },
    { code: "BAY", name: "กรุงศรีอยุธยา", bg: "#fec43b", fg: "#1a1d22" },
    { code: "TTB", name: "ทหารไทยธนชาต", bg: "#f26a21", fg: "#ffffff" },
];
export function bankOf(code) {
    return BANKS.filter((x) => x.code === code)[0] || BANKS[0];
}

function mkUser(n) {
    const b = BANKS[n % BANKS.length];
    return { username: "demo" + n, fullname: "ลูกค้าตัวอย่าง " + n, bank: b.name, bankCode: b.code, number: "000-0-0000" + n + "-0", mobile: "0XX-XXX-000" + n };
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

export const ACC = "กรุณาโอนเข้าบัญชี กสิกรไทย 000-0-00001-0 แล้วส่งสลิปในแชทนี้ค่ะ";

function mkSlipCase(id, n, name, type, merchant, status, admin, secs, ago, claim, amt, variant, lines) {
    const c = { id, name, type, merchant, status, admin, secs, ago, lineOk: true, wd: 0, user: mkUser(n), claim, msgs: [] };
    lines.forEach((l, i) => {
        c.msgs.push({ who: l[0], by: l[2], text: l[1], t: "14:" + (10 + i) });
    });
    c.msgs.push({ who: "cust", text: "", t: "14:30", action: "slip", amt, variant });
    c.slip = { state: "pending", amt, variant };
    return c;
}

export function seedCases() {
    const cases = [
        { id: "c1", name: "ลูกค้า A", type: "deposit", merchant: "99cenv1", status: "waiting", admin: null, secs: 128, ago: "2 นาที", lineOk: true, wd: 0, user: mkUser(1),
            msgs: [{ who: "cust", text: "สวัสดีค่ะ", t: "13:45" }, { who: "cust", text: "ขอแจ้งฝากหน่อยค่ะ ยูส demo1 ฝาก 253 บาทค่ะ", t: "13:46" }, { who: "cust", text: "ต้องโอนเข้าบัญชีไหนคะ", t: "13:46" }] },
        { id: "c2", name: "ลูกค้า B", type: "withdraw", merchant: "london789", status: "open", admin: "admin02", secs: 35, ago: "5 นาที", lineOk: true, wd: 2, user: mkUser(2),
            msgs: [{ who: "cust", text: "ขอถอนเงินหน่อยครับ", t: "13:47" }, { who: "cust", text: "ถอน200", t: "13:48" }, { who: "cust", text: "ถอนแล้วยังไม่เข้าเลยครับ", t: "13:49" }] },
        { id: "c3", name: "ลูกค้า C", type: "general", merchant: "lsm99dna", status: "open", admin: "admin03", secs: 12, ago: "9 นาที", lineOk: false, wd: 0, user: mkUser(3),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นหน่อยครับ", t: "13:50" }, { who: "cust", text: "ทักไปหลายรอบแล้วไม่เห็นตอบเลยครับ", t: "13:51" }, { who: "sys", text: "ไลน์หลุด กรุณากด Verify ที่แผงขวา", t: "13:51" }] },
        { id: "c4", name: "ลูกค้า D", type: "deposit", merchant: "sbo55v1", status: "closed", admin: "admin02", secs: 210, ago: "36 นาที", lineOk: true, wd: 0, user: mkUser(4),
            msgs: [{ who: "cust", text: "ฝาก 100 ค่ะ", t: "13:10" }, { who: "admin", by: "admin02", text: "กรุณาโอนเข้าบัญชี กสิกรไทย 000-0-00001-0 แล้วส่งสลิปในแชทนี้ค่ะ", t: "13:11" }, { who: "cust", text: "โอนแล้วค่ะ", t: "13:13" }, { who: "cust", text: "", t: "13:13", action: "slip", amt: 100, checked: true }, { who: "sys", text: "เติมเงิน 100.00 บาท ให้ demo4 เรียบร้อย", t: "13:14" }, { who: "cust", text: "ได้รับแล้วค่ะ ขอบคุณค่ะ", t: "13:15" }], closedBy: "admin02", closedAt: "13:19" },
        { id: "c5", name: "ลูกค้า E", type: "withdraw", merchant: "99queen", status: "waiting", admin: null, secs: 64, ago: "1 นาที", lineOk: true, wd: 0, user: mkUser(5),
            msgs: [{ who: "cust", text: "ขอถอน 500 ค่ะ", t: "13:52" }, { who: "cust", text: "รอนานแล้วนะคะ ยังไม่เข้าเลย", t: "13:53" }] },
        { id: "c6", name: "ลูกค้า F", type: "general", merchant: "99king", status: "waiting", admin: null, secs: 20, ago: "20 วินาที", lineOk: true, wd: 0, user: mkUser(6),
            msgs: [{ who: "cust", text: "สมัครสมาชิกยังไงคะ", t: "13:55" }, { who: "cust", text: "มีโปรสมาชิกใหม่ไหมคะ", t: "13:55" }] },
        { id: "c7", name: "ลูกค้า G", type: "deposit", merchant: "lsm99dna", status: "open", admin: "admin01", secs: 80, ago: "14 นาที", lineOk: true, wd: 0, user: mkUser(7),
            msgs: [{ who: "cust", text: "สวัสดีครับ", t: "13:36" }, { who: "admin", by: "admin01", text: "สวัสดีค่ะ ต้องการแจ้งฝากใช่ไหมคะ", t: "13:37" }, { who: "cust", text: "ใช่ครับ ฝาก 100", t: "13:38" }, { who: "admin", by: "admin01", text: "กรุณาโอนเข้าบัญชี กสิกรไทย 000-0-00001-0 แล้วส่งสลิปในแชทนี้ค่ะ", t: "13:39" }, { who: "cust", text: "โอนแล้วนะครับ", t: "13:40" }, { who: "cust", text: "", t: "13:41", action: "slip", amt: 100 }] },
        { id: "c8", name: "ลูกค้า H", type: "general", merchant: "london789", status: "closed", admin: "admin03", secs: 95, ago: "11 ชม.", lineOk: true, wd: 0, user: mkUser(8),
            msgs: [{ who: "cust", text: "สอบถามโปรโมชั่นฝากครั้งแรกหน่อยค่ะ", t: "12:25" }, { who: "admin", by: "admin03", text: "ฝากครั้งแรกรับโบนัสตามเงื่อนไขโปรโมชั่นค่ะ", t: "12:27" }, { who: "cust", text: "ขอบคุณค่ะ", t: "12:30" }], closedBy: "admin03", closedAt: "12:41" },
    ];
    cases[0].claim = 253;
    cases[1].claim = 200;
    cases[4].claim = 500;
    cases[6].claim = 100;
    cases[6].slip = { state: "pending", amt: 100, variant: "real" };
    cases.push(
        mkSlipCase("c9", 9, "ลูกค้า I", "deposit", "99cenv1", "open", "admin01", 70, "3 นาที", 500, 450, "fake", [["cust", "ฝาก 500 ค่ะ"], ["admin", ACC, "admin01"], ["cust", "โอนแล้วค่ะ"]]),
        mkSlipCase("c10", 10, "ลูกค้า J", "deposit", "sbo55wn", "open", "admin02", 55, "4 นาที", 300, 300, "real", [["cust", "ฝาก 300 ครับ"], ["admin", ACC, "admin02"], ["cust", "โอนจากบัญชีแฟนครับ"]]),
        mkSlipCase("c11", 11, "ลูกค้า K", "deposit", "99qv1", "open", "admin03", 90, "6 นาที", 1000, 1000, "real", [["cust", "ฝาก 1000 นะคะ"], ["admin", ACC, "admin03"], ["cust", "โอนผ่านแอปอีกธนาคารค่ะ"]]),
        mkSlipCase("c12", 12, "ลูกค้า L", "deposit", "99queen", "open", "admin01", 40, "7 นาที", 200, 200, "fake", [["cust", "ขอฝาก 200 ครับ"], ["cust", "โอนเข้าบัญชีที่เคยใช้ครับ"]]),
        mkSlipCase("c13", 13, "ลูกค้า M", "deposit", "london789", "open", "admin02", 30, "8 นาที", 150, 150, "real", [["cust", "ฝาก 150 ค่ะ"], ["admin", ACC, "admin02"], ["cust", "โอนแล้วค่ะ"]]),
        mkSlipCase("c14", 14, "ลูกค้า N", "withdraw", "lsm99dna", "open", "admin03", 20, "10 นาที", 400, 400, "real", [["cust", "ถอน 400 ครับ"], ["cust", "ส่งสลิปให้ตรวจสอบครับ"]]),
        mkSlipCase("c15", 15, "ลูกค้า O", "withdraw", "sbo55v1", "open", "admin01", 25, "12 นาที", 800, 800, "fake", [["cust", "ขอถอน 800 ค่ะ"], ["cust", "ส่งสลิปให้แล้วนะคะ"]]),
        mkSlipCase("c16", 16, "ลูกค้า P", "deposit", "99king", "waiting", null, 15, "30 วินาที", 120, 120, "fake", [["cust", "ฝาก 120 ค่ะ"], ["cust", "โอนแล้วนะคะ"]]),
    );
    const byId = (id) => cases.filter((c) => c.id === id)[0];
    byId("c2").extraWd = [{ amt: 500, time: "12:10", st: "รอทำรายการ" }];
    byId("c5").extraWd = [{ amt: 300, time: "11:20", st: "รอทำรายการ" }];
    byId("c9").extraDep = [{ amt: 200, time: "13:05", st: "รอเติมเงิน" }];
    byId("c12").extraDep = [{ amt: 350, time: "12:40", st: "รอตรวจสลิป" }, { amt: 100, time: "11:55", st: "รอเติมเงิน" }];
    byId("c15").extraWd = [{ amt: 300, time: "11:40", st: "รอทำรายการ" }];
    cases.forEach((c) => {
        const n = parseInt(c.user.username.replace("demo", ""), 10);
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
        { id: 2, sort: 1, type: "ส่วนเสริม", name: "แจ้งกรุงไทย", text: "[ข้อความตัวอย่าง] กรุณาโอนเข้าบัญชีกรุงไทย แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 3, sort: 1, type: "ส่วนเสริม", name: "แจ้งไทยพาณิชย์", text: "[ข้อความตัวอย่าง] กรุณาโอนเข้าบัญชีไทยพาณิชย์ แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
        { id: 4, sort: 1, type: "ส่วนเสริม", name: "แจ้งกสิกร", text: "[ข้อความตัวอย่าง] กรุณาโอนเข้าบัญชีกสิกร แล้วส่งสลิปในแชทนี้ค่ะ", status: "ใช้งาน" },
    ];
}

// บัญชีบริษัท (ใช้ใน CompanyAccountsBlock — ต้นฉบับประกาศไว้แต่ไม่ได้วางในแผงขวา)
export const COACC = [
    { bank: "KBANK", name: "บริษัทตัวอย่าง จำกัด", no: "000-0-00001-0" },
    { bank: "SCB", name: "บริษัทตัวอย่าง จำกัด", no: "000-0-00002-0" },
    { bank: "KTB", name: "บริษัทตัวอย่าง จำกัด", no: "000-0-00003-0" },
];
// ต้นฉบับประกาศตัวแปรนี้ไว้แต่ไม่ได้ใช้ที่ใด — เก็บไว้ครบตามต้นฉบับ
export const accounts = ["ธนาคารตัวอย่าง A  000-0-00001-0", "ธนาคารตัวอย่าง B  000-0-00002-0"];

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

export function minusMin(t, m) {
    const p = String(t || nowT()).split(":");
    let mins = +p[0] * 60 + +p[1] - m;
    if (mins < 0) mins += 1440;
    return ("0" + Math.floor(mins / 60)).slice(-2) + ":" + ("0" + (mins % 60)).slice(-2);
}
export function slipData(c, amt, v, t) {
    return {
        state: "ready", amt,
        date: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }),
        time: minusMin(t, 2) + " น.", fake: v === "fake",
        fromName: c.user.fullname, fromBank: c.user.bankCode, fromNo: c.user.number,
        toName: "บริษัทตัวอย่าง จำกัด", toBank: "KBANK", toNo: "000-0-00001-0",
    };
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
    const n = parseInt(c.user.username.replace(/\D/g, ""), 10) || 1, cnt = 1 + (n % 5);
    const out = [{ bank: c.user.bankCode, no: c.user.number, main: true, on: true }];
    for (let k = 1; k < cnt; k++) out.push({ bank: BANKS[(n + k) % BANKS.length].code, no: "000-" + k + "-0000" + n + "-" + k, main: false, on: k % 3 !== 0 });
    return out;
}

/* ---------- settings ---------- */
export const SET_TABS = [["stk", StickerIcon, "ชุดสติ๊กเกอร์"], ["qr", ZapIcon, "คีย์ลัด"], ["bc", MegaphoneIcon, "Broadcast (ยิงทั้งหมด)"], ["am", BotIcon, "ข้อความอัตโนมัติ"], ["ba", LandmarkIcon, "บัญชี"], ["tg", SendIcon, "โพสต์ Telegram"], ["gd", BookOpenIcon, "คู่มือการใช้งาน"]];
export const PACKS = [[446, 40], [789, 40], [1070, 40], [6136, 24], [6325, 24], [6359, 24]];
export const TYPE_LBL = { text: "ข้อความ", sticker: "สติ๊กเกอร์", image: "รูปภาพ" };
// คู่มือ — ตรงกับหน้าจอปัจจุบัน (ปรับ 12 ต.ค. 2026: Org → Agent → Channel · สีเคส · แผงขวา · ตั้งค่าแบบแผงสไลด์ · สติ๊กเกอร์จากรูป)
export const GUIDE = [
    [BuildingIcon, "เลือก Channel ที่จะดูแชท", [
        "แถบซ้ายเรียงเป็น Organization → Agent → LINE Channel (แสดงเฉพาะ Channel ที่เปิดแชทรวม)",
        "ติ๊ก Channel ที่ต้องการดูแชท · ติ๊กที่ชื่อ Agent = เลือกทุก Channel ของ Agent นั้น · ติ๊กแถว \"Merchant\" = เลือกทั้งหมด",
        "ไม่ติ๊กเลย = ไม่แสดงแชท · เปิดระบบมาจะติ๊กไว้ทุก Channel ให้แล้ว",
        "กดลูกศรท้ายชื่อ Agent เพื่อพับ/ขยาย · ตัวเลขท้าย Channel คือจำนวนแชทที่เคยทักเข้ามา",
    ]],
    [InboxIcon, "อ่านรายการสนทนา", [
        "กรองรายการด้วยแท็บ All / Line / Payment ที่หัวรายการ",
        "สีพื้นและแถบซ้ายบอกประเภทเคส: เหลือง = ฝาก · ส้ม = ถอน · แดง = เรื่องทั่วไป · ขาว = ปิดเคสแล้ว (ดูคำอธิบายสีท้ายรายการ)",
        "ป้าย \"รอแอดมินรับเคส\" = ยังไม่มีใครรับ · ป้ายชื่อแอดมิน = คนที่รับเคสอยู่ (ตัวเลขในวงเล็บคือวินาทีที่ผ่านไป)",
        "กดที่แถวเพื่อเปิดห้องแชทของลูกค้าคนนั้น",
    ]],
    [MessageCircleIcon, "ตอบแชทลูกค้า", [
        "หัวห้องแชทแสดงชื่อลูกค้า ประเภทเคส และ LINE Channel ที่ลูกค้าทักเข้ามา",
        "พิมพ์ข้อความแล้วกด Enter หรือปุ่ม \"ส่ง\" — ส่งครั้งแรกระบบรับเคสให้อัตโนมัติ",
        "ปุ่มสติ๊กเกอร์ (ซ้ายของช่องพิมพ์) ส่งจากสติ๊กเกอร์โปรดหรือชุดที่บันทึกไว้",
        "ปุ่มคีย์ลัดใต้ห้องแชทส่งข้อความสำเร็จรูปในคลิกเดียว · \"ขอเลขบัญชีลูกค้า\" ส่งคำขอเลขบัญชีให้ลูกค้า",
        "แก้ชื่อ/ไอดีลูกค้าแล้วกด \"Save\" · ช่อง Note พิมพ์แล้วกด Enter เพื่อบันทึก",
        "คุยจบ กดปุ่มแดง \"ปิด [F4]\" หรือกด F4 — ห้องแชทขึ้นแถบแดง \"ปิดเคส โดย … - เวลา\"",
    ]],
    [ReceiptIcon, "ตรวจสลิปโอนเงิน", [
        "เมื่อลูกค้าส่งสลิป กดปุ่ม \"ตรวจสอบสลิป\" ใต้รูปสลิปในห้องแชท",
        "ผลตรวจขึ้นในการ์ด \"ตรวจสอบสลิป\" ที่แผงขวา",
    ]],
    [UserSearchIcon, "ข้อมูลลูกค้า (แผงขวา)", [
        "ค้นหาลูกค้าด้วยชื่อ / ไอดี / เบอร์ ที่ช่องค้นหาบนสุดของแผงขวา",
        "ตรวจสอบสถานะไลน์: ถ้าขึ้น \"หลุด\" กดปุ่มฟ้า \"Verify\" เพื่อเชื่อมต่อใหม่ · \"Update\" = รีเฟรชสถานะ",
        "การ์ดตรวจสอบ: กรอก username แล้วกด \"ตรวจสอบ\" เพื่อดูข้อมูลบัญชี เทิร์น และโปรโมชั่น · ดูบัญชีธนาคารลูกค้าหรือเปลี่ยนรหัสผ่านได้จากการ์ดนี้",
        "สถานะยอดค้าง และประวัติฝาก/ถอน (ป้ายฝากสีเหลือง ถอนสีส้ม) · กด \"ดูทั้งหมด / แยกฝาก-ถอน\" เพื่อดูครบทุกรายการ",
        "จัดการเครดิต: เลือก เติม หรือ ถอน ใส่จำนวนเงินและรหัสผ่านแอดมิน แล้วกด \"บันทึก\" · สมัครสมาชิก Player ได้จากการ์ดล่างสุด",
    ]],
    [SettingsIcon, "เข้าหน้าตั้งค่าและใช้ฟอร์ม", [
        "กดไอคอนเฟืองที่หัว Agent ในแถบซ้าย (ตั้งค่าของ Agent นั้น) หรือเลือกจากเมนูมุมขวาบน",
        "หน้าที่มีรายการ: กดปุ่ม \"สร้าง…ใหม่\" ที่หัวการ์ดรายการ แผงฟอร์มจะเลื่อนออกมาจากด้านขวา",
        "กด \"แก้ไข\" ที่แถว ⇒ หัวแผงบอกชื่อรายการที่กำลังแก้ และแถวนั้นมีป้าย \"กำลังแก้ไข\" · ปิดแผงหรือกด \"ยกเลิก\" = ไม่บันทึก",
    ]],
    [StickerIcon, "สติ๊กเกอร์โปรดและชุดสติ๊กเกอร์", [
        "ตั้งค่า → ชุดสติ๊กเกอร์",
        "สติ๊กเกอร์โปรด: เลือกชุดในคลัง LINE แล้วกดที่รูปเพื่อติดดาว / เอาดาวออก หรือกด \"ติดดาวทั้งชุด\" — สติ๊กเกอร์โปรดขึ้นก่อนในปุ่มสติ๊กเกอร์ของหน้าแชท",
        "สร้างชุด: กด \"สร้างชุดใหม่\" ตั้งชื่อ กดเลือกรูปจากคลัง (หรือเพิ่มด้วย Sticker ID) แล้วกด \"สร้างชุด\"",
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
    [["อัพเดต", RefreshCwIcon, "x"], ["เคลียร์ภาพ", ImageOffIcon, "x"]],
    [["เปลี่ยนรหัสผ่าน", KeyRoundIcon, "x"], ["ออกจากระบบ", LogOutIcon, "logout"]],
];
export const SETMAP = { tg: "tg", gd: "gd", stk: "stk" };
