// ابزارهای کوچکی که در چند فایل استفاده می‌شوند

// قیمت با جداکننده‌ی هزارگان و ارقام فارسی: 1250000 -> ۱٬۲۵۰٬۰۰۰
export const formatPrice = (n) => Number(n).toLocaleString("fa-IR");

// تبدیل ارقام فارسی و عربی به انگلیسی:
// "۹۰/۹۰-۱۷" -> "90/90-17"
export const toEnglishDigits = (text) =>
  String(text)
    .replace(/[۰-۹]/g, (d) => "۰۱۲۳۴۵۶۷۸۹".indexOf(d))
    .replace(/[٠-٩]/g, (d) => "٠١٢٣٤٥٦٧٨٩".indexOf(d));

// آماده‌سازی متن برای جستجو: ارقام انگلیسی، «ی» و «ک» فارسی، خط تیره‌های مختلف یکسان،
// حروف کوچک و فاصله‌ی اضافه حذف
export const normalizeText = (text) =>
  toEnglishDigits(text)
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[‐‑–—−]/g, "-")
    .toLowerCase()
    .replace(/\s+/g, " ")
    .trim();

// نسخه‌ی فشرده بدون فاصله و علامت‌ها، تا «10w40» با «10W-40» و «9090-17» با «90/90-17» جور شود
export const compactText = (text) => text.replace(/[\s\-/.]/g, "");

// جلوگیری از اجرای کد HTML داخل متن‌هایی که با innerHTML نمایش می‌دهیم
export const escapeHtml = (text) =>
  String(text).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
