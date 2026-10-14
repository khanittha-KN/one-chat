<script>
    import LogIn from "@lucide/svelte/icons/log-in";
    import MessageCircle from "@lucide/svelte/icons/message-circle";
    import * as Card from "$lib/components/ui/card/index.js";
    import * as Field from "$lib/components/ui/field/index.js";
    import { Input } from "$lib/components/ui/input/index.js";
    import { Button } from "$lib/components/ui/button/index.js";
    import { login } from "./store.svelte.js";
    // ค่าที่พิมพ์คงอยู่หลังออกจากระบบ (ต้นฉบับซ่อนฟอร์มไว้ ไม่ได้ล้าง)
    let u = $state("");
    let p = $state("");
</script>

<div id="login" class="bg-surface-page grid min-h-svh place-items-center p-4">
    <Card.Root class="w-full max-w-sm">
        <Card.Header class="justify-items-center text-center">
            <span class="bg-brand/10 text-brand mb-2 grid size-12 place-items-center rounded-xl" aria-hidden="true">
                <MessageCircle class="size-6" />
            </span>
            <Card.Title class="text-2xl">OneChat</Card.Title>
            <Card.Description>เข้าสู่ระบบ</Card.Description>
        </Card.Header>
        <Card.Content>
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
                        <Input id="lp" type="password" placeholder="password" autocomplete="off" bind:value={p} />
                    </Field.Field>
                </Field.Group>
                <Button type="submit" class="h-11 px-4"><LogIn data-icon="inline-start" />เข้าสู่ระบบ</Button>
            </form>
        </Card.Content>
    </Card.Root>
</div>
