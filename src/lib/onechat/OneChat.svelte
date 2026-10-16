<!-- โครงหน้า — DESIGN-SYSTEM §9: แถบบน 64px เต็มกว้าง · (เลือก Channel ผ่านแผงสไลด์ขวา) ใต้แถบบน · เนื้อหา bg-surface-page
     คอนโซลแชท 3 ช่อง: จอ ≥1280 รายการ | แชท | ลูกค้า · 768–1279 รายการ | แชท (ลูกค้าเปิดจากตัวสลับ) · <768 ทีละช่อง -->
<script>
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import List from "@lucide/svelte/icons/list";
    import MessagesSquare from "@lucide/svelte/icons/messages-square";
    import UserRound from "@lucide/svelte/icons/user-round";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import { st, cur, visible, closeCase, setView } from "./store.svelte.js";
    import Login from "./Login.svelte";
    import ChannelFilter from "./ChannelFilter.svelte";
    import TopBar from "./TopBar.svelte";
    import ConversationList from "./ConversationList.svelte";
    import ChatPane from "./ChatPane.svelte";
    import CustomerPanel from "./CustomerPanel.svelte";
    import AnnouncePage from "./AnnouncePage.svelte";
    import SettingsPage from "./SettingsPage.svelte";
    import RecordsDialog from "./RecordsDialog.svelte";

    // มุมมองของจอแคบ (ต้นฉบับ: แท็บ การสนทนา · แชท · ลูกค้า) — Merchant อยู่ในเมนูข้าง (แผงเลื่อนบนมือถือ)
    const VIEWS = [
        ["list", "การสนทนา", List, ""],
        ["chat", "แชท", MessagesSquare, ""],
        ["panel", "ลูกค้า", UserRound, ""],
    ];
    const v = $derived(st.view === "side" ? "list" : st.view);
    // มือถือ (< 768) ทีละช่องตามแท็บ · tablet ขึ้นไป (≥ 768) เห็น รายการ · แชท · ลูกค้า ครบ 3 ช่อง (เจ้าของงานสั่ง 15 ต.ค. 2026)
    // ซ่อนแผงลูกค้า (ปุ่ม ◫ ในหัวห้องแชท) ⇒ เหลือ รายการ | แชท
    const panelOff = $derived(st.panelOff);
    const listCls = $derived(v === "list" ? "flex" : "hidden md:flex");
    const chatCls = $derived(v === "chat" ? "flex" : "hidden md:flex");
    const panelCls = $derived((v === "panel" ? "flex" : "hidden") + (panelOff ? " md:hidden" : " md:flex"));
    const gridCls = $derived(panelOff ? "md:grid-cols-(--grid-console-md)" : "md:grid-cols-(--grid-console-tab) lg:grid-cols-(--grid-console-lg) xl:grid-cols-(--grid-console-xl)");

    // แชทที่เปิดอยู่ยังอยู่ใน Channel ที่ติ๊กหรือไม่ — ไม่อยู่ ⇒ ไม่แสดงห้องแชทและข้อมูลลูกค้า
    const shown = $derived(visible().some((c) => c.id === st.cur));

    function onKey(e) {
        if (e.key === "F4" && st.page === "console" && st.loggedIn && shown) {
            e.preventDefault();
            closeCase(cur());
        }
    }
</script>

<svelte:window onkeydown={onKey} />

<div hidden={st.loggedIn}><Login /></div>

<div id="app" hidden={!st.loggedIn} data-shadcn>
    <!-- ไม่มีแถบ Merchant ถาวรแล้ว (เจ้าของงานสั่ง 15 ต.ค. 2026) — เลือก Channel จากแผงสไลด์ขวา (ChannelFilter) ⇒ คอนโซลได้ความกว้างเต็มจอ -->
    <div class="flex h-svh min-h-0 flex-col">
        <TopBar />
        <div class="flex min-h-0 flex-1">
            <main class="bg-surface-page flex min-h-0 min-w-0 flex-1 flex-col">
                <div class="flex h-full min-h-0 flex-col" hidden={st.page !== "console"}>
                    <div class="bg-surface-chrome border-b p-2 md:hidden">
                        <ToggleGroup.Root
                            type="single"
                            variant="outline"
                            class="w-full *:flex-1"
                            aria-label="มุมมอง"
                            bind:value={() => v, (nv) => nv && setView(nv)}
                        >
                            {#each VIEWS as [key, label, Icon, cls] (key)}
                                <ToggleGroup.Item value={key} class={cls}><Icon />{label}</ToggleGroup.Item>
                            {/each}
                        </ToggleGroup.Root>
                    </div>
                    <div id="consoleWrap" class={"grid min-h-0 flex-1 " + gridCls}>
                        <ConversationList class={listCls} />
                        {#if shown}
                            <ChatPane class={chatCls} />
                        {:else}
                            <!-- ยังไม่เปิดแชท (หลังล็อกอิน · หรือแชทที่เปิดอยู่ไม่อยู่ใน Channel ที่ติ๊ก) — แบบ LINE: ไม่เปิดแชทให้เอง รอแอดมินเลือก -->
                            <Card.Root class={"m-2 min-h-0 lg:m-3 " + chatCls} role="region" aria-label="ห้องแชท">
                                <Empty.Root class="h-full">
                                    <Empty.Header>
                                        <Empty.Media variant="icon" class="bg-brand/10 text-brand size-14 rounded-2xl"><MessagesSquare class="size-7" /></Empty.Media>
                                        {#if st.sel.length}
                                            <Empty.Title>เลือกแชทเพื่อเริ่มสนทนา</Empty.Title>
                                            <Empty.Description>กดแชทจากรายการสนทนาเพื่อเปิดห้องแชท ดูข้อมูลลูกค้า และตอบกลับ</Empty.Description>
                                        {:else}
                                            <Empty.Title>ยังไม่ได้เลือก Channel</Empty.Title>
                                            <Empty.Description>กดปุ่ม "เลือกแชทที่แสดง" ที่แถบบนเพื่อติ๊ก Channel ก่อน แล้วเลือกแชทจากรายการสนทนา</Empty.Description>
                                        {/if}
                                    </Empty.Header>
                                </Empty.Root>
                            </Card.Root>
                        {/if}
                        <!-- แผงขวาแสดงเสมอ: เครื่องมือ (ค้นหา · ตรวจสอบ · สมัครสมาชิก) ใช้ได้โดยไม่ต้องเปิดแชท · การ์ดข้อมูลลูกค้าขึ้นเมื่อมีลูกค้า -->
                        <CustomerPanel class={panelCls} />
                    </div>
                </div>
                {#if st.page === "announce"}
                    <AnnouncePage />
                {/if}
                {#if st.page === "settings"}
                    <SettingsPage />
                {/if}
            </main>
        </div>
    </div>
    <ChannelFilter />
</div>

<RecordsDialog />
