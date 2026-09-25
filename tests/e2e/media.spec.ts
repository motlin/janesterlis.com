import {expect, test} from "@playwright/test";

test("collection lists the ten captioned guitars and links to each", async ({page}) => {
	await page.goto("/collection/");
	await expect(page.getByRole("list", {name: "Guitars"}).getByRole("listitem")).toHaveCount(10);

	await page.getByRole("link", {name: "1964 Fender Stratocaster, Olympic White"}).click();
	await expect(page.getByRole("heading", {level: 1})).toHaveText("1964 Fender Stratocaster, Olympic White");
});

test("gallery photos open in a lightbox that closes with Escape", async ({page}) => {
	await page.goto("/gallery/");
	await page.getByRole("button", {name: /Al Di Meola/}).click();

	const dialog = page.getByRole("dialog");
	await expect(dialog).toBeVisible();
	await expect(dialog.getByRole("img")).toHaveAttribute("alt", /Al Di Meola/);

	await page.keyboard.press("Escape");
	await expect(dialog).toBeHidden();
});

test("every recording on the listen page is playable", async ({page, request}) => {
	await page.goto("/listen/");
	const sources = await page
		.locator("audio")
		.evaluateAll((players) =>
			players.map((player) => (player instanceof HTMLAudioElement ? player.currentSrc || player.src : "")),
		);

	expect(sources.length).toBeGreaterThanOrEqual(2);
	for (const source of sources) {
		const response = await request.head(source);
		expect(response.status(), source).toBe(200);
	}
});

test("tab notation keeps its columns and scrolls inside its own box", async ({page}) => {
	await page.goto("/tabs/twelve-bar-shuffle-in-a/");
	const tab = page.locator("pre.tab").first();

	await expect(tab).toBeVisible();
	const style = await tab.evaluate((element) => {
		const computed = getComputedStyle(element);
		return {whiteSpace: computed.whiteSpace, overflowX: computed.overflowX};
	});
	expect(style).toStrictEqual({whiteSpace: "pre", overflowX: "auto"});
	await expect(page.getByText("Standard (E A D G B E)")).toBeVisible();
});
