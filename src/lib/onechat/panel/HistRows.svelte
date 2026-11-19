<!-- รายการฝาก/ถอน — ออกแบบใหม่ (เจ้าของงานสั่ง 18 พ.ย. 2026)
     แถวบน: ประเภท (ป้ายสีเดียวกับประเภทเคส ฝาก เหลือง · ถอน ส้ม) · ยอด (+ ฝาก / − ถอน) · ผล
     แถวรอง: วันเวลา · เลขอ้างอิง
     เส้นคั่น แล้วตาราง 2 คอลัมน์: ทำรายการ (แอดมินคนไหน หรือลูกค้าทำเอง) · ช่องทาง (Manual + บัญชีบริษัท หรือ ระบบปกติ) · หมายเหตุ (ฝาก Manual) -->
<script>
    import UserCog from "@lucide/svelte/icons/user-cog";
    import Smartphone from "@lucide/svelte/icons/smartphone";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Status from "../ui/Status.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import { typeBadge } from "../kinds.js";
    import { p2pAcc, bankOf, money } from "../data.js";
    let { items } = $props();
</script>

<ul class="hist flex flex-col gap-1.5">
    {#each items as x, i (i)}
        {@const dep = x.k === "dep"}
        {@const a = x.r.via === "p2p" ? p2pAcc(x.r.acc) : null}
        <li class="bg-background flex flex-col gap-1.5 rounded-lg border px-2.5 py-2">
            <div class="flex items-center gap-1.5">
                <Badge variant="outline" class={typeBadge(dep)}>{dep ? "ฝาก" : "ถอน"}</Badge>
                <span class="text-sm font-bold tabular-nums">{dep ? "+" : "−"}{money(x.r.amt)}</span>
                <span class="ms-auto"><Status tone={x.r.ok ? "success" : "destructive"}>{x.r.ok ? "สำเร็จ" : dep ? "ยกเลิก" : "ไม่สำเร็จ"}</Status></span>
            </div>
            <span class="text-muted-foreground text-xs tabular-nums wrap-anywhere">{x.r.time} · {x.r.ref}</span>
            <dl class="grid grid-cols-[auto_1fr] items-center gap-x-3 gap-y-1 border-t pt-1.5 text-xs">
                <dt class="text-muted-foreground">ทำรายการ</dt>
                <dd class="flex min-w-0 items-center gap-1">
                    {#if x.r.by}<UserCog class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" /><span class="truncate">แอดมิน · <b>{x.r.by}</b></span>
                    {:else}<Smartphone class="text-muted-foreground size-3.5 shrink-0" aria-hidden="true" /><span>{dep ? "ลูกค้าฝากเอง" : "ลูกค้าถอนเอง"}</span>{/if}
                </dd>
                <dt class="text-muted-foreground">ช่องทาง</dt>
                <dd class="flex min-w-0 items-center gap-1">
                    {#if x.r.via === "p2p"}
                        <Badge variant="secondary" data-tone="info" class="shrink-0">Manual</Badge>
                        {#if a}<BankLogo code={a.bank} class="size-4 rounded-sm" /><span class="min-w-0 truncate tabular-nums" title={bankOf(a.bank).name + " " + a.no + " · " + a.name}>{a.no} · {a.name}</span>{/if}
                    {:else}<span>ระบบปกติ</span>{/if}
                </dd>
                {#if x.r.note}
                    <!-- ฝาก Manual: หมายเหตุ · ไม่เช็ค QRCode -->
                    <dt class="text-muted-foreground">หมายเหตุ</dt>
                    <dd class="min-w-0 wrap-anywhere">{x.r.note}{#if x.r.noQr} <span class="text-muted-foreground">· ไม่เช็ค QRCode</span>{/if}</dd>
                {/if}
            </dl>
        </li>
    {/each}
</ul>
