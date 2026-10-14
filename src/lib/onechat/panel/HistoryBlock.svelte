<script>
    import * as Card from "$lib/components/ui/card/index.js";
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

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>ประวัติฝาก/ถอน</Card.Title>
        <Card.Action class="text-muted-foreground max-w-32 truncate self-center text-xs" title={c.name}>{c.name}</Card.Action>
    </Card.Header>
    <Card.Content class="gap-2">
        {#if items.length}
            <p class="text-muted-foreground text-xs">ล่าสุด {Math.min(5, items.length)} จาก {items.length} รายการ · {histSums(items)}</p>
            <HistRows items={items.slice(0, 5)} />
            <Button variant="secondary" size="sm" onclick={openAll}>ดูทั้งหมด / แยกฝาก-ถอน ({items.length} รายการ)</Button>
        {:else}
            <p class="text-muted-foreground text-sm">ยังไม่มีประวัติฝาก/ถอน</p>
        {/if}
    </Card.Content>
</Card.Root>
