<script>
    import UserPlus from "@lucide/svelte/icons/user-plus";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { BANKS } from "../data.js";
    import { st, regCheck, regSubmit, regClear, askAcc } from "../store.svelte.js";
    let { c } = $props();
    const bad = $derived(st.regMsg && !st.regMsg.ok);
</script>

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>สมัครสมาชิก Player</Card.Title>
    </Card.Header>
    <Card.Content class="gap-3">
        <Field.Group class="gap-4">
            <Field.Field>
                <Field.Label for="regName">ชื่อ</Field.Label>
                <Input id="regName" autocomplete="off" bind:value={st.reg.name} />
            </Field.Field>
            <Field.Field>
                <Field.Label for="regPhone">เบอร์</Field.Label>
                <Input id="regPhone" autocomplete="off" inputmode="tel" bind:value={st.reg.phone} />
            </Field.Field>
            <Field.Field>
                <Field.Label for="regBank">เลือกธนาคาร</Field.Label>
                <NativeSelect id="regBank" class="w-full" bind:value={st.reg.bank}>
                    <NativeSelectOption value="">เลือกธนาคาร</NativeSelectOption>
                    {#each BANKS as b (b.code)}<NativeSelectOption value={b.code}>{b.name}</NativeSelectOption>{/each}
                </NativeSelect>
            </Field.Field>
            <Field.Field>
                <Field.Label for="regNo">เลขที่บัญชี</Field.Label>
                <div class="flex gap-2">
                    <Input id="regNo" class="min-w-0 flex-1 tabular-nums" autocomplete="off" inputmode="numeric" bind:value={st.reg.no} />
                    <Button variant="outline" class="shrink-0" onclick={regCheck}>Check เลข</Button>
                </div>
            </Field.Field>
            <Field.Field>
                <Field.Label for="regPass">รหัสผ่าน</Field.Label>
                <Input id="regPass" type="password" autocomplete="new-password" bind:value={st.reg.pass} />
            </Field.Field>
            <Field.Field>
                <Field.Label for="regRef">รหัสแนะนำ</Field.Label>
                <Input id="regRef" autocomplete="off" placeholder="เว้นว่างได้" bind:value={st.reg.ref} />
            </Field.Field>
        </Field.Group>
        {#if st.regMsg}
            {#if bad}<Field.Error>{st.regMsg.text}</Field.Error>
            {:else}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4" aria-hidden="true" />{st.regMsg.text}</p>{/if}
        {/if}
        <div class="flex gap-2 *:flex-1">
            <Button onclick={() => regSubmit(c)}><UserPlus data-icon="inline-start" />สมัครสมาชิก</Button>
            <Button variant="outline" onclick={regClear}>ล้างฟอร์ม</Button>
        </div>
        {#if c}<Button variant="secondary" onclick={() => askAcc(c)}>ขอเลขบัญชีลูกค้า</Button>{/if}
    </Card.Content>
</Card.Root>
