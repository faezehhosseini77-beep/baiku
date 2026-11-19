/*
  layout.js — هدر و فوتر مشترک همه‌ی صفحه‌ها
  به‌جای کپی کردن هدر و فوتر در هر فایل HTML، هر صفحه فقط دو تگ خالی دارد:
      <header id="site-header"></header>   و   <footer id="site-footer"></footer>
  و این فایل آن‌ها را پر می‌کند. اگر منو یا فوتر را بخواهید عوض کنید فقط همین‌جا را ویرایش کنید.
*/

// گزینه‌های منوی «دسته‌بندی محصولات» (هر کدام یک صفحه‌ی واقعی دارند)
export const CATEGORIES = [
  { label: "لاستیک", href: "./tires.html", mark: "輪" },
  { label: "روغن", href: "./oils.html", mark: "油" },
  { label: "قطعات یدکی موتور", href: "./parts.html", mark: "部" },
  { label: "اکسسوری", href: "./accessories.html", mark: "装" },
];

const page = location.pathname.split("/").pop() || "index.html";
const inCategory = ["tires.html", "oils.html", "parts.html", "accessories.html", "product.html"].includes(page);

/* ---------- لوگوی BAIKU ----------
   فایل لوگو: src/image/logo.png (نسبت اصلی ۶۴۰×۳۴۵ حفظ می‌شود؛ فقط ارتفاع تعیین می‌شود و عرض خودکار است).
   آدرس را با new URL می‌سازیم تا Vite هنگام build فایل را درست کپی کند. */
const logoUrl = new URL("../image/logo.png", import.meta.url).href;
const logoImg = (cls) => `<img src="${logoUrl}" alt="BAIKU" width="640" height="345" class="${cls} w-auto select-none" />`;

const chevron = `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg>`;

const dropdown = (extra = "") => `
  <div class="relative ${extra}" data-dropdown>
    <button type="button" data-dropdown-toggle aria-expanded="false" aria-haspopup="true"
      class="flex items-center gap-x-1.5 text-sm font-bold transition cursor-pointer hover:underline hover:decoration-bk-red hover:decoration-2 hover:underline-offset-8 ${inCategory ? "underline decoration-bk-red decoration-2 underline-offset-8" : ""}">
      دسته‌بندی محصولات ${chevron}
    </button>
    <div data-dropdown-panel hidden class="dropdown-panel lg:absolute lg:top-full lg:right-0 lg:mt-3 lg:w-64 z-40 bg-bk-surface lg:border lg:border-bk-line lg:border-t-2 lg:border-t-bk-red lg:shadow-xl">
      ${CATEGORIES.map(
        (c) => `<a href="${c.href}" class="group flex items-center justify-between gap-x-3 px-4 py-3 text-sm font-bold border-b border-bk-line last:border-0 hover:bg-bk-red hover:text-white transition">
          <span>${c.label}</span><span class="jp-text text-bk-red group-hover:text-white text-base" aria-hidden="true">${c.mark}</span></a>`
      ).join("")}
    </div>
  </div>`;

const navLink = (href, label, active) =>
  `<a href="${href}" class="text-sm font-bold transition hover:underline hover:decoration-bk-red hover:decoration-2 hover:underline-offset-8 ${active ? "underline decoration-bk-red decoration-2 underline-offset-8" : ""}" ${active ? 'aria-current="page"' : ""}>${label}</a>`;

const iconBtn = "w-10 h-10 flex items-center justify-center hover:bg-bk-red hover:text-white transition cursor-pointer";
const svgAttrs = 'width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"';

const header = `
  <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-x-4">
    <div class="flex items-center gap-x-2 sm:gap-x-3 shrink-0">
      <button type="button" id="menu-toggle" class="lg:hidden ${iconBtn}" aria-label="باز کردن منو" aria-expanded="false" aria-controls="mobile-menu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16"/></svg>
      </button>
      <a href="./index.html" class="shrink-0" aria-label="BAIKU - صفحه اصلی">${logoImg("h-12 sm:h-14")}</a>
    </div>

    <!-- منوی اصلی (دسکتاپ): فقط چهار بخش -->
    <nav class="hidden lg:flex items-center gap-x-10" aria-label="منوی اصلی">
      ${navLink("./index.html", "خانه", page === "index.html")}
      ${dropdown()}
      ${navLink("./index.html#about", "درباره BAIKU", false)}
      ${navLink("#contact", "تماس با ما", false)}
    </nav>

    <div class="flex items-center gap-x-1 sm:gap-x-2">
      <button type="button" id="search-toggle" class="${iconBtn}" aria-label="جستجو" aria-expanded="false" aria-controls="search-bar">
        <svg ${svgAttrs}><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
      </button>
      <button type="button" data-open="login" class="${iconBtn}" aria-label="حساب کاربری">
        <svg ${svgAttrs}><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>
      </button>
      <button type="button" data-open="cart" class="relative ${iconBtn}" aria-label="سبد خرید">
        <svg ${svgAttrs}><circle cx="9" cy="20" r="1.5"/><circle cx="18" cy="20" r="1.5"/><path d="M2 3h3l2.7 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.5L21 7H6"/></svg>
        <span data-cart-count class="hidden absolute top-0 left-0 min-w-4.5 h-4.5 px-1 bg-bk-red text-white text-[10px] font-bold leading-4.5 text-center">0</span>
      </button>
    </div>
  </div>

  <!-- نوار جستجو (search.js) -->
  <div id="search-bar" class="hidden border-t border-bk-line bg-bk-surface">
    <form id="search-form" autocomplete="off" class="relative max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-3 flex gap-x-2" role="search">
      <input id="search-input" type="search" class="bk-input" placeholder="جستجو بر اساس نام، برند، سایز لاستیک (مثلاً 90/90-17) یا گرید روغن (مثلاً 10W-40)" aria-label="جستجو" aria-controls="search-suggest" aria-expanded="false" />
      <button type="submit" class="btn-primary h-11 px-5 text-sm shrink-0">جستجو</button>
      <div id="search-suggest" class="hidden absolute top-full right-4 left-4 sm:right-6 sm:left-6 lg:right-8 lg:left-8 z-50 max-h-[70vh] overflow-y-auto bg-bk-surface border border-bk-red shadow-[0_12px_40px_rgba(0,0,0,0.6)]" role="listbox"></div>
    </form>
  </div>

  <!-- منوی موبایل: کشویی از لبه‌ی راست (RTL). باز/بسته شدن در common.js -->
  <div id="mobile-overlay" class="lg:hidden fixed inset-0 z-40 bg-bk-ink/45 opacity-0 invisible transition-opacity duration-300"></div>
  <nav id="mobile-menu" aria-hidden="true" aria-label="منوی موبایل"
    class="lg:hidden fixed inset-y-0 right-0 z-50 w-[85%] max-w-80 bg-bk-bg border-l-2 border-bk-red shadow-2xl flex flex-col translate-x-full invisible transition-all duration-300 text-right">
    <div class="h-16 shrink-0 bg-bk-surface border-b border-bk-line flex items-center justify-between px-4">
      <span class="font-bold text-sm">منو</span>
      <button type="button" data-mobile-close class="${iconBtn}" aria-label="بستن منو">✕</button>
    </div>
    <div class="flex-1 overflow-y-auto px-4 py-3 flex flex-col gap-y-1">
      <a href="./index.html" class="py-3 text-sm font-bold border-b border-bk-line ${page === "index.html" ? "underline decoration-bk-red decoration-2 underline-offset-8" : ""}">خانه</a>
      <div class="py-3 border-b border-bk-line">${dropdown()}</div>
      <a href="./index.html#about" class="py-3 text-sm font-bold border-b border-bk-line">درباره BAIKU</a>
      <a href="#contact" class="py-3 text-sm font-bold">تماس با ما</a>
    </div>
  </nav>`;

const link = "hover:underline hover:decoration-bk-red hover:decoration-2 hover:underline-offset-4 transition";
const footer = `
  <div class="max-w-350 mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-14">
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-10">
      <div class="lg:col-span-2">
        <div class="mb-4">${logoImg("h-16")}</div>
        <p class="text-sm text-bk-muted leading-7 max-w-md mb-5">
          فروشگاه تخصصی لاستیک و روغن موتور موتورسیکلت با تمرکز بر اطلاعات فنی شفاف و انتخاب آگاهانه.
        </p>
        <div class="flex flex-wrap gap-x-5 gap-y-2 text-sm text-bk-muted">
          <a href="#" class="${link}">اینستاگرام</a>
          <a href="#" class="${link}">تلگرام</a>
          <a href="#" class="${link}">آپارات</a>
        </div>
      </div>

      <div>
        <h3 class="font-fa mb-4">دسته‌بندی‌ها</h3>
        <ul class="space-y-3 text-sm text-bk-muted">
          ${CATEGORIES.map((c) => `<li><a href="${c.href}" class="${link}">${c.label}</a></li>`).join("")}
        </ul>
      </div>

      <div>
        <h3 class="font-fa mb-4">راهنما</h3>
        <ul class="space-y-3 text-sm text-bk-muted">
          <li><a href="./guide.html#tire-size" class="${link}">راهنمای انتخاب لاستیک</a></li>
          <li><a href="./guide.html#oil-grade" class="${link}">راهنمای انتخاب روغن</a></li>
          <li><a href="#" class="${link}">سوالات متداول</a></li>
          <li><a href="#" class="${link}">حریم خصوصی</a></li>
        </ul>
      </div>

      <div>
        <h3 class="font-fa mb-4">تماس با ما</h3>
        <ul class="space-y-3 text-sm text-bk-muted">
          <!-- اطلاعات تماس نمونه است؛ با اطلاعات واقعی عوض کنید -->
          <li>تلفن: <span class="ltr-text">021-00000000</span></li>
          <li>ایمیل: <span class="ltr-text">info@example.com</span></li>
          <li>ساعت پاسخگویی: ۹ تا ۱۸ (نمونه)</li>
        </ul>
      </div>
    </div>

    <ul class="mt-10 pt-6 border-t border-bk-line grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-bk-muted">
      <li class="flex items-center gap-x-2"><span class="w-1.5 h-1.5 bg-bk-red" aria-hidden="true"></span>ارسال به سراسر کشور</li>
      <li class="flex items-center gap-x-2"><span class="w-1.5 h-1.5 bg-bk-red" aria-hidden="true"></span>پشتیبانی در انتخاب محصول</li>
      <li class="flex items-center gap-x-2"><span class="w-1.5 h-1.5 bg-bk-red" aria-hidden="true"></span>پرداخت امن (در نسخه‌ی نهایی)</li>
    </ul>
    <p class="mt-6 text-xs text-bk-muted">© BAIKU - نسخه‌ی نمایشی. تمام محصولات و قیمت‌ها نمونه هستند.</p>
  </div>`;

/* ---------- قرار دادن در صفحه ---------- */
const headerEl = document.getElementById("site-header");
headerEl.className = "sticky top-0 z-30 w-full border-b-2 border-bk-red bg-bk-surface";
headerEl.innerHTML = header;

const footerEl = document.getElementById("site-footer");
footerEl.id = "contact"; // لینک «تماس با ما» به همین‌جا می‌آید
footerEl.className = "bg-bk-surface border-t-2 border-bk-red";
footerEl.innerHTML = footer;

/* ---------- منوی بازشونده‌ی دسته‌بندی (با کلیک) ---------- */
const dropdowns = document.querySelectorAll("[data-dropdown]");

function closeDropdowns(except) {
  dropdowns.forEach((d) => {
    if (d === except) return;
    d.querySelector("[data-dropdown-panel]").hidden = true;
    d.querySelector("[data-dropdown-toggle]").setAttribute("aria-expanded", "false");
  });
}

dropdowns.forEach((d) => {
  const toggle = d.querySelector("[data-dropdown-toggle]");
  const panel = d.querySelector("[data-dropdown-panel]");
  toggle.addEventListener("click", () => {
    closeDropdowns(d);
    panel.hidden = !panel.hidden;
    toggle.setAttribute("aria-expanded", String(!panel.hidden));
  });
});
// کلیک بیرون از منو یا زدن Esc آن را می‌بندد
document.addEventListener("click", (e) => {
  if (!e.target.closest("[data-dropdown]")) closeDropdowns();
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeDropdowns();
});
