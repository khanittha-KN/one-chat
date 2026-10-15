<script>
    import UserPlus from "@lucide/svelte/icons/user-plus";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import FoldCard from "../ui/FoldCard.svelte";
    import Send from "@lucide/svelte/icons/send";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { BANKS } from "../data.js";
    import { st, regCheck, regSubmit, regClear, askAcc, sendReg, regValidate } from "../store.svelte.js";
    let { c } = $props();
    const bad = $derived(st.regMsg && !st.regMsg.ok);
</script>

<!-- สมัครสมาชิก Player — ลูกค้าเก่าพับไว้ตั้งแต่แรก · ลูกค้าใหม่ (ยังไม่ผูก) และหลังสมัครสำเร็จกางไว้ ให้กด "ส่งเบอร์และรหัสให้ลูกค้า" ได้ทันที -->
<FoldCard {c} title="สมัครสมาชิก Player" def={!!c && !c.justReg && !c.unbound} contentClass="gap-3">
    <!-- ทุกช่องจำเป็น ยกเว้นรหัสแนะนำ · ตรวจตอนออกจากช่องและตอนกดสมัคร · ข้อความบอกวิธีแก้ใต้ช่อง (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
    <Field.Group class="gap-4">
        <Field.Field data-invalid={!!st.regErr.name}>
            <Field.Label for="regName">ชื่อ <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
            <Input id="regName" autocomplete="off" bind:value={st.reg.name} aria-invalid={!!st.regErr.name} aria-describedby={st.regErr.name ? "regnameErr" : undefined} onblur={() => st.reg.name && regValidate("name")} />
            {#if st.regErr.name}<Field.Error id="regnameErr">{st.regErr.name}</Field.Error>{/if}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.phone}>
            <Field.Label for="regPhone">เบอร์ <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
            <Input id="regPhone" autocomplete="off" inputmode="tel" placeholder="0XXXXXXXXX" bind:value={st.reg.phone} aria-invalid={!!st.regErr.phone} aria-describedby={st.regErr.phone ? "regphoneErr" : undefined} onblur={() => st.reg.phone && regValidate("phone")} />
            {#if st.regErr.phone}<Field.Error id="regphoneErr">{st.regErr.phone}</Field.Error>{/if}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.bank}>
            <Field.Label for="regBank">เลือกธนาคาร <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
            <NativeSelect id="regBank" class="w-full" bind:value={st.reg.bank} aria-invalid={!!st.regErr.bank} aria-describedby={st.regErr.bank ? "regbankErr" : undefined} onchange={() => regValidate("bank")}>
                <NativeSelectOption value="">เลือกธนาคาร</NativeSelectOption>
                {#each BANKS as b (b.code)}<NativeSelectOption value={b.code}>{b.name}</NativeSelectOption>{/each}
            </NativeSelect>
            {#if st.regErr.bank}<Field.Error id="regbankErr">{st.regErr.bank}</Field.Error>{/if}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.no}>
            <Field.Label for="regNo">เลขที่บัญชี <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
            <div class="flex gap-2">
                <Input id="regNo" class="min-w-0 flex-1 tabular-nums" autocomplete="off" inputmode="numeric" bind:value={st.reg.no} aria-invalid={!!st.regErr.no} aria-describedby={st.regErr.no ? "regnoErr" : undefined} onblur={() => st.reg.no && regValidate("no")} />
                <Button variant="outline" class="shrink-0" onclick={regCheck}>Check เลข</Button>
            </div>
            {#if st.regErr.no}<Field.Error id="regnoErr">{st.regErr.no}</Field.Error>{/if}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.pass}>
            <Field.Label for="regPass">รหัสผ่าน <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
            <Input id="regPass" type="password" autocomplete="new-password" bind:value={st.reg.pass} aria-invalid={!!st.regErr.pass} aria-describedby={st.regErr.pass ? "regpassErr" : undefined} onblur={() => st.reg.pass && regValidate("pass")} />
            {#if st.regErr.pass}<Field.Error id="regpassErr">{st.regErr.pass}</Field.Error>{/if}
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
    <Button variant="outline" onclick={() => sendReg(c)}><Send data-icon="inline-start" />ส่งเบอร์และรหัสให้ลูกค้า</Button>
    {#if c}<Button variant="secondary" onclick={() => askAcc(c)}>ขอเลขบัญชีลูกค้า</Button>{/if}
</FoldCard>
