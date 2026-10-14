<!-- ห้องแชท — การ์ด (DESIGN-SYSTEM §10.6): หัวการ์ด = ชื่อลูกค้า + ป้ายสถานะ + LINE OA · ปุ่มปิดเคสที่ Card.Action
     · ช่องแก้ชื่อ/ไอดี · Note (input-group) · ข้อความ (role="log") · ช่องพิมพ์ท้ายการ์ด
     ปุ่มมีไอคอนนำหน้า (§10.1) ยกเว้นปุ่มคีย์ลัด · ปิดเคสเป็นสีแดงทึบ (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
<script>
    import { tick } from "svelte";
    import X from "@lucide/svelte/icons/x";
    import Save from "@lucide/svelte/icons/save";
    import Send from "@lucide/svelte/icons/send";
    import ScanSearch from "@lucide/svelte/icons/scan-search";
    import StickyNote from "@lucide/svelte/icons/sticky-note";
    import Info from "@lucide/svelte/icons/info";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "./ui/Status.svelte";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import StickerPicker from "./StickerPicker.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import { merch, slipOf, bankOf, money } from "./data.js";
    import Globe from "@lucide/svelte/icons/globe";
    import { kindOf } from "./kinds.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import { db, st, cur, ME, toast, closeCase, saveName, sendText, quickSend, askAcc, slipCheck } from "./store.svelte.js";

    let { class: className = "" } = $props();
    const c = $derived(cur());
    const m = $derived(merch(c.merchant));
    const k = $derived(kindOf(c));
    const done = $derived(c.status === "closed");
    const quick = $derived(db.announces.filter((a) => a.status === "ใช้งาน" && a.text));

    let msgsEl = $state(null);
    let eName = $state(null);
    let eUser = $state(null);
    let draft = $state(""); // ค่าที่พิมพ์ค้างอยู่คงไว้ข้ามการสลับเคส เหมือนต้นฉบับ
    let note = $state("");

    // scrollMsgs() ของต้นฉบับ — เลื่อนลงล่างสุดหลังมีข้อความใหม่ / เลือกเคส / ปิดเคส
    $effect(() => {
        st.scrollTick;
        tick().then(() => {
            if (msgsEl) msgsEl.scrollTop = msgsEl.scrollHeight;
        });
    });

    function send() {
        if (done) return;
        if (sendText(c, draft)) draft = "";
    }
    const who = (x) => ({ cust: c.name, sys: "system", admin: x.by || ME })[x.who];
</script>

<Card.Root id="colChat" role="region" aria-label="แชทลูกค้า" class={"m-2 min-h-0 gap-0 py-0 shadow-sm md:m-3 " + className}>
    <!-- ห้องแชททั้งก้อนเป็นการ์ดลอยบนพื้นหน้า (เจ้าของงานสั่ง 12 ต.ค. 2026) · รายการแชทกับแผงลูกค้ายังเป็นช่องแบนมีเส้นคั่น -->
    <!-- หัวห้องแชทแน่นขึ้น (เจ้าของงานเลือก 14 ต.ค. 2026 · แบบ 1): py 8 · ช่องห่าง 6 · รูป 32px · ช่องกรอก/Save สูง 28px ⇒ 149 → 123px -->
    <Card.Header class="gap-1.5 border-b py-2 [.border-b]:pb-2">
        <div class="flex min-w-0 items-center gap-2.5">
            <CustomerAvatar {c} class="size-8" />
            <!-- แถวเดียว: ชื่อลูกค้า · ป้ายประเภท · LINE Channel (เจ้าของงานสั่ง 12 ต.ค. 2026 — ไม่แสดงบรรทัด Org / Agent) -->
            <div class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-0.5">
                <Card.Title class="truncate text-base">{c.name}</Card.Title>
                <Badge variant="outline" class={"status " + k.badge}>{done ? "ปิดเคสแล้ว" : k.label}</Badge>
                <Card.Description class="oa flex min-w-0 items-center gap-1.5 text-xs" title={"LINE " + m.name + " (@" + m.id + ")"}>
                    <Globe class="size-3.5 shrink-0" aria-hidden="true" />
                    <span class="min-w-0 truncate">LINE <b class="text-foreground font-bold">{m.name}</b> (@{m.id})</span>
                </Card.Description>
            </div>
        </div>
        {#if !done}
            <Card.Action>
                <Button data-tone="destructive" data-fill="solid" size="sm" onclick={() => closeCase(c)}><X data-icon="inline-start" />ปิดเคส (F4)</Button>
            </Card.Action>
        {/if}
        <div class="col-span-full flex flex-wrap gap-2">
            <Input bind:ref={eName} value={c.name} aria-label="ชื่อลูกค้า" class="h-7 min-w-24 flex-1" />
            <Input bind:ref={eUser} value={c.user.username} aria-label="ไอดีลูกค้า" class="h-7 min-w-24 flex-1" />
            <Button size="sm" class="h-7" onclick={() => saveName(c, eName.value, eUser.value)}
                ><Save data-icon="inline-start" />Save</Button
            >
        </div>
        <InputGroup.Root class="col-span-full h-7">
            <InputGroup.Addon><StickyNote />Note</InputGroup.Addon>
            <InputGroup.Input
                id="noteIn"
                placeholder="พิมพ์ข้อความที่ต้องการ แล้วกด Enter เพื่อบันทึก"
                aria-label="Note"
                bind:value={note}
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (note.trim()) {
                        toast("บันทึก Note แล้ว");
                        note = "";
                    }
                }}
            />
        </InputGroup.Root>
    </Card.Header>

    {#key c.id}
        <!-- role="log" ⇒ ข้อความใหม่ถูกอ่านออกเสียง · {#key} สร้างใหม่ตอนสลับเคส จึงไม่อ่านประวัติเดิมซ้ำ -->
        <div
            class="msgs bg-chat-bg flex min-h-40 flex-1 flex-col gap-2.5 overflow-y-auto bg-(image:--chat-wallpaper) bg-cover bg-center p-3"
            bind:this={msgsEl}
            role="log"
            aria-live="polite"
            aria-label={"ข้อความแชทกับ " + c.name}
        >
            {#each c.msgs as x, i (i)}
                {@const mine = x.who !== "cust"}
                <div class={"m flex max-w-5/6 flex-col gap-1 " + x.who + (mine ? " items-end self-end" : " items-start self-start")}>
                    <span class="who text-chat-meta text-xs">{who(x)} · {x.t}</span>
                    {#if x.action === "slip"}
                        <!-- รูปสลิปจริงที่ลูกค้าส่ง (เจ้าของงานสั่ง 14 ต.ค. 2026 · แทนกล่องสลิปจำลอง) · กดเพื่อเปิดรูปเต็มในแท็บใหม่ -->
                        {@const sl = slipOf(x)}
                        <a
                            href={sl.src}
                            target="_blank"
                            rel="noopener"
                            class="ring-foreground/10 block w-48 overflow-hidden rounded-lg shadow-xs ring-1"
                            aria-label={"สลิปโอนเงิน " + bankOf(sl.fromBank).name + " " + money(x.amt) + " บาท — เปิดรูปเต็มในแท็บใหม่"}
                        >
                            <img src={sl.src} width={sl.w} height={sl.h} alt="" class="block h-auto w-full" />
                        </a>
                        {#if x.checked}
                            <!-- ป้ายสีโปร่ง ⇒ รองพื้นการ์ดให้อ่านออกบนท้องฟ้า -->
                            <span class="bg-card rounded-4xl"><Status tone="success">ตรวจสอบสลิปแล้ว</Status></span>
                        {:else}
                            <!-- ปุ่มทึบสีแบรนด์ (เจ้าของงานสั่ง 14 ต.ค. 2026 · เดิมพื้นอ่อน data-tone="primary") — DS §10.1: primary แบบทึบ = variant default -->
                            <Button size="sm" disabled={done} onclick={() => slipCheck(c, i)}
                                ><ScanSearch data-icon="inline-start" />ตรวจสอบสลิป</Button
                            >
                        {/if}
                    {:else if x.action === "sticker"}
                        <!-- สติ๊กเกอร์ที่ส่ง (ต้นแบบไม่มีรูปจริง ⇒ ไอคอน + ชื่อสติ๊กเกอร์) -->
                        <!-- สติ๊กเกอร์แสดงเป็นรูปลอยไม่มีฟอง เหมือนใน LINE -->
                        <StickerImg k={x.key} class="bub size-28" />
                    {:else if x.who === "sys"}
                        <!-- ข้อความระบบ: โหมดสว่างพื้นการ์ดทึบ (บนท้องฟ้า) · โหมดมืดฟ้าโปร่งแบบเดิม -->
                        <div class="bub bg-card dark:bg-info/20 ring-info/25 flex items-start gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ring-1 wrap-anywhere">
                            <Info class="text-info mt-0.5 size-4 shrink-0" aria-hidden="true" />{x.text}
                        </div>
                    {:else if x.who === "admin"}
                        <div class="bub bg-brand text-brand-foreground rounded-lg px-3 py-2 text-sm whitespace-pre-wrap wrap-anywhere">{x.text}</div>
                    {:else}
                        <div class="bub bg-card ring-foreground/10 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap shadow-xs ring-1 wrap-anywhere">{x.text}</div>
                    {/if}
                </div>
            {/each}
            {#if done}
                <!-- แถบปิดเคสสีแดงแบบต้นฉบับ — โทเคนเคสสีแดง (ตัวอักษรผ่าน 4.5:1 ทั้งสองโหมด) -->
                <div role="status" class="closed-bar border-case-red/40 bg-case-red-bg text-case-red-fg rounded-lg border px-3 py-2 text-center text-sm font-bold">
                    ปิดเคส โดย {c.closedBy} - {c.closedAt}
                </div>
            {/if}
        </div>
    {/key}

    <Card.Footer class="flex-col items-stretch gap-2 border-t py-2.5">
        <div class="quick flex flex-wrap items-center gap-1.5">
            <span class="text-muted-foreground text-xs">คีย์ลัด</span>
            <Button variant="secondary" size="xs" disabled={done} onclick={() => askAcc(c)}>ขอเลขบัญชีลูกค้า</Button>
            {#each quick as a (a.id)}
                <Button variant="secondary" size="xs" disabled={done} onclick={() => quickSend(c, a.id)}
                    >{a.name}</Button
                >
            {:else}
                <span class="text-muted-foreground text-xs">ยังไม่มีข้อความ เพิ่มได้ที่เมนู จัดการข้อความอัตโนมัติ</span>
            {/each}
        </div>
        <!-- ช่องพิมพ์: สติ๊กเกอร์ · ข้อความ · ส่ง (ปุ่ม "จำลองสลิป" เอาออกแล้ว — เจ้าของงานสั่ง 14 ต.ค. 2026) -->
        <div class="flex gap-2">
            <StickerPicker {c} disabled={done} />
            <Input
                id="msgIn"
                class="min-w-0 flex-1"
                placeholder="พิมพ์ข้อความถึงลูกค้า"
                aria-label="ข้อความ"
                disabled={done}
                bind:value={draft}
                onkeydown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        send();
                    }
                }}
            />
            <Button disabled={done} onclick={send}><Send data-icon="inline-start" />ส่ง</Button>
        </div>
    </Card.Footer>
</Card.Root>
