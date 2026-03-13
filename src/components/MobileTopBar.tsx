import { Box, Flex } from "@chakra-ui/react";
import { Link } from "@tanstack/react-router";
import { LuMenu } from "react-icons/lu";
import { ColorModeButton } from "#/components/ui/color-mode";
import { FontSizeToggle } from "#/components/FontSizeToggle";

export function MobileTopBar({ onOpen }: { onOpen: () => void }) {
	return (
		<Flex
			display={{ base: "flex", md: "none" }}
			position="sticky"
			top={0}
			zIndex={50}
			h="14"
			px="4"
			align="center"
			justify="space-between"
			borderBottomWidth="1px"
			borderColor="border"
			bg="bg"
		>
			<button
				onClick={onOpen}
				aria-label="Open menu"
				style={{
					display: "flex",
					alignItems: "center",
					padding: "6px",
					borderRadius: "6px",
					background: "none",
					border: "none",
					cursor: "pointer",
					color: "inherit",
				}}
			>
				<LuMenu size={20} />
			</button>
			<Link to="/">
				<Box fontSize="sm" fontWeight="700" letterSpacing="-0.02em">
					Yankele's Cookbook
				</Box>
			</Link>
			<Flex align="center" gap="0.5">
				<FontSizeToggle size="sm" />
				<ColorModeButton size="sm" variant="ghost" />
			</Flex>
		</Flex>
	);
}
