<script>
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import FoldCard from "../ui/FoldCard.svelte";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import { pendingDep, pendingWd, money } from "../data.js";
    let { c } = $props();
    const sum = (a) => a.reduce((s, r) => s + r.amt, 0);
    // ใหม่สุดก่อน (เวลา "hh:mm" ของวันนี้)
    const byTime = (a) => [...a].sort((x, y) => (y.time || "").localeCompare(x.time || ""));
    // ver2: แสดงเฉพาะฝั่งที่มียอดค้าง (แผงแสดงการ์ดนี้เมื่อมียอดค้างเท่านั้น)
    // ยอดค้างเป็นของบัญชีสมาชิก ไม่ใช่ของแชท ⇒ แสดงทั้งฝากและถอนที่มี · แชทเรื่องถอน ⇒ ค้างถอนขึ้นก่อน (เรื่องที่ลูกค้าถามอยู่)
    const secs = $derived(
        (c.type === "withdraw" ? [["ค้างถอน", pendingWd(c)], ["ค้างฝาก", pendingDep(c)]] : [["ค้างฝาก", pendingDep(c)], ["ค้างถอน", pendingWd(c)]])
            .filter(([, a]) => a.length)
            .map(([t, a]) => [t, byTime(a)]),
    );
    /* รายการเยอะ (23 พ.ย. 2026): แต่ละฝั่งแสดง 3 รายการล่าสุด · ที่เหลือกด "ดูอีก N รายการ" กางในการ์ดเดิม (ไม่เปิดหน้าต่าง จะได้เห็นฟอร์มเครดิตด้านล่างไปด้วย)
       หัวฝั่ง + การ์ดสรุปสมาชิกนับยอดรวมครบเสมอ · กางไว้จำแยกต่อลูกค้าและต่อฝั่ง */
    const SHOW = 3;
    let open = $state({});
</script>

<!-- ยอดค้างฝาก/ถอน (ver2: ไม่แสดงชื่อลูกค้าซ้ำในหัวการ์ด · ยอดรวมขึ้นที่การ์ดสรุปสมาชิกด้วย) -->
<FoldCard {c} title="ยอดค้าง" contentClass="gap-0">
    {#each secs as [title, a], si (title)}
        {@const key = c.id + title}
        {@const more = a.length - SHOW}
        {@const list = open[key] ? a : a.slice(0, SHOW)}
        <section class={"flex flex-col gap-1.5 " + (si ? "mt-2 border-t pt-2" : "")} aria-label={title}>
            <div class="flex items-center justify-between gap-2 text-sm font-bold">
                {title}
                <Status tone="warning"><span class="tabular-nums">{a.length} รายการ · {money(sum(a))} บาท</span></Status>
            </div>
            <Item.Group class="gap-1.5" id={"pend-" + key}>
                {#each list as r, i (i)}
                    <Item.Root variant="muted" size="sm" class="py-1.5">
                        <Item.Content class="min-w-0">
                            <Item.Title class="tabular-nums">{money(r.amt)}</Item.Title>
                            <Item.Description>{r.st}</Item.Description>
                        </Item.Content>
                        <Item.Actions class="text-muted-foreground text-xs tabular-nums">{r.time}</Item.Actions>
                    </Item.Root>
                {/each}
            </Item.Group>
            {#if more > 0}
                <Button variant="ghost" size="sm" class="text-muted-foreground self-start" aria-expanded={!!open[key]} aria-controls={"pend-" + key} onclick={() => (open[key] = !open[key])}>
                    <ChevronDown data-icon="inline-start" class={open[key] ? "rotate-180" : ""} />{open[key] ? "ย่อ" : "ดูอีก " + more + " รายการ"}
                </Button>
            {/if}
        </section>
    {/each}
</FoldCard>
