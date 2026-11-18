<!-- LINE และผู้ช่วย (OA) — ตามเว็บจริง 15 พ.ย. 2026
     ส่วนบน "LINE OA" (เฉพาะแชท LINE): สถานะ · OA · หลุด ⇒ ป้าย "ใช้ Messaging API" (ไม่มีปุ่ม Verify / Ping / Update สถานะแล้ว)
     ส่วนล่าง "ผู้ช่วย (OA)": ชื่อ + ป้ายวิธี login (Email / QR) · อีเมล · หมดอายุ ⇒ Verify (Email) หรือ QR Login · มีแอดมินอื่นกำลัง verify ⇒ ขึ้นชื่อ · รีเฟรช · เช็คทั้งหมด
     แชท Telegram ก็เห็นการ์ดนี้ (ชื่อ "ผู้ช่วย (OA)") เพื่อช่วยกัน verify ได้จากทุกแชท · ปกติเป็นปุ่มในแถวบน มีปัญหา ⇒ กางเป็นการ์ด -->
<script>
    import Wifi from "@lucide/svelte/icons/wifi";
    import Bot from "@lucide/svelte/icons/bot";
    import ShieldCheck from "@lucide/svelte/icons/shield-check";
    import QrCode from "@lucide/svelte/icons/qr-code";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import FlaskConical from "@lucide/svelte/icons/flask-conical";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { merch, platformOf } from "../data.js";
    import { st, toast, assistVerify, assistCheckAll, assistExpire, assistOf, lineUp } from "../store.svelte.js";
    let { c } = $props();
    const lm = $derived(merch(c.merchant));
    const isLine = $derived(platformOf(c.merchant) === "line");
    const bad = $derived(assistOf(c).filter((a) => !a.ok));
    const up = $derived(lineUp(c));
    const problem = $derived((isLine && !up) || bad.length > 0);
    const title = $derived(isLine ? "LINE และผู้ช่วย (OA)" : "ผู้ช่วย (OA)");
    // สรุปสั้นในหัวการ์ด (เว็บจริง: LINE หลุด · ผู้ช่วยหมดอายุ N · ผู้ช่วยมีปัญหา)
    const sum = $derived(isLine && !up ? "LINE หลุด" : bad.length ? "ผู้ช่วยหมดอายุ " + bad.length : "ออนไลน์");
</script>

{#snippet badge()}
    {#if problem}<Status tone="destructive">{sum}</Status>{:else}<Status tone="success">ออนไลน์</Status>{/if}
{/snippet}

<FoldCard {c} {title} icon={isLine ? Wifi : Bot} hint={sum} dot={problem ? "destructive" : "success"} def={!problem} action={badge} contentClass="gap-3">
    {#if isLine}
        <section class="flex flex-col gap-2" aria-label="LINE OA">
            <h3 class="text-muted-foreground flex items-center gap-1.5 text-xs font-normal"><Wifi class="size-3.5" aria-hidden="true" />LINE OA</h3>
            <dl class={DL}>
                <dt class={DT}>สถานะ</dt>
                <!-- LINE หลุด ⇒ ระบบส่งข้อความผ่าน Messaging API แทน -->
                <dd class={DD}>{#if up}<Status tone="success">ออนไลน์</Status>{:else}<Status tone="warning">ใช้ Messaging API</Status>{/if}</dd>
                <dt class={DT}>OA</dt>
                <dd class={DD}>{lm.name} <span class="text-muted-foreground text-xs tabular-nums">@{lm.oa || lm.id}</span></dd>
            </dl>
        </section>
        <Separator />
    {/if}
    <section class="flex flex-col gap-2" aria-label="ผู้ช่วย (OA)">
        <h3 class="text-muted-foreground flex items-center gap-1.5 text-xs font-normal"><Bot class="size-3.5" aria-hidden="true" />ผู้ช่วย (OA)</h3>
        {#if !bad.length}
            <p class="text-success flex items-center gap-1.5 text-sm"><CircleCheck class="size-4" aria-hidden="true" />ผู้ช่วยทุกคนออนไลน์อยู่</p>
        {:else}
            {#each bad as a (a.name)}
                {@const qr = a.how === "qr" || a.how === "none"}
                <Item.Root variant="outline" size="sm">
                    <Item.Content class="min-w-0 gap-0.5">
                        <Item.Title class="w-full min-w-0"><span class="truncate font-bold">{a.name}</span><Badge variant="secondary" class="shrink-0">{qr ? "QR" : "Email"}</Badge></Item.Title>
                        {#if a.email}<Item.Description class="truncate">{a.email}</Item.Description>{/if}
                        <p class="text-destructive text-sm">หมดอายุ</p>
                        {#if a.by}<Item.Description class="line-clamp-none text-xs">{a.by} กำลัง verify</Item.Description>
                        {:else if a.how === "none"}<Item.Description class="line-clamp-none text-xs">ไม่มีรหัสผ่านที่บันทึกไว้ — ใช้ QR Login แทน</Item.Description>{/if}
                    </Item.Content>
                    <Item.Actions>
                        {#if a.busy}<Spinner class="text-brand" aria-label="กำลัง verify" />
                        {:else if qr}<Button data-tone="info" data-fill="solid" size="sm" disabled={!!a.by} onclick={() => assistVerify(a)}><QrCode data-icon="inline-start" />QR Login</Button>
                        {:else}<Button data-tone="info" data-fill="solid" size="sm" disabled={!!a.by} onclick={() => assistVerify(a)}><ShieldCheck data-icon="inline-start" />Verify</Button>{/if}
                    </Item.Actions>
                </Item.Root>
            {/each}
        {/if}
        <div class="flex gap-2 *:flex-1">
            <Button variant="outline" size="sm" onclick={() => toast("โหลดสถานะผู้ช่วยใหม่แล้ว")}><RefreshCw data-icon="inline-start" />รีเฟรช</Button>
            <Button variant="outline" size="sm" disabled={st.assistChecking} onclick={() => assistCheckAll(c)}>
                {#if st.assistChecking}<Spinner data-icon="inline-start" />กำลังเช็ค…{:else}<Wifi data-icon="inline-start" />เช็คทั้งหมด{/if}
            </Button>
        </div>
        <!-- ปุ่มทดลองของต้นแบบ (เว็บจริงมีเฉพาะ localhost เหมือนกัน) -->
        {#if !bad.length}
            <Button variant="ghost" size="sm" class="text-muted-foreground" onclick={() => assistExpire(c)}><FlaskConical data-icon="inline-start" />เฉพาะต้นแบบ — ตั้งผู้ช่วยเป็น "หมดอายุ" เพื่อลอง Verify</Button>
        {/if}
    </section>
</FoldCard>
