<!-- ค้นหาลูกค้า — input-group + ไอคอน search (DESIGN-SYSTEM §10.2) · ผลลอยใต้ช่อง ไม่ดันเนื้อหา (§10.0.1) -->
<script>
    import Search from "@lucide/svelte/icons/search";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";
    import * as Item from "$lib/components/ui/item/index.js";
    import { merch } from "../data.js";
    import { db, pickSearch } from "../store.svelte.js";

    let q = $state("");
    let open = $state(false);
    let box = $state(null);
    const results = $derived.by(() => {
        const s = q.trim().toLowerCase();
        if (!s) return [];
        return db.cases.filter((c) => [c.name, c.user.username, c.user.fullname, c.user.mobile].join(" ").toLowerCase().indexOf(s) >= 0).slice(0, 8);
    });

    function pick(id) {
        pickSearch(id);
        open = false;
        q = "";
    }
</script>

<!-- คลิกนอกช่องค้นหา ⇒ ปิดผลลัพธ์ -->
<svelte:document
    onclick={(e) => {
        if (box && !box.contains(e.target)) open = false;
    }}
/>

<div class="gs relative shrink-0" bind:this={box}>
    <InputGroup.Root class="bg-card">
        <InputGroup.Addon><Search /></InputGroup.Addon>
        <InputGroup.Input
            id="gSearch"
            type="search"
            placeholder="ค้นหาลูกค้า (ชื่อ / ไอดี / เบอร์)"
            aria-label="ค้นหาลูกค้า"
            autocomplete="off"
            bind:value={q}
            oninput={() => (open = !!q.trim())}
        />
    </InputGroup.Root>
    <div
        id="gsRes"
        class="bg-popover text-popover-foreground ring-foreground/10 absolute inset-x-0 top-full z-20 mt-1 max-h-72 overflow-y-auto rounded-lg p-1 shadow-md ring-1"
        hidden={!open || !q.trim()}
    >
        {#each results as c (c.id)}
            <Item.Root size="sm" class="hover:bg-muted text-left">
                {#snippet child({ props })}
                    <button {...props} type="button" onclick={() => pick(c.id)}>
                        <Item.Content class="min-w-0">
                            <Item.Title>{c.name} · {c.user.username}</Item.Title>
                            <Item.Description>{c.user.fullname} · {c.user.mobile} · {merch(c.merchant).name}</Item.Description>
                        </Item.Content>
                    </button>
                {/snippet}
            </Item.Root>
        {:else}
            <p class="text-muted-foreground px-3 py-2 text-sm">ไม่พบลูกค้า</p>
        {/each}
    </div>
</div>
