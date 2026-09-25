import {expect, test} from "@playwright/test";

test("uses the dark stage design with no look picker", async ({page}) => {
	await page.goto("/");
	await expect(page.getByRole("group", {name: "Choose a look"})).toHaveCount(0);
	expect(await page.evaluate(() => getComputedStyle(document.body).backgroundColor)).toBe("rgb(12, 9, 8)");
	await expect(page.getByRole("img", {name: "Jan on stage with a white Stratocaster"})).toBeVisible();
});
