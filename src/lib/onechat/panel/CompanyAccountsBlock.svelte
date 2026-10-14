<!-- coBlock() ของต้นฉบับ — "บัญชีบริษัท" กดแล้วส่งเลขบัญชีให้ลูกค้าในแชท
     ต้นฉบับประกาศไว้แต่ renderPanel() ไม่ได้เรียก ⇒ ที่นี่ก็ยังไม่ได้วาง (เปิดใช้: ใส่ <CompanyAccountsBlock {c} /> ใน CustomerPanel) -->
<script>
    import Plus from "@lucide/svelte/icons/plus";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import BankLogo from "../ui/BankLogo.svelte";
    import { COACC, bankOf } from "../data.js";
    import { st, coAcc, openSettings } from "../store.svelte.js";
    let { c } = $props();
</script>

<Card.Root size="sm">
    <Card.Header>
        <Card.Title>บัญชีบริษัท</Card.Title>
        <Card.Description>กดเลือกบัญชี ระบบจะส่งเลขบัญชีให้ลูกค้าในแชท</Card.Description>
    </Card.Header>
    <Card.Content>
        <Item.Group class="gap-2">
            {#each COACC as a, i (i)}
                <Item.Root variant="outline" size="sm" class="hover:bg-muted aria-pressed:border-brand text-left">
                    {#snippet child({ props })}
                        <button {...props} type="button" aria-pressed={st.coSel === i} onclick={() => coAcc(c, i)}>
                            <Item.Media><BankLogo code={a.bank} /></Item.Media>
                            <Item.Content class="min-w-0">
                                <Item.Title>{bankOf(a.bank).name}</Item.Title>
                                <Item.Description class="tabular-nums">{a.no} · {a.name}</Item.Description>
                            </Item.Content>
                        </button>
                    {/snippet}
                </Item.Root>
            {/each}
        </Item.Group>
        <Button data-tone="primary" size="sm" onclick={() => openSettings("ba")}><Plus data-icon="inline-start" />เพิ่มบัญชี</Button>
    </Card.Content>
</Card.Root>
