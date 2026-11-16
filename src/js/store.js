/*
  store.js — علاقه‌مندی‌ها و مقایسه (ذخیره در localStorage) + پیام کوچک (toast)
  هر دو لیست فقط «شناسه»ی محصول را نگه می‌دارند؛ اطلاعات کامل از tires.js و oils.js خوانده می‌شود.
  شمارنده‌های روی آیکن‌های هدر (data-wish-count و data-compare-count) خودکار به‌روز می‌شوند.
*/
import { formatPrice } from "./utils.js";

const WISH_KEY = "baiku-wishlist";
const COMPARE_KEY = "baiku-compare";

function load(key) {
  try {
    const v = JSON.parse(localStorage.getItem(key));
    return Array.isArray(v) ? v : [];
  } catch (e) {
    return [];
  }
}
function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (e) {
    // ذخیره نشد؛ فقط تا بستن صفحه می‌ماند
  }
}

let wish = load(WISH_KEY); // ["tire-demo-1", ...]
let cmp = load(COMPARE_KEY); // [{ id, category }, ...]

/* ---------- شمارنده‌های هدر ---------- */
function updateBadges() {
  const set = (selector, n) =>
    document.querySelectorAll(selector).forEach((el) => {
      el.textContent = formatPrice(n);
      el.classList.toggle("hidden", n === 0);
    });
  set("[data-wish-count]", wish.length);
  set("[data-compare-count]", cmp.length);
}

/* ---------- پیام کوچک پایین صفحه ---------- */
let toastTimer;
export function toast(message) {
  let el = document.getElementById("bk-toast");
  if (!el) {
    el = document.createElement("div");
    el.id = "bk-toast";
    el.setAttribute("role", "status");
    el.className =
      "fixed bottom-6 left-1/2 -translate-x-1/2 z-60 max-w-[90vw] bg-bk-navy border border-bk-blue text-sm px-4 py-3 shadow-2xl transition-opacity duration-300";
    document.body.appendChild(el);
  }
  el.textContent = message;
  el.classList.remove("opacity-0", "invisible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => el.classList.add("opacity-0", "invisible"), 2600);
}

/* ---------- علاقه‌مندی‌ها ---------- */
export const wishlist = {
  all: () => [...wish],
  has: (id) => wish.includes(id),
  toggle(id) {
    wish = wish.includes(id) ? wish.filter((x) => x !== id) : [...wish, id];
    save(WISH_KEY, wish);
    updateBadges();
    return wish.includes(id);
  },
};

/* ---------- مقایسه ---------- */
// حداکثر ۳ محصول و فقط از یک دسته (لاستیک با لاستیک، روغن با روغن)، چون مشخصات‌شان فرق دارد
export const COMPARE_MAX = 3;
export const compare = {
  all: () => cmp.map((c) => c.id),
  has: (id) => cmp.some((c) => c.id === id),
  toggle(product) {
    if (cmp.some((c) => c.id === product.id)) {
      cmp = cmp.filter((c) => c.id !== product.id);
    } else if (cmp.length && cmp[0].category !== product.category) {
      toast("فقط محصولات هم‌دسته را می‌شود مقایسه کرد (لاستیک با لاستیک، روغن با روغن).");
      return false;
    } else if (cmp.length >= COMPARE_MAX) {
      toast(`حداکثر ${formatPrice(COMPARE_MAX)} محصول را می‌توانید هم‌زمان مقایسه کنید.`);
      return false;
    } else {
      cmp = [...cmp, { id: product.id, category: product.category }];
      toast("به لیست مقایسه اضافه شد.");
    }
    save(COMPARE_KEY, cmp);
    updateBadges();
    return true;
  },
  remove(id) {
    cmp = cmp.filter((c) => c.id !== id);
    save(COMPARE_KEY, cmp);
    updateBadges();
  },
  clear() {
    cmp = [];
    save(COMPARE_KEY, cmp);
    updateBadges();
  },
};

updateBadges();
