/*
  listing.js — موتور مشترک صفحه‌های لیست محصول (لاستیک و روغن) با فیلتر، جستجو و مرتب‌سازی

  چطور کار می‌کند؟
    1) از روی «groups» (تعریف‌شده در tires-page.js / oils-page.js) فیلترهای چک‌باکسی ساخته می‌شود.
       گزینه‌های هر فیلتر از خود داده‌ها خوانده می‌شود، یعنی فقط مقدارهایی که واقعاً در کاتالوگ هستند
       دیده می‌شوند و هیچ سایز یا گریدی از خودمان اضافه نمی‌شود.
    2) با هر تغییر (چک‌باکس، قیمت، جستجو، مرتب‌سازی) تابع apply() اجرا می‌شود:
       وضعیت فیلترها را از صفحه می‌خواند → محصولات را فیلتر و مرتب می‌کند → کارت‌ها را دوباره می‌سازد.
*/
import { formatPrice, escapeHtml, normalizeText, compactText } from "./utils.js";
import { productCard, attachCardEvents } from "./product-card.js";

const $ = (id) => document.getElementById(id);

// مرتب‌سازی‌های ممکن
const SORTS = {
  popular: (a, b) => b.sales - a.sales,
  newest: (a, b) => b.addedAt.localeCompare(a.addedAt),
  "price-asc": (a, b) => a.price - b.price,
  "price-desc": (a, b) => b.price - a.price,
};

/*
  تنظیمات:
    products   : آرایه‌ی محصولات
    groups     : لیست فیلترها، هر کدام { key, label, get(p), format?(مقدار)→متن, ltr?, sort?: "number" | "text" }
    searchText : تابعی که برای هر محصول متنی می‌سازد که جستجو روی آن انجام می‌شود
*/
export function initListing({ products, groups, searchText }) {
  const form = $("filters-form");
  const grid = $("results-grid");
  const searchInput = $("listing-search");

  /* ---------- ساخت فیلترها ---------- */
  function buildGroup(g) {
    // مقدارهای یکتا (مقدارهای خالی را رد می‌کنیم)
    const values = [...new Set(products.map((p) => g.get(p)).filter((v) => v !== null && v !== undefined && v !== ""))].map(String);
    values.sort(g.sort === "number" ? (a, b) => parseFloat(a) - parseFloat(b) : (a, b) => a.localeCompare(b, "fa"));

    const options = values.length
      ? values
          .map((v) => {
            const count = products.filter((p) => String(g.get(p)) === v).length;
            const text = escapeHtml(g.format ? g.format(v) : v);
            return `
          <label class="flex items-center gap-x-2 py-1.5 text-sm cursor-pointer hover:text-bk-cyan transition">
            <input type="checkbox" data-group="${g.key}" value="${escapeHtml(v)}" class="accent-bk-blue w-4 h-4 shrink-0" />
            <span>${g.ltr ? `<span class="ltr-text">${text}</span>` : text}</span>
            <span class="ms-auto text-xs text-bk-muted">${formatPrice(count)}</span>
          </label>`;
          })
          .join("")
      : '<p class="text-xs text-bk-muted py-2">هنوز مقداری برای این فیلتر ثبت نشده است.</p>';

    return `
      <details class="filter-group" open>
        <summary>${g.label}</summary>
        <div class="pb-3">${options}</div>
      </details>`;
  }

  const priceAndStock = `
    <details class="filter-group" open>
      <summary>بازه‌ی قیمت (تومان)</summary>
      <div class="pb-3 flex items-center gap-x-2">
        <input name="min" type="text" inputmode="numeric" placeholder="از" aria-label="حداقل قیمت" class="bk-input h-10 min-w-0" />
        <span class="text-bk-muted">-</span>
        <input name="max" type="text" inputmode="numeric" placeholder="تا" aria-label="حداکثر قیمت" class="bk-input h-10 min-w-0" />
      </div>
    </details>
    <details class="filter-group" open>
      <summary>موجودی</summary>
      <div class="pb-3">
        <label class="flex items-center gap-x-2 py-1.5 text-sm cursor-pointer hover:text-bk-cyan transition">
          <input name="stock" type="checkbox" class="accent-bk-blue w-4 h-4 shrink-0" />
          <span>فقط کالاهای موجود</span>
        </label>
      </div>
    </details>`;

  $("filter-groups").innerHTML = groups.map(buildGroup).join("") + priceAndStock;

  /* ---------- خواندن وضعیت فیلترها از صفحه ---------- */
  // محصول انتخاب‌شده از پیشنهادهای جستجوی سراسری (?id=tire-demo-1)
  let pinnedId = null;
  let pinnedValue = "";

  function readState() {
    const checks = {}; // مثلاً { rim: Set("17","14"), brand: Set(...) }
    form.querySelectorAll("input[data-group]:checked").forEach((input) => {
      (checks[input.dataset.group] ||= new Set()).add(input.value);
    });
    // عدد قیمت: ارقام فارسی را هم قبول می‌کند و جداکننده‌ها را حذف می‌کند
    const toNumber = (text) => {
      const n = parseInt(normalizeText(text).replace(/[^\d]/g, ""), 10);
      return Number.isNaN(n) ? null : n;
    };
    return {
      checks,
      min: toNumber(form.elements.min.value),
      max: toNumber(form.elements.max.value),
      inStockOnly: form.elements.stock.checked,
      query: normalizeText(searchInput.value),
      // اگر از پیشنهاد جستجوی سراسری آمده باشیم (?id=...) فقط همان یک محصول نشان داده می‌شود؛
      // به‌محض اینکه کاربر متن کادر جستجو را عوض کند این محدودیت برداشته می‌شود
      onlyId: pinnedId && searchInput.value === pinnedValue ? pinnedId : null,
      sort: $("sort-select").value,
    };
  }

  /* ---------- آیا محصول با فیلترها می‌خواند؟ ---------- */
  function matches(p, s, haystack) {
    // هر گروه فیلتر: اگر چیزی انتخاب شده، مقدار محصول باید جزو انتخاب‌ها باشد
    for (const g of groups) {
      const chosen = s.checks[g.key];
      if (chosen && !chosen.has(String(g.get(p)))) return false;
    }
    if (s.onlyId && p.id !== s.onlyId) return false;
    if (s.inStockOnly && !p.inStock) return false;
    if (s.min !== null && p.price < s.min) return false;
    if (s.max !== null && p.price > s.max) return false;

    // جستجو: همه‌ی کلمه‌های تایپ‌شده باید در مشخصات محصول باشند
    if (s.query) {
      const hay = normalizeText(haystack);
      const hayCompact = compactText(hay);
      const ok = s.query.split(" ").every((word) => {
        if (hay.includes(word)) return true;
        const w = compactText(word);
        return w.length >= 3 && hayCompact.includes(w); // «10w40» ← «10W-40»
      });
      if (!ok) return false;
    }
    return true;
  }

  /* ---------- اجرای فیلتر و نمایش نتیجه ---------- */
  const searchText_ = new Map(products.map((p) => [p.id, searchText(p)]));

  function apply() {
    const s = readState();
    const list = products.filter((p) => matches(p, s, searchText_.get(p.id))).sort(SORTS[s.sort]);

    grid.innerHTML = list.map(productCard).join("");
    $("results-count").textContent = `${formatPrice(list.length)} محصول`;
    $("empty-state").classList.toggle("hidden", list.length > 0);
    grid.classList.toggle("hidden", list.length === 0);

    // دکمه‌ی پاک کردن جستجو و شمارنده‌ی فیلترهای فعال (روی دکمه‌ی موبایل)
    $("search-clear").classList.toggle("hidden", !searchInput.value);
    const active =
      Object.values(s.checks).reduce((n, set) => n + set.size, 0) + (s.inStockOnly ? 1 : 0) + (s.min !== null ? 1 : 0) + (s.max !== null ? 1 : 0);
    const badge = $("filters-badge");
    badge.textContent = formatPrice(active);
    badge.classList.toggle("hidden", active === 0);
    $("clear-filters").classList.toggle("hidden", active === 0 && !searchInput.value);
  }

  /* ---------- رویدادها ---------- */
  form.addEventListener("input", apply);
  form.addEventListener("submit", (e) => e.preventDefault());
  searchInput.addEventListener("input", apply);
  $("sort-select").addEventListener("change", apply);

  $("search-clear").addEventListener("click", () => {
    searchInput.value = "";
    searchInput.focus();
    apply();
  });

  // پاک کردن همه‌ی فیلترها و جستجو
  function clearAll() {
    form.reset();
    searchInput.value = "";
    apply();
  }
  $("clear-filters").addEventListener("click", clearAll);
  $("empty-clear").addEventListener("click", clearAll);

  // باز و بسته شدن پنل فیلتر در موبایل (در دسکتاپ همیشه باز است)
  const toggle = $("filters-toggle");
  toggle.addEventListener("click", () => {
    const isOpen = $("filters-panel").classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // «افزودن به سبد» و علاقه‌مندی روی کارت‌ها
  attachCardEvents(grid, products, apply);

  // اگر آدرس صفحه ?q=... داشت (از جستجوی سراسری یا یابنده‌ی سازگاری) در کادر جستجو گذاشته شود
  const params = new URLSearchParams(location.search);
  const initialQuery = params.get("q");
  if (initialQuery) searchInput.value = initialQuery;
  const wantedId = params.get("id");
  const pinned = products.find((p) => p.id === wantedId);
  if (pinned) {
    pinnedId = pinned.id;
    pinnedValue = pinned.name;
    searchInput.value = pinned.name;
  }

  apply();
}
