import {expect, test} from "@playwright/test";

test("site navigation reaches every section", async ({page, isMobile}) => {
	await page.goto("/");
	const nav = page.getByRole("navigation", {name: "Main"});
	const sections = ["Biography", "Collection", "Gear", "Gallery", "Listen", "Videos", "TV Appearances", "Links"];

	const openMenu = async (): Promise<void> => {
		const menu = page.getByRole("button", {name: "Menu"});
		if (isMobile && (await menu.getAttribute("aria-expanded")) === "false") {
			await menu.click();
		}
	};

	for (const section of sections) {
		await openMenu();
		await nav.getByRole("link", {name: section, exact: true}).click();
		await expect(page.getByRole("heading", {level: 1})).toBeVisible();
		await openMenu();
		await expect(nav.getByRole("link", {name: section, exact: true})).toHaveAttribute("aria-current", "page");
	}
});

test("mobile menu starts closed and toggles open", async ({page, isMobile}) => {
	test.skip(!isMobile, "Menu button only appears on small screens");
	await page.goto("/");
	const menu = page.getByRole("button", {name: "Menu"});
	const link = page.getByRole("navigation", {name: "Main"}).getByRole("link", {name: "Gear"});

	await expect(menu).toHaveAttribute("aria-expanded", "false");
	await expect(link).toBeHidden();
	await menu.click();
	await expect(menu).toHaveAttribute("aria-expanded", "true");
	await expect(link).toBeVisible();
});

test("footer offers email contact", async ({page}) => {
	await page.goto("/");
	await expect(page.getByRole("contentinfo").getByRole("link", {name: /jan@janesterlis\.com/})).toHaveAttribute(
		"href",
		"mailto:jan@janesterlis.com",
	);
});
