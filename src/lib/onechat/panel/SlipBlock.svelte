<script>
    import Clock from "@lucide/svelte/icons/clock";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import OctagonX from "@lucide/svelte/icons/octagon-x";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import Status from "../ui/Status.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { bankOf, money } from "../data.js";
    let { c } = $props();
    const s = $derived(c.slip);
</script>

{#snippet party(role, code, name, no)}
    <Item.Root variant="outline" size="sm">
        <Item.Media><BankLogo {code} /></Item.Media>
        <Item.Content class="min-w-0">
            <Item.Description class="text-xs">{role}</Item.Description>
            <Item.Title class="line-clamp-none">{name}</Item.Title>
            <Item.Description>{bankOf(code).name} · <span class="tabular-nums">{no}</span></Item.Description>
        </Item.Content>
    </Item.Root>
{/snippet}

<!-- การ์ดตรวจสอบสลิปแสดงเสมอ (เว็บต้นฉบับ 15 ต.ค. 2026) · ยังไม่มีสลิป ⇒ บอกวิธีตรวจ · พับไว้จนกว่าจะเริ่มตรวจ (กำลังอ่าน / มีผล)
     ปุ่ม "ไปหน้า Auto fast" ย้ายไปท้ายแผงลูกค้า -->
{#snippet badge()}
    {#if !s}<Status icon={null}>ไม่มีสลิป</Status>
    {:else if s.state === "ready"}
        {#if s.fake}<Status tone="destructive">ปลอม</Status>{:else}<Status tone="success">จริง</Status>{/if}
    {:else if s.state === "reading"}<Status tone="info">กำลังอ่าน</Status>
    {:else}<Status icon={Clock}>รอตรวจ</Status>{/if}
{/snippet}

<FoldCard {c} title="ตรวจสอบสลิป" def={!(s && (s.state === "reading" || s.state === "ready"))} action={badge}>
    {#if !s}
        <p class="text-muted-foreground text-sm">ยังไม่มีสลิปในแชทนี้ เมื่อลูกค้าส่งรูปสลิปมา ให้กด "ตรวจสอบสลิป" ใต้รูปในแชท ผลจะแสดงที่นี่</p>
    {:else if s.state === "pending"}
        <p class="text-muted-foreground text-sm">รอตรวจสอบสลิป ยอด <span class="tabular-nums">{money(s.amt)}</span> บาท</p>
    {:else if s.state === "reading"}
        <p class="text-muted-foreground flex items-center gap-2 text-sm" aria-busy="true"><Spinner class="text-brand" aria-label="กำลังตรวจสลิป" />กำลังตรวจสลิป…</p>
    {:else}
        <Alert.Root data-tone={s.fake ? "destructive" : "success"} role="status" class="verdict">
            {#if s.fake}<OctagonX />{:else}<CircleCheck />{/if}
            <Alert.Title>{s.fake ? "สลิปปลอม" : "สลิปจริง"}</Alert.Title>
        </Alert.Root>
        {@render party("ผู้โอน", s.fromBank, s.fromName, s.fromNo)}
        <dl class={DL}>
            <dt class={DT}>ยอดโอน</dt><dd class={DD + " font-bold tabular-nums"}>{money(s.amt)} บาท</dd>
            <dt class={DT}>วันที่โอน</dt><dd class={DD}>{s.date}</dd>
            <dt class={DT}>เวลาที่โอน</dt><dd class={DD + " tabular-nums"}>{s.time}</dd>
            <dt class={DT}>เลขที่รายการ</dt><dd class={DD + " text-xs tabular-nums"}>{s.ref}</dd>
        </dl>
        {@render party("ผู้รับ", s.toBank, s.toName, s.toNo)}
    {/if}
</FoldCard>
