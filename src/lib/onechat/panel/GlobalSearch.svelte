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
        return db.cases.filter((c) => [c.name, c.lineName || "", c.label || "", c.user.username, c.user.fullname, c.user.mobile].join(" ").toLowerCase().indexOf(s) >= 0).slice(0, 8);
    });

    // แยกข้อความเป็นช่วงที่ตรง / ไม่ตรงกับคำค้น (ไม่สนตัวพิมพ์เล็กใหญ่) ⇒ ไฮไลต์ช่วงที่ตรง
    function parts(text) {
        const s = q.trim().toLowerCase(), t = String(text ?? "");
        if (!s) return [{ t, m: false }];
        const out = [];
        let i = 0, j;
        while ((j = t.toLowerCase().indexOf(s, i)) >= 0) {
            if (j > i) out.push({ t: t.slice(i, j), m: false });
            out.push({ t: t.slice(j, j + s.length), m: true });
            i = j + s.length;
        }
        if (i < t.length) out.push({ t: t.slice(i), m: false });
        return out;
    }
    function pick(id) {
        pickSearch(id);
        open = false;
        q = "";
    }
</script>

<!-- ตัวอักษรที่ตรงกับคำค้น: พื้นเหลืองอ่อน ตัวหนา (ตัวอักษรสีหลักอ่านได้ทั้งสองธีม) -->
{#snippet hl(text)}{#each parts(text) as p, i (i)}{#if p.m}<mark class="bg-warning/30 text-foreground rounded-sm font-bold">{p.t}</mark>{:else}{p.t}{/if}{/each}{/snippet}

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
                            <Item.Title><span class="min-w-0 truncate">{@render hl(c.name)} · {@render hl(c.user.username)}</span></Item.Title>
                            <Item.Description>{@render hl(c.user.fullname)} · <span class="tabular-nums">{@render hl(c.user.mobile)}</span> · {merch(c.merchant).name}</Item.Description>
                        </Item.Content>
                    </button>
                {/snippet}
            </Item.Root>
        {:else}
            <p class="text-muted-foreground px-3 py-2 text-sm">ไม่พบลูกค้า</p>
        {/each}
    </div>
</div>
