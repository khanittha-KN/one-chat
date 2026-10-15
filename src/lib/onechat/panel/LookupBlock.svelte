<!-- ตรวจสอบ — ค้นหาด้วย username / เบอร์ · เว็บต้นฉบับ 15 ต.ค. 2026: ป้าย "ใช้งานได้" · ธนาคารมี ✓ ยืนยันแล้ว · ปิดเลขบัญชี/เบอร์บางส่วน
     ปุ่ม เลิกผูก + รีเฟรช · แชทลูกค้าใหม่ (unbound) ⇒ ตรวจสอบเจอแล้วผูกสมาชิกกับแชทนี้ · บัญชีธนาคารย้ายไปการ์ด "บัญชีธนาคาร" -->
<script>
    import Search from "@lucide/svelte/icons/search";
    import Save from "@lucide/svelte/icons/save";
    import Check from "@lucide/svelte/icons/check";
    import Unlink from "@lucide/svelte/icons/unlink";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import PasswordInput from "../ui/PasswordInput.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { money } from "../data.js";
    import { st, ok, lookup, pwOpen, pwCancel, pwSave, unbindMember } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c?.user);
    const bound = $derived(c && !c.unbound);
    let chk = $state(null);
</script>

<!-- ฟอร์มปิดแล้วช่องถูกลบ ⇒ เปิดใหม่ทุกครั้งปุ่มลูกตาเริ่มที่ซ่อน -->
{#snippet pwField(id, label, key)}
    <Field.Field data-invalid={!!st.pw.err}>
        <Field.Label for={id}>{label}</Field.Label>
        <PasswordInput {id} bind:value={st.pw[key]} aria-invalid={!!st.pw.err} />
    </Field.Field>
{/snippet}

<FoldCard {c} title="ตรวจสอบ" contentClass="gap-3">
    <div class="flex gap-2">
        <InputGroup.Root class="flex-1">
            <InputGroup.Addon><Search /></InputGroup.Addon>
            <InputGroup.Input
                bind:ref={chk}
                id="chkIn"
                placeholder="Search users — username / เบอร์"
                value={st.lookup ?? (bound ? u.username : "")}
                aria-label="ค้นหาลูกค้า"
                aria-invalid={!!st.lookErr}
                aria-describedby={st.lookErr ? "chkErr" : undefined}
                onkeydown={(e) => e.key === "Enter" && lookup(chk.value)}
            />
        </InputGroup.Root>
        <Button size="sm" class="h-9" onclick={() => lookup(chk.value)}>ตรวจสอบ</Button>
    </div>
    {#if st.lookErr}<Field.Error id="chkErr">{st.lookErr}</Field.Error>{/if}
    {#if c && c.unbound}
        <p class="text-muted-foreground text-sm">ยังไม่ได้ผูกสมาชิกกับแชทนี้ — ตรวจสอบด้วย username ด้านบนเพื่อผูก หรือสมัครสมาชิกใหม่ที่การ์ด "สมัครสมาชิก Player" ด้านล่าง</p>
    {:else if c}
        <dl class={DL}>
            <dt class={DT}>Username</dt><dd class={DD + " flex flex-wrap items-center gap-1.5"}>{u.username} <Status tone="success">ใช้งานได้</Status></dd>
            <dt class={DT}>Fullname</dt><dd class={DD}>{u.fullname}</dd>
            <dt class={DT}>Bank</dt>
            <dd class={DD + " flex items-center gap-1"}>ธนาคาร{u.bank} <Check class="text-success size-4" aria-label="ยืนยันแล้ว" /></dd>
            <!-- เลขบัญชีและเบอร์แสดงเต็ม ไม่ปิดเลข (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
            <dt class={DT}>Number</dt><dd class={DD + " tabular-nums"}>{u.number}</dd>
            <dt class={DT}>Mobile</dt><dd class={DD + " tabular-nums"}>{u.mobile}</dd>
            <dt class={DT}>เทิร์น</dt>
            <dd class={DD + " flex flex-wrap items-center gap-1.5"}>
                {#if c.turn}<Status tone="warning">ติดเทิร์น</Status>
                    <span class="text-muted-foreground text-xs tabular-nums">{money(c.turn.done)} / {money(c.turn.need)}</span>
                {:else}<Status tone="success">ไม่ติดเทิร์น</Status>{/if}
            </dd>
            <dt class={DT}>โปรโมชั่น</dt>
            <dd class={DD + " flex flex-wrap items-center gap-1.5"}>
                {#if c.promo}<Status tone="warning">ติดโปร</Status> <span class="text-muted-foreground text-xs">{c.promo}</span>
                {:else}<Status tone="success">ไม่ติดโปร</Status>{/if}
            </dd>
        </dl>
        <div class="flex gap-2">
            <Button variant="outline" size="sm" class="flex-1" onclick={() => unbindMember(c)}><Unlink data-icon="inline-start" />เลิกผูก</Button>
            <Button variant="outline" size="icon-sm" class="size-8" aria-label="รีเฟรชข้อมูลสมาชิก" title="รีเฟรช" onclick={() => ok("รีเฟรชข้อมูลสมาชิกแล้ว")}><RefreshCw /></Button>
        </div>
        <!-- เปลี่ยนรหัสผ่านให้ลูกค้า: รหัสใหม่ + ยืนยันอีกครั้ง ไม่ต้องรู้รหัสเก่า · รหัสของ Agent / แอดมินเองอยู่ที่ Settings › เปลี่ยนรหัสผ่าน -->
        {#if !st.pw.open}
            <Button variant="outline" size="sm" onclick={pwOpen}>เปลี่ยนรหัสผ่านลูกค้า</Button>
            {#if st.pw.msg}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4" aria-hidden="true" />{st.pw.msg}</p>{/if}
        {:else}
            <div class="bg-muted/50 flex flex-col gap-3 rounded-lg border p-3">
                {@render pwField("pwNew", "รหัสผ่านใหม่ของ " + u.username, "a")}
                {@render pwField("pwConf", "ยืนยันรหัสผ่านใหม่", "b")}
                {#if st.pw.err}<Field.Error>{st.pw.err}</Field.Error>{/if}
                <div class="flex gap-2 *:flex-1">
                    <Button size="sm" onclick={() => pwSave(c)}><Save data-icon="inline-start" />บันทึกรหัสผ่านใหม่</Button>
                    <Button variant="outline" size="sm" onclick={pwCancel}>ยกเลิก</Button>
                </div>
            </div>
        {/if}
    {/if}
</FoldCard>
