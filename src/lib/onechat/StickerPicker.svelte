<!-- ปุ่มสติ๊กเกอร์ในช่องพิมพ์ของหน้าแชต — มีสติ๊กเกอร์ทุกชุดในระบบ แต่เปิดมาเจอแท็บ "บันทึกไว้" ก่อนเสมอ (เจ้าของงาน 14 ต.ค. 2026)
     แท็บ "บันทึกไว้" = สติ๊กเกอร์โปรด + ชุดที่บันทึกใน Settings › ชุดสติ๊กเกอร์ (เรียงตามที่สร้าง · ปุ่ม "โปรด" ของชุดเอาออกแล้ว 14 ต.ค. 2026) · แท็บถัดไป = ทุกชุดในคลัง LINE (รูปปกเป็นสติ๊กเกอร์แรกของชุด แบบแถบชุดใน LINE)
     popover ของ shadcn (DESIGN-SYSTEM §10.0 รายการที่ใช้) · กดสติ๊กเกอร์ = ส่งทันทีแล้วปิดแผง -->
<script>
    import Sticker from "@lucide/svelte/icons/sticker";
    import Star from "@lucide/svelte/icons/star";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { PACKS, TG_PACKS, stickerLabel, platformOf } from "./data.js";
    import PlatformIcon from "./ui/PlatformIcon.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import { S, sendSticker, openSettings } from "./store.svelte.js";

    let { c, disabled = false } = $props();
    let open = $state(false);
    let tab = $state("saved");
    const sets = $derived(S.stk.filter((x) => x.items && x.items.length));
    const empty = $derived(!S.fav.filter((k) => (k.startsWith("tg-") ? tg : !tg)).length && !sets.filter((x) => (x.items[0].startsWith("tg-") ? tg : !tg)).length);
    const packKeys = (p) => Array.from({ length: p[1] }, (_, i) => p[0] + "-" + i);
    // ลูกค้า Telegram ⇒ ชุดสติ๊กเกอร์ Telegram (สติ๊กเกอร์ LINE ส่งไป Telegram ไม่ได้) · เจ้าของงานขอ 15 ต.ค. 2026
    const tg = $derived(platformOf(c.merchant) === "telegram");
    const tgKeys = (p) => p.codes.map((x) => "tg-" + x);
    // บันทึกไว้แยกตามช่องทาง: คีย์ Telegram ขึ้นต้น "tg-"
    const mine = (k) => (k.startsWith("tg-") ? tg : !tg);
    const favMine = $derived(S.fav.filter(mine));
    const setsMine = $derived(sets.filter((x) => mine(x.items[0])));

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

{#snippet savedTab()}
    <Tabs.Content value="saved" class="flex flex-col gap-3">
        {#if empty}
            <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์ {tg ? "Telegram" : "LINE"} ที่บันทึกไว้</p>
            <Button variant="outline" size="sm" class="self-start" onclick={() => { open = false; openSettings("stk"); }}><SettingsIcon data-icon="inline-start" />ไปที่ชุดสติ๊กเกอร์</Button>
        {/if}
        {#if favMine.length}
            <section class="flex flex-col gap-1.5">
                {#snippet favTitle()}<Star class="text-warning size-3.5" fill="currentColor" aria-hidden="true" />สติ๊กเกอร์โปรด{/snippet}
                {@render heading(favTitle, favMine.length)}
                {@render tiles(favMine, "สติ๊กเกอร์โปรด")}
            </section>
        {/if}
        {#each setsMine as x, i (i)}
            <section class="flex flex-col gap-1.5">
                {#snippet setTitle()}{x.name}{/snippet}
                {@render heading(setTitle, x.items.length)}
                {@render tiles(x.items, x.name)}
            </section>
        {/each}
    </Tabs.Content>
{/snippet}

<Popover.Root bind:open {onOpenChange}>
    <Popover.Trigger
        {disabled}
        class={buttonVariants({ variant: "ghost", size: "icon" })}
        aria-label="ชุดสติ๊กเกอร์"
        title="ชุดสติ๊กเกอร์"
    >
        <Sticker />
    </Popover.Trigger>
    <Popover.Content align="start" side="top" class="w-md max-w-(--bits-popover-content-available-width) gap-3 p-3">
        <Popover.Header>
            <Popover.Title class="flex items-center gap-1.5">สติ๊กเกอร์ <PlatformIcon p={tg ? "telegram" : "line"} label class="text-muted-foreground text-xs font-normal" /></Popover.Title>
        </Popover.Header>
        {#if tg}
            <Tabs.Root bind:value={tab} class="gap-3">
                <Tabs.List class="w-full flex-wrap justify-start gap-1 group-data-horizontal/tabs:h-auto" aria-label="ชุดสติ๊กเกอร์ Telegram">
                    <Tabs.Trigger value="saved" class="size-11 flex-none p-1" aria-label="บันทึกไว้" title="บันทึกไว้"><Star class="text-warning size-6" fill="currentColor" aria-hidden="true" /></Tabs.Trigger>
                    {#each TG_PACKS as p (p.id)}
                        <Tabs.Trigger value={p.id} class="size-11 flex-none p-1" aria-label={p.name} title={p.name}>
                            <StickerImg k={"tg-" + p.codes[0]} class="size-8" />
                        </Tabs.Trigger>
                    {/each}
                </Tabs.List>
                <div class="max-h-80 overflow-y-auto">
                    {@render savedTab()}
                    {#each TG_PACKS as p (p.id)}
                        <Tabs.Content value={p.id} class="flex flex-col gap-1.5">
                            {#snippet tgTitle()}{p.name}{/snippet}
                            {@render heading(tgTitle, p.codes.length)}
                            {@render tiles(tgKeys(p), p.name)}
                        </Tabs.Content>
                    {/each}
                </div>
            </Tabs.Root>
        {:else}
        <Tabs.Root bind:value={tab} class="gap-3">
            <!-- แถบชุด: ★ บันทึกไว้ + รูปปกของทุกชุดในคลัง (ปุ่มสี่เหลี่ยมเท่ากัน 2 แถว) · ปุ่มใหญ่ขึ้น (รูป 32px · กดได้ 44px) ขึ้นบรรทัดใหม่แทนเลื่อนแนวนอน
                 (เจ้าของงานสั่ง 15 ต.ค. 2026 — แถบเดิมเล็กและต้องเลื่อน ใช้ยาก) -->
            <Tabs.List class="w-full flex-wrap justify-start gap-1 group-data-horizontal/tabs:h-auto" aria-label="ชุดสติ๊กเกอร์">
                <Tabs.Trigger value="saved" class="size-11 flex-none p-1" aria-label="บันทึกไว้" title="บันทึกไว้"><Star class="text-warning size-6" fill="currentColor" aria-hidden="true" /></Tabs.Trigger>
                {#each PACKS as p (p[0])}
                    <Tabs.Trigger value={"p" + p[0]} class="size-11 flex-none p-1" aria-label={"ชุด " + p[0]} title={"ชุด " + p[0]}>
                        <StickerImg k={p[0] + "-0"} class="size-8" />
                    </Tabs.Trigger>
                {/each}
            </Tabs.List>
            <div class="max-h-80 overflow-y-auto">
                {@render savedTab()}
                {#each PACKS as p (p[0])}
                    <Tabs.Content value={"p" + p[0]} class="flex flex-col gap-1.5">
                        {#snippet packTitle()}ชุด {p[0]}{/snippet}
                        {@render heading(packTitle, p[1])}
                        {@render tiles(packKeys(p), "ชุด " + p[0])}
                    </Tabs.Content>
                {/each}
            </div>
        </Tabs.Root>
        {/if}
    </Popover.Content>
</Popover.Root>
