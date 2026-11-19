import { defineConfig } from 'vite'
import { fileURLToPath } from 'node:url'

const page = (name) => fileURLToPath(new URL(name, import.meta.url))

export default defineConfig({
  // اسم مخزن در گیت‌هاب (آدرس سایت: https://USERNAME.github.io/baiku/)
  // اگر روی GitHub Pages منتشر نمی‌کنید می‌توانید این خط را بردارید
  base: '/baiku/',
  build: {
    rollupOptions: {
      // Vite به‌صورت پیش‌فرض فقط index.html را می‌سازد؛
      // هر صفحه‌ی جدیدی که در مراحل بعد اضافه می‌شود باید اینجا هم ثبت شود
      input: {
        main: page('index.html'),
        tires: page('tires.html'),
        oils: page('oils.html'),
        product: page('product.html'),
        checkout: page('checkout.html'),
        guide: page('guide.html'),
        parts: page('parts.html'),
        accessories: page('accessories.html'),
      },
    },
  },
})
