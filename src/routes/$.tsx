import { createFileRoute, notFound, Link } from "@tanstack/react-router";
import { Box, Flex, Text, Separator, Badge } from "@chakra-ui/react";
import { useFontSize, UI_FONT_SIZE, navStore } from "#/utils";
import {
	BreadcrumbRoot,
	BreadcrumbLink,
	BreadcrumbCurrentLink,
} from "#/components/ui/breadcrumb";
import { getCookbookFileBySlug } from "#/utils";
import { Markdown } from "#/components/Markdown";
import { TableOfContents } from "#/components/TableOfContents";
import { Backlinks } from "#/components/Backlinks";
import { Graph } from "#/components/Graph";
import type { Cookbook } from "content-collections";

export const Route = createFileRoute("/$")({
	loader: ({ params }) => {
		const slug = params._splat ?? "";
		const fileContent = getCookbookFileBySlug(slug);
		if (!fileContent) throw notFound();
		return { fileContent, slug };
	},
	component: FilePage,
	notFoundComponent: () => (
		<Text fontSize="sm" color="fg.muted">
			Page not found.
		</Text>
	),
});

function SlugBreadcrumb({ slug }: { slug: string }) {
	const parts = slug.split("/");
	return (
		<BreadcrumbRoot size="lg">
			{parts.map((part, i) => {
				const isLast = i === parts.length - 1;
				const label = part.replace(/-/g, " ");
				const partSlug = parts.slice(0, i + 1).join("/");
				return isLast ? (
					<BreadcrumbCurrentLink key={partSlug} fontWeight="500">
						{label}
					</BreadcrumbCurrentLink>
				) : (
					<BreadcrumbLink key={partSlug} asChild>
						<Link to="/$" params={{ _splat: partSlug }}>
							{label}
						</Link>
					</BreadcrumbLink>
				);
			})}
		</BreadcrumbRoot>
	);
}

function RightSidebar({
	slug,
	headings,
}: {
	slug: string;
	headings: NonNullable<ReturnType<typeof getCookbookFileBySlug>>["headings"];
}) {
	return (
		<Flex direction="column" gap="5">
			<Graph slug={slug} />
			<Separator />
			<TableOfContents headings={headings} />
			<Separator />
			<Backlinks slug={slug} />
		</Flex>
	);
}

const H1_SIZE: Record<string, string> = {
	sm: "3xl",
	md: "4xl",
	lg: "5xl",
};

// ── Wikilink parser (display text + optional target) ─────────────────────────

function parseWikilink(value: string): {
	display: string;
	target: string | null;
} {
	const m = value.match(/^\[\[([^\]|#]+?)(?:#[^\]|]*)?(?:\|([^\]]+))?\]\]$/);
	if (!m) return { display: value, target: null };
	const rawTarget = m[1].trim();
	const display = m[2]?.trim() ?? rawTarget;
	const slug =
		navStore.state.fileMap[
			Object.keys(navStore.state.fileMap).find((k) => {
				const last = k.split("/").at(-1) ?? k;
				const targetLast = rawTarget.split("/").at(-1) ?? rawTarget;
				return (
					last.toLowerCase() === targetLast.replace(/\s/g, "-").toLowerCase()
				);
			}) ?? ""
		]?.slug ?? null;
	return { display, target: slug };
}

// ── Recipe meta bar ──────────────────────────────────────────────────────────

function RecipeMetaBar({ doc }: { doc: Cookbook }) {
	const { size } = useFontSize();
	const uiSize = UI_FONT_SIZE[size];

	const displayTags = doc.tags.filter((t) => t !== "recipe");
	const chefInfo = doc.chef ? parseWikilink(doc.chef) : null;

	// Build the single meta line: "cuisine · time · serves N · by chef"
	const metaParts: (string | React.ReactNode)[] = [];
	if (doc.cuisine) metaParts.push(doc.cuisine);
	if (doc.time) metaParts.push(doc.time);
	if (doc.servings) metaParts.push(`serves ${doc.servings}`);
	if (chefInfo) {
		metaParts.push(
			chefInfo.target ? (
				<Link key="chef" to="/$" params={{ _splat: chefInfo.target }}>
					<Text as="span" _hover={{ textDecoration: "underline" }}>
						{chefInfo.display}
					</Text>
				</Link>
			) : (
				chefInfo.display
			),
		);
	}

	const hasAnyMeta = metaParts.length > 0 || displayTags.length > 0;
	if (!hasAnyMeta) return null;

	return (
		<Box mb="5" display="flex" flexDirection="column" gap="2.5">
			{/* Single muted meta line */}
			{metaParts.length > 0 && (
				<Text
					fontSize={uiSize}
					color="fg.subtle"
					fontStyle="italic"
					transition="font-size 0.15s ease"
				>
					{metaParts.map((part, i) => (
						<span key={i}>
							{i > 0 && (
								<span style={{ margin: "0 0.35em", opacity: 0.5 }}>·</span>
							)}
							{part}
						</span>
					))}
				</Text>
			)}

			{/* Plain tag pills */}
			{displayTags.length > 0 && (
				<Flex gap="1.5" flexWrap="wrap">
					{displayTags.map((tag) => (
						<Badge
							key={tag}
							variant="outline"
							colorPalette="gray"
							textTransform="none"
							fontSize={uiSize}
							fontWeight="400"
							borderRadius="full"
							px="2.5"
							py="0.5"
							letterSpacing="0"
						>
							#{tag}
						</Badge>
					))}
				</Flex>
			)}
		</Box>
	);
}

function FilePage() {
	const { fileContent, slug } = Route.useLoaderData();
	const { size } = useFontSize();

	return (
		<Flex gap="16" align="flex-start" direction={{ base: "column", lg: "row" }}>
			{/* Article */}
			<Box as="article" minW={0} flex="1" w="100%">
				<Box mb="8">
					<SlugBreadcrumb slug={slug} />
					<Text
						as="h1"
						fontFamily="heading"
						fontSize={H1_SIZE[size]}
						fontWeight="700"
						letterSpacing="-0.01em"
						lineHeight="1.1"
						mt="2"
						mb="2"
					>
						{fileContent.name}
					</Text>
					<RecipeMetaBar doc={fileContent} />
				</Box>

				<Markdown html={fileContent.html} />

				{/* Right sidebar content — shown below article on mobile */}
				<Box
					display={{ base: "block", lg: "none" }}
					mt="10"
					pt="6"
					borderTopWidth="1px"
					borderColor="border"
				>
					<RightSidebar slug={slug} headings={fileContent.headings} />
				</Box>
			</Box>

			{/* Right sidebar — desktop only, sticky */}
			<Box
				as="aside"
				display={{ base: "none", lg: "block" }}
				w="220px"
				flexShrink={0}
				position="sticky"
				top="10"
				alignSelf="flex-start"
				maxH="calc(100vh - 5rem)"
				overflowY="auto"
				css={{
					scrollbarWidth: "none",
					"&::-webkit-scrollbar": { display: "none" },
				}}
			>
				<RightSidebar slug={slug} headings={fileContent.headings} />
			</Box>
		</Flex>
	);
}
