<script>
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import X from "@lucide/svelte/icons/x";
    import UserRound from "@lucide/svelte/icons/user-round";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { merch, platformOf } from "./data.js";
    import { st, panelCase, selectCase, closeLook } from "./store.svelte.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import LineStatusBlock from "./panel/LineStatusBlock.svelte";
    import LookupBlock from "./panel/LookupBlock.svelte";
    import SlipBlock from "./panel/SlipBlock.svelte";
    import PendingBlock from "./panel/PendingBlock.svelte";
    import HistoryBlock from "./panel/HistoryBlock.svelte";
    import CreditBlock from "./panel/CreditBlock.svelte";
    import RegisterBlock from "./panel/RegisterBlock.svelte";
    import BankAccountsBlock from "./panel/BankAccountsBlock.svelte";

    let { class: className = "" } = $props();
    // ลูกค้าที่แสดง = เลือกจากช่องค้นหา/ตรวจสอบ หรือของแชทที่เปิดอยู่ · ยังไม่มี ⇒ เหลือแค่เครื่องมือ (ค้นหา · ตรวจสอบ · สมัครสมาชิก)
    const c = $derived(panelCase());
    // บล็อกที่พับไว้ตั้งแต่แรก (= def ของ FoldCard ในแต่ละบล็อก) แสดงเป็นปุ่มเปิดหน้าต่าง เรียงเป็นปุ่มเล็กแถวเดียว
    // เว็บจริง 27 ต.ค. 2026: การ์ด "LINE และผู้ช่วย (OA)" มีทุกแชท (Telegram ชื่อ "ผู้ช่วย (OA)" ไม่มีส่วนสถานะ LINE) · ตรวจสอบสลิปมีทั้งแชทที่ผูกและยังไม่ผูกสมาชิก
    const oaOk = $derived(!!c && (platformOf(c.merchant) !== "line" || c.lineOk) && st.assist.every((a) => a.ok));
    const oaBtn = $derived(oaOk);
    const slipBtn = $derived(!!c && !(c.slip && !c.slip.hidden && (c.slip.state === "reading" || c.slip.state === "ready")));
    const histBtn = $derived(!!c && !c.unbound);
    const regBtn = $derived(!!c && !c.justReg && !c.unbound);
</script>

<!-- แผงลูกค้า — ช่องเต็มสูงแบบเมนู Organization: พื้นเดียวกับเมนูข้าง · เส้นซ้ายคั่นจากห้องแชท · แต่ละบล็อกเป็นการ์ด (sm) ห่างกัน 12px · ลำดับเดียวกับ renderPanel() ของต้นฉบับ
     (CompanyAccountsBlock = coBlock() ต้นฉบับประกาศไว้แต่ไม่ได้วาง — ไฟล์อยู่ใน panel/ พร้อมใช้) -->
<section id="colPanel" aria-label="ข้อมูลลูกค้า" class={"min-h-0 bg-surface-chrome flex-col gap-3 overflow-y-auto border-l p-3 *:shrink-0 " + className}>
    {#if st.look && c}
        <!-- ลูกค้าจากช่องค้นหา (ไม่ได้เปิดแชท) — บอกให้ชัดว่ากำลังจัดการข้อมูลของใคร · เปิดแชท = เลือกแชทนั้น · × = กลับไปลูกค้าของแชทที่เปิดอยู่ -->
        <Item.Root variant="outline" size="sm" class="bg-card border-brand" role="status" aria-label={"ข้อมูลลูกค้า " + c.name}>
            <Item.Media><CustomerAvatar {c} /></Item.Media>
            <Item.Content class="min-w-0">
                <Item.Title class="w-full"><span class="truncate">{c.name}</span></Item.Title>
                <Item.Description class="truncate">{c.user.username} · {merch(c.merchant).name}</Item.Description>
            </Item.Content>
            <Item.Actions class="gap-1">
                <Button variant="outline" size="sm" onclick={() => selectCase(c.id)}><MessageCircle data-icon="inline-start" />เปิดแชท</Button>
                <Button variant="ghost" size="icon-sm" aria-label="ปิดข้อมูลลูกค้านี้" onclick={closeLook}><X /></Button>
            </Item.Actions>
        </Item.Root>
    {/if}
    {#if !c}
        <!-- ยังไม่เปิดแชท / ยังไม่เลือกลูกค้า (เว็บจริง 27 ต.ค. 2026) -->
        <Empty.Root class="justify-start p-6">
            <Empty.Header>
                <Empty.Media variant="icon"><UserRound /></Empty.Media>
                <Empty.Title>ข้อมูลลูกค้า</Empty.Title>
                <Empty.Description>เปิดแชท หรือค้นหาลูกค้าจากช่องค้นหาในรายการสนทนา เพื่อดูข้อมูลสมาชิกและรายการเงิน</Empty.Description>
            </Empty.Header>
        </Empty.Root>
    {:else}
    <h2 class="px-0.5 text-sm font-bold">สมาชิกและรายการเงิน</h2>
    <!-- ข้อมูลที่ไม่แสดงตั้งแต่แรก = ปุ่มเล็กแถวเดียว (ขึ้นบรรทัดใหม่เมื่อเต็ม) กดแล้วเปิดหน้าต่าง (สถานะไลน์ปกติ · สลิปยังไม่มี · ประวัติ · สมัครสมาชิก) -->
    {#if oaBtn || slipBtn || histBtn || regBtn}
        <div class="flex flex-wrap gap-1.5" role="group" aria-label="ข้อมูลเพิ่มเติม">
            {#if oaBtn}<LineStatusBlock {c} />{/if}
            {#if slipBtn}<SlipBlock {c} />{/if}
            {#if histBtn}<HistoryBlock {c} />{/if}
            {#if regBtn}<RegisterBlock {c} />{/if}
        </div>
    {/if}
    <!-- กดตรวจสอบสลิปแล้ว ⇒ การ์ดผลตรวจขึ้นเป็นการ์ดแรก เหนือการ์ดตรวจสอบ (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
    {#if c && !slipBtn}<SlipBlock {c} />{/if}
    <!-- ข้อมูลที่แสดงอยู่ = การ์ดเดิม · ไลน์หลุด / มีสลิปรอตรวจ / ลูกค้าใหม่ ⇒ การ์ดนั้นกางขึ้นมาในลำดับนี้ -->
    {#if c && !oaBtn}<LineStatusBlock {c} />{/if}
    <LookupBlock {c} />
    {#if c && !c.unbound}
        <BankAccountsBlock {c} />
        <PendingBlock {c} />
        <CreditBlock {c} />
    {/if}
    {#if !regBtn}<RegisterBlock {c} />{/if}
    {/if}
</section>
