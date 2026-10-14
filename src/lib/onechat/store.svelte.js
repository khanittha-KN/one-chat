// state + การกระทำทั้งหมดของ OneChat — พอร์ตจาก handler ของต้นฉบับทีละกรณี (ลำดับ เงื่อนไข ข้อความ toast เดิมทุกตัว)
import { toast as sonner } from "svelte-sonner";
import {
    ME, merchants, chatChannels, canChat, BANKS, COACC, bankOf, seedCases, seedAnnounces, nowT, slipData, tabOf,
    SETMAP, SET_TABS,
} from "./data.js";

const blankCredit = (type = "add") => ({ type, amt: "", note: "", pass: "", err: null, msg: null });
const blankReg = () => ({ name: "", phone: "", bank: "", no: "", pass: "", ref: "" });
// เปลี่ยนรหัสผ่านให้ลูกค้า — a = รหัสผ่านใหม่ · b = ยืนยันอีกครั้ง (เจ้าของงาน 14 ต.ค. 2026 · ไม่ต้องรู้รหัสเก่า)
const blankPw = () => ({ open: false, a: "", b: "", err: null, msg: null });
const blankImg = () => ({ t: "image", v: "", src: "" }); // รูปแนบโพสต์ Telegram (ui/ImageField)

export const db = $state({ cases: seedCases(), announces: seedAnnounces(), nextAnn: 5, annVersion: 0 });

export const st = $state({
    loggedIn: false,
    // cur = แชทที่เปิดอยู่ · เริ่มที่ยังไม่เปิดแชทไหน (เจ้าของงาน 14 ต.ค. 2026 · แบบ LINE — เปิดให้เองลูกค้าจะเห็นว่าอ่านแล้วแต่ยังไม่ตอบ)
    tab: "all", sel: chatChannels().map((m) => m.id), collapsed: {}, cur: null, view: "list", page: "console", menu: false,
    regMsg: null, lookup: null, lookErr: null, look: null, hist: "all", histModal: false, accModal: false, coSel: null,
    credit: blankCredit(), reg: blankReg(), pw: blankPw(),
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
    am: [{ name: "ทักทาย", kw: "สวัสดี", mode: "มีคำนี้", reply: "สวัสดีค่ะ ยินดีให้บริการ", on: true }], ba: [], tgBtns: [], tgImg: blankImg(), tgPosts: [], skShow: false, skKey: "sk_live_7Hq2Lm9XvR4tK8pZ", mgrOpen: false,
    flex: [{ n: "การ์ดโปรโมชั่น", v: "" }, { n: "การ์ดแจ้งยอดฝาก", v: "แจ้งยอดฝากสำเร็จ" }],
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
    st.regMsg = null;
    st.lookup = null;
    st.lookErr = null;
    st.pw = blankPw();
    st.credit = blankCredit();
}
export function selectCase(id) {
    st.cur = id;
    st.look = null; // เปิดแชท ⇒ แผงขวากลับมาแสดงลูกค้าของแชทนั้น
    resetPanel();
    scrollMsgs();
    if (window.innerWidth <= 1180) setView("chat");
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
    if (window.innerWidth <= 1180) setView("panel");
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
    scrollMsgs();
    ok("ปิดเคสแล้ว");
}
export function saveName(c, name, username) {
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
    scrollMsgs();
    setTimeout(() => {
        if (c.slip && c.slip.state === "reading") c.slip = slipData(sm);
    }, 4000);
}

/* ---------- right panel ---------- */
export function verifyLine(c) {
    c.lineOk = true;
    push(c, "sys", "Verify สำเร็จ");
    ok("Verify แล้ว");
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
    const no = st.reg.no.trim();
    if (!st.reg.bank) st.regMsg = { ok: false, text: "เลือกธนาคารก่อน" };
    else if (!no) st.regMsg = { ok: false, text: "กรอกเลขที่บัญชีก่อน" };
    else if (dupAcc(no, st.reg.bank)) st.regMsg = { ok: false, text: "เลขบัญชีซ้ำ สมัครสมาชิกไม่ได้" };
    else st.regMsg = { ok: true, text: "เลขบัญชีไม่ซ้ำ สมัครสมาชิกได้ (" + bankOf(st.reg.bank).name + ")" };
}
export function regSubmit(c) {
    const rg = st.reg, rno = rg.no.trim(), miss = [];
    if (!rg.name.trim()) miss.push("ชื่อ");
    if (!rg.phone.trim()) miss.push("เบอร์");
    if (!rg.bank) miss.push("ธนาคาร");
    if (!rno) miss.push("เลขที่บัญชี");
    if (!rg.pass) miss.push("รหัสผ่าน");
    if (miss.length) st.regMsg = { ok: false, text: "กรอกให้ครบ: " + miss.join(", ") };
    else if (rg.pass.length < 6) st.regMsg = { ok: false, text: "รหัสผ่านต้องยาว 6 ตัวขึ้นไป" };
    else if (dupAcc(rno, rg.bank)) st.regMsg = { ok: false, text: "เลขบัญชีซ้ำ สมัครสมาชิกไม่ได้" };
    else {
        const rname = rg.name.trim();
        st.regMsg = { ok: true, text: "สมัครสมาชิกให้ " + rname + " สำเร็จ" };
        st.reg = blankReg();
        if (c) push(c, "sys", "สมัครสมาชิก Player ให้ " + rname + " เรียบร้อย");
        ok("สมัครสมาชิกแล้ว");
    }
}
export function regClear() {
    st.reg = blankReg();
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
        const v = (f.stkId || "").trim();
        if (!/^\d+$/.test(v)) sset("stk", false, "กรอก Sticker ID เป็นตัวเลข");
        else {
            S.picked.push("id-" + v);
            f.stkId = "";
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
    } else if (a === "add-qr" || a === "add-bc") {
        const arr = a === "add-qr" ? S.qrDraft : S.bc;
        if (arr.length < 10) arr.push({ t: el.t, v: "" });
    } else if (a === "mv-qr" || a === "mv-bc") {
        // ย้ายรายการ i ไปตำแหน่ง el.to (ลากที่ปุ่มจับ หรือกดลูกศรขึ้น/ลงบนปุ่มจับ)
        const arr = a === "mv-qr" ? S.qrDraft : S.bc;
        const to = el.to;
        if (to >= 0 && to < arr.length && to !== i) {
            const [x] = arr.splice(i, 1);
            arr.splice(to, 0, x);
        }
    } else if (a === "rm-qr") S.qrDraft.splice(i, 1);
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
        else {
            S.bcAsk = true;
            S.msg.bc = null;
        }
    } else if (a === "bc-no") S.bcAsk = false;
    else if (a === "bc-yes") {
        S.bcAsk = false;
        sset("bc", true, "ส่ง Broadcast แล้ว");
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
    } else if (a === "ba-save") {
        const bn = (f.baNo || "").replace(/[\s-]/g, ""), bm = (f.baName || "").trim();
        if (!f.baBank || !bn || !bm) sset("ba", false, "เลือกธนาคาร กรอกเลขบัญชีและชื่อบัญชีให้ครบ");
        else if (!/^\d{10,12}$/.test(bn)) sset("ba", false, "เลขบัญชีต้องเป็นตัวเลข 10-12 หลัก");
        else {
            const acc = { bank: f.baBank, no: f.baNo.trim(), name: bm };
            if (S.ed.ba != null) S.ba[S.ed.ba] = acc;
            else S.ba.push(acc);
            S.ed.ba = null;
            f.baBank = "";
            f.baNo = "";
            f.baName = "";
            S.msg.ba = null;
            S.sheet = null;
            ok("บันทึกบัญชีแล้ว");
        }
    } else if (a === "ba-edit") {
        const y = S.ba[i];
        S.ed.ba = i;
        f.baBank = y.bank;
        f.baNo = y.no;
        f.baName = y.name;
        S.msg.ba = null;
        S.sheet = "ba";
    } else if (a === "ba-new") {
        S.ed.ba = null;
        f.baBank = "";
        f.baNo = "";
        f.baName = "";
        S.msg.ba = null;
        S.sheet = "ba";
    } else if (a === "ba-cancel") {
        S.ed.ba = null;
        f.baBank = "";
        f.baNo = "";
        f.baName = "";
        S.msg.ba = null;
        S.sheet = null;
    } else if (a === "ba-del") {
        S.ba.splice(i, 1);
        S.ed.ba = null;
    } else if (a === "tg-add") {
        if (S.tgBtns.length < 8) S.tgBtns.push({ l: "", u: "" });
    } else if (a === "tg-rm") S.tgBtns.splice(i, 1);
    else if (a === "tg-post") {
        const tt = (f.tgText || "").trim();
        if (!tt) sset("tg", false, "กรอกข้อความก่อนโพสต์");
        else {
            S.tgPosts.unshift({ text: tt, btns: S.tgBtns.length, time: new Date().toLocaleDateString("th-TH", { day: "numeric", month: "short", year: "numeric" }) + " " + nowT() });
            f.tgText = "";
            S.tgBtns = [];
            S.tgImg = blankImg();
            S.msg.tg = null;
            S.sheet = null;
            ok("โพสต์ไป Telegram แล้ว");
        }
    } else if (a === "tg-new" || a === "tg-cancel") {
        f.tgText = "";
        S.tgBtns = [];
        S.tgImg = blankImg();
        S.msg.tg = null;
        S.sheet = a === "tg-new" ? "tg" : null;
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

/* นับวินาทีของเคสที่รอแอดมินรับ — ทำงานตั้งแต่โหลดหน้าเหมือนต้นฉบับ */
if (typeof window !== "undefined") {
    setInterval(() => {
        db.cases.forEach((c) => {
            if (c.status === "waiting") c.secs++;
        });
    }, 1000);
}
