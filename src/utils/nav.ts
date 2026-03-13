import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";
import { allCookbooks } from "content-collections";
import type { Cookbook } from "content-collections";

export type { Cookbook };

// ── Types ──────────────────────────────────────────────────────────────────

export interface CookbookFile {
	slug: string;
	name: string;
	tags: string[];
}

export interface CookbookSection {
	slug: string;
	name: string;
	files: CookbookFile[];
}

export interface NavState {
	sections: CookbookSection[];
	backlinks: Record<string, string[]>;
	edges: { source: string; target: string }[];
	fileMap: Record<string, Cookbook>;
}

// ── Build nav state ──────────────────────────────────────────────────────────

function buildNavState(): NavState {
	const backlinks: Record<string, string[]> = {};
	const edges: { source: string; target: string }[] = [];
	const fileMap: Record<string, Cookbook> = {};

	for (const doc of allCookbooks) {
		fileMap[doc.slug] = doc;
		for (const targetSlug of doc.resolvedLinks) {
			(backlinks[targetSlug] ??= []).push(doc.slug);
			edges.push({ source: doc.slug, target: targetSlug });
		}
	}

	const sectionMap = new Map<string, CookbookSection>();

	for (const doc of allCookbooks) {
		if (doc.isIndex) continue;

		const sectionName = doc.section;
		const topSlug = doc.slug.split("/")[0];

		if (!sectionMap.has(sectionName)) {
			sectionMap.set(sectionName, {
				slug: topSlug,
				name: sectionName,
				files: [],
			});
		}

		sectionMap.get(sectionName)!.files.push({
			slug: doc.slug,
			name: doc.name,
			tags: doc.tags ?? [],
		});
	}

	const sections = Array.from(sectionMap.values()).filter(
		(s) => s.name !== "Overview" || s.files.length > 0,
	);

	return { sections, backlinks, edges, fileMap };
}

// ── Store — initialised once at module load time ─────────────────────────────

export const navStore = new Store<NavState>(buildNavState());

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useNav(): NavState {
	return useStore(navStore, (s) => s);
}

export function useNavSection(selector: (s: NavState) => NavState["sections"]) {
	return useStore(navStore, selector);
}

export function useBacklinks(slug: string) {
	return useStore(navStore, (s) => s.backlinks[slug] ?? []);
}

export function useEdges() {
	return useStore(navStore, (s) => s.edges);
}

export function useFileBySlug(slug: string): Cookbook | undefined {
	return useStore(navStore, (s) => s.fileMap[slug]);
}

// ── Imperative helpers (for loaders / non-hook contexts) ─────────────────────

export function getCookbookFileBySlug(slug: string): Cookbook | undefined {
	return navStore.state.fileMap[slug];
}

/** @deprecated use useNav() hook instead */
export const cookbookNav = navStore.state;
