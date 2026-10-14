<!-- ช่องเลือกสติ๊กเกอร์ (แทนการพิมพ์ชื่อชุด / ID ที่จำไม่ได้) — กดแล้วเลือกจาก โปรด · ชุดของฉัน · คลัง LINE
     value = คีย์สติ๊กเกอร์ "446-3" หรือ "id-123" · ปุ่มแสดงรูปที่เลือกอยู่ -->
<script>
    import StickerIcon from "@lucide/svelte/icons/sticker";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import StickerImg from "./StickerImg.svelte";
    import { PACKS, stickerLabel, isStickerKey } from "../data.js";
    import { S } from "../store.svelte.js";

    let { value = $bindable(""), label = "สติ๊กเกอร์", disabled = false } = $props();
    let open = $state(false);
    let tab = $state(S.fav.length ? "fav" : "lib");
    let pack = $state(PACKS[0][0]);
    const ok = $derived(isStickerKey(value));
    const sets = $derived(S.stk.filter((x) => x.items && x.items.length));
    const pk = $derived(PACKS.filter((p) => p[0] === pack)[0]);

    function pick(k) {
        value = k;
        open = false;
    }
</script>

{#snippet grid(keys, name)}
    <div class="grid grid-cols-5 gap-1.5" role="group" aria-label={name}>
        {#each keys as k (k)}
            <Button
                variant="outline"
                class={"aspect-square h-auto p-1 " + (k === value ? "border-brand bg-brand/10" : "")}
                aria-pressed={k === value}
                aria-label={"เลือก " + stickerLabel(k)}
                title={stickerLabel(k)}
                onclick={() => pick(k)}><StickerImg {k} class="size-full" /></Button
            >
        {/each}
    </div>
{/snippet}

<Popover.Root bind:open>
    <Popover.Trigger
        {disabled}
        class={buttonVariants({ variant: "outline" }) + " h-auto min-h-9 w-full justify-start gap-2 px-2 py-1 font-normal"}
        aria-label={label + (ok ? ": " + stickerLabel(value) + " (กดเพื่อเปลี่ยน)" : " — ยังไม่เลือก")}
    >
        {#if ok}
            <StickerImg k={value} class="size-10" />
            <span class="truncate">{stickerLabel(value)}</span>
            <span class="text-muted-foreground ms-auto text-xs">เปลี่ยน</span>
        {:else}
            <StickerIcon class="text-muted-foreground" aria-hidden="true" /><span class="text-muted-foreground">เลือกสติ๊กเกอร์…</span>
        {/if}
    </Popover.Trigger>
    <Popover.Content align="start" class="w-80 gap-0 p-3 sm:w-96">
        <Tabs.Root bind:value={tab}>
            <Tabs.List class="w-full">
                <Tabs.Trigger value="fav">โปรด ({S.fav.length})</Tabs.Trigger>
                <Tabs.Trigger value="sets">ชุดของฉัน</Tabs.Trigger>
                <Tabs.Trigger value="lib">คลัง LINE</Tabs.Trigger>
            </Tabs.List>
            <div class="max-h-72 overflow-y-auto pt-1">
                <Tabs.Content value="fav">
                    {#if S.fav.length}{@render grid(S.fav, "สติ๊กเกอร์โปรด")}
                    {:else}<p class="text-muted-foreground py-4 text-center text-sm">ยังไม่มีสติ๊กเกอร์โปรด — ติดดาวได้ที่ Settings › ชุดสติ๊กเกอร์</p>{/if}
                </Tabs.Content>
                <Tabs.Content value="sets" class="flex flex-col gap-3">
                    {#each sets as x, i (i)}
                        <section class="flex flex-col gap-1.5">
                            <span class="text-xs font-bold">{x.name}</span>
                            {@render grid(x.items, x.name)}
                        </section>
                    {:else}
                        <p class="text-muted-foreground py-4 text-center text-sm">ยังไม่มีชุดสติ๊กเกอร์</p>
                    {/each}
                </Tabs.Content>
                <Tabs.Content value="lib" class="flex flex-col gap-2">
                    <div class="flex flex-wrap gap-1" role="group" aria-label="เลือกชุดในคลัง">
                        {#each PACKS as p (p[0])}
                            <Toggle size="sm" variant="outline" class="data-[state=on]:border-brand data-[state=on]:text-brand tabular-nums" pressed={pack === p[0]} onPressedChange={() => (pack = p[0])}>ชุด {p[0]}</Toggle>
                        {/each}
                    </div>
                    {#if pk}{@render grid(Array.from({ length: pk[1] }, (_, i) => pk[0] + "-" + i), "ชุด " + pk[0])}{/if}
                </Tabs.Content>
            </div>
        </Tabs.Root>
    </Popover.Content>
</Popover.Root>
