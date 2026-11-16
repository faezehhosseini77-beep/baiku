// فقط برای صفحه‌ی لاستیک (tires.html)
import "./common.js"; // منو، جستجوی هدر، سبد خرید و ورود
import { tires } from "../data/tires.js";
import { initListing } from "./listing.js";
import { POSITION, TUBE } from "./product-card.js";

/*
  فیلترهای لاستیک. برای اضافه کردن فیلتر جدید فقط یک خط به این لیست اضافه کنید:
    key   : نام یکتا
    label : عنوان فارسی
    get   : مقدار فیلد از محصول
    ltr   : true برای مقادیر فنی انگلیسی تا برعکس نشوند
    sort  : "number" برای مرتب‌سازی عددی
*/
const groups = [
  { key: "width", label: "عرض (میلی‌متر)", get: (p) => p.width, ltr: true, sort: "number" },
  { key: "aspect", label: "نسبت ارتفاع", get: (p) => p.aspect, ltr: true, sort: "number" },
  { key: "rim", label: "قطر رینگ (اینچ)", get: (p) => p.rim, ltr: true, sort: "number" },
  { key: "size", label: "سایز کامل", get: (p) => p.size, ltr: true },
  { key: "position", label: "جلو / عقب", get: (p) => p.position, format: (v) => POSITION[v] },
  { key: "tubeType", label: "تیوب‌دار / بدون تیوب", get: (p) => p.tubeType, format: (v) => TUBE[v] },
  { key: "brand", label: "برند", get: (p) => p.brand },
];

initListing({
  products: tires,
  groups,
  // متنی که جستجو روی آن انجام می‌شود: نام، برند، سایز، رینگ و برچسب‌های فارسی
  searchText: (p) =>
    [p.name, p.brand, p.size, p.width, p.aspect, `رینگ ${p.rim}`, POSITION[p.position], TUBE[p.tubeType], "لاستیک"]
      .filter((x) => x !== null && x !== undefined)
      .join(" "),
});
