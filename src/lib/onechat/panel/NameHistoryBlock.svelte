<!-- ประวัติแก้ไขชื่อ (เจ้าของงานสั่ง 27 พ.ย. 2026) — ปุ่มในแผงลูกค้า กดแล้วเปิดหน้าต่าง
     ทุกครั้งที่แอดมินแก้ชื่อหรือ Username ของแชทที่หัวห้องแชท · กรองตามวันที่ (ตั้งแต่ / ถึง)
     ตาราง: วันที่/เวลา · ชื่อ · ยูสเซอร์ (ค่าหลังแก้ครั้งนั้น) · ผู้ทำรายการ · หน้าละ 10 รายการ -->
<script>
    import UserPen from "@lucide/svelte/icons/user-pen";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    let { c } = $props();
    const PER = 10;
    const items = $derived(c.nameLog || []);
    let from = $state("");
    let to = $state("");
    let page = $state(1);
    // "dd/mm/yy hh:mm" (พ.ศ. 2 หลัก) ⇒ "yyyy-mm-dd" (ค.ศ.) ให้เทียบกับช่องวันที่ได้
    const iso = (at) => {
        const [d, m, y] = at.split(" ")[0].split("/");
        return 2500 + Number(y) - 543 + "-" + m + "-" + d;
    };
    const bad = $derived(!!from && !!to && from > to);
    const list = $derived(bad ? [] : items.filter((x) => (!from || iso(x.at) >= from) && (!to || iso(x.at) <= to)));
    const pages = $derived(Math.max(1, Math.ceil(list.length / PER)));
    const cur = $derived(Math.min(page, pages));
    const shown = $derived(list.slice((cur - 1) * PER, cur * PER));
</script>

{#snippet count()}<span class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">{items.length ? items.length + " รายการ" : "ไม่มี"}</span>{/snippet}

<FoldCard {c} title="ประวัติแก้ไขชื่อ" icon={UserPen} hint={items.length ? items.length + " รายการ" : "ไม่มี"} def={true} action={count} dialogClass="sm:max-w-2xl" contentClass="gap-3">
    <div class="grid grid-cols-2 gap-2 sm:max-w-sm" role="group" aria-label="กรองประวัติแก้ไขชื่อตามวันที่">
        <Field.Field data-invalid={bad}>
            <Field.Label for="nmFrom" class="text-xs">ตั้งแต่</Field.Label>
            <Input id="nmFrom" type="date" bind:value={from} oninput={() => (page = 1)} />
        </Field.Field>
        <Field.Field data-invalid={bad}>
            <Field.Label for="nmTo" class="text-xs">ถึง</Field.Label>
            <Input id="nmTo" type="date" bind:value={to} aria-invalid={bad} oninput={() => (page = 1)} />
        </Field.Field>
    </div>
    {#if bad}<Field.Error>วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด</Field.Error>{/if}
    {#if !items.length}
        <p class="text-muted-foreground text-sm">ยังไม่มีการแก้ชื่อหรือ Username ของแชทนี้</p>
    {:else if !list.length && !bad}
        <p class="text-muted-foreground text-sm">ไม่มีประวัติในช่วงวันที่นี้</p>
    {:else if shown.length}
        <div class="overflow-x-auto rounded-lg border">
            <Table.Root class="min-w-[32rem]">
                <Table.Header>
                    <Table.Row>
                        <Table.Head>วันที่/เวลา</Table.Head>
                        <Table.Head>ชื่อ</Table.Head>
                        <Table.Head>ยูสเซอร์</Table.Head>
                        <Table.Head>ผู้ทำรายการ</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each shown as x, i (x.at + x.name + i)}
                        <Table.Row>
                            <Table.Cell class="whitespace-nowrap tabular-nums">{x.at}</Table.Cell>
                            <Table.Cell class="max-w-56 whitespace-normal">{x.name}</Table.Cell>
                            <Table.Cell class="tabular-nums">{x.user || "-"}</Table.Cell>
                            <Table.Cell>{x.by}</Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}
    {#if pages > 1}
        <nav class="flex flex-wrap items-center justify-center gap-1" aria-label="แบ่งหน้าประวัติแก้ไขชื่อ">
            <Button variant="ghost" size="icon-sm" aria-label="หน้าก่อน" disabled={cur === 1} onclick={() => (page = cur - 1)}><ChevronLeft /></Button>
            {#each Array.from({ length: pages }, (_, i) => i + 1) as n (n)}
                <Button variant={n === cur ? "outline" : "ghost"} size="icon-sm" class="tabular-nums" aria-label={"หน้า " + n} aria-current={n === cur ? "page" : undefined} onclick={() => (page = n)}>{n}</Button>
            {/each}
            <Button variant="ghost" size="icon-sm" aria-label="หน้าถัดไป" disabled={cur === pages} onclick={() => (page = cur + 1)}><ChevronRight /></Button>
        </nav>
    {/if}
</FoldCard>
