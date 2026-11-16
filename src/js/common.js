/*
  common.js — کارهای مشترک همه‌ی صفحه‌ها: منوی موبایل، جستجوی هوشمند هدر، سبد خرید و ورود
  هر صفحه‌ی جدید فقط باید این فایل را import کند (یا اسکریپت صفحه‌اش آن را import کند).
*/
import "./panels.js"; // سبد خرید و پنجره‌ی ورود (window.Cart را می‌سازد)
import "./store.js"; // شمارنده‌ی علاقه‌مندی و مقایسه در هدر
import { initSearch } from "./search.js"; // جستجوی هوشمند هدر

/* ---------- منوی موبایل ---------- */
const menuToggle = document.getElementById("menu-toggle");
const mobileMenu = document.getElementById("mobile-menu");
menuToggle.addEventListener("click", () => {
  const isOpen = mobileMenu.classList.toggle("hidden") === false;
  menuToggle.setAttribute("aria-expanded", String(isOpen));
});
// با کلیک روی هر لینک منو بسته شود
mobileMenu.querySelectorAll("a").forEach((a) =>
  a.addEventListener("click", () => {
    mobileMenu.classList.add("hidden");
    menuToggle.setAttribute("aria-expanded", "false");
  })
);

/* ---------- نوار جستجوی هدر ---------- */
// باز و بسته شدن، پیشنهاد هنگام تایپ و رفتن به نتایج: همه در search.js
initSearch();
