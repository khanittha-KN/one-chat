<!-- ปุ่มสติ๊กเกอร์ในช่องพิมพ์ของหน้าแชต — มีสติ๊กเกอร์ทุกชุดในระบบ แต่เปิดมาเจอแท็บ "บันทึกไว้" ก่อนเสมอ (เจ้าของงาน 14 ต.ค. 2026)
     แท็บ "บันทึกไว้" = สติ๊กเกอร์โปรด + ชุดที่บันทึกใน Settings › ชุดสติ๊กเกอร์ (ชุดโปรดขึ้นก่อน) · แท็บถัดไป = ทุกชุดในคลัง LINE (รูปปกเป็นสติ๊กเกอร์แรกของชุด แบบแถบชุดใน LINE)
     popover ของ shadcn (DESIGN-SYSTEM §10.0 รายการที่ใช้) · กดสติ๊กเกอร์ = ส่งทันทีแล้วปิดแผง -->
<script>
    import Sticker from "@lucide/svelte/icons/sticker";
    import Star from "@lucide/svelte/icons/star";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { PACKS, stickerLabel } from "./data.js";
    import StickerImg from "./ui/StickerImg.svelte";
    import { S, sendSticker, openSettings } from "./store.svelte.js";

    let { c, disabled = false } = $props();
    let open = $state(false);
    let tab = $state("saved");
    const sets = $derived(S.stk.filter((x) => x.items && x.items.length).sort((a, b) => (b.fav ? 1 : 0) - (a.fav ? 1 : 0)));
    const empty = $derived(!S.fav.length && !sets.length);
    const packKeys = (p) => Array.from({ length: p[1] }, (_, i) => p[0] + "-" + i);

    // เปิดแผงทุกครั้งกลับไปที่ "บันทึกไว้" แม้ครั้งก่อนจะเลื่อนไปดูชุดอื่น
    function onOpenChange(o) {
        if (o) tab = "saved";
    }
    function send(k) {
        sendSticker(c, k);
        open = false;
    }
</script>

{#snippet tiles(keys, label)}
    <div class="grid grid-cols-5 gap-1.5" role="group" aria-label={label}>
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

{#snippet heading(text, count)}
    <span class="flex items-center gap-1.5 text-xs font-bold">{@render text()}<span class="text-muted-foreground font-normal tabular-nums">· {count} รูป</span></span>
{/snippet}

<Popover.Root bind:open {onOpenChange}>
    <Popover.Trigger
        {disabled}
        class={buttonVariants({ variant: "outline", size: "icon" })}
        aria-label="ส่งสติ๊กเกอร์"
        title="ส่งสติ๊กเกอร์"
    >
        <Sticker />
    </Popover.Trigger>
    <Popover.Content align="end" side="top" class="w-80 gap-3 p-3 sm:w-96">
        <Popover.Header>
            <Popover.Title>สติ๊กเกอร์</Popover.Title>
        </Popover.Header>
        <Tabs.Root bind:value={tab} class="gap-3">
            <!-- แถบชุด: บันทึกไว้ (ตัวหนังสือ) + รูปปกของทุกชุดในคลัง · ชุดเยอะเกินความกว้าง ⇒ เลื่อนแนวนอน -->
            <Tabs.List class="w-full justify-start overflow-x-auto" aria-label="ชุดสติ๊กเกอร์">
                <Tabs.Trigger value="saved" class="flex-none"><Star class="text-warning" fill="currentColor" aria-hidden="true" />บันทึกไว้</Tabs.Trigger>
                {#each PACKS as p (p[0])}
                    <Tabs.Trigger value={"p" + p[0]} class="flex-none px-1" aria-label={"ชุด " + p[0]} title={"ชุด " + p[0]}>
                        <StickerImg k={p[0] + "-0"} class="size-6" />
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>
            <div class="max-h-80 overflow-y-auto">
                <Tabs.Content value="saved" class="flex flex-col gap-3">
                    {#if empty}
                        <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์ที่บันทึกไว้</p>
                        <Button variant="outline" size="sm" class="self-start" onclick={() => { open = false; openSettings("stk"); }}><SettingsIcon data-icon="inline-start" />ไปที่ชุดสติ๊กเกอร์</Button>
                    {/if}
                    {#if S.fav.length}
                        <section class="flex flex-col gap-1.5">
                            {#snippet favTitle()}<Star class="text-warning size-3.5" fill="currentColor" aria-hidden="true" />สติ๊กเกอร์โปรด{/snippet}
                            {@render heading(favTitle, S.fav.length)}
                            {@render tiles(S.fav, "สติ๊กเกอร์โปรด")}
                        </section>
                    {/if}
                    {#each sets as x, i (i)}
                        <section class="flex flex-col gap-1.5">
                            {#snippet setTitle()}{#if x.fav}<Star class="text-warning size-3.5" fill="currentColor" aria-label="โปรด" />{/if}{x.name}{/snippet}
                            {@render heading(setTitle, x.items.length)}
                            {@render tiles(x.items, x.name)}
                        </section>
                    {/each}
                </Tabs.Content>
                {#each PACKS as p (p[0])}
                    <Tabs.Content value={"p" + p[0]} class="flex flex-col gap-1.5">
                        {#snippet packTitle()}ชุด {p[0]}{/snippet}
                        {@render heading(packTitle, p[1])}
                        {@render tiles(packKeys(p), "ชุด " + p[0])}
                    </Tabs.Content>
                {/each}
            </div>
        </Tabs.Root>
    </Popover.Content>
</Popover.Root>
