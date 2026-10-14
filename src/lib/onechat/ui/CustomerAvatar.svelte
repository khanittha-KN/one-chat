<!-- รูปโปรไฟล์ลูกค้า (LINE) — มี c.user.picture ⇒ แสดงรูป · ไม่มี ⇒ ตัวอักษรท้ายชื่อในวงกลมเหมือน .av ของต้นฉบับ
     ข้อมูลตัวอย่างยังไม่มีรูปจริง · ตอนต่อ LINE ใส่ URL รูปโปรไฟล์ที่ user.picture -->
<script>
    let { c, class: className = "" } = $props();
    let broken = $state(false);
</script>

{#if c.user.picture && !broken}
    <img
        src={c.user.picture}
        alt=""
        class={"size-9 shrink-0 rounded-full object-cover " + className}
        onerror={() => (broken = true)}
    />
{:else}
    <span class={"bg-muted text-muted-foreground grid size-9 shrink-0 place-items-center rounded-full text-sm font-bold " + className} aria-hidden="true"
        >{c.name.slice(-1)}</span
    >
{/if}
