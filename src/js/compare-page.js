// فقط برای صفحه‌ی مقایسه (compare.html)
import "./common.js";
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { getSpec } from "./product-card.js";
import { SPEC_ROWS, specText, specHtml } from "./specs.js";
import { compare } from "./store.js";
import { formatPrice, escapeHtml } from "./utils.js";

const all = [...tires, ...oils];
const box = document.getElementById("compare-box");
const onlyDiff = document.getElementById("only-diff");
const diffWrap = document.getElementById("only-diff-wrap");
const clearBtn = document.getElementById("compare-clear");

function render() {
  const list = compare.all().map((id) => all.find((p) => p.id === id)).filter(Boolean);
  clearBtn.classList.toggle("hidden", list.length === 0);
  diffWrap.classList.toggle("hidden", list.length < 2);

  if (!list.length) {
    box.innerHTML = `
      <div class="bk-card p-8 text-center">
        <p class="font-bold mb-2">هنوز محصولی برای مقایسه انتخاب نکرده‌اید</p>
        <p class="text-sm text-bk-muted mb-5">روی کارت هر محصول، دکمه‌ی مقایسه (فلش‌های دوطرفه) را بزنید. تا ۳ محصول هم‌دسته را می‌شود کنار هم دید.</p>
        <a href="./tires.html" class="btn-primary h-11 px-6 text-sm inline-flex">لاستیک‌ها</a>
        <a href="./oils.html" class="btn-outline h-11 px-6 text-sm inline-flex mr-2">روغن‌ها</a>
      </div>`;
    return;
  }

  const category = list[0].category;
  const rows = [
    { label: "برند", html: (p) => escapeHtml(p.brand), text: (p) => p.brand },
    { label: "قیمت", html: (p) => `<b>${formatPrice(p.price)}</b> <span class="text-xs text-bk-muted">تومان</span>`, text: (p) => String(p.price) },
    { label: "موجودی", html: (p) => (p.inStock ? "موجود" : '<span class="text-bk-muted">ناموجود</span>'), text: (p) => String(p.inStock) },
    ...SPEC_ROWS[category].map((r) => ({ label: r.label, html: (p) => specHtml(r, p), text: (p) => specText(r, p) })),
  ];

  const th = "border border-bk-line bg-bk-navy p-3 text-right text-xs text-bk-muted font-normal align-top sticky right-0 w-28 sm:w-36";
  const td = "border border-bk-line p-3 text-sm align-top min-w-44";

  const head = list
    .map(
      (p) => `<td class="${td}">
        <img src="${escapeHtml(p.image)}" alt="" class="w-full max-w-36 aspect-square object-cover bg-bk-black mb-3" />
        <a href="./product.html?id=${encodeURIComponent(p.id)}" class="font-bold hover:text-bk-blue transition block">${escapeHtml(p.name)}</a>
        <p class="text-bk-cyan text-xs mt-1"><span class="ltr-text">${escapeHtml(getSpec(p))}</span></p>
        <div class="flex flex-col gap-y-2 mt-3">
          <button type="button" data-add="${p.id}" ${p.inStock ? "" : "disabled"} class="${p.inStock ? "btn-primary" : "bg-bk-line text-bk-muted cursor-not-allowed"} h-9 text-xs flex items-center justify-center">${p.inStock ? "افزودن به سبد" : "ناموجود"}</button>
          <button type="button" data-remove="${p.id}" class="text-xs text-bk-muted hover:text-bk-white underline cursor-pointer">حذف از مقایسه</button>
        </div>
      </td>`
    )
    .join("");

  const body = rows
    .map((r) => {
      const differs = new Set(list.map(r.text)).size > 1;
      if (onlyDiff.checked && list.length > 1 && !differs) return "";
      return `<tr><th scope="row" class="${th}">${r.label}${differs && list.length > 1 ? ' <span class="text-bk-blue" title="تفاوت دارد">●</span>' : ""}</th>${list
        .map((p) => `<td class="${td} ${differs && list.length > 1 ? "bg-bk-blue/5" : ""}">${r.html(p)}</td>`)
        .join("")}</tr>`;
    })
    .join("");

  box.innerHTML = `
    <div class="overflow-x-auto">
      <table class="w-full border-collapse bg-bk-black">
        <tbody><tr><th class="${th}"></th>${head}</tr>${body}</tbody>
      </table>
    </div>
    ${list.length === 1 ? '<p class="text-sm text-bk-muted mt-4">برای مقایسه، حداقل یک محصول هم‌دسته‌ی دیگر هم اضافه کنید.</p>' : ""}`;
}

box.addEventListener("click", (e) => {
  const rm = e.target.closest("[data-remove]");
  const add = e.target.closest("[data-add]");
  if (rm) {
    compare.remove(rm.dataset.remove);
    render();
  } else if (add) {
    const p = all.find((x) => x.id === add.dataset.add);
    if (p && p.inStock) window.Cart.add({ id: p.id, title: p.name, spec: getSpec(p), price: p.price, image: p.image });
  }
});
onlyDiff.addEventListener("change", render);
clearBtn.addEventListener("click", () => {
  compare.clear();
  render();
});
render();
