// @ts-check
import {satteri} from "@astrojs/markdown-satteri";
import {defineConfig} from "astro/config";
import {tabBlocks} from "./src/lib/tab-blocks.ts";

export default defineConfig({
	site: "https://janesterlis.com",
	trailingSlash: "always",
	markdown: {
		processor: satteri({mdastPlugins: [tabBlocks]}),
	},
});
