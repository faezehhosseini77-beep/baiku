/*
  tires.js — داده‌ی لاستیک‌ها
  ⚠️ همه‌ی اطلاعات این فایل «نمونه و نمایشی» هستند (demo: true).
  نام برند، قیمت، موجودی و محبوبیت واقعی نیستند و فقط برای تست فیلترها و دیدن ظاهر سایت‌اند.
  load index و speed rating تأییدنشده‌اند و عمداً null مانده‌اند.
  سایزها از نمونه‌های بریف پروژه آمده‌اند؛ این یک کاتالوگ کامل نیست و فرض نشده همه‌ی ترکیب‌های سایز موجود باشند.

  توضیح فیلدها:
    size      سایز کامل (همان که روی لاستیک نوشته می‌شود)
    width     عرض به‌صورت «رشته» (چون مقادیری مثل 2.75 و 3.00 دارد)
    aspect    نسبت ارتفاع؛ برای سایزهای قدیمی مثل 2.75-17 وجود ندارد → null
    rim       قطر رینگ (اینچ)
    position  front | rear        tubeType  tube | tubeless
    sales     عدد فرضی برای «مرتب‌سازی بر اساس محبوبیت»
    addedAt   تاریخ فرضی برای «جدیدترین»
    popular   اگر true باشد در بخش پرفروش‌های صفحه اصلی هم نمایش داده می‌شود

  برای عوض کردن عکس: فیلد image را به عکس واقعی در src/image/products/ تغییر دهید.
*/
const img = (name) => new URL(`../image/products/${name}`, import.meta.url).href;
const IMAGE = img("tire-placeholder.svg");

export const tires = [
  { id: "tire-demo-1", category: "tire", demo: true, name: "لاستیک نمونه ۱", brand: "برند نمونه الف", size: "90/90-17", width: "90", aspect: 90, rim: 17, position: "rear", tubeType: "tube", loadIndex: null, speedRating: null, price: 1850000, inStock: true, popular: true, sales: 90, addedAt: "2026-09-12", image: IMAGE },
  { id: "tire-demo-2", category: "tire", demo: true, name: "لاستیک نمونه ۲", brand: "برند نمونه ب", size: "70/90-17", width: "70", aspect: 90, rim: 17, position: "front", tubeType: "tube", loadIndex: null, speedRating: null, price: 1420000, inStock: true, popular: true, sales: 75, addedAt: "2026-09-20", image: IMAGE },
  { id: "tire-demo-3", category: "tire", demo: true, name: "لاستیک نمونه ۳", brand: "برند نمونه ج", size: "120/70-14", width: "120", aspect: 70, rim: 14, position: "front", tubeType: "tubeless", loadIndex: null, speedRating: null, price: 2650000, inStock: false, popular: false, sales: 30, addedAt: "2026-08-05", image: IMAGE },
  { id: "tire-demo-4", category: "tire", demo: true, name: "لاستیک نمونه ۴", brand: "برند نمونه الف", size: "80/90-17", width: "80", aspect: 90, rim: 17, position: "front", tubeType: "tube", loadIndex: null, speedRating: null, price: 1560000, inStock: true, popular: false, sales: 60, addedAt: "2026-10-02", image: IMAGE },
  { id: "tire-demo-5", category: "tire", demo: true, name: "لاستیک نمونه ۵", brand: "برند نمونه ب", size: "100/90-17", width: "100", aspect: 90, rim: 17, position: "rear", tubeType: "tube", loadIndex: null, speedRating: null, price: 2150000, inStock: true, popular: false, sales: 55, addedAt: "2026-10-18", image: IMAGE },
  { id: "tire-demo-6", category: "tire", demo: true, name: "لاستیک نمونه ۶", brand: "برند نمونه ج", size: "110/80-17", width: "110", aspect: 80, rim: 17, position: "rear", tubeType: "tubeless", loadIndex: null, speedRating: null, price: 2890000, inStock: true, popular: false, sales: 40, addedAt: "2026-10-25", image: IMAGE },
  { id: "tire-demo-7", category: "tire", demo: true, name: "لاستیک نمونه ۷", brand: "برند نمونه الف", size: "2.75-17", width: "2.75", aspect: null, rim: 17, position: "front", tubeType: "tube", loadIndex: null, speedRating: null, price: 1180000, inStock: true, popular: false, sales: 25, addedAt: "2026-07-14", image: IMAGE },
  { id: "tire-demo-8", category: "tire", demo: true, name: "لاستیک نمونه ۸", brand: "برند نمونه ب", size: "3.00-17", width: "3.00", aspect: null, rim: 17, position: "rear", tubeType: "tube", loadIndex: null, speedRating: null, price: 1290000, inStock: true, popular: false, sales: 35, addedAt: "2026-07-30", image: IMAGE },
  { id: "tire-demo-9", category: "tire", demo: true, name: "لاستیک نمونه ۹", brand: "برند نمونه ج", size: "90/90-14", width: "90", aspect: 90, rim: 14, position: "front", tubeType: "tubeless", loadIndex: null, speedRating: null, price: 1980000, inStock: true, popular: false, sales: 50, addedAt: "2026-11-02", image: IMAGE },
];
