<!-- รายการแชท — การ์ด (DESIGN-SYSTEM §10.6) · แถวใช้สีประเภทของต้นฉบับ (พื้น + แถบซ้าย) + รูปโปรไฟล์ลูกค้า · ตัวกรองในการ์ดเป็น toggle-group (§10.4) · แถวเป็น Item ที่กดได้ทั้งแถว (§10.14)
     ประเภทเคส: สีของต้นฉบับ เหลือง/ส้ม/แดง/ขาว (พื้นแถว + แถบซ้าย 4px · เจ้าของงานสั่ง 12 ต.ค.) + คำกำกับในป้ายเสมอ -->
<script>
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import Clock from "@lucide/svelte/icons/clock";
    import UserRound from "@lucide/svelte/icons/user-round";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Inbox from "@lucide/svelte/icons/inbox";
    import ListFilter from "@lucide/svelte/icons/list-filter";
    import { merch, tabOf, msgPreview, DAY_SHORT, chatChannels } from "./data.js";
    import { st, visible, byRecent, counts, selectCase, toast } from "./store.svelte.js";
    import { kindOf, KINDS } from "./kinds.js";
    import GlobalSearch from "./panel/GlobalSearch.svelte";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import PlatformIcon from "./ui/PlatformIcon.svelte";

    let { class: className = "" } = $props();
    // ทั้งหมด · ทั่วไป (เรื่องทั่วไป) · การเงิน (ฝาก/ถอน) — เจ้าของงานเปลี่ยนชื่อ 15 ต.ค. 2026 (เดิม All / Line / Payment)
    const TABS = [["all", "ทั้งหมด"], ["line", "ทั่วไป"], ["payment", "การเงิน"]];
    const cnt = $derived(counts());
    const total = chatChannels().length;
    const shown = $derived(visible().filter((c) => st.tab === "all" || tabOf(c) === st.tab).sort(byRecent));
</script>

<Card.Root id="colList" role="region" aria-label="การสนทนา" class={"bg-surface-chrome min-h-0 gap-0 rounded-none border-r py-0 shadow-none ring-0 " + className}>
    <!-- ช่องรายการแชท: เต็มสูง พื้นเดียวกับแถบบน คั่นด้วยเส้นขวา (ไม่ใช่การ์ด) -->
    <Card.Header class="gap-2 border-b py-3">
        <!-- จุดเขียว = การเชื่อมต่อแบบเรียลไทม์ทำงานอยู่ (เว็บจริง 27 ต.ค. 2026) -->
        <Card.Title class="flex items-center gap-1.5">การสนทนา<span class="bg-success size-2 rounded-full" role="img" aria-label="การเชื่อมต่อแบบเรียลไทม์: เชื่อมต่อแล้ว" title="การเชื่อมต่อแบบเรียลไทม์: เชื่อมต่อแล้ว"></span></Card.Title>
        <Card.Action>
            <Button variant="ghost" size="icon-sm" aria-label="รีเฟรช" onclick={() => toast("รีเฟรชรายการแล้ว")}><RefreshCw /></Button>
        </Card.Action>
        <!-- เลือกแชทที่แสดง — ใต้หัว "การสนทนา" (เจ้าของงานสั่ง 15 ต.ค. 2026 · เดิมอยู่แถบบน) · เปิดแผงสไลด์จากซ้าย ติ๊ก Channel ที่ต้องการดูแชท -->
        <Button
            variant="outline"
            class="col-span-full w-full justify-start"
            aria-haspopup="dialog"
            aria-expanded={st.chanOpen}
            aria-label={"เลือกแชทที่แสดง — เลือกอยู่ " + st.sel.length + " จาก " + total + " Channel"}
            onclick={() => (st.chanOpen = true)}
        >
            <ListFilter data-icon="inline-start" /><span class="flex-1 text-start">เลือกแชทที่แสดง</span>
            <Badge variant="secondary" class="tabular-nums">{st.sel.length}/{total}</Badge>
        </Button>
        <!-- ค้นหาลูกค้า (ย้ายจากแผงลูกค้า — เจ้าของงานสั่ง 15 ต.ค. 2026) · เลือกผลแล้วข้อมูลขึ้นที่แผงลูกค้าโดยไม่เปิดแชท -->
        <div class="col-span-full"><GlobalSearch /></div>
        <ToggleGroup.Root
            type="single"
            variant="outline"
            size="sm"
            class="col-span-full w-full *:flex-auto *:gap-1 *:px-1 max-xl:*:text-xs"
            aria-label="กรองการสนทนา"
            bind:value={() => st.tab, (t) => t && (st.tab = t)}
        >
            {#each TABS as [t, label] (t)}
                <ToggleGroup.Item value={t}>
                    {label}
                </ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
    </Card.Header>
    <!-- relative: ข้อความ sr-only (position:absolute) ในแถวล่าง ๆ ต้องอยู่ในกล่องเลื่อนนี้ ไม่งั้นดันหน้าทั้งหน้าให้เลื่อนได้
         เส้นคั่นแถว foreground/15 ให้เห็นชัดบนพื้นสีเคสทุกสี ทั้งสองโหมด (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
    <!-- @container: รายการแคบ (tablet แนวตั้ง < 16rem) ป้าย "รอแอดมินรับเคส" ย่อเป็น "รอรับ" ไม่ให้ตัวเลขถูกตัด -->
    <div id="caseList" class="@container relative min-h-0 flex-1 overflow-x-hidden overflow-y-auto">
        {#each shown as c (c.id)}
            {@const k = kindOf(c)}
            {@const lastM = c.msgs.filter((m) => m.action !== "closed").at(-1)}
            {@const last = lastM ? msgPreview(lastM) : ""}
            <Item.Root size="sm" class={"case aria-[current=true]:ring-brand rounded-none border-0 border-b border-b-foreground/15 border-l-4 py-2 ps-2.5 pe-3 text-left aria-[current=true]:ring-2 aria-[current=true]:ring-inset " + k.row}>
                {#snippet child({ props })}
                    <button
                        {...props}
                        type="button"
                        aria-current={c.id === st.cur ? "true" : undefined}
                        onclick={() => selectCase(c.id)}
                    >
                        <Item.Media><CustomerAvatar {c} /></Item.Media>
                        <Item.Content class="min-w-0 gap-0.5">
                            <!-- วันเวลาชิดขวาเสมอ · รายการแคบ (tablet) ⇒ ลงบรรทัดใต้ชื่อแต่ยังชิดขวา ชื่อไม่ถูกตัดจนอ่านไม่ออก -->
                            <!-- line-clamp-none ทำให้ Item.Title เป็น block ⇒ จัดแถวด้วย span ด้านใน -->
                            <Item.Title class="line-clamp-none w-full">
                                <span class="flex w-full flex-wrap items-baseline gap-x-2">
                                <span class={"r1 min-w-0 flex-1 basis-24 truncate font-bold " + k.name}>{c.name}</span>
                                <span class="text-muted-foreground ms-auto shrink-0 text-xs font-normal whitespace-nowrap tabular-nums">{DAY_SHORT} - {c.msgs.length ? c.msgs[c.msgs.length - 1].t : ""}</span>
                                </span>
                            </Item.Title>
                            <span class="flex flex-wrap items-center gap-1 py-0.5">
                                <Badge variant="outline" class="max-w-full ps-1" title={merch(c.merchant).name}><PlatformIcon p={merch(c.merchant).platform} /><span class="truncate">{merch(c.merchant).name}</span></Badge>
                                {#if c.status === "waiting"}
                                    <Badge variant="secondary" data-tone="warning"
                                        ><Clock aria-hidden="true" /><span class="@max-3xs:hidden">รอแอดมินรับเคส</span><span class="hidden @max-3xs:inline">รอรับ</span> <span class="tabular-nums">({c.secs})</span></Badge
                                    >
                                {:else}
                                    <Badge variant="secondary" class="max-w-full"
                                        ><UserRound aria-hidden="true" /><span class="truncate">{c.admin}</span> <span class="tabular-nums">({c.secs})</span></Badge
                                    >
                                {/if}
                                <span class="sr-only">ประเภท {k.label}</span>
                            </span>
                            <!-- ข้อความล่าสุดอยู่ล่างสุดเหมือน .r3 ของต้นฉบับ -->
                            <span class="flex min-w-0 items-center gap-2">
                                <Item.Description class={"r3 line-clamp-1 flex-1 " + (c.unread ? "text-foreground font-bold" : "")}>{last}</Item.Description>
                                {#if c.unread}
                                    <Badge variant="destructive" class="h-5 min-w-5 rounded-full px-1.5 tabular-nums">{c.unread}<span class="sr-only"> ข้อความใหม่</span></Badge>
                                {/if}
                            </span>
                        </Item.Content>
                    </button>
                {/snippet}
            </Item.Root>
        {:else}
            <Empty.Root class="h-full">
                <Empty.Header>
                    <Empty.Media variant="icon"><Inbox /></Empty.Media>
                    {#if st.sel.length}
                        <Empty.Title>ไม่มีแชทในตัวกรองนี้</Empty.Title>
                        <Empty.Description>ลองติ๊ก Channel เพิ่ม หรือติ๊กแถว "ทั้งหมด" ในแผง "เลือกแชทที่แสดง" เพื่อเลือกทุก Channel</Empty.Description>
                    {:else}
                        <Empty.Title>ยังไม่ได้เลือก Channel</Empty.Title>
                        <Empty.Description>กดปุ่ม "เลือกแชทที่แสดง" ด้านบน แล้วติ๊ก Channel ที่ต้องการดูแชท</Empty.Description>
                    {/if}
                </Empty.Header>
            </Empty.Root>
        {/each}
    </div>
    <Card.Footer class="flex-wrap gap-x-3 gap-y-1 border-t py-2" aria-label="คำอธิบายประเภท">
        {#each KINDS as kd (kd.key)}
            <span class="text-muted-foreground inline-flex items-center gap-1.5 text-xs">
                <span class={"size-3 rounded-sm " + kd.swatch} aria-hidden="true"></span>{kd.legend}
            </span>
        {/each}
    </Card.Footer>
</Card.Root>
