<!-- บัญชีธนาคาร (เว็บต้นฉบับ 15 ต.ค. 2026) — บัญชีหลักของสมาชิก + จำนวนบัญชี · สถานะอนุมัติ + ผลตรวจชื่อ · ดูทั้งหมดในหน้าต่าง -->
<script>
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Status from "../ui/Status.svelte";
    import BankLogo from "../ui/BankLogo.svelte";
    import FoldCard from "../ui/FoldCard.svelte";
    import { accountsOf, bankOf, maskNo } from "../data.js";
    import { st } from "../store.svelte.js";
    let { c } = $props();
    const accs = $derived(accountsOf(c));
    const a0 = $derived(accs[0]);
</script>

{#snippet count()}<span class="text-muted-foreground text-xs tabular-nums">{accs.length} บัญชี</span>{/snippet}

<FoldCard {c} title="บัญชีธนาคาร" action={count} contentClass="gap-2">
    <Item.Root variant="outline" size="sm" class="bg-background items-start">
        <Item.Media><BankLogo code={a0.bank} /></Item.Media>
        <Item.Content class="min-w-0 gap-1">
            <Item.Title>ธนาคาร{bankOf(a0.bank).name}</Item.Title>
            <Item.Description class="tabular-nums">{maskNo(a0.no)}</Item.Description>
            <Item.Description>{c.user.fullname}</Item.Description>
            <span class="flex flex-wrap gap-1 pt-0.5">
                <Status tone={a0.st === "อนุมัติ" ? "success" : a0.st === "รออนุมัติ" ? "warning" : "destructive"}>{a0.st}</Status>
                {#if a0.nm}<Status tone="success">ยืนยันชื่อแล้ว</Status>{:else}<Status tone="destructive">ชื่อไม่ตรง</Status>{/if}
            </span>
        </Item.Content>
    </Item.Root>
    {#if accs.length > 1}
        <Button variant="outline" size="sm" onclick={() => (st.accModal = true)}>ดูทั้งหมด ({accs.length} บัญชี)</Button>
    {/if}
</FoldCard>
