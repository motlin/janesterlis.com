import {expect, test} from "@playwright/test";

test("defaults to the stage look", async ({page}) => {
	await page.goto("/");
	await expect(page.locator("html")).toHaveAttribute("data-look", "stage");
});

test("look picker switches the design and remembers it across pages", async ({page}) => {
	await page.goto("/");
	const picker = page.getByRole("group", {name: "Choose a look"});

	await picker.getByRole("button", {name: "Catalog"}).click();
	await expect(page.locator("html")).toHaveAttribute("data-look", "catalog");
	await expect(picker.getByRole("button", {name: "Catalog"})).toHaveAttribute("aria-pressed", "true");

	await page.goto("/gear/");
	await expect(page.locator("html")).toHaveAttribute("data-look", "catalog");
});

test("?look= in the URL selects a look for sharing", async ({page}) => {
	await page.goto("/bio/?look=gallery");
	await expect(page.locator("html")).toHaveAttribute("data-look", "gallery");
});

test("each look paints a different page background", async ({page}) => {
	const backgrounds = new Set<string>();
	for (const look of ["stage", "catalog", "gallery"]) {
		await page.goto(`/?look=${look}`);
		backgrounds.add(await page.evaluate(() => getComputedStyle(document.body).backgroundColor));
	}
	expect(backgrounds.size).toBe(3);
});
