<!-- รายการฝาก/ถอน — การ์ดเล็กต่อรายการแบบต้นฉบับ (.hist li: กรอบ มุมมน 8px ห่างกัน 6px ตัวอักษรเล็ก)
     ป้ายฝาก/ถอนสีเดียวกับประเภทเคสในรายการสนทนา (ฝาก เหลือง · ถอน ส้ม) · ผลเป็นป้ายสถานะ -->
<script>
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Status from "../ui/Status.svelte";
    import { typeBadge } from "../kinds.js";
    let { items } = $props();
</script>

<ul class="hist flex flex-col gap-1.5">
    {#each items as x, i (i)}
        {@const dep = x.k === "dep"}
        <li class="bg-background flex items-start gap-2 rounded-lg border px-2.5 py-1.5">
            <span class="flex min-w-0 flex-1 flex-col">
                <span class="flex items-center gap-1.5">
                    <Badge variant="outline" class={typeBadge(dep)}>{dep ? "ฝาก" : "ถอน"}</Badge>
                    <span class="text-sm font-bold tabular-nums">{x.r.amt.toFixed(2)}</span>
                </span>
                <span class="text-muted-foreground text-xs tabular-nums wrap-anywhere">{x.r.time} · {x.r.ref}</span>
            </span>
            <Status tone={x.r.ok ? "success" : "destructive"}>{x.r.ok ? "สำเร็จ" : dep ? "ยกเลิก" : "ไม่สำเร็จ"}</Status>
        </li>
    {/each}
</ul>
