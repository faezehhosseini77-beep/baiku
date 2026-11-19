/*
  product-card.js — کارت محصول (مشترک بین صفحه اصلی، لاستیک و روغن)
  اگر ظاهر کارت محصول را بخواهید عوض کنید فقط همین فایل را ویرایش کنید.
*/
import { formatPrice, escapeHtml } from "./utils.js";

/* ---------- نمایش خوانای مقادیر فنی ---------- */
export const POSITION = { front: "جلو", rear: "عقب" };
export const TUBE = { tube: "تیوب‌دار", tubeless: "بدون تیوب" };
export const OIL_BASE = { mineral: "معدنی", "semi-synthetic": "نیمه‌سنتتیک", synthetic: "تمام‌سنتتیک" };

// خط مشخصات برجسته‌ی هر محصول: برای لاستیک «سایز»، برای روغن «گرید + نوع + حجم»
export function getSpec(p) {
  if (p.category === "tire") return p.size; // مثلاً 90/90-17
  return [p.viscosity, p.oilType, p.volume].filter(Boolean).join(" · "); // مثلاً 10W-40 · 4T · 1L
}

// توضیح فرعی زیر مشخصات
function getSubSpec(p) {
  if (p.category === "tire") return `${POSITION[p.position]} · ${TUBE[p.tubeType]}`;
  return OIL_BASE[p.base];
}

/* ---------- ساخت HTML کارت ---------- */
export function productCard(p) {
  const href = `./product.html?id=${encodeURIComponent(p.id)}`;
  return `
    <article class="bk-card group flex flex-col min-w-0">
      <div class="relative bg-bk-bg overflow-hidden">
        <a href="${href}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(p.image)}" alt="" class="w-full aspect-square object-cover transition duration-500 group-hover:scale-105" loading="lazy" /></a>
        <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 ${p.inStock ? "bg-bk-ink text-white" : "bg-bk-surface text-bk-muted border border-bk-line"}">
          ${p.inStock ? "موجود" : "ناموجود"}
        </span>
        ${p.demo ? '<span class="absolute bottom-2 right-2 text-[10px] text-bk-muted bg-bk-surface/90 px-2 py-0.5">نمونه</span>' : ""}
      </div>
      <div class="flex flex-col flex-1 p-3 sm:p-4 gap-y-2 border-t-2 border-bk-red">
        <p class="text-[11px] text-bk-muted">${escapeHtml(p.brand)}</p>
        <h3 class="text-sm sm:text-base font-bold leading-6"><a href="${href}" class="hover:underline hover:decoration-bk-red hover:decoration-2 hover:underline-offset-4 transition">${escapeHtml(p.name)}</a></h3>
        <div>
          <p class="text-bk-fg font-display text-lg sm:text-xl"><span class="ltr-text">${escapeHtml(getSpec(p))}</span></p>
          <p class="text-[11px] text-bk-muted mt-0.5">${getSubSpec(p)}</p>
        </div>
        <p class="font-extrabold text-base sm:text-lg mt-auto pt-2">${formatPrice(p.price)} <span class="text-xs font-normal text-bk-muted">تومان</span></p>
        <div class="grid grid-cols-2 gap-2">
          <a href="${href}" class="btn-outline h-10 text-xs sm:text-sm">مشاهده</a>
          <button type="button" data-add="${p.id}" ${p.inStock ? "" : "disabled"}
            class="${p.inStock ? "btn-primary" : "bg-bk-line text-bk-muted cursor-not-allowed"} h-10 text-xs sm:text-sm flex items-center justify-center font-bold">
            ${p.inStock ? "خرید" : "ناموجود"}
          </button>
        </div>
      </div>
    </article>`;
}

/*
  اتصال دکمه‌ی «خرید» کارت‌ها.
  از event delegation استفاده می‌کنیم: یک شنونده روی کل ظرف، نه یکی برای هر دکمه،
  چون کارت‌ها هر بار با فیلتر دوباره ساخته می‌شوند.
    container : ظرفی که کارت‌ها داخلش هستند
    products  : لیست کامل محصولات برای پیدا کردن محصول از روی id
*/
export function attachCardEvents(container, products) {
  container.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    if (!addBtn) return;
    const p = products.find((item) => item.id === addBtn.dataset.add);
    if (!p || !p.inStock) return;
    window.Cart.add({ id: p.id, title: p.name, spec: getSpec(p), price: p.price, image: p.image });
  });
}
