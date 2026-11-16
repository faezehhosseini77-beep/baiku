// فقط برای صفحه‌ی روغن موتور (oils.html)
import "./common.js"; // منو، جستجوی هدر، سبد خرید و ورود
import { oils } from "../data/oils.js";
import { initListing } from "./listing.js";
import { OIL_BASE } from "./product-card.js";

// فیلترهای روغن موتور (توضیح فیلدها در tires-page.js)
const groups = [
  { key: "oilType", label: "نوع (2T / 4T)", get: (p) => p.oilType, ltr: true },
  { key: "viscosity", label: "گرید ویسکوزیته", get: (p) => p.viscosity, ltr: true },
  { key: "api", label: "استاندارد API", get: (p) => p.api, ltr: true },
  { key: "jaso", label: "استاندارد JASO", get: (p) => p.jaso, ltr: true },
  { key: "base", label: "نوع پایه", get: (p) => p.base, format: (v) => OIL_BASE[v] },
  { key: "volume", label: "حجم", get: (p) => p.volume, ltr: true },
  { key: "brand", label: "برند", get: (p) => p.brand },
];

initListing({
  products: oils,
  groups,
  // متنی که جستجو روی آن انجام می‌شود: نام، برند، گرید، استانداردها و برچسب‌های فارسی
  searchText: (p) =>
    [p.name, p.brand, p.oilType, p.viscosity, p.api && `API ${p.api}`, p.jaso && `JASO ${p.jaso}`, OIL_BASE[p.base], p.volume, "روغن موتور"]
      .filter(Boolean)
      .join(" "),
});
