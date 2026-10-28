<script>
    import LogIn from "@lucide/svelte/icons/log-in";
    import BrandLogo from "./ui/BrandLogo.svelte";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import Info from "@lucide/svelte/icons/info";
    import * as Alert from "$lib/components/ui/alert/index.js";
    import PasswordInput from "./ui/PasswordInput.svelte";
    import { st, login } from "./store.svelte.js";
    // ค่าที่พิมพ์คงอยู่หลังออกจากระบบ (ต้นฉบับซ่อนฟอร์มไว้ ไม่ได้ล้าง)
    let u = $state("");
    let p = $state("");
</script>

<div id="login" class="bg-surface-page grid min-h-svh place-items-center p-4">
    <Card.Root class="w-full max-w-sm">
        <Card.Header class="justify-items-center text-center">
            <Card.Title class="mb-1"><h1 class="sr-only">SmartCHAT</h1><BrandLogo class="h-10" /></Card.Title>
            <Card.Description>เข้าสู่ระบบ</Card.Description>
        </Card.Header>
        <Card.Content>
            {#if st.signedOut}
                <Alert.Root class="mb-5" role="status"><Info /><Alert.Title class="font-normal">เซสชันสิ้นสุดแล้ว — เข้าสู่ระบบใหม่</Alert.Title></Alert.Root>
            {/if}
            <form
                id="loginForm"
                class="flex flex-col gap-5"
                onsubmit={(e) => {
                    e.preventDefault();
                    login();
                }}
            >
                <Field.Group class="gap-5">
                    <Field.Field>
                        <Field.Label for="lu">Username</Field.Label>
                        <Input id="lu" type="text" placeholder="username" autocomplete="off" bind:value={u} />
                    </Field.Field>
                    <Field.Field>
                        <Field.Label for="lp">Password</Field.Label>
                        <PasswordInput id="lp" placeholder="password" autocomplete="off" bind:value={p} />
                    </Field.Field>
                </Field.Group>
                <Button type="submit" class="h-11 px-4"><LogIn data-icon="inline-start" />เข้าสู่ระบบ</Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
