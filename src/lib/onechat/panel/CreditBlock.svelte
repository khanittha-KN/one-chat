<!-- จัดการเครดิต — ตามเว็บจริง 27 ต.ค. 2026: ชื่อผู้ใช้ · เครดิตคงเหลือ (+ โหลดใหม่) · เติม/ถอน · จำนวนเงิน (ใส่ลูกน้ำให้) · หมายเหตุ · รหัสผ่านแอดมิน
     บันทึก ⇒ ขั้นยืนยัน "ยืนยันเติมเครดิต / ยืนยันถอนเครดิต" ⇒ ปรับทันที ไม่แจ้งลูกค้าในแชท -->
<script>
    import Save from "@lucide/svelte/icons/save";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import FoldCard from "../ui/FoldCard.svelte";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { DLS, DTS, DDS } from "../ui/kv.js";
    import { money } from "../data.js";
    import { st, ok, saveCredit, confirmCredit, creditCancel } from "../store.svelte.js";
    let { c } = $props();
    const add = $derived(st.credit.type === "add");
    // รับเฉพาะตัวเลข ทศนิยม 2 ตำแหน่ง · ใส่ลูกน้ำให้เอง (1000 → 1,000)
    function fmt(v) {
        const raw = v.replace(/[^\d.]/g, "");
        const [i, ...d] = raw.split(".");
        const head = i ? Number(i).toLocaleString("en-US") : "";
        return d.length ? head + "." + d.join("").slice(0, 2) : head;
    }
    const amtShown = $derived(st.credit.amt ? money(parseFloat(String(st.credit.amt).replace(/,/g, "")) || 0) : "0.00");
</script>

<FoldCard {c} title="จัดการเครดิต" contentClass="gap-3">
    <dl class={DLS}>
        <dt class={DTS}>ชื่อผู้ใช้</dt><dd class={DDS}>{c.user.username}</dd>
        <dt class={DTS}>เครดิตคงเหลือ</dt>
        <dd class={DDS + " flex items-center gap-1.5 font-bold tabular-nums"}>
            {money(c.credit)}
            <Button variant="ghost" size="icon-xs" aria-label="โหลดเครดิตคงเหลือใหม่" title="โหลดเครดิตคงเหลือใหม่" onclick={() => ok("โหลดเครดิตคงเหลือแล้ว")}><RefreshCw /></Button>
        </dd>
    </dl>
    {#if !st.credit.confirm}
        <Field.Group class="gap-4">
            <Field.Set class="gap-2">
                <Field.Legend variant="label">ประเภท</Field.Legend>
                <ToggleGroup.Root type="single" variant="outline" class="w-full *:flex-1" aria-label="ประเภท" bind:value={() => st.credit.type, (t) => t && (st.credit.type = t)}>
                    <ToggleGroup.Item value="add">เติมเครดิต</ToggleGroup.Item>
                    <ToggleGroup.Item value="sub">ถอนเครดิต</ToggleGroup.Item>
                </ToggleGroup.Root>
            </Field.Set>
            <Field.Field data-invalid={!!st.credit.err}>
                <Field.Label for="crAmt">จำนวนเงิน</Field.Label>
                <InputGroup.Root>
                    <InputGroup.Input id="crAmt" type="text" inputmode="decimal" placeholder="0.00" class="tabular-nums" bind:value={() => st.credit.amt, (v) => (st.credit.amt = fmt(v))} />
                    <InputGroup.Addon align="inline-end">บาท</InputGroup.Addon>
                </InputGroup.Root>
            </Field.Field>
            <Field.Field>
                <Field.Label for="crNote">หมายเหตุ</Field.Label>
                <Input id="crNote" type="text" autocomplete="off" placeholder="เว้นว่างได้" maxlength={300} bind:value={st.credit.note} />
            </Field.Field>
            <Field.Field data-invalid={!!st.credit.err}>
                <Field.Label for="crPass">รหัสผ่านแอดมิน</Field.Label>
                <Input id="crPass" type="password" autocomplete="off" bind:value={st.credit.pass} />
                <Field.Description class="text-xs">รหัสผ่านของบัญชีที่ล็อกอินอยู่ — ถามทุกครั้งก่อนปรับเครดิต</Field.Description>
                {#if st.credit.err}<Field.Error>{st.credit.err}</Field.Error>{/if}
            </Field.Field>
        </Field.Group>
        {#if st.credit.msg && !st.credit.err}
            <p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4 shrink-0" aria-hidden="true" />{st.credit.msg}</p>
        {/if}
        {#if add}
            <Button onclick={() => saveCredit(c)}><Save data-icon="inline-start" />บันทึก</Button>
        {:else}
            <Button data-tone="destructive" data-fill="solid" onclick={() => saveCredit(c)}><Save data-icon="inline-start" />บันทึก</Button>
        {/if}
    {:else}
        <!-- ขั้นยืนยัน: สรุปรายการก่อนปรับจริง -->
        <div class={"flex flex-col gap-2 rounded-lg border p-3 " + (add ? "border-success/40 bg-success/5" : "border-destructive/40 bg-destructive/5")} role="alertdialog" aria-labelledby="crT">
            <p id="crT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class={(add ? "text-success" : "text-destructive") + " size-4"} aria-hidden="true" />{add ? "เติมเครดิต" : "ถอนเครดิต"} {amtShown} บาท</p>
            <p class="text-sm">{add ? "ให้" : "ของ"} <b>{c.user.username}</b>{st.credit.note ? " · " + st.credit.note : ""}</p>
            <p class="text-muted-foreground text-xs">ระบบปรับเครดิตของสมาชิกทันที — ไม่แจ้งลูกค้าในแชท และจดว่าเป็นรายการของคุณ</p>
            <div class="flex gap-2 *:flex-1">
                <Button data-tone={add ? "success" : "destructive"} data-fill="solid" size="sm" onclick={() => confirmCredit(c)}>{add ? "ยืนยันเติมเครดิต" : "ยืนยันถอนเครดิต"}</Button>
                <Button variant="outline" size="sm" onclick={creditCancel}>ยกเลิก</Button>
            </div>
        </div>
    {/if}
</FoldCard>
