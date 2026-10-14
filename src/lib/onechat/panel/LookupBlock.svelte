<script>
    import Search from "@lucide/svelte/icons/search";
    import Save from "@lucide/svelte/icons/save";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import PasswordInput from "../ui/PasswordInput.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { accountsOf, money } from "../data.js";
    import { st, lookup, pwOpen, pwCancel, pwSave } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c?.user);
    let chk = $state(null);
</script>

<!-- ฟอร์มปิดแล้วช่องถูกลบ ⇒ เปิดใหม่ทุกครั้งปุ่มลูกตาเริ่มที่ซ่อน -->
{#snippet pwField(id, label, key)}
    <Field.Field data-invalid={!!st.pw.err}>
        <Field.Label for={id}>{label}</Field.Label>
        <PasswordInput {id} bind:value={st.pw[key]} aria-invalid={!!st.pw.err} />
    </Field.Field>
{/snippet}

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>ตรวจสอบ</Card.Title>
    </Card.Header>
    <Card.Content>
        <div class="flex gap-2">
            <InputGroup.Root class="flex-1">
                <InputGroup.Addon><Search /></InputGroup.Addon>
                <InputGroup.Input
                    bind:ref={chk}
                    id="chkIn"
                    placeholder="Search users"
                    value={st.lookup ?? u?.username ?? ""}
                    aria-label="ค้นหาลูกค้า"
                    aria-invalid={!!st.lookErr}
                    aria-describedby={st.lookErr ? "chkErr" : undefined}
                    onkeydown={(e) => e.key === "Enter" && lookup(chk.value)}
                />
            </InputGroup.Root>
            <Button size="sm" class="h-9" onclick={() => lookup(chk.value)}>ตรวจสอบ</Button>
        </div>
        {#if st.lookErr}<Field.Error id="chkErr">{st.lookErr}</Field.Error>{/if}
        {#if c}
        <dl class={DL}>
            <dt class={DT}>Username</dt><dd class={DD + " flex flex-wrap items-center gap-1.5"}>{u.username} <Status tone="success">Active</Status></dd>
            <dt class={DT}>Fullname</dt><dd class={DD}>{u.fullname}</dd>
            <dt class={DT}>Bank</dt><dd class={DD}>{u.bank}</dd>
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
        <Button variant="secondary" onclick={() => (st.accModal = true)}>ดูบัญชีธนาคารลูกค้า ({accountsOf(c).length} บัญชี)</Button>
        <!-- เปลี่ยนรหัสผ่านให้ลูกค้า: รหัสใหม่ + ยืนยันอีกครั้ง ไม่ต้องรู้รหัสเก่า · ทุกช่องมีปุ่มลูกตาแสดง/ซ่อน (เจ้าของงาน 14 ต.ค. 2026)
             รหัสผ่านของ Agent / แอดมินเองอยู่ที่ Settings › เปลี่ยนรหัสผ่าน -->
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
    </Card.Content>
</Card.Root>
