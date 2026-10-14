<script>
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import Status from "../ui/Status.svelte";
    import { pendingDep, pendingWd } from "../data.js";
    let { c } = $props();
    const sum = (a) => a.reduce((s, r) => s + r.amt, 0);
    const secs = $derived([["ค้างฝาก", pendingDep(c)], ["ค้างถอน", pendingWd(c)]]);
</script>

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>สถานะยอดค้าง</Card.Title>
        <Card.Action class="text-muted-foreground max-w-32 truncate self-center text-xs" title={c.name}>{c.name}</Card.Action>
    </Card.Header>
    <Card.Content class="gap-0">
        {#each secs as [title, a], si (title)}
            <section class={"flex flex-col gap-1.5 " + (si ? "mt-2 border-t pt-2" : "")} aria-label={title}>
                <div class="flex items-center justify-between gap-2 text-sm font-bold">
                    {title}
                    {#if a.length}<Status tone="warning"><span class="tabular-nums">{a.length} รายการ · {sum(a).toFixed(2)} บาท</span></Status>
                    {:else}<Status tone="success">ไม่มี</Status>{/if}
                </div>
                {#if a.length}
                    <Item.Group class="gap-1.5">
                        {#each a as r, i (i)}
                            <Item.Root variant="muted" size="sm" class="py-1.5">
                                <Item.Content class="min-w-0">
                                    <Item.Title class="tabular-nums">{r.amt.toFixed(2)}</Item.Title>
                                    <Item.Description>{r.st}</Item.Description>
                                </Item.Content>
                                <Item.Actions class="text-muted-foreground text-xs tabular-nums">{r.time}</Item.Actions>
                            </Item.Root>
                        {/each}
                    </Item.Group>
                {:else}
                    <p class="text-muted-foreground text-xs">ไม่มียอดค้าง</p>
                {/if}
            </section>
        {/each}
    </Card.Content>
</Card.Root>
