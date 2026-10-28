<!-- โลโก้ SmartCHAT (เจ้าของงานส่งไฟล์มา 27 ต.ค. 2026 · ตรงกับเว็บจริง) — ธีมสว่างใช้ตัวอักษรเข้ม · ธีมมืดทุกโทนใช้ตัวอักษรขาว
     class = ความสูง (ความกว้างตามสัดส่วนรูป 4:1) -->
<script>
    let { class: className = "h-7" } = $props();
</script>

<img src="/brand/smartchat-light.png" width="480" height="120" alt="SmartCHAT" class={"w-auto dark:hidden " + className} />
<img src="/brand/smartchat-dark.png" width="480" height="120" alt="SmartCHAT" class={"hidden w-auto dark:block " + className} />
