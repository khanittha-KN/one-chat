<!-- ปุ่มสติ๊กเกอร์ในช่องพิมพ์ของหน้าแชต — ดึงจาก Settings › ชุดสติ๊กเกอร์ (โปรดก่อน แล้วตามด้วยชุดที่บันทึกไว้)
     popover ของ shadcn (DESIGN-SYSTEM §10.0 รายการที่ใช้) · กดสติ๊กเกอร์ = ส่งทันทีแล้วปิดแผง · ยังไม่มี ⇒ พาไปหน้าตั้งค่า -->
<script>
    import Sticker from "@lucide/svelte/icons/sticker";
    import Star from "@lucide/svelte/icons/star";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { stickerLabel } from "./data.js";
    import StickerImg from "./ui/StickerImg.svelte";
    import { S, sendSticker, openSettings } from "./store.svelte.js";

    let { c, disabled = false } = $props();
    let open = $state(false);
    const sets = $derived(S.stk.filter((x) => x.items && x.items.length).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0)));
    const empty = $derived(!S.fav.length && !sets.length);

    function send(k) {
        sendSticker(c, k);
        open = false;
    }
</script>

{#snippet tiles(keys, label)}
    <div class="grid grid-cols-4 gap-1.5" role="group" aria-label={label}>
        {#each keys as k, i (i)}
            <Button
                variant="outline"
                class="aspect-square h-auto p-1"
                aria-label={"ส่งสติ๊กเกอร์ " + stickerLabel(k)}
                title={stickerLabel(k)}
                onclick={() => send(k)}
            >
                <StickerImg {k} class="size-full" />
            </Button>
        {/each}
    </div>
{/snippet}

<Popover.Root bind:open>
    <Popover.Trigger
        {disabled}
        class={buttonVariants({ variant: "outline", size: "icon" })}
        aria-label="ส่งสติ๊กเกอร์"
        title="ส่งสติ๊กเกอร์"
    >
        <Sticker />
    </Popover.Trigger>
    <Popover.Content align="end" side="top" class="w-80 gap-3 p-3">
        <Popover.Header>
            <Popover.Title>สติ๊กเกอร์</Popover.Title>
        </Popover.Header>
        {#if empty}
            <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์ — สร้างชุดหรือกดดาวสติ๊กเกอร์โปรดที่หน้าตั้งค่าก่อน</p>
            <Button variant="outline" size="sm" onclick={() => { open = false; openSettings("stk"); }}><SettingsIcon data-icon="inline-start" />ไปที่ชุดสติ๊กเกอร์</Button>
        {:else}
            <div class="flex max-h-80 flex-col gap-3 overflow-y-auto">
                {#if S.fav.length}
                    <section class="flex flex-col gap-1.5">
                        <span class="flex items-center gap-1.5 text-xs font-bold"><Star class="text-warning size-3.5" fill="currentColor" aria-hidden="true" />สติ๊กเกอร์โปรด</span>
                        {@render tiles(S.fav, "สติ๊กเกอร์โปรด")}
                    </section>
                {/if}
                {#each sets as x, i (i)}
                    <section class="flex flex-col gap-1.5">
                        <span class="flex items-center gap-1.5 text-xs font-bold">
                            {#if x.fav}<Star class="text-warning size-3.5" fill="currentColor" aria-label="โปรด" />{/if}{x.name}
                            <span class="text-muted-foreground font-normal tabular-nums">· {x.items.length} รูป</span>
                        </span>
                        {@render tiles(x.items, x.name)}
                    </section>
                {/each}
            </div>
        {/if}
    </Popover.Content>
</Popover.Root>
