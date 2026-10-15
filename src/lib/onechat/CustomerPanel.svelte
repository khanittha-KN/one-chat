<script>
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import X from "@lucide/svelte/icons/x";
    import ExternalLink from "@lucide/svelte/icons/external-link";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { merch, platformOf } from "./data.js";
    import { st, panelCase, selectCase, closeLook, toast } from "./store.svelte.js";
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
    // บล็อกที่พับไว้ตั้งแต่แรก (= def ของ FoldCard ในแต่ละบล็อก) แสดงเป็นปุ่มเปิดหน้าต่าง รวมไว้ในตาราง 2 ช่อง
    const isLine = $derived(!!c && platformOf(c.merchant) === "line"); // ลูกค้า Telegram ไม่มีการ์ดสถานะไลน์ (OA)
    const oaBtn = $derived(isLine && !c.unbound && c.lineOk);
    const slipBtn = $derived(!!c && !c.unbound && !(c.slip && (c.slip.state === "reading" || c.slip.state === "ready")));
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
    <!-- ไปหน้า Auto fast บนสุดให้เห็นชัด (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
    {#if c && !c.unbound}
        <Button data-tone="success" data-fill="solid" class="w-full" onclick={() => toast("ไปยัง Auto fast (ยังไม่มีลิงก์จริง)")}><ExternalLink data-icon="inline-start" />ไปหน้า Auto fast</Button>
    {/if}
    <h2 class="px-0.5 text-sm font-bold">สมาชิกและรายการเงิน</h2>
    <!-- ข้อมูลที่ไม่แสดงตั้งแต่แรก = ปุ่ม 2 ช่อง กดแล้วเปิดหน้าต่าง (สถานะไลน์ปกติ · สลิปยังไม่มี · ประวัติ · สมัครสมาชิก) -->
    {#if oaBtn || slipBtn || histBtn || regBtn}
        <div class="grid grid-cols-2 gap-2">
            {#if oaBtn}<LineStatusBlock {c} />{/if}
            {#if slipBtn}<SlipBlock {c} />{/if}
            {#if histBtn}<HistoryBlock {c} />{/if}
            {#if regBtn}<RegisterBlock {c} />{/if}
        </div>
    {/if}
    <!-- ข้อมูลที่แสดงอยู่ = การ์ดเดิม · ไลน์หลุด / มีสลิปรอตรวจ / ลูกค้าใหม่ ⇒ การ์ดนั้นกางขึ้นมาในลำดับนี้ -->
    {#if isLine && !c.unbound && !oaBtn}<LineStatusBlock {c} />{/if}
    <LookupBlock {c} />
    {#if c && !c.unbound}
        <BankAccountsBlock {c} />
        {#if !slipBtn}<SlipBlock {c} />{/if}
        <PendingBlock {c} />
        <CreditBlock {c} />
    {/if}
    {#if !regBtn}<RegisterBlock {c} />{/if}
</section>
