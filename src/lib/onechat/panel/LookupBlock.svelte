<!-- ตรวจสอบ — ตามเว็บจริง 27 ต.ค. 2026
     ค้นหาด้วย username / เบอร์ / ชื่อ ⇒ รายชื่อ ⇒ กดชื่อเพื่อผูกกับแชทนี้ (ผูกอยู่แล้ว ⇒ ถาม "เปลี่ยนสมาชิกที่ผูกกับแชทนี้?")
     ข้อมูลสมาชิก + ปุ่มคัดลอก Username / เบอร์ · เลิกผูก + โหลดข้อมูลใหม่ · เปลี่ยนรหัสผ่านลูกค้า (รหัสใหม่ 2 ครั้ง + รหัสแอดมิน ⇒ ยืนยัน ⇒ แสดงรหัสใหม่ครั้งเดียว) -->
<script>
    import Search from "@lucide/svelte/icons/search";
    import Unlink from "@lucide/svelte/icons/unlink";
    import RefreshCw from "@lucide/svelte/icons/refresh-cw";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import Copy from "@lucide/svelte/icons/copy";
    import EyeOff from "@lucide/svelte/icons/eye-off";
    import X from "@lucide/svelte/icons/x";
    import Save from "@lucide/svelte/icons/save";
    import { Input } from "$lib/components/ui/input/index.js";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import PasswordInput from "../ui/PasswordInput.svelte";
    import { DL, DT, DD } from "../ui/kv.js";
    import { money } from "../data.js";
    import { db, st, ok, lookup, pickMember, bindMember, rebindCancel, pwOpen, pwCancel, pwSave, pwConfirm, pwHide, unbindMember } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c?.user);
    const bound = $derived(c && !c.unbound);
    const res = $derived((st.lookRes || []).map((id) => db.cases.find((x) => x.id === id)).filter(Boolean));
    const nb = $derived(st.rebind && db.cases.find((x) => x.id === st.rebind));
    let q = $state("");
    function copy(v, what) {
        navigator.clipboard?.writeText(v);
        ok("คัดลอก" + what + "แล้ว");
    }
</script>

{#snippet pwField(id, label, key, hint)}
    <Field.Field data-invalid={!!st.pw.err}>
        <Field.Label for={id}>{label}</Field.Label>
        <PasswordInput {id} bind:value={st.pw[key]} aria-invalid={!!st.pw.err} />
        {#if hint}<Field.Description class="text-xs">{hint}</Field.Description>{/if}
    </Field.Field>
{/snippet}

<FoldCard {c} title="ตรวจสอบ" contentClass="gap-3">
    <div class="flex gap-2">
        <InputGroup.Root class="flex-1">
            <InputGroup.Addon><Search /></InputGroup.Addon>
            <InputGroup.Input
                id="chkIn"
                placeholder="Search users — username / เบอร์ / ชื่อ"
                bind:value={q}
                aria-label="ค้นหาสมาชิก"
                aria-invalid={!!st.lookErr}
                aria-describedby={st.lookErr ? "chkErr" : undefined}
                onkeydown={(e) => e.key === "Enter" && lookup(q)}
            />
            {#if q}<InputGroup.Addon align="inline-end"><InputGroup.Button size="icon-xs" aria-label="ล้างคำค้น" onclick={() => ((q = ""), (st.lookRes = null), (st.lookErr = null))}><X /></InputGroup.Button></InputGroup.Addon>{/if}
        </InputGroup.Root>
        <Button size="sm" class="h-9" onclick={() => lookup(q)}>ตรวจสอบ</Button>
    </div>
    {#if st.lookErr}<Field.Error id="chkErr">{st.lookErr}</Field.Error>{/if}
    <!-- ผลการค้นหา: กดชื่อเพื่อผูกกับแชทนี้ -->
    {#if res.length}
        <div class="flex flex-col gap-1.5" role="group" aria-label="ผลการค้นหา">
            <p class="text-muted-foreground text-xs">{c ? "กดที่รายชื่อเพื่อผูกสมาชิกกับแชทนี้" : "กดที่รายชื่อเพื่อดูข้อมูลสมาชิก"}</p>
            {#each res as m (m.id)}
                {@const here = bound && m.user.username === u.username}
                <Item.Root variant="outline" size="sm">
                    {#snippet child({ props })}
                        <button type="button" {...props} class={props.class + " hover:bg-muted text-start"} aria-label={(c ? "ผูกสมาชิกคนนี้กับแชทนี้: " : "") + m.user.username} onclick={() => pickMember(m.id)}>
                            <Item.Content class="min-w-0">
                                <Item.Title class="w-full"><span class="truncate">{m.user.username}</span>{#if here}<Status tone="success">ผูกอยู่</Status>{/if}</Item.Title>
                                <Item.Description class="truncate">{m.user.fullname} · <span class="tabular-nums">{m.user.mobile}</span></Item.Description>
                            </Item.Content>
                        </button>
                    {/snippet}
                </Item.Root>
            {/each}
        </div>
    {/if}
    <!-- เปลี่ยนการผูก -->
    {#if nb && bound}
        <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="rbT">
            <p id="rbT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />เปลี่ยนสมาชิกที่ผูกกับแชทนี้?</p>
            <p class="text-sm">แชทนี้ผูกกับ <b>{u.username}</b> จะเปลี่ยนเป็น <b>{nb.user.username}</b></p>
            <p class="text-muted-foreground text-xs">การปรับเครดิตและการเปลี่ยนรหัสผ่านหลังจากนี้จะเป็นของสมาชิกคนใหม่</p>
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => bindMember(c, nb)}>เปลี่ยนการผูก</Button>
                <Button variant="outline" size="sm" onclick={rebindCancel}>ยกเลิก</Button>
            </div>
        </div>
    {/if}
    {#if c && c.unbound}
        <p class="text-muted-foreground text-sm">ยังไม่ได้ผูกสมาชิกกับแชทนี้ — ค้นหาด้านบนเพื่อผูก หรือสมัครสมาชิกใหม่ที่การ์ด "สมัครสมาชิก Player" ด้านล่าง</p>
    {:else if c}
        <dl class={DL}>
            <dt class={DT}>Username</dt>
            <dd class={DD + " flex flex-wrap items-center gap-1.5"}>
                {u.username}
                <Button variant="ghost" size="icon-xs" aria-label="คัดลอก Username" onclick={() => copy(u.username, " Username ")}><Copy /></Button>
                <Status tone="success">ใช้งานได้</Status>
            </dd>
            <dt class={DT}>Fullname</dt><dd class={DD}>{u.fullname}</dd>
            <dt class={DT}>Bank</dt><dd class={DD}>ธนาคาร{u.bank}</dd>
            <dt class={DT}>Number</dt><dd class={DD + " tabular-nums"}>{u.number}</dd>
            <dt class={DT}>Mobile</dt>
            <dd class={DD + " flex items-center gap-1.5 tabular-nums"}>
                {u.mobile}
                <Button variant="ghost" size="icon-xs" aria-label="คัดลอก เบอร์โทร" onclick={() => copy(u.mobile, "เบอร์โทร")}><Copy /></Button>
            </dd>
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
            <Button variant="outline" size="icon-sm" class="size-8" aria-label="โหลดข้อมูลสมาชิกใหม่" title="โหลดข้อมูลสมาชิกใหม่" onclick={() => ok("โหลดข้อมูลสมาชิกใหม่แล้ว")}><RefreshCw /></Button>
        </div>
        {#if !st.pw.open}
            <Button variant="outline" size="sm" onclick={pwOpen}>เปลี่ยนรหัสผ่านลูกค้า</Button>
            {#if st.pw.msg}<p class="text-success flex items-start gap-1.5 text-sm" role="status"><CircleCheck class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{st.pw.msg}</p>{/if}
            <!-- รหัสใหม่แสดงครั้งเดียว แล้วซ่อนเอง -->
            {#if st.pw.shown}
                <div class="bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
                    <div class="min-w-0 flex-1">
                        <p class="text-muted-foreground text-xs">รหัสผ่านใหม่ของ {u.username}</p>
                        <p class="font-mono text-base font-bold">{st.pw.shown}</p>
                        <p class="text-muted-foreground text-xs">แสดงครั้งเดียว — จะซ่อนใน {st.pw.left} วินาที · ส่งให้ลูกค้าเอง ระบบไม่ส่งให้</p>
                    </div>
                    <Button variant="ghost" size="icon-sm" aria-label="ซ่อนรหัสผ่านนี้" onclick={pwHide}><EyeOff /></Button>
                </div>
            {/if}
        {:else if !st.pw.confirm}
            <div class="bg-muted/50 flex flex-col gap-3 rounded-lg border p-3">
                {@render pwField("pwNew", "รหัสผ่านใหม่ของ " + u.username + " · " + u.fullname, "a", "รหัสผ่านใหม่ 6-30 ตัว และไม่มีช่องว่าง")}
                {@render pwField("pwConf", "ยืนยันรหัสผ่านใหม่", "b", "")}
                <!-- รหัสผ่านแอดมิน: ช่องธรรมดา ไม่มีปุ่มดูรหัส (เว็บจริง) -->
                <Field.Field data-invalid={!!st.pw.err}>
                    <Field.Label for="pwAdmin">รหัสผ่านแอดมิน</Field.Label>
                    <Input id="pwAdmin" type="password" autocomplete="off" bind:value={st.pw.admin} />
                    <Field.Description class="text-xs">รหัสผ่านของบัญชีที่ล็อกอินอยู่ — ถามทุกครั้งก่อนเปลี่ยนรหัสผ่านสมาชิก</Field.Description>
                </Field.Field>
                {#if st.pw.err}<Field.Error>{st.pw.err}</Field.Error>{/if}
                <div class="flex gap-2 *:flex-1">
                    <Button size="sm" onclick={() => pwSave(c)}><Save data-icon="inline-start" />บันทึกรหัสผ่านใหม่</Button>
                    <Button variant="outline" size="sm" onclick={pwCancel}>ยกเลิก</Button>
                </div>
            </div>
        {:else}
            <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="pwT">
                <p id="pwT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />เปลี่ยนรหัสผ่านสมาชิก?</p>
                <p class="text-muted-foreground text-xs">รหัสผ่านเดิมจะใช้ไม่ได้ทันที · ระบบไม่ส่งรหัสให้ลูกค้าเอง — บอกรหัสใหม่ในแชท · จดว่าเป็นรายการของคุณ</p>
                <div class="flex gap-2 *:flex-1">
                    <Button size="sm" onclick={() => pwConfirm(c)}>เปลี่ยนรหัสผ่าน</Button>
                    <Button variant="outline" size="sm" onclick={() => (st.pw.confirm = false)}>ยกเลิก</Button>
                </div>
            </div>
        {/if}
    {/if}
</FoldCard>
