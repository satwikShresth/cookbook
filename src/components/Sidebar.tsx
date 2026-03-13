import { useRef, useState, useMemo } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
	Link as ChakraLink,
	Box,
	Flex,
	Text,
	TreeView,
	createTreeCollection,
	Highlight,
	useFilter,
	IconButton,
} from "@chakra-ui/react";
import { ColorModeButton } from "#/components/ui/color-mode";
import { Tooltip } from "#/components/ui/tooltip";
import { FontSizeToggle } from "#/components/FontSizeToggle";
import {
	useFontSize,
	UI_FONT_SIZE,
	LABEL_FONT_SIZE,
	useNav,
	useSearchQuery,
	useActiveTags,
} from "#/utils";
import type { CookbookSection } from "#/utils";
import { SearchBar } from "#/components/SearchBar";
import { LuGithub, LuChevronRight } from "react-icons/lu";

// ── Types ───────────────────────────────────────────────────────────────────

interface NavNode {
	id: string;
	name: string;
	slug?: string | null;
	tags?: string[];
	children?: NavNode[];
}

// ── Build tree collection from nav sections ──────────────────────────────────

function buildCollection(sections: CookbookSection[]) {
	const children: NavNode[] = sections.map((section) => {
		if (section.files.length === 0) {
			return { id: section.slug, name: section.name, slug: section.slug };
		}
		return {
			id: section.slug,
			name: section.name,
			children: section.files.map((f) => ({
				id: f.slug,
				name: f.name,
				slug: f.slug,
				tags: f.tags,
			})),
		};
	});

	return createTreeCollection<NavNode>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.name,
		rootNode: { id: "ROOT", name: "", children },
	});
}

// ── Section / file icons ────────────────────────────────────────────────────

const leafIcon = null;

// ── Truncation-aware tooltip ─────────────────────────────────────────────────

function useTruncated() {
	const ref = useRef<HTMLElement | null>(null);
	const [truncated, setTruncated] = useState(false);
	const check = () => {
		if (ref.current)
			setTruncated(ref.current.scrollWidth > ref.current.clientWidth);
	};
	return { ref, truncated, check };
}

// ── Branch item ──────────────────────────────────────────────────────────────

function BranchItem({
	node,
	nodeState,
	query,
	uiSize = "xs",
	onNavigate,
}: {
	node: NavNode;
	nodeState: { expanded: boolean };
	query: string;
	uiSize?: string;
	onNavigate?: () => void;
}) {
	const { ref, truncated, check } = useTruncated();

	return (
		<Tooltip
			content={node.name}
			disabled={!truncated}
			positioning={{ placement: "right" }}
			openDelay={300}
			showArrow
		>
			<TreeView.BranchControl
				cursor="pointer"
				_hover={{ color: "fg" }}
				px="0"
				py="1"
				mt="3"
				onMouseEnter={check}
				color="fg.subtle"
				transition="color 0.15s"
			>
				<LuChevronRight
					size={10}
					style={{
						flexShrink: 0,
						opacity: 0.5,
						transform: nodeState.expanded ? "rotate(90deg)" : "rotate(0deg)",
						transition: "transform 0.15s",
					}}
				/>
				<TreeView.BranchText
					ref={ref as React.Ref<HTMLElement>}
					fontSize={uiSize}
					fontWeight="600"
					textTransform="uppercase"
					letterSpacing="0.09em"
					truncate
					transition="font-size 0.15s ease"
				>
					{node.slug ? (
						<Link
							to="/$"
							params={{ _splat: node.slug }}
							onClick={(e) => {
								e.stopPropagation();
								onNavigate?.();
							}}
							style={{ flex: 1, minWidth: 0 }}
						>
							<Highlight
								ignoreCase
								query={[query]}
								styles={{
									bg: "yellow.muted",
									color: "yellow.fg",
									px: "0.5",
									borderRadius: "sm",
								}}
							>
								{node.name}
							</Highlight>
						</Link>
					) : (
						<Highlight
							ignoreCase
							query={[query]}
							styles={{
								bg: "yellow.muted",
								color: "yellow.fg",
								px: "0.5",
								borderRadius: "sm",
							}}
						>
							{node.name}
						</Highlight>
					)}
				</TreeView.BranchText>
			</TreeView.BranchControl>
		</Tooltip>
	);
}

// ── Leaf item ────────────────────────────────────────────────────────────────

function LeafItem({
	node,
	currentSlug,
	query,
	uiSize,
	onNavigate,
}: {
	node: NavNode;
	currentSlug: string;
	query: string;
	uiSize: string;
	onNavigate?: () => void;
}) {
	const { ref, truncated, check } = useTruncated();
	const isActive = currentSlug === node.slug;

	return (
		<Tooltip
			content={truncated ? node.name : undefined}
			disabled={!truncated}
			positioning={{ placement: "right" }}
			openDelay={300}
			showArrow
		>
			<TreeView.Item asChild>
				<Link
					to="/$"
					params={{ _splat: node.slug ?? node.id }}
					onClick={() => onNavigate?.()}
					onMouseEnter={check}
				>
					{leafIcon}
					<TreeView.ItemText
						ref={ref as React.Ref<HTMLElement>}
						fontSize={uiSize}
						fontWeight={isActive ? "500" : "400"}
						fontFamily={isActive ? "inherit" : "inherit"}
						color={isActive ? "fg" : "fg.muted"}
						truncate
						transition="color 0.15s ease, font-size 0.15s ease"
						_hover={{ color: "fg" }}
						pl="0"
					>
						<Highlight
							ignoreCase
							query={[query]}
							styles={{
								bg: "yellow.muted",
								color: "yellow.fg",
								px: "0.5",
								borderRadius: "sm",
								fontWeight: "600",
							}}
						>
							{node.name}
						</Highlight>
					</TreeView.ItemText>
				</Link>
			</TreeView.Item>
		</Tooltip>
	);
}

// ── Nav tree ────────────────────────────────────────────────────────────────

function NavTree({
	currentSlug,
	onNavigate,
}: {
	currentSlug: string;
	onNavigate?: () => void;
}) {
	const { size } = useFontSize();
	const uiSize = UI_FONT_SIZE[size];
	const labelSize = LABEL_FONT_SIZE[size];
	const { contains } = useFilter({ sensitivity: "base" });
	const { sections } = useNav();

	// Read search state from the store
	const rawQuery = useSearchQuery();
	// '#foo' is tag-mode input — treat text query as empty in that case
	const textQuery = rawQuery.startsWith("#") ? "" : rawQuery;
	const activeTags = useActiveTags();

	const baseCollection = useMemo(() => buildCollection(sections), [sections]);

	const allTags = useMemo(() => {
		const tagSet = new Set<string>();
		for (const section of sections) {
			for (const file of section.files) {
				for (const tag of file.tags) {
					if (tag !== "index") tagSet.add(tag);
				}
			}
		}
		return Array.from(tagSet).sort();
	}, [sections]);

	const defaultExpanded = useMemo(
		() =>
			baseCollection.rootNode.children
				?.filter(
					(s) =>
						s.children?.some((f) => f.slug === currentSlug) ||
						s.slug === currentSlug,
				)
				.map((s) => s.id) ?? [],
		[baseCollection, currentSlug],
	);

	const [expanded, setExpanded] = useState<string[]>(defaultExpanded);

	const isFiltering = textQuery.length > 0 || activeTags.length > 0;

	const collection = useMemo(() => {
		if (!isFiltering) return baseCollection;

		return baseCollection.filter((node) => {
			const matchesText = !textQuery || contains(node.name, textQuery);
			const matchesTags =
				activeTags.length === 0 ||
				(node.tags
					? activeTags.every((t: any) => node.tags!.includes(t))
					: false);
			return matchesText && matchesTags;
		});
	}, [baseCollection, textQuery, activeTags, isFiltering, contains]);

	// When filtering: auto-expand all matched branches.
	// When not filtering: use the user's manual expansion state.
	const displayExpanded = isFiltering ? collection.getBranchValues() : expanded;

	return (
		<>
			<SearchBar allTags={allTags} />
			<Box mt={1}>
				<TreeView.Root
					collection={collection}
					animateContent
					size="sm"
					expandedValue={displayExpanded}
					onExpandedChange={(d) => setExpanded(d.expandedValue)}
				>
					<TreeView.Tree>
						<TreeView.Node<NavNode>
							render={({ node, nodeState }) => {
								if (nodeState.isBranch) {
									return (
										<BranchItem
											node={node}
											nodeState={nodeState}
											query={textQuery}
											uiSize={labelSize}
											onNavigate={onNavigate}
										/>
									);
								}
								return (
									<LeafItem
										node={node}
										currentSlug={currentSlug}
										query={textQuery}
										uiSize={uiSize}
										onNavigate={onNavigate}
									/>
								);
							}}
						/>
					</TreeView.Tree>
				</TreeView.Root>
			</Box>
		</>
	);
}

// ── Shared nav tree ─────────────────────────────────────────────────────────

export function SidebarContent({
	currentSlug,
	onNavigate,
}: {
	currentSlug: string;
	onNavigate?: () => void;
}) {
	return (
		<Box
			flex="1"
			overflowY="auto"
			px="5"
			pb="6"
			css={{
				scrollbarWidth: "none",
				"&::-webkit-scrollbar": { display: "none" },
			}}
		>
			<NavTree currentSlug={currentSlug} onNavigate={onNavigate} />
		</Box>
	);
}

// ── Desktop sidebar wrapper ─────────────────────────────────────────────────

export function Sidebar() {
	const routerState = useRouterState();
	const currentSlug = routerState.location.pathname.replace(/^\//, "");

	return (
		<Flex direction="column" h="100vh" overflow="hidden">
			{/* Site title */}
			<Box px="5" pt="7" pb="5" flexShrink={0}>
				<Link to="/">
					<Text
						fontFamily="heading"
						fontWeight="500"
						fontSize="xl"
						letterSpacing="-0.01em"
						lineHeight="1.25"
						color="fg"
						_hover={{ color: "fg.muted" }}
						transition="color 0.15s"
					>
						Yankele's Cookbook
					</Text>
				</Link>

				{/* Controls row */}
				<Flex align="center" gap="0" mt="2" ml="-1.5">
					<ChakraLink
						href="https://github.com/satwikShresth/cookbook"
						target="_blank"
						rel="noreferrer"
					>
						<IconButton
							size="xs"
							variant="ghost"
							color="fg.subtle"
							_hover={{ color: "fg" }}
						>
							<LuGithub />
						</IconButton>
					</ChakraLink>
					<ColorModeButton size="xs" variant="ghost" color="fg.subtle" />
					<FontSizeToggle size="xs" />
				</Flex>
			</Box>

			<SidebarContent currentSlug={currentSlug} />
		</Flex>
	);
}
