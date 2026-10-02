import { test, expect } from "@playwright/test";

test("Wordle builder can create an activity", async ({ page }) => {
  await page.goto("/wordle");

  await expect(
    page.getByRole("heading", { name: "Phoneme Wordle", level: 1 })
  ).toBeVisible();

  await page.getByRole("button", { name: "Save Activity" }).click();

  await expect(
    page.getByText(/Activity saved successfully! ID:/)
  ).toBeVisible();
});