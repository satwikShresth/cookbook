import { Box, Flex } from "@chakra-ui/react";
import { Link, useRouterState } from "@tanstack/react-router";
import { LuX } from "react-icons/lu";
import { SidebarContent } from "#/components/Sidebar";

export function MobileDrawer({
	open,
	onClose,
}: {
	open: boolean;
	onClose: () => void;
}) {
	const routerState = useRouterState();
	const currentSlug = routerState.location.pathname.replace(/^\//, "");

	if (!open) return null;

	return (
		<>
			{/* Backdrop */}
			<Box
				position="fixed"
				inset={0}
				zIndex={60}
				bg="blackAlpha.600"
				onClick={onClose}
				display={{ base: "block", md: "none" }}
			/>
			{/* Drawer panel */}
			<Box
				position="fixed"
				top={0}
				left={0}
				bottom={0}
				zIndex={70}
				w="300px"
				bg="bg"
				borderRightWidth="1px"
				borderColor="border"
				display={{ base: "flex", md: "none" }}
				flexDirection="column"
				overflow="hidden"
			>
				<Flex
					px="4"
					pt="5"
					pb="3"
					align="center"
					justify="space-between"
					flexShrink={0}
				>
					<Link to="/" onClick={onClose}>
						<Box
							fontWeight="700"
							fontSize="md"
							letterSpacing="-0.02em"
							lineHeight="1.2"
						>
							Yankele's Cookbook
						</Box>
					</Link>
					<button
						onClick={onClose}
						aria-label="Close menu"
						style={{
							display: "flex",
							alignItems: "center",
							padding: "6px",
							borderRadius: "6px",
							background: "none",
							border: "none",
							cursor: "pointer",
							color: "inherit",
							opacity: 0.7,
						}}
					>
						<LuX size={18} />
					</button>
				</Flex>
				<Box flex="1" overflow="hidden">
					<SidebarContent currentSlug={currentSlug} onNavigate={onClose} />
				</Box>
			</Box>
		</>
	);
}
