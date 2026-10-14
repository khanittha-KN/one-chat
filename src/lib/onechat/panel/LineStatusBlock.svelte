<script>
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import * as Card from "$lib/components/ui/card/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import { merch, lineNo } from "../data.js";
    import { toast, verifyLine } from "../store.svelte.js";
    let { c } = $props();
    const lm = $derived(merch(c.merchant));
</script>

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>ตรวจสอบสถานะไลน์</Card.Title>
        <Card.Action>
            <Button size="sm" data-tone="info" data-fill="solid" onclick={() => toast("อัปเดตสถานะไลน์แล้ว")}>Update</Button>
        </Card.Action>
    </Card.Header>
    <Card.Content>
        <!-- กล่องเดียวแทนตาราง 4 คอลัมน์ (เจ้าของงานสั่ง — ไม่ให้ต้องเลื่อนซ้ายขวา) · หลุด ⇒ ขอบแดง + ปุ่ม Verify ในกล่อง -->
        <div class={"flex flex-col gap-1.5 rounded-lg border px-2.5 py-2 " + (c.lineOk ? "" : "border-destructive/40 bg-destructive/5")}>
            <div class="flex min-w-0 items-center gap-2">
                <span class="text-muted-foreground text-xs tabular-nums" title="ลำดับ Lineat">#{lineNo[lm.id]}</span>
                <span class="min-w-0 flex-1 truncate text-sm" title={lm.name + " @" + lm.id}><b class="font-bold">{lm.name}</b> <span class="text-muted-foreground">@{lm.id}</span></span>
                {#if c.lineOk}<Status tone="success">เชื่อมต่อ</Status>{:else}<Status tone="destructive">หลุด</Status>{/if}
            </div>
            {#if !c.lineOk}
                <div class="flex items-center justify-between gap-2" role="status">
                    <span class="text-destructive text-xs">ไลน์หลุด กด Verify เพื่อเชื่อมต่อใหม่</span>
                    <Button size="sm" data-tone="info" data-fill="solid" class="shrink-0" onclick={() => verifyLine(c)}><ShieldCheck data-icon="inline-start" />Verify</Button>
                </div>
            {/if}
        </div>
    </Card.Content>
</Card.Root>
