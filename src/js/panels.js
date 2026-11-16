/*
  panels.js — سبد خرید (کشوی کناری) و پنجره‌ی ورود (مودال)
  همان ایده‌ی panels.js پروژه‌ی فارای است، با این تفاوت‌ها:
    - ظاهر تیره‌ی BAIKU
    - به‌جای «سایز/رنگ» لباس، یک خط مشخصات فنی (spec) نمایش می‌دهد (مثلاً 90/90-17)
    - شمارنده‌ی تعداد کالا روی آیکن سبد
    - داده‌ی پیش‌فرض ندارد؛ سبد در ابتدا خالی است

  استفاده در هر صفحه:
    1) آیکن سبد خرید:  data-open="cart"
    2) آیکن حساب کاربری: data-open="login"
    3) اضافه کردن محصول از هر جای کد:
       window.Cart.add({ id, title, spec, price, image })
*/
import { formatPrice, escapeHtml } from "./utils.js";

const STORAGE_KEY = "baiku-cart";

/* ---------- وضعیت سبد (از localStorage خوانده می‌شود تا بعد از رفرش بماند) ---------- */
let items = [];
try {
  items = JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
} catch (e) {
  items = [];
}
const save = () => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch (e) {
    // اگر مرورگر اجازه‌ی ذخیره نداد، سبد فقط تا بستن صفحه می‌ماند
  }
};

/* ---------- ساخت HTML کشو و مودال و اضافه کردن به صفحه ---------- */
const root = document.createElement("div");
root.innerHTML = `
  <!-- پرده‌ی تیره پشت پنل‌ها -->
  <div id="panel-overlay" class="fixed inset-0 z-40 bg-black/70 opacity-0 invisible transition-opacity duration-300"></div>

  <!-- کشوی سبد خرید -->
  <aside id="cart-drawer" class="fixed inset-y-0 left-0 z-50 w-[92%] max-w-96 bg-bk-black border-r border-bk-line flex flex-col -translate-x-full transition-transform duration-300 shadow-2xl" aria-hidden="true" aria-label="سبد خرید">
    <div class="h-14 bg-bk-navy border-b border-bk-line flex items-center justify-between px-4 shrink-0">
      <h2 class="font-bold text-sm">سبد خرید</h2>
      <button type="button" data-close class="w-8 h-8 text-bk-muted hover:text-bk-white text-lg leading-none cursor-pointer" aria-label="بستن">✕</button>
    </div>

    <div id="cart-items" class="flex-1 overflow-y-auto px-4"></div>

    <div class="shrink-0 px-4 pt-4 pb-6 border-t border-bk-line bg-bk-navy">
      <div class="flex items-center justify-between mb-4">
        <span class="font-bold text-sm">جمع کل:</span>
        <span class="font-bold text-sm text-bk-cyan"><span id="cart-total">۰</span> تومان</span>
      </div>
      <button type="button" id="cart-checkout" class="btn-primary w-full h-11 text-sm">ادامه‌ی خرید</button>
      <button type="button" data-close class="btn-outline w-full h-10 text-xs mt-2">بازگشت به فروشگاه</button>
    </div>
  </aside>

  <!-- پنجره‌ی ورود -->
  <div id="login-modal" class="fixed inset-0 z-50 flex items-center justify-center px-3 py-4 opacity-0 invisible transition-opacity duration-300" aria-hidden="true">
    <form id="login-form" class="relative w-full max-w-sm max-h-full overflow-y-auto bg-bk-navy border border-bk-line px-5 sm:px-6 pt-10 pb-7 flex flex-col shadow-2xl scale-95 transition-transform duration-300" aria-label="ورود به حساب">
      <button type="button" data-close class="absolute top-3 left-3 text-bk-muted hover:text-bk-white text-base leading-none cursor-pointer" aria-label="بستن">✕</button>
      <h2 class="font-bold text-base text-center mb-6">خوش آمدید</h2>
      <input type="tel" inputmode="numeric" placeholder="شماره همراه" class="bk-input mb-3 text-right" />
      <div class="relative mb-2">
        <input id="login-pass" type="password" placeholder="کلمه عبور" class="bk-input pl-10 text-right" />
        <button type="button" id="toggle-pass" class="absolute left-3 top-1/2 -translate-y-1/2 text-bk-muted hover:text-bk-white cursor-pointer" aria-label="نمایش رمز">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
        </button>
      </div>
      <a href="#" class="text-xs text-bk-muted hover:text-bk-blue underline self-start mb-5">کلمه عبور خود را فراموش کرده‌اید؟</a>
      <button type="submit" class="btn-primary h-11 text-sm">ورود</button>
      <p class="text-[11px] text-bk-muted text-center mt-4">این فرم فعلاً نمایشی است و به سرور وصل نیست.</p>
    </form>
  </div>
`;
document.body.appendChild(root);

const overlay = document.getElementById("panel-overlay");
const drawer = document.getElementById("cart-drawer");
const modal = document.getElementById("login-modal");
const loginForm = document.getElementById("login-form");
const itemsBox = document.getElementById("cart-items");
const totalEl = document.getElementById("cart-total");

/* ---------- باز و بسته کردن پنل‌ها ---------- */
function closeAll() {
  drawer.classList.add("-translate-x-full");
  drawer.setAttribute("aria-hidden", "true");
  modal.classList.add("opacity-0", "invisible");
  modal.setAttribute("aria-hidden", "true");
  loginForm.classList.add("scale-95");
  overlay.classList.add("opacity-0", "invisible");
  document.body.classList.remove("panel-open");
}

function open(name) {
  closeAll();
  overlay.classList.remove("opacity-0", "invisible");
  document.body.classList.add("panel-open");
  if (name === "cart") {
    drawer.classList.remove("-translate-x-full");
    drawer.setAttribute("aria-hidden", "false");
  } else if (name === "login") {
    modal.classList.remove("opacity-0", "invisible");
    modal.setAttribute("aria-hidden", "false");
    loginForm.classList.remove("scale-95");
  }
}

// هر دکمه‌ای که data-open="cart" یا data-open="login" داشته باشد پنل را باز می‌کند
document.querySelectorAll("[data-open]").forEach((el) => {
  el.addEventListener("click", (e) => {
    e.preventDefault();
    open(el.dataset.open);
  });
});
root.querySelectorAll("[data-close]").forEach((el) => el.addEventListener("click", closeAll));
overlay.addEventListener("click", closeAll);
modal.addEventListener("click", (e) => {
  if (e.target === modal) closeAll(); // کلیک روی بیرون فرم
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeAll();
});

/* ---------- فرم ورود (نمایشی) ---------- */
document.getElementById("toggle-pass").addEventListener("click", () => {
  const input = document.getElementById("login-pass");
  input.type = input.type === "password" ? "text" : "password";
});
loginForm.addEventListener("submit", (e) => e.preventDefault());

/* ---------- نمایش سبد ---------- */
// هر بار سبد عوض شود این تابع کل لیست، جمع قیمت و شمارنده را دوباره می‌سازد
function render() {
  if (!items.length) {
    itemsBox.innerHTML = '<p class="text-sm text-bk-muted text-center pt-16">سبد خرید شما خالی است</p>';
  } else {
    itemsBox.innerHTML = items
      .map(
        (it, i) => `
      <div class="flex gap-x-3 py-4 border-b border-bk-line">
        <img src="${escapeHtml(it.image)}" class="w-16 h-16 object-cover shrink-0 bg-bk-navy border border-bk-line" alt="" />
        <div class="flex-1 min-w-0 flex flex-col justify-between gap-y-2">
          <div class="flex items-start justify-between gap-x-2">
            <div class="min-w-0">
              <h3 class="font-bold text-[13px] mb-1">${escapeHtml(it.title)}</h3>
              <p class="text-[11px] text-bk-muted"><span class="ltr-text">${escapeHtml(it.spec || "")}</span></p>
            </div>
            <button type="button" data-remove="${i}" class="text-bk-muted hover:text-bk-white cursor-pointer shrink-0" aria-label="حذف">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6"/></svg>
            </button>
          </div>
          <div class="flex items-end justify-between gap-x-2">
            <span class="font-bold text-[13px] text-bk-cyan">${formatPrice(it.price)} تومان</span>
            <div class="w-20 h-7 border border-bk-line flex items-center justify-between px-2 text-[13px]">
              <button type="button" data-plus="${i}" class="cursor-pointer" aria-label="افزایش">+</button>
              <span>${formatPrice(it.qty)}</span>
              <button type="button" data-minus="${i}" class="cursor-pointer" aria-label="کاهش">−</button>
            </div>
          </div>
        </div>
      </div>`
      )
      .join("");
  }

  totalEl.textContent = formatPrice(items.reduce((sum, it) => sum + it.price * it.qty, 0));

  // شمارنده‌ی روی آیکن سبد (مجموع تعداد کالاها)
  const count = items.reduce((sum, it) => sum + it.qty, 0);
  document.querySelectorAll("[data-cart-count]").forEach((badge) => {
    badge.textContent = formatPrice(count);
    badge.classList.toggle("hidden", count === 0);
  });

  save();
  // به صفحه‌هایی مثل checkout خبر می‌دهیم که سبد عوض شد
  document.dispatchEvent(new CustomEvent("baiku:cart"));
}

// کلیک روی + و − و حذف (event delegation: یک شنونده برای کل لیست)
itemsBox.addEventListener("click", (e) => {
  const btn = e.target.closest("button");
  if (!btn) return;
  if (btn.dataset.plus !== undefined) items[btn.dataset.plus].qty++;
  else if (btn.dataset.minus !== undefined) {
    const it = items[btn.dataset.minus];
    if (it.qty > 1) it.qty--;
  } else if (btn.dataset.remove !== undefined) items.splice(btn.dataset.remove, 1);
  else return;
  render();
});

/* ---------- API عمومی: window.Cart ---------- */
window.Cart = {
  add(product) {
    const qty = Number(product.qty) || 1;
    const found = items.find((it) => it.id === product.id); // اگر قبلاً بوده فقط تعدادش زیاد شود
    if (found) found.qty += qty;
    else items.push({ ...product, qty });
    render();
    open("cart");
  },
  open: () => open("cart"),
  items: () => items.map((it) => ({ ...it })), // کپی از سبد (برای صفحه‌ی checkout)
  clear() {
    items = [];
    render();
  },
};

/* ---------- ادامه‌ی خرید ---------- */
document.getElementById("cart-checkout").addEventListener("click", () => {
  if (!items.length) return;
  location.href = "./checkout.html";
});

render();

// اگر آدرس صفحه با #cart تمام شد، سبد خودکار باز شود
if (location.hash === "#cart") open("cart");
