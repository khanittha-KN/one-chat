<script>
    import ArrowLeft from "@lucide/svelte/icons/arrow-left";
    import { Button } from "$lib/components/ui/button/index.js";
    import PageHeader from "./ui/PageHeader.svelte";
    import AnnounceTable from "./AnnounceTable.svelte";
    import { db, showPage } from "./store.svelte.js";
</script>

<!-- เนื้อหากว้างสุด 80rem อยู่กลาง (DESIGN-SYSTEM §8) · ระยะของหน้า 14/28/48 (§4) -->
<div id="announceWrap" class="h-full overflow-y-auto">
    <div class="mx-auto flex w-full max-w-(--container-page) flex-col gap-4 px-4 pt-3.5 pb-12 md:px-7">
        <PageHeader title="Announce List" description={'ข้อความที่ "ใช้งาน" จะเป็นคีย์ลัดใต้ช่องพิมพ์ในหน้าแชท'}>
            {#snippet actions()}
                <Button variant="outline" onclick={() => showPage("console")}><ArrowLeft data-icon="inline-start" />กลับหน้าแชท</Button>
            {/snippet}
        </PageHeader>
        <!-- ต้นฉบับวาดตารางใหม่ทั้งตารางหลัง Add/Save/Delete ⇒ ค่าที่พิมพ์ค้างในแถวอื่นถูกล้าง — {#key} ให้ผลเดียวกัน -->
        {#key db.annVersion}
            <AnnounceTable />
        {/key}
    </div>
</div>
