<!-- รูปสติ๊กเกอร์ LINE จริงจาก CDN ของ LINE (ชุดพื้นฐานของ Messaging API) · โหลดไม่ได้ ⇒ ไอคอนสติ๊กเกอร์แทน
     k = "446-3" (ชุด-ลำดับ) หรือ "id-123" (Sticker ID) · ขนาดกำหนดจาก class ของผู้เรียก -->
<script>
    import StickerIcon from "@lucide/svelte/icons/sticker";
    import { stickerSrc, stickerLabel, isStickerKey } from "../data.js";

    let { k, class: className = "size-12" } = $props();
    let broken = $state(false);
    const src = $derived(isStickerKey(k) ? stickerSrc(k) : "");
</script>

{#if src && !broken}
    <img {src} alt={"สติ๊กเกอร์ " + stickerLabel(k)} loading="lazy" draggable="false" class={"object-contain " + className} onerror={() => (broken = true)} />
{:else}
    <span class={"text-brand grid place-items-center " + className} role="img" aria-label={"สติ๊กเกอร์ " + stickerLabel(k)}><StickerIcon class="size-1/2" aria-hidden="true" /></span>
{/if}
