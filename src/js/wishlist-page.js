// فقط برای صفحه‌ی علاقه‌مندی‌ها (wishlist.html)
import "./common.js";
import { tires } from "../data/tires.js";
import { oils } from "../data/oils.js";
import { productCard, attachCardEvents } from "./product-card.js";
import { wishlist } from "./store.js";

const all = [...tires, ...oils];
const grid = document.getElementById("wish-grid");
const empty = document.getElementById("wish-empty");
const count = document.getElementById("wish-count");

function render() {
  // ترتیب علاقه‌مندی‌ها همان ترتیبی است که اضافه شده‌اند؛ شناسه‌ی حذف‌شده از کاتالوگ نادیده گرفته می‌شود
  const list = wishlist.all().map((id) => all.find((p) => p.id === id)).filter(Boolean);
  grid.innerHTML = list.map(productCard).join("");
  grid.classList.toggle("hidden", list.length === 0);
  empty.classList.toggle("hidden", list.length > 0);
  count.textContent = list.length ? `${list.length.toLocaleString("fa-IR")} محصول` : "";
}

// با زدن قلب روی کارت، محصول از این صفحه حذف می‌شود (render دوباره صدا زده می‌شود)
attachCardEvents(grid, all, render);
render();
