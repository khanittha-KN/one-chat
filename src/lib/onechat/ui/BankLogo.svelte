<!-- โลโก้ธนาคาร = สีแบรนด์ของธนาคาร (ข้อมูล ไม่ใช่สีของธีม) · ขนาดเท่า Item.Media image (40px · sm 32px) -->
<script>
    import { bankOf } from "../data.js";
    let { code, class: className = "" } = $props();
    const b = $derived(bankOf(code));
</script>

<span
    class={"grid size-10 shrink-0 place-items-center rounded-md text-xs font-bold " + className}
    style:background={b.bg}
    style:color={b.fg}
    aria-hidden="true">{b.code}</span
>
