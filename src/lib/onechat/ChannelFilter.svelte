<!-- เลือกแชทที่แสดง — แผงสไลด์จากด้านซ้าย ฝั่งเดียวกับปุ่มใต้หัวการสนทนา (เจ้าของงานสั่ง 15 ต.ค. 2026 · เดิมสไลด์จากขวา · เดิมเป็นแถบ Merchant ด้านซ้ายถาวร)
     เปิดจากปุ่ม "เลือกแชทที่แสดง" ที่แถบบน · โครงสร้าง Organization → Agent → LINE Channel (เอกสารส่งต่องาน 9 ต.ค. 2026 ฉบับแก้):
       - checkbox แบบต้นไม้: ทั้งหมด → Agent → Channel (ครบ ✓ · บางส่วน − · ไม่เลือก ว่าง) · ไม่ติ๊กเลย = ไม่แสดงแชท
       - Channel: checkbox + สัญลักษณ์ LINE / Telegram + จำนวนแชท + ปุ่มตั้งค่าของ Channel นั้น · LINE LIFF เท่านั้นไม่แสดง · Agent ที่ไม่เหลือ Channel ก็ไม่แสดง
       - checkbox เป็นตัวกรองรายการสนทนาเท่านั้น ไม่แตะค่าฟังก์ชันหรือ Permissions ของ Channel -->
<script>
    import ChevronRight from "@lucide/svelte/icons/chevron-right";
    import SettingsIcon from "@lucide/svelte/icons/settings";
    import * as Sheet from "$lib/components/ui/sheet/index.js";
    import * as Collapsible from "$lib/components/ui/collapsible/index.js";
    import { Checkbox } from "$lib/components/ui/checkbox/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { agentGroups, chatChannels } from "./data.js";
    import PlatformIcon from "./ui/PlatformIcon.svelte";
    import { st, selectAll, toggleMerchant, setAgent, openSettings } from "./store.svelte.js";

    const groups = agentGroups();
    const total = chatChannels().length;
    const nSel = $derived(st.sel.length);
    const allSel = $derived(nSel > 0 && nSel === total);
    const someSel = $derived(nSel > 0 && nSel < total);
</script>

<Sheet.Root bind:open={st.chanOpen}>
    <Sheet.Content side="left" class="w-full gap-0 data-[side=left]:sm:max-w-sm">
        <Sheet.Header class="border-b">
            <Sheet.Title>เลือกแชทที่แสดง</Sheet.Title>
        </Sheet.Header>
        <div class="flex min-h-0 flex-1 flex-col overflow-y-auto">
            <div class="flex flex-col gap-1 p-3">
                <label class="hover:bg-muted flex h-9 cursor-pointer items-center gap-2 rounded-md px-2">
                    <Checkbox checked={allSel} indeterminate={someSel} onCheckedChange={() => selectAll(!allSel)} aria-label="เลือกทุก Channel" />
                    <span class="flex-1 text-sm font-bold">ทั้งหมด</span>
                    <span class="text-muted-foreground text-xs tabular-nums">{nSel ? nSel + "/" + total : "ยังไม่ได้เลือก"}</span>
                </label>
            </div>
            {#each groups as g (g.agent.id)}
                {@const ids = g.channels.map((m) => m.id)}
                {@const n = ids.filter((id) => st.sel.indexOf(id) >= 0).length}
                {@const all = n === ids.length}
                {@const some = n > 0 && !all}
                <!-- แต่ละ Agent คั่นด้วยเส้นบน · Channel ของ Agent อยู่ใต้เส้นนำสายตาแนวตั้งจาก checkbox ของ Agent -->
                <Collapsible.Root open={!st.collapsed[g.agent.id]} onOpenChange={(o) => (st.collapsed[g.agent.id] = !o)} class="group/agent border-t px-3 py-1.5">
                    <div class="flex min-h-9 items-center gap-1 ps-2">
                        <Checkbox
                            checked={all}
                            indeterminate={some}
                            onCheckedChange={() => setAgent(ids, !all)}
                            aria-label={"เลือกทุก Channel ของ " + g.agent.name + (some ? " (เลือกอยู่ " + n + " จาก " + ids.length + ")" : "")}
                        />
                        <span class="min-w-0 flex-1 truncate px-2 text-sm font-bold" title={g.agent.name}>{g.agent.name}</span>
                        <span class="text-muted-foreground text-xs tabular-nums">{n}/{ids.length}</span>
                        <!-- ตั้งค่าระดับ Agent: ตั้งครั้งเดียว ใช้กับทุก Channel ใน Agent (เจ้าของงานสั่ง 29 ต.ค. 2026) -->
                        <Button
                            variant="ghost"
                            size="icon-sm"
                            aria-label={"ตั้งค่า Agent " + g.agent.name}
                            title={"ตั้งค่า Agent " + g.agent.name + " (ใช้กับทุก Channel)"}
                            onclick={() => {
                                st.chanOpen = false;
                                openSettings("gen", "", false, g.agent.id);
                            }}><SettingsIcon /></Button
                        >
                        <Collapsible.Trigger class={buttonVariants({ variant: "ghost", size: "icon-sm" }) + " text-muted-foreground aria-expanded:bg-transparent"} aria-label={"พับ/ขยาย " + g.agent.name}>
                            <ChevronRight class="transition-transform group-data-[state=open]/agent:rotate-90" />
                        </Collapsible.Trigger>
                    </div>
                    <Collapsible.Content>
                        <ul class="ms-4 flex flex-col gap-0.5 border-l ps-1.5">
                            {#each g.channels as m (m.id)}
                                <li class="hover:bg-muted flex min-h-9 items-center gap-1 rounded-md pe-1">
                                    <label class="flex min-w-0 flex-1 cursor-pointer items-center gap-2 py-1 ps-2" title={m.name}>
                                        <Checkbox checked={st.sel.indexOf(m.id) >= 0} onCheckedChange={(v) => toggleMerchant(m.id, v)} />
                                        <PlatformIcon p={m.platform} />
                                        <span class="min-w-0 flex-1 truncate text-sm">{m.name}</span>
                                        <span class="text-muted-foreground text-xs tabular-nums" title="จำนวนแชทไลน์ทั้งหมดที่เคยทักเข้ามา"
                                            >{m.chats.toLocaleString()}<span class="sr-only"> แชท</span></span
                                        >
                                    </label>
                                    <!-- ตั้งค่าของ Channel นั้น (เจ้าของงานสั่ง 15 ต.ค. 2026) -->
                                    <Button
                                        variant="ghost"
                                        size="icon-sm"
                                        aria-label={"ตั้งค่า " + m.name}
                                        title={"ตั้งค่า " + m.name}
                                        onclick={() => {
                                            st.chanOpen = false;
                                            openSettings("gen", m.name);
                                        }}><SettingsIcon /></Button
                                    >
                                </li>
                            {/each}
                        </ul>
                    </Collapsible.Content>
                </Collapsible.Root>
            {/each}
        </div>
        <Sheet.Footer class="border-t">
            <Button onclick={() => (st.chanOpen = false)}>ดูแชท {nSel ? nSel + " Channel" : ""}</Button>
        </Sheet.Footer>
    </Sheet.Content>
</Sheet.Root>
