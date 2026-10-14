<!-- ห้องแชท — การ์ด (DESIGN-SYSTEM §10.6): หัวการ์ด = ชื่อลูกค้า + ป้ายสถานะ + LINE OA · ปุ่มปิดเคสที่ Card.Action
     · ช่องแก้ชื่อ/ไอดี · Note (input-group) · ข้อความ (role="log") · ช่องพิมพ์ท้ายการ์ด
     ปุ่มมีไอคอนนำหน้า (§10.1) ยกเว้นปุ่มคีย์ลัด · ปิดเคสเป็นสีแดงทึบ (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
<script>
    import { tick } from "svelte";
    import X from "@lucide/svelte/icons/x";
    import Save from "@lucide/svelte/icons/save";
    import Send from "@lucide/svelte/icons/send";
    import Receipt from "@lucide/svelte/icons/receipt";
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
    import { merch } from "./data.js";
    import Globe from "@lucide/svelte/icons/globe";
    import { kindOf } from "./kinds.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import { db, st, cur, ME, toast, closeCase, saveName, sendText, quickSend, askAcc, mockSlip, slipCheck } from "./store.svelte.js";

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
    <Card.Header class="gap-2 border-b py-3">
        <div class="flex min-w-0 items-center gap-2.5">
            <CustomerAvatar {c} />
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
                <Button data-tone="destructive" data-fill="solid" size="sm" onclick={() => closeCase(c)}><X data-icon="inline-start" />ปิด [F4]</Button>
            </Card.Action>
        {/if}
        <div class="col-span-full flex flex-wrap gap-2">
            <Input bind:ref={eName} value={c.name} aria-label="ชื่อลูกค้า" class="h-8 min-w-24 flex-1" />
            <Input bind:ref={eUser} value={c.user.username} aria-label="ไอดีลูกค้า" class="h-8 min-w-24 flex-1" />
            <Button size="sm" data-tone="success" data-fill="solid" onclick={() => saveName(c, eName.value, eUser.value)}
                ><Save data-icon="inline-start" />Save</Button
            >
        </div>
        <InputGroup.Root class="col-span-full h-8">
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
            class="msgs bg-muted dark:bg-background flex min-h-40 flex-1 flex-col gap-2.5 overflow-y-auto p-3"
            bind:this={msgsEl}
            role="log"
            aria-live="polite"
            aria-label={"ข้อความแชทกับ " + c.name}
        >
            {#each c.msgs as x, i (i)}
                {@const mine = x.who !== "cust"}
                <div class={"m flex max-w-5/6 flex-col gap-1 " + x.who + (mine ? " items-end self-end" : " items-start self-start")}>
                    <span class="who text-muted-foreground text-xs">{who(x)} · {x.t}</span>
                    {#if x.action === "slip"}
                        <!-- ภาพสลิปจำลอง -->
                        <div class="bg-card ring-foreground/10 flex w-40 flex-col gap-1.5 rounded-lg p-3 shadow-xs ring-1" role="img" aria-label={"สลิปโอนเงิน " + Number(x.amt).toFixed(2) + " บาท"}>
                            <span class="flex items-center gap-1.5 text-xs font-bold"><Receipt class="text-brand size-4" aria-hidden="true" />สลิปโอนเงิน</span>
                            <span class="bg-border h-1 rounded-full"></span>
                            <span class="bg-border h-1 w-2/3 rounded-full"></span>
                            <span class="text-base font-bold tabular-nums">{Number(x.amt).toFixed(2)}</span>
                        </div>
                        {#if x.checked}
                            <Status tone="success">ตรวจสอบสลิปแล้ว</Status>
                        {:else}
                            <Button size="sm" data-tone="primary" disabled={done} onclick={() => slipCheck(c, i)}
                                ><ScanSearch data-icon="inline-start" />ตรวจสอบสลิป</Button
                            >
                        {/if}
                    {:else if x.action === "sticker"}
                        <!-- สติ๊กเกอร์ที่ส่ง (ต้นแบบไม่มีรูปจริง ⇒ ไอคอน + ชื่อสติ๊กเกอร์) -->
                        <!-- สติ๊กเกอร์แสดงเป็นรูปลอยไม่มีฟอง เหมือนใน LINE -->
                        <StickerImg k={x.key} class="bub size-28" />
                    {:else if x.who === "sys"}
                        <div class="bub bg-info/10 dark:bg-info/20 ring-info/25 flex items-start gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ring-1 wrap-anywhere">
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
        <!-- @container: ห้องแชทแคบกว่า 28rem ⇒ ปุ่มจำลองสลิปเหลือแค่ไอคอน ให้ช่องพิมพ์ไม่ถูกบีบ -->
        <div class="@container flex gap-2">
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
            <Button variant="outline" title="Mock: จำลองลูกค้าส่งสลิป" aria-label="จำลองสลิป" disabled={done} onclick={() => mockSlip(c)}
                ><Receipt data-icon="inline-start" /><span class="hidden @md:inline">จำลองสลิป</span></Button
            >
            <Button disabled={done} onclick={send}><Send data-icon="inline-start" />ส่ง</Button>
        </div>
    </Card.Footer>
</Card.Root>
