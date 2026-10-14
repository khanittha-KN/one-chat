<script>
    import Search from "@lucide/svelte/icons/search";
    import Save from "@lucide/svelte/icons/save";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { accountsOf, money } from "../data.js";
    import { st, lookup, pwOpen, pwCancel, pwSave } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c.user);
    let chk = $state(null);
</script>

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>ตรวจสอบ</Card.Title>
    </Card.Header>
    <Card.Content>
        <div class="flex gap-2">
            <InputGroup.Root class="flex-1">
                <InputGroup.Addon><Search /></InputGroup.Addon>
                <InputGroup.Input bind:ref={chk} id="chkIn" placeholder="Search users" value={st.lookup || u.username} aria-label="ค้นหาลูกค้า" />
            </InputGroup.Root>
            <Button size="sm" class="h-9" onclick={() => lookup(chk.value)}>ตรวจสอบ</Button>
        </div>
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
        {#if !st.pw.open}
            <Button variant="outline" size="sm" onclick={pwOpen}>เปลี่ยนรหัสผ่าน</Button>
            {#if st.pw.msg}<p class="text-success flex items-center gap-1.5 text-sm"><CircleCheck class="size-4" aria-hidden="true" />{st.pw.msg}</p>{/if}
        {:else}
            <div class="bg-muted/50 flex flex-col gap-4 rounded-lg border p-3">
                <Field.Group class="gap-4">
                    <Field.Field>
                        <Field.Label for="pwNew">รหัสผ่านใหม่</Field.Label>
                        <Input id="pwNew" type="password" autocomplete="new-password" bind:value={st.pw.a} aria-invalid={!!st.pw.err} />
                    </Field.Field>
                    <Field.Field data-invalid={!!st.pw.err}>
                        <Field.Label for="pwConf">ยืนยันรหัสผ่านใหม่</Field.Label>
                        <Input id="pwConf" type="password" autocomplete="new-password" bind:value={st.pw.b} aria-invalid={!!st.pw.err} />
                        {#if st.pw.err}<Field.Error>{st.pw.err}</Field.Error>{/if}
                    </Field.Field>
                </Field.Group>
                <div class="flex gap-2 *:flex-1">
                    <Button size="sm" data-tone="success" data-fill="solid" onclick={() => pwSave(c)}><Save data-icon="inline-start" />บันทึกรหัสผ่านใหม่</Button>
                    <Button variant="outline" size="sm" onclick={pwCancel}>ยกเลิก</Button>
                </div>
            </div>
        {/if}
    </Card.Content>
</Card.Root>
