<!-- การ์ดในแผงลูกค้า (เว็บต้นฉบับ 15 ต.ค. 2026 · ปรับ 15 ต.ค. 2026 ตามเจ้าของงาน)
     def = ค่าเริ่มต้นพับ (true) หรือกาง (false) · action = ของท้ายหัวการ์ด (ป้าย · ชื่อลูกค้า · จำนวน)
       - def false (ข้อมูลที่แสดงอยู่) = การ์ดเดิม กดหัวการ์ดพับ/กางได้ · สถานะจำแยกต่อเคส (store: isFolded / setFold)
       - def true  (ข้อมูลที่ไม่แสดง)  = ปุ่มขนาดเล็ก กดแล้วเปิดหน้าต่าง (Modal) ของข้อมูลนั้น ⇒ แผงไม่ยาวจนต้องเลื่อน
         CustomerPanel วางปุ่มพวกนี้เป็นตาราง 2 ช่อง -->
<script>
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import { isFolded, setFold } from "../store.svelte.js";

    let { c, title, def = false, action, children, contentClass = "" } = $props();
    const folded = $derived(isFolded(c, title, def));
    const id = $derived("fold-" + title.replace(/\W+/g, "") + "-" + (c ? c.id : "x"));
    let open = $state(false);
</script>

{#if def}
    <button
        type="button"
        class="bg-card ring-foreground/10 hover:bg-muted focus-visible:ring-ring/50 flex min-h-11 w-full min-w-0 flex-col items-start justify-center gap-1 rounded-xl px-3 py-2 text-start shadow-xs ring-1 outline-none focus-visible:ring-3"
        aria-haspopup="dialog"
        onclick={() => (open = true)}
    >
        <span class="flex w-full min-w-0 items-start gap-1 text-sm font-medium">
            <span class="min-w-0 flex-1 leading-snug">{title}</span><ChevronRight class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
        </span>
        {#if action}<span class="flex max-w-full min-w-0 text-xs">{@render action()}</span>{/if}
    </button>
    <Dialog.Root bind:open>
        <Dialog.Content class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-w-md">
            <Dialog.Header>
                <Dialog.Title class="flex flex-wrap items-center gap-2 pe-6">{title}{#if action}<span class="text-sm font-normal">{@render action()}</span>{/if}</Dialog.Title>
            </Dialog.Header>
            <div class={"flex min-h-0 flex-col overflow-y-auto " + contentClass}>{@render children()}</div>
        </Dialog.Content>
    </Dialog.Root>
{:else}
    <Card.Root size="sm">
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
