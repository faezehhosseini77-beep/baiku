// فقط برای صفحه‌ی جزئیات محصول (product.html?id=...)
import "./common.js"; // منو، جستجو، سبد خرید و ورود
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { bikes } from "../data/bikes.js";
import { productCard, attachCardEvents, getSpec } from "./product-card.js";
import { SPEC_ROWS, specHtml } from "./specs.js";
import { wishlist, compare } from "./store.js";
import { formatPrice, escapeHtml } from "./utils.js";

const all = [...tires, ...oils];
const root = document.getElementById("product-root");
const id = new URLSearchParams(location.search).get("id");
const product = all.find((p) => p.id === id);

const PAGE = { tire: "./tires.html", oil: "./oils.html" };
const CATEGORY_LABEL = { tire: "لاستیک موتورسیکلت", oil: "روغن موتور" };

if (!product) {
  document.title = "محصول پیدا نشد | BAIKU";
  root.innerHTML = `
    <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <p class="text-lg font-bold mb-2">این محصول پیدا نشد</p>
      <p class="text-sm text-bk-muted mb-6">ممکن است آدرس اشتباه باشد یا محصول از فهرست حذف شده باشد.</p>
      <a href="./tires.html" class="btn-primary h-11 px-6 text-sm inline-flex">لاستیک‌ها</a>
      <a href="./oils.html" class="btn-outline h-11 px-6 text-sm inline-flex mr-2">روغن‌ها</a>
    </div>`;
} else {
  start(product);
}

function start(p) {
  document.title = `${p.name} | BAIKU | バイク`;
  let qty = 1;

  /* ---------- سازگاری: فقط از ردیف‌های تأییدشده‌ی bikes.js ---------- */
  const verifiedMatches = bikes.filter((b) => {
    if (b.verified !== true) return false;
    return p.category === "tire" ? b.frontTire === p.size || b.rearTire === p.size : p.viscosity && b.oilViscosity === p.viscosity;
  });

  const compatibilityHtml = verifiedMatches.length
    ? `<ul class="text-sm space-y-2">${verifiedMatches
        .map(
          (b) =>
            `<li class="border border-bk-line bg-bk-black p-3"><b>${escapeHtml(b.brand)} ${escapeHtml(b.model)}</b> <span class="ltr-text text-bk-muted">${escapeHtml(b.years)}</span>
             ${b.source ? `<span class="block text-xs text-bk-muted mt-1">منبع: ${escapeHtml(b.source)}</span>` : ""}</li>`
        )
        .join("")}</ul>
       <p class="text-xs text-bk-muted mt-3">این فهرست فقط از اطلاعات تأییدشده ساخته می‌شود. باز هم پیش از خرید با دفترچه‌ی موتور خود مطابقت دهید.</p>`
    : `<p class="text-sm leading-7 text-bk-muted">سازگاری این محصول با مدل‌های موتورسیکلت هنوز <b class="text-bk-white">تأیید و ثبت نشده</b> است و ما چیزی را حدسی اعلام نمی‌کنیم.
       پیش از خرید، ${p.category === "tire" ? "سایز" : "گرید و استاندارد"} را با دفترچه‌ی راهنمای موتور خود مطابقت دهید یا با پشتیبانی تماس بگیرید.</p>`;

  /* ---------- محصولات مرتبط ---------- */
  const key = (x) => (x.category === "tire" ? x.size : x.viscosity);
  const related = all
    .filter((x) => x.category === p.category && x.id !== p.id)
    .sort((a, b) => {
      const rank = (x) => (key(x) && key(x) === key(p) ? 2 : 0) + (x.brand === p.brand ? 1 : 0);
      return rank(b) - rank(a) || b.sales - a.sales;
    })
    .slice(0, 4);

  /* ---------- رسم صفحه ---------- */
  function render() {
    const liked = wishlist.has(p.id);
    const compared = compare.has(p.id);
    root.innerHTML = `
      <section class="border-b border-bk-line bg-bk-navy">
        <nav aria-label="مسیر صفحه" class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-4 text-xs text-bk-muted">
          <a href="./index.html" class="hover:text-bk-blue transition">خانه</a><span class="mx-2">/</span>
          <a href="${PAGE[p.category]}" class="hover:text-bk-blue transition">${CATEGORY_LABEL[p.category]}</a><span class="mx-2">/</span>
          <span class="text-bk-white">${escapeHtml(p.name)}</span>
        </nav>
      </section>

      <section class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12 grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
        <div class="bk-card relative bg-bk-black self-start">
          <img src="${escapeHtml(p.image)}" alt="${escapeHtml(p.name)}" class="w-full aspect-square object-cover" />
          ${p.demo ? '<span class="absolute bottom-3 right-3 text-xs text-bk-muted bg-bk-black/80 px-2 py-1">تصویر و اطلاعات نمونه</span>' : ""}
        </div>

        <div class="flex flex-col gap-y-5">
          <div>
            <p class="text-sm text-bk-muted mb-1">${escapeHtml(p.brand)}</p>
            <h1 class="text-2xl sm:text-3xl font-bold leading-10">${escapeHtml(p.name)}</h1>
            <p class="text-bk-cyan font-bold text-xl mt-3"><span class="ltr-text">${escapeHtml(getSpec(p))}</span></p>
          </div>

          ${p.demo ? '<p class="text-xs leading-6 text-bk-muted border border-bk-line bg-bk-navy p-3">این محصول نمونه است: نام، برند، قیمت و موجودی واقعی نیستند و فقط برای نمایش ظاهر سایت‌اند.</p>' : ""}

          <div class="flex items-center gap-x-4">
            <p class="text-2xl font-bold">${formatPrice(p.price)} <span class="text-sm font-normal text-bk-muted">تومان</span></p>
            <span class="text-xs font-bold px-2 py-1 ${p.inStock ? "bg-bk-blue/20 text-bk-cyan border border-bk-blue/50" : "bg-bk-black text-bk-muted border border-bk-line"}">${p.inStock ? "موجود" : "ناموجود"}</span>
          </div>

          <div class="flex flex-wrap items-center gap-3">
            <div class="h-12 w-32 border border-bk-line flex items-center justify-between px-3 ${p.inStock ? "" : "opacity-40"}">
              <button type="button" data-p-qty="1" class="text-lg cursor-pointer" aria-label="افزایش تعداد" ${p.inStock ? "" : "disabled"}>+</button>
              <span aria-live="polite">${formatPrice(qty)}</span>
              <button type="button" data-p-qty="-1" class="text-lg cursor-pointer" aria-label="کاهش تعداد" ${p.inStock ? "" : "disabled"}>−</button>
            </div>
            <button type="button" data-p-add ${p.inStock ? "" : "disabled"} class="${p.inStock ? "btn-primary" : "bg-bk-line text-bk-muted cursor-not-allowed"} h-12 px-8 text-sm flex-1 sm:flex-none flex items-center justify-center font-bold">
              ${p.inStock ? "افزودن به سبد" : "ناموجود"}
            </button>
          </div>

          <div class="flex flex-wrap gap-3">
            <button type="button" data-p-wish aria-pressed="${liked}" class="btn-outline h-10 px-4 text-xs ${liked ? "text-bk-blue" : ""}">${liked ? "در علاقه‌مندی‌هاست ♥" : "افزودن به علاقه‌مندی‌ها ♡"}</button>
            <button type="button" data-p-compare aria-pressed="${compared}" class="btn-outline h-10 px-4 text-xs ${compared ? "text-bk-cyan" : ""}">${compared ? "در لیست مقایسه ✓" : "افزودن به مقایسه"}</button>
            ${compare.all().length ? '<a href="./compare.html" class="h-10 px-2 text-xs inline-flex items-center text-bk-blue hover:underline">مشاهده‌ی مقایسه</a>' : ""}
          </div>
        </div>
      </section>

      <section class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-10 grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
        <div class="bk-card p-4 sm:p-6">
          <h2 class="font-bold mb-4 flex items-center gap-x-3"><span class="speed-stripes" aria-hidden="true"></span>مشخصات فنی</h2>
          <table class="w-full text-sm">
            <tbody>
              ${SPEC_ROWS[p.category]
                .map(
                  (row) => `<tr class="border-b border-bk-line last:border-0"><th scope="row" class="text-right font-normal text-bk-muted py-3 w-2/5">${row.label}</th><td class="py-3 font-bold">${specHtml(row, p)}</td></tr>`
                )
                .join("")}
            </tbody>
          </table>
          <p class="text-[11px] text-bk-muted mt-3">مقدارهای «ثبت نشده» هنوز از منبع معتبر تأیید نشده‌اند و عمداً خالی مانده‌اند.</p>
        </div>

        <div class="bk-card p-4 sm:p-6">
          <h2 class="font-bold mb-4 flex items-center gap-x-3"><span class="speed-stripes" aria-hidden="true"></span>سازگاری با موتورسیکلت</h2>
          ${compatibilityHtml}
          <a href="./index.html#finder" class="btn-outline h-10 px-4 text-xs mt-4 inline-flex">یابنده‌ی محصول مناسب</a>
        </div>
      </section>

      ${
        related.length
          ? `<section class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 pb-16">
              <h2 class="text-xl font-bold mb-6 flex items-center gap-x-3"><span class="speed-stripes" aria-hidden="true"></span>محصولات مرتبط</h2>
              <div id="related-grid" class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-6">${related.map(productCard).join("")}</div>
            </section>`
          : ""
      }`;
  }

  // دکمه‌های خود صفحه data-p-... دارند تا با دکمه‌های کارت‌های مرتبط (data-add, data-wish) قاطی نشوند.
  // یک شنونده روی کل صفحه (event delegation)؛ بعد از هر تغییر کل صفحه دوباره ساخته می‌شود
  root.addEventListener("click", (e) => {
    const q = e.target.closest("[data-p-qty]");
    if (q) {
      qty = Math.min(20, Math.max(1, qty + Number(q.dataset.pQty)));
      return render();
    }
    if (e.target.closest("[data-p-add]") && p.inStock) {
      window.Cart.add({ id: p.id, title: p.name, spec: getSpec(p), price: p.price, image: p.image, qty });
    } else if (e.target.closest("[data-p-wish]")) {
      wishlist.toggle(p.id);
      render();
    } else if (e.target.closest("[data-p-compare]")) {
      compare.toggle(p);
      render();
    }
  });

  render();
  // کارت‌های مرتبط (افزودن به سبد، قلب و مقایسه). root ثابت است پس فقط یک بار وصل می‌کنیم
  attachCardEvents(root, all, render);
}
