// state + การกระทำทั้งหมดของ OneChat — พอร์ตจาก handler ของต้นฉบับทีละกรณี (ลำดับ เงื่อนไข ข้อความ toast เดิมทุกตัว)
import { toast as sonner } from "svelte-sonner";
import { playChime } from "./sound.svelte.js";
import {
    ME, merchants, money, chatChannels, canChat, BANKS, COACC, CARDS, bankOf, seedCases, seedAnnounces, nowT, slipData, tabOf,
    SETMAP, SET_TABS, TODAY, typeLabel, pingOf, chanByName, PLATFORM, TG_BOTS, agents, agentOf, merch,
} from "./data.js";

// เครดิต: confirm = ขั้นยืนยันก่อนปรับจริง (เว็บจริง 27 ต.ค. 2026)
const blankCredit = (type = "add") => ({ type, amt: "", note: "", pass: "", err: null, msg: null, confirm: false });
// สมัครสมาชิก (เว็บจริง): acct = ชื่อบัญชีธนาคาร · mkt = ช่องทางการตลาด · referrer = ผู้แนะนำที่เลือก · partner = รหัสพันธมิตร
const blankReg = () => ({ phone: "", bank: "", no: "", acct: "", pass: "", mkt: "SEO", refQ: "", refRes: null, referrer: null, partner: "", partnerName: null, partnerErr: null });
// เปลี่ยนรหัสผ่านให้ลูกค้า — a = รหัสผ่านใหม่ · b = ยืนยันอีกครั้ง · admin = รหัสผ่านแอดมินของคุณ · confirm = ขั้นยืนยัน · shown = รหัสใหม่ที่แสดงครั้งเดียว
const blankPw = () => ({ open: false, a: "", b: "", admin: "", err: null, msg: null, confirm: false, shown: null, left: 0 });

export const db = $state({ cases: seedCases(), announces: seedAnnounces(), nextAnn: 5, annVersion: 0 });

export const st = $state({
    loggedIn: false,
    // cur = แชทที่เปิดอยู่ · เริ่มที่ยังไม่เปิดแชทไหน (เจ้าของงาน 14 ต.ค. 2026 · แบบ LINE — เปิดให้เองลูกค้าจะเห็นว่าอ่านแล้วแต่ยังไม่ตอบ)
    tab: "all", sel: chatChannels().map((m) => m.id), collapsed: {}, cur: null, view: "list", page: "console", menu: false,
    regMsg: null, regErr: {}, lookup: null, lookErr: null, look: null, hist: "all", histModal: false, accModal: false, coSel: null,
    credit: blankCredit(), reg: blankReg(), pw: blankPw(),
    // chanOpen = แผงเลือกแชทที่แสดง (สไลด์ขวา) · panelOff = ซ่อนแผงลูกค้า · editName = เปิดช่องแก้ชื่อ/ไอดี · fold = การ์ดในแผงขวาที่พับ/กาง (แยกต่อเคส)
    chanOpen: false, panelOff: false, editName: false, fold: {},
    scrollTick: 0, // เพิ่มค่าเมื่อต้องเลื่อนห้องแชทลงล่างสุด (= scrollMsgs ของต้นฉบับ)
    // ผู้ช่วย (OA) ขององค์กร (เว็บจริง 27 ต.ค. 2026) — how: email = Verify ด้วยอีเมล · qr = QR Login · none = ไม่มีรหัสผ่านที่บันทึกไว้ (ใช้ QR) · by = แอดมินอื่นกำลัง verify
    assist: [{ name: "ตย15", ok: true, how: "email" }, { name: "ตย22", ok: true, how: "email" }, { name: "กะดึก", ok: true, how: "qr" }],
    assistChecking: false,
    // ข้อความในช่องพิมพ์ของห้องแชท (ปุ่ม "ขอเลขบัญชีลูกค้า" ใส่ข้อความให้ แอดมินกดส่งเอง) · lookRes = ผลค้นหาสมาชิก · rebind = สมาชิกที่จะเปลี่ยนการผูก
    draft: "", lookRes: null, rebind: null,
});

export const S = $state({
    tab: "stk", ch: "", scope: { kind: "agent", id: "agA" }, all: false, fav: ["446-0", "446-1", "789-0"], f: {}, pack: null, picked: [], ed: {}, msg: {}, sheet: null,
    // items = สติ๊กเกอร์ในชุด (ต้นฉบับเก็บแค่จำนวน n ⇒ เพิ่ม items ให้หน้าแชตส่งได้จริง)
    stk: [
        { name: "ทักทายลูกค้า", n: 3, src: "agent", lock: true, items: ["446-0", "446-1", "446-2"] },
        { name: "ตอบรับ", n: 4, items: ["789-0", "789-1", "789-2", "789-3"] },
    ],
    // star = ติดดาว ⇒ เป็นปุ่มในแถว "คีย์ลัด" ใต้ห้องแชท (เว็บจริง 27 ต.ค. 2026)
    qr: [
        { name: "ทักทาย", star: true, src: "agent", lock: true, items: [{ t: "text", v: "สวัสดีค่ะ ยินดีให้บริการ" }] },
        { name: "แจ้งบัญชีฝาก", star: true, src: "agent", items: [{ t: "text", v: "กรุณาโอนเข้าบัญชี กสิกรไทย 038-8-41275-6 แล้วส่งสลิปในแชทนี้ค่ะ" }] },
        { name: "ขอบคุณ", star: false, src: "agent", lock: true, items: [{ t: "text", v: "ขอบคุณที่ใช้บริการค่ะ 🙏" }] },
    ], qrDraft: [], bc: [{ t: "text", v: "" }], bcAsk: false,
    am: [{ name: "ทักทาย", kw: "สวัสดี", mode: "มีคำนี้", reply: "สวัสดีค่ะ ยินดีให้บริการ", on: true, src: "agent", lock: true }, { name: "ถามเลขบัญชี", kw: "เลขบัญชี\nโอนเข้าบัญชีไหน", mode: "มีคำนี้", reply: "กรุณาโอนเข้าบัญชี กสิกรไทย 038-8-41275-6 แล้วส่งสลิปในแชทนี้ค่ะ", on: true, src: "agent" }], skShow: false, skKey: "sk_live_7Hq2Lm9XvR4tK8pZ", mgrOpen: false,
    flex: [{ n: "การ์ดโปรโมชั่น", v: "" }, { n: "การ์ดแจ้งยอดฝาก", v: "แจ้งยอดฝากสำเร็จ" }],
    // ตั้งค่าทั่วไป › ส่งข้อความหลังปิดเคส (เว็บจริง 27 ต.ค. 2026): สร้าง "ชุดข้อความ" ได้หลายชุด (ชุดละ 1–5 รายการ · สูงสุด 20 ชุด)
    //   ccUse = ชุดที่ใช้เมื่อปิดเคส (null = ไม่ส่งข้อความ) · ccUseBy = ใครเลือกล่าสุด · cc = รายการในฟอร์มสร้าง/แก้ชุด
    ccSets: [
        { name: "ปิดเคส", src: "agent", lock: true, items: [{ t: "text", v: "ขอบคุณค่ะ" }], by: "admin02", at: "26/10/69 20:54" },
        { name: "ขอบคุณหลังจบเคส", items: [{ t: "text", v: "ขอบคุณที่ใช้บริการค่ะ 🙏 มีอะไรทักมาได้ตลอดนะคะ" }, { t: "sticker", v: "446-1" }], by: "admin01", at: "26/10/69 19:12" },
    ],
    ccUse: 0, ccUseBy: { by: "admin02", at: "26/10/69 16:43" },
    cc: [{ t: "text", v: "" }],
    // ccEdit = กำลังแก้ (ยังไม่เคยตั้ง ⇒ เปิดฟอร์มไว้) · ccBak = ค่าก่อนแก้ ใช้ตอนกดยกเลิก
    ccEdit: true, ccBak: null,
    // Broadcast: ผู้รับ (all ทุกคน · pick เลือกผู้รับ — bcSel = id แชทที่เลือก) · ตั้งเวลา · ประวัติ & คิว (ตัวอย่างจากระบบจริง 15 ต.ค. 2026)
    // parts ในประวัติ = สติ๊กเกอร์/รูปที่ส่ง (แสดงเป็นรูปย่อ)
    bcTo: "all", bcSched: false, bcSel: [],
    // Telegram Bot ต่อ Channel · tgBusy = กำลังเชื่อม / ยกเลิก · tgAsk = ถามก่อนยกเลิกการเชื่อมต่อ
    tg: { ...TG_BOTS }, tgBusy: false, tgAsk: false,
    bcHist: [
        { title: "เทส", parts: [{ t: "sticker", v: "11538-6" }], when: "14 ต.ค. 2569 20:13", who: "mook@superx", to: "1 คน", sent: "ส่ง 1 จาก 1" },
        { title: "เทส", parts: [], when: "14 ต.ค. 2569 20:06", who: "mook@superx", to: "ทุกคน", sent: "ส่ง 3 จาก 3" },
    ],
});

/* การตั้งค่าระดับ Agent / Channel (สเปกเจ้าของงาน 29 ต.ค. 2026 · ทุกหมวดใช้หลักเดียวกัน)
   · Agent = ค่าเริ่มต้น (Default) ของทุก Channel ใน Agent
   · หน้า Channel แยก 2 การ์ดต่อหมวด
       Default Agent = รายการของ Agent แสดงค่าปัจจุบันของ Agent เสมอ · ติดดาว / เปิดปิด / ไม่ใช้ใน Channel นี้ เก็บเป็นค่าของ Channel
       Custom = รายการของ Channel · กดแก้ไขรายการ Default ⇒ ได้ฉบับ Custom (from = id ต้นฉบับ) ใช้แทนรายการนั้นใน Channel นี้
       การ์ด Default ยังแสดงค่าเดิม · "คืนค่าเริ่มต้น" ของรายการ = ลบฉบับ Custom ⇒ กลับไปใช้รายการของ Agent
   · รายการ: ccSets = ชุดข้อความหลังปิดเคส · stk = ชุดสติ๊กเกอร์ · qr = คีย์ลัด · am = ข้อความอัตโนมัติ
   · สติ๊กเกอร์โปรด: ของ Agent (ไม่ใช้บางรูปได้) + ของ Channel เอง
   · ชุดที่ใช้เมื่อปิดเคส: Channel ตามค่าของ Agent หรือเลือกเอง (ชุดของ Agent / ชุด Custom / ไม่ส่ง)
   (เสียงแจ้งเตือนจำในเบราว์เซอร์ของแอดมินแต่ละคน จึงไม่แยกตาม Agent/Channel) */
export const SECTIONS = { gen: ["ccSets", "ccUse", "ccUseBy"], stk: ["fav", "stk"], qr: ["qr"], am: ["am"] };
const LISTS = ["qr", "am", "ccSets", "stk"];
const SEC_LISTS = { gen: ["ccSets"], stk: ["stk"], qr: ["qr"], am: ["am"] };
const SKEYS = Object.values(SECTIONS).flat();
const copy = (v) => (v == null ? v : JSON.parse(JSON.stringify(v)));
const snap = (o, sec) => JSON.stringify(SECTIONS[sec].map((k) => o[k]));
let seq = 0;
const uid = (k) => k + "-" + Date.now().toString(36) + "-" + ++seq;
LISTS.forEach((k) => S[k].forEach((x, i) => (x.id = x.id || k + "-" + i)));
// "agent:agA" → ค่าครบทุกหมวด · "ch:alpha1" → รายการ Custom ของแต่ละหมวด + pref (ค่าของ Channel ที่ตั้งบนรายการของ Agent)
export const scopes = $state({});
agents.forEach((a) => {
    const o = {};
    SKEYS.forEach((k) => (o[k] = copy(S[k])));
    scopes["agent:" + a.id] = o;
});
const blankCh = () => ({ qr: [], am: [], ccSets: [], stk: [], fav: [], pref: { qr: {}, am: {}, ccSets: {}, stk: {}, favHidden: {}, ccUse: null } });
// ตัวอย่าง: Alpha 1 มีทั้งรายการที่สร้างเอง และรายการที่แก้จาก Default Agent · Beta 1 มีคีย์ลัด Custom
scopes["ch:alpha1"] = {
    ...blankCh(),
    qr: [
        { id: "qr-alpha1-acc", from: "qr-1", name: "แจ้งบัญชีฝาก", star: true, src: "custom", items: [{ t: "text", v: "กรุณาโอนเข้าบัญชี ไทยพาณิชย์ 412-2-90564-1 (บัญชีของ Alpha 1) แล้วส่งสลิปในแชทนี้ค่ะ" }] },
        { id: "qr-alpha1-new", name: "โปรสมาชิกใหม่", star: false, src: "custom", items: [{ t: "text", v: "สมัครใหม่วันนี้ รับโบนัส 50% สูงสุด 500 บาทค่ะ" }, { t: "sticker", v: "446-1" }] },
    ],
    am: [
        { id: "am-alpha1-acc", from: "am-1", name: "ถามเลขบัญชี", kw: "เลขบัญชี\nโอนเข้าบัญชีไหน\nบัญชีอะไร", mode: "มีคำนี้", reply: "กรุณาโอนเข้าบัญชี ไทยพาณิชย์ 412-2-90564-1 (บัญชีของ Alpha 1) แล้วส่งสลิปในแชทนี้ค่ะ", on: true, src: "custom" },
        { id: "am-alpha1-promo", name: "ถามโปรโมชั่น", kw: "โปร\nโบนัส", mode: "มีคำนี้", reply: "โปรโมชั่นล่าสุดดูได้ที่ประกาศของ Alpha 1 ค่ะ", on: true, src: "custom" },
    ],
    ccSets: [
        { id: "cc-alpha1-thx", from: "ccSets-1", name: "ขอบคุณหลังจบเคส", src: "custom", items: [{ t: "text", v: "ขอบคุณที่ใช้บริการ Alpha 1 ค่ะ" }, { t: "sticker", v: "446-2" }], by: "admin01", at: "28/10/69 10:20" },
        { id: "cc-alpha1-vip", name: "ปิดเคสลูกค้า VIP", src: "custom", items: [{ t: "text", v: "ขอบคุณลูกค้า VIP ค่ะ มีอะไรทักแอดมินได้ตลอด 24 ชั่วโมงนะคะ" }], by: "admin01", at: "28/10/69 10:25" },
    ],
    stk: [{ id: "stk-alpha1-promo", name: "โปรโมชั่น Alpha", n: 2, src: "custom", items: ["789-4", "789-5"] }],
    fav: ["446-3", "446-4"],
};
scopes["ch:beta1"] = { ...blankCh(), qr: [{ id: "qr-beta1-promo", name: "โปรวันนี้", star: false, src: "custom", items: [{ t: "text", v: "วันนี้ฝากครั้งแรกรับโบนัส 100% ค่ะ" }] }] };
const agentIdOf = (id) => (agentOf(id) || {}).id || "";
const agentScopeOf = (id) => scopes["agent:" + agentIdOf(id)] || {};
// อ่านอย่างเดียว (ใช้ใน $derived ได้) · สร้างที่เก็บของ Channel เฉพาะตอนมีการกระทำ
const chRead = (id) => scopes["ch:" + id];
const chOf = (id) => scopes["ch:" + id] || (scopes["ch:" + id] = blankCh());
// รายการของ Agent ที่เลือกส่งเฉพาะบาง Channel (only) ⇒ Channel อื่นไม่ได้รับ
const forCh = (v, id) => (v ? v.filter((x) => !x.only || x.only.indexOf(id) >= 0) : []);
// Channel มีค่าของตัวเองในหมวดนี้ไหม (รายการ Custom / สติ๊กเกอร์โปรดของตัวเอง / เลือกชุดปิดเคสเอง)
export const overrides = (id, sec) => {
    const ch = chRead(id);
    if (!ch) return false;
    return SEC_LISTS[sec].some((k) => ch[k].length > 0) || (sec === "stk" && ch.fav.length > 0) || (sec === "gen" && !!ch.pref.ccUse);
};
// การ์ด Default Agent ในหน้า Channel: รายการของ Agent + ค่าของ Channel + มีฉบับ Custom แทนแล้วไหม
export function defaultsFor(id, k) {
    const ch = chRead(id);
    const pref = (ch && ch.pref[k]) || {}, mine = (ch && ch[k]) || [];
    return forCh(agentScopeOf(id)[k], id)
        .map((x) => ({ x, pref: pref[x.id] || {}, forked: mine.some((c) => c.from === x.id) }))
        .sort((a, b) => (a.x.lock ? 0 : 1) - (b.x.lock ? 0 : 1));
}
// รายการที่ Channel ใช้จริง: Default ที่ยังใช้ (ไม่ถูกแทน · ไม่ได้ปิด) ตามด้วย Custom
function effList(id, k) {
    const ch = chRead(id);
    const def = defaultsFor(id, k)
        .filter((d) => !d.forked)
        .map((d) => ({ ...d.x, ...(k === "qr" && d.pref.star != null ? { star: d.pref.star } : {}), ...(k === "am" && d.pref.on != null ? { on: d.pref.on } : {}) }));
    return [...def, ...((ch && ch[k]) || [])];
}
// สติ๊กเกอร์โปรดของ Agent ในหน้า Channel (ค่าเริ่มต้น — ลบที่ Channel ไม่ได้)
export function agentFavFor(id) {
    return agentScopeOf(id).fav || [];
}
// ชุดข้อความที่ส่งเมื่อปิดเคส: ref "none" · "d:id" (ชุดของ Agent — ถ้ามีฉบับ Custom ใช้ฉบับนั้น) · "c:id" (ชุด Custom) · ไม่ตั้ง = ตามค่าของ Agent
function closeSetOf(id) {
    const ch = chRead(id), ag = agentScopeOf(id), mine = (ch && ch.ccSets) || [];
    const fromAgent = (sid) => mine.find((c) => c.from === sid) || forCh(ag.ccSets, id).find((x) => x.id === sid) || null;
    const ref = ch && ch.pref.ccUse ? ch.pref.ccUse.ref : null;
    if (ref === "none") return null;
    if (ref && ref.startsWith("c:")) return mine.find((x) => x.id === ref.slice(2)) || null;
    if (ref && ref.startsWith("d:")) return fromAgent(ref.slice(2));
    const a = ag.ccUse != null && ag.ccSets ? ag.ccSets[ag.ccUse] : null;
    return a ? fromAgent(a.id) : null;
}
export const closeSetName = (id) => (closeSetOf(id) || {}).name || "";
export const closeSetId = (id) => (closeSetOf(id) || {}).id || "";
// ค่าที่ Channel ใช้จริง (ห้องแชท)
export function eff(id) {
    const ch = chRead(id);
    const fav = [...(agentScopeOf(id).fav || []), ...((ch && ch.fav) || [])];
    return { qr: effList(id, "qr"), am: effList(id, "am"), stk: effList(id, "stk"), ccSets: effList(id, "ccSets"), fav: [...new Set(fav)], closeSet: closeSetOf(id) };
}
// Channel ใน Agent (custom = Channel ที่มีค่าของตัวเองในหมวดนี้)
export function channelsOf(agentId, sec) {
    const all = chatChannels().filter((m) => agentIdOf(m.id) === agentId && (sec !== "stk" || m.platform === "line"));
    return { def: all, custom: all.filter((m) => overrides(m.id, sec)) };
}
// โหลดค่าของขอบเขตที่เปิดอยู่เข้า S · Agent ⇒ ค่าของ Agent · Channel ⇒ รายการ Custom / สติ๊กเกอร์โปรดของ Channel
function loadScope() {
    const sc = S.scope;
    if (sc.kind === "agent") {
        const ag = scopes["agent:" + sc.id];
        SKEYS.forEach((k) => (S[k] = ag[k]));
    } else {
        const ch = chOf(sc.id);
        [...LISTS, "fav"].forEach((k) => (S[k] = ch[k]));
        S.ccUse = null;
        S.ccUseBy = {};
    }
}
// หลังทุกการกระทำในหน้าตั้งค่า: ติดป้าย/รหัสรายการใหม่ · เก็บค่ากลับ · แจ้งการส่งต่อเมื่อ Agent แก้
function saveScope(before) {
    const sc = S.scope;
    LISTS.forEach((k) => S[k].forEach((x) => {
        if (!x.src) x.src = sc.kind === "agent" ? "agent" : "custom";
        if (!x.id) x.id = uid(k);
    }));
    if (sc.kind !== "agent") {
        const ch = chOf(sc.id);
        [...LISTS, "fav"].forEach((k) => (ch[k] = S[k]));
        return;
    }
    const ag = scopes["agent:" + sc.id];
    for (const [sec, keys] of Object.entries(SECTIONS)) {
        keys.forEach((k) => (ag[k] = S[k]));
        if (before[sec] === snap(S, sec)) continue;
        if (pushNote) {
            ok(pushNote);
            pushNote = null;
        } else ok("อัปเดตค่าเริ่มต้น Agent ของ " + channelsOf(sc.id, sec).def.length + " Channel · รายการที่ Channel แก้เป็น Custom ไว้จะไม่ถูกทับ");
    }
}
// การ์ด Default Agent: ติดดาว / เปิดปิด / ไม่ใช้ใน Channel นี้ — เก็บเป็นค่าของ Channel (รายการของ Agent ไม่เปลี่ยน)
export function defPref(k, itemId, patch) {
    const ch = chOf(S.scope.id);
    ch.pref[k][itemId] = { ...(ch.pref[k][itemId] || {}), ...patch };
}
// Channel เลือกชุดข้อความที่ใช้เมื่อปิดเคส · "inherit" = ตามค่าของ Agent
export function setCloseUse(ref) {
    const ch = chOf(S.scope.id);
    ch.pref.ccUse = ref === "inherit" ? null : { ref, by: ME, at: TODAY + " " + nowT() };
    const nm = closeSetName(S.scope.id);
    ok(nm ? "ปิดเคสแล้วระบบจะส่งชุด “" + nm + "” ให้ลูกค้า" : "ปิดเคสแล้วระบบจะไม่ส่งข้อความให้ลูกค้า");
}
// กดแก้ไขรายการ Default ⇒ เปิดฟอร์มจากค่าของ Agent · บันทึกแล้วได้ฉบับ Custom ที่ใช้แทนรายการนั้นใน Channel นี้
export function forkDefault(k, itemId) {
    const d = defaultsFor(S.scope.id, k).find((x) => x.x.id === itemId);
    if (!d) return;
    const f = S.f, x = d.x;
    f.forkFrom = x.id;
    if (k === "qr") {
        S.ed.qr = null;
        f.qrName = x.name;
        f.forkStar = d.pref.star != null ? d.pref.star : !!x.star;
        S.qrDraft = x.items.map((it) => ({ ...it }));
        S.msg.qr = null;
    } else if (k === "am") {
        S.ed.am = null;
        f.amName = x.name;
        f.amKw = x.kw;
        f.amMode = x.mode;
        f.amReply = x.reply;
        f.amOn = d.pref.on != null ? d.pref.on : x.on;
        S.msg.am = null;
    } else if (k === "ccSets") {
        S.ed.cc = null;
        f.ccName = x.name;
        S.cc = x.items.map((it) => ({ ...it }));
        S.msg.cc = null;
    } else {
        S.ed.stk = null;
        f.stkName = x.name;
        S.picked = (x.items || []).slice();
        S.pack = null;
        S.msg.stk = null;
    }
    S.sheet = { qr: "qr", am: "am", ccSets: "cc", stk: "stk" }[k];
}
// คืนค่าเริ่มต้นของรายการ Custom ที่แก้มาจาก Default ⇒ ลบฉบับ Custom แล้วใช้รายการของ Agent
export function resetItem(k, i) {
    const x = S[k][i];
    if (!x || !x.from) return;
    S[k].splice(i, 1);
    ok("คืนค่าเริ่มต้นแล้ว — \"" + x.name + "\" ใช้รายการของ Agent");
}
// ข้อความแจ้งหลังบันทึกรายการที่เลือกส่งเฉพาะบาง Channel (ตั้งใน qr-save / am-save)
let pushNote = null;
// ตัวเลือก "ส่งไปทุก Channel" ในฟอร์มคีย์ลัด/ข้อความอัตโนมัติของ Agent: ตรวจ แล้วคืน only (null = ทุก Channel ที่ใช้ค่าเริ่มต้น)
function pushTarget(f, key) {
    if (S.scope.kind !== "agent" || f.toAll !== false) return { only: null };
    const ids = channelsOf(S.scope.id, key).def.map((m) => m.id).filter((id) => (f.toCh || []).indexOf(id) >= 0);
    if (!ids.length) return { err: "เลือก Channel ที่จะส่งอย่างน้อย 1 Channel หรือติ๊ก \"ส่งไปทุก Channel\"" };
    return { only: ids };
}
function pushFormLoad(f, x) {
    f.toAll = !(x && x.only);
    f.toCh = x && x.only ? x.only.slice() : [];
}
// เริ่มต้น: หน้าตั้งค่าแสดงค่าของ Agent แรก
queueMicrotask(() => loadScope());

export const cur = () => db.cases.filter((c) => c.id === st.cur)[0];
export const isNarrow = () => window.innerWidth <= 760;
// แสดงเฉพาะแชทของ Channel ที่ติ๊ก · ไม่ติ๊กเลย = ไม่แสดง (เจ้าของงานสั่ง 12 ต.ค. 2026 — เปลี่ยนจากเดิมที่ไม่ติ๊ก = แสดงทั้งหมด)
// เปิดระบบมาครั้งแรกติ๊กไว้ทุก Channel ที่เลือกแชตได้
export const visible = () => db.cases.filter((c) => st.sel.indexOf(c.merchant) >= 0);
// ลำดับรายการแชท: เคสที่ยังไม่ปิดอยู่บน เคสที่ปิดแล้วกองไว้ล่างสุด · ในแต่ละกลุ่มข้อความล่าสุดขึ้นก่อน (เจ้าของงานสั่ง 14 ต.ค. 2026)
export const byRecent = (a, b) => (a.status === "closed") - (b.status === "closed") || b.at - a.at;

/* toast ตาม DESIGN-SYSTEM §10.9 — ข้อความกลาง ๆ ใช้ toast() · เรื่องที่สำเร็จใช้ ok() (ไอคอนสีสำเร็จ) */
export function toast(t) {
    sonner(t);
}
export function ok(t) {
    sonner.success(t);
}
export function scrollMsgs() {
    st.scrollTick++;
}

export function push(c, who, text, extra) {
    const m = { who, text, t: nowT() };
    if (extra) for (const k in extra) m[k] = extra[k];
    c.msgs.push(m);
    c.ago = "เมื่อสักครู่";
    c.at = Date.now(); // มีข้อความใหม่ ⇒ ขึ้นบนสุดของกลุ่ม
    if (c.id === st.cur) scrollMsgs();
    // ข้อความลูกค้าเข้า ⇒ เสียงแจ้งเตือน · นับยังไม่อ่านถ้าไม่ได้เปิดแชทนั้นอยู่ (เจ้าของงานสั่ง 15 ต.ค. 2026)
    if (who === "cust") {
        if (c.id !== st.cur) c.unread = (c.unread || 0) + 1;
        playChime();
    }
}
export function accept(c) {
    if (c.status === "waiting") {
        c.status = "open";
        c.admin = ME;
        push(c, "sys", "แอดมิน " + ME + " รับเคสแล้ว");
    }
}

/* ---------- navigation ---------- */
export function setView(v) {
    st.view = v;
}
export function setMenu(v) {
    st.menu = v;
}
export function showPage(p) {
    st.page = p;
    if (p === "announce") db.annVersion++; // renderAnnounce() — ล้างค่าที่พิมพ์ค้างในตาราง
}
// agentId = เปิดการตั้งค่าระดับ Agent (ใช้กับทุก Channel ใน Agent) · ch = ชื่อ Channel · ไม่ระบุ ⇒ Channel ของแชทที่เปิดอยู่
export function openSettings(tab, ch, all, agentId) {
    if (tab) S.tab = tab;
    if (!ch && !agentId && cur()) ch = (merch(cur().merchant) || {}).name;
    S.ch = agentId ? "" : ch || "";
    const m = S.ch ? chanByName(S.ch) : null;
    S.scope = m ? { kind: "ch", id: m.id } : { kind: "agent", id: agentId || agents[0].id };
    S.ed = {};
    loadScope();
    // แท็บที่จำไว้ไม่มีใน Channel นี้ (เช่น ชุดสติ๊กเกอร์ของ Telegram) ⇒ เปิดตั้งค่าทั่วไป
    const plat = m ? m.platform : "";
    const t = SET_TABS.find((x) => x[0] === S.tab);
    if (plat && t && t[3] && t[3] !== plat) S.tab = "gen";
    S.all = !!all;
    S.msg = {};
    showPage("settings");
}
export function login() {
    st.loggedIn = true;
    st.cur = null; // ล็อกอินทุกครั้งเริ่มที่หน้าว่าง ให้แอดมินเลือกแชทเอง (รวมล็อกอินใหม่หลังออกจากระบบ)
    st.look = null;
    setView(isNarrow() ? "list" : st.view);
    scrollMsgs();
}
export function logout() {
    st.loggedIn = false;
    st.signedOut = true;
    showPage("console");
}
export function go(g) {
    setMenu(false);
    if (g === "home") showPage("console");
    else if (g === "announce") showPage("announce");
    else if (SETMAP[g]) openSettings(SETMAP[g]);
    else if (g === "logout") logout();
    else if (g === "update") ok("อัปเดตข้อมูลแล้ว");
    else if (g === "clear") ok("เคลียร์ภาพแล้ว");
}

/* ---------- sidebar ---------- */
// เลือกทั้งหมด = ทุก Channel ที่เลือกแชตได้ (เปิดแชทรวม + มีสิทธิ์) · Channel ที่ใช้ LIFF อย่างเดียวไม่ถูกเลือก
export function selectAll(all) {
    st.sel = all ? chatChannels().map((m) => m.id) : [];
}
/* เลือก/ยกเลิกทั้ง Agent — มีผลเฉพาะ Channel ที่เลือกแชตได้ของ Agent นั้น · ไม่แตะค่าฟังก์ชันหรือ Permissions */
export function setAgent(ids, checked) {
    ids.filter(canChat).forEach((id) => toggleMerchant(id, checked));
}
export function toggleMerchant(id, checked) {
    if (!canChat(id)) return;
    const i = st.sel.indexOf(id);
    if (checked && i < 0) st.sel.push(id);
    if (!checked && i >= 0) st.sel.splice(i, 1);
}

/* ---------- list ---------- */
// ฟอร์มในแผงขวาผูกกับลูกค้าคนที่แสดง ⇒ เปลี่ยนลูกค้าแล้วล้าง
function resetPanel() {
    st.regErr = {};
    const pc = panelCase();
    if (pc) pc.justReg = false; // การ์ดสมัครสมาชิกกางค้างไว้เฉพาะหลังสมัครสำเร็จในเคสนั้น
    st.editName = false;
    st.regMsg = null;
    st.lookup = null;
    st.lookErr = null;
    st.lookRes = null;
    st.rebind = null;
    st.pw = blankPw();
    st.credit = blankCredit();
}
export function selectCase(id) {
    st.cur = id;
    const c = cur();
    if (c) c.unread = 0; // เปิดแชท = อ่านแล้ว
    st.look = null; // เปิดแชท ⇒ แผงขวากลับมาแสดงลูกค้าของแชทนั้น
    resetPanel();
    scrollMsgs();
    if (window.innerWidth < 768) setView("chat");
}
/* ลูกค้าที่แผงขวาแสดง (เจ้าของงาน 14 ต.ค. 2026 · แอดมินจัดการข้อมูลลูกค้าจากช่องค้นหาได้โดยไม่ต้องเปิดแชท)
   เลือกจากช่องค้นหา / ตรวจสอบ (st.look) ก่อน · ไม่มี ⇒ ลูกค้าของแชทที่เปิดอยู่ (ถ้ายังอยู่ใน Channel ที่ติ๊ก) · ไม่มีทั้งคู่ ⇒ undefined */
export const panelCase = () =>
    (st.look && db.cases.find((c) => c.id === st.look)) || (st.cur && visible().some((c) => c.id === st.cur) ? cur() : undefined);
// เลือกลูกค้าจากช่องค้นหา ⇒ แสดงข้อมูลในแผงขวาเท่านั้น ไม่เปิดแชท (ลูกค้าจะไม่เห็นว่าอ่านแล้ว)
export function pickSearch(id) {
    if (!db.cases.some((x) => x.id === id)) return;
    st.look = id === st.cur && visible().some((c) => c.id === id) ? null : id;
    resetPanel();
    showPage("console");
    if (window.innerWidth < 768) setView("panel");
}
export function closeLook() {
    st.look = null;
    resetPanel();
}
export function counts() {
    const base = visible();
    return { all: base.length, line: base.filter((c) => tabOf(c) === "line").length, payment: base.filter((c) => tabOf(c) === "payment").length };
}

/* ---------- chat ---------- */
export function closeCase(c) {
    if (!c || c.status === "closed") return;
    if (c.admin && c.admin !== ME) {
        toast(c.admin + " รับผิดชอบอยู่ — ปิดแทนไม่ได้");
        return;
    }
    c.status = "closed";
    if (!c.admin) c.admin = ME;
    c.closedBy = ME;
    c.closedAt = nowT();
    // แถบปิดเคสอยู่ในลำดับข้อความ ณ เวลาที่ปิด — ข้อความที่ส่งหลังจากนี้ต่อท้ายแถบ (เว็บจริง 27 ต.ค. 2026)
    push(c, "sys", "", { action: "closed", by: ME });
    // ตั้งค่าทั่วไป › ส่งข้อความหลังปิดเคส — ส่งชุดที่เลือกไว้ตามลำดับในชื่อของคนที่กดปิดเคส · ลูกค้า Telegram ไม่ได้รับสติ๊กเกอร์
    const set = eff(c.merchant).closeSet;
    const tg = (merchants.find((m) => m.id === c.merchant) || {}).platform === "telegram";
    if (set) set.items.filter((it) => !(tg && it.t === "sticker")).forEach((it) => sendItem(c, it, ME));
    scrollMsgs();
    ok("ปิดเคสแล้ว");
}
/* ส่งรายการเดียว (ข้อความ · สติ๊กเกอร์ · รูปภาพ) — ใช้กับคีย์ลัด และข้อความหลังปิดเคส */
function sendItem(c, it, by) {
    if (it.t === "sticker") push(c, "admin", "", { action: "sticker", key: it.v, by });
    else if (it.t === "image") push(c, "admin", "", { action: "image", src: it.src, name: it.v, by });
    else push(c, "admin", it.v, { by });
}
/* แถบเครื่องมือช่องพิมพ์ (เว็บต้นฉบับ 15 ต.ค. 2026) — ⚡ คีย์ลัด · 💳 การ์ดข้อความ · 🖼️ ส่งรูปภาพ */
export function sendQuickSet(c, i) {
    const q = eff(c.merchant).qr[i];
    if (c.status === "closed" || !q) return;
    accept(c);
    q.items.forEach((it) => sendItem(c, it));
}
export function sendCard(c, i) {
    if (c.status === "closed") return;
    accept(c);
    push(c, "admin", "", { action: "card", card: CARDS[i].name, desc: CARDS[i].desc });
}
export function sendImage(c, src, name) {
    // ปิดเคสแล้วยังส่งได้ตามปกติ เคสยังปิดอยู่จนลูกค้าทักมาใหม่ (เว็บจริง 27 ต.ค. 2026)
    accept(c);
    push(c, "admin", "", { action: "image", src, name });
}
/* ประเภทเคส (ปุ่ม ฝาก / ถอน / เรื่องทั่วไป ในหัวห้องแชท) */
export function setType(c, t) {
    if (c.status === "closed" || c.type === t) return;
    c.type = t;
    ok("เปลี่ยนประเภทเป็น " + typeLabel[t]);
}
/* โน้ตของลูกค้า — แสดงเป็นรายการใต้ช่องโน้ต (วันเวลา · ข้อความ · ผู้บันทึก) */
export function addNote(c, text) {
    const v = text.trim();
    if (!v) return false;
    (c.notes = c.notes || []).push({ t: TODAY + " " + nowT(), text: v, by: ME });
    ok("บันทึกโน้ตแล้ว");
    return true;
}
export function delNote(c, i) {
    c.notes.splice(i, 1);
    toast("ลบโน้ตแล้ว");
}
export function saveName(c, name, username) {
    st.editName = false;
    c.name = name || c.name;
    c.user.username = username || c.user.username;
    ok("บันทึกชื่อและไอดีแล้ว");
}
export function sendText(c, v) {
    v = v.trim();
    if (!v) return false;
    accept(c);
    push(c, "admin", v);
    return true;
}
export function quickSend(c, annId) {
    const a = db.announces.filter((x) => String(x.id) === String(annId))[0];
    if (a && c.status !== "closed") {
        accept(c);
        push(c, "admin", a.text);
    }
}
/* ส่งสติ๊กเกอร์จากหน้าแชต — รับเคสก่อนถ้ายังรอแอดมิน (เหมือนส่งข้อความ) */
export function sendSticker(c, key) {
    // ปิดเคสแล้วยังส่งได้ตามปกติ เคสยังปิดอยู่จนลูกค้าทักมาใหม่ (เว็บจริง 27 ต.ค. 2026)
    accept(c);
    push(c, "admin", "", { action: "sticker", key });
}
export const ASK_ACC = "รบกวนแจ้งเลขที่บัญชีธนาคารและชื่อบัญชีของท่าน เพื่อสมัครสมาชิกด้วยครับ/ค่ะ 🙏";
export function askAcc(c) {
    if (!c) return;
    st.draft = ASK_ACC;
    ok("ใส่ข้อความขอเลขที่บัญชีในช่องพิมพ์ — กดส่งเอง");
    requestAnimationFrame(() => document.getElementById("msgIn")?.focus());
}
// ปุ่ม "จำลองสลิป" (mockSlip) เอาออกแล้ว 14 ต.ค. 2026 — สลิปในต้นแบบมาจากข้อมูลตัวอย่างใน data.js เท่านั้น
export function slipCheck(c, i) {
    const sm = c.msgs[i];
    sm.checked = true;
    sm.idx = i;
    c.slip = { state: "reading", amt: sm.amt, variant: sm.variant, idx: i };
    delete st.fold[c.id + "|ตรวจสอบสลิป"]; // กางการ์ดผลตรวจให้เห็น
    scrollMsgs();
    // การ์ดผลตรวจอยู่บนสุดของแผงลูกค้า ⇒ เลื่อนแผงขึ้นบนให้เห็นทันที (ลดการเคลื่อนไหว ⇒ กระโดดไปเลย)
    requestAnimationFrame(() => {
        const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
        document.getElementById("colPanel")?.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
    });
    setTimeout(() => {
        if (c.slip && c.slip.state === "reading") {
            c.slip = slipData(sm, ME);
            sm.v = c.slip.v; // ป้ายผลใต้รูปในแชท
        }
    }, 4000);
}
/* ตรวจอีกครั้ง (ยังไม่พบรายการ · รอผล · ตรวจไม่สำเร็จ) — ต้นแบบ: ครั้งที่สองธนาคารมีรายการแล้ว ⇒ ผลเป็นสลิปจริง */
export function slipRetry(c) {
    const i = c.slip && c.slip.idx;
    if (i == null) return;
    c.msgs[i].variant = "real";
    slipCheck(c, i);
}
// ปิดผลตรวจสลิป ⇒ การ์ดกลับเป็นปุ่มในแถวบน (ผลยังอยู่ใต้รูปในแชท)
export function slipDismiss(c) {
    c.slip = { ...c.slip, hidden: true };
}

/* ---------- right panel ---------- */
export function verifyLine(c) {
    if (c.lineOk) {
        ok("Verify แล้ว: ไลน์ออนไลน์อยู่");
        return;
    }
    c.lineOk = true;
    push(c, "sys", "Verify สำเร็จ");
    ok("Verify แล้ว");
}
/* ผู้ช่วย (OA): Verify / QR Login ⇒ เปิดหน้าต่างให้ login ใหม่ (ต้นแบบ: สำเร็จหลัง 1.5 วินาที) */
export function assistVerify(a) {
    a.busy = true;
    setTimeout(() => {
        a.busy = false;
        a.ok = true;
        ok("Verify ผู้ช่วย " + a.name + " แล้ว");
    }, 1500);
}
export function assistCheckAll() {
    st.assistChecking = true;
    setTimeout(() => {
        st.assistChecking = false;
        const n = st.assist.filter((a) => !a.ok).length;
        n ? toast("ผู้ช่วยหมดอายุ " + n + " คน — กด Verify เพื่อ login ใหม่") : ok("ผู้ช่วยทุกคนออนไลน์อยู่");
    }, 1200);
}
// ปุ่มทดลอง: ผู้ช่วย 2 คนหมดอายุ (1 คนมีแอดมินอื่นกำลัง verify อยู่) · อีกคนไม่มีรหัสผ่าน ⇒ ใช้ QR
export function assistExpire() {
    st.assist[1].ok = false;
    st.assist[2].ok = false;
    st.assist[2].by = "admin02";
    toast("ตั้งผู้ช่วยเป็นหมดอายุแล้ว (ต้นแบบ)");
    setTimeout(() => {
        delete st.assist[2].by;
    }, 8000);
}
export function pingLine(c) {
    const p = pingOf(c);
    if (p == null) toast("Ping ไม่ได้: ไลน์หลุดการเชื่อมต่อ");
    else ok("Ping: " + p + " ms");
}
/* ผูกสมาชิกกับแชท (เว็บจริง 27 ต.ค. 2026) — ค้นหาด้วย username / เบอร์ / ชื่อ ⇒ รายชื่อ ⇒ กดชื่อเพื่อผูก
   แชทที่ผูกอยู่แล้ว ⇒ ถามก่อน "เปลี่ยนสมาชิกที่ผูกกับแชทนี้?" · ยังไม่เปิดแชท ⇒ กดชื่อแล้วแสดงข้อมูลในแผงขวา */
export function bindMember(c, m) {
    c.user = { ...m.user };
    c.turn = m.turn;
    c.promo = m.promo;
    c.credit = m.credit;
    c.unbound = false;
    st.lookRes = null;
    st.rebind = null;
    st.lookup = null;
    push(c, "sys", "ผูกสมาชิก " + m.user.username + " กับแชทนี้แล้ว");
    ok("ผูกสมาชิก " + m.user.username + " แล้ว");
}
export function unbindMember(c) {
    c.unbound = true;
    st.lookup = "";
    st.lookErr = null;
    st.lookRes = null;
    push(c, "sys", "เลิกผูกสมาชิก " + c.user.username + " กับแชทนี้");
    ok("เลิกผูกสมาชิกแล้ว");
}
// รายชื่อสมาชิกทั้งหมด (ไม่ซ้ำ username) จากแชทที่ผูกไว้ — ข้อมูลจำลองของระบบสมาชิก
const members = () => {
    const seen = {};
    return db.cases.filter((x) => (!x.unbound || x.known) && !seen[x.user.username] && (seen[x.user.username] = 1));
};
export function lookup(v) {
    const q = (v || "").trim().toLowerCase();
    st.lookup = v;
    st.rebind = null;
    if (q.length < 2) {
        st.lookRes = null;
        st.lookErr = "พิมพ์อย่างน้อย 2 ตัวอักษร";
        return;
    }
    st.lookErr = null;
    st.lookRes = members()
        .filter((x) => [x.user.username, x.user.mobile, x.user.fullname].join(" ").toLowerCase().replace(/-/g, "").indexOf(q.replace(/-/g, "")) >= 0)
        .slice(0, 8)
        .map((x) => x.id);
    if (!st.lookRes.length) st.lookErr = "ไม่พบสมาชิก";
}
// กดชื่อในผลค้นหา
export function pickMember(id) {
    const m = db.cases.find((x) => x.id === id);
    const pc = panelCase();
    if (!m) return;
    if (!pc || st.look) {
        st.lookRes = null;
        pickSearch(id);
        return;
    }
    if (pc.unbound) bindMember(pc, m);
    else if (pc.user.username === m.user.username) st.lookRes = null;
    else st.rebind = id;
}
export function rebindCancel() {
    st.rebind = null;
}
export function coAcc(c, i) {
    if (c.status === "closed") return;
    const ca = COACC[i];
    st.coSel = i;
    accept(c);
    push(c, "admin", "โอนเข้าบัญชี " + bankOf(ca.bank).name + " ชื่อบัญชี " + ca.name + " เลขที่ " + ca.no);
    ok("ส่งเลขบัญชีบริษัทให้ลูกค้าแล้ว");
}
const amtOf = (v) => String(v || "").replace(/,/g, "").trim();
// ตรวจก่อน (ข้อความตามเว็บจริง) ⇒ ผ่าน ⇒ ขั้นยืนยัน
export function saveCredit(c) {
    const cr = st.credit, raw = amtOf(cr.amt), camt = parseFloat(raw);
    cr.msg = null;
    cr.err = null;
    if (!raw || isNaN(camt) || !/^\d+(\.\d*)?$/.test(raw)) cr.err = "รูปแบบจำนวนเงินไม่ถูกต้อง";
    else if (!(camt > 0)) cr.err = "จำนวนเงินต้องมากกว่า 0";
    else if (/\.\d{3,}$/.test(raw)) cr.err = "ทศนิยมได้ไม่เกิน 2 ตำแหน่ง";
    else if (cr.type === "sub" && camt > c.credit) cr.err = "จำนวนเงินเกินเครดิตคงเหลือ — ถอนได้ไม่เกิน " + money(c.credit) + " บาท";
    else if (c.promo) cr.err = "สมาชิกกำลังติดโปรโมชั่น — ปรับเครดิตด้วยมือไม่ได้";
    else if (!cr.pass) cr.err = "กรอกรหัสผ่านแอดมินก่อนบันทึก";
    else cr.confirm = true;
}
export function creditCancel() {
    st.credit.confirm = false;
}
export function confirmCredit(c) {
    const cr = st.credit, camt = parseFloat(amtOf(cr.amt)), cadd = cr.type === "add";
    c.credit = Math.round((c.credit + (cadd ? camt : -camt)) * 100) / 100;
    (cadd ? c.histDep : c.histWd).unshift({ amt: camt, time: TODAY + " " + nowT(), ok: true, ref: "CR" + String(Date.now()).slice(-6) });
    // เว็บจริง: ระบบปรับเครดิตทันที ไม่แจ้งลูกค้าในแชท — บันทึกเป็นข้อความระบบ (ลูกค้าไม่เห็น) ว่าใครทำ
    push(c, "sys", (cadd ? "เติมเครดิต " : "ถอนเครดิต ") + money(camt) + " บาท " + (cadd ? "ให้ " : "ของ ") + c.user.username + " โดย " + ME + (cr.note ? " (" + cr.note + ")" : ""));
    st.credit = { ...blankCredit(cr.type), msg: (cadd ? "เติมเครดิต " : "ถอนเครดิต ") + money(camt) + " บาท ให้ " + c.user.username + " แล้ว" };
    ok("บันทึกเครดิตแล้ว");
}
/* เปลี่ยนรหัสผ่านให้ลูกค้า (การ์ดตรวจสอบในแผงขวา) — รหัสใหม่ 2 ครั้ง · รหัสของ Agent / แอดมินเองอยู่ที่ Settings (action "pw-save") */
export function pwOpen() {
    st.pw = { ...blankPw(), open: true };
}
export function pwCancel() {
    st.pw = blankPw();
}
let pwTimer;
export function pwSave(c) {
    const p = st.pw;
    p.err = null;
    if (!/^\S{6,30}$/.test(p.a)) p.err = "รหัสผ่านต้องมี 6-30 ตัวอักษร และไม่มีช่องว่าง";
    else if (!p.b) p.err = "กรอกรหัสผ่านใหม่อีกครั้งเพื่อยืนยัน";
    else if (p.a !== p.b) p.err = "รหัสผ่านที่ยืนยันไม่ตรงกับรหัสผ่านใหม่";
    else if (!p.admin) p.err = "กรอกรหัสผ่านแอดมินก่อน";
    else p.confirm = true;
}
export function pwConfirm(c) {
    const pass = st.pw.a;
    st.pw = { ...blankPw(), msg: "เปลี่ยนรหัสผ่านของ " + c.user.username + " แล้ว — แจ้งรหัสใหม่ให้ลูกค้าทางแชท (ระบบไม่ส่งรหัสให้ลูกค้าเอง)", shown: pass, left: 30 };
    push(c, "sys", "เปลี่ยนรหัสผ่านของ " + c.user.username + " โดย " + ME);
    ok("เปลี่ยนรหัสผ่านลูกค้าแล้ว");
    clearInterval(pwTimer);
    pwTimer = setInterval(() => {
        if (--st.pw.left <= 0) {
            st.pw.shown = null;
            clearInterval(pwTimer);
        }
    }, 1000);
}
export function pwHide() {
    st.pw.shown = null;
    clearInterval(pwTimer);
}
const dupAcc = (no, bank) => db.cases.some((x) => x.user.number === no && x.user.bankCode === bank);
export const MKT = ["SEO", "Facebook", "LINE OA", "TikTok", "เพื่อนแนะนำ"];
// พันธมิตรจำลอง (รหัส ⇒ ชื่อ)
const PARTNERS = { "1024": "ร้านโชคดีมือถือ", "77": "เพจข่าวบอลวันนี้" };
export function regCheck() {
    const e = { ...regValidate("bank"), ...regValidate("no") };
    if (e.bank || e.no) st.regMsg = null;
    else if (dupAcc(st.reg.no.replace(/[\s-]/g, ""), st.reg.bank)) st.regMsg = { ok: false, text: "เลขบัญชีนี้สมัครสมาชิกไว้แล้ว — สมัครซ้ำไม่ได้" };
    else st.regMsg = { ok: true, text: "ยังไม่มีเลขบัญชีนี้ในระบบ — สมัครได้" };
}
/* ตรวจทีละช่องตอนออกจากช่อง (field) และทั้งฟอร์มตอนกดสมัคร — ข้อความตามเว็บจริง 27 ต.ค. 2026 */
export function regValidate(field) {
    const rg = st.reg, e = {};
    const phone = rg.phone.replace(/[\s-]/g, ""), no = rg.no.replace(/[\s-]/g, "");
    if (!/^0\d{8,9}$/.test(phone)) e.phone = "เบอร์โทรต้องเป็นตัวเลข 9-10 หลัก ขึ้นต้นด้วย 0";
    if (!rg.bank) e.bank = "เลือกธนาคาร";
    if (!/^\d{10,13}$/.test(no)) e.no = "เลขบัญชีต้องเป็นตัวเลข 10-13 หลัก";
    const an = rg.acct.trim();
    if (an.length < 2 || an.length > 100) e.acct = "กรอกชื่อบัญชีธนาคาร (2-100 ตัวอักษร)";
    if (!rg.pass) e.pass = "กรอกรหัสผ่านของสมาชิก";
    else if (!/^\S{6,30}$/.test(rg.pass)) e.pass = "รหัสผ่านต้องมี 6-30 ตัวอักษร และไม่มีช่องว่าง";
    if (!rg.mkt) e.mkt = "เลือกช่องทางการตลาด";
    if (rg.partner && !/^[1-9]\d{0,9}$/.test(rg.partner)) e.partner = "รหัสพันธมิตรเป็นตัวเลข 1-10 หลัก ไม่ขึ้นต้นด้วย 0";
    if (field) st.regErr = { ...st.regErr, [field]: e[field] };
    else st.regErr = e;
    return e;
}
// ผู้แนะนำ: ค้นหาสมาชิก (พิมพ์อย่างน้อย 2 ตัวอักษร) ⇒ เลือก ⇒ ช่องทางการตลาดเปลี่ยนเป็น "เพื่อนแนะนำ" (เปลี่ยนกลับได้)
export function refSearch() {
    const q = st.reg.refQ.trim().toLowerCase();
    if (q.length < 2) {
        st.reg.refRes = [];
        st.regErr = { ...st.regErr, ref: "พิมพ์อย่างน้อย 2 ตัวอักษร" };
        return;
    }
    st.regErr = { ...st.regErr, ref: undefined };
    st.reg.refRes = members().filter((x) => [x.user.username, x.user.mobile, x.user.fullname].join(" ").toLowerCase().indexOf(q) >= 0).slice(0, 5).map((x) => x.id);
}
export function refPick(id) {
    const m = db.cases.find((x) => x.id === id);
    st.reg.referrer = { username: m.user.username, name: m.user.fullname };
    st.reg.refRes = null;
    st.reg.mkt = "เพื่อนแนะนำ";
}
export function refClear() {
    st.reg.referrer = null;
}
export function partnerLookup() {
    const r = st.reg;
    r.partnerName = null;
    r.partnerErr = null;
    if (!/^[1-9]\d{0,9}$/.test(r.partner)) r.partnerErr = "รหัสพันธมิตรเป็นตัวเลข 1-10 หลัก ไม่ขึ้นต้นด้วย 0";
    else if (PARTNERS[r.partner]) r.partnerName = PARTNERS[r.partner];
    else r.partnerErr = "ไม่พบพันธมิตรรหัสนี้ของ agent นี้ — ตรวจรหัสพันธมิตรอีกครั้ง";
}
export function regSubmit(c) {
    const rg = st.reg, rno = rg.no.replace(/[\s-]/g, "");
    const e = regValidate();
    if (Object.keys(e).length) {
        st.regMsg = { ok: false, text: "ยังสมัครไม่ได้ — แก้ช่องที่มีข้อความสีแดง " + Object.keys(e).length + " ช่อง" };
        return;
    }
    if (dupAcc(rno, rg.bank)) {
        st.regMsg = { ok: false, text: "เลขบัญชีนี้สมัครสมาชิกแล้ว" };
        return;
    }
    const phone = rg.phone.replace(/[\s-]/g, ""), uname = "99q" + phone;
    // เว็บจริง: สมัครแล้วระบบผูกสมาชิกกับแชทนี้ทันที · เบอร์และรหัสผ่านยังค้างในฟอร์มให้กด "ส่งข้อมูลให้ลูกค้า"
    if (c) {
        const b = bankOf(rg.bank);
        c.lastReg = { phone, pass: rg.pass };
        c.justReg = true;
        c.unbound = false;
        c.user = { ...c.user, username: uname, fullname: rg.acct.trim(), bank: b.name, bankCode: b.code, number: rno, mobile: phone };
        c.turn = null;
        c.promo = null;
        c.credit = 0;
        push(c, "sys", "สมัครสมาชิก " + uname + " โดย " + ME);
    }
    st.regMsg = { ok: true, text: "สมัครสมาชิก " + uname + (c ? " สำเร็จและผูกกับแชทนี้แล้ว" : " สำเร็จ") };
    st.regErr = {};
    ok("สมัครสมาชิกแล้ว");
}
/* ส่งชื่อผู้ใช้ (เบอร์โทร) และรหัสผ่านของสมาชิกที่เพิ่งสมัครให้ลูกค้าในแชทนี้ — กดได้หลังสมัครสำเร็จ · ส่งแล้วล้างฟอร์ม */
export function sendReg(c) {
    const sd = c && c.lastReg;
    if (!sd) st.regMsg = { ok: false, text: "กรอกเบอร์และรหัสผ่านก่อนส่งข้อมูลให้ลูกค้า" };
    else {
        accept(c);
        push(c, "admin", "ชื่อผู้ใช้: " + sd.phone + " รหัสผ่าน: " + sd.pass);
        c.lastReg = null;
        st.reg = blankReg();
        st.regMsg = { ok: true, text: "ส่งข้อมูลให้ลูกค้าแล้ว" };
    }
}
/* การ์ดในแผงขวาพับ/กาง — ค่าเริ่มต้นต่อการ์ด (def) · กดเปลี่ยนแล้วจำแยกต่อเคส */
export const isFolded = (c, key, def) => {
    const v = st.fold[(c ? c.id : "-") + "|" + key];
    return v === undefined ? !!def : v;
};
export function setFold(c, key, folded) {
    st.fold[(c ? c.id : "-") + "|" + key] = folded;
}
export function regClear() {
    st.reg = blankReg();
    st.regErr = {};
    st.regMsg = null;
}

/* ---------- announce page ---------- */
export function annAdd(v) {
    const nm = v.name.trim();
    if (!nm) {
        toast("กรอก Name ก่อน");
        return;
    }
    db.announces.push({ id: db.nextAnn++, sort: +v.sort || 1, type: v.type, name: nm, text: v.text, status: v.status });
    db.annVersion++;
    ok("เพิ่มข้อความแล้ว");
}
export function annSave(id, v) {
    const a2 = db.announces.filter((x) => x.id === id)[0];
    a2.sort = +v.sort || 1;
    a2.type = v.type;
    a2.name = v.name;
    a2.text = v.text;
    a2.status = v.status;
    db.annVersion++;
    ok("บันทึกแล้ว");
}
export function annDel(id) {
    db.announces = db.announces.filter((x) => x.id !== id);
    db.annVersion++;
    toast("ลบแล้ว");
}

/* ---------- settings ---------- */
const listOf = (a) => (a.endsWith("-qr") ? S.qrDraft : a.endsWith("-cc") ? S.cc : S.bc);
function sset(k, ok, t) {
    S.msg[k] = { ok, t };
}
export function setTab(t) {
    S.tab = t;
    S.msg = {};
}
// ทุกการกระทำในหน้าตั้งค่า ⇒ เก็บค่ากลับไปที่ขอบเขตที่เปิดอยู่ (Agent / Channel)
const DEL_OF = { "qr-del": "qr", "am-del": "am", "cc-del": "ccSets", "stk-del": "stk" };
export function settingsAct(a, i, el = {}) {
    // ค่าเริ่มต้น Agent แบบลบไม่ได้ (lock): แก้ไขได้ แต่ลบไม่ได้
    if (DEL_OF[a] && (S[DEL_OF[a]][i] || {}).lock) return toast("ค่าเริ่มต้นนี้ลบไม่ได้ แต่แก้ไขได้");
    const before = {};
    Object.keys(SECTIONS).forEach((sec) => (before[sec] = snap(S, sec)));
    const r = settingsActIn(a, i, el);
    saveScope(before);
    return r;
}
function settingsActIn(a, i, el = {}) {
    const f = S.f;
    if (a === "stk-pack") S.pack = i;
    else if (a === "stk-pick") {
        const k = el.k, p = S.picked.indexOf(k);
        if (p >= 0) S.picked.splice(p, 1);
        else S.picked.push(k);
    } else if (a === "stk-fav") {
        const fk = el.k, fp = S.fav.indexOf(fk);
        if (fp >= 0) S.fav.splice(fp, 1);
        else S.fav.push(fk);
    } else if (a === "stk-fav-all" || a === "stk-pick-all") {
        // el.keys = สติ๊กเกอร์ทั้งชุดในคลัง · el.on = true เลือกทั้งหมด / false เอาออกทั้งหมด
        const arr = a === "stk-fav-all" ? S.fav : S.picked;
        el.keys.forEach((k) => {
            const p = arr.indexOf(k);
            if (el.on && p < 0) arr.push(k);
            if (!el.on && p >= 0) arr.splice(p, 1);
        });
    } else if (a === "stk-addid") {
        const v = (f.stkId || "").trim(), pv = (f.stkPkg || "").trim();
        if (!/^\d+$/.test(pv) || !/^\d+$/.test(v)) sset("stk", false, "กรอก packageId และ stickerId เป็นตัวเลข");
        else {
            S.picked.push("x-" + pv + "-" + v);
            f.stkId = "";
            f.stkPkg = "";
            S.msg.stk = null;
        }
    } else if (a === "stk-save") {
        const nm = (f.stkName || "").trim();
        if (!nm) sset("stk", false, "กรอกชื่อชุด");
        else if (!S.picked.length) sset("stk", false, "เลือกสติ๊กเกอร์อย่างน้อย 1 รูป");
        else if (pushTarget(f, "stk").err) sset("stk", false, pushTarget(f, "stk").err);
        else {
            const o = { name: nm, n: S.picked.length, items: S.picked.slice() };
            const tg = pushTarget(f, "stk");
            if (tg.only) {
                o.only = tg.only;
                pushNote = "ส่งชุดสติ๊กเกอร์ \"" + nm + "\" ไปยัง " + tg.only.length + " Channel ที่เลือก";
            }
            if (S.ed.stk != null) Object.assign(o, { id: S.stk[S.ed.stk].id, src: S.stk[S.ed.stk].src, lock: S.stk[S.ed.stk].lock, ...(S.stk[S.ed.stk].from ? { from: S.stk[S.ed.stk].from } : {}) });
            else if (f.forkFrom) o.from = f.forkFrom;
            f.forkFrom = null;
            if (S.ed.stk != null) S.stk[S.ed.stk] = o;
            else S.stk.push(o);
            const edited = S.ed.stk != null;
            S.ed.stk = null;
            f.stkName = "";
            S.picked = [];
            S.pack = null;
            S.msg.stk = null;
            S.sheet = null;
            ok(edited ? "บันทึกการแก้ไขชุด \"" + nm + "\" แล้ว" : "สร้างชุด \"" + nm + "\" แล้ว");
        }
    } else if (a === "stk-edit") {
        S.ed.stk = i;
        f.forkFrom = null;
        f.stkName = S.stk[i].name;
        S.picked = S.stk[i].items ? S.stk[i].items.slice() : [];
        if (!S.stk[i].items) for (let j = 0; j < S.stk[i].n; j++) S.picked.push("id-" + (j + 1));
        pushFormLoad(f, S.stk[i]);
        S.pack = null;
        S.msg.stk = null;
        S.sheet = "stk";
    } else if (a === "stk-new") {
        S.ed.stk = null;
        f.forkFrom = null;
        f.stkName = "";
        f.stkId = "";
        S.picked = [];
        pushFormLoad(f, null);
        S.pack = null;
        S.msg.stk = null;
        S.sheet = "stk";
    } else if (a === "stk-cancel") {
        S.ed.stk = null;
        f.forkFrom = null;
        f.stkName = "";
        S.picked = [];
        S.msg.stk = null;
        S.sheet = null;
    } else if (a === "stk-del") {
        S.stk.splice(i, 1);
        S.ed.stk = null;
    } else if (a === "add-qr" || a === "add-bc" || a === "add-cc") {
        const arr = listOf(a);
        if (arr.length < (a === "add-cc" ? 5 : a === "add-qr" ? 20 : 10)) arr.push({ t: el.t, v: "" });
    } else if (a === "mv-qr" || a === "mv-bc" || a === "mv-cc") {
        // ย้ายรายการ i ไปตำแหน่ง el.to (ลากที่ปุ่มจับ หรือกดลูกศรขึ้น/ลงบนปุ่มจับ)
        const arr = listOf(a);
        const to = el.to;
        if (to >= 0 && to < arr.length && to !== i) {
            const [x] = arr.splice(i, 1);
            arr.splice(to, 0, x);
        }
    } else if (a === "rm-cc") {
        S.cc.splice(i, 1);
    } else if (a === "cc-new" || a === "cc-edit") {
        const e = a === "cc-edit";
        if (!e && S.ccSets.length >= 20) return sset("ccl", false, "มีชุดข้อความครบ 20 ชุดแล้ว — ลบชุดที่ไม่ใช้ก่อน");
        S.ed.cc = e ? i : null;
        f.forkFrom = null;
        f.ccName = e ? S.ccSets[i].name : "";
        S.cc = e ? S.ccSets[i].items.map((x) => ({ ...x })) : [{ t: "text", v: "" }];
        pushFormLoad(f, e ? S.ccSets[i] : null);
        S.msg.cc = null;
        S.sheet = "cc";
    } else if (a === "cc-cancel") {
        S.ed.cc = null;
        f.forkFrom = null;
        S.msg.cc = null;
        S.sheet = null;
    } else if (a === "cc-save") {
        const nm = (f.ccName || "").trim();
        const its = S.cc.filter((x) => (x.t === "image" ? x.src : x.v.trim()));
        if (!nm) sset("cc", false, "ตั้งชื่อชุดข้อความก่อนบันทึก");
        else if (nm.length > 80) sset("cc", false, "ข้อมูลไม่ถูกต้อง — ตรวจชื่อและข้อความอีกครั้ง (ชื่อไม่เกิน 80 ตัวอักษร · ข้อความ 1–5 รายการ)");
        else if (S.ccSets.some((x, j) => x.name === nm && j !== S.ed.cc)) sset("cc", false, "มีชุดข้อความชื่อนี้อยู่แล้ว — ใช้ชื่ออื่น");
        else if (!its.length) sset("cc", false, "ต้องมีข้อความ รูป หรือสติ๊กเกอร์อย่างน้อย 1 รายการ");
        else if (pushTarget(f, "gen").err) sset("cc", false, pushTarget(f, "gen").err);
        else {
            const o = { name: nm, items: its.map((x) => ({ ...x })), by: ME, at: TODAY + " " + nowT() };
            const tg = pushTarget(f, "gen");
            if (tg.only) {
                o.only = tg.only;
                pushNote = "ส่งชุดข้อความ \"" + nm + "\" ไปยัง " + tg.only.length + " Channel ที่เลือก";
            }
            const e = S.ed.cc != null;
            if (e) Object.assign(o, { id: S.ccSets[S.ed.cc].id, src: S.ccSets[S.ed.cc].src, lock: S.ccSets[S.ed.cc].lock, ...(S.ccSets[S.ed.cc].from ? { from: S.ccSets[S.ed.cc].from } : {}) });
            else if (f.forkFrom) o.from = f.forkFrom;
            f.forkFrom = null;
            if (e) S.ccSets[S.ed.cc] = o;
            else S.ccSets.push(o);
            S.ed.cc = null;
            S.sheet = null;
            sset("ccl", true, e ? "บันทึกการแก้ไขชุด “" + nm + "” แล้ว" : "บันทึกชุด “" + nm + "” แล้ว — กด “ใช้ชุดนี้” เพื่อใช้ส่งเมื่อปิดเคส");
        }
    } else if (a === "cc-use") {
        // i = index ของชุด · null = ไม่ส่งข้อความ
        S.ccUse = i;
        S.ccUseBy = { by: ME, at: TODAY + " " + nowT() };
        sset("ccl", true, i == null ? "บันทึกแล้ว: ปิดเคสแล้วระบบจะไม่ส่งอะไรให้ลูกค้า" : "บันทึกแล้ว: ปิดเคสแล้วระบบจะส่งชุด “" + S.ccSets[i].name + "” ให้ลูกค้า");
    } else if (a === "cc-del") {
        const nm = S.ccSets[i].name;
        S.ccSets.splice(i, 1);
        if (S.ccUse === i) S.ccUse = null;
        else if (S.ccUse != null && S.ccUse > i) S.ccUse--;
        sset("ccl", true, "ลบชุด “" + nm + "” แล้ว");
    } else if (a === "bc-to") {
        S.bcTo = el.t;
        S.bcAsk = false;
    } else if (a === "bc-pick") {
        const p = S.bcSel.indexOf(el.id);
        if (p >= 0) S.bcSel.splice(p, 1);
        else S.bcSel.push(el.id);
        S.bcAsk = false;
    } else if (a === "bc-pick-all") {
        // el.ids = รายชื่อที่แสดงอยู่ (หลังค้นหา) · el.on = เลือกทั้งหมด / ล้าง
        el.ids.forEach((id) => {
            const p = S.bcSel.indexOf(id);
            if (el.on && p < 0) S.bcSel.push(id);
            if (!el.on && p >= 0) S.bcSel.splice(p, 1);
        });
        S.bcAsk = false;
    } else if (a === "bc-sched") {
        S.bcSched = el.on;
        S.bcAsk = false;
    } else if (a === "bc-refresh") sset("bc", true, "รีเฟรชประวัติแล้ว");
    else if (a === "liff") toast("ไปหน้า Line Liff (ยังไม่มีลิงก์จริง)");
    else if (a === "rm-qr") S.qrDraft.splice(i, 1);
    else if (a === "rm-bc") {
        S.bc.splice(i, 1);
        if (!S.bc.length) S.bc.push({ t: "text", v: "" });
        S.bcAsk = false;
    } else if (a === "qr-save") {
        const qn = (f.qrName || "").trim();
        const its = S.qrDraft.filter((x) => x.v.trim());
        const tg = pushTarget(f, "qr");
        if (!qn) sset("qr", false, "กรอกชื่อคีย์ลัด");
        else if (!its.length) sset("qr", false, "เพิ่มรายการที่มีเนื้อหาอย่างน้อย 1 รายการ");
        else if (tg.err) sset("qr", false, tg.err);
        else {
            const q = { name: qn, star: S.ed.qr != null ? !!S.qr[S.ed.qr].star : !!f.forkStar, items: its.map((x) => ({ ...x })) };
            const old = S.ed.qr != null ? S.qr[S.ed.qr] : null;
            if (old) Object.assign(q, { id: old.id, src: old.src, lock: old.lock, ...(old.from ? { from: old.from } : {}) });
            else if (f.forkFrom) q.from = f.forkFrom;
            f.forkFrom = null;
            if (tg.only) {
                q.only = tg.only;
                pushNote = "ส่งคีย์ลัด \"" + qn + "\" ไปยัง " + tg.only.length + " Channel ที่เลือก";
            }
            if (S.ed.qr != null) S.qr[S.ed.qr] = q;
            else S.qr.push(q);
            S.ed.qr = null;
            f.qrName = "";
            S.qrDraft = [];
            S.msg.qr = null;
            S.sheet = null;
            ok("บันทึกคีย์ลัด \"" + qn + "\" แล้ว");
        }
    } else if (a === "qr-edit") {
        S.ed.qr = i;
        f.forkFrom = null;
        f.qrName = S.qr[i].name;
        pushFormLoad(f, S.qr[i]);
        S.qrDraft = S.qr[i].items.map((x) => ({ ...x }));
        S.msg.qr = null;
        S.sheet = "qr";
    } else if (a === "qr-new") {
        S.ed.qr = null;
        f.forkFrom = null;
        f.forkStar = false;
        f.qrName = "";
        pushFormLoad(f, null);
        S.qrDraft = [];
        S.msg.qr = null;
        S.sheet = "qr";
    } else if (a === "qr-cancel") {
        S.ed.qr = null;
        f.forkFrom = null;
        f.qrName = "";
        S.qrDraft = [];
        S.msg.qr = null;
        S.sheet = null;
    } else if (a === "tg-connect") {
        // i = id ของ Channel · token รูปแบบ <ตัวเลข>:<ตัวอักษร 30+>
        const tk = (f.tgToken || "").trim();
        if (!tk) return sset("tg", false, "กรุณากรอก Bot Token");
        if (!/^\d{6,12}:[\w-]{30,}$/.test(tk)) return sset("tg", false, "Telegram ไม่รับโทเคนของบอท — ตรวจว่าคัดลอก Token มาครบ แล้วลองอีกครั้ง");
        S.tgBusy = true;
        S.msg.tg = null;
        setTimeout(() => {
            S.tgBusy = false;
            S.tg[i] = { user: "OneChat" + String(i).replace(/\W/g, "") + "Bot", at: TODAY + " " + nowT(), by: ME };
            f.tgToken = "";
            sset("tg", true, "เชื่อมต่อ @" + S.tg[i].user + " สำเร็จ");
        }, 1200);
    } else if (a === "tg-ask") S.tgAsk = true;
    else if (a === "tg-keep") S.tgAsk = false;
    else if (a === "tg-disconnect") {
        S.tgAsk = false;
        S.tg[i] = null;
        sset("tg", true, "ยกเลิกการเชื่อมต่อแล้ว");
    } else if (a === "qr-star") {
        S.qr[i].star = !S.qr[i].star;
        ok(S.qr[i].star ? "ติดดาว “" + S.qr[i].name + "” แล้ว — เป็นปุ่มในแถวคีย์ลัดใต้ห้องแชท" : "เอาดาวออกจาก “" + S.qr[i].name + "” แล้ว");
    } else if (a === "qr-del") {
        S.qr.splice(i, 1);
        S.ed.qr = null;
    } else if (a === "bc-send") {
        if (!S.bc.some((x) => x.v.trim())) sset("bc", false, "เพิ่มเนื้อหาอย่างน้อย 1 part ก่อนส่ง");
        else if (S.bcTo === "pick" && !S.bcSel.length) sset("bc", false, "เลือกผู้รับอย่างน้อย 1 คน");
        else if (S.bcSched && !f.bcWhen) sset("bc", false, "เลือกวันและเวลาที่จะส่งก่อน");
        else {
            S.bcAsk = true;
            S.msg.bc = null;
        }
    } else if (a === "bc-no") S.bcAsk = false;
    else if (a === "bc-yes") {
        S.bcAsk = false;
        const parts = S.bc.filter((x) => x.v.trim());
        const first = parts.find((x) => x.t === "text");
        const n = S.bcTo === "all" ? null : S.bcSel.length;
        const when = S.bcSched && f.bcWhen
            ? new Date(f.bcWhen).toLocaleString("th-TH", { day: "numeric", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })
            : new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) + " " + nowT();
        S.bcHist.unshift({
            title: first ? first.v : "",
            parts: parts.filter((x) => x.t !== "text").map((x) => ({ ...x })),
            when, who: ME, to: (n == null ? "ทุกคน" : n + " คน") + (chanByName(S.ch) ? " · " + PLATFORM[chanByName(S.ch).platform] + " " + S.ch : ""), sent: S.bcSched ? "" : n == null ? "ส่งแล้ว" : "ส่ง " + n + " จาก " + n, queued: S.bcSched,
        });
        // ส่งแล้วล้างฟอร์มให้เริ่มข้อความใหม่ (เจ้าของงานสั่ง 15 ต.ค. 2026) — ประวัติเก็บสำเนาของ part ไว้แล้ว
        S.bc = [{ t: "text", v: "" }];
        S.bcSched = false;
        f.bcWhen = "";
        if (n != null) S.bcSel = [];
        sset("bc", true, S.bcSched ? "ตั้งเวลาส่งแล้ว (อยู่ในคิวด้านล่าง)" : "ส่ง Broadcast แล้ว");
    } else if (a === "am-save") {
        const an = (f.amName || "").trim(), ak = (f.amKw || "").trim(), ar = (f.amReply || "").trim();
        const tg = pushTarget(f, "am");
        if (!an || !ak || !ar) sset("am", false, "กรอกชื่อรายการ คำค้น และข้อความตอบกลับให้ครบ");
        else if (tg.err) sset("am", false, tg.err);
        else {
            const rule = { name: an, kw: ak, mode: f.amMode || "มีคำนี้", reply: ar, on: f.amOn !== false };
            const old = S.ed.am != null ? S.am[S.ed.am] : null;
            if (old) Object.assign(rule, { id: old.id, src: old.src, lock: old.lock, ...(old.from ? { from: old.from } : {}) });
            else if (f.forkFrom) rule.from = f.forkFrom;
            f.forkFrom = null;
            if (tg.only) {
                rule.only = tg.only;
                pushNote = "ส่งข้อความอัตโนมัติ \"" + an + "\" ไปยัง " + tg.only.length + " Channel ที่เลือก";
            }
            if (S.ed.am != null) S.am[S.ed.am] = rule;
            else S.am.push(rule);
            S.ed.am = null;
            f.amName = f.amKw = f.amReply = "";
            f.amMode = null;
            f.amOn = true;
            S.msg.am = null;
            S.sheet = null;
            ok("บันทึกการตอบกลับ \"" + an + "\" แล้ว");
        }
    } else if (a === "am-edit") {
        const x = S.am[i];
        S.ed.am = i;
        f.forkFrom = null;
        f.amName = x.name;
        f.amKw = x.kw;
        f.amMode = x.mode;
        f.amReply = x.reply;
        f.amOn = x.on;
        pushFormLoad(f, x);
        S.msg.am = null;
        S.sheet = "am";
    } else if (a === "am-new") {
        S.ed.am = null;
        f.forkFrom = null;
        pushFormLoad(f, null);
        f.amName = f.amKw = f.amReply = "";
        f.amMode = null;
        f.amOn = true;
        S.msg.am = null;
        S.sheet = "am";
    } else if (a === "am-cancel") {
        S.ed.am = null;
        f.forkFrom = null;
        f.amName = f.amKw = f.amReply = "";
        f.amMode = null;
        f.amOn = true;
        S.msg.am = null;
        S.sheet = null;
    } else if (a === "am-tog") S.am[i].on = !S.am[i].on;
    else if (a === "am-del") {
        S.am.splice(i, 1);
        S.ed.am = null;
    } else if (a === "sk-show") S.skShow = !S.skShow;
    else if (a === "sk-copy") {
        navigator.clipboard?.writeText(S.skKey).catch(() => {});
        sset("sk", true, "คัดลอกคีย์แล้ว");
    } else if (a === "sk-new") {
        const AZ = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789";
        S.skKey = "sk_live_" + Array.from(crypto.getRandomValues(new Uint8Array(16)), (v) => AZ[v % AZ.length]).join("");
        sset("sk", true, "สร้างคีย์ใหม่แล้ว คีย์เดิมใช้งานไม่ได้อีก");
    }
    else if (a === "mgr-toggle") S.mgrOpen = !S.mgrOpen;
    else if (a === "mgr-save") sset("mgr", true, "บันทึก session แล้ว");
    else if (a === "mgr-test") sset("mgr", true, "ทดสอบสร้างการ์ดสำเร็จ");
    else if (a === "pw-save") {
        if (!f.pwCur) sset("pw", false, "กรอกรหัสผ่านปัจจุบัน");
        else if ((f.pwN1 || "").length < 8) sset("pw", false, "รหัสผ่านใหม่ต้องยาว 8 ตัวขึ้นไป");
        else if (f.pwN1 === f.pwCur) sset("pw", false, "รหัสผ่านใหม่ต้องไม่ซ้ำรหัสเดิม");
        else if (f.pwN1 !== f.pwN2) sset("pw", false, "ยืนยันรหัสผ่านใหม่ไม่ตรงกัน");
        else {
            f.pwCur = f.pwN1 = f.pwN2 = "";
            sset("pw", true, "บันทึกรหัสผ่านใหม่แล้ว");
        }
    } else if (a === "gd-copy") toast("คัดลอกลิงก์แล้ว");
}

export { ME, BANKS, SET_TABS };

/* จำลองข้อความลูกค้าเข้า (ต้นแบบเท่านั้น — ระบบจริงรับจาก LINE webhook) ให้ได้ยินเสียงแจ้งเตือน
   สุ่มแชทที่แสดงอยู่และยังไม่ปิด · ทุก ~45 วินาทีหลังล็อกอิน · ไม่มี toast · ปุ่ม "จำลองข้อความเข้า" ในตั้งค่าทั่วไปเรียกทันที */
const SIM_LINES = ["สอบถามหน่อยค่ะ", "แอดมินอยู่ไหมคะ", "รอนานแล้วนะครับ", "โอนแล้วค่ะ รบกวนเช็คให้หน่อย", "ขอบคุณครับ", "ยอดยังไม่เข้าเลยค่ะ"];
export function simIncoming() {
    // ไม่จำลองข้อความต่อจากข้อความระบบ (ลูกค้าไม่เห็นข้อความระบบ จึงตอบกลับข้อความนั้นไม่ได้ · เจ้าของงานสั่ง 16 ต.ค. 2026)
    const pool = visible().filter((c) => c.status !== "closed" && (c.msgs[c.msgs.length - 1] || {}).who !== "sys");
    if (!pool.length) {
        toast("ไม่มีแชทให้จำลองข้อความเข้า — ติ๊ก Channel ใน \"เลือกแชทที่แสดง\" หรือให้แอดมินตอบต่อจากข้อความระบบก่อน");
        return;
    }
    const c = pool[Math.floor(Math.random() * pool.length)];
    push(c, "cust", SIM_LINES[Math.floor(Math.random() * SIM_LINES.length)]);
    // ไม่มี toast "ข้อความใหม่จาก …" (เจ้าของงานสั่งเอาออก 15 ต.ค. 2026 — ระบบจริงข้อความเข้าเยอะ เด้งไม่หยุด) · แจ้งด้วยเสียง + ป้ายยังไม่อ่านแทน
}

/* ต้นแบบ (dev เท่านั้น): สคริปต์แคปรูปคู่มือใส่ข้อความลูกค้าในแชท และปิดข้อความเข้าอัตโนมัติ ให้ภาพตรงกับขั้นตอนที่อธิบาย */
let simOff = false;
if (import.meta.env.DEV && typeof window !== "undefined")
    window.__oc = { say: (id, text) => push(db.cases.find((c) => c.id === id), "cust", text), quiet: () => (simOff = true) };

/* นับวินาทีของเคสที่รอแอดมินรับ — ทำงานตั้งแต่โหลดหน้าเหมือนต้นฉบับ */
if (typeof window !== "undefined") {
    let tick = 0;
    setInterval(() => {
        db.cases.forEach((c) => {
            if (c.status === "waiting") c.secs++;
        });
        if (st.loggedIn && ++tick % 45 === 0 && !simOff) simIncoming(); // ข้อความเข้าได้ทุกหน้า เหมือนระบบจริง
    }, 1000);
}
