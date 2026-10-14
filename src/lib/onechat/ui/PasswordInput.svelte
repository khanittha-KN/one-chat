<!-- ช่องรหัสผ่าน + ปุ่มลูกตาท้ายช่อง (input-group ของ shadcn · ปุ่ม 24px · aria-pressed บอกสถานะ)
     ใช้ที่ เปลี่ยนรหัสผ่านลูกค้า (แผงขวา) และ Settings › เปลี่ยนรหัสผ่าน · แต่ละช่องแสดง/ซ่อนแยกกัน
     เริ่มที่ซ่อนทุกครั้งที่ช่องถูกสร้างใหม่ (เปิดฟอร์ม / เปลี่ยนหน้า) · props อื่น (id, aria-*) ส่งต่อให้ input -->
<script>
    import Eye from "@lucide/svelte/icons/eye";
    import EyeOff from "@lucide/svelte/icons/eye-off";
    import * as InputGroup from "$lib/components/ui/input-group/index.js";

    // ไม่ใส่ค่าเริ่มต้นให้ value — ช่องใน Settings ผูกกับ S.f.* ที่ยังเป็น undefined ตอนเปิดหน้า (Svelte ห้าม bind undefined เข้าช่องที่มีค่าเริ่มต้น)
    let { value = $bindable(), autocomplete = "new-password", class: className, ...rest } = $props();
    let show = $state(false);
</script>

<InputGroup.Root class={className}>
    <InputGroup.Input type={show ? "text" : "password"} {autocomplete} bind:value {...rest} />
    <InputGroup.Addon align="inline-end">
        <InputGroup.Button size="icon-xs" aria-label={show ? "ซ่อนรหัสผ่าน" : "แสดงรหัสผ่าน"} aria-pressed={show} onclick={() => (show = !show)}>
            {#if show}<EyeOff />{:else}<Eye />{/if}
        </InputGroup.Button>
    </InputGroup.Addon>
</InputGroup.Root>
