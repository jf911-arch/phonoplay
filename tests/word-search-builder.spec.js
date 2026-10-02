import { test, expect } from "@playwright/test";

test("Word Search builder can create an activity", async ({ page }) => {
  page.on("console", (msg) => {
    console.log("BROWSER:", msg.text());
  });

  await page.goto("/word-search");

  await expect(
    page.getByRole("heading", { name: "Phoneme Word Search", level: 1 })
  ).toBeVisible();

  await page.getByRole("button", { name: "Save Activity" }).click();

  await page.waitForTimeout(1000);

  console.log("PAGE TEXT:");
  console.log(await page.locator("body").innerText());

  await expect(
    page.getByText(/Activity saved successfully!/)
  ).toBeVisible();
});