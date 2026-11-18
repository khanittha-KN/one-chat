<!-- ฝาก P2P (เจ้าของงานสั่ง 18 พ.ย. 2026) — เฉพาะลูกค้าที่ใช้ระบบ P2P อยู่แล้ว (c.p2p)
     แจ้งฝาก / แจ้งถอน · บัญชีที่เลือก (เลขบัญชี · ชื่อบัญชี) · ชื่อบัญชีลูกค้า · ยอด · วันที่ · เวลา · ปุ่มยืนยัน
     ด้านล่าง: เลือกบัญชีธนาคาร P2P (บัญชีที่ปิดรับชั่วคราวเลือกไม่ได้) · ยืนยันแล้วเป็นรายการในประวัติฝากถอน (ช่องทาง P2P) -->
<script>
    import Check from "@lucide/svelte/icons/check";
    import Copy from "@lucide/svelte/icons/copy";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import CircleOff from "@lucide/svelte/icons/circle-off";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import { DLS, DTS, DDS } from "../ui/kv.js";
    import { P2P_ACC, p2pAcc, bankOf, money, thDateTime } from "../data.js";
    import { st, ok, p2pSubmit, p2pConfirm, p2pReset } from "../store.svelte.js";
    let { c } = $props();
    const f = $derived(st.p2p);
    const dep = $derived(f.mode === "dep");
    const acc = $derived(p2pAcc(f.acc));
    // รับเฉพาะตัวเลข ทศนิยม 2 ตำแหน่ง · ใส่ลูกน้ำให้เอง (1000 → 1,000)
    function fmt(v) {
        const raw = v.replace(/[^\d.]/g, "");
        const [i, ...d] = raw.split(".");
        const head = i ? Number(i).toLocaleString("en-US") : "";
        return d.length ? head + "." + d.join("").slice(0, 2) : head;
    }
    function copy(v) {
        navigator.clipboard?.writeText(v);
        ok("คัดลอกเลขบัญชีแล้ว");
    }
</script>

<FoldCard {c} title="ฝาก P2P" contentClass="gap-3">
    <ToggleGroup.Root type="single" variant="outline" class="w-full *:flex-1" aria-label="ประเภทรายการ P2P" bind:value={() => f.mode, (m) => m && p2pReset(m)}>
        <ToggleGroup.Item value="dep">แจ้งฝาก</ToggleGroup.Item>
        <ToggleGroup.Item value="wd">แจ้งถอน</ToggleGroup.Item>
    </ToggleGroup.Root>

    <!-- บัญชีที่เลือก + บัญชีลูกค้า -->
    <dl class={DLS}>
        <dt class={DTS}>บัญชีบริษัท</dt>
        <dd class={DDS}>
            {#if acc}
                <span class="flex flex-wrap items-center gap-1.5">
                    <span class="font-bold">{bankOf(acc.bank).name}</span>
                    <span class="tabular-nums">{acc.no}</span>
                    <Button variant="ghost" size="icon-xs" aria-label="คัดลอกเลขบัญชี" onclick={() => copy(acc.no)}><Copy /></Button>
                </span>
                <span class="text-muted-foreground block text-xs">{acc.name}</span>
            {:else}<span class="text-muted-foreground">เลือกบัญชีด้านล่าง</span>{/if}
        </dd>
        <dt class={DTS}>ชื่อบัญชีลูกค้า</dt>
        <dd class={DDS}>
            <span class="block">{c.user.fullname}</span>
            <span class="text-muted-foreground block text-xs tabular-nums">{bankOf(c.user.bankCode).name} {c.user.number}</span>
        </dd>
    </dl>

    {#if f.ask}
        <!-- ขั้นยืนยัน -->
        <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="p2pT">
            <p id="p2pT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />{dep ? "ยืนยันแจ้งฝาก P2P?" : "ยืนยันแจ้งถอน P2P?"}</p>
            <p class="text-sm"><b class="tabular-nums">{money(parseFloat(String(f.amt).replace(/,/g, "")) || 0)} บาท</b> · {bankOf(acc.bank).name} {acc.no} ({acc.name})</p>
            <p class="text-muted-foreground text-xs tabular-nums">{thDateTime(f.date, f.time)} · ลูกค้า {c.user.username}</p>
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => p2pConfirm(c)}><Check data-icon="inline-start" />{dep ? "ยืนยันแจ้งฝาก" : "ยืนยันแจ้งถอน"}</Button>
                <Button variant="outline" size="sm" onclick={() => (st.p2p.ask = false)}>ยกเลิก</Button>
            </div>
        </div>
    {:else}
        <Field.Group class="gap-3">
            <Field.Field data-invalid={!!f.err.amt}>
                <Field.Label for="p2pAmt">{dep ? "ยอดฝาก" : "ยอดถอน"}</Field.Label>
                <InputGroup.Root>
                    <InputGroup.Input id="p2pAmt" inputmode="decimal" placeholder="0.00" class="text-end tabular-nums" aria-invalid={!!f.err.amt} bind:value={() => f.amt, (v) => (st.p2p.amt = fmt(v))} />
                    <InputGroup.Addon align="inline-end">บาท</InputGroup.Addon>
                </InputGroup.Root>
                {#if f.err.amt}<Field.Error>{f.err.amt}</Field.Error>{/if}
            </Field.Field>
            <div class="grid grid-cols-2 gap-2">
                <Field.Field data-invalid={!!f.err.date}>
                    <Field.Label for="p2pDate">วันที่</Field.Label>
                    <Input id="p2pDate" type="date" aria-invalid={!!f.err.date} bind:value={st.p2p.date} />
                    {#if f.err.date}<Field.Error>{f.err.date}</Field.Error>{/if}
                </Field.Field>
                <Field.Field data-invalid={!!f.err.time}>
                    <Field.Label for="p2pTime">เวลา</Field.Label>
                    <Input id="p2pTime" type="time" aria-invalid={!!f.err.time} bind:value={st.p2p.time} />
                    {#if f.err.time}<Field.Error>{f.err.time}</Field.Error>{/if}
                </Field.Field>
            </div>
        </Field.Group>
        {#if f.msg}<p class="text-success flex items-center gap-1.5 text-sm" role="status"><CircleCheck class="size-4 shrink-0" aria-hidden="true" />{f.msg}</p>{/if}
        <Button class="w-full" onclick={p2pSubmit}><Check data-icon="inline-start" />{dep ? "ยืนยันแจ้งฝาก" : "ยืนยันแจ้งถอน"}</Button>
    {/if}

    <!-- เลือกบัญชีธนาคาร P2P -->
    <section class="flex flex-col gap-2 border-t pt-3" aria-labelledby="p2pAccH">
        <h3 id="p2pAccH" class="text-sm font-bold">เลือกบัญชีธนาคาร</h3>
        {#if f.err.acc}<Field.Error>{f.err.acc}</Field.Error>{/if}
        <div class="grid grid-cols-2 gap-1.5" role="radiogroup" aria-labelledby="p2pAccH">
            {#each P2P_ACC as a (a.id)}
                {@const on = f.acc === a.id}
                <button
                    type="button"
                    role="radio"
                    aria-checked={on}
                    disabled={!a.open || f.ask}
                    title={bankOf(a.bank).name + " " + a.no + " · " + a.name + (a.open ? "" : " — ปิดรับรายการชั่วคราว")}
                    class={"flex min-h-10 min-w-0 items-center gap-1.5 rounded-md border px-1.5 py-1 text-start transition-colors disabled:cursor-not-allowed " +
                        (on ? "border-brand bg-brand/5 ring-brand ring-1" : a.open ? "bg-background hover:bg-muted" : "bg-muted/60 border-dashed")}
                    onclick={() => (st.p2p.acc = a.id)}
                >
                    <!-- กระชับ (เจ้าของงานสั่ง 18 พ.ย. 2026): โลโก้บอกธนาคาร (ชื่อธนาคารอยู่ใน sr-only / tooltip) · ชื่อบัญชี + เลขบัญชี 2 บรรทัด · ปิดรับ = ไอคอนท้ายแถว -->
                    <BankLogo code={a.bank} class={"size-5 rounded " + (a.open ? "" : "opacity-50")} />
                    <span class={"flex min-w-0 flex-1 flex-col text-xs leading-tight " + (a.open ? "" : "opacity-60")}>
                        <span class="sr-only">{bankOf(a.bank).name}</span>
                        <span class="truncate font-bold">{a.name}</span>
                        <span class="text-muted-foreground tabular-nums">{a.no}</span>
                    </span>
                    {#if on}<Check class="text-brand size-3.5 shrink-0" aria-hidden="true" />
                    {:else if !a.open}<CircleOff class="text-muted-foreground size-3.5 shrink-0" aria-label="ปิดรับ" />{/if}
                </button>
            {/each}
        </div>
    </section>
</FoldCard>
