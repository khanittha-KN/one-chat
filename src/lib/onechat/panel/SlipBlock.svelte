<script>
    import ReceiptText from "@lucide/svelte/icons/receipt-text";
    import Clock from "@lucide/svelte/icons/clock";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import OctagonX from "@lucide/svelte/icons/octagon-x";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import Info from "@lucide/svelte/icons/info";
    import RotateCw from "@lucide/svelte/icons/rotate-cw";
    import X from "@lucide/svelte/icons/x";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import Status from "../ui/Status.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { bankOf, money, verdictOf } from "../data.js";
    import { slipRetry, slipDismiss } from "../store.svelte.js";
    let { c } = $props();
    // ผลที่กำลังแสดง = กำลังตรวจหรือมีผลแล้ว (pending = ยังไม่กดตรวจ ⇒ ยังไม่มีผล) · ปิดผลตรวจแล้วกลับเป็นปุ่ม
    const s = $derived(c.slip && !c.slip.hidden && (c.slip.state === "reading" || c.slip.state === "ready") ? c.slip : null);
    const vd = $derived(s && s.state === "ready" ? verdictOf(s) : null);
    // รูปจากลูกค้าที่ยังไม่ได้กดตรวจ (เว็บจริง: "รอตรวจ N รูป")
    const waiting = $derived(c.msgs.filter((m) => m.who === "cust" && (m.action === "slip" || m.action === "image") && !m.checked).length);
    // กำลังตรวจ / มีผล ⇒ การ์ดขึ้นบนสุดของแผงลูกค้า + ขอบและพื้นสีตามผล (เจ้าของงานสั่ง 15 ต.ค. 2026) · มีป้ายข้อความบอกผลด้วย ไม่ได้บอกด้วยสีอย่างเดียว
    const RING = { success: "ring-2 ring-success bg-success/5", destructive: "ring-2 ring-destructive bg-destructive/5", warning: "ring-2 ring-warning bg-warning/5", info: "ring-2 ring-info bg-info/5" };
    const tone = $derived(!s ? "" : s.state === "reading" ? RING.info : vd ? RING[vd.tone] : "");
    const ICON = { success: CircleCheck, destructive: OctagonX, warning: TriangleAlert, info: Info };
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

<!-- ป้ายท้ายหัวการ์ด: ไม่มีสลิป · รอตรวจ N รูป · กำลังอ่าน · ผลตรวจ (ตามเว็บจริง 27 ต.ค. 2026) -->
{#snippet badge()}
    {#if vd}<Status tone={vd.tone}>{vd.short}</Status>
    {:else if s && s.state === "reading"}<Status tone="info">กำลังอ่าน</Status>
    {:else if waiting}<Status icon={Clock}>รอตรวจ {waiting} รูป</Status>
    {:else}<Status icon={null}>ไม่มีสลิป</Status>{/if}
{/snippet}

<FoldCard {c} title="ตรวจสอบสลิป" icon={ReceiptText} hint={waiting ? "รอตรวจ " + waiting + " รูป" : "ไม่มีสลิป"} dot={waiting ? "warning" : ""} def={!s} action={badge} cardClass={tone}>
    {#if !s}
        {#if waiting}
            <p class="text-muted-foreground text-sm">มีรูปจากลูกค้า {waiting} รูปที่ยังไม่ได้ตรวจ — กด "ตรวจสอบสลิป" ใต้รูปในแชท ผลจะแสดงที่นี่</p>
        {:else}
            <p class="text-muted-foreground text-sm">ยังไม่มีสลิปในแชทนี้ เมื่อลูกค้าส่งรูปสลิปมา ให้กด "ตรวจสอบสลิป" ใต้รูปในแชท ผลจะแสดงที่นี่</p>
        {/if}
    {:else if s.state === "reading"}
        <p class="text-muted-foreground flex items-center gap-2 text-sm" aria-busy="true"><Spinner class="text-brand" aria-label="กำลังตรวจสลิป" />กำลังตรวจ…</p>
    {:else}
        {@const Icon = ICON[vd.tone]}
        <Alert.Root data-tone={vd.tone} role="status" class="verdict">
            <Icon />
            <Alert.Title>{vd.label}</Alert.Title>
            {#if vd.hint}<Alert.Description>{vd.hint.replace("{when}", s.dupAt || "-")}</Alert.Description>{/if}
        </Alert.Root>
        {#if vd.detail}
            {@render party("ผู้โอน", s.fromBank, s.fromName, s.fromNo)}
            <dl class={DL}>
                <dt class={DT}>ยอดโอน</dt><dd class={DD + " font-bold tabular-nums"}>{money(s.amt)} บาท</dd>
                <dt class={DT}>วันที่โอน</dt><dd class={DD}>{s.date}</dd>
                <dt class={DT}>เวลาที่โอน</dt><dd class={DD + " tabular-nums"}>{s.time}</dd>
                <dt class={DT}>เลขที่รายการ</dt><dd class={DD + " text-xs tabular-nums"}>{s.ref}</dd>
            </dl>
            {@render party("ผู้รับ", s.toBank, s.toName, s.toNo)}
        {/if}
        <p class="text-muted-foreground text-xs">ตรวจโดย {s.by}</p>
        <div class="flex gap-2 *:flex-1">
            {#if vd.retry}<Button data-tone="primary" data-fill="solid" size="sm" onclick={() => slipRetry(c)}><RotateCw data-icon="inline-start" />ตรวจอีกครั้ง</Button>{/if}
            <Button variant="outline" size="sm" onclick={() => slipDismiss(c)}><X data-icon="inline-start" />ปิดผลตรวจสลิป</Button>
        </div>
    {/if}
</FoldCard>
