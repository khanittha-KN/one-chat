<!-- รูปโปรไฟล์ลูกค้า (LINE) — มี c.user.picture ⇒ แสดงรูป · ไม่มี ⇒ ตัวแรกของชื่อ LINE ในวงกลม (เดิมใช้ตัวท้ายตามต้นฉบับที่ชื่อเป็น "ลูกค้า N")
     ข้อมูลตัวอย่างยังไม่มีรูปจริง · ตอนต่อ LINE ใส่ URL รูปโปรไฟล์ที่ user.picture
     ขนาดตั้งต้น 36px · ส่ง class="size-8" ทับได้ (cn รวมคลาสให้ ตัวที่ส่งมาชนะ) -->
<script>
    import { cn } from "$lib/utils.js";
    let { c, class: className = "" } = $props();
    let broken = $state(false);
    // ตัวแรกของชื่อ LINE (ข้ามสระหน้า เ แ โ ใ ไ ให้ได้พยัญชนะ) · อังกฤษเป็นตัวใหญ่
    const initial = $derived((c.name.trim().replace(/^[เแโใไ]/, "")[0] || "?").toUpperCase());
</script>

{#if c.user.picture && !broken}
    <img
        src={c.user.picture}
        alt=""
        class={cn("size-9 shrink-0 rounded-full object-cover", className)}
        onerror={() => (broken = true)}
    />
{:else}
    <span class={cn("bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold", className)} aria-hidden="true"
        >{initial}</span
    >
{/if}
