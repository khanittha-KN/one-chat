<!-- ประวัติฝาก/ถอน — ปุ่มในแผงลูกค้า กดแล้วเปิดหน้าต่างแสดงทุกรายการเลย ไม่ต้องกด "ดูทั้งหมด" อีกชั้น (เจ้าของงานสั่ง 15 ต.ค. 2026)
     แสดงเป็นตาราง + ตัวกรองช่องทาง แบงค์บอท / OneSlip / P2P / QR Payment / One 2 coin (เจ้าของงานสั่ง 19 พ.ย. 2026) · หน้าต่างกว้างขึ้นให้ตารางพอดี
     แท็บ ทั้งหมด / ฝาก / ถอน + จำนวน · หน้าละ 10 รายการ แบ่งหน้าด้านล่าง · เปลี่ยนแท็บ ⇒ กลับหน้า 1 -->
<script>
    import History from "@lucide/svelte/icons/history";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import X from "@lucide/svelte/icons/x";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import HistRows from "./HistRows.svelte";
    import { histAll, histSums, HIST_CH, chLabel } from "../data.js";
    import { st } from "../store.svelte.js";
    let { c, look = "pill" } = $props(); // look = "row" ⇒ แถวในกลุ่มเมนูของแผงลูกค้า (ver2)
    const PER = 10;
    const items = $derived(histAll(c));
    let tab = $state("all");
    let page = $state(1);
    /* ตัวกรอง (เจ้าของงานสั่ง 19 พ.ย. 2026 · แบบแถบตัวกรองมาตรฐาน) — ปุ่ม dropdown หน้าตาเดียวกันทั้งคู่ (ปุ่ม outline ของแอป)
       ยังไม่เลือก ⇒ ปุ่มขึ้นชื่อตัวกรอง · เลือกแล้ว ⇒ ปุ่มเหลือแค่ป้ายค่าที่เลือก (กรอบปุ่มคงเดิม ไม่เปลี่ยนเป็นเขียว) · ติ๊กได้หลายอัน · ไม่ติ๊ก = ทั้งหมด · มี "ล้างตัวกรอง" เมื่อกรองอยู่ */
    const WHO = [{ k: "admin", label: "แอดมิน" }, { k: "self", label: "ลูกค้า" }];
    let whos = $state([]);
    let chs = $state([]);
    const byWho = (x) => !whos.length || whos.includes(x.r.by ? "admin" : "self");
    const byCh = (x) => !chs.length || chs.includes(x.r.ch);
    const FILTERS = $derived([
        { id: "ch", label: "ระบบชำระเงิน", opts: HIST_CH, sel: chs, set: (v) => (chs = v) },
        { id: "who", label: "ผู้ทำรายการ", opts: WHO, sel: whos, set: (v) => (whos = v) },
    ]);
    const pick = (f, k, on) => (f.set(on ? [...f.sel, k] : f.sel.filter((x) => x !== k)), (page = 1));
    const anyFilter = $derived(chs.length > 0 || whos.length > 0);
    const clearAll = () => ((chs = []), (whos = []), (page = 1));
    // ปุ่ม "ดูประวัติฝาก" (หลังแจ้งฝาก Manual) ⇒ เปิดหน้าต่างที่แท็บนั้น ล้างตัวกรอง หน้า 1 (รายการใหม่อยู่บนสุด)
    let open = $state(false);
    $effect(() => {
        if (!st.histJump) return;
        tab = st.histJump;
        whos = [];
        chs = [];
        page = 1;
        st.histJump = null;
        open = true;
    });
    const list = $derived((tab === "all" ? items : items.filter((x) => x.k === tab)).filter(byWho).filter(byCh));
    const pages = $derived(Math.max(1, Math.ceil(list.length / PER)));
    const cur = $derived(Math.min(page, pages));
    const shown = $derived(list.slice((cur - 1) * PER, cur * PER));
    const tabs = $derived([
        ["all", "ทั้งหมด", items.length],
        ["dep", "ฝาก", items.filter((x) => x.k === "dep").length],
        ["wd", "ถอน", items.filter((x) => x.k === "wd").length],
    ]);
</script>

{#snippet count()}<span class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">{items.length ? items.length + " รายการ" : "ไม่มี"}</span>{/snippet}

<FoldCard {c} {look} bind:open title="ประวัติฝากถอน" icon={History} hint={items.length + " รายการ"} def={true} action={count} dialogClass="sm:max-w-5xl" contentClass="gap-3">
    {#if items.length}
        <ToggleGroup.Root
            type="single"
            variant="outline"
            class="w-full *:flex-1"
            aria-label="ประเภทรายการ"
            bind:value={() => tab, (k) => k && ((tab = k), (page = 1))}
        >
            {#each tabs as [k, label, n] (k)}
                <ToggleGroup.Item value={k}>{label}<Badge variant="secondary" class="tabular-nums">{n}</Badge></ToggleGroup.Item>
            {/each}
        </ToggleGroup.Root>
        <div class="flex flex-wrap items-center gap-2" role="group" aria-label="ตัวกรอง">
            {#each FILTERS as f (f.id)}
                <!-- กล่องตัวกรอง: ป้ายค่าที่เลือกแยกทีละค่า + × เอาค่านั้นออก · ปุ่ม ⌄ เปิดเมนู (ปุ่มซ้อนในปุ่มไม่ได้ ⇒ ป้ายอยู่นอกปุ่มเปิดเมนู)
                     ยังไม่เลือก ⇒ ชื่อตัวกรอง · เลือกครบ ⇒ ป้าย "ทั้งหมด" (× = ล้าง) · เจ้าของงานสั่ง 19 พ.ย. 2026 -->
                {@const picked = f.opts.filter((o) => f.sel.includes(o.k))}
                {@const all = picked.length === f.opts.length}
                <div class="bg-background dark:bg-input/30 flex min-h-8 flex-wrap items-center gap-1 rounded-md border ps-1 shadow-xs" role="group" aria-label={f.label}>
                    {#if all}
                        <Badge variant="secondary" class="bg-brand/10 text-brand h-6 gap-0.5 pe-0.5">ทั้งหมด<button type="button" class="hover:bg-brand/15 focus-visible:ring-ring/50 grid size-5 place-items-center rounded-full outline-none focus-visible:ring-2" aria-label={"ล้าง" + f.label + "ทั้งหมด"} onclick={() => (f.set([]), (page = 1))}><X class="size-3" aria-hidden="true" /></button></Badge>
                    {:else}
                        {#each picked as o (o.k)}
                            <Badge variant="secondary" class="bg-brand/10 text-brand h-6 gap-0.5 pe-0.5">{o.label}<button type="button" class="hover:bg-brand/15 focus-visible:ring-ring/50 grid size-5 place-items-center rounded-full outline-none focus-visible:ring-2" aria-label={"เอา " + o.label + " ออก"} onclick={() => pick(f, o.k, false)}><X class="size-3" aria-hidden="true" /></button></Badge>
                        {/each}
                    {/if}
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        class={"hover:bg-muted focus-visible:ring-ring/50 aria-expanded:bg-muted inline-flex h-8 items-center gap-1 rounded-md text-sm font-medium outline-none focus-visible:ring-[3px] " + (picked.length ? "px-1.5" : "-ms-1 px-2.5")}
                        aria-label={f.label + ": " + (picked.length && !all ? picked.map((o) => o.label).join(", ") : "ทั้งหมด") + " — เปิดตัวเลือก"}
                    >
                        {#if !picked.length}{f.label}{/if}
                        <ChevronDown class="text-muted-foreground size-4" aria-hidden="true" />
                    </DropdownMenu.Trigger>
                    <!-- ติ๊กได้หลายอัน เมนูไม่ปิดระหว่างติ๊ก -->
                    <DropdownMenu.Content align="start" class="w-48">
                        <DropdownMenu.Label class="text-muted-foreground text-xs font-normal">{f.label}</DropdownMenu.Label>
                        {#each f.opts as o (o.k)}
                            <DropdownMenu.CheckboxItem closeOnSelect={false} checked={f.sel.includes(o.k)} onCheckedChange={(on) => pick(f, o.k, on)}>{o.label}</DropdownMenu.CheckboxItem>
                        {/each}
                        {#if f.sel.length}
                            <DropdownMenu.Separator />
                            <DropdownMenu.Item onSelect={() => (f.set([]), (page = 1))}>ล้างที่เลือก</DropdownMenu.Item>
                        {/if}
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                </div>
            {/each}
            {#if anyFilter}<Button variant="ghost" size="sm" class="text-muted-foreground" onclick={clearAll}><X data-icon="inline-start" />ล้างตัวกรอง</Button>{/if}
        </div>
        <p class="text-muted-foreground text-xs tabular-nums">
            {#if list.length}รายการที่ {(cur - 1) * PER + 1}–{Math.min(cur * PER, list.length)} จาก {list.length} · {histSums(list)}{:else}ไม่มีรายการ{tab === "dep" ? "ฝาก" : tab === "wd" ? "ถอน" : ""}{whos.length === 1 ? (whos[0] === "admin" ? "ที่แอดมินทำ" : "ที่ลูกค้าทำ") : ""}{chs.length ? " ผ่าน " + chs.map(chLabel).join(", ") : ""}{/if}
        </p>
        {#if shown.length}<HistRows items={shown} />{/if}
        {#if pages > 1}
            <nav class="flex flex-wrap items-center justify-center gap-1" aria-label="แบ่งหน้าประวัติ">
                <Button variant="ghost" size="icon-sm" aria-label="หน้าก่อน" disabled={cur === 1} onclick={() => (page = cur - 1)}><ChevronLeft /></Button>
                {#each Array.from({ length: pages }, (_, i) => i + 1) as n (n)}
                    <Button
                        variant={n === cur ? "outline" : "ghost"}
                        size="icon-sm"
                        class="tabular-nums"
                        aria-label={"หน้า " + n}
                        aria-current={n === cur ? "page" : undefined}
                        onclick={() => (page = n)}>{n}</Button
                    >
                {/each}
                <Button variant="ghost" size="icon-sm" aria-label="หน้าถัดไป" disabled={cur === pages} onclick={() => (page = cur + 1)}><ChevronRight /></Button>
            </nav>
        {/if}
    {:else}
        <p class="text-muted-foreground text-sm">ยังไม่มีประวัติฝาก/ถอน</p>
    {/if}
</FoldCard>
