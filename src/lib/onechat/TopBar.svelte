<!-- แถบบน 64px — DESIGN-SYSTEM §9.1: ปุ่มเมนูเฉพาะมือถือ · โลโก้ · ชื่อหน้า · (พื้นที่คงเหลือ) · สลับโหมด · เมนู -->
<script>
    import MenuIcon from "@lucide/svelte/icons/menu";
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import Moon from "@lucide/svelte/icons/moon";
    import Sun from "@lucide/svelte/icons/sun";
    import * as Sidebar from "$lib/components/ui/sidebar/index.js";
    import * as ToggleGroup from "$lib/components/ui/toggle-group/index.js";
    import * as DropdownMenu from "$lib/components/ui/dropdown-menu/index.js";
    import { buttonVariants } from "$lib/components/ui/button/index.js";
    import { Separator } from "$lib/components/ui/separator/index.js";
    import { MENU_GROUPS } from "./data.js";
    import { st, go, showPage } from "./store.svelte.js";
    import { theme, setTheme } from "$lib/theme.svelte.js";
</script>

<header class="bg-surface-chrome sticky top-0 z-10 flex h-(--header-height) w-full shrink-0 items-center gap-3 border-b px-4 md:px-6">
    <Sidebar.Trigger class="md:hidden" aria-label="เปิดเมนู Merchant" />
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
    <span class="text-muted-foreground hidden text-sm lg:inline">
        พื้นที่คงเหลือ <b class="text-success font-bold tabular-nums">63.38%</b>
    </span>
    <ToggleGroup.Root
        type="single"
        variant="outline"
        size="sm"
        bind:value={() => theme.mode, (mode) => setTheme(mode)}
        aria-label="โหมดการแสดงผล"
    >
        <ToggleGroup.Item value="light" aria-label="โหมดสว่าง"><Sun /><span class="hidden sm:inline">สว่าง</span></ToggleGroup.Item>
        <ToggleGroup.Item value="dark" aria-label="โหมดมืด"><Moon /><span class="hidden sm:inline">มืด</span></ToggleGroup.Item>
    </ToggleGroup.Root>
    <DropdownMenu.Root bind:open={st.menu}>
        <DropdownMenu.Trigger id="burger" aria-label="เมนู" class={buttonVariants({ variant: "outline", size: "icon" })}>
            <MenuIcon />
        </DropdownMenu.Trigger>
        <DropdownMenu.Content align="end" class="w-72">
            {#each MENU_GROUPS as g, gi (gi)}
                {#if gi > 0}<DropdownMenu.Separator />{/if}
                <DropdownMenu.Group>
                    {#each g as [label, Icon, key] (label)}
                        <DropdownMenu.Item class="h-9" onSelect={() => go(key, label)}>
                            <Icon aria-hidden="true" />{label}
                        </DropdownMenu.Item>
                    {/each}
                </DropdownMenu.Group>
            {/each}
        </DropdownMenu.Content>
    </DropdownMenu.Root>
</header>
