export type Locale = "ar" | "en";
export const LOCALES: Locale[] = ["ar", "en"];

const en = {
  site_title: "Oman Data",
  tagline: "The unofficial developer layer for Oman's open data",
  nav_datasets: "Datasets",
  nav_about: "How it works",
  lang_switch: "العربية",
  updated: "Data through",
  fresh: "Fresh",
  stale: "Stale",
  cadence_static: "Reference",
  cadence_monthly: "Monthly",
  cadence_annual: "Annual",
  rows: "rows",
  schema: "Schema",
  col_name: "Column",
  col_dtype: "Type",
  // The API publishes schema validation bounds, not observed min/max — labelling
  // these "Range" told readers Oman's population was "1 – 5,000,000".
  col_range: "Valid range",
  latest_rows: "Latest rows",
  source: "Official source",
  license: "Data license",
  notes: "Source notes",
  downloads: "Downloads",
  dl_csv: "CSV",
  dl_parquet: "Parquet",
  dl_changelog: "Changelog & raw snapshots",
  api_use: "Use the API",
  footer_disclaimer:
    "Independent project. Not affiliated with any government entity. Code MIT; data per each official source's license.",
  footer_github: "Source on GitHub",
} as const;

const ar: Record<keyof typeof en, string> = {
  site_title: "بيانات عُمان",
  tagline: "الطبقة التطويرية غير الرسمية لبيانات عُمان المفتوحة",
  nav_datasets: "مجموعات البيانات",
  nav_about: "كيف يعمل",
  lang_switch: "English",
  updated: "البيانات حتى",
  fresh: "محدَّث",
  stale: "متقادم",
  cadence_static: "مرجعي",
  cadence_monthly: "شهري",
  cadence_annual: "سنوي",
  rows: "صفًا",
  schema: "بنية الجدول",
  col_name: "العمود",
  col_dtype: "النوع",
  col_range: "المدى المقبول",
  latest_rows: "أحدث الصفوف",
  source: "المصدر الرسمي",
  license: "رخصة البيانات",
  notes: "ملاحظات المصدر",
  downloads: "التنزيلات",
  dl_csv: "CSV",
  dl_parquet: "Parquet",
  dl_changelog: "سجل التغييرات واللقطات الخام",
  api_use: "استخدم الواجهة البرمجية",
  footer_disclaimer:
    "مشروع مستقل، غير تابع لأي جهة حكومية. الشيفرة برخصة MIT؛ البيانات وفق رخصة كل مصدر رسمي.",
  footer_github: "المصدر على GitHub",
};

export const UI = { en, ar } as const;
export type UIKey = keyof typeof en;

export function t(locale: Locale, key: UIKey): string {
  return UI[locale][key];
}

export function dirFor(locale: Locale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}
