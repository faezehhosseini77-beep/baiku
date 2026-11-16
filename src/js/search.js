/*
  search.js — جستجوی هوشمند سراسری (نوار جستجوی هدر در همه‌ی صفحه‌ها)

  کارهایی که انجام می‌دهد:
    1. هنگام تایپ، پیشنهاد نشان می‌دهد (مقدار فنی مثل سایز و گرید + محصول‌ها)
    2. ارقام فارسی را به انگلیسی تبدیل می‌کند:  «۹۰/۹۰-۱۷» = «90/90-17»
    3. فرمت‌های مختلف را یکی می‌داند:          «10w40» = «10W-40»
    4. با کلیدهای ↑ ↓ Enter Esc هم کار می‌کند
    5. Enter بدون انتخاب پیشنهاد، به صفحه‌ی دسته‌ای می‌رود که نتیجه‌ی بیشتری دارد

  داده از همان tires.js و oils.js می‌آید؛ چیزی ساختگی به آن اضافه نمی‌شود.
*/
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { normalizeText, compactText, formatPrice, escapeHtml } from "./utils.js";
import { getSpec } from "./product-card.js";

const PAGE = { tire: "./tires.html", oil: "./oils.html" };
const LABEL = { tire: "لاستیک", oil: "روغن موتور" };

/* ---------- ساخت ایندکس جستجو (یک بار، هنگام بارگذاری) ---------- */
// متنی که جستجو روی آن انجام می‌شود: نام، برند، مشخصات فنی و برچسب فارسی
function haystackOf(p) {
  const parts =
    p.category === "tire"
      ? [p.name, p.brand, p.size, p.width, p.aspect, `رینگ ${p.rim}`, "لاستیک"]
      : [p.name, p.brand, p.oilType, p.viscosity, p.api && `API ${p.api}`, p.jaso && `JASO ${p.jaso}`, p.volume, "روغن موتور"];
  return normalizeText(parts.filter((x) => x !== null && x !== undefined).join(" "));
}

const index = [...tires, ...oils].map((p) => {
  const hay = haystackOf(p);
  return { p, hay, hayCompact: compactText(hay), specCompact: compactText(normalizeText(p.size || p.viscosity || "")) };
});

// مقدارهای فنی یکتا برای پیشنهاد سریع: سایز لاستیک‌ها و گریدهای روغن
const techValues = [
  ...new Set(tires.map((p) => p.size)),
  ...new Set(oils.map((p) => p.viscosity).filter(Boolean)),
].map((value) => ({
  value,
  category: /W-/i.test(value) ? "oil" : "tire",
  compact: compactText(normalizeText(value)),
}));

/* ---------- جستجو و امتیازدهی ---------- */
function search(rawQuery) {
  const q = normalizeText(rawQuery);
  if (!q) return { products: [], tech: [], counts: { tire: 0, oil: 0 } };
  const words = q.split(" ");
  const qCompact = compactText(q);

  const found = [];
  for (const item of index) {
    // همه‌ی کلمه‌ها باید پیدا شوند (کلمه‌ی ۳ حرفی به بالا به‌صورت فشرده هم چک می‌شود)
    const ok = words.every((w) => {
      if (item.hay.includes(w)) return true;
      const c = compactText(w);
      return c.length >= 3 && item.hayCompact.includes(c);
    });
    if (!ok) continue;

    let score = 1;
    if (item.specCompact === qCompact) score += 20; // دقیقاً همان سایز / گرید
    else if (qCompact.length >= 3 && item.specCompact.includes(qCompact)) score += 10;
    if (normalizeText(item.p.name).startsWith(q)) score += 5;
    if (normalizeText(item.p.brand).includes(q)) score += 3;
    if (item.p.inStock) score += 2; // موجودها بالاتر
    found.push({ ...item, score });
  }
  found.sort((a, b) => b.score - a.score || b.p.sales - a.p.sales);

  const counts = { tire: 0, oil: 0 };
  found.forEach((f) => counts[f.p.category]++);

  // پیشنهاد مقدار فنی (فقط وقتی حداقل ۲ نویسه تایپ شده)
  const tech = qCompact.length >= 2 ? techValues.filter((t) => t.compact.includes(qCompact)).slice(0, 4) : [];

  return { products: found.slice(0, 5).map((f) => f.p), tech, counts };
}

/* ---------- ساخت HTML پیشنهادها ---------- */
const row = (href, inner) =>
  `<a href="${href}" data-sug class="flex items-center gap-x-3 px-3 py-2.5 hover:bg-bk-blue/10 focus:bg-bk-blue/10 data-[active=true]:bg-bk-blue/15 outline-none">${inner}</a>`;

function productRow(p) {
  const href = `./product.html?id=${encodeURIComponent(p.id)}`; // صفحه‌ی جزئیات محصول
  return row(
    href,
    `<img src="${escapeHtml(p.image)}" alt="" class="w-11 h-11 object-cover bg-bk-black shrink-0" />
     <span class="min-w-0 flex-1">
       <span class="block text-sm font-bold truncate">${escapeHtml(p.name)}</span>
       <span class="block text-xs text-bk-muted"><span class="ltr-text text-bk-cyan">${escapeHtml(getSpec(p))}</span> · ${escapeHtml(p.brand)}</span>
     </span>
     <span class="text-xs text-bk-muted shrink-0">${formatPrice(p.price)} تومان</span>`
  );
}

function techRow(t) {
  return row(
    `${PAGE[t.category]}?q=${encodeURIComponent(t.value)}`,
    `<span class="w-11 h-11 flex items-center justify-center border border-bk-line text-bk-blue text-xs shrink-0">${t.category === "oil" ? "گرید" : "سایز"}</span>
     <span class="flex-1 text-sm"><span class="ltr-text font-bold text-bk-cyan">${escapeHtml(t.value)}</span> <span class="text-xs text-bk-muted">در ${LABEL[t.category]}</span></span>`
  );
}

function render(box, rawQuery) {
  const q = normalizeText(rawQuery);

  // هنوز چیزی تایپ نشده: چند مثال از خود داده‌ها
  if (!q) {
    const examples = [techValues.find((t) => t.category === "tire"), techValues.find((t) => t.category === "oil")].filter(Boolean);
    box.innerHTML = `<p class="px-3 pt-3 text-xs text-bk-muted">مثلاً این‌ها را امتحان کنید:</p>${examples.map(techRow).join("")}`;
    return;
  }

  const { products, tech, counts } = search(rawQuery);
  if (!products.length && !tech.length) {
    box.innerHTML = `<p class="px-3 py-4 text-sm text-bk-muted">محصولی برای «${escapeHtml(rawQuery)}» پیدا نشد. سایز یا گرید را به شکل دیگری بنویسید (مثلاً <span class="ltr-text">90/90-17</span> یا <span class="ltr-text">10W-40</span>).</p>`;
    return;
  }

  let html = "";
  if (tech.length) html += `<p class="px-3 pt-3 text-[11px] text-bk-muted">مشخصات فنی</p>${tech.map(techRow).join("")}`;
  if (products.length) html += `<p class="px-3 pt-3 text-[11px] text-bk-muted">محصولات</p>${products.map(productRow).join("")}`;

  // لینک «همه‌ی نتایج» برای هر دسته‌ای که نتیجه دارد
  const more = ["tire", "oil"]
    .filter((c) => counts[c] > 0)
    .map(
      (c) =>
        `<a href="${PAGE[c]}?q=${encodeURIComponent(rawQuery)}" data-sug class="flex-1 text-center text-xs py-2.5 border border-bk-line hover:border-bk-blue data-[active=true]:border-bk-blue">همه‌ی نتایج ${LABEL[c]} (${formatPrice(counts[c])})</a>`
    )
    .join("");
  html += `<div class="flex gap-x-2 p-3 border-t border-bk-line mt-2">${more}</div>`;
  box.innerHTML = html;
}

/* ---------- اتصال به نوار جستجوی هدر ---------- */
export function initSearch() {
  const toggle = document.getElementById("search-toggle");
  const bar = document.getElementById("search-bar");
  const form = document.getElementById("search-form");
  const input = document.getElementById("search-input");
  const box = document.getElementById("search-suggest");
  if (!toggle || !bar || !form || !input || !box) return;

  let active = -1; // شماره‌ی پیشنهاد انتخاب‌شده با کیبورد
  const items = () => [...box.querySelectorAll("[data-sug]")];

  function open() {
    render(box, input.value);
    box.classList.remove("hidden");
    input.setAttribute("aria-expanded", "true");
    active = -1;
  }
  function close() {
    box.classList.add("hidden");
    input.setAttribute("aria-expanded", "false");
    active = -1;
  }
  function highlight(i) {
    const list = items();
    list.forEach((el, n) => el.setAttribute("data-active", String(n === i)));
    active = i;
    if (list[i]) list[i].scrollIntoView({ block: "nearest" });
  }

  // باز و بسته کردن نوار با آیکن ذره‌بین
  toggle.addEventListener("click", () => {
    const isOpen = bar.classList.toggle("hidden") === false;
    toggle.setAttribute("aria-expanded", String(isOpen));
    if (isOpen) {
      input.focus();
    } else {
      close();
    }
  });

  input.addEventListener("input", open);
  input.addEventListener("focus", open);

  input.addEventListener("keydown", (e) => {
    const list = items();
    if (e.key === "ArrowDown" || e.key === "ArrowUp") {
      e.preventDefault();
      if (box.classList.contains("hidden")) open();
      if (!list.length) return;
      const step = e.key === "ArrowDown" ? 1 : -1;
      highlight((active + step + list.length) % list.length);
    } else if (e.key === "Escape") {
      // در input از نوع search، Esc به‌صورت پیش‌فرض متن را پاک می‌کند و لیست دوباره باز می‌شد
      e.preventDefault();
      close();
    }
  });

  // Enter: اگر پیشنهادی انتخاب شده باشد همان؛ وگرنه صفحه‌ی دسته‌ای با نتیجه‌ی بیشتر
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const list = items();
    if (active >= 0 && list[active]) {
      location.href = list[active].getAttribute("href");
      return;
    }
    const raw = input.value.trim();
    if (!raw) return;
    const { counts } = search(raw);
    if (counts.tire === 0 && counts.oil === 0) {
      open(); // پیام «پیدا نشد» نشان داده می‌شود
      return;
    }
    const category = counts.tire >= counts.oil ? "tire" : "oil";
    location.href = `${PAGE[category]}?q=${encodeURIComponent(raw)}`;
  });

  // کلیک بیرون از نوار: بستن لیست پیشنهاد
  document.addEventListener("click", (e) => {
    if (!form.contains(e.target) && !toggle.contains(e.target)) close();
  });

  // اگر کاربر از صفحه‌ی لیست آمده و ?q= دارد، همان متن در جستجوی هدر هم باشد
  const q = new URLSearchParams(location.search).get("q");
  if (q) input.value = q;
}
