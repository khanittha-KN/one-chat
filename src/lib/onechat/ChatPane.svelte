<!-- ห้องแชท — การ์ด (DESIGN-SYSTEM §10.6) ตามเว็บต้นฉบับ 15 ต.ค. 2026:
     แถว 1: รูป · ชื่อลูกค้า (สีตามประเภทเคส) · ✎ แก้ชื่อ/ไอดี · ผู้รับเคส · ปิดเคส [F4] · ◫ ซ่อน/แสดงแผงลูกค้า
     แถว 2: LINE Channel · ป้ายสถานะ · ปุ่มเปลี่ยนประเภท ฝาก / ถอน / เรื่องทั่วไป · ช่องโน้ต + รายการโน้ต
     ข้อความ: วันเวลาใต้ฟอง · ช่องพิมพ์: แถบเครื่องมือ คีย์ลัด · การ์ดข้อความ · สติ๊กเกอร์ · ส่งรูปภาพ -->
<script>
    import Check from "@lucide/svelte/icons/check";
    import { tick } from "svelte";
    import X from "@lucide/svelte/icons/x";
    import Save from "@lucide/svelte/icons/save";
    import Send from "@lucide/svelte/icons/send";
    import Pencil from "@lucide/svelte/icons/pencil";
    import ScanSearch from "@lucide/svelte/icons/scan-search";
    import StickyNote from "@lucide/svelte/icons/sticky-note";
    import Info from "@lucide/svelte/icons/info";
    import UserRound from "@lucide/svelte/icons/user-round";
    import Zap from "@lucide/svelte/icons/zap";
    import CreditCard from "@lucide/svelte/icons/credit-card";
    import ImageIcon from "@lucide/svelte/icons/image";
    import PanelRightClose from "@lucide/svelte/icons/panel-right-close";
    import PanelRightOpen from "@lucide/svelte/icons/panel-right-open";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Status from "./ui/Status.svelte";
    import StickerPicker from "./StickerPicker.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import PlatformIcon from "./ui/PlatformIcon.svelte";
    import { merch, slipOf, bankOf, money, TODAY, CARDS, PLATFORM } from "./data.js";
    import { kindOf, TYPE_BTNS } from "./kinds.js";
    import {
        db, st, S, cur, ME, toast, closeCase, saveName, sendText, quickSend, askAcc, slipCheck,
        setType, addNote, delNote, sendQuickSet, sendCard, sendImage, openSettings,
    } from "./store.svelte.js";

    let { class: className = "" } = $props();
    const c = $derived(cur());
    const m = $derived(merch(c.merchant));
    const k = $derived(kindOf(c));
    const done = $derived(c.status === "closed");
    const quick = $derived(db.announces.filter((a) => a.status === "ใช้งาน" && a.text));

    let msgsEl = $state(null);
    let eName = $state(null);
    let eUser = $state(null);
    let imgIn = $state(null);
    let draft = $state(""); // ค่าที่พิมพ์ค้างอยู่คงไว้ข้ามการสลับเคส เหมือนต้นฉบับ
    let note = $state("");
    let qrOpen = $state(false);
    let cardOpen = $state(false);

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
    function pickImage(e) {
        const f = e.currentTarget.files && e.currentTarget.files[0];
        e.currentTarget.value = "";
        if (!f) return;
        if (!/^image\/(jpeg|png)$/.test(f.type)) return toast("ส่งได้เฉพาะรูป JPG หรือ PNG");
        if (f.size > 10 * 1024 * 1024) return toast("รูปใหญ่เกิน 10 MB — ย่อรูปก่อนส่ง");
        sendImage(c, URL.createObjectURL(f), f.name);
    }
    const who = (x) => (x.who === "sys" ? "system" : x.by || ME);
    const toolBtn = buttonVariants({ variant: "ghost", size: "icon" });
</script>

<Card.Root id="colChat" role="region" aria-label="แชทลูกค้า" class={"m-2 min-h-0 gap-0 py-0 shadow-sm lg:m-3 " + className}>
    <Card.Header class="gap-1.5 border-b py-2 [.border-b]:pb-2">
        <!-- แถว 1: ตัวตนลูกค้า · ผู้รับเคส · ปิดเคส · ซ่อนแผงลูกค้า -->
        <div class="col-span-full flex min-w-0 flex-wrap items-center gap-2">
            <CustomerAvatar {c} class="size-8" />
            <Card.Title class={"truncate text-base font-bold " + k.name}>{c.name}</Card.Title>
            <Button
                variant="ghost"
                size="icon-sm"
                aria-label="แก้ไขชื่อและไอดีลูกค้า"
                title="แก้ไขชื่อและไอดีลูกค้า"
                aria-expanded={st.editName}
                onclick={async () => {
                    st.editName = !st.editName;
                    await tick();
                    eName?.focus();
                }}><Pencil /></Button
            >
            <span class="flex-1"></span>
            {#if c.admin}
                <Badge variant="secondary" data-tone="info" class="h-7 gap-1 px-2.5" title="ผู้รับเคส"><UserRound aria-hidden="true" />รับโดย {c.admin}</Badge>
            {:else}
                <Badge variant="secondary" class="h-7 px-2.5 font-normal">รอแอดมินรับเคส</Badge>
            {/if}
            {#if !done}
                <Button data-tone="destructive" data-fill="solid" size="sm" onclick={() => closeCase(c)}><X data-icon="inline-start" />ปิดเคส [F4]</Button>
            {/if}
            <!-- ซ่อน/แสดงแผงข้อมูลลูกค้า — จอ ≥768 (tablet ขึ้นไป) ที่แผงลูกค้าอยู่ข้างห้องแชท -->
            <Button
                variant="outline"
                size="icon-sm"
                class="hidden md:inline-flex"
                aria-label="ซ่อน/แสดงแผงข้อมูลลูกค้า"
                title="ซ่อน/แสดงแผงข้อมูลลูกค้า"
                aria-pressed={!st.panelOff}
                onclick={() => (st.panelOff = !st.panelOff)}
            >
                {#if st.panelOff}<PanelRightOpen />{:else}<PanelRightClose />{/if}
            </Button>
        </div>
        <!-- แถว 2: ช่องทาง (LINE / Telegram) + Channel · ป้ายสถานะ · เปลี่ยนประเภทเคส -->
        <div class="col-span-full flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">
            <Card.Description class="oa flex min-w-0 items-center gap-1.5 text-xs" title={PLATFORM[m.platform] + " " + m.name + " (@" + m.id + ")"}>
                <PlatformIcon p={m.platform} label />
                <span class="min-w-0 truncate"><b class="text-foreground font-bold">{m.name}</b> (@{m.id})</span>
            </Card.Description>
            <Badge variant="outline" class={"status " + k.badge}>{done ? "ปิดเคสแล้ว" : k.label}</Badge>
            <span class="flex-1"></span>
            {#if !done}
                <div class="flex flex-wrap gap-1" role="group" aria-label="ประเภทเคส">
                    {#each TYPE_BTNS as [t, label, on, idle] (t)}
                        <Button
                            variant="outline"
                            size="xs"
                            class={"rounded-full " + (c.type === t ? on + " font-bold" : idle)}
                            aria-pressed={c.type === t}
                            onclick={() => setType(c, t)}>{#if c.type === t}<Check data-icon="inline-start" />{/if}{label}</Button
                        >
                    {/each}
                </div>
            {/if}
        </div>
        {#if st.editName}
            <div class="col-span-full flex flex-wrap gap-2">
                <Input bind:ref={eName} value={c.name} aria-label="ชื่อลูกค้า" class="h-7 min-w-24 flex-1" />
                <Input bind:ref={eUser} value={c.user.username} aria-label="ไอดีลูกค้า" class="h-7 min-w-24 flex-1" />
                <Button size="sm" class="h-7" onclick={() => saveName(c, eName.value, eUser.value)}><Save data-icon="inline-start" />Save</Button>
            </div>
        {/if}
        <InputGroup.Root class="col-span-full h-7">
            <InputGroup.Addon><StickyNote /></InputGroup.Addon>
            <InputGroup.Input
                id="noteIn"
                placeholder="เพิ่มโน้ต… พิมพ์แล้วกด Enter เพื่อบันทึก"
                aria-label="เพิ่มโน้ต"
                bind:value={note}
                onkeydown={(e) => {
                    if (e.key !== "Enter") return;
                    e.preventDefault();
                    if (addNote(c, note)) note = "";
                }}
            />
        </InputGroup.Root>
        {#if c.notes && c.notes.length}
            <ul class="col-span-full flex flex-col gap-1" aria-label="โน้ตของลูกค้า">
                {#each c.notes as n, ni (ni)}
                    <li class="bg-surface-chrome flex flex-wrap items-center gap-x-2.5 gap-y-0.5 rounded-md border px-2.5 py-1 text-sm">
                        <span class="text-muted-foreground shrink-0 text-xs tabular-nums">{n.t}</span>
                        <span class="min-w-0 flex-1 basis-40 wrap-anywhere">{n.text}</span>
                        <b class="text-case-orange-fg shrink-0 text-xs">{n.by}</b>
                        <Button variant="ghost" size="icon-xs" aria-label={"ลบโน้ต " + n.text} onclick={() => delNote(c, ni)}><X /></Button>
                    </li>
                {/each}
            </ul>
        {/if}
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
                    <!-- ข้อความลูกค้าไม่มีชื่อ (รู้อยู่แล้วว่าเป็นใคร) · แอดมิน/ระบบมีชื่อผู้ส่ง -->
                    {#if mine}<span class="who text-chat-meta text-xs">{who(x)}</span>{/if}
                    {#if x.action === "slip"}
                        <!-- รูปสลิปจริงที่ลูกค้าส่ง · กดเพื่อเปิดรูปเต็มในแท็บใหม่ -->
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
                    {:else if x.action === "sticker"}
                        <!-- สติ๊กเกอร์แสดงเป็นรูปลอยไม่มีฟอง เหมือนใน LINE -->
                        <StickerImg k={x.key} class="bub size-28" />
                    {:else if x.action === "image"}
                        <a href={x.src} target="_blank" rel="noopener" class="ring-foreground/10 block max-w-56 overflow-hidden rounded-lg ring-1" aria-label={"รูปภาพ " + (x.name || "") + " — เปิดรูปเต็มในแท็บใหม่"}>
                            <img src={x.src} alt="" class="block h-auto max-h-64 w-full object-cover" />
                        </a>
                    {:else if x.action === "card"}
                        <div class="bub bg-card ring-foreground/10 flex w-56 flex-col gap-1 rounded-lg p-3 text-sm shadow-xs ring-1" role="img" aria-label={"การ์ดข้อความ " + x.card}>
                            <span class="flex items-center gap-1.5 font-bold"><CreditCard class="text-brand size-4" aria-hidden="true" />{x.card}</span>
                            <span class="text-muted-foreground text-xs">{x.desc}</span>
                        </div>
                    {:else if x.who === "sys"}
                        <div class="bub bg-card dark:bg-info/20 ring-info/25 flex items-start gap-2 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap ring-1 wrap-anywhere">
                            <Info class="text-info mt-0.5 size-4 shrink-0" aria-hidden="true" />{x.text}
                        </div>
                    {:else if x.who === "admin"}
                        <div class="bub bg-bubble-admin text-bubble-admin-foreground rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap wrap-anywhere">{x.text}</div>
                    {:else}
                        <div class="bub bg-bubble-cust ring-foreground/10 rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap shadow-xs ring-1 wrap-anywhere">{x.text}</div>
                    {/if}
                    <!-- วันเวลาใต้ฟอง (เว็บต้นฉบับ 15 ต.ค. 2026) -->
                    <span class="ts text-chat-meta text-xs tabular-nums">{TODAY} {x.t}</span>
                    {#if x.action === "slip"}
                        {#if x.checked}
                            <span class="bg-card rounded-4xl"><Status tone="success">ตรวจสอบสลิปแล้ว</Status></span>
                        {:else}
                            <Button size="sm" disabled={done} onclick={() => slipCheck(c, i)}><ScanSearch data-icon="inline-start" />ตรวจสอบสลิป</Button>
                        {/if}
                    {/if}
                </div>
            {/each}
            {#if done}
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
                <Button variant="secondary" size="xs" disabled={done} onclick={() => quickSend(c, a.id)}>{a.name}</Button>
            {:else}
                <span class="text-muted-foreground text-xs">ยังไม่มีข้อความ เพิ่มได้ที่เมนู จัดการข้อความอัตโนมัติ</span>
            {/each}
        </div>
        <!-- @container: ห้องแชทแคบกว่า 28rem (tablet แนวตั้ง) ⇒ แถบเครื่องมือขึ้นบรรทัดบน ช่องพิมพ์ได้ความกว้างเต็ม -->
        <div class="@container flex flex-wrap items-center gap-2">
            <!-- แถบเครื่องมือข้อความ: ⚡ คีย์ลัด · 💳 การ์ดข้อความ · 🎟️ ชุดสติ๊กเกอร์ · 🖼️ ส่งรูปภาพ -->
            <div class="flex w-full shrink-0 items-center gap-0.5 @md:w-auto" role="toolbar" aria-label="เมนูข้อความ">
                <Popover.Root bind:open={qrOpen}>
                    <Popover.Trigger disabled={done} class={toolBtn} aria-label="คีย์ลัด" title="คีย์ลัด (หรือพิมพ์ / )"><Zap /></Popover.Trigger>
                    <Popover.Content align="start" side="top" class="w-80 gap-2 p-2">
                        <Popover.Header class="px-1"><Popover.Title>คีย์ลัด</Popover.Title></Popover.Header>
                        {#each S.qr as q, qi (qi)}
                            <Button
                                variant="outline"
                                class="h-auto justify-start gap-2.5 px-2.5 py-2 text-left font-normal whitespace-normal"
                                onclick={() => {
                                    sendQuickSet(c, qi);
                                    qrOpen = false;
                                }}
                            >
                                <Zap class="text-brand" aria-hidden="true" />
                                <span class="flex min-w-0 flex-col">
                                    <b class="truncate">{q.name}</b>
                                    <small class="text-muted-foreground truncate text-xs">{q.items.length} รายการ · {q.items.map((it) => (it.t === "text" ? it.v : "[" + (it.t === "sticker" ? "สติ๊กเกอร์" : "รูปภาพ") + "]")).join(" / ")}</small>
                                </span>
                            </Button>
                        {:else}
                            <p class="text-muted-foreground px-1 text-sm">ยังไม่มีคีย์ลัด</p>
                            <Button variant="outline" size="sm" class="self-start" onclick={() => { qrOpen = false; openSettings("qr"); }}><SettingsIcon data-icon="inline-start" />ไปที่ตั้งค่า → คีย์ลัด</Button>
                        {/each}
                    </Popover.Content>
                </Popover.Root>
                <Popover.Root bind:open={cardOpen}>
                    <Popover.Trigger disabled={done} class={toolBtn} aria-label="การ์ดข้อความ" title="การ์ดข้อความ"><CreditCard /></Popover.Trigger>
                    <Popover.Content align="start" side="top" class="w-80 gap-2 p-2">
                        <Popover.Header class="px-1">
                            <Popover.Title>การ์ดข้อความ</Popover.Title>
                            <Popover.Description>กดเลือกการ์ด ระบบจะส่งการ์ดให้ลูกค้าในแชท</Popover.Description>
                        </Popover.Header>
                        {#each CARDS as cd, ci (ci)}
                            <Button
                                variant="outline"
                                class="h-auto justify-start gap-2.5 px-2.5 py-2 text-left font-normal"
                                onclick={() => {
                                    sendCard(c, ci);
                                    cardOpen = false;
                                }}
                            >
                                <CreditCard class="text-brand" aria-hidden="true" />
                                <span class="flex min-w-0 flex-col"><b>{cd.name}</b><small class="text-muted-foreground text-xs">{cd.desc}</small></span>
                            </Button>
                        {/each}
                    </Popover.Content>
                </Popover.Root>
                <StickerPicker {c} disabled={done} />
                <input bind:this={imgIn} type="file" accept="image/jpeg,image/png" class="sr-only" tabindex="-1" aria-hidden="true" onchange={pickImage} />
                <Button variant="ghost" size="icon" disabled={done} aria-label="ส่งรูปภาพ" title="ส่งรูปภาพ (JPG / PNG ไม่เกิน 10 MB)" onclick={() => imgIn.click()}><ImageIcon /></Button>
            </div>
            <Input
                id="msgIn"
                class="min-w-0 flex-1"
                placeholder="พิมพ์ข้อความถึงลูกค้า · พิมพ์ / เพื่อเรียกคีย์ลัด"
                aria-label="ข้อความ"
                disabled={done}
                bind:value={draft}
                onkeydown={(e) => {
                    if (e.key === "Enter") {
                        e.preventDefault();
                        send();
                    } else if (e.key === "/" && !draft) {
                        // พิมพ์ / ในช่องที่ว่างอยู่ ⇒ เปิดรายการคีย์ลัด
                        e.preventDefault();
                        qrOpen = true;
                    }
                }}
            />
            <Button disabled={done} onclick={send}><Send data-icon="inline-start" />ส่ง</Button>
        </div>
    </Card.Footer>
</Card.Root>
