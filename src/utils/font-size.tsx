import { createContext, useContext, useState, useEffect } from "react";

export type FontSizeLevel = "sm" | "md" | "lg";

const SIZES: FontSizeLevel[] = ["sm", "md", "lg"];

export const SIZE_LABELS: Record<FontSizeLevel, string> = {
	sm: "Small",
	md: "Medium",
	lg: "Large",
};

// Prose body size passed to <Prose size={...}>
export const PROSE_SIZE: Record<FontSizeLevel, FontSizeLevel> = {
	sm: "sm",
	md: "md",
	lg: "lg",
};

// Sidebar / ToC / Backlinks UI text sizes
export const UI_FONT_SIZE: Record<FontSizeLevel, string> = {
	sm: "xs",
	md: "sm",
	lg: "md",
};

// Section label sizes (e.g. "On this page", "Backlinks")
export const LABEL_FONT_SIZE: Record<FontSizeLevel, string> = {
	sm: "2xs",
	md: "xs",
	lg: "sm",
};

const LS_KEY = "cookbook-font-size";

function readStorage(): FontSizeLevel {
	try {
		const v = localStorage.getItem(LS_KEY);
		if (v === "sm" || v === "md" || v === "lg") return v;
	} catch {}
	return "md";
}

interface FontSizeCtx {
	size: FontSizeLevel;
	cycle: () => void;
	sizeLabel: string;
}

const Ctx = createContext<FontSizeCtx>({
	size: "md",
	cycle: () => {},
	sizeLabel: SIZE_LABELS.md,
});

export function FontSizeProvider({ children }: { children: React.ReactNode }) {
	const [size, setSize] = useState<FontSizeLevel>(readStorage);

	useEffect(() => {
		try {
			localStorage.setItem(LS_KEY, size);
		} catch {}
	}, [size]);

	const cycle = () =>
		setSize((prev) => SIZES[(SIZES.indexOf(prev) + 1) % SIZES.length]);

	return (
		<Ctx.Provider value={{ size, cycle, sizeLabel: SIZE_LABELS[size] }}>
			{children}
		</Ctx.Provider>
	);
}

export function useFontSize() {
	return useContext(Ctx);
}
