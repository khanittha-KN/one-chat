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
    import { merch, tabOf, msgPreview } from "./data.js";
    import { st, visible, byRecent, counts, selectCase, toast } from "./store.svelte.js";
    import { kindOf, KINDS } from "./kinds.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";

    let { class: className = "" } = $props();
    const TABS = [["all", "All"], ["line", "Line"], ["payment", "Payment"]];
    const cnt = $derived(counts());
    const shown = $derived(visible().filter((c) => st.tab === "all" || tabOf(c) === st.tab).sort(byRecent));
</script>

<Card.Root id="colList" role="region" aria-label="การสนทนา" class={"bg-surface-chrome min-h-0 gap-0 rounded-none border-r py-0 shadow-none ring-0 " + className}>
    <!-- ช่องรายการแชทแบบเดียวกับเมนู Organization: เต็มสูง พื้นเดียวกับเมนูข้าง คั่นด้วยเส้นขวา (ไม่ใช่การ์ด) -->
    <Card.Header class="gap-2 border-b py-3">
        <Card.Title>การสนทนา</Card.Title>
        <Card.Action>
            <Button variant="ghost" size="icon-sm" aria-label="รีเฟรช" onclick={() => toast("รีเฟรชรายการแล้ว")}><RefreshCw /></Button>
        </Card.Action>
        <ToggleGroup.Root
            type="single"
            variant="outline"
            size="sm"
            class="col-span-full w-full *:flex-1"
            aria-label="กรองการสนทนา"
            bind:value={() => st.tab, (t) => t && (st.tab = t)}
        >
            {#each TABS as [t, label] (t)}
                <ToggleGroup.Item value={t}>
                    {label}<Badge variant="secondary" class="tabular-nums">{cnt[t]}</Badge>
                </ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
    </Card.Header>
    <div id="caseList" class="min-h-0 flex-1 overflow-y-auto">
        {#each shown as c (c.id)}
            {@const k = kindOf(c)}
            {@const last = c.msgs.length ? msgPreview(c.msgs[c.msgs.length - 1]) : ""}
            <Item.Root size="sm" class={"case aria-[current=true]:ring-brand rounded-none border-0 border-b border-l-4 py-2 ps-2.5 pe-3 text-left aria-[current=true]:ring-2 aria-[current=true]:ring-inset " + k.row}>
                {#snippet child({ props })}
                    <button
                        {...props}
                        type="button"
                        aria-current={c.id === st.cur ? "true" : undefined}
                        onclick={() => selectCase(c.id)}
                    >
                        <Item.Media><CustomerAvatar {c} /></Item.Media>
                        <Item.Content class="min-w-0 gap-0.5">
                            <Item.Title class="w-full">
                                <span class="r1 min-w-0 flex-1 truncate font-bold">{c.name}</span>
                                <span class="text-muted-foreground shrink-0 text-xs font-normal">{c.ago}</span>
                            </Item.Title>
                            <span class="flex flex-wrap items-center gap-1 py-0.5">
                                <Badge variant="outline" class="max-w-full" title={merch(c.merchant).name}><span class="truncate">{merch(c.merchant).name}</span></Badge>
                                {#if c.status === "waiting"}
                                    <Badge variant="secondary" data-tone="warning"
                                        ><Clock aria-hidden="true" />รอแอดมินรับเคส <span class="tabular-nums">({c.secs})</span></Badge
                                    >
                                {:else}
                                    <Badge variant="secondary"
                                        ><UserRound aria-hidden="true" />{c.admin} <span class="tabular-nums">({c.secs})</span></Badge
                                    >
                                {/if}
                                <Badge variant="secondary">{k.label}</Badge>
                            </span>
                            <!-- ข้อความล่าสุดอยู่ล่างสุดเหมือน .r3 ของต้นฉบับ -->
                            <Item.Description class="r3 line-clamp-1">{last}</Item.Description>
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
                        <Empty.Description>ลองติ๊ก Channel เพิ่ม หรือติ๊กแถว "ทั้งหมด" ที่แถบซ้ายเพื่อเลือกทุก Channel</Empty.Description>
                    {:else}
                        <Empty.Title>ยังไม่ได้เลือก Channel</Empty.Title>
                        <Empty.Description>ติ๊ก Channel, Agent หรือแถว "ทั้งหมด" ที่แถบซ้ายเพื่อแสดงแชท</Empty.Description>
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
