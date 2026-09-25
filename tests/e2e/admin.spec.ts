import {expect, test} from "@playwright/test";

test("serves the Sveltia CMS editor and its config", async ({request}) => {
	const page = await request.get("/admin/");
	expect(page.status()).toBe(200);
	expect(await page.text()).toContain("@sveltia/cms");

	const config = await request.get("/admin/config.yml");
	expect(config.status()).toBe(200);
	expect(await config.text()).toContain("repo: motlin/janesterlis.com");
});
