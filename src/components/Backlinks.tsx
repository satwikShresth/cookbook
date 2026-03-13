import { Link } from "@tanstack/react-router";
import { Box, Text } from "@chakra-ui/react";
import {
	useBacklinks,
	useNav,
	useFontSize,
	UI_FONT_SIZE,
	LABEL_FONT_SIZE,
} from "#/utils";

type Props = {
	slug: string;
};

export function Backlinks({ slug }: Props) {
	const { size } = useFontSize();
	const uiSize = UI_FONT_SIZE[size];
	const labelSize = LABEL_FONT_SIZE[size];
	const backlinkSlugs = useBacklinks(slug);
	const nav = useNav();

	if (!backlinkSlugs.length) return null;

	const allFiles = nav.sections.flatMap((s) => s.files);
	const backlinkFiles = backlinkSlugs
		.map((s) => allFiles.find((f) => f.slug === s))
		.filter(Boolean) as typeof allFiles;

	return (
		<Box>
			<Text
				fontSize={labelSize}
				fontWeight="600"
				textTransform="uppercase"
				letterSpacing="0.08em"
				color="fg.subtle"
				mb="2.5"
				transition="font-size 0.15s ease"
			>
				Backlinks
			</Text>
			<Box display="flex" flexWrap="wrap" gap="1.5">
				{backlinkFiles.map((f) => (
					<Link key={f.slug} to="/$" params={{ _splat: f.slug }}>
						<Box
							as="span"
							display="inline-flex"
							alignItems="center"
							fontSize={uiSize}
							fontWeight="500"
							px="2.5"
							py="1"
							borderRadius="md"
							bg="bg.emphasized"
							color="fg.muted"
							cursor="pointer"
							transition="all 0.15s ease"
							_hover={{ bg: "bg.muted", color: "fg" }}
						>
							<Box as="span" color="fg.subtle" mr="1">
								←
							</Box>
							{f.name}
						</Box>
					</Link>
				))}
			</Box>
		</Box>
	);
}
