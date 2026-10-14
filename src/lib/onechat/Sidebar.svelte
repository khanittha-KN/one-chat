<!-- เมนูข้าง Merchant — DESIGN-SYSTEM §9.2: sidebar ของ shadcn ใต้แถบบน · กว้าง 252px · พื้นเท่าแถบบน · มือถือเปิดเป็นแผงเลื่อน
     โครงสร้าง Organization → Agent → LINE Channel (เอกสารส่งต่องาน 9 ต.ค. 2026 ฉบับแก้):
       - Org ปัจจุบันเป็นบริบทด้านบน (ต้นฉบับไม่มีตัวเลือก Org ⇒ แสดงอย่างเดียว ไม่เพิ่มขั้นตอน)
       - หัวกลุ่ม Agent (= เว็บ) = checkbox ทั้ง Agent (ครบ ✓ · บางส่วน − · ไม่เลือก ว่าง) + ชื่อ Agent + ลูกศรพับ/ขยาย
       - Channel: checkbox กรองรายการแชต (เหมือนเดิม) + จำนวนแชต (ปุ่มตั้งค่าย้ายไปหัว Agent) · ไม่แสดงป้าย LIFF แล้ว (เจ้าของงานให้เอาออก 12 ต.ค. 2026)
         ไม่มีป้าย = เปิดแชทรวมอย่างเดียว · LINE LIFF เท่านั้นไม่แสดงในแถบนี้ (เจ้าของงานสั่ง) · Agent ที่ไม่เหลือ Channel ก็ไม่แสดง
       - checkbox ทั้งหมดเป็นตัวกรองรายการสนทนา ไม่แตะค่าฟังก์ชันหรือ Permissions ของ Channel -->
<script>
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import LogOut from "@lucide/svelte/icons/log-out";
    import UserRound from "@lucide/svelte/icons/user-round";
    import Building2 from "@lucide/svelte/icons/building-2";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { useSidebar } from "$lib/components/ui/sidebar/context.svelte.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { org, agentGroups, chatChannels } from "./data.js";
    import { st, ME, selectAll, toggleMerchant, setAgent, openSettings, go } from "./store.svelte.js";

    const sidebar = useSidebar();
    const closeOnMobile = () => sidebar.isMobile && sidebar.setOpenMobile(false);
    const groups = agentGroups();
    const total = chatChannels().length;
    const nSel = $derived(st.sel.length);
    const allSel = $derived(nSel > 0 && nSel === total);
    const someSel = $derived(nSel > 0 && nSel < total);
</script>

<!-- surface-rail = สีกรมท่าแบบแถบซ้ายของ LINE ในโหมดสว่าง (เจ้าของงานสั่ง 14 ต.ค. 2026 · โทเคนอยู่ใน app.css) · โหมดมืดคงเดิม -->
<Sidebar.Root id="colSide" aria-label="Merchant" class="surface-rail top-(--header-height) h-(--below-header)">
    <Sidebar.Header class="gap-1 px-2 pt-2 pb-1">
        <div class="flex min-w-0 items-center gap-2 px-2 text-sm font-bold" title={org.name}>
            <Building2 class="text-muted-foreground size-4 shrink-0" aria-hidden="true" />
            <span class="sr-only">Organization:</span><span class="truncate">{org.name}</span>
        </div>
        <!-- checkbox รวมแบบต้นไม้ (ทั้งหมด → Agent → Channel) แทนปุ่ม เลือกทั้งหมด / ล้างทั้งหมด · ไม่เลือกเลย = ไม่แสดงแชท (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
        <label class="hover:bg-sidebar-accent flex h-9 cursor-pointer items-center gap-2 rounded-md px-2">
            <Checkbox checked={allSel} indeterminate={someSel} onCheckedChange={() => selectAll(!allSel)} aria-label="เลือกทุก Channel" />
            <!-- คำบนแถว checkbox รวม: "ทั้งหมด" (เจ้าของงานสั่ง 14 ต.ค. 2026 · เดิม "Merchant") -->
            <span class="text-muted-foreground flex-1 text-xs font-bold">ทั้งหมด</span>
            <span class="text-muted-foreground text-xs tabular-nums">{nSel ? nSel + "/" + total : "ยังไม่ได้เลือก"}</span>
        </label>
    </Sidebar.Header>
    <Sidebar.Content class="gap-0">
        {#each groups as g (g.agent.id)}
            {@const ids = g.channels.map((m) => m.id)}
            {@const n = ids.filter((id) => st.sel.indexOf(id) >= 0).length}
            {@const all = n === ids.length}
            {@const some = n > 0 && !all}
            <!-- แต่ละ Agent คั่นด้วยเส้นบน · Channel ของ Agent อยู่ใต้เส้นนำสายตาแนวตั้งจาก checkbox ของ Agent -->
            <Collapsible.Root open={!st.collapsed[g.agent.id]} onOpenChange={(o) => (st.collapsed[g.agent.id] = !o)} class="group/agent border-t">
                <Sidebar.Group class="agent-group py-1.5">
                    <div class="flex min-h-9 items-center gap-1 ps-2">
                        <Checkbox
                            checked={all}
                            indeterminate={some}
                            onCheckedChange={() => setAgent(ids, !all)}
                            aria-label={"เลือกทุก Channel ของ " + g.agent.name + (some ? " (เลือกอยู่ " + n + " จาก " + ids.length + ")" : "")}
                        />
                        <span class="min-w-0 flex-1 truncate px-2 text-sm font-bold" title={g.agent.name}>{g.agent.name}</span>
                        <!-- ลำดับ: ตั้งค่า แล้วลูกศรพับ/ขยายชิดขวาสุด (เจ้าของงานสั่ง 12 ต.ค. 2026) -->
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={"ตั้งค่า " + g.agent.name}
                            title={"ตั้งค่า " + g.agent.name}
                            onclick={() => {
                                closeOnMobile();
                                openSettings("stk", g.agent.name);
                            }}><SettingsIcon /></Button
                        >
                        <Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "icon-sm" }) + " text-muted-foreground aria-expanded:bg-transparent"} aria-label={"พับ/ขยาย " + g.agent.name}>
                            <ChevronRight class="transition-transform group-data-[state=open]/agent:rotate-90" />
                        </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                        <Sidebar.Menu class="ms-4 w-auto border-l ps-1.5">
                            {#each g.channels as m (m.id)}
                                <Sidebar.MenuItem>
                                    <Sidebar.MenuButton class="h-auto min-h-8 py-1 ps-2 pe-2">
                                        {#snippet child({ props })}
                                            <label {...props} title={m.name}>
                                                <Checkbox checked={st.sel.indexOf(m.id) >= 0} onCheckedChange={(v) => toggleMerchant(m.id, v)} />
                                                <span class="min-w-0 flex-1 truncate text-xs">{m.name}</span>
                                                <span class="text-muted-foreground text-xs tabular-nums" title="จำนวนแชทไลน์ทั้งหมดที่เคยทักเข้ามา"
                                                    >{m.chats.toLocaleString()}<span class="sr-only"> แชท</span></span
                                                >
                                            </label>
                                        {/snippet}
                                    </Sidebar.MenuButton>
                                </Sidebar.MenuItem>
                            {/each}
                        </Sidebar.Menu>
                    </Collapsible.Content>
                </Sidebar.Group>
            </Collapsible.Root>
        {/each}
    </Sidebar.Content>
    <Sidebar.Footer class="border-t">
        <div class="flex items-center gap-2 px-1">
            <UserRound class="text-muted-foreground size-4" aria-hidden="true" />
            <span class="min-w-0 flex-1 truncate text-sm">{ME}</span>
            <Button variant="ghost" size="icon-sm" aria-label="ออกจากระบบ" onclick={() => go("logout")}><LogOut /></Button>
        </div>
    </Sidebar.Footer>
</Sidebar.Root>
