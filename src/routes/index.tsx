import { createFileRoute } from "@tanstack/react-router";
import { Center, Heading, Text } from "@chakra-ui/react";
import { useFontSize } from "#/utils";

export const Route = createFileRoute("/")({
	component: IndexPage,
});

const HEADING_SIZE: Record<string, string> = {
	sm: "3xl",
	md: "4xl",
	lg: "5xl",
};

function IndexPage() {
	const { size } = useFontSize();

	return (
		<Center flexDirection="column" textAlign="center" py="20" gap="3">
			<Heading
				as="h1"
				fontSize={HEADING_SIZE[size]}
				fontWeight="500"
				transition="font-size 0.15s ease"
			>
				Yankele's Cookbook
			</Heading>
			<Text
				color="fg.muted"
				fontSize={size}
				maxW="sm"
				transition="font-size 0.15s ease"
			>
				A personal collection of recipes and techniques. Pick something from the
				sidebar.
			</Text>
		</Center>
	);
}
