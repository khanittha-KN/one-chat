<!-- โครงหน้า — DESIGN-SYSTEM §9: แถบบน 64px เต็มกว้าง · เมนูข้าง (Merchant) ใต้แถบบน · เนื้อหา bg-surface-page
     คอนโซลแชท 3 ช่อง: จอ ≥1280 รายการ | แชท | ลูกค้า · 768–1279 รายการ | แชท (ลูกค้าเปิดจากตัวสลับ) · <768 ทีละช่อง -->
<script>
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import List from "@lucide/svelte/icons/list";
    import MessagesSquare from "@lucide/svelte/icons/messages-square";
    import UserRound from "@lucide/svelte/icons/user-round";
    import Inbox from "@lucide/svelte/icons/inbox";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Empty from "$lib/components/ui/empty/index.js";
    import { st, cur, visible, closeCase, setView } from "./store.svelte.js";
    import Login from "./Login.svelte";
    import MerchantSidebar from "./Sidebar.svelte";
    import TopBar from "./TopBar.svelte";
    import ConversationList from "./ConversationList.svelte";
    import ChatPane from "./ChatPane.svelte";
    import CustomerPanel from "./CustomerPanel.svelte";
    import AnnouncePage from "./AnnouncePage.svelte";
    import SettingsPage from "./SettingsPage.svelte";
    import RecordsDialog from "./RecordsDialog.svelte";

    // มุมมองของจอแคบ (ต้นฉบับ: แท็บ การสนทนา · แชท · ลูกค้า) — Merchant อยู่ในเมนูข้าง (แผงเลื่อนบนมือถือ)
    const VIEWS = [
        ["list", "การสนทนา", List, "md:hidden"],
        ["chat", "แชท", MessagesSquare, ""],
        ["panel", "ลูกค้า", UserRound, ""],
    ];
    const v = $derived(st.view === "side" ? "list" : st.view);
    const listCls = $derived(v === "panel" ? "hidden xl:flex" : v === "chat" ? "hidden md:flex" : "flex");
    const chatCls = $derived(v === "panel" ? "hidden xl:flex" : v === "chat" ? "flex" : "hidden md:flex");
    const panelCls = $derived(v === "panel" ? "flex" : "hidden xl:flex");
    const gridCls = $derived(v === "panel" ? "md:grid-cols-1 xl:grid-cols-(--grid-console-xl)" : "md:grid-cols-(--grid-console-md) xl:grid-cols-(--grid-console-xl)");

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
    <Sidebar.Provider class="h-svh min-h-0 flex-col" style="--sidebar-width: 15.75rem">
        <TopBar />
        <div class="flex min-h-0 flex-1">
            <MerchantSidebar />
            <Sidebar.Inset class="bg-surface-page min-h-0 min-w-0">
                <div class="flex h-full min-h-0 flex-col" hidden={st.page !== "console"}>
                    <div class="bg-surface-chrome border-b p-2 xl:hidden">
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
                            <CustomerPanel class={panelCls} />
                        {:else}
                            <Card.Root class={"m-2 min-h-0 md:m-3 " + chatCls}>
                                <Empty.Root class="h-full">
                                    <Empty.Header>
                                        <Empty.Media variant="icon"><Inbox /></Empty.Media>
                                        <Empty.Title>ยังไม่ได้เลือกแชท</Empty.Title>
                                        <Empty.Description>{st.sel.length ? "เลือกแชทจากรายการสนทนาเพื่อเปิดห้องแชท" : "ติ๊ก Channel ที่แถบซ้ายก่อน แล้วเลือกแชทจากรายการ"}</Empty.Description>
                                    </Empty.Header>
                                </Empty.Root>
                            </Card.Root>
                            <section aria-label="ข้อมูลลูกค้า" class={"bg-surface-chrome min-h-0 flex-col items-center justify-center border-l p-6 " + panelCls}>
                                <p class="text-muted-foreground text-center text-sm">เลือกแชทเพื่อดูข้อมูลลูกค้า</p>
                            </section>
                        {/if}
                    </div>
                </div>
                {#if st.page === "announce"}
                    <AnnouncePage />
                {/if}
                {#if st.page === "settings"}
                    <SettingsPage />
                {/if}
            </Sidebar.Inset>
        </div>
    </Sidebar.Provider>
</div>

<RecordsDialog />
