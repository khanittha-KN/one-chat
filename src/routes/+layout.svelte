<script>
    import "../app.css";
    import { onMount } from "svelte";
    import { Toaster } from "$lib/components/ui/sonner/index.js";
    import { theme, bootTheme } from "$lib/theme.svelte.js";
    let { children } = $props();
    onMount(bootTheme);
</script>

<!-- toast มุมล่างขวา (มือถือล่างกลาง) หายเองใน 6 วินาที · ส่งโหมดเองเพราะไม่ใช้ mode-watcher — DESIGN-SYSTEM §10.9 -->
<Toaster theme={theme.mode === "light" ? "light" : "dark"} position="bottom-right" duration={6000} />
{@render children()}
