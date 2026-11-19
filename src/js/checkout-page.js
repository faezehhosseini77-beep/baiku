/*
  checkout-page.js — صفحه‌ی تسویه‌حساب (نمونه‌ی نمایشی)
  ⚠️ این صفحه هیچ سفارشی ثبت نمی‌کند، پرداختی انجام نمی‌دهد و اطلاعات فرم را به هیچ‌جا نمی‌فرستد.
  فقط اعتبارسنجی فرم و فرآیند «ثبت سفارش» را نشان می‌دهد تا بعداً به سرور واقعی وصل شود.
*/
import "./common.js";
import { formatPrice, escapeHtml, toEnglishDigits } from "./utils.js";

const form = document.getElementById("checkout-form");
const summary = document.getElementById("summary-items");
const totalEl = document.getElementById("summary-total");
const emptyBox = document.getElementById("checkout-empty");
const content = document.getElementById("checkout-content");
const done = document.getElementById("checkout-done");

/* ---------- خلاصه‌ی سفارش (از سبد خرید) ---------- */
function renderSummary() {
  const items = window.Cart.items();
  emptyBox.classList.toggle("hidden", items.length > 0);
  content.classList.toggle("hidden", items.length === 0);
  summary.innerHTML = items
    .map(
      (it) => `
      <li class="flex gap-x-3 py-3 border-b border-bk-line last:border-0">
        <img src="${escapeHtml(it.image)}" alt="" class="w-14 h-14 object-cover bg-bk-bg border border-bk-line shrink-0" />
        <div class="min-w-0 flex-1">
          <p class="text-sm font-bold">${escapeHtml(it.title)}</p>
          <p class="text-[11px] text-bk-muted"><span class="ltr-text">${escapeHtml(it.spec || "")}</span> · ${formatPrice(it.qty)} عدد</p>
        </div>
        <p class="text-sm font-bold shrink-0">${formatPrice(it.price * it.qty)}</p>
      </li>`
    )
    .join("");
  totalEl.textContent = formatPrice(items.reduce((sum, it) => sum + it.price * it.qty, 0));
}
document.addEventListener("baiku:cart", renderSummary); // وقتی سبد از کشو عوض شد
document.getElementById("edit-cart").addEventListener("click", () => window.Cart.open());

/* ---------- اعتبارسنجی فرم ---------- */
// هر قاعده: [نام فیلد، تابع بررسی، پیام خطا]. ارقام فارسی قبل از بررسی به انگلیسی تبدیل می‌شوند.
const digits = (v) => toEnglishDigits(v).replace(/[\s-]/g, "");
const RULES = [
  ["fullName", (v) => v.trim().length >= 3, "نام و نام خانوادگی را کامل وارد کنید."],
  ["mobile", (v) => /^09\d{9}$/.test(digits(v)), "شماره‌ی همراه باید ۱۱ رقم و با ۰۹ شروع شود."],
  ["city", (v) => v.trim().length >= 2, "استان و شهر را وارد کنید."],
  ["postal", (v) => /^\d{10}$/.test(digits(v)), "کد پستی ۱۰ رقمی را وارد کنید."],
  ["address", (v) => v.trim().length >= 10, "نشانی را کامل‌تر بنویسید."],
];

function showError(name, message) {
  const field = form.elements[name];
  const err = form.querySelector(`[data-error="${name}"]`);
  field.setAttribute("aria-invalid", message ? "true" : "false");
  field.classList.toggle("border-bk-red", Boolean(message));
  err.textContent = message || "";
}

// بعد از هر تایپ، خطای همان فیلد پاک شود
form.addEventListener("input", (e) => e.target.name && showError(e.target.name, ""));

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let firstBad = null;
  for (const [name, isValid, message] of RULES) {
    const ok = isValid(form.elements[name].value);
    showError(name, ok ? "" : message);
    if (!ok && !firstBad) firstBad = form.elements[name];
  }
  if (firstBad) return firstBad.focus();
  if (!window.Cart.items().length) return;

  // «ثبت» نمایشی: فقط یک کد نمونه می‌سازیم و سبد را خالی می‌کنیم
  const code = "BKD-" + String(Math.floor(Math.random() * 900000) + 100000);
  document.getElementById("order-code").textContent = code;
  window.Cart.clear();
  content.classList.add("hidden");
  emptyBox.classList.add("hidden");
  done.classList.remove("hidden");
  window.scrollTo({ top: 0, behavior: "smooth" });
});

renderSummary();
