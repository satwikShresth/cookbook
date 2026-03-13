import { Store } from "@tanstack/store";
import { useStore } from "@tanstack/react-store";

// ── State ────────────────────────────────────────────────────────────────────

export interface SearchState {
	query: string;
	activeTags: string[];
}

export const searchStore = new Store<SearchState>({
	query: "",
	activeTags: [],
});

// ── Actions ──────────────────────────────────────────────────────────────────

export function setQuery(query: string) {
	searchStore.setState((s) => ({ ...s, query }));
}

export function addTag(tag: string) {
	searchStore.setState((s) => ({
		...s,
		activeTags: s.activeTags.includes(tag)
			? s.activeTags
			: [...s.activeTags, tag],
	}));
}

export function removeTag(tag: string) {
	searchStore.setState((s) => ({
		...s,
		activeTags: s.activeTags.filter((t) => t !== tag),
	}));
}

export function clearSearch() {
	searchStore.setState(() => ({ query: "", activeTags: [] }));
}

// ── Hooks ────────────────────────────────────────────────────────────────────

export function useSearchQuery() {
	return useStore(searchStore, (s) => s.query);
}

export function useActiveTags() {
	return useStore(searchStore, (s) => s.activeTags);
}
