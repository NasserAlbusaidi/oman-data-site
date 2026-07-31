import { expect, test } from "vitest";
import { LOCALES, UI, dirFor, t } from "./ui";

test("every key exists in every locale and is non-empty", () => {
  const keys = Object.keys(UI.en) as (keyof typeof UI.en)[];
  for (const locale of LOCALES) {
    for (const key of keys) {
      expect(UI[locale][key].trim().length, `${locale}.${key}`).toBeGreaterThan(0);
    }
  }
});

test("direction", () => {
  expect(dirFor("ar")).toBe("rtl");
  expect(dirFor("en")).toBe("ltr");
  expect(t("ar", "site_title")).toContain("عُمان");
});
