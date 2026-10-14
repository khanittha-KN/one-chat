<script>
    import { cur } from "./store.svelte.js";
    import GlobalSearch from "./panel/GlobalSearch.svelte";
    import LineStatusBlock from "./panel/LineStatusBlock.svelte";
    import LookupBlock from "./panel/LookupBlock.svelte";
    import SlipBlock from "./panel/SlipBlock.svelte";
    import PendingBlock from "./panel/PendingBlock.svelte";
    import HistoryBlock from "./panel/HistoryBlock.svelte";
    import CreditBlock from "./panel/CreditBlock.svelte";
    import RegisterBlock from "./panel/RegisterBlock.svelte";

    let { class: className = "" } = $props();
    const c = $derived(cur());
</script>

<!-- แผงลูกค้า — ช่องเต็มสูงแบบเมนู Organization: พื้นเดียวกับเมนูข้าง · เส้นซ้ายคั่นจากห้องแชท · แต่ละบล็อกเป็นการ์ด (sm) ห่างกัน 12px · ลำดับเดียวกับ renderPanel() ของต้นฉบับ
     (CompanyAccountsBlock = coBlock() ต้นฉบับประกาศไว้แต่ไม่ได้วาง — ไฟล์อยู่ใน panel/ พร้อมใช้) -->
<section id="colPanel" aria-label="ข้อมูลลูกค้า" class={"min-h-0 bg-surface-chrome flex-col gap-3 overflow-y-auto border-l p-3 *:shrink-0 " + className}>
    <GlobalSearch />
    <LineStatusBlock {c} />
    <LookupBlock {c} />
    {#if c.slip}<SlipBlock {c} />{/if}
    <PendingBlock {c} />
    <HistoryBlock {c} />
    <CreditBlock {c} />
    <RegisterBlock {c} />
</section>
