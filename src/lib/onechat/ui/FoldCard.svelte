<!-- การ์ดในแผงลูกค้า (เว็บต้นฉบับ 15 ต.ค. 2026 · ปรับ 15 ต.ค. 2026 ตามเจ้าของงาน)
     def = ค่าเริ่มต้นพับ (true) หรือกาง (false) · cardClass = เน้นการ์ด (เช่นผลตรวจสลิป) · action = ของท้ายหัวการ์ด (ป้าย · ชื่อลูกค้า · จำนวน)
       - def false (ข้อมูลที่แสดงอยู่) = การ์ดเดิม กดหัวการ์ดพับ/กางได้ · สถานะจำแยกต่อเคส (store: isFolded / setFold)
       - def true  (ข้อมูลที่ไม่แสดง)  = ปุ่มทึบ (icon · ชื่อเต็ม · dot) กดแล้วเปิดหน้าต่าง (Modal) ของข้อมูลนั้น ⇒ แผงไม่ยาวจนต้องเลื่อน
         CustomerPanel วางปุ่มพวกนี้เป็นตาราง 2 ช่อง -->
<script>
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { isFolded, setFold } from "../store.svelte.js";

    let { c, title, def = false, action, children, contentClass = "", cardClass = "", dialogClass = "sm:max-w-md", icon: Icon = null, hint = "", dot = "", showHint = false, open = $bindable(false), look = "pill", foldable = false } = $props();
    // foldable: การ์ดกด "หัว" พับ/กางได้ · ver2 ปิดไว้ (แผงแบ่งเป็นแท็บแล้ว การพับซ้อนอีกชั้นทำให้ลืมว่าพับอะไรไว้)
    /* look (def = true เท่านั้น): "pill" ปุ่มทึบแบบเดิม · "row" แถวรายการเต็มกว้าง (ไอคอน · ชื่อ · สถานะ · ›)
       แถวหลายแถววางในกล่องกลุ่มเดียว (CustomerPanel: GROUP) ⇒ ดูเป็นเมนูกลุ่มเดียวกัน ไม่เหมือนแท็ก (ver2 · 23 พ.ย. 2026) */
    // ปุ่ม: hint = สถานะ (บอกโปรแกรมอ่านหน้าจอ + tooltip) · dot = จุดสีสถานะ success | warning | destructive
    const DOT = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };
    const ALERT = { destructive: "border-destructive/40 bg-destructive/5 text-destructive hover:bg-destructive/10", warning: "border-warning/40 bg-warning/5 text-warning hover:bg-warning/10" };
    const folded = $derived(foldable && isFolded(c, title, def));
    const id = $derived("fold-" + title.replace(/\W+/g, "") + "-" + (c ? c.id : "x"));
    // bind:open ได้ ⇒ การ์ดอื่นสั่งเปิดหน้าต่างได้ (เช่น ปุ่ม "ดูประวัติฝาก" หลังแจ้งฝาก Manual)
</script>

{#if def && look === "alert"}
    <!-- แจ้งเตือนบรรทัดเดียว (ver2): มีปัญหาที่ต้องจัดการ (เช่น LINE หลุด) ⇒ เห็นทันทีแต่ไม่กินที่ · กดเปิดรายละเอียดในหน้าต่าง -->
    <button
        type="button"
        class={"focus-visible:ring-ring/50 flex min-h-11 w-full items-center gap-2.5 rounded-xl border px-3 py-2 text-start text-sm outline-none focus-visible:ring-[3px] " + (ALERT[dot] || ALERT.warning)}
        aria-haspopup="dialog"
        aria-label={title + (hint ? " — " + hint : "") + " — ดูรายละเอียด"}
        onclick={() => (open = true)}
    >
        {#if Icon}<Icon class="size-4 shrink-0" aria-hidden="true" />{/if}
        <span class="min-w-0 flex-1"><span class="text-foreground block truncate font-medium">{title}</span>{#if hint}<span class="block truncate text-xs font-medium">{hint}</span>{/if}</span>
        <span class="text-foreground shrink-0 text-xs font-medium">จัดการ</span>
        <ChevronRight class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    </button>
{/if}
{#if def && look === "row"}
    <button
        type="button"
        class="hover:bg-muted focus-visible:ring-ring/50 flex min-h-11 w-full items-center gap-2.5 px-3 py-2 text-start text-sm outline-none focus-visible:ring-[3px] focus-visible:ring-inset"
        aria-haspopup="dialog"
        aria-label={title + (hint ? " — " + hint : "")}
        onclick={() => (open = true)}
    >
        {#if Icon}<span class="bg-muted text-muted-foreground grid size-7 shrink-0 place-items-center rounded-md" aria-hidden="true"><Icon class="size-4" /></span>{/if}
        <span class="min-w-0 flex-1 truncate font-medium">{title}</span>
        {#if hint}<span class="text-muted-foreground shrink-0 text-xs tabular-nums" aria-hidden="true">{hint}</span>{/if}
        {#if dot}<span class={"size-2 shrink-0 rounded-full " + DOT[dot]} aria-hidden="true"></span>{/if}
        <ChevronRight class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
    </button>
{/if}
{#if def}
    {#if look !== "row" && look !== "alert"}
    <!-- ปุ่มทึบสีเทาอ่อน (เจ้าของงานสั่ง 16 ต.ค. 2026 ให้ซอฟลง · พื้น = ตัวอักษร 10% ตัวอักษรสีหลัก ≥12:1 ทุกธีม) แถวเดียว ขึ้นบรรทัดใหม่เมื่อเต็ม · ชื่อเต็มไม่ย่อ (เจ้าของงานสั่ง 15–16 ต.ค. 2026)
         จุดสถานะมีวงสีพื้นรอบให้เห็นบนพื้นเทา · สถานะเต็มอยู่ใน aria-label / tooltip · กดแล้วเปิดหน้าต่าง -->
    <Button
        size="sm"
        class="bg-foreground/10 text-foreground hover:bg-foreground/15 rounded-full"
        aria-haspopup="dialog"
        aria-label={title + (hint ? " — " + hint : "")}
        title={title + (hint ? " · " + hint : "")}
        onclick={() => (open = true)}
    >
        {#if Icon}<Icon data-icon="inline-start" aria-hidden="true" />{/if}
        {title}
        {#if dot}<span class={"size-2 shrink-0 rounded-full ring-2 ring-background " + DOT[dot]} aria-hidden="true"></span>{/if}
        <!-- สถานะเป็นคำด้วย ไม่บอกด้วยสีอย่างเดียว (WCAG 1.4.1 · 16 ต.ค. 2026) -->
        {#if showHint && hint}<span class="text-muted-foreground font-normal" aria-hidden="true">· {hint}</span>{/if}
    </Button>
    {/if}
    <Dialog.Root bind:open>
        <Dialog.Content class={"flex max-h-[calc(100dvh-2rem)] flex-col " + dialogClass}>
            <Dialog.Header>
                <Dialog.Title class="flex flex-wrap items-center gap-2 pe-6">{title}{#if action}<span class="text-sm font-normal">{@render action()}</span>{/if}</Dialog.Title>
            </Dialog.Header>
            <div class={"flex min-h-0 flex-col overflow-y-auto " + contentClass}>{@render children()}</div>
        </Dialog.Content>
    </Dialog.Root>
{:else}
    <Card.Root size="sm" class={cardClass}>
        <Card.Header>
            <Card.Title>
                {#if !foldable}{title}{:else}
                <button
                    type="button"
                    class="hover:text-foreground/80 -mx-1 flex min-h-7 w-full items-center gap-1.5 rounded-md px-1 text-start"
                    aria-expanded={!folded}
                    aria-controls={id}
                    onclick={() => setFold(c, title, !folded)}
                >
                    <ChevronDown class={"text-muted-foreground size-4 shrink-0 transition-transform " + (folded ? "-rotate-90" : "")} aria-hidden="true" />{title}
                </button>
                {/if}
            </Card.Title>
            {#if action}<Card.Action class="self-center">{@render action()}</Card.Action>{/if}
        </Card.Header>
        {#if !folded}
            <Card.Content id={foldable ? id : undefined} class={contentClass}>{@render children()}</Card.Content>
        {/if}
    </Card.Root>
{/if}
