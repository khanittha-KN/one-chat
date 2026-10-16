<!-- สถานะไลน์ (OA) — เว็บต้นฉบับ 15 ต.ค. 2026: ปุ่ม Verify เต็มกว้าง · สถานะ / Ping / OA · ปุ่ม Ping กับ Update สถานะ
     พับไว้ตั้งแต่แรกเมื่อไลน์ออนไลน์ · ไลน์หลุดกางให้เห็นทันที -->
<script>
    import Wifi from "@lucide/svelte/icons/wifi";
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { merch, lineNo, pingOf } from "../data.js";
    import { toast, verifyLine, pingLine } from "../store.svelte.js";
    let { c } = $props();
    const lm = $derived(merch(c.merchant));
</script>

{#snippet badge()}
    {#if c.lineOk}<Status tone="success">ออนไลน์</Status>{:else}<Status tone="destructive">หลุด</Status>{/if}
{/snippet}

<FoldCard {c} title="สถานะไลน์ (OA)" icon={Wifi} hint={c.lineOk ? "ออนไลน์" : "หลุด"} dot={c.lineOk ? "success" : "destructive"} def={c.lineOk} action={badge} contentClass="gap-2.5">
    <p class="text-muted-foreground text-xs">ถ้าส่งข้อความไม่ได้ กด Verify เพื่อ login ใหม่</p>
    <Button data-tone="info" data-fill="solid" class="w-full" onclick={() => verifyLine(c)}><ShieldCheck data-icon="inline-start" />Verify</Button>
    <dl class={DL}>
        <dt class={DT}>สถานะ</dt>
        <dd class={DD}>{#if c.lineOk}<Status tone="success">ออนไลน์</Status>{:else}<Status tone="destructive">หลุดการเชื่อมต่อ</Status>{/if}</dd>
        <dt class={DT}>Ping</dt>
        <dd class={DD + " tabular-nums"}>{c.lineOk ? pingOf(c) + " ms" : "-"}</dd>
        <dt class={DT}>OA</dt>
        <dd class={DD}>{lm.name} <span class="text-muted-foreground text-xs tabular-nums">@{lm.id} · #{lineNo[lm.id]}</span></dd>
    </dl>
    <div class="flex gap-2 *:flex-1">
        <Button variant="outline" size="sm" onclick={() => pingLine(c)}>Ping</Button>
        <Button variant="outline" size="sm" onclick={() => toast("อัปเดตสถานะไลน์แล้ว")}>Update สถานะ</Button>
    </div>
</FoldCard>
