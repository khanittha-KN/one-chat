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

    let { c, title, def = false, action, children, contentClass = "", cardClass = "", icon: Icon = null, hint = "", dot = "" } = $props();
    // ปุ่ม: hint = สถานะ (บอกโปรแกรมอ่านหน้าจอ + tooltip) · dot = จุดสีสถานะ success | warning | destructive
    const DOT = { success: "bg-success", warning: "bg-warning", destructive: "bg-destructive" };
    const folded = $derived(isFolded(c, title, def));
    const id = $derived("fold-" + title.replace(/\W+/g, "") + "-" + (c ? c.id : "x"));
    let open = $state(false);
</script>

{#if def}
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
    </Button>
    <Dialog.Root bind:open>
        <Dialog.Content class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-w-md">
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
                <button
                    type="button"
                    class="hover:text-foreground/80 -mx-1 flex w-full items-center gap-1.5 rounded-md px-1 text-start"
                    aria-expanded={!folded}
                    aria-controls={id}
                    onclick={() => setFold(c, title, !folded)}
                >
                    <ChevronDown class={"text-muted-foreground size-4 shrink-0 transition-transform " + (folded ? "-rotate-90" : "")} aria-hidden="true" />{title}
                </button>
            </Card.Title>
            {#if action}<Card.Action class="self-center">{@render action()}</Card.Action>{/if}
        </Card.Header>
        {#if !folded}
            <Card.Content {id} class={contentClass}>{@render children()}</Card.Content>
        {/if}
    </Card.Root>
{/if}
