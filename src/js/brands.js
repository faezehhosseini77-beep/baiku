/*
  brands.js — بخش «برندها» در صفحه‌ی اصلی
  برندها از روی خود کاتالوگ (tires.js و oils.js) ساخته می‌شوند، پس هیچ برند ساختگی جدایی وجود ندارد.
  وقتی برندهای واقعی را در داده‌ها وارد کردید این بخش خودکار به‌روز می‌شود.
*/
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { escapeHtml, formatPrice } from "./utils.js";

export function initBrands() {
  const grid = document.getElementById("brands-grid");
  if (!grid) return;

  const all = [...tires, ...oils];
  const names = [...new Set(all.map((p) => p.brand))];

  grid.innerHTML = names
    .map((name) => {
      const t = tires.filter((p) => p.brand === name).length;
      const o = oils.filter((p) => p.brand === name).length;
      const isDemo = all.some((p) => p.brand === name && p.demo);
      // لینک به صفحه‌ای که بیشتر محصول آن برند را دارد؛ جستجو با نام برند فیلتر می‌کند
      const page = t >= o ? "./tires.html" : "./oils.html";
      const mark = name.trim().split(" ").pop(); // حرف یا کلمه‌ی آخر نام به‌عنوان نشان موقت
      return `
        <a href="${page}?q=${encodeURIComponent(name)}" class="bk-card flex flex-col items-center text-center p-5 gap-y-2">
          <span class="w-16 h-16 border border-bk-line bg-bk-black flex items-center justify-center text-bk-blue text-xl font-bold" aria-hidden="true">${escapeHtml(mark)}</span>
          <span class="font-bold text-sm">${escapeHtml(name)}</span>
          <span class="text-[11px] text-bk-muted">${t ? `${formatPrice(t)} لاستیک` : ""}${t && o ? " · " : ""}${o ? `${formatPrice(o)} روغن` : ""}</span>
          ${isDemo ? '<span class="text-[10px] text-bk-muted border border-bk-line px-2 py-0.5">نمونه</span>' : ""}
        </a>`;
    })
    .join("");
}
