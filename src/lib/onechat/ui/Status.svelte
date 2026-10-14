<!-- ป้ายสถานะ — DESIGN-SYSTEM §10.5 · §10.21: ไอคอน + คำเสมอ · สีผ่าน data-tone เท่านั้น
     tone: success · info · warning · destructive · (ไม่ใส่) = เทา secondary -->
<script>
    import { Badge } from "$lib/components/ui/badge/index.js";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import Info from "@lucide/svelte/icons/info";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import OctagonX from "@lucide/svelte/icons/octagon-x";

    let { tone = undefined, icon = undefined, class: className = "", children, ...rest } = $props();
    const ICON = { success: CircleCheck, info: Info, warning: TriangleAlert, destructive: OctagonX };
    const Icon = $derived(icon === null ? null : (icon ?? ICON[tone] ?? null));
</script>

<Badge variant="secondary" data-tone={tone} class={className} {...rest}>
    {#if Icon}<Icon aria-hidden="true" />{/if}
    {@render children?.()}
</Badge>
