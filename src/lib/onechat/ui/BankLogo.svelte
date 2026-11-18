<!-- โลโก้ธนาคาร = กล่องสีประจำธนาคาร + รูปโลโก้จริง (omise/banks-logo · static/banks/) ขนาดเท่า Item.Media image (40px)
     โลโก้ใช้เป็น mask แล้วระบายด้วย fg ⇒ เปลี่ยนสีโลโก้ได้ (กรุงศรีโลโก้เข้มบนพื้นเหลือง) และไฟล์ SVG ไม่ถูกรันเป็นเอกสาร
     เป็นภาพประกอบ aria-hidden — ชื่อธนาคารอยู่ในข้อความข้าง ๆ เสมอ -->
<script>
    import { cn } from "$lib/utils.js";
    import { bankOf, bankLogoSrc } from "../data.js";
    let { code, class: className = "" } = $props();
    const b = $derived(bankOf(code));
    const mask = $derived(`url(${bankLogoSrc(b.code)}) center / contain no-repeat`);
</script>

<span class={cn("grid size-10 shrink-0 place-items-center rounded-md", className)} style:background={b.bg} aria-hidden="true">
    <!-- โลโก้ 60% ของกล่อง ⇒ กล่องขนาดไหนก็ได้สัดส่วนเดิม (กล่อง 40px = โลโก้ 24px เท่าเดิม) -->
    <span class="size-[60%]" style="background-color: {b.fg}; -webkit-mask: {mask}; mask: {mask};"></span>
</span>
