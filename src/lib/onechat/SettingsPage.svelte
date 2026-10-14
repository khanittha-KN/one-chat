<!-- หน้า Settings (Channel settings zone) — 7 แท็บในเมนูซ้าย + 4 หน้าที่ต้นฉบับมีโค้ดแต่ไม่มีแท็บ (flex · mgr · sk · pw)
     DESIGN-SYSTEM: หัวหน้า §9.3 · การ์ด §10.6 · ช่องกรอก field §10.3 · รายการ item §10.14 · ปุ่มมีไอคอนนำหน้า §10.1
     ปุ่มบันทึก/ยืนยัน = ปุ่มหลัก (เขียว LINE #06C755 · 14 ต.ค. 2026) · เพิ่มแถว = primary พื้นอ่อน · ลบ = แดง · แก้ไข/ยกเลิก = ขอบ -->
<script>
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import Plus from "@lucide/svelte/icons/plus";
    import Save from "@lucide/svelte/icons/save";
    import X from "@lucide/svelte/icons/x";
    import Pencil from "@lucide/svelte/icons/pencil";
    import Trash from "@lucide/svelte/icons/trash-2";
    import Star from "@lucide/svelte/icons/star";
    import Eye from "@lucide/svelte/icons/eye";
    import EyeOff from "@lucide/svelte/icons/eye-off";
    import Copy from "@lucide/svelte/icons/copy";
    import LinkIcon from "@lucide/svelte/icons/link";
    import Send from "@lucide/svelte/icons/send";
    import Megaphone from "@lucide/svelte/icons/megaphone";
    import GripVertical from "@lucide/svelte/icons/grip-vertical";
    import ChevronUp from "@lucide/svelte/icons/chevron-up";
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import OctagonX from "@lucide/svelte/icons/octagon-x";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import RotateCcw from "@lucide/svelte/icons/rotate-ccw";
    import Play from "@lucide/svelte/icons/play";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import * as Table from "$lib/components/ui/table/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import PageHeader from "./ui/PageHeader.svelte";
    import Status from "./ui/Status.svelte";
    import BankLogo from "./ui/BankLogo.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import StickerField from "./ui/StickerField.svelte";
    import ImageField from "./ui/ImageField.svelte";
    import PasswordInput from "./ui/PasswordInput.svelte";
    import { BANKS, PACKS, TYPE_LBL, GUIDE, SET_TABS, bankOf, stickerLabel } from "./data.js";
    import { S, showPage, setTab, settingsAct } from "./store.svelte.js";

    const act = (a, i, el) => () => settingsAct(a, i, el);
    const pk = $derived(PACKS.filter((p) => p[0] === S.pack)[0]);
    const amMode = $derived(S.f.amMode || "มีคำนี้");
    // สติ๊กเกอร์โปรดเลือกชุดจากคลังแยกจากแผงสร้างชุด (ไม่ปนกัน)
    let favPack = $state(null);
    const fpk = $derived(PACKS.filter((p) => p[0] === favPack)[0]);
    const editingName = $derived(S.ed.stk != null && S.stk[S.ed.stk] ? S.stk[S.ed.stk].name : "");
    // ลากจัดลำดับรายการ (คีย์ลัด · Broadcast)
    let armed = $state(null);
    let dragFrom = $state(null);
    let dragOver = $state(null);

    const HEAD = {
        flex: ["Flex Card → OA Manager", "เลือกการ์ดจาก OA Manager ให้ตรงกับ Flex Card ของ SmartLIFF เพื่อส่งผ่าน chat.line.biz (ไม่เสียโควต้า)"],
        mgr: ["Manager Session", "บันทึก session ของ manager.line.biz เพื่อให้ระบบสร้าง OA Manager Card อัตโนมัติได้"],
        stk: ["ชุดสติ๊กเกอร์", "จัดเก็บชุดสติ๊กเกอร์ LINE ไว้ส่งให้ลูกค้าจากหน้าแชทได้อย่างรวดเร็ว"],
        qr: ["คีย์ลัด", "สร้างคำตอบสำเร็จรูปเป็นชุดรายการ — ข้อความ (แทรกอิโมจิได้) สติ๊กเกอร์ และรูปภาพ ส่งเรียงตามลำดับในคลิกเดียว"],
        bc: ["Broadcast — ยิงข้อความหาผู้ติดตามทั้งหมด", "ข้อความจะถูกส่งหา <b>ทุกห้องแชทของ OA นี้</b> ตามลำดับ part ด้านล่าง — ตรวจให้ชัดก่อนส่ง เพราะยกเลิกคนที่ส่งไปแล้วไม่ได้"],
        am: ["ข้อความอัตโนมัติ", "เมื่อลูกค้าพิมพ์ข้อความที่มีคำค้นที่ตั้งไว้ ระบบจะตอบกลับอัตโนมัติด้วยข้อความที่กำหนด — กฎเหล่านี้ใช้กับไลน์เอเย่น (LINE OA) ของช่องนี้เท่านั้น"],
        ba: ["บัญชี", "จัดการบัญชีธนาคารของบริษัทไว้ส่งหรือแทรกให้ลูกค้าจากหน้าแชทได้ในคลิกเดียว"],
        tg: ["โพสต์ไป Telegram", "เขียนโพสต์ (รูป + ข้อความ + ปุ่มเมนู) เพื่อส่งไปยังช่อง Telegram ของเอเย่น"],
        sk: ["Secret Key", "คีย์สำหรับเชื่อมต่อ API ของช่องนี้"],
        pw: ["เปลี่ยนรหัสผ่าน", "เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบของบัญชีคุณ"],
        gd: ["คู่มือการใช้งาน", "ขั้นตอนการใช้งาน OneChat สำหรับทีมแอดมิน"],
    };
    const head = $derived(HEAD[S.tab] || HEAD.gd);
</script>

{#snippet smsg(k)}
    {#if S.msg[k]}
        {#if S.msg[k].ok}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4" aria-hidden="true" />{S.msg[k].t}</p>
        {:else}<p class="text-destructive flex items-center gap-1.5 text-sm" role="alert"><OctagonX class="size-4" aria-hidden="true" />{S.msg[k].t}</p>{/if}
    {/if}
{/snippet}

{#snippet itemRows(arr, key)}
    <!-- แถวเดียวแบบต้นฉบับ: ปุ่มจับลาก · ลำดับ · ประเภท · ช่องกรอก · ลบ
         ลาก: กดค้างที่ปุ่มจับแล้วลากทั้งแถว · คีย์บอร์ด: โฟกัสปุ่มจับแล้วกดลูกศรขึ้น/ลง -->
    <Item.Group class="gap-1.5" role="list">
        {#each arr as x, i (i)}
            <Item.Root
                variant="outline"
                size="sm"
                role="listitem"
                class={"irow items-center gap-2 py-1.5 ps-1 " + (dragOver === key + i ? "border-brand bg-brand/5" : "")}
                draggable={armed === key + i}
                ondragstart={(e) => {
                    dragFrom = i;
                    e.dataTransfer.effectAllowed = "move";
                }}
                ondragover={(e) => {
                    if (dragFrom == null) return;
                    e.preventDefault();
                    dragOver = key + i;
                }}
                ondrop={(e) => {
                    e.preventDefault();
                    if (dragFrom != null) settingsAct("mv-" + key, dragFrom, { to: i });
                    dragFrom = null;
                    dragOver = null;
                }}
                ondragend={() => {
                    dragFrom = null;
                    dragOver = null;
                    armed = null;
                }}
            >
                <Button
                    variant="ghost"
                    size="icon-sm"
                    class="text-muted-foreground cursor-grab active:cursor-grabbing"
                    aria-label={"ย้ายรายการ " + (i + 1) + " (ลาก หรือกดลูกศรขึ้น/ลง)"}
                    onpointerdown={() => (armed = key + i)}
                    onpointerup={() => (armed = null)}
                    onkeydown={(e) => {
                        if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                        e.preventDefault();
                        const to = i + (e.key === "ArrowUp" ? -1 : 1);
                        settingsAct("mv-" + key, i, { to });
                        requestAnimationFrame(() => document.querySelectorAll('[data-grip="' + key + '"]')[to]?.focus());
                    }}
                    data-grip={key}><GripVertical /></Button
                >
                <Badge variant="secondary" class="tabular-nums">{i + 1}</Badge>
                <span class="itype text-muted-foreground w-16 shrink-0 text-xs">{TYPE_LBL[x.t]}</span>
                <Item.Content class="min-w-0">
                    {#if x.t === "text"}
                        <Textarea class="min-h-9 py-1.5" rows="1" placeholder="ข้อความ" aria-label={"ข้อความ " + (i + 1)} bind:value={x.v} />
                    {:else if x.t === "sticker"}
                        <!-- เลือกจากรูป ไม่ต้องจำชื่อชุด / ID -->
                        <StickerField bind:value={x.v} label={"สติ๊กเกอร์ " + (i + 1)} />
                    {:else}
                        <ImageField item={x} label={"รูปภาพ " + (i + 1)} />
                    {/if}
                </Item.Content>
                <Button variant="ghost" size="icon-sm" aria-label={"ลบรายการ " + (i + 1)} onclick={act("rm-" + key, i)}><Trash /></Button>
            </Item.Root>
        {/each}
    </Item.Group>
{/snippet}

{#snippet addBtns(key, max, n)}
    <div class="flex flex-wrap items-center gap-2">
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "text" })}><Plus data-icon="inline-start" />ข้อความ</Button>
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "sticker" })}><Plus data-icon="inline-start" />สติ๊กเกอร์</Button>
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "image" })}><Plus data-icon="inline-start" />รูปภาพ</Button>
        <span class="text-muted-foreground ms-auto text-xs tabular-nums">{n}/{max}</span>
    </div>
{/snippet}

{#snippet listRow(title, desc, actions, media, editing = false)}
    <Item.Root variant="outline" size="sm" class={"lrow " + (editing ? "border-brand bg-brand/5" : "")}>
        {#if media}<Item.Media>{@render media()}</Item.Media>{/if}
        <Item.Content class="min-w-0">
            <Item.Title class="line-clamp-none">{@render title()}{#if editing}<Badge data-tone="primary">กำลังแก้ไข</Badge>{/if}</Item.Title>
            {@render desc()}
        </Item.Content>
        <Item.Actions class="flex-wrap gap-1.5">{@render actions()}</Item.Actions>
    </Item.Root>
{/snippet}

<!-- หัวการ์ดรายการ: ชื่อ + จำนวน · ปุ่มสร้างใหม่อยู่แถวเดียวกัน (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
{#snippet listHead(title, n, btnLabel, newAct)}
    <Card.Header>
        <Card.Title class="flex items-center gap-2">{title} <Badge variant="secondary" class="tabular-nums">{n}</Badge></Card.Title>
        <Card.Action>
            <!-- ปุ่มหลักของการ์ด = Button แบบ default (พื้น --primary #06C755 ตัวขาว ตามธีม LINE) -->
            <Button size="sm" onclick={act(newAct)}><Plus data-icon="inline-start" />{btnLabel}</Button>
        </Card.Action>
    </Card.Header>
{/snippet}

<!-- แผงฟอร์มสไลด์จากด้านขวา ใช้กับทุกหน้าที่สร้าง/แก้ไขรายการ — หัวแผงบอกชัดว่าสร้างใหม่หรือกำลังแก้อะไร · ปิดแผง = ยกเลิก -->
{#snippet formSheet(key, editing, newTitle, editTitle, desc, body, saveAct, newSave, editSave, cancelAct, SaveIcon = Save)}
    <Sheet.Root bind:open={() => S.sheet === key, (o) => { if (!o && S.sheet === key) settingsAct(cancelAct); }}>
        <Sheet.Content side="right" class="w-full gap-0 data-[side=right]:sm:max-w-xl">
            <Sheet.Header class="border-b">
                <Sheet.Title class="flex items-center gap-2">
                    {#if editing}<Pencil class="size-4" aria-hidden="true" />{editTitle}{:else}<Plus class="size-4" aria-hidden="true" />{newTitle}{/if}
                </Sheet.Title>
                <Sheet.Description>{desc}</Sheet.Description>
            </Sheet.Header>
            <div class="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-4">
                {@render body()}
                {@render smsg(key)}
            </div>
            <Sheet.Footer class="flex-row border-t">
                <Button class="flex-1" onclick={act(saveAct)}><SaveIcon data-icon="inline-start" />{editing ? editSave : newSave}</Button>
                <Button variant="outline" onclick={act(cancelAct)}>ยกเลิก</Button>
            </Sheet.Footer>
        </Sheet.Content>
    </Sheet.Root>
{/snippet}

<div id="settingsWrap" class="h-full overflow-y-auto">
    <div class="mx-auto grid w-full max-w-(--container-page) gap-3 px-3 pt-3 pb-8 lg:grid-cols-(--grid-settings) lg:items-start">
        <Card.Root size="sm" class="snav lg:sticky lg:top-0">
            <Card.Header>
                <Card.Title>Settings</Card.Title>
                <Card.Description>{S.ch ? "Agent: " + S.ch : "ตั้งค่ารวม"}</Card.Description>
            </Card.Header>
            <Card.Content class="gap-3">
                <Button variant="outline" size="sm" onclick={() => showPage("console")}><ArrowLeft data-icon="inline-start" />กลับไปแชท</Button>
                <nav aria-label="เมนูตั้งค่า" class="flex flex-wrap gap-1 lg:flex-col">
                    {#each SET_TABS as [k, Icon, label] (k)}
                        <Button
                            variant="ghost"
                            class={"stab h-10 justify-start " + (S.tab === k ? "bg-muted font-bold" : "")}
                            aria-current={S.tab === k ? "page" : undefined}
                            onclick={() => setTab(k)}><Icon data-icon="inline-start" aria-hidden="true" />{label}</Button
                        >
                    {/each}
                </nav>
            </Card.Content>
        </Card.Root>

        <section class="sbody flex min-w-0 flex-col gap-4">
            <PageHeader title={head[0]} description={head[1]} />

            {#if S.tab === "flex"}
                <Card.Root>
                    <Card.Content>
                        <Table.Root>
                            <Table.Header><Table.Row><Table.Head>Flex Card (SmartLIFF)</Table.Head><Table.Head>การ์ดใน OA Manager</Table.Head></Table.Row></Table.Header>
                            <Table.Body>
                                {#each S.flex as x, i (i)}
                                    <Table.Row>
                                        <Table.Cell>{x.n}</Table.Cell>
                                        <Table.Cell>
                                            <NativeSelect aria-label={"การ์ดของ " + x.n} bind:value={x.v}>
                                                <NativeSelectOption value="">— ยังไม่เลือก —</NativeSelectOption>
                                                {#each ["โปรโมชั่นสมาชิกใหม่", "แจ้งยอดฝากสำเร็จ", "แจ้งยอดถอนสำเร็จ"] as o (o)}<NativeSelectOption value={o}>{o}</NativeSelectOption>{/each}
                                            </NativeSelect>
                                        </Table.Cell>
                                    </Table.Row>
                                {/each}
                            </Table.Body>
                        </Table.Root>
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "mgr"}
                <Card.Root>
                    <Card.Header>
                        <Card.Title>Session</Card.Title>
                        <Card.Action><Status tone="success">พร้อมสำหรับ OA Manager Card</Status></Card.Action>
                    </Card.Header>
                    <Card.Content class="gap-4">
                        <Alert.Root data-tone="success">
                            <CircleCheck />
                            <Alert.Title>มี session อัตโนมัติจากผู้ช่วย</Alert.Title>
                            <Alert.Description>อัปเดตล่าสุด: 7/10/2569 14:01:18</Alert.Description>
                        </Alert.Root>
                        <p class="text-muted-foreground max-w-prose text-sm">ระบบดึง session จากผู้ช่วย (Assistant) ที่ผูกกับช่องนี้ให้อัตโนมัติ</p>
                        <Button variant="outline" size="sm" class="self-start" aria-expanded={S.mgrOpen} onclick={act("mgr-toggle")}>
                            {#if S.mgrOpen}<ChevronUp data-icon="inline-start" />{:else}<ChevronDown data-icon="inline-start" />{/if}กรอกเอง (ขั้นสูง)
                        </Button>
                        {#if S.mgrOpen}
                            <Field.Field>
                                <Field.Label for="mgrCk">Session / Cookie</Field.Label>
                                <Textarea id="mgrCk" placeholder="วาง cookie ที่นี่" bind:value={S.f.mgrCk} />
                            </Field.Field>
                            <Button class="self-start" onclick={act("mgr-save")}><Save data-icon="inline-start" />บันทึก session</Button>
                        {/if}
                        <Button variant="outline" class="self-start" onclick={act("mgr-test")}><Play data-icon="inline-start" />ทดสอบสร้างการ์ด</Button>
                        {@render smsg("mgr")}
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "stk"}
                <!-- แยก 2 เรื่องให้ชัด: สติ๊กเกอร์โปรด (ขึ้นก่อน) กับ ชุดสติ๊กเกอร์ · สร้าง/แก้ไขชุดในแผงด้านขวา -->
                <Card.Root>
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2"
                            ><Star class="text-warning size-4" fill="currentColor" aria-hidden="true" />สติ๊กเกอร์โปรด <Badge variant="secondary" class="tabular-nums">{S.fav.length}</Badge></Card.Title
                        >
                    </Card.Header>
                    <Card.Content class="gap-4">
                        {#if S.fav.length}
                            <div class="flex flex-wrap gap-2" role="list" aria-label="สติ๊กเกอร์โปรด">
                                {#each S.fav as k (k)}
                                    <div class="bg-card relative rounded-lg border p-1" role="listitem" title={stickerLabel(k)}>
                                        <StickerImg {k} class="size-16" />
                                        <Button variant="secondary" size="icon-xs" class="absolute -top-1.5 -right-1.5 size-5 rounded-full border" aria-label={"เอาออกจากโปรด " + stickerLabel(k)} onclick={act("stk-fav", 0, { k })}><X /></Button>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์โปรด — เลือกชุดจากคลังด้านล่างแล้วกดที่สติ๊กเกอร์</p>
                        {/if}
                        <section class="flex flex-col gap-2" aria-label="คลัง LINE สำหรับเลือกสติ๊กเกอร์โปรด">
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <span class="text-sm font-bold">คลัง LINE — กดที่สติ๊กเกอร์เพื่อติด/เอาดาวออก</span>
                                {#if fpk}
                                    {@const keys = Array.from({ length: fpk[1] }, (_, i) => fpk[0] + "-" + i)}
                                    {@const allOn = keys.every((k) => S.fav.indexOf(k) >= 0)}
                                    <Button variant="outline" size="sm" onclick={act("stk-fav-all", 0, { keys, on: !allOn })}
                                        ><Star data-icon="inline-start" fill={allOn ? "none" : "currentColor"} class={allOn ? "" : "text-warning"} />{allOn ? "เอาดาวออกทั้งชุด" : "ติดดาวทั้งชุด"} {fpk[0]}</Button
                                    >
                                {/if}
                            </div>
                            <div class="grid grid-cols-(--grid-packs) gap-2">
                                {#each PACKS as p (p[0])}
                                    <Toggle variant="outline" class="data-[state=on]:border-brand data-[state=on]:text-brand h-auto flex-col items-start gap-0 px-3 py-1.5" pressed={favPack === p[0]} onPressedChange={() => (favPack = favPack === p[0] ? null : p[0])}>
                                        <span class="font-bold">ชุด {p[0]}</span><span class="text-muted-foreground text-xs">{p[1]} รูป</span>
                                    </Toggle>
                                {/each}
                            </div>
                            {#if fpk}
                                <div class="grid grid-cols-(--grid-tiles) gap-1.5">
                                    {#each Array.from({ length: fpk[1] }) as _, i (i)}
                                        {@const k = fpk[0] + "-" + i}
                                        {@const fv = S.fav.indexOf(k) >= 0}
                                        <Toggle variant="outline" class="data-[state=on]:border-warning data-[state=on]:bg-warning/10 relative aspect-square h-auto w-full p-1" pressed={fv} onPressedChange={act("stk-fav", 0, { k })}
                                            aria-label={(fv ? "เอาดาวออก" : "ติดดาว") + " สติ๊กเกอร์ " + (i + 1)}>
                                            <StickerImg {k} class="size-full" />
                                            <Star class={"absolute top-1 right-1 size-3.5 " + (fv ? "text-warning" : "text-muted-foreground")} fill={fv ? "currentColor" : "none"} aria-hidden="true" />
                                        </Toggle>
                                    {/each}
                                </div>
                            {/if}
                        </section>
                    </Card.Content>
                </Card.Root>

                <Card.Root>
                    {@render listHead("ชุดสติ๊กเกอร์", S.stk.length, "สร้างชุดใหม่", "stk-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.stk as x, i (i)}
                                {@const editing = S.sheet === "stk" && S.ed.stk === i}
                                <Item.Root variant="outline" size="sm" class={"lrow " + (editing ? "border-brand bg-brand/5" : "")}>
                                    <Item.Content class="min-w-0">
                                        <Item.Title class="line-clamp-none">
                                            {x.name}
                                            {#if editing}<Badge data-tone="primary">กำลังแก้ไข</Badge>{/if}
                                        </Item.Title>
                                        <Item.Description>{x.n} รูป</Item.Description>
                                    </Item.Content>
                                    <Item.Actions class="flex-wrap gap-1.5">
                                        <Button variant="outline" size="sm" onclick={act("stk-edit", i)}><Pencil data-icon="inline-start" />แก้ไข</Button>
                                        <Button variant="destructive" size="sm" onclick={act("stk-del", i)}><Trash data-icon="inline-start" />ลบ</Button>
                                    </Item.Actions>
                                </Item.Root>
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีชุด — กด "สร้างชุดใหม่" เพื่อเริ่ม</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>

                {#snippet stkBody()}
                <Field.Field>
                    <Field.Label for="stkName">ชื่อชุด</Field.Label>
                    <Input id="stkName" autocomplete="off" bind:value={S.f.stkName} />
                </Field.Field>
                <section class="flex flex-col gap-2" aria-label="เลือกจากคลัง LINE">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-sm font-bold">เลือกจากคลัง LINE</span>
                        {#if pk}
                            {@const keys = Array.from({ length: pk[1] }, (_, i) => pk[0] + "-" + i)}
                            {@const allOn = keys.every((k) => S.picked.indexOf(k) >= 0)}
                            <Button variant="outline" size="sm" onclick={act("stk-pick-all", 0, { keys, on: !allOn })}>{allOn ? "ยกเลิกทั้งชุด" : "เลือกทั้งชุด"} {pk[0]}</Button>
                        {/if}
                    </div>
                    <div class="packs grid grid-cols-(--grid-packs) gap-2">
                        {#each PACKS as p (p[0])}
                            <Toggle variant="outline" class="pack data-[state=on]:border-brand data-[state=on]:text-brand h-auto flex-col items-start gap-0 px-3 py-1.5" pressed={S.pack === p[0]} onPressedChange={act("stk-pack", p[0])}>
                                <span class="font-bold">ชุด {p[0]}</span><span class="text-muted-foreground text-xs">{p[1]} รูป</span>
                            </Toggle>
                        {/each}
                    </div>
                    {#if pk}
                        <div class="tiles grid grid-cols-(--grid-tiles) gap-1.5">
                            {#each Array.from({ length: pk[1] }) as _, i (i)}
                                {@const k = pk[0] + "-" + i}
                                <Toggle variant="outline" class="tile data-[state=on]:border-brand data-[state=on]:bg-brand/10 aspect-square h-auto w-full p-1" pressed={S.picked.indexOf(k) >= 0} onPressedChange={act("stk-pick", 0, { k })}
                                    aria-label={"เลือกสติ๊กเกอร์ " + (i + 1)}><StickerImg {k} class="size-full" /></Toggle>
                            {/each}
                        </div>
                    {/if}
                </section>
                <Field.Field>
                    <Field.Label for="stkId">เพิ่มด้วย ID (สำหรับสติ๊กเกอร์นอกคลัง)</Field.Label>
                    <div class="flex gap-2">
                        <Input id="stkId" class="min-w-0 flex-1 tabular-nums" inputmode="numeric" placeholder="Sticker ID" bind:value={S.f.stkId} />
                        <Button data-tone="primary" class="shrink-0" onclick={act("stk-addid")}><Plus data-icon="inline-start" />เพิ่ม</Button>
                    </div>
                </Field.Field>
                <section class="flex flex-col gap-2" aria-label="สติ๊กเกอร์ในชุด">
                    <div class="flex items-center gap-2 text-sm font-bold">สติ๊กเกอร์ในชุด <Badge variant="secondary" class="tabular-nums">เลือกแล้ว {S.picked.length}</Badge></div>
                    {#if S.picked.length}
                        <div class="flex flex-wrap gap-2">
                            {#each S.picked as k (k)}
                                <div class="bg-card relative rounded-lg border p-1" title={stickerLabel(k)}>
                                    <StickerImg {k} class="size-14" />
                                    <Button variant="secondary" size="icon-xs" class="absolute -top-1.5 -right-1.5 size-5 rounded-full border" aria-label={"เอาออกจากชุด " + stickerLabel(k)} onclick={act("stk-pick", 0, { k })}><X /></Button>
                                </div>
                            {/each}
                        </div>
                    {:else}
                        <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์ในชุดนี้ — เลือกจากคลังด้านบน</p>
                    {/if}
                </section>
                {/snippet}
                {@render formSheet("stk", S.ed.stk != null, "สร้างชุดสติ๊กเกอร์ใหม่", "แก้ไขชุด: " + editingName,
                    "ตั้งชื่อชุด แล้วเลือกสติ๊กเกอร์จากคลังหรือเพิ่มด้วย ID",
                    stkBody, "stk-save", "สร้างชุด", "บันทึกการแก้ไข", "stk-cancel")}
            {:else if S.tab === "qr"}
                <Card.Root>
                    {@render listHead("คีย์ลัดทั้งหมด", S.qr.length, "สร้างคีย์ลัดใหม่", "qr-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.qr as x, i (i)}
                                {#snippet t()}{x.name}{/snippet}
                                {#snippet d()}<Item.Description>{x.items.length} รายการ</Item.Description>{/snippet}
                                {#snippet a()}
                                    <Button variant="outline" size="sm" onclick={act("qr-edit", i)}><Pencil data-icon="inline-start" />แก้ไข</Button>
                                    <Button variant="destructive" size="sm" onclick={act("qr-del", i)}><Trash data-icon="inline-start" />ลบ</Button>
                                {/snippet}
                                {@render listRow(t, d, a, null, S.sheet === "qr" && S.ed.qr === i)}
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีคีย์ลัด — กด "สร้างคีย์ลัดใหม่"</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
                {#snippet qrBody()}
                <Field.Field>
                    <Field.Label for="qrName">ชื่อคีย์ลัด</Field.Label>
                    <Input id="qrName" autocomplete="off" bind:value={S.f.qrName} />
                </Field.Field>
                <section class="flex flex-col gap-2" aria-label="รายการ">
                    <span class="flex items-center gap-1 text-sm font-bold">รายการ (ลากที่ <GripVertical class="size-4" aria-label="ปุ่มจับ" /> หน้าแต่ละแถวเพื่อจัดลำดับ)</span>
                    {#if S.qrDraft.length}
                        {@render itemRows(S.qrDraft, "qr")}
                    {:else}
                        <p class="text-muted-foreground text-sm">ยังไม่มีรายการ — กดปุ่มด้านล่างเพื่อเพิ่ม</p>
                    {/if}
                    {@render addBtns("qr", 10, S.qrDraft.length)}
                </section>
                <section class="prev flex flex-col gap-2 border-t pt-3" aria-label="ตัวอย่างในแชท">
                    <span class="flex items-center gap-2 text-sm font-bold"><Eye class="size-4" aria-hidden="true" />ตัวอย่างในแชท</span>
                    {#if S.qrDraft.length}
                        <!-- พื้นเดียวกับห้องแชท (ท้องฟ้าแบบ LINE ในโหมดสว่าง) -->
                        <div class="bg-chat-bg flex flex-col items-end gap-2 rounded-lg bg-(image:--chat-wallpaper) bg-cover bg-center p-3">
                            {#each S.qrDraft as x, i (i)}
                                {#if x.t === "sticker" && x.v}
                                    <StickerImg k={x.v} class="size-20" />
                                {:else if x.t === "image" && x.src}
                                    <img src={x.src} alt={"รูป " + x.v} class="max-h-40 max-w-40 rounded-lg object-cover" />
                                {:else}
                                    <div class="bub bg-brand text-brand-foreground max-w-5/6 rounded-lg px-3 py-2 text-sm whitespace-pre-wrap">{x.t === "text" ? x.v || "…" : "[" + TYPE_LBL[x.t] + "] ยังไม่ได้เลือก"}</div>
                                {/if}
                            {/each}
                        </div>
                        <small class="text-muted-foreground text-xs">ลูกค้าจะได้รับเรียงตามลำดับนี้</small>
                    {:else}
                        <p class="text-muted-foreground text-sm">เพิ่มรายการเพื่อดูตัวอย่างการส่ง</p>
                    {/if}
                </section>
                {/snippet}
                {@render formSheet("qr", S.ed.qr != null, "สร้างคีย์ลัดใหม่", "แก้ไขคีย์ลัด: " + (S.ed.qr != null ? S.qr[S.ed.qr]?.name : ""),
                    "ตั้งชื่อ แล้วเพิ่มรายการ ข้อความ / สติ๊กเกอร์ / รูปภาพ — ลูกค้าได้รับเรียงตามลำดับ", qrBody, "qr-save", "บันทึกคีย์ลัด", "บันทึกการแก้ไข", "qr-cancel")}
            {:else if S.tab === "bc"}
                <Card.Root>
                    <Card.Header><Card.Title>ข้อความที่จะส่ง</Card.Title><Card.Description>{S.bc.length} part</Card.Description></Card.Header>
                    <Card.Content class="gap-4">
                        {@render itemRows(S.bc, "bc")}
                        {@render addBtns("bc", 10, S.bc.length)}
                        {#if S.bcAsk}
                            <Alert.Root data-tone="warning">
                                <TriangleAlert />
                                <Alert.Title>ยืนยันส่ง {S.bc.length} part ถึงทุกห้องแชทของช่องนี้?</Alert.Title>
                                <Alert.Description>ยกเลิกคนที่ส่งไปแล้วไม่ได้</Alert.Description>
                            </Alert.Root>
                            <div class="flex flex-wrap gap-2">
                                <Button onclick={act("bc-yes")}><Send data-icon="inline-start" />ยืนยันส่ง</Button>
                                <Button variant="outline" onclick={act("bc-no")}><X data-icon="inline-start" />ยกเลิก</Button>
                            </div>
                        {:else}
                            <Button class="self-start" onclick={act("bc-send")}><Megaphone data-icon="inline-start" />ส่ง Broadcast</Button>
                        {/if}
                        {@render smsg("bc")}
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "am"}
                <Card.Root>
                    {@render listHead("กฎทั้งหมด", S.am.length, "สร้างกฎใหม่", "am-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.am as x, i (i)}
                                {#snippet t()}{x.name} <Badge variant="outline" class="ms-1">{x.mode}</Badge>{/snippet}
                                {#snippet d()}
                                    <Item.Description class="line-clamp-none">คำค้น: {x.kw.replace(/\n/g, ", ")}</Item.Description>
                                    <Item.Description class="line-clamp-none">ตอบ: {x.reply}</Item.Description>
                                {/snippet}
                                {#snippet a()}
                                    <label class="flex min-h-8 items-center gap-2 pe-1 text-sm">
                                        <Switch checked={x.on} onCheckedChange={act("am-tog", i)} aria-label={"เปิดใช้งานกฎ " + x.name} />{x.on ? "เปิด" : "ปิด"}
                                    </label>
                                    <Button variant="outline" size="sm" onclick={act("am-edit", i)}><Pencil data-icon="inline-start" />แก้ไข</Button>
                                    <Button variant="destructive" size="sm" onclick={act("am-del", i)}><Trash data-icon="inline-start" />ลบ</Button>
                                {/snippet}
                                {@render listRow(t, d, a, null, S.sheet === "am" && S.ed.am === i)}
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีกฎ — กด "สร้างกฎใหม่"</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
                {#snippet amBody()}
                <Field.Group class="gap-4">
                    <Field.Field>
                        <Field.Label for="amName">ชื่อกฎ</Field.Label>
                        <Input id="amName" autocomplete="off" bind:value={S.f.amName} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="amKw">คำค้น (หนึ่งคำต่อบรรทัด หรือคั่นด้วยจุลภาค)</Field.Label>
                        <Textarea id="amKw" bind:value={S.f.amKw} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="amMode">ประเภทการจับคู่</Field.Label>
                        <NativeSelect id="amMode" class="w-full" bind:value={() => amMode, (v) => (S.f.amMode = v)} aria-describedby="amModeHint">
                            {#each ["มีคำนี้", "ตรงทั้งข้อความ"] as o (o)}<NativeSelectOption value={o}>{o}</NativeSelectOption>{/each}
                        </NativeSelect>
                        <Field.Description id="amModeHint">{amMode === "มีคำนี้" ? "ข้อความลูกค้ามีคำค้นอยู่ที่ใดก็ได้" : "ข้อความลูกค้าต้องตรงกับคำค้นทั้งข้อความ"}</Field.Description>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="amReply">ข้อความตอบกลับ</Field.Label>
                        <Textarea id="amReply" bind:value={S.f.amReply} />
                    </Field.Field>
                    <Field.Field orientation="horizontal">
                        <Checkbox id="amOn" checked={S.f.amOn !== false} onCheckedChange={(v) => (S.f.amOn = v)} />
                        <Field.Label for="amOn" class="font-normal">เปิดใช้งานกฎนี้</Field.Label>
                    </Field.Field>
                </Field.Group>
                {/snippet}
                {@render formSheet("am", S.ed.am != null, "สร้างกฎใหม่", "แก้ไขกฎ: " + (S.ed.am != null ? S.am[S.ed.am]?.name : ""),
                    "เมื่อลูกค้าพิมพ์ข้อความที่ตรงคำค้น ระบบจะตอบกลับด้วยข้อความที่กำหนด", amBody, "am-save", "บันทึกกฎ", "บันทึกการแก้ไข", "am-cancel")}
            {:else if S.tab === "ba"}
                <Card.Root>
                    {@render listHead("บัญชีทั้งหมด", S.ba.length, "เพิ่มบัญชีใหม่", "ba-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.ba as x, i (i)}
                                {#snippet t()}{bankOf(x.bank).name}{/snippet}
                                {#snippet d()}<Item.Description class="tabular-nums">{x.no}</Item.Description><Item.Description>{x.name}</Item.Description>{/snippet}
                                {#snippet m()}<BankLogo code={x.bank} />{/snippet}
                                {#snippet a()}
                                    <Button variant="outline" size="sm" onclick={act("ba-edit", i)}><Pencil data-icon="inline-start" />แก้ไข</Button>
                                    <Button variant="destructive" size="sm" onclick={act("ba-del", i)}><Trash data-icon="inline-start" />ลบ</Button>
                                {/snippet}
                                {@render listRow(t, d, a, m, S.sheet === "ba" && S.ed.ba === i)}
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีบัญชี</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
                {#snippet baBody()}
                <Field.Group class="gap-4">
                    <Field.Field>
                        <Field.Label for="baBank">ธนาคาร</Field.Label>
                        <NativeSelect id="baBank" class="w-full" bind:value={() => S.f.baBank || "", (v) => (S.f.baBank = v)}>
                            <NativeSelectOption value="">เลือกธนาคาร</NativeSelectOption>
                            {#each BANKS as b (b.code)}<NativeSelectOption value={b.code}>{b.name}</NativeSelectOption>{/each}
                        </NativeSelect>
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="baNo">เลขบัญชี</Field.Label>
                        <Input id="baNo" class="tabular-nums" inputmode="numeric" autocomplete="off" bind:value={S.f.baNo} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="baName">ชื่อบัญชี</Field.Label>
                        <Input id="baName" autocomplete="off" bind:value={S.f.baName} />
                    </Field.Field>
                </Field.Group>
                {/snippet}
                {@render formSheet("ba", S.ed.ba != null, "เพิ่มบัญชีใหม่", "แก้ไขบัญชี: " + (S.ed.ba != null && S.ba[S.ed.ba] ? bankOf(S.ba[S.ed.ba].bank).name + " " + S.ba[S.ed.ba].no : ""),
                    "บัญชีธนาคารของบริษัท ไว้ส่งให้ลูกค้าจากหน้าแชท", baBody, "ba-save", "บันทึกบัญชี", "บันทึกการแก้ไข", "ba-cancel")}
            {:else if S.tab === "tg"}
                <Card.Root>
                    {@render listHead("ข้อมูลที่โพสต์", S.tgPosts.length, "เขียนโพสต์", "tg-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.tgPosts as p, i (i)}
                                <Item.Root variant="outline" size="sm" class="lrow">
                                    <Item.Content class="min-w-0">
                                        <Item.Title class="line-clamp-none">{p.text}</Item.Title>
                                        <Item.Description>{p.btns} ปุ่ม · {p.time}</Item.Description>
                                    </Item.Content>
                                </Item.Root>
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีโพสต์</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
                {#snippet tgBody()}
                <Field.Field>
                    <Field.Label>รูปภาพ</Field.Label>
                    <ImageField item={S.tgImg} />
                </Field.Field>
                <Field.Field>
                    <Field.Label for="tgText">ข้อความ</Field.Label>
                    <Textarea id="tgText" bind:value={S.f.tgText} />
                </Field.Field>
                <section class="flex flex-col gap-2" aria-label="ปุ่มเมนู (ลิงก์)">
                    <span class="text-sm font-bold">ปุ่มเมนู (ลิงก์)</span>
                    {#each S.tgBtns as b, i (i)}
                        <div class="irow flex items-start gap-2">
                            <Input class="min-w-0 flex-1" placeholder="ชื่อปุ่ม" aria-label={"ชื่อปุ่ม " + (i + 1)} bind:value={b.l} />
                            <Input class="min-w-0 flex-1" placeholder="https://" aria-label={"ลิงก์ปุ่ม " + (i + 1)} bind:value={b.u} />
                            <Button variant="ghost" size="icon" aria-label={"ลบปุ่ม " + (i + 1)} onclick={act("tg-rm", i)}><Trash /></Button>
                        </div>
                    {:else}
                        <p class="text-muted-foreground text-sm">ยังไม่มีปุ่มเมนู</p>
                    {/each}
                    <div class="flex flex-wrap items-center gap-2">
                        <Button size="sm" data-tone="primary" disabled={S.tgBtns.length >= 8} onclick={act("tg-add")}><Plus data-icon="inline-start" />เพิ่มปุ่มเมนู</Button>
                        <span class="text-muted-foreground text-xs tabular-nums">สูงสุด 8 ปุ่ม ({S.tgBtns.length}/8)</span>
                    </div>
                </section>
                {/snippet}
                {@render formSheet("tg", false, "เขียนโพสต์ใหม่", "", "รูป + ข้อความ + ปุ่มเมนู ส่งไปยังช่อง Telegram ของเอเย่น", tgBody, "tg-post", "โพสต์ไป Telegram", "", "tg-cancel", Send)}
            {:else if S.tab === "sk"}
                <Card.Root>
                    <Card.Content class="gap-4">
                        <Field.Field>
                            <Field.Label for="skVal">Secret Key</Field.Label>
                            <InputGroup.Root>
                                <InputGroup.Input id="skVal" readonly class="tabular-nums" value={S.skShow ? S.skKey : "sk_live_" + "•".repeat(S.skKey.length - 8)} />
                                <InputGroup.Addon align="inline-end">
                                    <InputGroup.Button size="xs" onclick={act("sk-show")}>{#if S.skShow}<EyeOff />ซ่อน{:else}<Eye />แสดง{/if}</InputGroup.Button>
                                    <InputGroup.Button size="xs" onclick={act("sk-copy")}><Copy />คัดลอก</InputGroup.Button>
                                </InputGroup.Addon>
                            </InputGroup.Root>
                        </Field.Field>
                        <Button variant="destructive" size="sm" class="self-start" onclick={act("sk-new")}><RotateCcw data-icon="inline-start" />สร้างคีย์ใหม่</Button>
                        {@render smsg("sk")}
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "pw"}
                <Card.Root>
                    <Card.Content class="gap-5">
                        <Field.Group class="gap-5">
                            <Field.Field>
                                <Field.Label for="pwCur">รหัสผ่านปัจจุบัน</Field.Label>
                                <PasswordInput id="pwCur" autocomplete="off" bind:value={S.f.pwCur} />
                            </Field.Field>
                            <Field.Field>
                                <Field.Label for="pwN1">รหัสผ่านใหม่</Field.Label>
                                <PasswordInput id="pwN1" bind:value={S.f.pwN1} aria-describedby="pwHint" />
                                <Field.Description id="pwHint">แนะนำ: ความยาว 8 ตัวขึ้นไป ผสมตัวพิมพ์เล็ก-ใหญ่ ตัวเลข และอักขระพิเศษ</Field.Description>
                            </Field.Field>
                            <Field.Field>
                                <Field.Label for="pwN2">ยืนยันรหัสผ่านใหม่</Field.Label>
                                <PasswordInput id="pwN2" bind:value={S.f.pwN2} />
                            </Field.Field>
                        </Field.Group>
                        <Button class="self-start" onclick={act("pw-save")}><Save data-icon="inline-start" />บันทึกรหัสผ่านใหม่</Button>
                        {@render smsg("pw")}
                    </Card.Content>
                </Card.Root>
            {:else}
                {#each GUIDE as [GIcon, gTitle, gSteps] (gTitle)}
                    <Card.Root>
                        <Card.Header>
                            <Card.Title class="flex items-center gap-2"><GIcon class="text-brand size-4" aria-hidden="true" />{gTitle}</Card.Title>
                            <Card.Action>
                                <Button variant="outline" size="sm" onclick={act("gd-copy")}><LinkIcon data-icon="inline-start" />คัดลอกลิงก์<span class="sr-only"> {gTitle}</span></Button>
                            </Card.Action>
                        </Card.Header>
                        <Card.Content>
                            <ol class="steps flex max-w-prose list-decimal flex-col gap-1.5 ps-5 text-sm">
                                {#each gSteps as s (s)}<li>{s}</li>{/each}
                            </ol>
                        </Card.Content>
                    </Card.Root>
                {/each}
            {/if}
        </section>
    </div>
</div>
