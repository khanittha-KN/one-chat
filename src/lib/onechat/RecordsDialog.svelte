<!-- หน้าต่างเดียวของต้นฉบับ (#modal) — "บัญชีธนาคารลูกค้า" ถ้าเปิดอยู่ ไม่งั้น "ประวัติฝาก/ถอน"
     dialog ของ shadcn (DESIGN-SYSTEM §10.10): หัว + คำอธิบาย · ปุ่มท้ายหน้าต่างไม่มีไอคอน · ปิดได้ด้วย [ปิด] ฉากหลัง และ Esc · เปิดแล้วโฟกัส [ปิด] -->
<script>
    import * as Dialog from "$lib/components/ui/dialog/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Status from "./ui/Status.svelte";
    import BankLogo from "./ui/BankLogo.svelte";
    import HistRows from "./panel/HistRows.svelte";
    import { bankOf, histAll, histSums, accountsOf } from "./data.js";
    import { st, cur } from "./store.svelte.js";

    const c = $derived(cur());
    const all = $derived(histAll(c));
    const items = $derived(st.hist === "all" ? all : all.filter((x) => x.k === st.hist));
    const accs = $derived(accountsOf(c));
    const tabs = $derived([
        ["all", "ทั้งหมด", all.length],
        ["dep", "ฝาก", c.histDep.length],
        ["wd", "ถอน", c.histWd.length],
    ]);
    let closeBtn = $state(null);

    function close() {
        st.accModal = false;
        st.histModal = false;
    }
</script>

<!-- ยังไม่เปิดแชทไหน (หลังล็อกอิน) ⇒ ไม่มีลูกค้าให้แสดง -->
{#if c}
<Dialog.Root bind:open={() => st.accModal || st.histModal, (v) => !v && close()}>
    <Dialog.Content
        showCloseButton={false}
        class="flex max-h-[calc(100dvh-2rem)] flex-col sm:max-w-lg"
        onOpenAutoFocus={(e) => {
            e.preventDefault();
            closeBtn?.focus();
        }}
    >
        {#if st.accModal}
            <Dialog.Header>
                <Dialog.Title>บัญชีธนาคารลูกค้า · {c.user.username} ({accs.length} บัญชี)</Dialog.Title>
                <Dialog.Description>{c.user.fullname}</Dialog.Description>
            </Dialog.Header>
            <Item.Group class="accl min-h-0 gap-2 overflow-y-auto">
                {#each accs as a, i (i)}
                    <Item.Root variant="outline" size="sm">
                        <Item.Media><BankLogo code={a.bank} /></Item.Media>
                        <Item.Content class="min-w-0">
                            <Item.Title>{bankOf(a.bank).name}</Item.Title>
                            <Item.Description class="tabular-nums">{a.no}</Item.Description>
                            <Item.Description>{c.user.fullname}</Item.Description>
                        </Item.Content>
                        <Item.Actions class="flex-col items-end gap-1">
                            {#if a.main}<Badge variant="outline">บัญชีหลัก</Badge>{/if}
                            {#if a.on}<Status tone="success">ใช้งาน</Status>{:else}<Status>ไม่ใช้งาน</Status>{/if}
                        </Item.Actions>
                    </Item.Root>
                {/each}
            </Item.Group>
        {:else}
            <Dialog.Header>
                <Dialog.Title>ประวัติฝาก/ถอน · {c.name}</Dialog.Title>
                <Dialog.Description>
                    {#if items.length}{items.length} รายการ · {histSums(items)}{:else}ยังไม่มีประวัติ{/if}
                </Dialog.Description>
            </Dialog.Header>
            <ToggleGroup.Root
                type="single"
                variant="outline"
                class="w-full *:flex-1"
                aria-label="ประวัติ"
                bind:value={() => st.hist, (k) => k && (st.hist = k)}
            >
                {#each tabs as [k, label, n] (k)}
                    <ToggleGroup.Item value={k}>{label}<Badge variant="secondary" class="tabular-nums">{n}</Badge></ToggleGroup.Item>
                {/each}
            </ToggleGroup.Root>
            <div id="histPanel" class="min-h-0 overflow-y-auto" role="region" aria-label="รายการประวัติ">
                {#if items.length}<HistRows {items} />{/if}
            </div>
        {/if}
        <Dialog.Footer>
            <Button variant="outline" bind:ref={closeBtn} onclick={close}>ปิด</Button>
        </Dialog.Footer>
    </Dialog.Content>
</Dialog.Root>
{/if}
