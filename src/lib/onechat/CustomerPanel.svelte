<script>
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import X from "@lucide/svelte/icons/x";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { merch } from "./data.js";
    import { st, panelCase, selectCase, closeLook } from "./store.svelte.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import GlobalSearch from "./panel/GlobalSearch.svelte";
    import LineStatusBlock from "./panel/LineStatusBlock.svelte";
    import LookupBlock from "./panel/LookupBlock.svelte";
    import SlipBlock from "./panel/SlipBlock.svelte";
    import PendingBlock from "./panel/PendingBlock.svelte";
    import HistoryBlock from "./panel/HistoryBlock.svelte";
    import CreditBlock from "./panel/CreditBlock.svelte";
    import RegisterBlock from "./panel/RegisterBlock.svelte";

    let { class: className = "" } = $props();
    // ลูกค้าที่แสดง = เลือกจากช่องค้นหา/ตรวจสอบ หรือของแชทที่เปิดอยู่ · ยังไม่มี ⇒ เหลือแค่เครื่องมือ (ค้นหา · ตรวจสอบ · สมัครสมาชิก)
    const c = $derived(panelCase());
</script>

<!-- แผงลูกค้า — ช่องเต็มสูงแบบเมนู Organization: พื้นเดียวกับเมนูข้าง · เส้นซ้ายคั่นจากห้องแชท · แต่ละบล็อกเป็นการ์ด (sm) ห่างกัน 12px · ลำดับเดียวกับ renderPanel() ของต้นฉบับ
     (CompanyAccountsBlock = coBlock() ต้นฉบับประกาศไว้แต่ไม่ได้วาง — ไฟล์อยู่ใน panel/ พร้อมใช้) -->
<section id="colPanel" aria-label="ข้อมูลลูกค้า" class={"min-h-0 bg-surface-chrome flex-col gap-3 overflow-y-auto border-l p-3 *:shrink-0 " + className}>
    <GlobalSearch />
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
    {#if c}<LineStatusBlock {c} />{/if}
    <LookupBlock {c} />
    {#if c}
        {#if c.slip}<SlipBlock {c} />{/if}
        <PendingBlock {c} />
        <HistoryBlock {c} />
        <CreditBlock {c} />
    {/if}
    <RegisterBlock {c} />
</section>
