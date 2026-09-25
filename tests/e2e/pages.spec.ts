import {expect, test} from "@playwright/test";

const pages = [
	{path: "/", heading: "Jan Esterlis"},
	{path: "/bio/", heading: "Biography"},
	{path: "/collection/", heading: "The Collection"},
	{path: "/collection/1961-gibson-sg/", heading: "1961 Gibson SG"},
	{path: "/gear/", heading: "Gear"},
	{path: "/gallery/", heading: "Friends & Gallery"},
	{path: "/listen/", heading: "Listen"},
	{path: "/videos/", heading: "Videos"},
	{path: "/tabs/", heading: "Tabs"},
	{path: "/tabs/twelve-bar-shuffle-in-a/", heading: "Twelve-Bar Shuffle in A"},
	{path: "/links/", heading: "Links"},
];

for (const {path, heading} of pages) {
	test.describe(path, () => {
		test("renders its heading and title without errors", async ({page}) => {
			const errors: string[] = [];
			page.on("pageerror", (error) => errors.push(error.message));
			page.on("console", (message) => {
				if (message.type() === "error") {
					errors.push(message.text());
				}
			});

			const response = await page.goto(path);

			expect(response?.status()).toBe(200);
			await expect(page.getByRole("heading", {level: 1})).toHaveText(heading);
			await expect(page).toHaveTitle(/Jan Esterlis/);
			expect(errors).toStrictEqual([]);
		});

		test("loads every image", async ({page}) => {
			await page.goto(path);
			const visible = page.locator("main img:visible");
			for (const image of await visible.all()) {
				await image.scrollIntoViewIfNeeded();
				await expect(image).toHaveJSProperty("complete", true);
			}
			const broken = await visible.evaluateAll((images) =>
				images
					.filter((image) => image instanceof HTMLImageElement && image.naturalWidth === 0)
					.map((image) => image.getAttribute("src")),
			);
			expect(broken).toStrictEqual([]);
		});

		test("does not scroll horizontally", async ({page}) => {
			await page.goto(path);
			const overflow = await page.evaluate(
				() => document.documentElement.scrollWidth - document.documentElement.clientWidth,
			);
			expect(overflow).toBe(0);
		});
	});
}
