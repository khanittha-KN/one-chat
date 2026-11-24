<!-- การผูกสมาชิก (เดิมการ์ด "ตรวจสอบ" · แยกใหม่ใน ver2 23 พ.ย. 2026)
     ข้อมูลสมาชิก (Username · ชื่อ · เบอร์ · เทิร์น · โปร) ย้ายไปการ์ดสรุปสมาชิกบนสุดของแผง (MemberSummary) ⇒ ไม่ซ้ำ · เปลี่ยนรหัสผ่านแยกเป็น PasswordBlock
     ยังไม่ผูก ⇒ ช่องค้นหาเปิดเลย (username / เบอร์ / ชื่อ ⇒ กดชื่อเพื่อผูก)
     ผูกแล้ว ⇒ บอกว่าผูกกับใคร + [เปลี่ยนสมาชิก] (เปิดช่องค้นหา ⇒ ถามยืนยันก่อนเปลี่ยน) · [เลิกผูก] (ถามก่อน)
     แชท LINE: การผูกมีผลกับการเข้าสู่ระบบในหน้า LINE ของลูกค้า (เว็บจริง 18 พ.ย. 2026) -->
<script>
    import Search from "@lucide/svelte/icons/search";
    import Unlink from "@lucide/svelte/icons/unlink";
    import ArrowLeftRight from "@lucide/svelte/icons/arrow-left-right";
    import X from "@lucide/svelte/icons/x";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import * as Field from "$lib/components/ui/field/index.js";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import { platformOf } from "../data.js";
    import { db, st, lookup, pickMember, bindMember, rebindCancel, unbindMember, unbindAsk } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c?.user);
    const bound = $derived(c && !c.unbound);
    const res = $derived((st.lookRes || []).map((id) => db.cases.find((x) => x.id === id)).filter(Boolean));
    const nb = $derived(st.rebind && db.cases.find((x) => x.id === st.rebind));
    const isLine = $derived(!!c && platformOf(c.merchant) === "line");
    // ช่องค้นหา: ยังไม่ผูก ⇒ เปิดเสมอ · ผูกแล้ว ⇒ เปิดเมื่อกด "เปลี่ยนสมาชิก"
    const searching = $derived(!bound || st.rebindOpen);
    let q = $state("");
    function closeSearch() {
        q = "";
        st.lookRes = null;
        st.lookErr = null;
        st.rebind = null;
        st.rebindOpen = false;
    }
</script>

<!-- คำ (ver2 · 23 พ.ย. 2026 — ทีมงงคำว่า "เปลี่ยนสมาชิก"): การผูก = แชทนี้ใช้บัญชีสมาชิกไหนตอนปรับเครดิต / เปลี่ยนรหัส
     ปุ่มตามความสำคัญ: ผูกกับบัญชีอื่น = ปุ่มรอง (กรอบเทา) · ยกเลิกการผูก = ปุ่มอันตราย (กรอบแดง) -->
<FoldCard {c} title={bound ? "บัญชีที่ผูกกับแชทนี้" : "ผูกบัญชีสมาชิกกับแชทนี้"} contentClass="gap-3">
    {#if bound}
        <div class="flex flex-col gap-0.5">
            <p class="text-sm">ผูกกับบัญชี <b>{u.username}</b></p>
            {#if isLine}<p class="text-muted-foreground text-xs">แชท LINE: ลูกค้าล็อกอินในหน้า LINE ได้เฉพาะบัญชีนี้</p>{/if}
        </div>
    {/if}

    {#if searching}
        <div class="flex gap-2">
            <InputGroup.Root class="flex-1">
                <InputGroup.Addon><Search /></InputGroup.Addon>
                <InputGroup.Input
                    id="chkIn"
                    placeholder="username / เบอร์ / ชื่อ"
                    bind:value={q}
                    aria-label="ค้นหาสมาชิก"
                    aria-invalid={!!st.lookErr}
                    aria-describedby={st.lookErr ? "chkErr" : undefined}
                    onkeydown={(e) => e.key === "Enter" && lookup(q)}
                />
                {#if q}<InputGroup.Addon align="inline-end"><InputGroup.Button size="icon-xs" aria-label="ล้างคำค้น" onclick={() => ((q = ""), (st.lookRes = null), (st.lookErr = null))}><X /></InputGroup.Button></InputGroup.Addon>{/if}
            </InputGroup.Root>
            <Button size="sm" class="h-9" onclick={() => lookup(q)}>ค้นหา</Button>
        </div>
        {#if st.lookErr}<Field.Error id="chkErr">{st.lookErr}</Field.Error>{/if}
        {#if res.length}
            <div class="flex flex-col gap-1.5" role="group" aria-label="ผลการค้นหา">
                <p class="text-muted-foreground text-xs">กดชื่อเพื่อผูกกับแชทนี้</p>
                {#each res as m (m.id)}
                    {@const here = bound && m.user.username === u.username}
                    <Item.Root variant="outline" size="sm">
                        {#snippet child({ props })}
                            <button type="button" {...props} class={props.class + " hover:bg-muted text-start"} aria-label={"ผูกสมาชิกคนนี้กับแชทนี้: " + m.user.username} onclick={() => pickMember(m.id)}>
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
    {/if}

    <!-- เปลี่ยนการผูก: ถามก่อน -->
    {#if nb && bound}
        <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="rbT">
            <p id="rbT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />ผูกแชทนี้กับบัญชีอื่น?</p>
            <p class="text-sm">จากบัญชี <b>{u.username}</b> เป็น <b>{nb.user.username}</b></p>
            {#if isLine}<p class="text-muted-foreground text-xs">แชท LINE: ถ้าลูกค้าล็อกอินบัญชีอื่นอยู่ จะถูกออกจากระบบ</p>{/if}
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => bindMember(c, nb)}>เปลี่ยนการผูก</Button>
                <Button variant="outline" size="sm" onclick={rebindCancel}>ยกเลิก</Button>
            </div>
        </div>
    {/if}

    {#if bound}
        {#if st.unbindAsk === c.id}
            <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="ubT">
                <p id="ubT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />ยกเลิกการผูกบัญชี {u.username}?</p>
                <p class="text-muted-foreground text-xs">ปรับเครดิตและเปลี่ยนรหัสผ่านจากแชทนี้ไม่ได้ จนกว่าจะผูกบัญชีใหม่</p>
                {#if isLine}<p class="text-muted-foreground text-xs">แชท LINE: ลูกค้าที่ล็อกอินในหน้า LINE อยู่จะถูกออกจากระบบ</p>{/if}
                <div class="flex gap-2 *:flex-1">
                    <Button data-tone="destructive" data-fill="solid" size="sm" onclick={() => unbindMember(c)}><Unlink data-icon="inline-start" />ยกเลิกการผูก</Button>
                    <Button variant="outline" size="sm" onclick={() => unbindAsk(null)}>ยกเลิก</Button>
                </div>
            </div>
        {:else if !nb}
            <div class="flex gap-2 *:flex-1">
                {#if st.rebindOpen}
                    <Button variant="outline" size="sm" onclick={closeSearch}>ยกเลิก</Button>
                {:else}
                    <Button variant="outline" size="sm" onclick={() => (st.rebindOpen = true)}><ArrowLeftRight data-icon="inline-start" />ผูกกับบัญชีอื่น</Button>
                    <Button data-tone="destructive" data-fill="outline" size="sm" onclick={() => unbindAsk(c)}><Unlink data-icon="inline-start" />ยกเลิกการผูก</Button>
                {/if}
            </div>
        {/if}
    {/if}
</FoldCard>
