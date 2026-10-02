import { test, expect } from "@playwright/test";

test("User can generate and view a Wordle activity", async ({ page }) => {
  await page.goto("/wordle");

  await expect(
    page.getByRole("heading", { name: "Phoneme Wordle", level: 1 })
  ).toBeVisible();

  const generationRequest = page.waitForRequest(
    (request) =>
      request.url().includes("/api/usage-events") &&
      request.method() === "POST" &&
      request.postData()?.includes("GENERATION_SUCCESS")
  );

  const generationResponse = page.waitForResponse(
    (response) =>
      response.url().includes("/api/usage-events") &&
      response.request().method() === "POST"
  );

  await page.getByRole("button", { name: "Generate HTML" }).click();

  const request = await generationRequest;
  const response = await generationResponse;

  expect(request.postData()).toContain("GENERATION_SUCCESS");
  expect(response.status()).toBe(201);
});