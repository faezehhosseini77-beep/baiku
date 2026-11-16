/*
  product-card.js — کارت محصول و علاقه‌مندی‌ها (مشترک بین صفحه اصلی، لاستیک و روغن)
  اگر ظاهر کارت محصول را بخواهید عوض کنید فقط همین فایل را ویرایش کنید.
*/
import { formatPrice, escapeHtml } from "./utils.js";
import { wishlist, compare } from "./store.js";

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
  const liked = wishlist.has(p.id);
  const compared = compare.has(p.id);
  const href = `./product.html?id=${encodeURIComponent(p.id)}`;
  return `
    <article class="bk-card flex flex-col min-w-0">
      <div class="relative bg-bk-black">
        <a href="${href}" tabindex="-1" aria-hidden="true"><img src="${escapeHtml(p.image)}" alt="" class="w-full aspect-square object-cover" loading="lazy" /></a>
        <span class="absolute top-2 right-2 text-[10px] font-bold px-2 py-1 ${p.inStock ? "bg-bk-blue/20 text-bk-cyan border border-bk-blue/50" : "bg-bk-black/80 text-bk-muted border border-bk-line"}">
          ${p.inStock ? "موجود" : "ناموجود"}
        </span>
        ${p.demo ? '<span class="absolute bottom-2 right-2 text-[10px] text-bk-muted bg-bk-black/80 px-2 py-0.5">نمونه</span>' : ""}
        <button type="button" data-wish="${p.id}" aria-pressed="${liked}" aria-label="افزودن به علاقه‌مندی‌ها"
          class="absolute top-2 left-2 w-8 h-8 flex items-center justify-center bg-bk-black/70 cursor-pointer transition ${liked ? "text-bk-blue" : "text-bk-muted hover:text-bk-white"}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="${liked ? "currentColor" : "none"}" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1-1.1a5.5 5.5 0 0 0-7.8 7.8l1 1.1L12 21l7.8-7.5 1-1.1a5.5 5.5 0 0 0 0-7.8z"/></svg>
        </button>
        <button type="button" data-compare="${p.id}" aria-pressed="${compared}" aria-label="افزودن به مقایسه"
          class="absolute top-12 left-2 w-8 h-8 flex items-center justify-center bg-bk-black/70 cursor-pointer transition ${compared ? "text-bk-cyan" : "text-bk-muted hover:text-bk-white"}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M7 7h13M16 3l4 4-4 4M17 17H4M8 13l-4 4 4 4"/></svg>
        </button>
      </div>
      <div class="flex flex-col flex-1 p-3 sm:p-4 gap-y-2">
        <p class="text-[11px] text-bk-muted">${escapeHtml(p.brand)}</p>
        <h3 class="text-sm sm:text-base font-bold leading-6"><a href="${href}" class="hover:text-bk-blue transition">${escapeHtml(p.name)}</a></h3>
        <div>
          <p class="text-bk-cyan font-bold text-base sm:text-lg"><span class="ltr-text">${escapeHtml(getSpec(p))}</span></p>
          <p class="text-[11px] text-bk-muted mt-0.5">${getSubSpec(p)}</p>
        </div>
        <p class="font-bold text-sm sm:text-base mt-auto pt-2">${formatPrice(p.price)} <span class="text-xs font-normal text-bk-muted">تومان</span></p>
        <button type="button" data-add="${p.id}" ${p.inStock ? "" : "disabled"}
          class="${p.inStock ? "btn-primary" : "bg-bk-line text-bk-muted cursor-not-allowed"} h-10 text-xs sm:text-sm flex items-center justify-center font-bold">
          ${p.inStock ? "افزودن به سبد" : "ناموجود"}
        </button>
      </div>
    </article>`;
}

/*
  اتصال دکمه‌های کارت‌ها («افزودن به سبد» و قلب علاقه‌مندی).
  از event delegation استفاده می‌کنیم: یک شنونده روی کل ظرف، نه یکی برای هر دکمه،
  چون کارت‌ها هر بار با فیلتر دوباره ساخته می‌شوند.
    container   : ظرفی که کارت‌ها داخلش هستند
    products    : لیست کامل محصولات برای پیدا کردن محصول از روی id
    onWishChange: بعد از تغییر علاقه‌مندی یا مقایسه صدا زده می‌شود تا کارت‌ها دوباره ساخته شوند
*/
export function attachCardEvents(container, products, onWishChange) {
  container.addEventListener("click", (e) => {
    const addBtn = e.target.closest("[data-add]");
    const wishBtn = e.target.closest("[data-wish]");
    const cmpBtn = e.target.closest("[data-compare]");

    if (addBtn) {
      const p = products.find((item) => item.id === addBtn.dataset.add);
      if (!p || !p.inStock) return;
      window.Cart.add({ id: p.id, title: p.name, spec: getSpec(p), price: p.price, image: p.image });
    }

    if (wishBtn) {
      wishlist.toggle(wishBtn.dataset.wish);
      onWishChange();
    }

    if (cmpBtn) {
      const p = products.find((item) => item.id === cmpBtn.dataset.compare);
      if (p) compare.toggle(p);
      onWishChange();
    }
  });
}
