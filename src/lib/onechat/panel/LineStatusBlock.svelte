<!-- LINE และผู้ช่วย (OA) — ตามเว็บจริง 27 ต.ค. 2026
     ส่วนบน "LINE OA" (เฉพาะแชท LINE): สถานะ · OA · หลุด ⇒ Verify / Ping / Update สถานะ
     ส่วนล่าง "ผู้ช่วย (OA)": ผู้ช่วยขององค์กร · หมดอายุ ⇒ Verify (อีเมล) หรือ QR Login · มีแอดมินอื่นกำลัง verify ⇒ ขึ้นชื่อ · รีเฟรช · เช็คทั้งหมด
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
    import { Button } from "$lib/components/ui/button/index.js";
    import { Spinner } from "$lib/components/ui/spinner/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { merch, platformOf } from "../data.js";
    import { st, toast, verifyLine, pingLine, assistVerify, assistCheckAll, assistExpire } from "../store.svelte.js";
    let { c } = $props();
    const lm = $derived(merch(c.merchant));
    const isLine = $derived(platformOf(c.merchant) === "line");
    const bad = $derived(st.assist.filter((a) => !a.ok));
    const problem = $derived((isLine && !c.lineOk) || bad.length > 0);
    const title = $derived(isLine ? "LINE และผู้ช่วย (OA)" : "ผู้ช่วย (OA)");
    // สรุปสั้นในหัวการ์ด (เว็บจริง: LINE หลุด · ผู้ช่วยหมดอายุ N · ผู้ช่วยมีปัญหา)
    const sum = $derived(isLine && !c.lineOk ? "LINE หลุด" : bad.length ? "ผู้ช่วยหมดอายุ " + bad.length : "ออนไลน์");
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
                <dd class={DD}>{#if c.lineOk}<Status tone="success">ออนไลน์</Status>{:else}<Status tone="destructive">ออฟไลน์</Status>{/if}</dd>
                <dt class={DT}>OA</dt>
                <dd class={DD}>{lm.name} <span class="text-muted-foreground text-xs tabular-nums">@{lm.oa || lm.id}</span></dd>
            </dl>
            {#if !c.lineOk}
                <p class="text-muted-foreground text-xs">กด Verify เพื่อ login OA ก่อน · กด Ping เพื่อตรวจสอบสถานะ</p>
                <Button data-tone="info" data-fill="solid" class="w-full" onclick={() => verifyLine(c)}><ShieldCheck data-icon="inline-start" />Verify</Button>
                <div class="flex gap-2 *:flex-1">
                    <Button variant="outline" size="sm" onclick={() => pingLine(c)}>Ping</Button>
                    <Button variant="outline" size="sm" onclick={() => toast("อัปเดตสถานะไลน์แล้ว")}>Update สถานะ</Button>
                </div>
            {/if}
        </section>
        <Separator />
    {/if}
    <section class="flex flex-col gap-2" aria-label="ผู้ช่วย (OA)">
        <h3 class="text-muted-foreground flex items-center gap-1.5 text-xs font-normal"><Bot class="size-3.5" aria-hidden="true" />ผู้ช่วย (OA)</h3>
        {#if !bad.length}
            <p class="text-success flex items-center gap-1.5 text-sm"><CircleCheck class="size-4" aria-hidden="true" />ผู้ช่วยทุกคนออนไลน์อยู่</p>
        {:else}
            {#each bad as a (a.name)}
                <Item.Root variant="outline" size="sm">
                    <Item.Content class="min-w-0">
                        <Item.Title class="w-full"><span class="truncate">{a.name}</span><Status tone="destructive">หมดอายุ</Status></Item.Title>
                        <Item.Description class="line-clamp-none text-xs">
                            {#if a.by}{a.by} กำลัง verify
                            {:else if a.how === "none"}ผู้ช่วยนี้ไม่มีรหัสผ่านที่บันทึกไว้ — Verify ด้วยอีเมลไม่ได้
                            {:else}{a.how === "qr" ? "สแกน QR ด้วยแอป LINE ของผู้ช่วยคนนี้" : "login ด้วยอีเมลที่บันทึกไว้"}{/if}
                        </Item.Description>
                    </Item.Content>
                    <Item.Actions>
                        {#if a.busy}<Spinner class="text-brand" aria-label="กำลัง verify" />
                        {:else if a.how === "qr" || a.how === "none"}<Button variant="outline" size="sm" disabled={!!a.by} onclick={() => assistVerify(a)}><QrCode data-icon="inline-start" />QR Login</Button>
                        {:else}<Button data-tone="info" data-fill="solid" size="sm" disabled={!!a.by} onclick={() => assistVerify(a)}><ShieldCheck data-icon="inline-start" />Verify</Button>{/if}
                    </Item.Actions>
                </Item.Root>
            {/each}
        {/if}
        <div class="flex gap-2 *:flex-1">
            <Button variant="outline" size="sm" onclick={() => toast("โหลดสถานะผู้ช่วยใหม่แล้ว")}><RefreshCw data-icon="inline-start" />รีเฟรช</Button>
            <Button variant="outline" size="sm" disabled={st.assistChecking} onclick={assistCheckAll}>
                {#if st.assistChecking}<Spinner data-icon="inline-start" />กำลังเช็ค…{:else}<Wifi data-icon="inline-start" />เช็คทั้งหมด{/if}
            </Button>
        </div>
        <!-- ปุ่มทดลองของต้นแบบ (เว็บจริงมีเฉพาะ localhost เหมือนกัน) -->
        {#if !bad.length}
            <Button variant="ghost" size="sm" class="text-muted-foreground" onclick={assistExpire}><FlaskConical data-icon="inline-start" />เฉพาะต้นแบบ — ตั้งผู้ช่วยเป็น "หมดอายุ" เพื่อลอง Verify</Button>
        {/if}
    </section>
</FoldCard>
