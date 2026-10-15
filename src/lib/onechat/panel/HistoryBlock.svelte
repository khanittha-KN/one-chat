<script>
    import FoldCard from "../ui/FoldCard.svelte";
    import { Button } from "$lib/components/ui/button/index.js";
    import HistRows from "./HistRows.svelte";
    import { histAll, histSums } from "../data.js";
    import { st } from "../store.svelte.js";
    let { c } = $props();
    const items = $derived(histAll(c));

    function openAll() {
        st.hist = "all";
        st.histModal = true;
    }
</script>

{#snippet who()}<span class="text-muted-foreground block max-w-32 truncate text-xs" title={c.name}>{c.name}</span>{/snippet}

<FoldCard {c} title="ประวัติฝาก/ถอน" def={true} action={who} contentClass="gap-2">
    {#if items.length}
        <p class="text-muted-foreground text-xs">ล่าสุด {Math.min(5, items.length)} จาก {items.length} รายการ · {histSums(items)}</p>
        <HistRows items={items.slice(0, 5)} />
        <Button variant="secondary" size="sm" onclick={openAll}>ดูทั้งหมด / แยกฝาก-ถอน ({items.length} รายการ)</Button>
    {:else}
        <p class="text-muted-foreground text-sm">ยังไม่มีประวัติฝาก/ถอน</p>
    {/if}
</FoldCard>
