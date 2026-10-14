import { sveltekit } from "@sveltejs/kit/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";

export default defineConfig({
    plugins: [tailwindcss(), sveltekit()],
    server: {
        // build เขียนลง build/ — ห้ามให้ dev server เฝ้า ไม่งั้นตายด้วย EBUSY บนวินโดวส์
        watch: { ignored: ["**/build/**", "**/.svelte-kit/output/**"] },
    },
});
