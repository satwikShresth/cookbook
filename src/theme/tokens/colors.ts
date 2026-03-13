import { defineTokens } from "@chakra-ui/react";

export const colors = defineTokens.colors({
	transparent: {
		value: "transparent",
	},
	current: {
		value: "currentColor",
	},
	black: {
		value: "#0D0D12",
	},
	white: {
		value: "#FFFFFF",
	},
	whiteAlpha: {
		"50": {
			value: "rgba(255, 255, 255, 0.04)",
		},
		"100": {
			value: "rgba(255, 255, 255, 0.06)",
		},
		"200": {
			value: "rgba(255, 255, 255, 0.08)",
		},
		"300": {
			value: "rgba(255, 255, 255, 0.16)",
		},
		"400": {
			value: "rgba(255, 255, 255, 0.24)",
		},
		"500": {
			value: "rgba(255, 255, 255, 0.36)",
		},
		"600": {
			value: "rgba(255, 255, 255, 0.48)",
		},
		"700": {
			value: "rgba(255, 255, 255, 0.64)",
		},
		"800": {
			value: "rgba(255, 255, 255, 0.80)",
		},
		"900": {
			value: "rgba(255, 255, 255, 0.92)",
		},
		"950": {
			value: "rgba(255, 255, 255, 0.95)",
		},
	},
	blackAlpha: {
		"50": {
			value: "rgba(13, 13, 18, 0.04)",
		},
		"100": {
			value: "rgba(13, 13, 18, 0.06)",
		},
		"200": {
			value: "rgba(13, 13, 18, 0.08)",
		},
		"300": {
			value: "rgba(13, 13, 18, 0.16)",
		},
		"400": {
			value: "rgba(13, 13, 18, 0.24)",
		},
		"500": {
			value: "rgba(13, 13, 18, 0.36)",
		},
		"600": {
			value: "rgba(13, 13, 18, 0.48)",
		},
		"700": {
			value: "rgba(13, 13, 18, 0.64)",
		},
		"800": {
			value: "rgba(13, 13, 18, 0.80)",
		},
		"900": {
			value: "rgba(13, 13, 18, 0.92)",
		},
		"950": {
			value: "rgba(13, 13, 18, 0.95)",
		},
	},
	// Clean neutral — no warm tint
	gray: {
		"50": {
			value: "#f9f9fb",
		},
		"100": {
			value: "#f0f0f5",
		},
		"200": {
			value: "#e2e2ec",
		},
		"300": {
			value: "#c8c8d8",
		},
		"400": {
			value: "#9898b0",
		},
		"500": {
			value: "#6e6e88",
		},
		"600": {
			value: "#515168",
		},
		"700": {
			value: "#3a3a4e",
		},
		"800": {
			value: "#252534",
		},
		"900": {
			value: "#16161f",
		},
		"950": {
			value: "#0d0d12",
		},
	},
	// Pomegranate — bold, jewel red
	red: {
		"50": {
			value: "#fff0f3",
		},
		"100": {
			value: "#ffd6de",
		},
		"200": {
			value: "#ffacbb",
		},
		"300": {
			value: "#ff7591",
		},
		"400": {
			value: "#f74068",
		},
		"500": {
			value: "#e01045",
		},
		"600": {
			value: "#b80036",
		},
		"700": {
			value: "#880029",
		},
		"800": {
			value: "#56001a",
		},
		"900": {
			value: "#33000f",
		},
		"950": {
			value: "#1e0009",
		},
	},
	// Burnt saffron — vivid, not yellow-muddy
	orange: {
		"50": {
			value: "#fff4ed",
		},
		"100": {
			value: "#ffe2cc",
		},
		"200": {
			value: "#ffc299",
		},
		"300": {
			value: "#ff9860",
		},
		"400": {
			value: "#ff6b2b",
		},
		"500": {
			value: "#f04800",
		},
		"600": {
			value: "#cc3800",
		},
		"700": {
			value: "#9a2900",
		},
		"800": {
			value: "#651b00",
		},
		"900": {
			value: "#3b1000",
		},
		"950": {
			value: "#220900",
		},
	},
	// Marigold — vivid festival yellow, not muddy turmeric
	yellow: {
		"50": {
			value: "#fffbea",
		},
		"100": {
			value: "#fff3c0",
		},
		"200": {
			value: "#ffe880",
		},
		"300": {
			value: "#ffd633",
		},
		"400": {
			value: "#ffc400",
		},
		"500": {
			value: "#e6a800",
		},
		"600": {
			value: "#c48600",
		},
		"700": {
			value: "#8f6000",
		},
		"800": {
			value: "#5a3c00",
		},
		"900": {
			value: "#332200",
		},
		"950": {
			value: "#1e1400",
		},
	},
	// Emerald — lush, jewel green
	green: {
		"50": {
			value: "#edfff6",
		},
		"100": {
			value: "#ccfce7",
		},
		"200": {
			value: "#96f8cc",
		},
		"300": {
			value: "#52edaa",
		},
		"400": {
			value: "#18d986",
		},
		"500": {
			value: "#00b86a",
		},
		"600": {
			value: "#009453",
		},
		"700": {
			value: "#00693b",
		},
		"800": {
			value: "#004426",
		},
		"900": {
			value: "#002817",
		},
		"950": {
			value: "#00180d",
		},
	},
	// Peacock teal — the crown jewel of Indian-Jewish color
	teal: {
		"50": {
			value: "#e8fffe",
		},
		"100": {
			value: "#b8faf8",
		},
		"200": {
			value: "#72f3ef",
		},
		"300": {
			value: "#22e4de",
		},
		"400": {
			value: "#00cac4",
		},
		"500": {
			value: "#00a8a2",
		},
		"600": {
			value: "#008480",
		},
		"700": {
			value: "#005e5a",
		},
		"800": {
			value: "#003c3a",
		},
		"900": {
			value: "#002422",
		},
		"950": {
			value: "#001614",
		},
	},
	// Sapphire — Star of David, Israeli sky
	blue: {
		"50": {
			value: "#edf4ff",
		},
		"100": {
			value: "#cfe1ff",
		},
		"200": {
			value: "#a0c4ff",
		},
		"300": {
			value: "#60a1ff",
		},
		"400": {
			value: "#2878ff",
		},
		"500": {
			value: "#0057f5",
		},
		"600": {
			value: "#0042cc",
		},
		"700": {
			value: "#002f99",
		},
		"800": {
			value: "#001e64",
		},
		"900": {
			value: "#00113a",
		},
		"950": {
			value: "#000a22",
		},
	},
	// Cerulean — Mediterranean sea
	cyan: {
		"50": {
			value: "#eafaff",
		},
		"100": {
			value: "#c5f2ff",
		},
		"200": {
			value: "#86e6ff",
		},
		"300": {
			value: "#33d3ff",
		},
		"400": {
			value: "#00bcf2",
		},
		"500": {
			value: "#009ccc",
		},
		"600": {
			value: "#007aa8",
		},
		"700": {
			value: "#005578",
		},
		"800": {
			value: "#00374e",
		},
		"900": {
			value: "#002130",
		},
		"950": {
			value: "#00131c",
		},
	},
	// Amethyst — Indian royalty, Purim costume purple
	purple: {
		"50": {
			value: "#faf0ff",
		},
		"100": {
			value: "#f2d4ff",
		},
		"200": {
			value: "#e4a8ff",
		},
		"300": {
			value: "#d06eff",
		},
		"400": {
			value: "#ba30ff",
		},
		"500": {
			value: "#9e00f0",
		},
		"600": {
			value: "#7c00c4",
		},
		"700": {
			value: "#590090",
		},
		"800": {
			value: "#38005c",
		},
		"900": {
			value: "#210036",
		},
		"950": {
			value: "#130020",
		},
	},
	// Magenta — Indian festival ink, vivid and alive
	pink: {
		"50": {
			value: "#fff0fb",
		},
		"100": {
			value: "#ffd4f5",
		},
		"200": {
			value: "#ffa8ec",
		},
		"300": {
			value: "#ff6cdf",
		},
		"400": {
			value: "#f030ca",
		},
		"500": {
			value: "#cc00aa",
		},
		"600": {
			value: "#a30088",
		},
		"700": {
			value: "#750062",
		},
		"800": {
			value: "#4a003e",
		},
		"900": {
			value: "#2b0024",
		},
		"950": {
			value: "#190015",
		},
	},
});
