/*
  finder.js — «محصول مناسب موتورت را پیدا کن» (صفحه‌ی اصلی)
  لاستیک‌ها را بر اساس سه مقدار فیلتر می‌کند: پهنا (width)، فاق (aspect) و رینگ (rim).
  گزینه‌ها از خود کاتالوگ (tires.js) ساخته می‌شوند و ساختار داده تغییری نکرده است.
  - فیلد خالی یعنی «همه» و فقط فیلدهای انتخاب‌شده با هم (AND) اعمال می‌شوند.
  - سایزهای قدیمی مثل 2.75-17 فاق ندارند (aspect: null)؛ برای آن‌ها گزینه‌ی «بدون فاق» هست.
  توجه: این ابزار «سازگاری با یک مدل موتور» را ادعا نمی‌کند؛ فقط سایز انتخاب‌شده را پیدا می‌کند.
*/
import { tires } from "../data/tires.js";
import { productCard, attachCardEvents } from "./product-card.js";
import { escapeHtml } from "./utils.js";

const $ = (id) => document.getElementById(id);
const NO_ASPECT = "none"; // مقدار گزینه‌ی «بدون فاق»

const uniqueSorted = (values) => [...new Set(values)].sort((a, b) => parseFloat(a) - parseFloat(b));

function fill(select, placeholder, values, labelOf = String) {
  select.innerHTML =
    `<option value="">${placeholder}</option>` +
    values.map((v) => `<option value="${escapeHtml(String(v))}">${escapeHtml(labelOf(v))}</option>`).join("");
}

// آیا لاستیک با مقدارهای انتخاب‌شده می‌خواند؟ (فیلد خالی = بدون شرط)
function matches(t, { width, aspect, rim }) {
  if (width && String(t.width) !== width) return false;
  if (rim && String(t.rim) !== rim) return false;
  if (aspect === NO_ASPECT) return t.aspect === null || t.aspect === undefined;
  if (aspect && String(t.aspect) !== aspect) return false;
  return true;
}

export function initFinder() {
  const form = $("finder-form");
  if (!form) return;
  const fields = { width: $("f-width"), aspect: $("f-aspect"), rim: $("f-rim") };
  const result = $("f-result");

  fill(fields.width, "پهنا", uniqueSorted(tires.map((t) => t.width)));
  const aspects = uniqueSorted(tires.map((t) => t.aspect).filter((a) => a !== null && a !== undefined));
  fill(fields.aspect, "فاق", tires.some((t) => t.aspect == null) ? [...aspects, NO_ASPECT] : aspects, (v) =>
    v === NO_ASPECT ? "بدون فاق (سایز قدیمی)" : v
  );
  fill(fields.rim, "رینگ", uniqueSorted(tires.map((t) => t.rim)), (v) => `${v} اینچ`);

  // یک شنونده برای دکمه‌های «خرید» کارت‌های نتیجه (با event delegation)
  attachCardEvents(result, tires);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const sel = { width: fields.width.value, aspect: fields.aspect.value, rim: fields.rim.value };
    if (!sel.width && !sel.aspect && !sel.rim) {
      result.innerHTML = '<p class="text-sm border border-bk-line p-4 mt-6">حداقل یکی از مقدارها (پهنا، فاق یا رینگ) را انتخاب کنید.</p>';
      return;
    }
    const list = tires.filter((t) => matches(t, sel));
    const summary = [sel.width && `پهنا ${sel.width}`, sel.aspect && `فاق ${sel.aspect === NO_ASPECT ? "ندارد" : sel.aspect}`, sel.rim && `رینگ ${sel.rim}`]
      .filter(Boolean)
      .join(" · ");

    result.innerHTML = `
      <div class="mt-8">
        <h3 class="font-fa text-lg mb-4 flex items-center gap-x-3"><span class="speed-stripes" aria-hidden="true"></span>نتیجه
          <span class="text-sm font-normal">${escapeHtml(summary)} — ${list.length} محصول</span></h3>
        ${
          list.length
            ? `<div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">${list.map(productCard).join("")}</div>`
            : '<p class="text-sm border border-bk-line p-4">لاستیکی با این ترکیب در کاتالوگ نمونه پیدا نشد. مقدارها را تغییر دهید.</p>'
        }
        <a href="./tires.html" class="btn-outline h-11 px-6 text-sm mt-6 inline-flex">مشاهده‌ی همه‌ی لاستیک‌ها و فیلترها</a>
      </div>`;
  });

  form.addEventListener("reset", () => (result.innerHTML = ""));
}
