<!-- แผงสติ๊กเกอร์ / อิโมจิในช่องพิมพ์ของห้องแชท — ตามเว็บจริง 27 ต.ค. 2026 (กว้าง 373px)
     LINE: ปุ่ม "ชุดสติ๊กเกอร์" · แท็บ ★ บันทึกไว้ (สติ๊กเกอร์โปรด + ชุดที่บันทึก) · แท็บของแต่ละชุดในคลัง (รูปปก) · แท็บอิโมจิ
     Telegram: ปุ่ม "อิโมจิ" · มีแค่แท็บอิโมจิ (ลูกค้า Telegram รับสติ๊กเกอร์ไม่ได้)
     กดสติ๊กเกอร์ = ส่งทันทีแล้วปิดแผง · กดอิโมจิ = ใส่ท้ายข้อความในช่องพิมพ์ (ยังไม่ส่ง) -->
<script>
    import Sticker from "@lucide/svelte/icons/sticker";
    import Smile from "@lucide/svelte/icons/smile";
    import Star from "@lucide/svelte/icons/star";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Popover from "$lib/components/ui/popover/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { PACKS, EMOJI, stickerLabel, stickerSrc, platformOf } from "./data.js";
    import PlatformIcon from "./ui/PlatformIcon.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import { st, sendSticker, openSettings, eff } from "./store.svelte.js";

    let { c } = $props();
    let open = $state(false);
    const tg = $derived(platformOf(c.merchant) === "telegram");
    let tab = $state("saved");
    const lineKey = (k) => !k.startsWith("tg-");
    // สติ๊กเกอร์โปรดและชุดสติ๊กเกอร์ของ Channel ที่แชทนี้ทักเข้ามา (Channel ตั้งเอง หรือใช้ของ Agent)
    const mine = $derived(eff(c.merchant));
    const favMine = $derived(mine.fav.filter(lineKey));
    const setsMine = $derived(mine.stk.filter((x) => x.items && x.items.length && lineKey(x.items[0])));
    const packKeys = (p) => Array.from({ length: p[1] }, (_, i) => p[0] + "-" + i);
    // เลข Sticker ID จาก URL รูป (ป้ายของปุ่มแบบเว็บจริง "ส่งสติ๊กเกอร์ 180")
    const sid = (k) => (stickerSrc(k).match(/sticker\/(\d+)\//) || [])[1] || stickerLabel(k);

    // เปิดแผงทุกครั้ง: LINE เริ่มที่ "บันทึกไว้" · Telegram มีแค่อิโมจิ
    function onOpenChange(o) {
        if (o) tab = tg ? "emoji" : "saved";
    }
    function send(k) {
        sendSticker(c, k);
        open = false;
    }
    function put(e) {
        st.draft = (st.draft || "") + e;
    }
</script>

{#snippet tiles(keys, label)}
    <div class="grid grid-cols-5 gap-1.5" role="group" aria-label={label}>
        {#each keys as k, i (i)}
            <Button variant="outline" class="aspect-square h-auto p-1" aria-label={"ส่งสติ๊กเกอร์ " + sid(k)} title={stickerLabel(k)} onclick={() => send(k)}>
                <StickerImg {k} class="size-full" />
            </Button>
        {/each}
    </div>
{/snippet}

{#snippet heading(text, count, unit = "รูป")}
    <span class="flex items-center gap-1.5 text-xs font-bold">{text}<span class="text-muted-foreground font-normal tabular-nums">· {count} {unit}</span></span>
{/snippet}

<Popover.Root bind:open {onOpenChange}>
    <Popover.Trigger class={buttonVariants({ variant: "ghost", size: "icon" })} aria-label={tg ? "อิโมจิ" : "ชุดสติ๊กเกอร์"} title={tg ? "อิโมจิ" : "ชุดสติ๊กเกอร์"}>
        {#if tg}<Smile />{:else}<Sticker />{/if}
    </Popover.Trigger>
    <Popover.Content align="start" side="top" class="w-93 max-w-(--bits-popover-content-available-width) gap-3 p-3">
        <Popover.Header>
            <Popover.Title class="flex items-center gap-1.5">{tg ? "อิโมจิ" : "สติ๊กเกอร์"} <PlatformIcon p={tg ? "telegram" : "line"} label class="text-muted-foreground text-xs font-normal" /></Popover.Title>
        </Popover.Header>
        <Tabs.Root bind:value={tab} class="gap-3">
            <Tabs.List class="w-full flex-wrap justify-start gap-1 group-data-horizontal/tabs:h-auto" aria-label={tg ? "อิโมจิ" : "ชุดสติ๊กเกอร์"}>
                {#if !tg}
                    <Tabs.Trigger value="saved" class="size-11 flex-none p-1" aria-label="บันทึกไว้" title="บันทึกไว้"><Star class="text-warning size-6" fill="currentColor" aria-hidden="true" /></Tabs.Trigger>
                    {#each PACKS as p (p[0])}
                        <Tabs.Trigger value={"p" + p[0]} class="size-11 flex-none p-1" aria-label={"ชุด " + p[0]} title={"ชุด " + p[0]}>
                            <StickerImg k={p[0] + "-0"} class="size-8" />
                        </Tabs.Trigger>
                    {/each}
                {/if}
                <Tabs.Trigger value="emoji" class="size-11 flex-none p-1" aria-label="อิโมจิ" title="อิโมจิ"><Smile class="size-6" aria-hidden="true" /></Tabs.Trigger>
            </Tabs.List>
            <div class="max-h-72 overflow-y-auto">
                {#if !tg}
                    <Tabs.Content value="saved" class="flex flex-col gap-3">
                        {#if !favMine.length && !setsMine.length}
                            <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์โปรดหรือชุดสติ๊กเกอร์ LINE ที่บันทึกไว้</p>
                            <Button variant="outline" size="sm" class="self-start" onclick={() => ((open = false), openSettings("stk"))}><SettingsIcon data-icon="inline-start" />ไปที่ชุดสติ๊กเกอร์</Button>
                        {/if}
                        {#if favMine.length}
                            <section class="flex flex-col gap-1.5">
                                {@render heading("★ สติ๊กเกอร์โปรด", favMine.length)}
                                {@render tiles(favMine, "สติ๊กเกอร์โปรด")}
                            </section>
                        {/if}
                        {#each setsMine as x, i (i)}
                            <section class="flex flex-col gap-1.5">
                                {@render heading(x.name, x.items.length)}
                                {@render tiles(x.items, x.name)}
                            </section>
                        {/each}
                    </Tabs.Content>
                    {#each PACKS as p (p[0])}
                        <Tabs.Content value={"p" + p[0]} class="flex flex-col gap-1.5">
                            {@render heading("ชุด " + p[0], p[1])}
                            {@render tiles(packKeys(p), "ชุด " + p[0])}
                        </Tabs.Content>
                    {/each}
                {/if}
                <!-- อิโมจิ: ทุกหมวดเรียงต่อกันในแท็บเดียว (เว็บจริง) -->
                <Tabs.Content value="emoji" class="flex flex-col gap-3">
                    {#each EMOJI as g (g.label)}
                        <section class="flex flex-col gap-1.5">
                            {@render heading(g.label, g.list.length, "ตัว")}
                            <div class="grid grid-cols-8 gap-0.5" role="group" aria-label={g.label}>
                                {#each g.list as e, i (i)}
                                    <Button variant="ghost" size="icon-sm" class="text-lg" aria-label={"ใส่อิโมจิ " + e} onclick={() => put(e)}>{e}</Button>
                                {/each}
                            </div>
                        </section>
                    {/each}
                </Tabs.Content>
            </div>
        </Tabs.Root>
    </Popover.Content>
</Popover.Root>
