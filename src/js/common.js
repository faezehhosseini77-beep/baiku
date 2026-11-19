/*
  common.js — کارهای مشترک همه‌ی صفحه‌ها: منوی موبایل، جستجوی هوشمند هدر، سبد خرید و ورود
  هر صفحه‌ی جدید فقط باید این فایل را import کند (یا اسکریپت صفحه‌اش آن را import کند).
*/
import "./layout.js"; // هدر و فوتر مشترک (باید اول باشد تا بقیه به عناصرش دسترسی داشته باشند)
import "./panels.js"; // سبد خرید و پنجره‌ی ورود (window.Cart را می‌سازد)
import { initSearch } from "./search.js"; // جستجوی هوشمند هدر

/* ---------- منوی موبایل (کشوی راست) ---------- */
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
const mobileOverlay = document.getElementById("mobile-overlay");

function setMobileMenu(open) {
  mobileMenu.classList.toggle("translate-x-full", !open);
  mobileMenu.classList.toggle("invisible", !open);
  mobileOverlay.classList.toggle("opacity-0", !open);
  mobileOverlay.classList.toggle("invisible", !open);
  mobileMenu.setAttribute("aria-hidden", String(!open));
  menuToggle.setAttribute("aria-expanded", String(open));
  document.body.classList.toggle("panel-open", open);
}
menuToggle.addEventListener("click", () => setMobileMenu(menuToggle.getAttribute("aria-expanded") !== "true"));
mobileOverlay.addEventListener("click", () => setMobileMenu(false));
mobileMenu.querySelector("[data-mobile-close]").addEventListener("click", () => setMobileMenu(false));
mobileMenu.querySelectorAll("a").forEach((a) => a.addEventListener("click", () => setMobileMenu(false)));
document.addEventListener("keydown", (e) => e.key === "Escape" && setMobileMenu(false));
// اگر صفحه به اندازه‌ی دسکتاپ بزرگ شد، حالت باز را پاک کن
window.matchMedia("(min-width: 1024px)").addEventListener("change", (e) => e.matches && setMobileMenu(false));

/* ---------- نوار جستجوی هدر ---------- */
// باز و بسته شدن، پیشنهاد هنگام تایپ و رفتن به نتایج: همه در search.js
initSearch();
