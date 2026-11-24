<!-- ประวัติโน้ต (เจ้าของงานสั่ง 18 พ.ย. 2026) — ปุ่มในแผงลูกค้า กดแล้วเปิดหน้าต่าง
     กรองตามวันที่ (ตั้งแต่ / ถึง) · ตาราง: วันที่/เวลา · ยูสเซอร์ · โน้ต · เพิ่ม/ลบ · ทำรายการโดย (ชื่อแอดมิน) · หน้าละ 10 รายการ -->
<script>
    import NotebookPen from "@lucide/svelte/icons/notebook-pen";
    import ChevronLeft from "@lucide/svelte/icons/chevron-left";
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    let { c, look = "pill" } = $props(); // look = "row" ⇒ แถวในกลุ่มเมนูของแผงลูกค้า (ver2)
    const PER = 10;
    const items = $derived(c.noteLog || []);
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

{#snippet who()}<span class="text-muted-foreground text-xs whitespace-nowrap tabular-nums">{items.length ? items.length + " รายการ" : "ไม่มี"}</span>{/snippet}

<FoldCard {c} {look} title="ประวัติโน้ต" icon={NotebookPen} hint={items.length ? items.length + " รายการ" : "ไม่มี"} def={true} action={who} dialogClass="sm:max-w-2xl" contentClass="gap-3">
    <div class="grid grid-cols-2 gap-2 sm:max-w-sm" role="group" aria-label="กรองประวัติโน้ตตามวันที่">
        <Field.Field data-invalid={bad}>
            <Field.Label for="nhFrom" class="text-xs">ตั้งแต่</Field.Label>
            <Input id="nhFrom" type="date" bind:value={from} oninput={() => (page = 1)} />
        </Field.Field>
        <Field.Field data-invalid={bad}>
            <Field.Label for="nhTo" class="text-xs">ถึง</Field.Label>
            <Input id="nhTo" type="date" bind:value={to} aria-invalid={bad} oninput={() => (page = 1)} />
        </Field.Field>
    </div>
    {#if bad}<Field.Error>วันที่เริ่มต้องไม่เกินวันที่สิ้นสุด</Field.Error>{/if}
    {#if !items.length}
        <p class="text-muted-foreground text-sm">ยังไม่มีประวัติโน้ต</p>
    {:else if !list.length && !bad}
        <p class="text-muted-foreground text-sm">ไม่มีประวัติในช่วงวันที่นี้</p>
    {:else if shown.length}
        <!-- ตารางเลื่อนแนวนอนในกรอบของตัวเองเมื่อจอแคบ -->
        <div class="overflow-x-auto rounded-lg border">
            <Table.Root class="min-w-[36rem]">
                <Table.Header>
                    <Table.Row>
                        <Table.Head>วันที่/เวลา</Table.Head>
                        <Table.Head>ยูสเซอร์</Table.Head>
                        <Table.Head>โน้ต</Table.Head>
                        <Table.Head>เพิ่ม/ลบ</Table.Head>
                        <Table.Head>ทำรายการโดย</Table.Head>
                    </Table.Row>
                </Table.Header>
                <Table.Body>
                    {#each shown as x, i (x.at + x.act + i)}
                        <Table.Row>
                            <Table.Cell class="whitespace-nowrap tabular-nums">{x.at}</Table.Cell>
                            <Table.Cell>{x.user || "-"}</Table.Cell>
                            <Table.Cell class="max-w-64 whitespace-normal">{x.text}</Table.Cell>
                            <Table.Cell>{#if x.act === "add"}<Status tone="success" icon={null}>เพิ่ม</Status>{:else}<Status tone="destructive" icon={null}>ลบ</Status>{/if}</Table.Cell>
                            <Table.Cell>{x.by}</Table.Cell>
                        </Table.Row>
                    {/each}
                </Table.Body>
            </Table.Root>
        </div>
    {/if}
    {#if pages > 1}
        <nav class="flex flex-wrap items-center justify-center gap-1" aria-label="แบ่งหน้าประวัติโน้ต">
            <Button variant="ghost" size="icon-sm" aria-label="หน้าก่อน" disabled={cur === 1} onclick={() => (page = cur - 1)}><ChevronLeft /></Button>
            {#each Array.from({ length: pages }, (_, i) => i + 1) as n (n)}
                <Button variant={n === cur ? "outline" : "ghost"} size="icon-sm" class="tabular-nums" aria-label={"หน้า " + n} aria-current={n === cur ? "page" : undefined} onclick={() => (page = n)}>{n}</Button>
            {/each}
            <Button variant="ghost" size="icon-sm" aria-label="หน้าถัดไป" disabled={cur === pages} onclick={() => (page = cur + 1)}><ChevronRight /></Button>
        </nav>
    {/if}
</FoldCard>
