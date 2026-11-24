<!-- แผงลูกค้า ver2 (23 พ.ย. 2026 · ทีมแจ้ง: เลื่อนยาว · ข้อมูลซ้ำหลายที่ · ปุ่มใต้หัวข้อดูเป็นแท็ก)
     โครงใหม่ ⇒ เห็นของสำคัญตลอด ที่เหลือแบ่งเป็นสัดส่วน:
       1. สรุปสมาชิก (ติดบนสุดเสมอ) — Username · ชื่อ · เบอร์ · เครดิต · โบนัส · เทิร์น · โปร · ยอดค้าง · เมนูจัดการ
       2. แจ้งเตือนที่ต้องจัดการก่อน (มีเมื่อเกิดขึ้น) — ผลตรวจสลิป · LINE หลุด / ผู้ช่วยหมดอายุ
       3. แท็บ การเงิน · สมาชิก · ประวัติ — แต่ละแท็บมีเฉพาะงานของเรื่องนั้น
          ของที่เปิดเป็นหน้าต่าง (สลิป · สถานะ LINE · ประวัติ · สมัครสมาชิก) = แถวรายการในกล่องกลุ่มเดียว (เดิมปุ่มทึบดูเป็นแท็ก)
     ยังไม่ผูกสมาชิก ⇒ ไม่มีสรุป/แท็บ: การ์ดผูกสมาชิก · สมัครสมาชิก · เครื่องมืออื่นเป็นแถวรายการ
     ลูกค้าจากช่องค้นหา (ไม่ได้เปิดแชท) ⇒ แถบบอกว่ากำลังดูใคร + เปิดแชท / ปิด อยู่บนสุดเหมือนเดิม -->
<script>
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import X from "@lucide/svelte/icons/x";
    import UserRound from "@lucide/svelte/icons/user-round";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import * as Tabs from "$lib/components/ui/tabs/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { merch, platformOf, pendingDep, pendingWd } from "./data.js";
    import { st, panelCase, selectCase, closeLook, assistOf, lineUp } from "./store.svelte.js";
    import CustomerAvatar from "./ui/CustomerAvatar.svelte";
    import MemberSummary from "./panel/MemberSummary.svelte";
    import LineStatusBlock from "./panel/LineStatusBlock.svelte";
    import LookupBlock from "./panel/LookupBlock.svelte";
    import PasswordBlock from "./panel/PasswordBlock.svelte";
    import SlipBlock from "./panel/SlipBlock.svelte";
    import PendingBlock from "./panel/PendingBlock.svelte";
    import HistoryBlock from "./panel/HistoryBlock.svelte";
    import CreditBlock from "./panel/CreditBlock.svelte";
    import RegisterBlock from "./panel/RegisterBlock.svelte";
    import BankAccountsBlock from "./panel/BankAccountsBlock.svelte";
    import BindHistoryBlock from "./panel/BindHistoryBlock.svelte";
    import NoteHistoryBlock from "./panel/NoteHistoryBlock.svelte";
    import P2PBlock from "./panel/P2PBlock.svelte";

    let { class: className = "" } = $props();
    const c = $derived(panelCase());
    // สถานะ LINE/ผู้ช่วยปกติ ⇒ แถวรายการ · มีปัญหา ⇒ การ์ดแจ้งเตือนบนสุด
    const oaOk = $derived(!!c && (platformOf(c.merchant) !== "line" || lineUp(c)) && assistOf(c).every((a) => a.ok));
    // สลิปกำลังตรวจ/มีผล ⇒ การ์ดแจ้งเตือนบนสุด · ไม่มี ⇒ แถว "ตรวจสอบสลิป" ในแท็บการเงิน
    const slipCard = $derived(!!c && !!(c.slip && !c.slip.hidden && (c.slip.state === "reading" || c.slip.state === "ready")));
    const bound = $derived(!!c && !c.unbound);
    const pendN = $derived(c && bound ? pendingDep(c).length + pendingWd(c).length : 0);
    // กล่องกลุ่มของแถวรายการ (เมนูกลุ่มเดียว · เส้นคั่นระหว่างแถว)
    const GROUP = "bg-card ring-foreground/10 flex flex-col divide-y overflow-hidden rounded-xl ring-1";
    /* สรุปสมาชิกเต็มเลื่อนไปกับแผง · เลื่อนจนสรุปพ้นจอ ⇒ แถบย่อแถวเดียวติดบนสุด (ver2 · 23 พ.ย. 2026: จอเตี้ยไม่เสียที่ 190px ตลอด)
       แถบย่อสูง 0 ใน layout (ลอยทับ) ⇒ เนื้อหาไม่กระโดดตอนแถบโผล่/หาย */
    let panelEl = $state(null);
    let sumEl = $state(null);
    let mini = $state(false);
    $effect(() => {
        if (!panelEl || !sumEl) return void (mini = false);
        const io = new IntersectionObserver(([e]) => (mini = !e.isIntersecting), { root: panelEl, rootMargin: "-44px 0px 0px 0px" });
        io.observe(sumEl);
        return () => io.disconnect();
    });
</script>

<section
    id="colPanel"
    aria-label="ข้อมูลลูกค้า"
    class={"min-h-0 bg-surface-chrome flex-col gap-3 overflow-y-auto border-l p-3 *:shrink-0 " + className}
    style={bound ? "scroll-padding-top: 56px" : undefined}
    bind:this={panelEl}
>
    {#if st.look && c}
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
        <Empty.Root class="justify-start p-6">
            <Empty.Header>
                <Empty.Media variant="icon"><UserRound /></Empty.Media>
                <Empty.Title>ข้อมูลลูกค้า</Empty.Title>
                <Empty.Description>เปิดแชท หรือค้นหาลูกค้าจากช่องค้นหาในรายการสนทนา เพื่อดูข้อมูลสมาชิกและรายการเงิน</Empty.Description>
            </Empty.Header>
        </Empty.Root>
    {:else if bound}
        <!-- 1. แถบย่อ (โผล่เมื่อสรุปเต็มเลื่อนพ้นจอ) · -top-3 ชนขอบบนจริง · -mb-3 หักช่องห่างเพราะสูง 0 -->
        <div class="sticky -top-3 z-20 -mx-3 -mb-3 h-0">
            {#if mini}
                <div class="bg-surface-chrome/95 motion-safe:animate-in motion-safe:fade-in-0 absolute inset-x-0 top-0 border-b px-3 py-1.5 shadow-sm backdrop-blur-sm">
                    <MemberSummary {c} compact />
                </div>
            {/if}
        </div>
        <div bind:this={sumEl}><MemberSummary {c} /></div>

        <!-- 2. แจ้งเตือนที่ต้องจัดการก่อน · เพิ่งสมัครสำเร็จ ⇒ การ์ดสมัคร (ส่งข้อมูลให้ลูกค้า) -->
        {#if c.justReg}<RegisterBlock {c} />{/if}
        {#if slipCard}<SlipBlock {c} />{/if}
        {#if !oaOk}<LineStatusBlock {c} look="alert" />{/if}

        <!-- 3. แท็บตามเรื่อง -->
        <Tabs.Root bind:value={st.panelTab} class="gap-3">
            <Tabs.List class="w-full" aria-label="ข้อมูลลูกค้า">
                <Tabs.Trigger value="money">การเงิน{#if pendN}<span class="bg-warning/15 text-warning rounded-full px-1.5 text-xs tabular-nums" aria-label={"ยอดค้าง " + pendN + " รายการ"}>{pendN}</span>{/if}</Tabs.Trigger>
                <Tabs.Trigger value="member">สมาชิก</Tabs.Trigger>
                <Tabs.Trigger value="hist">ประวัติ</Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="money" class="flex flex-col gap-3">
                {#if !slipCard}<div class={GROUP}><SlipBlock {c} look="row" /></div>{/if}
                <!-- ยอดค้าง: มีเมื่อมียอดค้างเท่านั้น -->
                {#if pendN}<PendingBlock {c} />{/if}
                <!-- ลูกค้า P2P มี 2 ฟอร์ม ⇒ เลือกแสดงทีละฟอร์ม ไม่ต่อกันยาว (ver2) · ลูกค้าทั่วไปมีแค่จัดการเครดิต -->
                {#if c.p2p}
                    <ToggleGroup.Root type="single" variant="outline" class="w-full *:flex-1" aria-label="เลือกรายการที่จะทำ" bind:value={() => st.moneyForm, (v) => v && (st.moneyForm = v)}>
                        <ToggleGroup.Item value="p2p">ฝาก Manual</ToggleGroup.Item>
                        <ToggleGroup.Item value="credit">จัดการเครดิต</ToggleGroup.Item>
                    </ToggleGroup.Root>
                    {#if st.moneyForm === "p2p"}<P2PBlock {c} />{:else}<CreditBlock {c} />{/if}
                {:else}
                    <CreditBlock {c} />
                {/if}
            </Tabs.Content>

            <Tabs.Content value="member" class="flex flex-col gap-3">
                <BankAccountsBlock {c} />
                <LookupBlock {c} />
                <PasswordBlock {c} />
                {#if oaOk || !c.justReg}
                    <div class={GROUP}>
                        {#if oaOk}<LineStatusBlock {c} look="row" />{/if}
                        {#if !c.justReg}<RegisterBlock {c} look="row" />{/if}
                    </div>
                {/if}
            </Tabs.Content>

            <Tabs.Content value="hist">
                <div class={GROUP}>
                    <HistoryBlock {c} look="row" />
                    <BindHistoryBlock {c} look="row" />
                    <NoteHistoryBlock {c} look="row" />
                </div>
            </Tabs.Content>
        </Tabs.Root>
    {:else}
        <!-- ยังไม่ผูกสมาชิก: ผูก หรือสมัครใหม่ ก่อน -->
        {#if slipCard}<SlipBlock {c} />{/if}
        {#if !oaOk}<LineStatusBlock {c} look="alert" />{/if}
        <LookupBlock {c} />
        <!-- ยังไม่ผูก ⇒ ฟอร์มสมัครสมาชิกกางเป็นการ์ด (ลองเป็นแถวเปิดหน้าต่างแล้ว เจ้าของงานให้กลับแบบเดิม 23 พ.ย. 2026) -->
        <RegisterBlock {c} />
        <div class={GROUP} role="group" aria-label="เครื่องมือ">
            {#if !slipCard}<SlipBlock {c} look="row" />{/if}
            {#if oaOk}<LineStatusBlock {c} look="row" />{/if}
            <BindHistoryBlock {c} look="row" />
            <NoteHistoryBlock {c} look="row" />
        </div>
    {/if}
</section>
