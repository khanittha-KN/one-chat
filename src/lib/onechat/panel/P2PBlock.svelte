<!-- ฝาก Manual (เดิม "ฝาก P2P" · เจ้าของงานสั่ง 18–19 พ.ย. 2026) — เฉพาะลูกค้าที่ใช้ระบบ P2P อยู่แล้ว (c.p2p) · แจ้งฝากอย่างเดียว
     บัญชีบริษัท (เลขบัญชี · ชื่อบัญชี) · ชื่อบัญชีลูกค้า · ยอดฝาก · วันที่ + เวลา (มีวินาที) แถวเดียวกัน
     ตามหน้า "เพิ่มรายการฝาก" ของ AutoFast: วันและเวลาฝากไม่บังคับ · ติ๊ก "ไม่ต้องเช็ค QRCode" ⇒ ต้องกรอกวันเวลา (มีคำเตือนรายการซ้ำ)
     หลักฐานการโอน (กดแนบหรือลากวาง · ไม่ติ๊ก ⇒ ต้องแนบ) · หมายเหตุ (บังคับ) · ปุ่มยืนยัน ⇒ กล่องสรุป
     บัญชีบริษัทเลือกจาก dropdown ในแถว "บัญชีบริษัท" (เจ้าของงานสั่ง 19 พ.ย. 2026 · เดิมเป็นตารางปุ่มท้ายการ์ด — ประหยัดพื้นที่)
     บัญชีที่ปิดรับชั่วคราวเลือกไม่ได้ · ยืนยันแล้วเป็นรายการในประวัติฝากถอน -->
<script>
    import Check from "@lucide/svelte/icons/check";
    import Copy from "@lucide/svelte/icons/copy";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import ChevronDown from "@lucide/svelte/icons/chevron-down";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import Paperclip from "@lucide/svelte/icons/paperclip";
    import X from "@lucide/svelte/icons/x";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import History from "@lucide/svelte/icons/history";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Textarea } from "$lib/components/ui/textarea/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import { DLS, DTS, DDS } from "../ui/kv.js";
    import { P2P_ACC, p2pAcc, bankOf, money, thDateTime } from "../data.js";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import { st, ok, p2pSubmit, p2pConfirm, p2pTime, p2pBal, p2pRefresh } from "../store.svelte.js";
    let { c } = $props();
    const f = $derived(st.p2p);
    const acc = $derived(p2pAcc(f.acc));
    let fileIn = $state(null);
    /* ข้อความแจ้งฝากสำเร็จหายเมื่อ: เริ่มกรอกรายการใหม่ (ช่องใดก็ได้) · กด × · เปลี่ยนลูกค้า (store resetPanel)
       ไม่ตั้งเวลาให้หายเอง — แอดมินอาจยังไม่ได้อ่าน (WCAG 2.2.1) */
    $effect(() => {
        if (st.p2p.msg && (f.amt || f.date || f.time || f.note || f.slip || f.noQr)) st.p2p.msg = null;
    });
    let slipErr = $state("");
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
    // แนบสลิป: รูป JPG / PNG ไม่เกิน 10 MB · ต้นแบบแสดงรูปจากเครื่อง ยังไม่ส่งขึ้นเซิร์ฟเวอร์
    let dragOn = $state(false);
    function onSlip(e) {
        const file = e.currentTarget.files && e.currentTarget.files[0];
        e.currentTarget.value = "";
        takeFile(file);
    }
    function takeFile(file) {
        if (!file) return;
        if (!/^image\/(jpeg|png)$/.test(file.type)) return (slipErr = "รองรับเฉพาะไฟล์ JPG หรือ PNG");
        if (file.size > 10 * 1024 * 1024) return (slipErr = "ไฟล์ใหญ่เกิน 10 MB — ย่อรูปก่อนแล้วแนบใหม่");
        slipErr = "";
        if (st.p2p.slip?.src) URL.revokeObjectURL(st.p2p.slip.src);
        st.p2p.slip = { name: file.name, src: URL.createObjectURL(file) };
        st.p2p.err.slip = null;
    }
    function dropSlip() {
        if (st.p2p.slip?.src) URL.revokeObjectURL(st.p2p.slip.src);
        st.p2p.slip = null;
    }
</script>

<FoldCard {c} title="ฝาก Manual" contentClass="gap-3">
    <!-- บัญชีที่เลือก + บัญชีลูกค้า -->
    <dl class={DLS}>
        <dt class={DTS}>บัญชีบริษัท</dt>
        <dd class={DDS}>
            <span class="flex min-w-0 items-center gap-1">
                <DropdownMenu.Root>
                    <DropdownMenu.Trigger
                        id="p2pAccBtn"
                        disabled={f.ask}
                        aria-invalid={!!f.err.acc}
                        aria-label={acc ? "บัญชีบริษัท: " + acc.name + " " + bankOf(acc.bank).name + " " + acc.no + " — เปลี่ยนบัญชี" : "เลือกบัญชีบริษัท"}
                        class="bg-background hover:bg-muted focus-visible:ring-ring/50 aria-invalid:border-destructive flex min-h-9 min-w-0 flex-1 items-center gap-1.5 rounded-md border px-1.5 py-1 text-start outline-none focus-visible:ring-[3px] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {#if acc}
                            <BankLogo code={acc.bank} class="size-5 rounded" />
                            <span class="flex min-w-0 flex-1 flex-col leading-tight">
                                <span class="truncate font-bold">{acc.name}</span>
                                <span class="text-muted-foreground truncate tabular-nums">{bankOf(acc.bank).name} {acc.no}</span>
                            </span>
                        {:else}<span class="text-muted-foreground flex-1">เลือกบัญชีบริษัท</span>{/if}
                        <ChevronDown class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
                    </DropdownMenu.Trigger>
                    <DropdownMenu.Content align="start" class="w-72">
                        <DropdownMenu.Label class="text-muted-foreground text-xs font-normal">เลือกบัญชีบริษัท</DropdownMenu.Label>
                        <DropdownMenu.RadioGroup bind:value={() => f.acc || "", (v) => v && ((st.p2p.acc = v), (st.p2p.err.acc = null))}>
                            {#each P2P_ACC as a (a.id)}
                                <DropdownMenu.RadioItem value={a.id} disabled={!a.open} class="gap-2">
                                    <BankLogo code={a.bank} class="size-5 rounded" />
                                    <span class="flex min-w-0 flex-1 flex-col leading-tight">
                                        <span class="truncate font-medium">{a.name}</span>
                                        <span class="text-muted-foreground text-xs tabular-nums">{bankOf(a.bank).name} {a.no}</span>
                                    </span>
                                    {#if !a.open}<span class="text-muted-foreground shrink-0 text-xs">ปิดรับ</span>{/if}
                                </DropdownMenu.RadioItem>
                            {/each}
                        </DropdownMenu.RadioGroup>
                    </DropdownMenu.Content>
                </DropdownMenu.Root>
                {#if acc}<Button variant="ghost" size="icon-xs" class="size-6 shrink-0" aria-label="คัดลอกเลขบัญชีบริษัท" onclick={() => copy(acc.no)}><Copy /></Button>{/if}
            </span>
            {#if f.err.acc}<span class="text-destructive mt-1 block" role="alert">{f.err.acc}</span>{/if}
        </dd>
        <!-- ยอดคงเหลือของบัญชีบริษัทที่เลือก + อัปเดตยอด (ระบบเดิม: อัพเดตยอด [F1]) -->
        {#if acc && p2pBal[acc.id]}
            <dt class={DTS}>ยอดคงเหลือ</dt>
            <dd class={DDS}>
                <span class="flex items-center gap-1">
                    <b class="text-sm tabular-nums">{money(p2pBal[acc.id].amt)}</b> บาท
                    <Button variant="ghost" size="icon-xs" class="size-5" aria-label="อัปเดตยอดคงเหลือ" title="อัปเดตยอดคงเหลือ" onclick={() => p2pRefresh(acc.id)}><RefreshCw /></Button>
                </span>
                <span class="text-muted-foreground block tabular-nums">อัปเดตล่าสุด {p2pBal[acc.id].at}</span>
            </dd>
        {/if}
        <dt class={DTS}>ชื่อบัญชีลูกค้า</dt>
        <dd class={DDS}>
            <span class="block font-bold">{c.user.fullname}</span>
            <span class="text-muted-foreground flex flex-wrap items-center gap-1 tabular-nums">{bankOf(c.user.bankCode).name} {c.user.number}<Button variant="ghost" size="icon-xs" class="size-5" aria-label="คัดลอกเลขบัญชีลูกค้า" onclick={() => copy(c.user.number)}><Copy /></Button></span>
        </dd>
    </dl>

    {#if f.ask}
        <!-- ขั้นยืนยัน -->
        <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="p2pT">
            <p id="p2pT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />ยืนยันแจ้งฝาก Manual?</p>
            <p class="text-sm"><b class="tabular-nums">{money(parseFloat(String(f.amt).replace(/,/g, "")) || 0)} บาท</b> · {bankOf(acc.bank).name} {acc.no} ({acc.name})</p>
            <dl class="grid grid-cols-[auto_1fr] gap-x-3 gap-y-0.5 text-xs">
                <dt class="text-muted-foreground">วันและเวลาฝาก</dt><dd class="tabular-nums">{f.date ? thDateTime(f.date, p2pTime(f)) : "ไม่ได้กรอก"}</dd>
                <dt class="text-muted-foreground">เช็ค QRCode</dt><dd>{f.noQr ? "ไม่เช็ค" : "เช็คจากสลิป"}</dd>
                <dt class="text-muted-foreground">หลักฐานการโอน</dt><dd class="truncate">{f.slip ? f.slip.name : "ไม่ได้แนบ"}</dd>
                <dt class="text-muted-foreground">หมายเหตุ</dt><dd class="wrap-anywhere">{f.note}</dd>
                <dt class="text-muted-foreground">ลูกค้า</dt><dd>{c.user.username}</dd>
            </dl>
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => p2pConfirm(c)}><Check data-icon="inline-start" />ยืนยันแจ้งฝาก</Button>
                <Button variant="outline" size="sm" onclick={() => (st.p2p.ask = false)}>ยกเลิก</Button>
            </div>
        </div>
    {:else}
        <Field.Group class="gap-3">
            <Field.Field data-invalid={!!f.err.amt}>
                <Field.Label for="p2pAmt">ยอดฝาก</Field.Label>
                <InputGroup.Root>
                    <InputGroup.Input id="p2pAmt" inputmode="decimal" placeholder="0.00" class="text-end tabular-nums" aria-invalid={!!f.err.amt} bind:value={() => f.amt, (v) => (st.p2p.amt = fmt(v))} />
                    <InputGroup.Addon align="inline-end">บาท</InputGroup.Addon>
                </InputGroup.Root>
                {#if f.err.amt}<Field.Error>{f.err.amt}</Field.Error>{/if}
            </Field.Field>
            <!-- วันและเวลาฝาก: ช่องเดียว (เจ้าของงานสั่ง 19 พ.ย. 2026 · เดิมแยกวันที่/เวลา) · มีวินาที · ไม่บังคับ (บังคับเมื่อไม่เช็ค QRCode) -->
            <Field.Field data-invalid={!!f.err.date}>
                <Field.Label for="p2pAt">วันและเวลาฝาก {#if f.noQr}<span class="text-destructive" aria-hidden="true">*</span>{:else}<span class="text-muted-foreground text-xs font-normal">ไม่บังคับ</span>{/if}</Field.Label>
                <Input
                    id="p2pAt"
                    type="datetime-local"
                    step="1"
                    aria-invalid={!!f.err.date}
                    aria-required={f.noQr}
                    bind:value={() => (f.date && f.time ? f.date + "T" + f.time : ""), (v) => {
                        const [d, t] = (v || "").split("T");
                        st.p2p.date = d || "";
                        st.p2p.time = t || "";
                        st.p2p.err.date = null;
                    }}
                />
                {#if f.err.date}<Field.Error>{f.err.date}</Field.Error>{/if}
            </Field.Field>
            <!-- ไม่ต้องเช็ค QRCode: คำเตือนขึ้นเฉพาะตอนติ๊ก (กล่องเตือนสีเหลือง · สีแดงใช้กับข้อผิดพลาดตอนกดยืนยันเท่านั้น — เจ้าของงานเลือก 19 พ.ย. 2026) -->
            <div class="flex flex-col gap-1.5">
                <label class="flex min-h-6 items-center gap-1.5 text-sm font-medium">
                    <Checkbox id="p2pNoQr" bind:checked={st.p2p.noQr} aria-describedby={f.noQr ? "p2pNoQrWarn" : undefined} onCheckedChange={() => ((st.p2p.err.slip = null), (st.p2p.err.date = null), (st.p2p.err.time = null))} />ไม่ต้องเช็ค QRCode
                </label>
                {#if f.noQr}
                    <p id="p2pNoQrWarn" class="border-warning/40 bg-warning/10 flex items-start gap-1.5 rounded-md border px-2 py-1.5 text-xs" role="status">
                        <TriangleAlert class="text-warning mt-px size-3.5 shrink-0" aria-hidden="true" />กรอกวันเวลาให้ตรงกับสเตทเมนต์ ไม่งั้นระบบอาจทำรายการซ้ำ
                    </p>
                {/if}
            </div>
            <!-- หลักฐานการโอน: กดแนบ หรือลากไฟล์มาวาง · บังคับเมื่อเช็ค QRCode
                 relative: input file เป็น sr-only (absolute) ต้องอยู่ในกล่องนี้ ไม่งั้นไปยึด body แล้วดันหน้าทั้งหน้าให้เลื่อนลงได้ -->
            <Field.Field class="relative gap-1.5" data-invalid={!!(f.err.slip || slipErr)}>
                <Field.Label>หลักฐานการโอน {#if !f.noQr}<span class="text-destructive" aria-hidden="true">*</span>{/if}</Field.Label>
                <input bind:this={fileIn} type="file" accept="image/jpeg,image/png" class="sr-only" tabindex="-1" aria-hidden="true" onchange={onSlip} />
                {#if f.slip}
                    <div class="flex items-center gap-1.5 rounded-md border p-1">
                        <img src={f.slip.src} alt={"สลิปที่แนบ: " + f.slip.name} class="size-7 shrink-0 rounded object-cover" />
                        <span class="min-w-0 flex-1 truncate text-sm" title={f.slip.name}>{f.slip.name}</span>
                        <Button variant="ghost" size="sm" class="h-7" onclick={() => fileIn.click()}>เปลี่ยน</Button>
                        <Button variant="ghost" size="icon-sm" class="size-7" aria-label="เอาสลิปออก" onclick={dropSlip}><X /></Button>
                    </div>
                {:else}
                    <button
                        type="button"
                        class={"hover:bg-muted flex min-h-9 w-full items-center gap-1.5 rounded-md border border-dashed px-2.5 text-start text-sm " + (dragOn ? "border-brand bg-brand/5" : "")}
                        onclick={() => fileIn.click()}
                        ondragover={(e) => (e.preventDefault(), (dragOn = true))}
                        ondragleave={() => (dragOn = false)}
                        ondrop={(e) => (e.preventDefault(), (dragOn = false), takeFile(e.dataTransfer.files && e.dataTransfer.files[0]))}
                    >
                        <Paperclip class="size-4 shrink-0" aria-hidden="true" />แนบสลิป <span class="text-muted-foreground text-xs">หรือลากไฟล์มาวาง</span>
                        <span class="text-muted-foreground ms-auto text-xs">JPG / PNG ≤ 10 MB</span>
                    </button>
                {/if}
                {#if f.err.slip || slipErr}<Field.Error>{slipErr || f.err.slip}</Field.Error>{/if}
            </Field.Field>
            <Field.Field data-invalid={!!f.err.note}>
                <Field.Label for="p2pNote">หมายเหตุ <span class="text-destructive" aria-hidden="true">*</span></Field.Label>
                <Textarea id="p2pNote" rows={2} maxlength={300} placeholder="เช่น ลูกค้าโอนจากบัญชีอื่น · สลิปไม่มี QR" aria-invalid={!!f.err.note} aria-required="true" bind:value={st.p2p.note} />
                {#if f.err.note}<Field.Error>{f.err.note}</Field.Error>{/if}
            </Field.Field>
        </Field.Group>
        {#if f.msg}
            <!-- แจ้งฝากสำเร็จ: Alert + ปุ่มไปดูรายการในประวัติฝากถอน (แท็บฝาก) — เจ้าของงานสั่ง 19 พ.ย. 2026 -->
            <Alert.Root data-tone="success" role="status" class="pe-10">
                <CircleCheck />
                <Button variant="ghost" size="icon-xs" class="absolute end-2 top-2" aria-label="ปิดข้อความ" onclick={() => (st.p2p.msg = null)}><X /></Button>
                <Alert.Title>{f.msg}</Alert.Title>
                <Alert.Description class="flex flex-col items-start gap-2">
                    <Button variant="outline" size="sm" onclick={() => ((st.panelTab = "hist"), (st.histJump = "dep"))}><History data-icon="inline-start" />ดูประวัติฝาก</Button>
                </Alert.Description>
            </Alert.Root>
        {/if}
        <Button class="w-full" onclick={p2pSubmit}><Check data-icon="inline-start" />ยืนยันแจ้งฝาก</Button>
    {/if}

</FoldCard>
