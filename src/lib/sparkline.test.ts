import { expect, test } from "vitest";
import { sparkline } from "./sparkline";

test("maps first and last points to the padded corners", () => {
  const s = sparkline([0, 10], 100, 50, 5);
  expect(s.d).toBe("M5.0 45.0 L95.0 5.0");
  expect(s.lastX).toBe(95);
  expect(s.lastY).toBe(5);
  expect(s.min).toBe(0);
  expect(s.max).toBe(10);
});

test("flat series draws a midline, not the floor", () => {
  const s = sparkline([7, 7, 7], 100, 50, 5);
  expect(s.d).toBe("M5.0 25.0 L50.0 25.0 L95.0 25.0");
});

test("rejects fewer than two points", () => {
  expect(() => sparkline([1])).toThrow();
  expect(() => sparkline([])).toThrow();
});
