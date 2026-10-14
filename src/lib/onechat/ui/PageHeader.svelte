<!-- หัวหน้า — DESIGN-SYSTEM §9.3 (แบบเดียวกับ PageHeader ของต้นแบบเฟส 2): h1 + คำอธิบายหนึ่งบรรทัด · ปุ่มของหน้าชิดขวา ตกลงใต้ h1 บนจอแคบ -->
<script>
    let { title, description = "", actions } = $props();
</script>

<header class="flex flex-col gap-2">
    <div class="flex flex-wrap items-start gap-x-4 gap-y-3">
        <div class="flex min-w-0 flex-1 basis-72 flex-col gap-1">
            <h1 class="text-2xl font-bold">{title}</h1>
            {#if description}
                <p class="text-muted-foreground max-w-prose text-sm">{@html description}</p>
            {/if}
        </div>
        {#if actions}
            <div class="flex flex-wrap items-center gap-2">{@render actions()}</div>
        {/if}
    </div>
</header>
