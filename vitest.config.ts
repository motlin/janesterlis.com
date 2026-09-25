import {defineConfig, mergeConfig} from "vite-plus";
import viteConfig from "./vite.config.ts";

export default mergeConfig(
	viteConfig,
	defineConfig({
		test: {
			globals: true,
			environment: "node",
			include: ["tests/unit/**/*.test.ts"],
		},
	}),
);
