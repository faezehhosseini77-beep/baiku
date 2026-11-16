/*
  oils.js — داده‌ی روغن موتورها
  ⚠️ همه‌ی اطلاعات این فایل «نمونه و نمایشی» هستند (demo: true).
  گرید، استاندارد API و JASO، پایه‌ی روغن، حجم، قیمت و موجودی واقعی نیستند
  و فقط برای تست فیلترها گذاشته شده‌اند. هیچ‌کدام را به‌عنوان مشخصات واقعی محصول نگیرید.
  هیچ گرید یا استانداردی قابل جایگزینی با دیگری فرض نشده؛ سازگاری با هر موتور
  فقط باید از روی مشخصات تأییدشده‌ی سازنده ثبت شود (فیلد compatibleBikes که فعلاً خالی است).

  توضیح فیلدها:
    oilType   2T | 4T
    viscosity گرید ویسکوزیته؛ برای روغن 2T نمونه‌ها null است
    api, jaso استاندارد (null یعنی ثبت نشده)
    base      mineral | semi-synthetic | synthetic
    volume    حجم به‌صورت متن، مثل "1L"
    sales / addedAt / popular  مثل tires.js

  برای عوض کردن عکس: فیلد image را به عکس واقعی در src/image/products/ تغییر دهید.
*/
const img = (name) => new URL(`../image/products/${name}`, import.meta.url).href;
const IMAGE = img("oil-placeholder.svg");

export const oils = [
  { id: "oil-demo-1", category: "oil", demo: true, name: "روغن موتور نمونه ۱", brand: "برند نمونه الف", oilType: "4T", viscosity: "10W-40", api: "SL", jaso: "MA2", base: "semi-synthetic", volume: "1L", compatibleBikes: [], price: 690000, inStock: true, popular: true, sales: 95, addedAt: "2026-09-10", image: IMAGE },
  { id: "oil-demo-2", category: "oil", demo: true, name: "روغن موتور نمونه ۲", brand: "برند نمونه ب", oilType: "4T", viscosity: "10W-30", api: "SM", jaso: "MA2", base: "synthetic", volume: "1L", compatibleBikes: [], price: 980000, inStock: true, popular: true, sales: 80, addedAt: "2026-09-25", image: IMAGE },
  { id: "oil-demo-3", category: "oil", demo: true, name: "روغن موتور نمونه ۳", brand: "برند نمونه ج", oilType: "2T", viscosity: null, api: null, jaso: "FD", base: "mineral", volume: "1L", compatibleBikes: [], price: 420000, inStock: false, popular: false, sales: 20, addedAt: "2026-08-01", image: IMAGE },
  { id: "oil-demo-4", category: "oil", demo: true, name: "روغن موتور نمونه ۴", brand: "برند نمونه الف", oilType: "4T", viscosity: "10W-50", api: "SN", jaso: "MA2", base: "synthetic", volume: "1L", compatibleBikes: [], price: 1150000, inStock: true, popular: false, sales: 45, addedAt: "2026-10-05", image: IMAGE },
  { id: "oil-demo-5", category: "oil", demo: true, name: "روغن موتور نمونه ۵", brand: "برند نمونه ب", oilType: "4T", viscosity: "10W-60", api: "SN", jaso: "MA2", base: "synthetic", volume: "1L", compatibleBikes: [], price: 1320000, inStock: true, popular: false, sales: 30, addedAt: "2026-10-20", image: IMAGE },
  { id: "oil-demo-6", category: "oil", demo: true, name: "روغن موتور نمونه ۶", brand: "برند نمونه ج", oilType: "4T", viscosity: "15W-40", api: "SL", jaso: "MA", base: "mineral", volume: "4L", compatibleBikes: [], price: 1780000, inStock: true, popular: false, sales: 55, addedAt: "2026-07-22", image: IMAGE },
  { id: "oil-demo-7", category: "oil", demo: true, name: "روغن موتور نمونه ۷", brand: "برند نمونه الف", oilType: "4T", viscosity: "20W-50", api: "SJ", jaso: "MA", base: "mineral", volume: "1L", compatibleBikes: [], price: 520000, inStock: true, popular: false, sales: 65, addedAt: "2026-08-15", image: IMAGE },
  { id: "oil-demo-8", category: "oil", demo: true, name: "روغن موتور نمونه ۸", brand: "برند نمونه ب", oilType: "4T", viscosity: "10W-40", api: "SN", jaso: "MA2", base: "synthetic", volume: "4L", compatibleBikes: [], price: 3650000, inStock: true, popular: false, sales: 35, addedAt: "2026-11-03", image: IMAGE },
  { id: "oil-demo-9", category: "oil", demo: true, name: "روغن موتور نمونه ۹", brand: "برند نمونه ج", oilType: "2T", viscosity: null, api: null, jaso: "FC", base: "semi-synthetic", volume: "1L", compatibleBikes: [], price: 560000, inStock: true, popular: false, sales: 28, addedAt: "2026-10-11", image: IMAGE },
];
