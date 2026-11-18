<!-- ประวัติการผูก — ตามเว็บจริง 18 พ.ย. 2026: ปุ่มในแผงลูกค้า กดแล้วเปิดหน้าต่าง
     กรองตามวันที่ (ตั้งแต่ / ถึง) · แต่ละรายการ: วันที่ · การผูก / การเลิกผูก · ยูสเซอร์ · ชื่อเต็ม · ยูสเซอร์ก่อนหน้า · ทำรายการโดย (แอดมิน หรือ หน้า LINE)
     หน้าละ 10 รายการ แบ่งหน้าด้านล่าง -->
<script>
    import Link2 from "@lucide/svelte/icons/link-2";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    let { c } = $props();
    const PER = 10;
    const items = $derived(c.bindLog || []);
    let from = $state("");
    let to = $state("");
    let page = $state(1);
    // "dd/mm/yy hh:mm" (พ.ศ. 2 หลัก) ⇒ "yyyy-mm-dd" (ค.ศ.) ให้เทียบกับช่องวันที่ได้
    const iso = (at) => {
        const [d, m, y] = at.split(" ")[0].split("/");
        return 2500 + Number(y) - 543 + "-" + m + "-" + d;
    };
    const bad = $derived(!!from && !!to && from > to);
    const list = $derived(bad ? [] : items.filter((x) => (!from || iso(x.at) >= from) && (!to || iso(x.at) <= to)));
    const pages = $derived(Math.max(1, Math.ceil(list.length / PER)));
    const cur = $derived(Math.min(page, pages));
    const shown = $derived(list.slice((cur - 1) * PER, cur * PER));
</script>

{#snippet who()}<span class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">{items.length ? items.length + " รายการ" : "ไม่มี"}</span>{/snippet}

<FoldCard {c} title="ประวัติการผูก" icon={Link2} hint={items.length ? items.length + " รายการ" : "ไม่มี"} def={true} action={who} contentClass="gap-3">
    <div class="grid grid-cols-2 gap-2" role="group" aria-label="กรองประวัติการผูกตามวันที่">
        <Field.Field data-invalid={bad}>
            <Field.Label for="bhFrom" class="text-xs">ตั้งแต่</Field.Label>
            <Input id="bhFrom" type="date" bind:value={from} oninput={() => (page = 1)} />
        </Field.Field>
        <Field.Field data-invalid={bad}>
            <Field.Label for="bhTo" class="text-xs">ถึง</Field.Label>
            <Input id="bhTo" type="date" bind:value={to} aria-invalid={bad} oninput={() => (page = 1)} />
        </Field.Field>
    </div>
    {#if bad}<Field.Error>วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด</Field.Error>{/if}
    {#if !items.length}
        <p class="text-muted-foreground text-sm">ยังไม่มีประวัติการผูก</p>
    {:else if !list.length && !bad}
        <p class="text-muted-foreground text-sm">ไม่มีประวัติในช่วงวันที่นี้</p>
    {:else if shown.length}
        <Item.Group class="gap-2">
            {#each shown as x, i (x.at + x.act + i)}
                <Item.Root variant="outline" size="sm">
                    <Item.Content class="min-w-0 gap-1">
                        <Item.Title class="w-full flex-wrap">
                            {#if x.act === "bind"}<Status tone="success" icon={null}>การผูก</Status>{:else}<Status tone="destructive" icon={null}>การเลิกผูก</Status>{/if}
                            <span class="truncate">{x.user}</span>
                            <span class="text-muted-foreground ms-auto text-xs font-normal tabular-nums">{x.at}</span>
                        </Item.Title>
                        <dl class="text-muted-foreground grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                            <dt>ชื่อเต็ม</dt><dd class="text-foreground truncate">{x.fullname || "-"}</dd>
                            <dt>ยูสเซอร์ก่อนหน้า</dt><dd class="text-foreground truncate">{x.prev || "-"}</dd>
                            <dt>ทำรายการโดย</dt><dd class="text-foreground truncate">{x.by}</dd>
                        </dl>
                    </Item.Content>
                </Item.Root>
            {/each}
        </Item.Group>
    {/if}
    {#if pages > 1}
        <nav class="flex flex-wrap items-center justify-center gap-1" aria-label="แบ่งหน้าประวัติการผูก">
            <Button variant="ghost" size="icon-sm" aria-label="หน้าก่อน" disabled={cur === 1} onclick={() => (page = cur - 1)}><ChevronLeft /></Button>
            {#each Array.from({ length: pages }, (_, i) => i + 1) as n (n)}
                <Button variant={n === cur ? "outline" : "ghost"} size="icon-sm" class="tabular-nums" aria-label={"หน้า " + n} aria-current={n === cur ? "page" : undefined} onclick={() => (page = n)}>{n}</Button>
            {/each}
            <Button variant="ghost" size="icon-sm" aria-label="หน้าถัดไป" disabled={cur === pages} onclick={() => (page = cur + 1)}><ChevronRight /></Button>
        </nav>
    {/if}
</FoldCard>
