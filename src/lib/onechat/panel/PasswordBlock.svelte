<!-- รหัสผ่านลูกค้า (แยกจากการ์ด "ตรวจสอบ" เดิม · ver2 23 พ.ย. 2026)
     [เปลี่ยนรหัสผ่านลูกค้า] ⇒ รหัสใหม่ 2 ครั้ง + รหัสแอดมิน ⇒ ยืนยัน ⇒ แสดงรหัสใหม่ครั้งเดียว แล้วซ่อนเอง -->
<script>
    import KeyRound from "@lucide/svelte/icons/key-round";
    import CircleCheck from "@lucide/svelte/icons/circle-check";
    import EyeOff from "@lucide/svelte/icons/eye-off";
    import Save from "@lucide/svelte/icons/save";
    import TriangleAlert from "@lucide/svelte/icons/triangle-alert";
    import { Input } from "$lib/components/ui/input/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import FoldCard from "../ui/FoldCard.svelte";
    import PasswordInput from "../ui/PasswordInput.svelte";
    import { st, pwOpen, pwCancel, pwSave, pwConfirm, pwHide } from "../store.svelte.js";
    let { c } = $props();
    const u = $derived(c.user);
</script>

{#snippet pwField(id, label, key, hint)}
    <Field.Field data-invalid={!!st.pw.err}>
        <Field.Label for={id}>{label}</Field.Label>
        <PasswordInput {id} bind:value={st.pw[key]} aria-invalid={!!st.pw.err} />
        {#if hint}<Field.Description class="text-xs">{hint}</Field.Description>{/if}
    </Field.Field>
{/snippet}

<FoldCard {c} title="รหัสผ่านลูกค้า" contentClass="gap-3">
    {#if !st.pw.open}
        <Button variant="outline" size="sm" onclick={pwOpen}><KeyRound data-icon="inline-start" />เปลี่ยนรหัสผ่านลูกค้า</Button>
        {#if st.pw.msg}<p class="text-success flex items-start gap-1.5 text-sm" role="status"><CircleCheck class="mt-0.5 size-4 shrink-0" aria-hidden="true" />{st.pw.msg}</p>{/if}
        {#if st.pw.shown}
            <div class="bg-muted/50 flex items-center gap-2 rounded-lg border p-3">
                <div class="min-w-0 flex-1">
                    <p class="text-muted-foreground text-xs">รหัสผ่านใหม่ของ {u.username}</p>
                    <p class="font-mono text-base font-bold">{st.pw.shown}</p>
                    <p class="text-muted-foreground text-xs">ซ่อนใน {st.pw.left} วินาที · ระบบไม่ส่งรหัสให้ลูกค้า</p>
                </div>
                <Button variant="ghost" size="icon-sm" aria-label="ซ่อนรหัสผ่านนี้" onclick={pwHide}><EyeOff /></Button>
            </div>
        {/if}
    {:else if !st.pw.confirm}
        <div class="flex flex-col gap-3">
            {@render pwField("pwNew", "รหัสผ่านใหม่ของ " + u.username, "a", "6-30 ตัว และไม่มีช่องว่าง")}
            {@render pwField("pwConf", "ยืนยันรหัสผ่านใหม่", "b", "")}
            <Field.Field data-invalid={!!st.pw.err}>
                <Field.Label for="pwAdmin">รหัสผ่านแอดมิน</Field.Label>
                <Input id="pwAdmin" type="password" autocomplete="off" bind:value={st.pw.admin} />
            </Field.Field>
            {#if st.pw.err}<Field.Error>{st.pw.err}</Field.Error>{/if}
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => pwSave(c)}><Save data-icon="inline-start" />บันทึกรหัสผ่านใหม่</Button>
                <Button variant="outline" size="sm" onclick={pwCancel}>ยกเลิก</Button>
            </div>
        </div>
    {:else}
        <div class="border-warning/40 bg-warning/5 flex flex-col gap-2 rounded-lg border p-3" role="alertdialog" aria-labelledby="pwT">
            <p id="pwT" class="flex items-center gap-1.5 text-sm font-bold"><TriangleAlert class="text-warning size-4" aria-hidden="true" />เปลี่ยนรหัสผ่านของ {u.username}?</p>
            <p class="text-muted-foreground text-xs">รหัสเดิมจะใช้ไม่ได้ทันที</p>
            <div class="flex gap-2 *:flex-1">
                <Button size="sm" onclick={() => pwConfirm(c)}>เปลี่ยนรหัสผ่าน</Button>
                <Button variant="outline" size="sm" onclick={() => (st.pw.confirm = false)}>ยกเลิก</Button>
            </div>
        </div>
    {/if}
</FoldCard>
