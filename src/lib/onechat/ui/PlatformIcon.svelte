<!-- สัญลักษณ์ช่องทางของ Channel: โลโก้ LINE / Telegram (ไฟล์จากเจ้าของงาน 15 ต.ค. 2026 · static/platform/line.svg · telegram.svg)
     รูปทรงโลโก้ต่างกันชัด ไม่ได้แยกแค่สี · label = แสดงชื่อช่องทางต่อท้าย (ไม่แสดง ⇒ มีชื่อให้โปรแกรมอ่านหน้าจอ) -->
<script>
    import { cn } from "$lib/utils.js";
    import { PLATFORM } from "../data.js";
    let { p = "line", label = false, class: className = "" } = $props();
    const key = $derived(p === "telegram" ? "telegram" : "line");
    const name = $derived(PLATFORM[key]);
</script>

<span class={cn("inline-flex shrink-0 items-center gap-1", className)} title={label ? undefined : name}>
    <img src={"/platform/" + key + ".svg"} alt="" aria-hidden="true" draggable="false" class="size-4 shrink-0 object-contain" />
    {#if label}<span>{name}</span>{:else}<span class="sr-only">{name}</span>{/if}
</span>
