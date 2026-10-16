<!-- หน้า Settings (Channel settings zone) — 7 แท็บในเมนูซ้าย + 4 หน้าที่ต้นฉบับมีโค้ดแต่ไม่มีแท็บ (flex · mgr · sk · pw)
     DESIGN-SYSTEM: หัวหน้า §9.3 · การ์ด §10.6 · ช่องกรอก field §10.3 · รายการ item §10.14 · ปุ่มมีไอคอนนำหน้า §10.1
     ปุ่มบันทึก/ยืนยัน = ปุ่มหลัก (เขียว LINE #06C755 · 14 ต.ค. 2026) · เพิ่มแถว = primary พื้นอ่อน · ลบ = แดง · แก้ไข/ยกเลิก = ขอบ -->
<script>
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import Users from "@lucide/svelte/icons/users";
    import UserCheck from "@lucide/svelte/icons/user-check";
    import Clock from "@lucide/svelte/icons/clock";
    import Search from "@lucide/svelte/icons/search";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
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
    import Volume2 from "@lucide/svelte/icons/volume-2";
    import MessageSquarePlus from "@lucide/svelte/icons/message-square-plus";
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
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Switch } from "$lib/components/ui/switch/index.js";
    import { Toggle } from "$lib/components/ui/toggle/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import PageHeader from "./ui/PageHeader.svelte";
    import Status from "./ui/Status.svelte";
    import StickerImg from "./ui/StickerImg.svelte";
    import StickerField from "./ui/StickerField.svelte";
    import ImageField from "./ui/ImageField.svelte";
    import PasswordInput from "./ui/PasswordInput.svelte";
    import { PACKS, TG_PACKS, TYPE_LBL, GUIDE, SET_TABS, stickerLabel, chanByName, PLATFORM, followersOf } from "./data.js";
    import PlatformIcon from "./ui/PlatformIcon.svelte";
    import { S, db, showPage, setTab, settingsAct, simIncoming } from "./store.svelte.js";
    import { snd, setSound, playChime, TONES, VOLS } from "./sound.svelte.js";

    const act = (a, i, el) => () => settingsAct(a, i, el);
    // คลังสติ๊กเกอร์ตามช่องทางของ Channel (16 ต.ค. 2026): LINE = ชุดพื้นฐานของ LINE · Telegram = ชุด Telegram (ต้นแบบ)
    //   รูปแบบเดียวกัน { id, name, n, keys } · สติ๊กเกอร์โปรด/ชุดที่สร้างแสดงเฉพาะของช่องทางนั้น (คีย์ Telegram ขึ้นต้น "tg-")
    const isTg = $derived(chan?.platform === "telegram");
    const LIB = $derived(
        isTg
            ? TG_PACKS.map((p) => ({ id: p.id, name: p.name, n: p.codes.length, keys: p.codes.map((x) => "tg-" + x) }))
            : PACKS.map((p) => ({ id: p[0], name: "ชุด " + p[0], n: p[1], keys: Array.from({ length: p[1] }, (_, i) => p[0] + "-" + i) })),
    );
    const ofPlat = (k) => (k.startsWith("tg-") ? isTg : !isTg);
    const favs = $derived(S.fav.filter(ofPlat));
    const setsShown = $derived(S.stk.map((x, i) => ({ x, i })).filter(({ x }) => !x.items || !x.items.length ? !isTg : ofPlat(x.items[0])));
    const pk = $derived(LIB.filter((p) => p.id === S.pack)[0]);
    // ค้นหาชุดในคลัง: LINE ด้วยเลขชุด (packageId — เว็บต้นฉบับ 15 ต.ค. 2026) · Telegram ด้วยชื่อชุด
    const packsOf = (q) => LIB.filter((p) => !(q || "").trim() || String(p.id).indexOf(q.trim()) >= 0 || p.name.indexOf(q.trim()) >= 0);
    let favQ = $state("");
    // Broadcast › เลือกผู้รับ: รายชื่อแชท (ชื่อที่แสดงใน LINE) ค้นหาด้วยชื่อ / username / chatId
    let bcQ = $state("");
    // ผู้รับที่เลือกได้ = ห้องแชทของ Channel นี้ (เคสในรายการสนทนา + ผู้ติดตามจำลอง) · bcList = หลังกรองด้วยคำค้น
    const bcPool = $derived(
        chan
            ? db.cases.filter((c) => c.merchant === chan.id).map((c) => ({ id: c.id, name: c.name, user: c.user.username })).concat(followersOf(chan.id))
            : [],
    );
    const bcList = $derived(bcPool.filter((c) => !bcQ.trim() || [c.name, c.user, c.id].join(" ").toLowerCase().indexOf(bcQ.trim().toLowerCase()) >= 0));
    // ที่เลือกไว้แต่ไม่อยู่ใน Channel นี้ ไม่นับ (เปลี่ยน Channel แล้วตัวเลขไม่ค้าง)
    const bcAllOn = $derived(bcList.length > 0 && bcList.every((c) => S.bcSel.indexOf(c.id) >= 0));
    const bcN = $derived(S.bcTo === "all" ? null : S.bcSel.filter((id) => bcPool.some((c) => c.id === id)).length);
    // Channel ที่กำลังตั้งค่า (เปิดจากเฟืองของ Channel) ⇒ รู้ว่าเป็น LINE หรือ Telegram
    const chan = $derived(S.ch ? chanByName(S.ch) : null);
    const via = $derived(chan ? PLATFORM[chan.platform] : "");
    const amMode = $derived(S.f.amMode || "มีคำนี้");
    // สติ๊กเกอร์โปรดเลือกชุดจากคลังแยกจากแผงสร้างชุด (ไม่ปนกัน)
    let favPack = $state(null);
    const fpk = $derived(LIB.filter((p) => p.id === favPack)[0]);
    const editingName = $derived(S.ed.stk != null && S.stk[S.ed.stk] ? S.stk[S.ed.stk].name : "");
    // ลากจัดลำดับรายการ (คีย์ลัด · Broadcast)
    let armed = $state(null);
    let dragFrom = $state(null);
    let dragOver = $state(null);

    const HEAD = {
        gen: ["ตั้งค่าทั่วไป", "เสียงแจ้งเตือน · ส่งข้อความหลังปิดเคส"],
        flex: ["Flex Card → OA Manager", "เลือกการ์ดจาก OA Manager ให้ตรงกับ Flex Card ของ SmartLIFF เพื่อส่งผ่าน chat.line.biz (ไม่เสียโควต้า)"],
        mgr: ["Manager Session", "บันทึก session ของ manager.line.biz เพื่อให้ระบบสร้าง OA Manager Card อัตโนมัติได้"],
        stk: ["ชุดสติ๊กเกอร์", "จัดเก็บชุดสติ๊กเกอร์ไว้ส่งให้ลูกค้าจากหน้าแชทได้อย่างรวดเร็ว — คลังตามช่องทางของ Channel (LINE / Telegram)"],
        qr: ["คีย์ลัด", "สร้างคำตอบสำเร็จรูปเป็นชุดรายการ — ข้อความ (แทรกอิโมจิได้) สติ๊กเกอร์ และรูปภาพ ส่งเรียงตามลำดับในคลิกเดียว"],
        bc: ["Broadcast — ยิงข้อความหาผู้ติดตาม", ""],
        am: ["ข้อความอัตโนมัติ", "เมื่อลูกค้าพิมพ์ข้อความที่มีคำค้นที่ตั้งไว้ ระบบจะตอบกลับอัตโนมัติด้วยข้อความที่กำหนด — รายการเหล่านี้ใช้กับไลน์เอเย่น (LINE OA) ของช่องนี้เท่านั้น"],
        sk: ["Secret Key", "คีย์สำหรับเชื่อมต่อ API ของช่องนี้"],
        pw: ["เปลี่ยนรหัสผ่าน", "เปลี่ยนรหัสผ่านสำหรับเข้าสู่ระบบของบัญชีคุณ"],
        gd: ["คู่มือการใช้งาน", "ขั้นตอนการใช้งาน OneChat สำหรับทีมแอดมิน"],
    };
    const head = $derived(HEAD[S.tab] || HEAD.gd);
    // ข้อความหลังปิดเคสที่ใช้ได้จริง (ช่องว่างไม่นับ)
    const ccSet = $derived(S.cc.filter((x) => (x.t === "image" ? x.src : x.v.trim())));
</script>

{#snippet chanLabel()}
    {#if chan}<PlatformIcon p={chan.platform} /><span class="min-w-0 truncate">{chan.name}</span>{:else}ตั้งค่ารวม{/if}
{/snippet}

{#snippet navList(after)}
    <!-- tablet/มือถือ: แบบแท็บ (เจ้าของงานให้ลอง 16 ต.ค. 2026) — กรอบพื้นเทา หมวดที่เปิดอยู่เป็นแผ่นขาวยกขึ้น เหมือน Tabs ของ shadcn · ขึ้นบรรทัดใหม่เมื่อเต็ม (ลองแบบช่องเท่ากันแล้ว เจ้าของงานให้กลับแบบนี้)
         จอคอมเป็นรายการแนวตั้งเหมือนเดิม -->
    <nav aria-label="เมนูตั้งค่า" class="flex flex-wrap gap-1 max-lg:bg-muted max-lg:rounded-lg max-lg:p-1 lg:flex-col">
        {#each SET_TABS as [k, Icon, label] (k)}
            <Button
                variant="ghost"
                class={"stab h-10 justify-start max-lg:h-8 max-lg:px-2.5 " + (S.tab === k ? "bg-muted font-bold max-lg:bg-background max-lg:text-foreground max-lg:shadow-sm" : "max-lg:text-muted-foreground max-lg:hover:bg-background/60")}
                aria-current={S.tab === k ? "page" : undefined}
                onclick={() => (setTab(k), after?.())}><Icon data-icon="inline-start" aria-hidden="true" />{label}</Button
            >
        {/each}
        <!-- ลิงก์ออกไปหน้า Line Liff (เว็บต้นฉบับ 15 ต.ค. 2026) -->
        <Button variant="ghost" class="stab max-lg:text-muted-foreground max-lg:hover:bg-background/60 h-10 justify-start max-lg:h-8 max-lg:px-2.5" onclick={() => (settingsAct("liff"), after?.())}><ExternalLink data-icon="inline-start" aria-hidden="true" />ไปหน้า Line Liff</Button>
    </nav>
{/snippet}

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
                <Item.Content class="min-w-44">
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

{#snippet addBtns(key, max, n, compact = false)}
    <div class={"flex flex-wrap items-center gap-2 " + (compact ? "contents" : "")}>
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "text" })}><Plus data-icon="inline-start" />ข้อความ</Button>
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "sticker" })}><Plus data-icon="inline-start" />สติ๊กเกอร์</Button>
        <Button size="sm" data-tone="primary" disabled={n >= max} onclick={act("add-" + key, 0, { t: "image" })}><Plus data-icon="inline-start" />รูปภาพ</Button>
        {#if !compact}<span class="text-muted-foreground ms-auto text-xs tabular-nums">{n}/{max}</span>{/if}
    </div>
{/snippet}

{#snippet listRow(title, desc, actions, media, editing = false)}
    <Item.Root variant="outline" size="sm" class={"lrow " + (editing ? "border-brand bg-brand/5" : "")}>
        {#if media}<Item.Media>{@render media()}</Item.Media>{/if}
        <Item.Content class="min-w-0 max-sm:basis-full">
            <Item.Title class="line-clamp-none">{@render title()}{#if editing}<Badge data-tone="primary">กำลังแก้ไข</Badge>{/if}</Item.Title>
            {@render desc()}
        </Item.Content>
        <!-- มือถือ: ปุ่มลงแถวล่างเต็มกว้าง คั่นเส้น · สวิตช์ชิดซ้าย ปุ่มแก้ไข/ลบชิดขวา (เจ้าของงานสั่ง 16 ต.ค. 2026 ให้บาลานซ์) -->
        <Item.Actions class="flex-wrap gap-1.5 max-sm:w-full max-sm:justify-end max-sm:border-t max-sm:pt-2 max-sm:[&>label]:me-auto">{@render actions()}</Item.Actions>
    </Item.Root>
{/snippet}

<!-- หัวการ์ดรายการ: ชื่อ + จำนวน · ปุ่มสร้างใหม่อยู่แถวเดียวกัน (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
{#snippet listHead(title, n, btnLabel, newAct)}
    <Card.Header>
        <Card.Title class="flex items-center gap-2">{title} <Badge variant="secondary" class="tabular-nums">{n}</Badge></Card.Title>
        <Card.Action>
            <!-- ปุ่มหลักของการ์ด = Button แบบ default (พื้น --primary #06C755 ตัวขาว ตามธีม LINE) -->
            <!-- มือถือ: ปุ่มเหลือ "+ เพิ่ม" ให้หัวการ์ดอยู่บรรทัดเดียว (ชื่อเต็มอยู่ใน aria-label) -->
            <Button size="sm" aria-label={btnLabel} onclick={act(newAct)}><Plus data-icon="inline-start" /><span class="sm:hidden">เพิ่ม</span><span class="max-sm:hidden">{btnLabel}</span></Button>
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
        <!-- เมนูตั้งค่าแสดงในการ์ดเสมอ (เจ้าของงานสั่ง 16 ต.ค. 2026 — กลับแบบเดิม ไม่ซ่อนในแผงสไลด์)
             จอคอม (≥1024): เมนูแนวตั้ง · ปุ่มกลับไปแชทเต็มกว้าง · tablet/มือถือ: ปุ่มกลับอยู่แถวเดียวกับหัว · เมนูเรียงต่อกันขึ้นบรรทัดใหม่ -->
        <Card.Root size="sm" class="snav lg:sticky lg:top-0">
            <Card.Header>
                <!-- ชื่อ Channel ต่อท้าย Settings แถวเดียวกัน (เจ้าของงานสั่ง 16 ต.ค. 2026) -->
                <Card.Title class="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-1">Settings
                    <span class="text-muted-foreground flex min-w-0 items-center gap-1.5 text-sm font-normal">{@render chanLabel()}</span></Card.Title>
                <Card.Action class="lg:hidden"><Button variant="outline" size="sm" onclick={() => showPage("console")}><ArrowLeft data-icon="inline-start" />กลับไปแชท</Button></Card.Action>
            </Card.Header>
            <Card.Content class="gap-3">
                <Button variant="outline" size="sm" class="hidden lg:inline-flex" onclick={() => showPage("console")}><ArrowLeft data-icon="inline-start" />กลับไปแชท</Button>
                {@render navList()}
            </Card.Content>
        </Card.Root>

        <section class="sbody flex min-w-0 flex-col gap-4">
            <PageHeader title={head[0]} description={head[1]} />

            {#if S.tab === "gen"}
                <!-- เสียงแจ้งเตือนแชท (เจ้าของงานสั่ง 15 ต.ค. 2026) · แถวเดียว: เปิด/ปิด · เสียง · ความดัง · ทดสอบ · จำค่าไว้ในเบราว์เซอร์นี้ -->
                <Card.Root size="sm">
                    <Card.Header>
                        <Card.Title>เสียงแจ้งเตือน</Card.Title>
                        <Card.Description>มีเสียงเมื่อลูกค้าส่งข้อความเข้ามา · ปุ่มกระดิ่งบนแถบบนเปิด/ปิดได้เหมือนกัน</Card.Description>
                    </Card.Header>
                    <Card.Content class="flex-row flex-wrap items-center gap-x-5 gap-y-3">
                        <label class="flex min-h-8 items-center gap-2 text-sm">
                            <Switch checked={snd.on} onCheckedChange={(v) => setSound({ on: v })} />เปิดเสียง
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            เสียง
                            <NativeSelect size="sm" class="w-28" disabled={!snd.on} value={snd.tone} onchange={(e) => setSound({ tone: e.currentTarget.value }, true)}>
                                {#each TONES as [k, label] (k)}<NativeSelectOption value={k}>{label}</NativeSelectOption>{/each}
                            </NativeSelect>
                        </label>
                        <label class="flex items-center gap-2 text-sm">
                            ความดัง
                            <NativeSelect size="sm" class="w-24" disabled={!snd.on} value={String(snd.vol)} onchange={(e) => setSound({ vol: +e.currentTarget.value }, true)}>
                                {#each VOLS as [v, label] (v)}<NativeSelectOption value={String(v)}>{label}</NativeSelectOption>{/each}
                            </NativeSelect>
                        </label>
                        <span class="flex flex-wrap gap-2 sm:ms-auto">
                            <Button variant="outline" size="sm" onclick={() => playChime(true)}><Volume2 data-icon="inline-start" />ทดสอบเสียง</Button>
                            <!-- ต้นแบบเท่านั้น: ให้ได้ยินเสียงแบบมีข้อความเข้าจริง -->
                            <Button variant="ghost" size="sm" onclick={simIncoming}><MessageSquarePlus data-icon="inline-start" />จำลองข้อความเข้า</Button>
                        </span>
                    </Card.Content>
                </Card.Root>
                <!-- ส่งข้อความหลังปิดเคส — ปิดเคส 1 ครั้งส่งทุกรายการรวดเดียว สูงสุด 5 รายการ · บันทึกแล้วแสดงแบบอ่าน + ปุ่มแก้ไข
                     ตอนแก้: ปุ่มเพิ่มรายการซ้าย · ยกเลิก/บันทึกขวา แถวเดียวกัน (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
                <Card.Root size="sm">
                    <Card.Header>
                        <Card.Title class="flex items-center gap-2">ส่งข้อความหลังปิดเคส
                            <Badge variant="secondary" class="tabular-nums">{S.ccEdit ? S.cc.length : ccSet.length}/5</Badge></Card.Title>
                        <Card.Description class="max-w-prose">
                            กด "ปิดเคส" (F4) 1 ครั้ง ระบบส่งทุกรายการด้านล่างให้ลูกค้ารวดเดียวตามลำดับ — สูงสุด 5 รายการ (ข้อความ · สติ๊กเกอร์ · รูปภาพ) · ลูกค้า Telegram ไม่ได้รับสติ๊กเกอร์
                        </Card.Description>
                        {#if !S.ccEdit}
                            <Card.Action><Button variant="outline" size="sm" onclick={act("cc-edit")}><Pencil data-icon="inline-start" />แก้ไข</Button></Card.Action>
                        {/if}
                    </Card.Header>
                    <Card.Content class="gap-2">
                        {#if S.ccEdit}
                            {@render itemRows(S.cc, "cc")}
                            <div class="flex flex-wrap items-center gap-2">
                                {@render addBtns("cc", 5, S.cc.length, true)}
                                <span class="flex gap-2 ms-auto">
                                    {#if S.ccBak}<Button variant="outline" size="sm" onclick={act("cc-cancel")}>ยกเลิก</Button>{/if}
                                    <Button size="sm" onclick={act("cc-save")}><Save data-icon="inline-start" />บันทึก</Button>
                                </span>
                            </div>
                        {:else if ccSet.length}
                            <ol class="flex flex-col gap-1">
                                {#each ccSet as x, i (i)}
                                    <li class="flex min-h-8 items-center gap-2 rounded-md border px-2 py-1">
                                        <Badge variant="secondary" class="tabular-nums">{i + 1}</Badge>
                                        <span class="text-muted-foreground w-14 shrink-0 text-xs">{TYPE_LBL[x.t]}</span>
                                        {#if x.t === "text"}
                                            <span class="min-w-0 flex-1 text-sm break-words whitespace-pre-line">{x.v}</span>
                                        {:else if x.t === "sticker"}
                                            <StickerImg k={x.v} class="size-10" />
                                        {:else}
                                            <img src={x.src} alt={"รูปภาพ " + (i + 1)} class="h-10 max-w-28 rounded object-cover" />
                                        {/if}
                                    </li>
                                {/each}
                            </ol>
                        {:else}
                            <p class="text-muted-foreground text-sm">ยังไม่ได้ตั้งข้อความ — ปิดเคสแล้วระบบจะไม่ส่งอะไรให้ลูกค้า · กด "แก้ไข" เพื่อเพิ่ม</p>
                        {/if}
                        {@render smsg("cc")}
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "flex"}
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
                            ><Star class="text-warning size-4" fill="currentColor" aria-hidden="true" />สติ๊กเกอร์โปรด <Badge variant="secondary" class="tabular-nums">{favs.length}</Badge></Card.Title
                        >
                    </Card.Header>
                    <Card.Content class="gap-4">
                        {#if favs.length}
                            <div class="flex flex-wrap gap-2" role="list" aria-label="สติ๊กเกอร์โปรด">
                                {#each favs as k (k)}
                                    <div class="bg-card relative rounded-lg border p-1" role="listitem" title={stickerLabel(k)}>
                                        <StickerImg {k} class="size-16" />
                                        <Button variant="secondary" size="icon-xs" class="absolute -top-1.5 -right-1.5 size-5 rounded-full border" aria-label={"เอาออกจากโปรด " + stickerLabel(k)} onclick={act("stk-fav", 0, { k })}><X /></Button>
                                    </div>
                                {/each}
                            </div>
                        {:else}
                            <p class="text-muted-foreground text-sm">ยังไม่มีสติ๊กเกอร์โปรด — เลือกชุดจากคลังด้านล่างแล้วกดที่สติ๊กเกอร์</p>
                        {/if}
                        <section class="flex flex-col gap-2" aria-label={"คลัง " + via + " สำหรับเลือกสติ๊กเกอร์โปรด"}>
                            <div class="flex flex-wrap items-center justify-between gap-2">
                                <span class="text-sm font-bold">คลัง {isTg ? "Telegram" : "LINE"} — กดที่สติ๊กเกอร์เพื่อติด/เอาดาวออก</span>
                                {#if fpk}
                                    {@const keys = fpk.keys}
                                    {@const allOn = keys.every((k) => S.fav.indexOf(k) >= 0)}
                                    <Button variant="outline" size="sm" onclick={act("stk-fav-all", 0, { keys, on: !allOn })}
                                        ><Star data-icon="inline-start" fill={allOn ? "none" : "currentColor"} class={allOn ? "" : "text-warning"} />{allOn ? "เอาดาวออกทั้งชุด" : "ติดดาวทั้งชุด"} {fpk.name}</Button
                                    >
                                {/if}
                            </div>
                            <Input bind:value={favQ} placeholder={isTg ? "ค้นหาชื่อชุด…" : "ค้นหาด้วยเลขชุด (packageId)…"} aria-label="ค้นหาชุดในคลัง" inputmode={isTg ? "text" : "numeric"} autocomplete="off" class="tabular-nums" />
                            <div class="grid grid-cols-(--grid-packs) gap-2">
                                {#each packsOf(favQ) as p (p.id)}
                                    <Toggle variant="outline" class="data-[state=on]:border-brand data-[state=on]:text-brand h-auto flex-col items-start gap-0 px-3 py-1.5" pressed={favPack === p.id} onPressedChange={() => (favPack = favPack === p.id ? null : p.id)}>
                                        <span class="font-bold">{p.name}</span><span class="text-muted-foreground text-xs">{p.n} รูป</span>
                                    </Toggle>
                                {/each}
                            </div>
                            {#if fpk}
                                <div class="grid grid-cols-(--grid-tiles) gap-1.5">
                                    {#each fpk.keys as k, i (k)}
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
                    {@render listHead("ชุดสติ๊กเกอร์", setsShown.length, "สร้างชุดใหม่", "stk-new")}
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each setsShown as { x, i } (i)}
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
                    <Input id="stkName" autocomplete="off" placeholder="เช่น ทักทายลูกค้า" bind:value={S.f.stkName} />
                </Field.Field>
                <section class="flex flex-col gap-2" aria-label="เลือกจากคลัง LINE">
                    <div class="flex flex-wrap items-center justify-between gap-2">
                        <span class="text-sm font-bold">เลือกจากคลัง {isTg ? "Telegram" : "LINE"}</span>
                        {#if pk}
                            {@const keys = pk.keys}
                            {@const allOn = keys.every((k) => S.picked.indexOf(k) >= 0)}
                            <Button variant="outline" size="sm" onclick={act("stk-pick-all", 0, { keys, on: !allOn })}>{allOn ? "ยกเลิกทั้งชุด" : "เลือกทั้งชุด"} {pk.name}</Button>
                        {/if}
                    </div>
                    <Input bind:value={S.f.packQ} placeholder={isTg ? "ค้นหาชื่อชุด…" : "ค้นหาด้วยเลขชุด (packageId)…"} aria-label="ค้นหาชุดในคลัง" inputmode={isTg ? "text" : "numeric"} autocomplete="off" class="tabular-nums" />
                    <div class="packs grid grid-cols-(--grid-packs) gap-2">
                        {#each packsOf(S.f.packQ) as p (p.id)}
                            <Toggle variant="outline" class="pack data-[state=on]:border-brand data-[state=on]:text-brand h-auto flex-col items-start gap-0 px-3 py-1.5" pressed={S.pack === p.id} onPressedChange={act("stk-pack", p.id)}>
                                <span class="font-bold">{p.name}</span><span class="text-muted-foreground text-xs">{p.n} รูป</span>
                            </Toggle>
                        {/each}
                    </div>
                    {#if pk}
                        <div class="tiles grid grid-cols-(--grid-tiles) gap-1.5">
                            {#each pk.keys as k, i (k)}
                                <Toggle variant="outline" class="tile data-[state=on]:border-brand data-[state=on]:bg-brand/10 aspect-square h-auto w-full p-1" pressed={S.picked.indexOf(k) >= 0} onPressedChange={act("stk-pick", 0, { k })}
                                    aria-label={"เลือกสติ๊กเกอร์ " + (i + 1)}><StickerImg {k} class="size-full" /></Toggle>
                            {/each}
                        </div>
                    {/if}
                </section>
                <!-- เพิ่มด้วย packageId + stickerId เป็นของ LINE เท่านั้น -->
                {#if !isTg}
                <Field.Field>
                    <Field.Label for="stkPkg">เพิ่มด้วย ID (สำหรับสติ๊กเกอร์นอกคลัง)</Field.Label>
                    <div class="flex gap-2">
                        <Input id="stkPkg" class="min-w-0 flex-1 tabular-nums" inputmode="numeric" placeholder="packageId" aria-label="packageId" bind:value={S.f.stkPkg} />
                        <Input id="stkId" class="min-w-0 flex-1 tabular-nums" inputmode="numeric" placeholder="stickerId" aria-label="stickerId" bind:value={S.f.stkId} />
                        <Button data-tone="primary" class="shrink-0" onclick={act("stk-addid")}><Plus data-icon="inline-start" />เพิ่ม</Button>
                    </div>
                </Field.Field>
                {/if}
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
                                    <div class="bub bg-bubble-admin text-bubble-admin-foreground max-w-5/6 rounded-2xl px-3 py-2 text-sm whitespace-pre-wrap">{x.t === "text" ? x.v || "…" : "[" + TYPE_LBL[x.t] + "] ยังไม่ได้เลือก"}</div>
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
                <!-- แบบระบบจริง (เจ้าของงานส่งรูปมา 15 ต.ค. 2026): แถบเตือนบอกว่าส่งหาใคร · การ์ดผู้รับ · การ์ดข้อความ · ปุ่ม "ส่งหา N คน" -->
                <Alert.Root data-tone="warning" role="status">
                    <TriangleAlert />
                    <Alert.Description class="text-foreground">
                        {#if chan && !bcPool.length}
                            <b>{chan.name} ยังไม่มีผู้ติดตามหรือห้องแชท</b> — ส่ง Broadcast ได้เมื่อมีลูกค้าเพิ่มเพื่อนหรือทักเข้ามาแล้ว
                        {:else if chan}
                            ข้อความจะถูกส่ง<b class="inline-flex items-center gap-1 align-middle">ทาง <PlatformIcon p={chan.platform} label /></b> ของ <b>{chan.name}</b> หา
                            <b>{bcN == null ? "ทุกห้องแชทของ Channel นี้ (" + bcPool.length + " คน)" : bcN + " คนที่เลือก"}</b> ตามลำดับ part ด้านล่าง (ลากสลับลำดับได้) — ตรวจให้ชัดก่อนส่ง เพราะยกเลิกคนที่ส่งไปแล้วไม่ได้
                            {#if chan.platform === "telegram"}· ลูกค้า Telegram จะไม่ได้รับสติ๊กเกอร์ LINE{/if}
                        {:else}
                            <b>ยังไม่ได้เลือก Channel</b> — เปิด Broadcast จากปุ่มเฟืองของ Channel ในแผง "เลือกแชทที่แสดง" เพื่อให้รู้ว่าส่งทาง LINE หรือ Telegram
                        {/if}
                    </Alert.Description>
                </Alert.Root>
                <!-- ผู้รับ + ข้อความที่จะส่ง รวมเป็นการ์ดเดียว (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
                <Card.Root>
                    <Card.Content class="gap-3">
                        <div class="flex flex-wrap items-baseline gap-x-2">
                            <h2 class="text-sm font-bold">ผู้รับ</h2>
                            {#if bcN != null}<span class="text-muted-foreground ms-auto text-sm">เลือกแล้ว <b class="text-foreground tabular-nums">{bcN}</b> จาก <span class="tabular-nums">{bcPool.length}</span> คน</span>{/if}
                        </div>
                        <ToggleGroup.Root type="single" variant="outline" class="self-start" aria-label="ผู้รับ Broadcast" bind:value={() => S.bcTo, (t) => t && settingsAct("bc-to", 0, { t })}>
                            <ToggleGroup.Item value="all"><Users />ทุกคน</ToggleGroup.Item>
                            <ToggleGroup.Item value="pick"><UserCheck />เลือกผู้รับ</ToggleGroup.Item>
                        </ToggleGroup.Root>
                        {#if S.bcTo === "pick"}
                            <div class="flex gap-2">
                                <InputGroup.Root class="flex-1">
                                    <InputGroup.Addon><Search /></InputGroup.Addon>
                                    <InputGroup.Input bind:value={bcQ} placeholder="ค้นหาชื่อ / chatId…" aria-label="ค้นหาผู้รับ" />
                                </InputGroup.Root>
                                <Button variant="outline" disabled={!bcList.length} onclick={act("bc-pick-all", 0, { ids: bcList.map((c) => c.id), on: !bcAllOn })}>{bcAllOn ? "ล้างที่เลือก" : "เลือกทั้งหมด"}</Button>
                            </div>
                            <div class="max-h-64 overflow-y-auto rounded-lg border" role="group" aria-label="รายชื่อผู้รับ">
                                {#each bcList as rc (rc.id)}
                                    <label class="hover:bg-muted/50 flex cursor-pointer items-center gap-3 border-b px-3 py-2 text-sm last:border-b-0">
                                        <Checkbox checked={S.bcSel.indexOf(rc.id) >= 0} onCheckedChange={() => settingsAct("bc-pick", 0, { id: rc.id })} />
                                        <span class="min-w-0 flex-1 truncate">{rc.name}</span>
                                        <span class="text-muted-foreground shrink-0 text-xs tabular-nums">{rc.user}</span>
                                    </label>
                                {:else}
                                    <p class="text-muted-foreground px-3 py-4 text-center text-sm">
                                        {#if bcQ.trim()}ไม่พบรายชื่อ "{bcQ.trim()}" — ลองค้นด้วยชื่ออื่นหรือ chatId{:else}ยังไม่มีลูกค้าทักเข้ามาใน Channel นี้{/if}
                                    </p>
                                {/each}
                            </div>
                        {/if}
                        <div class="flex flex-wrap items-baseline gap-x-2 border-t pt-4">
                            <h2 class="text-sm font-bold">ข้อความที่จะส่ง</h2>
                            <span class="text-muted-foreground text-xs tabular-nums">{S.bc.length} part</span>
                        </div>
                        {@render itemRows(S.bc, "bc")}
                        {@render addBtns("bc", 10, S.bc.length)}
                        <Field.Field orientation="horizontal" class="border-t pt-3">
                            <Checkbox id="bcSched" checked={S.bcSched} onCheckedChange={(v) => settingsAct("bc-sched", 0, { on: v })} />
                            <Field.Label for="bcSched" class="font-normal"><Clock class="size-4" aria-hidden="true" />ตั้งเวลาส่ง</Field.Label>
                        </Field.Field>
                        {#if S.bcSched}
                            <Input type="datetime-local" class="max-w-64" aria-label="เวลาที่ส่ง" bind:value={S.f.bcWhen} />
                        {/if}
                        {#if S.bcAsk}
                            <Alert.Root data-tone="warning">
                                <TriangleAlert />
                                <Alert.Title>ยืนยัน{S.bcSched ? "ตั้งเวลาส่ง" : "ส่ง"} {S.bc.length} part ทาง {via} ({chan?.name}) ถึง{bcN == null ? "ทุกห้องแชทของ Channel นี้" : " " + bcN + " คนที่เลือก"}?</Alert.Title>
                                <Alert.Description>ยกเลิกคนที่ส่งไปแล้วไม่ได้</Alert.Description>
                            </Alert.Root>
                            <div class="flex flex-wrap justify-end gap-2">
                                <Button variant="outline" onclick={act("bc-no")}><X data-icon="inline-start" />ยกเลิก</Button>
                                <Button data-tone="success" data-fill="solid" onclick={act("bc-yes")}><Send data-icon="inline-start" />ยืนยัน</Button>
                            </div>
                        {:else}
                            <!-- สีปุ่มตามช่องทาง: LINE = เขียวหลัก · Telegram = ฟ้า Telegram (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
                            <Button class={"self-end " + (chan?.platform === "telegram" ? "bg-telegram text-telegram-foreground hover:bg-telegram/90" : "")} disabled={bcN === 0 || !chan || !bcPool.length} onclick={act("bc-send")}
                                ><Megaphone data-icon="inline-start" />{S.bcSched ? "ตั้งเวลาส่ง" : "ส่ง"}{bcN == null ? "หาทุกคน" : "หา " + bcN + " คน"}{chan ? " ทาง " + via : ""}</Button
                            >
                        {/if}
                        {@render smsg("bc")}
                    </Card.Content>
                </Card.Root>
                <Card.Root>
                    <Card.Header>
                        <Card.Title>ประวัติ &amp; คิวที่ตั้งเวลาไว้</Card.Title>
                        <Card.Action><Button variant="outline" size="sm" onclick={act("bc-refresh")}><RefreshCw data-icon="inline-start" />รีเฟรช</Button></Card.Action>
                    </Card.Header>
                    <Card.Content>
                        <Item.Group class="gap-2">
                            {#each S.bcHist as x, i (i)}
                                <Item.Root variant="outline" size="sm" class="lrow">
                                    <Item.Content class="min-w-0">
                                        <Item.Title class="line-clamp-none flex-wrap items-center">
                                            {#if x.queued}<Status tone="warning">รอส่ง</Status>{:else}<Status tone="success">ส่งเสร็จแล้ว</Status>{/if}
                                            {#if x.title}<span class="wrap-anywhere">{x.title}</span>{/if}
                                            {#each x.parts || [] as pt, pi (pi)}
                                                {#if pt.t === "sticker"}<StickerImg k={pt.v} class="size-14" />
                                                {:else if pt.t === "image" && pt.src}<img src={pt.src} alt={"รูป " + pt.v} class="size-14 rounded-md border object-cover" />{/if}
                                            {/each}
                                        </Item.Title>
                                        <Item.Description>{x.queued ? "ตั้งเวลา " : "เริ่ม "}{x.when} · โดย {x.who} · {x.to}{x.sent ? " · " + x.sent : ""}</Item.Description>
                                    </Item.Content>
                                </Item.Root>
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีประวัติ</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
            {:else if S.tab === "am"}
                <Card.Root>
                    {@render listHead("รายการตอบกลับอัตโนมัติ", S.am.length, "เพิ่มการตอบกลับ", "am-new")}
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
                                        <Switch checked={x.on} onCheckedChange={act("am-tog", i)} aria-label={"เปิดใช้งานการตอบกลับ " + x.name} />{x.on ? "เปิด" : "ปิด"}
                                    </label>
                                    <Button variant="outline" size="sm" onclick={act("am-edit", i)}><Pencil data-icon="inline-start" />แก้ไข</Button>
                                    <Button variant="destructive" size="sm" onclick={act("am-del", i)}><Trash data-icon="inline-start" />ลบ</Button>
                                {/snippet}
                                {@render listRow(t, d, a, null, S.sheet === "am" && S.ed.am === i)}
                            {:else}
                                <p class="text-muted-foreground text-sm">ยังไม่มีการตอบกลับอัตโนมัติ — กด "เพิ่มการตอบกลับ" เพื่อตั้งคำค้นและข้อความตอบกลับ</p>
                            {/each}
                        </Item.Group>
                    </Card.Content>
                </Card.Root>
                {#snippet amBody()}
                <Field.Group class="gap-4">
                    <Field.Field>
                        <Field.Label for="amName">ชื่อรายการ</Field.Label>
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
                        <Field.Label for="amOn" class="font-normal">เปิดใช้งานรายการนี้</Field.Label>
                    </Field.Field>
                </Field.Group>
                {/snippet}
                {@render formSheet("am", S.ed.am != null, "เพิ่มการตอบกลับ", "แก้ไขการตอบกลับ: " + (S.ed.am != null ? S.am[S.ed.am]?.name : ""),
                    "เมื่อลูกค้าพิมพ์ข้อความที่ตรงคำค้น ระบบจะตอบกลับด้วยข้อความที่กำหนด", amBody, "am-save", "บันทึกการตอบกลับ", "บันทึกการแก้ไข", "am-cancel")}
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
