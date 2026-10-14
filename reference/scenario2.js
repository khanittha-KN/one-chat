// รอบ 2: เมนู · Announce · Settings ทุกแท็บ + การกระทำ · dialog ประวัติ/บัญชี — ใช้ข้อความปุ่มหาเหมือนกันทั้งสองฝั่ง
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const T = (s) => { const e = typeof s === "string" ? document.querySelector(s) : s; return e ? e.innerText.replace(/\s+/g, " ").replace(/\(\d+\)/g, "(n)").replace(/\d\d:\d\d/g, "hh:mm").trim() : null; };
const h = (s) => { s = String(s).replace(/CR\d+/g, "CR"); let x = 5381; for (let i = 0; i < s.length; i++) x = ((x * 33) ^ s.charCodeAt(i)) >>> 0; return x.toString(36); };
const B = (txt, scope = document) => [...scope.querySelectorAll("button")].find((b) => b.offsetParent !== null && b.innerText.replace(/\s+/g, " ").trim() === txt);
const BS = (txt, scope = document) => [...scope.querySelectorAll("button")].find((b) => b.offsetParent !== null && b.innerText.replace(/\s+/g, " ").trim().startsWith(txt));
const set = (el, v) => { el.value = v; el.dispatchEvent(new Event("input", { bubbles: true })); };
const ORIG = !!document.querySelector("#loginForm");
const out = {};
document.querySelector("#login form button[type=submit], #loginForm button").click(); await sleep(500);
// เมนู
if (ORIG) { document.querySelector("#burger").click(); await sleep(150); out.menu = T("#menu"); }
else { document.querySelector("#burger").dispatchEvent(new PointerEvent("pointerdown", { bubbles: true, button: 0, pointerType: "mouse" })); await sleep(300); out.menu = T("[data-slot=dropdown-menu-content]"); }
const menuItem = (txt) => ORIG ? B(txt, document.querySelector("#menu")) : [...document.querySelectorAll("[role=menuitem]")].find((b) => b.innerText.trim() === txt);
menuItem("จัดการข้อความอัตโนมัติ").click(); await sleep(400);
out.ann = T("#announceWrap");
const add = document.querySelector("#announceWrap tr.add");
set(add.querySelector("input:not([type=number])"), "ใหม่"); set(add.querySelector("textarea"), "ข้อความใหม่");
B("Add").click(); await sleep(300); out.ann2 = T("#announceWrap");
B("← กลับหน้าแชท").click(); await sleep(250); out.quick = T(".quick");
document.querySelectorAll(".gear")[2].click(); await sleep(300);
const stabs = () => [...document.querySelectorAll(".stab")];
for (let i = 0; i < 7; i++) { stabs()[i].click(); await sleep(200); out["set" + i] = T("#settingsWrap"); }
stabs()[0].click(); await sleep(200);
BS("ชุด 789").click(); await sleep(200);
document.querySelectorAll(".tiles .tilew")[3].querySelector(".tile").click(); await sleep(150);
document.querySelectorAll(".tiles .tilew")[5].querySelector(".fav").click(); await sleep(200); out.stk2 = T("#settingsWrap");
B("บันทึกชุดสติ๊กเกอร์").click(); await sleep(200); out.stk3 = T("#settingsWrap");
stabs()[1].click(); await sleep(200);
B("＋ ข้อความ").click(); await sleep(150); B("＋ สติ๊กเกอร์").click(); await sleep(200); out.qr2 = T("#settingsWrap");
B("บันทึกคีย์ลัด").click(); await sleep(200); out.qr3 = T("#settingsWrap");
stabs()[2].click(); await sleep(200); B("🚀 ส่ง Broadcast").click(); await sleep(200); out.bc2 = T("#settingsWrap");
stabs()[3].click(); await sleep(200); B("บันทึกกฎ").click(); await sleep(200); out.am2 = T("#settingsWrap");
B("เปิด").click(); await sleep(200); out.am3 = T("#settingsWrap");
B("แก้ไข").click(); await sleep(200); out.am4 = T("#settingsWrap");
stabs()[4].click(); await sleep(200); B("บันทึกบัญชี").click(); await sleep(200); out.ba2 = T("#settingsWrap");
stabs()[5].click(); await sleep(200); B("+ เพิ่มปุ่มเมนู").click(); await sleep(200); B("📤 โพสต์ไป Telegram").click(); await sleep(200); out.tg2 = T("#settingsWrap");
B("← กลับไปแชท").click(); await sleep(300);
const dlg = () => ORIG ? document.querySelector("#modal") : document.querySelector("[role=dialog]");
BS("ดูทั้งหมด").click(); await sleep(400); out.hist = T(dlg());
[...dlg().querySelectorAll("[role=tab]")][2].click(); await sleep(250); out.hist2 = T(dlg());
B("ปิด", dlg()).click(); await sleep(400);
BS("ดูบัญชีธนาคารลูกค้า").click(); await sleep(400); out.acc = T(dlg());
B("ปิด", dlg()).click(); await sleep(400); out.closed = !dlg() || dlg().hidden;
window.__scen2 = out;
const r = {}; for (const k in out) r[k] = h(out[k]); JSON.stringify(r);
