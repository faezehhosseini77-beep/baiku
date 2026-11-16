/*
  finder.js — «محصول مناسب موتورت را پیدا کن» (صفحه‌ی اصلی)

  سه روش دارد:
    ۱) بر اساس موتورسیکلت  ← فقط از ردیف‌هایی در bikes.js استفاده می‌کند که verified: true باشند
    ۲) بر اساس سایز لاستیک  ← گزینه‌ها از خود کاتالوگ ساخته می‌شوند (سایز ساختگی ندارد)
    ۳) بر اساس روغن         ← نوع موتور و گرید، از کاتالوگ

  قانون مهم پروژه: اگر سازگاری تأیید نشده باشد، هیچ محصولی «سازگار» معرفی نمی‌شود.
*/
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { bikes } from "../data/bikes.js";
import { productCard, attachCardEvents } from "./product-card.js";
import { normalizeText, compactText, escapeHtml } from "./utils.js";

const $ = (id) => document.getElementById(id);
const MAX_CARDS = 6;

/* ---------- ابزارهای کوچک ---------- */

// پر کردن یک <select>؛ options = [{value, label}]
function fillSelect(select, placeholder, options) {
  select.innerHTML =
    `<option value="">${placeholder}</option>` +
    options.map((o) => `<option value="${escapeHtml(o.value)}">${escapeHtml(o.label)}</option>`).join("");
  select.disabled = options.length === 0;
}

// مقدارهای یکتا، با مرتب‌سازی (عددی یا الفبایی)
const unique = (list) => [...new Set(list)];
const byNumber = (a, b) => parseFloat(a) - parseFloat(b);

// نمایش کارت محصول‌ها در یک ظرف + لینک «مشاهده در صفحه‌ی دسته‌بندی»
const wired = new WeakSet(); // برای اینکه رویداد کلیک هر ظرف فقط یک بار وصل شود
function showProducts(box, list, { intro = "", href, linkLabel, emptyText }) {
  const draw = () => {
    if (!list.length) {
      box.innerHTML = `<p class="text-sm text-bk-muted border border-bk-line p-4">${emptyText}</p>`;
      return;
    }
    box.innerHTML = `
      ${intro}
      <div class="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4">${list.slice(0, MAX_CARDS).map(productCard).join("")}</div>
      <a href="${href}" class="btn-outline h-11 px-5 text-sm mt-4 inline-flex">${linkLabel}</a>`;
  };
  draw();
  if (!wired.has(box)) {
    wired.add(box);
    attachCardEvents(box, [...tires, ...oils], draw);
  }
}

/* ---------- تب‌ها ---------- */
function initTabs() {
  const tabs = document.querySelectorAll("[data-tab]");
  const panels = document.querySelectorAll("[data-panel]");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.setAttribute("aria-selected", String(t === tab)));
      panels.forEach((p) => (p.hidden = p.dataset.panel !== tab.dataset.tab));
    })
  );
}

/* ---------- ۱) موتورسیکلت ---------- */
function initBikeFinder() {
  const brandSel = $("f-bike-brand");
  const modelSel = $("f-bike-model");
  const yearSel = $("f-bike-year");
  const result = $("f-bike-result");

  // فقط ردیف‌های تأییدشده؛ ردیف نمونه (verified: false) هیچ‌وقت وارد نمی‌شود
  const verified = bikes.filter((b) => b.verified === true);

  if (!verified.length) {
    fillSelect(brandSel, "—", []);
    fillSelect(modelSel, "—", []);
    fillSelect(yearSel, "—", []);
    result.innerHTML = `
      <p class="text-sm border border-bk-line bg-bk-black p-4 leading-7">
        اطلاعات سازگاری موتورسیکلت‌ها هنوز وارد نشده است و ما چیزی را «حدسی» پیشنهاد نمی‌دهیم.
        فعلاً سایز لاستیک و گرید روغن را از <b>دفترچه‌ی راهنمای موتور</b> بخوانید و از دو تب بعدی استفاده کنید،
        یا با پشتیبانی تماس بگیرید.
      </p>`;
    return;
  }

  fillSelect(brandSel, "انتخاب کنید", unique(verified.map((b) => b.brand)).map((v) => ({ value: v, label: v })));
  fillSelect(modelSel, "ابتدا سازنده", []);
  fillSelect(yearSel, "ابتدا مدل", []);

  brandSel.addEventListener("change", () => {
    const models = unique(verified.filter((b) => b.brand === brandSel.value).map((b) => b.model));
    fillSelect(modelSel, "انتخاب کنید", models.map((v) => ({ value: v, label: v })));
    fillSelect(yearSel, "ابتدا مدل", []);
    result.innerHTML = "";
  });

  modelSel.addEventListener("change", () => {
    const rows = verified.filter((b) => b.brand === brandSel.value && b.model === modelSel.value);
    fillSelect(yearSel, "انتخاب کنید", rows.map((b) => ({ value: b.years, label: b.years })));
    result.innerHTML = "";
  });

  yearSel.addEventListener("change", () => {
    const bike = verified.find(
      (b) => b.brand === brandSel.value && b.model === modelSel.value && b.years === yearSel.value
    );
    if (!bike) return (result.innerHTML = "");

    // محصولات کاتالوگ که دقیقاً همان سایز / گرید تأییدشده را دارند
    const sizes = [bike.frontTire, bike.rearTire].filter(Boolean);
    const matchedTires = tires.filter((t) => sizes.includes(t.size));
    const matchedOils = bike.oilViscosity ? oils.filter((o) => o.viscosity === bike.oilViscosity) : [];

    const row = (label, value) =>
      value ? `<li><span class="text-bk-muted">${label}:</span> <span class="ltr-text font-bold text-bk-cyan">${escapeHtml(value)}</span></li>` : "";

    result.innerHTML = `
      <div class="border border-bk-blue/50 bg-bk-black p-4">
        <p class="font-bold mb-2">${escapeHtml(bike.brand)} ${escapeHtml(bike.model)} <span class="ltr-text text-bk-muted text-sm">${escapeHtml(bike.years)}</span></p>
        <ul class="text-sm space-y-1">
          ${row("لاستیک جلو", bike.frontTire)}${row("لاستیک عقب", bike.rearTire)}${row("گرید روغن", bike.oilViscosity)}
        </ul>
        ${bike.source ? `<p class="text-xs text-bk-muted mt-3">منبع: ${escapeHtml(bike.source)}</p>` : ""}
      </div>
      <div id="f-bike-tires" class="mt-4"></div>
      <div id="f-bike-oils" class="mt-4"></div>`;

    showProducts($("f-bike-tires"), matchedTires, {
      intro: '<p class="text-sm font-bold mb-3">لاستیک‌های موجود در کاتالوگ با این سایز</p>',
      href: `./tires.html?q=${encodeURIComponent(sizes[0] || "")}`,
      linkLabel: "مشاهده در صفحه‌ی لاستیک",
      emptyText: "لاستیکی با این سایز فعلاً در کاتالوگ ثبت نشده است.",
    });
    showProducts($("f-bike-oils"), matchedOils, {
      intro: '<p class="text-sm font-bold mb-3">روغن‌های موجود در کاتالوگ با این گرید</p>',
      href: `./oils.html?q=${encodeURIComponent(bike.oilViscosity || "")}`,
      linkLabel: "مشاهده در صفحه‌ی روغن",
      emptyText: bike.oilViscosity ? "روغنی با این گرید فعلاً در کاتالوگ ثبت نشده است." : "گرید روغن برای این مدل ثبت نشده است.",
    });
  });
}

/* ---------- ۲) سایز لاستیک ---------- */
function initTireFinder() {
  const widthSel = $("f-tire-width");
  const aspectSel = $("f-tire-aspect");
  const rimSel = $("f-tire-rim");
  const result = $("f-tire-result");

  // سایزهای قدیمی مثل 2.75-17 نسبت ارتفاع ندارند (aspect: null) → گزینه‌ی «none»
  const aspectKey = (t) => (t.aspect === null ? "none" : String(t.aspect));
  const aspectLabel = (k) => (k === "none" ? "بدون نسبت (سایز قدیمی)" : k);

  fillSelect(widthSel, "انتخاب کنید", unique(tires.map((t) => t.width)).sort(byNumber).map((v) => ({ value: v, label: v })));
  fillSelect(aspectSel, "ابتدا عرض", []);
  fillSelect(rimSel, "ابتدا نسبت", []);

  widthSel.addEventListener("change", () => {
    const keys = unique(tires.filter((t) => t.width === widthSel.value).map(aspectKey));
    fillSelect(aspectSel, "انتخاب کنید", keys.map((k) => ({ value: k, label: aspectLabel(k) })));
    fillSelect(rimSel, "ابتدا نسبت", []);
    result.innerHTML = "";
  });

  aspectSel.addEventListener("change", () => {
    const rims = unique(
      tires.filter((t) => t.width === widthSel.value && aspectKey(t) === aspectSel.value).map((t) => String(t.rim))
    ).sort(byNumber);
    fillSelect(rimSel, "انتخاب کنید", rims.map((v) => ({ value: v, label: v })));
    result.innerHTML = "";
  });

  rimSel.addEventListener("change", () => {
    const list = tires.filter(
      (t) => t.width === widthSel.value && aspectKey(t) === aspectSel.value && String(t.rim) === rimSel.value
    );
    if (!list.length) return (result.innerHTML = "");
    showProducts(result, list, {
      href: `./tires.html?q=${encodeURIComponent(list[0].size)}`,
      linkLabel: "مشاهده در صفحه‌ی لاستیک",
      emptyText: "",
    });
  });
}

/* ---------- ۳) روغن ---------- */
function initOilFinder() {
  const typeSel = $("f-oil-type");
  const viscSel = $("f-oil-visc");
  const result = $("f-oil-result");

  fillSelect(typeSel, "انتخاب کنید", unique(oils.map((o) => o.oilType)).sort().map((v) => ({ value: v, label: v })));
  fillSelect(viscSel, "ابتدا نوع موتور", []);

  const show = (list, q) =>
    showProducts(result, list, {
      href: `./oils.html?q=${encodeURIComponent(q)}`,
      linkLabel: "مشاهده در صفحه‌ی روغن",
      emptyText: "روغنی با این مشخصات فعلاً در کاتالوگ ثبت نشده است.",
    });

  typeSel.addEventListener("change", () => {
    result.innerHTML = "";
    const ofType = oils.filter((o) => o.oilType === typeSel.value);
    const viscosities = unique(ofType.map((o) => o.viscosity).filter(Boolean));
    if (!typeSel.value) return fillSelect(viscSel, "ابتدا نوع موتور", []);
    if (!viscosities.length) {
      // مثل 2T: گرید ویسکوزیته ندارد، پس مستقیم نتیجه‌ها را نشان بده
      fillSelect(viscSel, "گرید ندارد", []);
      return show(ofType, typeSel.value);
    }
    fillSelect(viscSel, "انتخاب کنید", viscosities.map((v) => ({ value: v, label: v })));
  });

  viscSel.addEventListener("change", () => {
    if (!viscSel.value) return (result.innerHTML = "");
    // مقایسه با normalizeText/compactText تا قالب‌های مختلف نوشتن گرید مشکل نسازند
    const want = compactText(normalizeText(viscSel.value));
    show(
      oils.filter((o) => o.oilType === typeSel.value && o.viscosity && compactText(normalizeText(o.viscosity)) === want),
      viscSel.value
    );
  });
}

export function initFinder() {
  if (!$("finder")) return;
  initTabs();
  initBikeFinder();
  initTireFinder();
  initOilFinder();
}
