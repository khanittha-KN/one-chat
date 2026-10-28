<script>
    import UserPlus from "@lucide/svelte/icons/user-plus";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import Send from "@lucide/svelte/icons/send";
    import X from "@lucide/svelte/icons/x";
    import FoldCard from "../ui/FoldCard.svelte";
    import PasswordInput from "../ui/PasswordInput.svelte";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { NativeSelect, NativeSelectOption } from "$lib/components/ui/native-select/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { BANKS } from "../data.js";
    import { db, st, regCheck, regSubmit, regClear, askAcc, sendReg, regValidate, MKT, refSearch, refPick, refClear, partnerLookup } from "../store.svelte.js";
    let { c } = $props();
    const bad = $derived(st.regMsg && !st.regMsg.ok);
    const refRes = $derived((st.reg.refRes || []).map((id) => db.cases.find((x) => x.id === id)).filter(Boolean));
</script>

<!-- ป้ายช่องจำเป็น · ข้อความผิดใต้ช่อง -->
{#snippet req(id, label)}
    <Field.Label for={id}>{label} <span class="field-required text-destructive" aria-hidden="true">*</span></Field.Label>
{/snippet}
{#snippet err(key)}
    {#if st.regErr[key]}<Field.Error id={"reg" + key + "Err"}>{st.regErr[key]}</Field.Error>{/if}
{/snippet}

<!-- สมัครสมาชิก Player — ตามเว็บจริง 27 ต.ค. 2026 · ลูกค้าเก่าเป็นปุ่มในแถวบน · ลูกค้าใหม่ (ยังไม่ผูก) และหลังสมัครสำเร็จกางเป็นการ์ด
     สมัครแล้วระบบผูกสมาชิกกับแชทนี้ทันที · "ส่งข้อมูลให้ลูกค้า" กดได้หลังสมัครสำเร็จ (ส่งชื่อผู้ใช้ = เบอร์โทร และรหัสผ่าน) -->
<FoldCard {c} title="สมัครสมาชิก Player" icon={UserPlus} def={!!c && !c.justReg && !c.unbound} contentClass="gap-3">
    <Field.Group class="gap-4">
        <Field.Field data-invalid={!!st.regErr.phone}>
            {@render req("regPhone", "เบอร์")}
            <Input id="regPhone" autocomplete="off" inputmode="tel" placeholder="0XXXXXXXXX" bind:value={st.reg.phone} aria-invalid={!!st.regErr.phone} onblur={() => st.reg.phone && regValidate("phone")} />
            {@render err("phone")}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.bank}>
            {@render req("regBank", "เลือกธนาคาร")}
            <NativeSelect id="regBank" class="w-full" bind:value={st.reg.bank} aria-invalid={!!st.regErr.bank} onchange={() => regValidate("bank")}>
                <NativeSelectOption value="">เลือกธนาคาร</NativeSelectOption>
                {#each BANKS as b (b.code)}<NativeSelectOption value={b.code}>{b.name}</NativeSelectOption>{/each}
            </NativeSelect>
            {@render err("bank")}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.no}>
            {@render req("regNo", "เลขที่บัญชี")}
            <div class="flex gap-2">
                <Input id="regNo" class="min-w-0 flex-1 tabular-nums" autocomplete="off" inputmode="numeric" placeholder="xxx-x-xxxxx-x" bind:value={st.reg.no} aria-invalid={!!st.regErr.no} onblur={() => st.reg.no && regValidate("no")} />
                <Button variant="outline" class="shrink-0" title="ตรวจว่าเลขบัญชีนี้สมัครสมาชิกไว้แล้วหรือยัง" onclick={regCheck}>Check เลข</Button>
            </div>
            {@render err("no")}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.acct}>
            {@render req("regAcct", "ชื่อบัญชีธนาคาร")}
            <Input id="regAcct" autocomplete="off" placeholder="ใส่ชื่อบัญชีธนาคาร" bind:value={st.reg.acct} aria-invalid={!!st.regErr.acct} onblur={() => st.reg.acct && regValidate("acct")} />
            <Field.Description class="text-xs">(ชื่อ-สกุล ต้องใช้ตรงกับชื่อบัญชีที่สมัครเท่านั้น)</Field.Description>
            {@render err("acct")}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.pass}>
            {@render req("regPass", "รหัสผ่าน")}
            <PasswordInput id="regPass" placeholder="6-30 ตัวอักษร ไม่มีช่องว่าง" bind:value={st.reg.pass} aria-invalid={!!st.regErr.pass} />
            {@render err("pass")}
        </Field.Field>
        <Field.Field data-invalid={!!st.regErr.mkt}>
            {@render req("regMkt", "ช่องทางการตลาด")}
            <NativeSelect id="regMkt" class="w-full" bind:value={st.reg.mkt} aria-invalid={!!st.regErr.mkt} onchange={() => regValidate("mkt")}>
                <NativeSelectOption value="">เลือกช่องทางการตลาด</NativeSelectOption>
                {#each MKT as m (m)}<NativeSelectOption value={m}>{m}</NativeSelectOption>{/each}
            </NativeSelect>
            {@render err("mkt")}
        </Field.Field>
        <!-- ผู้แนะนำ: ค้นหาเพื่อนที่แนะนำมา ⇒ เลือก (ช่องทางการตลาดเปลี่ยนเป็นของผู้แนะนำ เปลี่ยนกลับได้) -->
        <Field.Field data-invalid={!!st.regErr.ref}>
            <Field.Label for="regRef">ผู้แนะนำ</Field.Label>
            {#if st.reg.referrer}
                <Item.Root variant="outline" size="sm">
                    <Item.Content class="min-w-0">
                        <Item.Title class="w-full"><span class="truncate">{st.reg.referrer.username}</span></Item.Title>
                        <Item.Description class="truncate">{st.reg.referrer.name}</Item.Description>
                    </Item.Content>
                    <Item.Actions><Button variant="ghost" size="icon-sm" aria-label="เอาผู้แนะนำออก" onclick={refClear}><X /></Button></Item.Actions>
                </Item.Root>
            {:else}
                <div class="flex gap-2">
                    <Input id="regRef" class="min-w-0 flex-1" autocomplete="off" placeholder="username / เบอร์ / ชื่อ ของผู้แนะนำ" bind:value={st.reg.refQ} onkeydown={(e) => e.key === "Enter" && refSearch()} />
                    <Button variant="outline" class="shrink-0" onclick={refSearch}>ค้นหา</Button>
                </div>
                {@render err("ref")}
                {#if st.reg.refRes}
                    {#if refRes.length}
                        <div class="flex flex-col gap-1" role="group" aria-label="ผลการค้นหาผู้แนะนำ">
                            {#each refRes as m (m.id)}
                                <Item.Root variant="outline" size="sm">
                                    {#snippet child({ props })}
                                        <button type="button" {...props} class={props.class + " hover:bg-muted text-start"} aria-label={"เลือกเป็นผู้แนะนำ: " + m.user.username} onclick={() => refPick(m.id)}>
                                            <Item.Content class="min-w-0">
                                                <Item.Title class="w-full"><span class="truncate">{m.user.username}</span></Item.Title>
                                                <Item.Description class="truncate">{m.user.fullname}</Item.Description>
                                            </Item.Content>
                                        </button>
                                    {/snippet}
                                </Item.Root>
                            {/each}
                        </div>
                    {:else if !st.regErr.ref}<p class="text-muted-foreground text-xs">ไม่พบสมาชิก</p>{/if}
                {/if}
            {/if}
        </Field.Field>
        <Field.Field data-invalid={!!(st.regErr.partner || st.reg.partnerErr)}>
            <Field.Label for="regPartner">รหัสพันธมิตร</Field.Label>
            <div class="flex gap-2">
                <Input id="regPartner" class="min-w-0 flex-1 tabular-nums" autocomplete="off" inputmode="numeric" placeholder="ตัวเลข" bind:value={st.reg.partner} />
                <Button variant="outline" class="shrink-0" onclick={partnerLookup}>ดูชื่อ</Button>
            </div>
            {#if st.reg.partnerName}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4" aria-hidden="true" />พันธมิตร: {st.reg.partnerName}</p>{/if}
            {#if st.reg.partnerErr || st.regErr.partner}<Field.Error>{st.reg.partnerErr || st.regErr.partner}</Field.Error>{/if}
        </Field.Field>
    </Field.Group>
    {#if st.regMsg}
        {#if bad}<Field.Error>{st.regMsg.text}</Field.Error>
        {:else}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4 shrink-0" aria-hidden="true" />{st.regMsg.text}</p>{/if}
    {/if}
    <div class="flex gap-2 *:flex-1">
        <Button onclick={() => regSubmit(c)}><UserPlus data-icon="inline-start" />สมัครสมาชิก</Button>
        <Button variant="outline" onclick={regClear}>ล้างฟอร์ม</Button>
    </div>
    {#if c}
        <Button variant="secondary" title="ใส่ข้อความขอเลขที่บัญชีในช่องพิมพ์ — กดส่งเอง" onclick={() => askAcc(c)}>ขอเลขบัญชีลูกค้า</Button>
        <Field.Field>
            <Button disabled={!c.lastReg} title="ส่งชื่อผู้ใช้ (เบอร์โทร) และรหัสผ่านของสมาชิกที่เพิ่งสมัครให้ลูกค้าในแชทนี้" onclick={() => sendReg(c)}><Send data-icon="inline-start" />ส่งข้อมูลให้ลูกค้า</Button>
            {#if !c.lastReg}<Field.Description class="text-xs">กดได้หลังสมัครสมาชิกสำเร็จ</Field.Description>{/if}
        </Field.Field>
    {/if}
</FoldCard>
