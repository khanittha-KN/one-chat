<!-- สรุปสมาชิก — ติดบนสุดของแผงลูกค้าเสมอ (ver2 · 23 พ.ย. 2026: ทีมแจ้งว่าแผงเลื่อนยาว ข้อมูลสำคัญต้องเห็นตลอด)
     รวมข้อมูลที่เคยกระจายหลายการ์ด (ตรวจสอบ · จัดการเครดิต · สถานะยอดค้าง) ไว้ที่เดียว ⇒ การ์ดอื่นไม่ต้องแสดงซ้ำ
     Username (คัดลอก) + สถานะ · ชื่อ · เบอร์ (คัดลอก) · เครดิตคงเหลือ (โหลดใหม่) · กระเป๋าโบนัส · เทิร์น · โปร · ยอดค้าง
     ⋯ = งานจัดการสมาชิก (โหลดใหม่ · เปลี่ยนรหัสผ่าน · เปลี่ยนสมาชิกที่ผูก · เลิกผูก) ⇒ พาไปแท็บ "สมาชิก" -->
<script>
    import Copy from "@lucide/svelte/icons/copy";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import Ellipsis from "@lucide/svelte/icons/ellipsis";
    import KeyRound from "@lucide/svelte/icons/key-round";
    import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
    import Unlink from "@lucide/svelte/icons/unlink";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import { money, pendingDep, pendingWd } from "../data.js";
    import { st, ok, pwOpen, unbindAsk } from "../store.svelte.js";
    // compact = แถบย่อแถวเดียว (Username · เครดิต · ยอดค้าง · ⋯) ตอนเลื่อนแผงจนสรุปเต็มพ้นจอ
    let { c, compact = false } = $props();
    const u = $derived(c.user);
    const pd = $derived(pendingDep(c));
    const pw = $derived(pendingWd(c));
    const sum = (a) => a.reduce((s, r) => s + r.amt, 0);
    function copy(v, what) {
        navigator.clipboard?.writeText(v);
        ok("คัดลอก" + what + "แล้ว");
    }
    // งานจัดการสมาชิก ⇒ เปิดแท็บสมาชิก แล้วเปิดส่วนที่เกี่ยวข้อง
    // แล้วเลื่อนไปที่ส่วนนั้น + โฟกัสช่องแรก (target = id ของช่อง/กล่องยืนยัน)
    const go = (fn, target) => () => {
        st.panelTab = "member";
        fn && fn();
        setTimeout(() => {
            const el = document.getElementById(target);
            if (!el) return;
            el.scrollIntoView({ block: "center", behavior: matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth" });
            if (el.matches("input, button")) el.focus({ preventScroll: true });
        }, 60);
    };
</script>

{#snippet menu()}
    <DropdownMenu.Root>
        <DropdownMenu.Trigger class={buttonVariants({ variant: "ghost", size: "icon-sm" }) + " -me-1 shrink-0"} aria-label="จัดการสมาชิก"><Ellipsis /></DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-52">
            <DropdownMenu.Item onSelect={() => ok("โหลดข้อมูลสมาชิกใหม่แล้ว")}><RefreshCw />โหลดข้อมูลใหม่</DropdownMenu.Item>
            <DropdownMenu.Item onSelect={go(pwOpen, "pwNew")}><KeyRound />เปลี่ยนรหัสผ่านลูกค้า</DropdownMenu.Item>
            <DropdownMenu.Separator />
            <DropdownMenu.Item onSelect={go(() => (st.rebindOpen = true), "chkIn")}><ArrowLeftRight />ผูกกับบัญชีอื่น</DropdownMenu.Item>
            <DropdownMenu.Item variant="destructive" onSelect={go(() => unbindAsk(c), "ubT")}><Unlink />ยกเลิกการผูก</DropdownMenu.Item>
        </DropdownMenu.Content>
    </DropdownMenu.Root>
{/snippet}

{#if compact}
    <div class="flex min-w-0 items-center gap-2 text-sm" aria-label={"สรุปสมาชิก " + u.username}>
        <b class="min-w-0 truncate">{u.username}</b>
        <span class="text-muted-foreground shrink-0 text-xs">เครดิต <b class="text-foreground tabular-nums">{money(c.credit)}</b></span>
        {#if pd.length + pw.length}<Status tone="warning" class="shrink-0">ค้าง {pd.length + pw.length}</Status>{/if}
        <span class="ms-auto"></span>
        {@render menu()}
    </div>
{:else}
<section class="bg-card ring-foreground/10 flex flex-col gap-2.5 rounded-xl p-3 ring-1" aria-label={"สรุปสมาชิก " + u.username}>
    <!-- แถว 1: Username + สถานะ · เมนูจัดการ -->
    <div class="flex items-start gap-2">
        <div class="min-w-0 flex-1">
            <h2 class="flex min-w-0 items-center gap-1 text-base font-bold">
                <span class="truncate">{u.username}</span>
                <Button variant="ghost" size="icon-xs" class="shrink-0" aria-label="คัดลอก Username" onclick={() => copy(u.username, " Username ")}><Copy /></Button>
            </h2>
            <p class="text-muted-foreground flex min-w-0 flex-wrap items-center gap-x-1.5 text-xs">
                <span class="truncate">{u.fullname}</span>
                <span aria-hidden="true">·</span>
                <span class="inline-flex items-center gap-0.5 tabular-nums">{u.mobile}<Button variant="ghost" size="icon-xs" class="size-5" aria-label="คัดลอกเบอร์โทร" onclick={() => copy(u.mobile, "เบอร์โทร")}><Copy /></Button></span>
            </p>
        </div>
        <Status tone="success">ใช้งานได้</Status>
        {@render menu()}
    </div>

    <!-- แถว 2: ยอดเงิน -->
    <dl class="grid grid-cols-2 gap-2">
        <div class="bg-muted/60 rounded-lg px-2.5 py-1.5">
            <dt class="text-muted-foreground text-xs">เครดิตคงเหลือ</dt>
            <dd class="flex items-center gap-1">
                <span class="text-base font-bold tabular-nums">{money(c.credit)}</span>
                <Button variant="ghost" size="icon-xs" class="ms-auto" aria-label="โหลดเครดิตคงเหลือใหม่" title="โหลดเครดิตคงเหลือใหม่" onclick={() => ok("โหลดเครดิตคงเหลือแล้ว")}><RefreshCw /></Button>
            </dd>
        </div>
        <div class="bg-muted/60 rounded-lg px-2.5 py-1.5">
            <dt class="text-muted-foreground text-xs">กระเป๋าโบนัส</dt>
            <dd class="text-base font-bold tabular-nums">{money(c.bonus || 0)}</dd>
        </div>
    </dl>

    <!-- แถว 3: สถานะที่ต้องรู้ก่อนทำรายการ -->
    <ul class="flex flex-wrap gap-1.5" aria-label="สถานะสมาชิก">
        <li>{#if c.turn}<Status tone="warning" title={money(c.turn.done) + " / " + money(c.turn.need)}>ติดเทิร์น <span class="tabular-nums">{money(c.turn.done)}/{money(c.turn.need)}</span></Status>{:else}<Status tone="success">ไม่ติดเทิร์น</Status>{/if}</li>
        <li class="min-w-0 max-w-full">{#if c.promo}<Status tone="warning" class="max-w-full" title={c.promo}><span class="truncate">ติดโปร · {c.promo}</span></Status>{:else}<Status tone="success">ไม่ติดโปร</Status>{/if}</li>
        {#if pd.length}<li><Status tone="warning">ค้างฝาก {pd.length} · <span class="tabular-nums">{money(sum(pd))}</span></Status></li>{/if}
        {#if pw.length}<li><Status tone="warning">ค้างถอน {pw.length} · <span class="tabular-nums">{money(sum(pw))}</span></Status></li>{/if}
    </ul>
</section>
{/if}
