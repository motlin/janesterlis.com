import {expect, test} from "@playwright/test";

test("videos page lists the channel's uploads and links to the channel", async ({page}) => {
	await page.goto("/videos/");
	await expect(page.getByRole("list", {name: "Videos"}).getByRole("listitem")).not.toHaveCount(0);
	await expect(page.getByRole("link", {name: /YouTube channel/})).toHaveAttribute(
		"href",
		"https://www.youtube.com/@JanEsterlis",
	);
});

test("a video loads the privacy-enhanced player only when played", async ({page}) => {
	await page.goto("/videos/");
	await expect(page.locator("iframe")).toHaveCount(0);

	const first = page.getByRole("list", {name: "Videos"}).getByRole("listitem").first();
	await first.getByRole("button", {name: /^Play/}).click();

	await expect(first.locator("iframe")).toHaveAttribute(
		"src",
		/^https:\/\/www\.youtube-nocookie\.com\/embed\/[\w-]+\?autoplay=1/,
	);
});

test("home page features the latest video", async ({page}) => {
	await page.goto("/");
	await expect(page.getByRole("region", {name: "Latest video"}).getByRole("button", {name: /^Play/})).toBeVisible();
});
