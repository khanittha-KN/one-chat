<!-- จัดการเครดิต — field (DESIGN-SYSTEM §10.3) · เติม/ถอนเป็น segmented เต็มกว้าง (§10.4 "สลับทาง") ·
     ปุ่มบันทึก: เติม = ปุ่มหลัก (เขียว LINE) · ถอน = แดงทึบ (ทึบเท่ากันทั้งคู่ — เจ้าของงานสั่ง) -->
<script>
    import Save from "@lucide/svelte/icons/save";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import FoldCard from "../ui/FoldCard.svelte";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { DLS, DTS, DDS } from "../ui/kv.js";
    import { st, saveCredit } from "../store.svelte.js";
    let { c } = $props();
    const add = $derived(st.credit.type === "add");
</script>

<FoldCard {c} title="จัดการเครดิต" contentClass="gap-3">
    <dl class={DLS}>
        <dt class={DTS}>ชื่อผู้ใช้</dt><dd class={DDS}>{c.user.username}</dd>
        <dt class={DTS}>เครดิตคงเหลือ</dt><dd class={DDS + " font-bold tabular-nums"}>{c.credit.toFixed(2)}</dd>
    </dl>
    <Field.Group class="gap-4">
        <Field.Set class="gap-2">
            <Field.Legend variant="label">ประเภท</Field.Legend>
            <ToggleGroup.Root
                type="single"
                variant="outline"
                class="w-full *:flex-1"
                aria-label="ประเภท"
                bind:value={() => st.credit.type, (t) => t && (st.credit.type = t)}
            >
                <ToggleGroup.Item value="add">เติมเครดิต</ToggleGroup.Item>
                <ToggleGroup.Item value="sub">ถอนเครดิต</ToggleGroup.Item>
            </ToggleGroup.Root>
        </Field.Set>
        <Field.Field data-invalid={!!st.credit.err}>
            <Field.Label for="crAmt">จำนวนเงิน</Field.Label>
            <InputGroup.Root>
                <InputGroup.Input id="crAmt" type="number" min="0" step="0.01" inputmode="decimal" placeholder="0.00" class="tabular-nums" bind:value={st.credit.amt} />
                <InputGroup.Addon align="inline-end">บาท</InputGroup.Addon>
            </InputGroup.Root>
        </Field.Field>
        <Field.Field>
            <Field.Label for="crNote">หมายเหตุ</Field.Label>
            <Input id="crNote" type="text" autocomplete="off" placeholder="เว้นว่างได้" bind:value={st.credit.note} />
        </Field.Field>
        <Field.Field data-invalid={!!st.credit.err}>
            <Field.Label for="crPass">รหัสผ่านแอดมิน</Field.Label>
            <Input id="crPass" type="password" autocomplete="new-password" bind:value={st.credit.pass} />
            {#if st.credit.err}<Field.Error>{st.credit.err}</Field.Error>{/if}
        </Field.Field>
    </Field.Group>
    {#if st.credit.msg && !st.credit.err}
        <p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4" aria-hidden="true" />{st.credit.msg}</p>
    {/if}
    {#if add}
        <Button onclick={() => saveCredit(c)}><Save data-icon="inline-start" />บันทึก</Button>
    {:else}
        <Button data-tone="destructive" data-fill="solid" onclick={() => saveCredit(c)}><Save data-icon="inline-start" />บันทึก</Button>
    {/if}
</FoldCard>
