<!-- รูปภาพในคีย์ลัด / Broadcast — ต้องอัปโหลดเอง: LINE ส่งรูปได้จากลิงก์ HTTPS ของไฟล์ JPG/PNG (ไม่เกิน 10 MB) ที่ระบบเราเก็บไว้
     ต้นฉบับมีแค่ช่องพิมพ์ "ชื่อไฟล์รูป (ตัวอย่าง)" ไม่มีการอัปโหลด · ต้นแบบนี้แสดงรูปจากเครื่อง (ยังไม่ส่งขึ้นเซิร์ฟเวอร์)
     item = { t: "image", v: ชื่อไฟล์, src: ลิงก์รูป, size: ไบต์ } -->
<script>
    import Upload from "@lucide/svelte/icons/upload";
    import { Button } from "$lib/components/ui/button/index.js";

    let { item, label = "รูปภาพ" } = $props();
    let input = $state(null);
    let err = $state("");
    const MAX = 10 * 1024 * 1024;

    function onFile(e) {
        const f = e.currentTarget.files && e.currentTarget.files[0];
        e.currentTarget.value = "";
        if (!f) return;
        if (!/^image\/(jpeg|png)$/.test(f.type)) return (err = "รองรับเฉพาะไฟล์ JPG หรือ PNG — เลือกไฟล์ใหม่");
        if (f.size > MAX) return (err = "ไฟล์ใหญ่เกิน 10 MB — ย่อรูปก่อนแล้วอัปโหลดใหม่");
        err = "";
        if (item.src && item.src.startsWith("blob:")) URL.revokeObjectURL(item.src);
        item.src = URL.createObjectURL(f);
        item.v = f.name;
        item.size = f.size;
    }
</script>

<input bind:this={input} type="file" accept="image/jpeg,image/png" class="sr-only" tabindex="-1" aria-hidden="true" onchange={onFile} />
<div class="flex flex-col gap-1">
    {#if item.src}
        <div class="flex items-center gap-2">
            <img src={item.src} alt={"รูปที่อัปโหลด: " + item.v} class="size-12 shrink-0 rounded-md border object-cover" />
            <span class="flex min-w-0 flex-1 flex-col">
                <span class="truncate text-sm" title={item.v}>{item.v}</span>
                {#if item.size}<span class="text-muted-foreground text-xs tabular-nums">{item.size < 1048576 ? Math.max(1, Math.round(item.size / 1024)) + " KB" : (item.size / 1048576).toFixed(1) + " MB"}</span>{/if}
            </span>
            <Button variant="outline" size="sm" aria-label={"เปลี่ยน" + label} onclick={() => input.click()}>เปลี่ยนรูป</Button>
        </div>
    {:else}
        <Button variant="outline" class="w-full justify-start border-dashed font-normal" aria-label={"อัปโหลด" + label} onclick={() => input.click()}
            ><Upload data-icon="inline-start" />อัปโหลดรูป <span class="text-muted-foreground text-xs">JPG / PNG ไม่เกิน 10 MB</span></Button
        >
    {/if}
    {#if err}<p class="text-destructive text-xs" role="alert">{err}</p>{/if}
</div>
