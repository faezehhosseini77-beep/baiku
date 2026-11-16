// فقط برای صفحه‌ی اصلی (index.html)
import "./common.js"; // منو، جستجوی هدر، سبد خرید و ورود
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { productCard, attachCardEvents } from "./product-card.js";
import { initFinder } from "./finder.js";
import { initBrands } from "./brands.js";

/* ---------- نمایش پرفروش‌ها ---------- */
// محصولاتی که در فایل داده popular: true دارند
const allProducts = [...tires, ...oils];
const popular = allProducts.filter((p) => p.popular);
const grid = document.getElementById("popular-products");

function renderPopular() {
  grid.innerHTML = popular.map(productCard).join("");
}
renderPopular();

// دکمه‌های «افزودن به سبد» و قلب علاقه‌مندی
attachCardEvents(grid, allProducts, renderPopular);

/* ---------- یابنده‌ی محصول مناسب (تب‌ها و منوهای انتخابی) ---------- */
initFinder();

/* ---------- برندها (از روی داده‌ها ساخته می‌شود) ---------- */
initBrands();
