import {defineConfig, devices} from "@playwright/test";

const port = 4329;
const ci = (process.env["CI"] ?? "") !== "";

export default defineConfig({
	testDir: "tests/e2e",
	fullyParallel: true,
	forbidOnly: ci,
	reporter: ci ? "github" : "list",
	use: {
		baseURL: `http://localhost:${port}`,
	},
	projects: [
		{name: "desktop", use: {...devices["Desktop Chrome"]}},
		{name: "mobile", use: {...devices["Pixel 7"]}},
	],
	webServer: {
		// Drafts are built so the example tab can be tested; production builds hide them.
		command: `SHOW_DRAFTS=true pnpm build && pnpm preview --port ${port} --ignore-lock`,
		url: `http://localhost:${port}`,
		reuseExistingServer: !ci,
		timeout: 180_000,
	},
});
