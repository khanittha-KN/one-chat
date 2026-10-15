// state + การกระทำทั้งหมดของ OneChat — พอร์ตจาก handler ของต้นฉบับทีละกรณี (ลำดับ เงื่อนไข ข้อความ toast เดิมทุกตัว)
import { toast as sonner } from "svelte-sonner";
import { playChime } from "./sound.svelte.js";
import {
    ME, merchants, chatChannels, canChat, BANKS, COACC, CARDS, bankOf, seedCases, seedAnnounces, nowT, slipData, tabOf,
    SETMAP, SET_TABS, TODAY, typeLabel, pingOf, chanByName, PLATFORM,
} from "./data.js";

const blankCredit = (type = "add") => ({ type, amt: "", note: "", pass: "", err: null, msg: null });
const blankReg = () => ({ name: "", phone: "", bank: "", no: "", pass: "", ref: "" });
// เปลี่ยนรหัสผ่านให้ลูกค้า — a = รหัสผ่านใหม่ · b = ยืนยันอีกครั้ง (เจ้าของงาน 14 ต.ค. 2026 · ไม่ต้องรู้รหัสเก่า)
const blankPw = () => ({ open: false, a: "", b: "", err: null, msg: null });

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
});

export const S = $state({
    tab: "stk", ch: "", all: false, fav: [], f: {}, pack: null, picked: [], ed: {}, msg: {}, sheet: null,
    // items = สติ๊กเกอร์ในชุด (ต้นฉบับเก็บแค่จำนวน n ⇒ เพิ่ม items ให้หน้าแชตส่งได้จริง)
    stk: [
        { name: "ทักทายลูกค้า", n: 3, items: ["446-0", "446-1", "446-2"] },
        { name: "ตอบรับ", n: 4, items: ["789-0", "789-1", "789-2", "789-3"] },
    ],
    qr: [{ name: "สวัสดี", items: [{ t: "text", v: "สวัสดีค่ะ ยินดีให้บริการ" }] }], qrDraft: [], bc: [{ t: "text", v: "" }], bcAsk: false,
    am: [{ name: "ทักทาย", kw: "สวัสดี", mode: "มีคำนี้", reply: "สวัสดีค่ะ ยินดีให้บริการ", on: true }], skShow: false, skKey: "sk_live_7Hq2Lm9XvR4tK8pZ", mgrOpen: false,
    flex: [{ n: "การ์ดโปรโมชั่น", v: "" }, { n: "การ์ดแจ้งยอดฝาก", v: "แจ้งยอดฝากสำเร็จ" }],
    // ตั้งค่าทั่วไป › ส่งข้อความหลังปิดเคส (สูงสุด 5 รายการ · ว่าง = ไม่ส่ง)
    cc: [{ t: "text", v: "" }],
    // ccEdit = กำลังแก้ (ยังไม่เคยตั้ง ⇒ เปิดฟอร์มไว้) · ccBak = ค่าก่อนแก้ ใช้ตอนกดยกเลิก
    ccEdit: true, ccBak: null,
    // Broadcast: ผู้รับ (all ทุกคน · pick เลือกผู้รับ — bcSel = id แชทที่เลือก) · ตั้งเวลา · ประวัติ & คิว (ตัวอย่างจากระบบจริง 15 ต.ค. 2026)
    // parts ในประวัติ = สติ๊กเกอร์/รูปที่ส่ง (แสดงเป็นรูปย่อ)
    bcTo: "all", bcSched: false, bcSel: [],
    bcHist: [
        { title: "เทส", parts: [{ t: "sticker", v: "11538-6" }], when: "14 ต.ค. 2569 20:13", who: "mook@superx", to: "1 คน", sent: "ส่ง 1 จาก 1" },
        { title: "เทส", parts: [], when: "14 ต.ค. 2569 20:06", who: "mook@superx", to: "ทุกคน", sent: "ส่ง 3 จาก 3" },
    ],
});

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
export function openSettings(tab, ch, all) {
    if (tab) S.tab = tab;
    S.ch = ch || "";
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
    if (c.status === "closed") return;
    c.status = "closed";
    if (!c.admin) c.admin = ME;
    c.closedBy = ME;
    c.closedAt = nowT();
    // ตั้งค่าทั่วไป › ส่งข้อความหลังปิดเคส — ส่งตามลำดับในชื่อของคนที่กดปิดเคส
    S.cc.filter((it) => (it.t === "image" ? it.src : it.v.trim())).forEach((it) => sendItem(c, it, ME));
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
    if (c.status === "closed" || !S.qr[i]) return;
    accept(c);
    S.qr[i].items.forEach((it) => sendItem(c, it));
}
export function sendCard(c, i) {
    if (c.status === "closed") return;
    accept(c);
    push(c, "admin", "", { action: "card", card: CARDS[i].name, desc: CARDS[i].desc });
}
export function sendImage(c, src, name) {
    if (c.status === "closed") return;
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
    if (c.status === "closed") return;
    accept(c);
    push(c, "admin", "", { action: "sticker", key });
}
export function askAcc(c) {
    if (c.status === "closed") return;
    accept(c);
    push(c, "admin", "รบกวนแจ้งชื่อ-นามสกุล ธนาคาร และเลขที่บัญชีของคุณลูกค้า เพื่อสมัครสมาชิกค่ะ");
}
// ปุ่ม "จำลองสลิป" (mockSlip) เอาออกแล้ว 14 ต.ค. 2026 — สลิปในต้นแบบมาจากข้อมูลตัวอย่างใน data.js เท่านั้น
export function slipCheck(c, i) {
    const sm = c.msgs[i];
    sm.checked = true;
    c.slip = { state: "reading", amt: sm.amt, variant: sm.variant };
    delete st.fold[c.id + "|ตรวจสอบสลิป"]; // กางการ์ดผลตรวจให้เห็น
    scrollMsgs();
    setTimeout(() => {
        if (c.slip && c.slip.state === "reading") c.slip = slipData(sm);
    }, 4000);
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
export function pingLine(c) {
    const p = pingOf(c);
    if (p == null) toast("Ping ไม่ได้: ไลน์หลุดการเชื่อมต่อ");
    else ok("Ping: " + p + " ms");
}
/* ผูกสมาชิกกับแชท — แชทลูกค้าใหม่ (unbound) ตรวจสอบเจอ username ⇒ ใช้ข้อมูลสมาชิกคนนั้น · เลิกผูก ⇒ กลับเป็นแชทที่ยังไม่ผูก */
export function bindMember(c, m) {
    c.user = { ...m.user };
    c.unbound = false;
    push(c, "sys", "ผูกสมาชิก " + m.user.username + " กับแชทนี้แล้ว");
    ok("ผูกสมาชิก " + m.user.username + " แล้ว");
}
export function unbindMember(c) {
    c.unbound = true;
    st.lookup = "";
    st.lookErr = null;
    push(c, "sys", "เลิกผูกสมาชิก " + c.user.username + " กับแชทนี้");
    ok("เลิกผูกสมาชิกแล้ว");
}
// ตรวจสอบด้วย Username ⇒ พบ: แผงขวาแสดงลูกค้าคนนั้น (แบบเดียวกับเลือกจากช่องค้นหา) · ไม่พบ: แจ้งใต้ช่อง
export function lookup(v) {
    const q = (v || "").trim().toLowerCase();
    const hit = q && db.cases.find((c) => c.user.username.toLowerCase() === q);
    if (!hit) {
        st.lookup = v;
        st.lookErr = q ? 'ไม่พบ Username "' + v.trim() + '"' : "กรอก Username ก่อน";
        return;
    }
    const pc = panelCase();
    if (pc && pc.unbound) {
        st.lookup = null;
        st.lookErr = null;
        bindMember(pc, hit);
        return;
    }
    pickSearch(hit.id);
    ok("ตรวจสอบแล้ว");
}
export function coAcc(c, i) {
    if (c.status === "closed") return;
    const ca = COACC[i];
    st.coSel = i;
    accept(c);
    push(c, "admin", "โอนเข้าบัญชี " + bankOf(ca.bank).name + " ชื่อบัญชี " + ca.name + " เลขที่ " + ca.no);
    ok("ส่งเลขบัญชีบริษัทให้ลูกค้าแล้ว");
}
export function saveCredit(c) {
    const cr = st.credit, camt = parseFloat(cr.amt);
    cr.msg = null;
    cr.err = null;
    if (!(camt > 0)) cr.err = "กรอกจำนวนเงินมากกว่า 0";
    else if (cr.type === "sub" && camt > c.credit) cr.err = "เครดิตคงเหลือไม่พอสำหรับถอนเครดิต";
    else if (!cr.pass) cr.err = "กรอกรหัสผ่านแอดมินก่อนบันทึก";
    else {
        const cadd = cr.type === "add";
        c.credit = Math.round((c.credit + (cadd ? camt : -camt)) * 100) / 100;
        (cadd ? c.histDep : c.histWd).unshift({ amt: camt, time: "5 ต.ค. 2569 " + nowT(), ok: true, ref: "CR" + String(Date.now()).slice(-6) });
        push(c, "sys", (cadd ? "เติมเครดิต " : "ถอนเครดิต ") + camt.toFixed(2) + " บาท " + (cadd ? "ให้ " : "ของ ") + c.user.username + (cr.note ? " (" + cr.note + ")" : "") + " เรียบร้อย");
        st.credit = { ...blankCredit(cr.type), msg: (cadd ? "เติมเครดิต " : "ถอนเครดิต ") + camt.toFixed(2) + " บาท แล้ว" };
        ok("บันทึกเครดิตแล้ว");
    }
}
/* เปลี่ยนรหัสผ่านให้ลูกค้า (การ์ดตรวจสอบในแผงขวา) — รหัสใหม่ 2 ครั้ง · รหัสของ Agent / แอดมินเองอยู่ที่ Settings (action "pw-save") */
export function pwOpen() {
    st.pw = { ...blankPw(), open: true };
}
export function pwCancel() {
    st.pw = blankPw();
}
export function pwSave(c) {
    if (!st.pw.a) st.pw.err = "กรอกรหัสผ่านใหม่ก่อน";
    else if (st.pw.a.length < 6) st.pw.err = "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร";
    else if (st.pw.a !== st.pw.b) st.pw.err = "ยืนยันรหัสผ่านใหม่ไม่ตรงกัน — พิมพ์ให้เหมือนกันทั้ง 2 ช่อง";
    else {
        st.pw = { ...blankPw(), msg: "เปลี่ยนรหัสผ่านของ " + c.user.username + " แล้ว" };
        push(c, "sys", "เปลี่ยนรหัสผ่านของ " + c.user.username + " เรียบร้อย");
        ok("เปลี่ยนรหัสผ่านลูกค้าแล้ว");
    }
}
const dupAcc = (no, bank) => db.cases.some((x) => x.user.number === no && x.user.bankCode === bank);
export function regCheck() {
    const e = { ...regValidate("bank"), ...regValidate("no") };
    if (e.bank || e.no) st.regMsg = null;
    else st.regMsg = { ok: true, text: "เลขบัญชีไม่ซ้ำ สมัครสมาชิกได้ (" + bankOf(st.reg.bank).name + ")" };
}
/* ตรวจช่องสมัครสมาชิกทีละช่อง (เจ้าของงานสั่ง 15 ต.ค. 2026) — รหัสแนะนำเว้นว่างได้ · ข้อความบอกวิธีแก้ใต้ช่องนั้น */
export function regValidate(field) {
    const rg = st.reg, e = {};
    const phone = rg.phone.replace(/[\s-]/g, ""), no = rg.no.replace(/[\s-]/g, "");
    if (!rg.name.trim()) e.name = "กรอกชื่อ-นามสกุลของลูกค้า";
    if (!phone) e.phone = "กรอกเบอร์โทรศัพท์";
    else if (!/^0\d{9}$/.test(phone)) e.phone = "เบอร์ต้องเป็นตัวเลข 10 หลัก ขึ้นต้นด้วย 0";
    if (!rg.bank) e.bank = "เลือกธนาคารของลูกค้า";
    if (!no) e.no = "กรอกเลขที่บัญชี";
    else if (!/^\d{10,12}$/.test(no)) e.no = "เลขที่บัญชีต้องเป็นตัวเลข 10–12 หลัก";
    else if (rg.bank && dupAcc(rg.no.trim(), rg.bank)) e.no = "เลขบัญชีนี้มีคนสมัครแล้ว — ตรวจกับลูกค้าอีกครั้ง";
    if (!rg.pass) e.pass = "ตั้งรหัสผ่านให้ลูกค้า";
    else if (rg.pass.length < 6) e.pass = "รหัสผ่านต้องยาวอย่างน้อย 6 ตัวอักษร";
    // ตรวจทีละช่องตอนออกจากช่อง (field) · ตรวจทั้งฟอร์มตอนกดสมัคร
    if (field) st.regErr = { ...st.regErr, [field]: e[field] };
    else st.regErr = e;
    return e;
}
export function regSubmit(c) {
    const rg = st.reg, rno = rg.no.trim();
    const e = regValidate();
    if (Object.keys(e).length) st.regMsg = { ok: false, text: "ยังสมัครไม่ได้ — แก้ช่องที่มีข้อความสีแดง " + Object.keys(e).length + " ช่อง" };
    else {
        const rname = rg.name.trim();
        st.regMsg = { ok: true, text: "สมัครสมาชิกให้ " + rname + " สำเร็จ — กด \"ส่งเบอร์และรหัสให้ลูกค้า\" ได้เลย" };
        if (c) {
            c.lastReg = { phone: rg.phone.trim(), pass: rg.pass };
            c.justReg = true;
            // แชทลูกค้าใหม่ ⇒ ผูกกับสมาชิกที่เพิ่งสมัคร
            if (c.unbound) {
                const b = bankOf(rg.bank);
                c.unbound = false;
                c.user = { ...c.user, fullname: rname, bank: b.name, bankCode: b.code, number: rno, mobile: rg.phone.trim() };
            }
            push(c, "sys", "สมัครสมาชิก Player ให้ " + rname + " เรียบร้อย");
        }
        st.reg = blankReg();
        st.regErr = {};
        ok("สมัครสมาชิกแล้ว");
    }
}
/* ส่งเบอร์และรหัสผ่านที่เพิ่งสมัครให้ลูกค้าในแชท — ใช้ค่าที่กรอกอยู่ หรือของการสมัครครั้งล่าสุดในเคสนี้ */
export function sendReg(c) {
    const sd = st.reg.phone.trim() && st.reg.pass ? { phone: st.reg.phone.trim(), pass: st.reg.pass } : c && c.lastReg;
    if (!c) st.regMsg = { ok: false, text: "เปิดแชทของลูกค้าก่อน จึงจะส่งข้อมูลในแชทได้" };
    else if (c.status === "closed") toast("เคสนี้ปิดแล้ว ส่งข้อความไม่ได้");
    else if (!sd) st.regMsg = { ok: false, text: "กรอกเบอร์และรหัสผ่านก่อน (หรือสมัครสมาชิกก่อน) จึงจะส่งให้ลูกค้าได้" };
    else {
        accept(c);
        push(c, "admin", "ข้อมูลสมาชิกของคุณ: เบอร์โทร " + sd.phone + " · รหัสผ่าน " + sd.pass + " · กรุณาเปลี่ยนรหัสผ่านหลังเข้าสู่ระบบนะคะ");
        st.regMsg = { ok: true, text: "ส่งเบอร์และรหัสให้ลูกค้าในแชทแล้ว" };
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
export function settingsAct(a, i, el = {}) {
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
        else {
            const o = { name: nm, n: S.picked.length, items: S.picked.slice() };
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
        f.stkName = S.stk[i].name;
        S.picked = S.stk[i].items ? S.stk[i].items.slice() : [];
        if (!S.stk[i].items) for (let j = 0; j < S.stk[i].n; j++) S.picked.push("id-" + (j + 1));
        S.pack = null;
        S.msg.stk = null;
        S.sheet = "stk";
    } else if (a === "stk-new") {
        S.ed.stk = null;
        f.stkName = "";
        f.stkId = "";
        S.picked = [];
        S.pack = null;
        S.msg.stk = null;
        S.sheet = "stk";
    } else if (a === "stk-cancel") {
        S.ed.stk = null;
        f.stkName = "";
        S.picked = [];
        S.msg.stk = null;
        S.sheet = null;
    } else if (a === "stk-del") {
        S.stk.splice(i, 1);
        S.ed.stk = null;
    } else if (a === "add-qr" || a === "add-bc" || a === "add-cc") {
        const arr = listOf(a);
        if (arr.length < (a === "add-cc" ? 5 : 10)) arr.push({ t: el.t, v: "" });
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
        if (!S.cc.length) S.cc.push({ t: "text", v: "" });
    } else if (a === "cc-edit") {
        S.ccBak = $state.snapshot(S.cc);
        S.ccEdit = true;
        S.msg.cc = null;
    } else if (a === "cc-cancel") {
        if (S.ccBak) S.cc = S.ccBak;
        S.ccBak = null;
        S.ccEdit = false;
        S.msg.cc = null;
    } else if (a === "cc-save") {
        const okc = S.cc.filter((x) => (x.t === "image" ? x.src : x.v.trim()));
        S.cc = okc.length ? okc : [{ t: "text", v: "" }];
        S.ccEdit = false;
        S.ccBak = null;
        sset("cc", true, okc.length ? "บันทึกแล้ว: ปิดเคสแล้วระบบจะส่ง " + okc.length + " ข้อความให้ลูกค้า" : "บันทึกแล้ว: ไม่ส่งข้อความหลังปิดเคส");
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
        if (!qn) sset("qr", false, "กรอกชื่อคีย์ลัด");
        else if (!its.length) sset("qr", false, "เพิ่มรายการที่มีเนื้อหาอย่างน้อย 1 รายการ");
        else {
            const q = { name: qn, items: its.map((x) => ({ ...x })) };
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
        f.qrName = S.qr[i].name;
        S.qrDraft = S.qr[i].items.map((x) => ({ ...x }));
        S.msg.qr = null;
        S.sheet = "qr";
    } else if (a === "qr-new") {
        S.ed.qr = null;
        f.qrName = "";
        S.qrDraft = [];
        S.msg.qr = null;
        S.sheet = "qr";
    } else if (a === "qr-cancel") {
        S.ed.qr = null;
        f.qrName = "";
        S.qrDraft = [];
        S.msg.qr = null;
        S.sheet = null;
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
        if (!an || !ak || !ar) sset("am", false, "กรอกชื่อกฎ คำค้น และข้อความตอบกลับให้ครบ");
        else {
            const rule = { name: an, kw: ak, mode: f.amMode || "มีคำนี้", reply: ar, on: f.amOn !== false };
            if (S.ed.am != null) S.am[S.ed.am] = rule;
            else S.am.push(rule);
            S.ed.am = null;
            f.amName = f.amKw = f.amReply = "";
            f.amMode = null;
            f.amOn = true;
            S.msg.am = null;
            S.sheet = null;
            ok("บันทึกกฎ \"" + an + "\" แล้ว");
        }
    } else if (a === "am-edit") {
        const x = S.am[i];
        S.ed.am = i;
        f.amName = x.name;
        f.amKw = x.kw;
        f.amMode = x.mode;
        f.amReply = x.reply;
        f.amOn = x.on;
        S.msg.am = null;
        S.sheet = "am";
    } else if (a === "am-new") {
        S.ed.am = null;
        f.amName = f.amKw = f.amReply = "";
        f.amMode = null;
        f.amOn = true;
        S.msg.am = null;
        S.sheet = "am";
    } else if (a === "am-cancel") {
        S.ed.am = null;
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
    const pool = visible().filter((c) => c.status !== "closed");
    if (!pool.length) {
        toast("ไม่มีแชทที่เปิดอยู่ให้จำลอง — ติ๊ก Channel ใน \"เลือกแชทที่แสดง\" ก่อน");
        return;
    }
    const c = pool[Math.floor(Math.random() * pool.length)];
    push(c, "cust", SIM_LINES[Math.floor(Math.random() * SIM_LINES.length)]);
    // ไม่มี toast "ข้อความใหม่จาก …" (เจ้าของงานสั่งเอาออก 15 ต.ค. 2026 — ระบบจริงข้อความเข้าเยอะ เด้งไม่หยุด) · แจ้งด้วยเสียง + ป้ายยังไม่อ่านแทน
}

/* นับวินาทีของเคสที่รอแอดมินรับ — ทำงานตั้งแต่โหลดหน้าเหมือนต้นฉบับ */
if (typeof window !== "undefined") {
    let tick = 0;
    setInterval(() => {
        db.cases.forEach((c) => {
            if (c.status === "waiting") c.secs++;
        });
        if (st.loggedIn && ++tick % 45 === 0) simIncoming(); // ข้อความเข้าได้ทุกหน้า เหมือนระบบจริง
    }, 1000);
}
