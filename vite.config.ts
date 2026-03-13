import { defineConfig } from "vite";
import tanstackRouter from "@tanstack/router-plugin/vite";
import viteReact from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import contentCollections from "@content-collections/vite";

export default defineConfig({
	plugins: [
		contentCollections(),
		tanstackRouter({
			target: "react",
			autoCodeSplitting: true,
		}),
		tsconfigPaths({ projects: ["./tsconfig.json"] }),
		viteReact({
			babel: {
				plugins: ["babel-plugin-react-compiler"],
			},
		}),
	],
});
