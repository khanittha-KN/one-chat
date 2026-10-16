<!-- ประวัติฝาก/ถอน — ปุ่มในแผงลูกค้า กดแล้วเปิดหน้าต่างแสดงทุกรายการเลย ไม่ต้องกด "ดูทั้งหมด" อีกชั้น (เจ้าของงานสั่ง 15 ต.ค. 2026)
     แท็บ ทั้งหมด / ฝาก / ถอน + จำนวน · หน้าละ 10 รายการ แบ่งหน้าด้านล่าง · เปลี่ยนแท็บ ⇒ กลับหน้า 1 -->
<script>
    import History from "@lucide/svelte/icons/history";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import HistRows from "./HistRows.svelte";
    import { histAll, histSums } from "../data.js";
    let { c } = $props();
    const PER = 10;
    const items = $derived(histAll(c));
    let tab = $state("all");
    let page = $state(1);
    const list = $derived(tab === "all" ? items : items.filter((x) => x.k === tab));
    const pages = $derived(Math.max(1, Math.ceil(list.length / PER)));
    const cur = $derived(Math.min(page, pages));
    const shown = $derived(list.slice((cur - 1) * PER, cur * PER));
    const tabs = $derived([
        ["all", "ทั้งหมด", items.length],
        ["dep", "ฝาก", items.filter((x) => x.k === "dep").length],
        ["wd", "ถอน", items.filter((x) => x.k === "wd").length],
    ]);
</script>

{#snippet who()}<span class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">{items.length ? items.length + " รายการ" : "ไม่มี"}</span>{/snippet}

<FoldCard {c} title="ประวัติฝากถอน" icon={History} hint={items.length + " รายการ"} def={true} action={who} contentClass="gap-3">
    {#if items.length}
        <ToggleGroup.Root
            type="single"
            variant="outline"
            class="w-full *:flex-1"
            aria-label="ประเภทรายการ"
            bind:value={() => tab, (k) => k && ((tab = k), (page = 1))}
        >
            {#each tabs as [k, label, n] (k)}
                <ToggleGroup.Item value={k}>{label}<Badge variant="secondary" class="tabular-nums">{n}</Badge></ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
        <p class="text-muted-foreground text-xs tabular-nums">
            {#if list.length}รายการที่ {(cur - 1) * PER + 1}–{Math.min(cur * PER, list.length)} จาก {list.length} · {histSums(list)}{:else}ไม่มีรายการ{tab === "dep" ? "ฝาก" : "ถอน"}{/if}
        </p>
        {#if shown.length}<HistRows items={shown} />{/if}
        {#if pages > 1}
            <nav class="flex flex-wrap items-center justify-center gap-1" aria-label="แบ่งหน้าประวัติ">
                <Button variant="ghost" size="icon-sm" aria-label="หน้าก่อน" disabled={cur === 1} onclick={() => (page = cur - 1)}><ChevronLeft /></Button>
                {#each Array.from({ length: pages }, (_, i) => i + 1) as n (n)}
                    <Button
                        variant={n === cur ? "outline" : "ghost"}
                        size="icon-sm"
                        class="tabular-nums"
                        aria-label={"หน้า " + n}
                        aria-current={n === cur ? "page" : undefined}
                        onclick={() => (page = n)}>{n}</Button
                    >
                {/each}
                <Button variant="ghost" size="icon-sm" aria-label="หน้าถัดไป" disabled={cur === pages} onclick={() => (page = cur + 1)}><ChevronRight /></Button>
            </nav>
        {/if}
    {:else}
        <p class="text-muted-foreground text-sm">ยังไม่มีประวัติฝาก/ถอน</p>
    {/if}
</FoldCard>
