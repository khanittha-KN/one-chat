import adapter from "@sveltejs/adapter-static";

const config = {
    kit: {
        // แอปเป็น SPA ล้วน (state อยู่ในหน่วยความจำเหมือนต้นฉบับ) ⇒ build เป็นไฟล์ static
        adapter: adapter({ fallback: "index.html" }),
    },
};

export default config;
