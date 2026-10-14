<!-- ตาราง datatable ในการ์ด (DESIGN-SYSTEM §10.11): หัวคอลัมน์ตัวเทา · ตารางชนขอบการ์ด · ปุ่มของแถวอยู่คอลัมน์สุดท้าย
     แถวเพิ่มอยู่บนสุดเหมือนต้นฉบับ · ปุ่มเพิ่มแถวเป็น primary พื้นอ่อน (§10.1) · บันทึก = ปุ่มหลัก (เขียว LINE) · ลบ = แดง (ของหาย) -->
<script>
    import Plus from "@lucide/svelte/icons/plus";
    import Save from "@lucide/svelte/icons/save";
    import Trash from "@lucide/svelte/icons/trash-2";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "./ui/Status.svelte";
    import { db, annAdd, annSave, annDel } from "./store.svelte.js";

    const types = ["แสดงทุกรายการ", "ส่วนเสริม"];
    const statuses = ["ใช้งาน", "ยกเลิก"];
    // สำเนาค่าที่แก้ได้ของแต่ละแถว — สร้างใหม่ทุกครั้งที่ตารางถูกวาดใหม่
    let add = $state({ sort: 1, type: "แสดงทุกรายการ", name: "", text: "", status: "ใช้งาน" });
    let rows = $state(db.announces.map((a) => ({ id: a.id, sort: a.sort, type: a.type, name: a.name, text: a.text, status: a.status, saved: a.status })));
</script>

{#snippet selects(r, idSuffix)}
    <Table.Cell>
        <NativeSelect aria-label={"Type" + idSuffix} bind:value={r.type}>
            {#each types as t (t)}<NativeSelectOption value={t}>{t}</NativeSelectOption>{/each}
        </NativeSelect>
    </Table.Cell>
{/snippet}

<Card.Root>
    <Card.Content>
        <Table.Root class="min-w-4xl">
            <Table.Header>
                <Table.Row>
                    <Table.Head>#</Table.Head><Table.Head>Sort</Table.Head><Table.Head>Type</Table.Head><Table.Head>Name</Table.Head>
                    <Table.Head class="min-w-64">Announce</Table.Head><Table.Head>สถานะ</Table.Head><Table.Head class="text-right">บันทึก</Table.Head>
                </Table.Row>
            </Table.Header>
            <Table.Body>
                <Table.Row class="add bg-muted/50 align-top">
                    <Table.Cell class="text-muted-foreground pt-4 font-bold">ADD</Table.Cell>
                    <Table.Cell><Input type="number" class="w-20 tabular-nums" aria-label="Sort" bind:value={add.sort} /></Table.Cell>
                    {@render selects(add, "")}
                    <Table.Cell><Input placeholder="NAME" aria-label="Name" bind:value={add.name} /></Table.Cell>
                    <Table.Cell class="whitespace-normal"><Textarea placeholder="ข้อความ" aria-label="Announce" bind:value={add.text} /></Table.Cell>
                    <Table.Cell>
                        <NativeSelect aria-label="สถานะ" bind:value={add.status}>
                            {#each statuses as t (t)}<NativeSelectOption value={t}>{t}</NativeSelectOption>{/each}
                        </NativeSelect>
                    </Table.Cell>
                    <Table.Cell class="text-right">
                        <Button size="sm" data-tone="primary" onclick={() => annAdd({ ...add, sort: String(add.sort) })}><Plus data-icon="inline-start" />Add</Button>
                    </Table.Cell>
                </Table.Row>
                {#each rows as r (r.id)}
                    <Table.Row class="align-top">
                        <Table.Cell class="pt-4 tabular-nums">
                            <span class="flex flex-col items-start gap-1">
                                {r.id}
                                {#if r.saved === "ยกเลิก"}<Status>ยกเลิก</Status>{/if}
                            </span>
                        </Table.Cell>
                        <Table.Cell><Input type="number" class="w-20 tabular-nums" aria-label={"Sort " + r.id} bind:value={r.sort} /></Table.Cell>
                        {@render selects(r, " " + r.id)}
                        <Table.Cell><Input aria-label={"Name " + r.id} bind:value={r.name} /></Table.Cell>
                        <Table.Cell class="whitespace-normal"><Textarea aria-label={"Announce " + r.id} bind:value={r.text} /></Table.Cell>
                        <Table.Cell>
                            <NativeSelect aria-label={"สถานะ " + r.id} bind:value={r.status}>
                                {#each statuses as t (t)}<NativeSelectOption value={t}>{t}</NativeSelectOption>{/each}
                            </NativeSelect>
                        </Table.Cell>
                        <Table.Cell>
                            <div class="acts flex flex-col items-stretch gap-2">
                                <Button size="sm" onclick={() => annSave(r.id, { ...r, sort: String(r.sort) })}
                                    ><Save data-icon="inline-start" />Save</Button
                                >
                                <Button size="sm" variant="destructive" onclick={() => annDel(r.id)}><Trash data-icon="inline-start" />Delete</Button>
                            </div>
                        </Table.Cell>
                    </Table.Row>
                {/each}
            </Table.Body>
        </Table.Root>
    </Card.Content>
</Card.Root>
