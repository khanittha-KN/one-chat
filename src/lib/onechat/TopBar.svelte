<!-- แถบบน 64px — DESIGN-SYSTEM §9.1: ปุ่มเมนูเฉพาะมือถือ · โลโก้ · ชื่อหน้า · สลับโหมด · เมนู -->
<script>
    import MenuIcon from "@lucide/svelte/icons/menu";
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import Moon from "@lucide/svelte/icons/moon";
    import Sun from "@lucide/svelte/icons/sun";
    import Bell from "@lucide/svelte/icons/bell";
    import BellOff from "@lucide/svelte/icons/bell-off";
    import { snd, setSound } from "./sound.svelte.js";
    import UserRound from "@lucide/svelte/icons/user-round";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { Button, buttonVariants } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { MENU_GROUPS } from "./data.js";
    import { st, go, showPage, ME } from "./store.svelte.js";
    import { theme, setTheme, THEMES } from "$lib/theme.svelte.js";
</script>

<header class="bg-surface-chrome sticky top-0 z-10 flex h-(--header-height) w-full shrink-0 items-center gap-3 border-b px-4 md:px-6">
    <button
        type="button"
        class="text-brand inline-flex min-h-6 items-center gap-2 rounded-md text-lg font-bold"
        onclick={() => showPage("console")}
    >
        <MessageCircle class="size-6" aria-hidden="true" />OneChat
    </button>
    <Separator orientation="vertical" class="hidden h-5 sm:block" />
    <h1 class="hidden items-center gap-2 text-base font-bold sm:flex">
        <span class="bg-success size-2 rounded-full" aria-hidden="true"></span>แชท<span class="sr-only">(ออนไลน์)</span>
    </h1>
    <span class="flex-1"></span>
    <ToggleGroup.Root
        type="single"
        variant="outline"
        size="sm"
        bind:value={() => theme.mode, (mode) => setTheme(mode)}
        aria-label="โหมดการแสดงผล"
    >
        <ToggleGroup.Item value="light" aria-label="โหมดสว่าง"><Sun /><span class="hidden sm:inline">สว่าง</span></ToggleGroup.Item>
        <ToggleGroup.Item value="dark" aria-label="โหมดมืด"><Moon /><span class="hidden sm:inline">มืด</span></ToggleGroup.Item>
        <!-- ธีมมืดเพิ่ม 3 แบบต่อจาก "มืด" (เจ้าของงานสั่ง 15 ต.ค. 2026) · วงกลมครึ่งซ้าย = เทาของธีม ครึ่งขวา = สีหลัก -->
        {#each THEMES.filter((t) => t.sw) as t (t.id)}
            <ToggleGroup.Item value={t.id} aria-label={"ธีมมืด " + t.label} title={"ธีมมืด " + t.label}>
                <span class="ring-foreground/25 size-3.5 shrink-0 rounded-full ring-1" style={"background: linear-gradient(90deg, " + t.sw[0] + " 50%, " + t.sw[1] + " 50%)"} aria-hidden="true"></span><span class="hidden xl:inline">{t.label}</span>
            </ToggleGroup.Item>
        {/each}
    </ToggleGroup.Root>
    <!-- เปิด/ปิดเสียงแจ้งเตือนข้อความลูกค้า (เจ้าของงานสั่ง 15 ต.ค. 2026) · ตั้งเสียง/ความดังที่ ตั้งค่าทั่วไป -->
    <Button
        variant="outline"
        size="icon"
        aria-pressed={snd.on}
        aria-label={snd.on ? "เสียงแจ้งเตือน: เปิดอยู่ — กดเพื่อปิด" : "เสียงแจ้งเตือน: ปิดอยู่ — กดเพื่อเปิด"}
        title={snd.on ? "ปิดเสียงแจ้งเตือน" : "เปิดเสียงแจ้งเตือน"}
        onclick={() => setSound({ on: !snd.on }, true)}
    >
        {#if snd.on}<Bell />{:else}<BellOff class="text-muted-foreground" />{/if}
    </Button>
    <DropdownMenu.Root bind:open={st.menu}>
        <DropdownMenu.Trigger id="burger" aria-label="เมนู" class={buttonVariants({ variant: "outline", size: "icon" })}>
            <MenuIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-72">
            <!-- ผู้ใช้ที่ล็อกอิน (เดิมอยู่ท้ายแถบ Merchant) -->
            <DropdownMenu.Label class="flex items-center gap-2"><UserRound class="text-muted-foreground size-4" aria-hidden="true" />{ME}</DropdownMenu.Label>
            <DropdownMenu.Separator />
            {#each MENU_GROUPS as g, gi (gi)}
                {#if gi > 0}<DropdownMenu.Separator />{/if}
                <DropdownMenu.Group>
                    {#each g as [label, Icon, key] (label)}
                        <DropdownMenu.Item class="h-9" onSelect={() => go(key)}>
                            <Icon aria-hidden="true" />{label}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Group>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</header>
