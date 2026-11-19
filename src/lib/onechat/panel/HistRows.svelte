<!-- ประวัติฝาก/ถอนแบบตาราง (เจ้าของงานสั่ง 19 พ.ย. 2026)
     เรียงคอลัมน์: วันที่/เวลา · ประเภท · ยอด · สถานะ (สำเร็จไหม) · ระบบชำระเงิน · เลขอ้างอิง · ผู้ทำรายการ · หมายเหตุ (ท้ายสุด — เจ้าของงานสั่ง 19 พ.ย. 2026)
     ยอด: ฝากสีเขียว ถอนสีแดง (มีเครื่องหมาย + / − ด้วย ไม่บอกด้วยสีอย่างเดียว)
     ข้อมูลแต่ละคอลัมน์เป็นแบบเดียวกันทุกแถว: ประเภท/สถานะ = ป้าย · ที่เหลือ = ตัวหนังสือบรรทัดเดียว ไม่มีไอคอน
     ฝาก Manual = "P2P (Manual)" · บัญชีบริษัทที่รับเงินอยู่ในหมายเหตุ · จอแคบ ⇒ ตารางเลื่อนแนวนอนในกรอบของตัวเอง -->
<script>
    import * as Table from "$lib/components/ui/table/index.js";
    import { Badge } from "$lib/components/ui/badge/index.js";
    import Status from "../ui/Status.svelte";
    import { typeBadge } from "../kinds.js";
    import { p2pAcc, bankOf, money, chLabel } from "../data.js";
    let { items } = $props();
    // หมายเหตุ: ข้อความที่แอดมินกรอก + บัญชีบริษัทที่รับเงิน (ฝาก Manual) + ไม่เช็ค QRCode
    const noteOf = (r) => {
        const a = r.manual ? p2pAcc(r.acc) : null;
        return [r.note, a && "เข้าบัญชี " + bankOf(a.bank).name + " " + a.no, r.noQr && "ไม่เช็ค QRCode"].filter(Boolean).join(" · ");
    };
</script>

<div class="overflow-x-auto rounded-lg border">
    <Table.Root class="hist min-w-[52rem]">
        <Table.Header>
            <Table.Row>
                <Table.Head>วันที่/เวลา</Table.Head>
                <Table.Head>ประเภท</Table.Head>
                <Table.Head class="text-end">ยอด (บาท)</Table.Head>
                <Table.Head>สถานะ</Table.Head>
                <Table.Head>ระบบชำระเงิน</Table.Head>
                <Table.Head>เลขอ้างอิง</Table.Head>
                <Table.Head>ผู้ทำรายการ</Table.Head>
                <Table.Head>หมายเหตุ</Table.Head>
            </Table.Row>
        </Table.Header>
        <Table.Body>
            {#each items as x, i (x.r.ref + i)}
                {@const dep = x.k === "dep"}
                {@const note = noteOf(x.r)}
                <Table.Row>
                    <Table.Cell class="whitespace-nowrap tabular-nums">{x.r.time}</Table.Cell>
                    <Table.Cell><Badge variant="outline" class={typeBadge(dep)}>{dep ? "ฝาก" : "ถอน"}</Badge></Table.Cell>
                    <Table.Cell class={"text-end font-bold whitespace-nowrap tabular-nums " + (dep ? "text-success" : "text-destructive")}>{dep ? "+" : "−"}{money(x.r.amt)}</Table.Cell>
                    <Table.Cell><Status tone={x.r.ok ? "success" : "destructive"}>{x.r.ok ? "สำเร็จ" : dep ? "ยกเลิก" : "ไม่สำเร็จ"}</Status></Table.Cell>
                    <Table.Cell class="whitespace-nowrap">{chLabel(x.r.ch)}{x.r.manual ? " (Manual)" : ""}</Table.Cell>
                    <Table.Cell class="text-muted-foreground tabular-nums">{x.r.ref}</Table.Cell>
                    <Table.Cell class="whitespace-nowrap">{x.r.by ? "แอดมิน " + x.r.by : "ลูกค้า"}</Table.Cell>
                    <Table.Cell class="max-w-64 min-w-40 whitespace-normal">{#if note}{note}{:else}<span class="text-muted-foreground">-</span>{/if}</Table.Cell>
                </Table.Row>
            {/each}
        </Table.Body>
    </Table.Root>
</div>
