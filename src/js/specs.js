/*
  specs.js — فهرست مشخصات فنی هر دسته (مورد استفاده‌ی صفحه‌ی محصول)
  برای اضافه کردن یک مشخصه‌ی جدید فقط یک خط به لیست دسته‌اش اضافه کنید:
    label : عنوان فارسی ردیف
    get   : مقدار را از محصول برمی‌گرداند (null یعنی «ثبت نشده»)
    ltr   : true برای مقادیر انگلیسی تا برعکس نشوند
  هیچ مقدار تأییدنشده‌ای حدس زده نمی‌شود؛ مقدار خالی همیشه «ثبت نشده» نمایش داده می‌شود.
*/
import { POSITION, TUBE, OIL_BASE } from "./product-card.js";
import { escapeHtml } from "./utils.js";

export const NOT_SET = "ثبت نشده";

export const SPEC_ROWS = {
  tire: [
    { label: "سایز کامل", get: (p) => p.size, ltr: true },
    { label: "عرض (میلی‌متر)", get: (p) => p.width, ltr: true },
    { label: "نسبت ارتفاع", get: (p) => (p.aspect === null ? "ندارد" : p.aspect), ltr: true },
    { label: "قطر رینگ (اینچ)", get: (p) => p.rim, ltr: true },
    { label: "جلو / عقب", get: (p) => POSITION[p.position] },
    { label: "تیوب‌دار / بدون تیوب", get: (p) => TUBE[p.tubeType] },
    { label: "شاخص بار", get: (p) => p.loadIndex, ltr: true },
    { label: "رده‌ی سرعت", get: (p) => p.speedRating, ltr: true },
  ],
  oil: [
    { label: "نوع موتور", get: (p) => p.oilType, ltr: true },
    { label: "گرید ویسکوزیته", get: (p) => p.viscosity ?? (p.oilType === "2T" ? "ندارد" : null), ltr: true },
    { label: "استاندارد API", get: (p) => p.api, ltr: true },
    { label: "استاندارد JASO", get: (p) => p.jaso, ltr: true },
    { label: "نوع پایه", get: (p) => OIL_BASE[p.base] },
    { label: "حجم", get: (p) => p.volume, ltr: true },
  ],
};

// مقدار یک ردیف به‌صورت متن ساده
export const specText = (row, p) => {
  const v = row.get(p);
  return v === null || v === undefined || v === "" ? NOT_SET : String(v);
};

// مقدار یک ردیف به‌صورت HTML امن
export function specHtml(row, p) {
  const text = specText(row, p);
  if (text === NOT_SET) return `<span class="text-bk-muted">${NOT_SET}</span>`;
  const safe = escapeHtml(text);
  return row.ltr && /[A-Za-z0-9]/.test(text) ? `<span class="ltr-text">${safe}</span>` : safe;
}
