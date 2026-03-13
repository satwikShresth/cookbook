import { useRef, useMemo } from "react";
import {
	Combobox,
	Portal,
	Badge,
	Flex,
	Box,
	Text,
	useFilter,
	createListCollection,
	HStack,
} from "@chakra-ui/react";
import { useStore } from "@tanstack/react-store";
import { LuSearch, LuHash, LuX } from "react-icons/lu";
import { tagColor } from "#/utils/tags";
import {
	searchStore,
	setQuery,
	addTag,
	removeTag,
	clearSearch,
} from "#/utils/search";
import { useFontSize, UI_FONT_SIZE } from "#/utils/font-size";

// ── Types ────────────────────────────────────────────────────────────────────

interface SearchItem {
	label: string;
	value: string;
}

// ── Tag badge ────────────────────────────────────────────────────────────────

function ActiveTagBadge({ tag, uiSize }: { tag: string; uiSize: string }) {
	return (
		<Badge
			colorPalette={tagColor(tag)}
			variant="subtle"
			size="sm"
			display="inline-flex"
			alignItems="center"
			gap="1"
			cursor="pointer"
			userSelect="none"
			onClick={() => removeTag(tag)}
			_hover={{ opacity: 0.75, transform: "scale(0.97)" }}
			fontSize={uiSize}
		>
			<Text fontSize={uiSize}>
				<HStack>
					<LuHash />
					{tag}{" "}
				</HStack>
			</Text>
		</Badge>
	);
}

// ── SearchBar ────────────────────────────────────────────────────────────────

export function SearchBar({ allTags }: { allTags: string[] }) {
	const inputRef = useRef<HTMLInputElement>(null);
	const { size } = useFontSize();
	const uiSize = UI_FONT_SIZE[size];

	// Read the raw input value from the store — it may start with '#' while typing
	const inputValue = useStore(searchStore, (s) => s.query);
	const activeTags = useStore(searchStore, (s) => s.activeTags);

	const isTagMode = inputValue.startsWith("#");
	const tagQuery = isTagMode ? inputValue.slice(1) : "";

	const { contains } = useFilter({ sensitivity: "base" });

	const filteredItems = useMemo<SearchItem[]>(() => {
		const available = allTags
			.filter((t) => !activeTags.includes(t))
			.map((t) => ({ label: t, value: t }));
		if (!tagQuery) return available;
		return available.filter((item) => contains(item.label, tagQuery));
	}, [allTags, activeTags, tagQuery, contains]);

	const collection = useMemo(
		() =>
			createListCollection({
				items: filteredItems,
				itemToString: (item) => item.label,
				itemToValue: (item) => item.value,
			}),
		[filteredItems],
	);

	const handleInputChange = (details: Combobox.InputValueChangeDetails) => {
		const raw = details.inputValue;
		setQuery(raw);
	};

	const handleSelect = (details: Combobox.ValueChangeDetails) => {
		const selected = details.value[0];
		if (selected) addTag(selected);
		setQuery("");
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		clearSearch();
	};

	return (
		<Box fontSize={uiSize}>
			<Combobox.Root
				borderWidth="1px"
				borderColor="border.muted"
				borderRadius="md"
				_focusWithin={{
					borderColor: "colorPalette.500",
					shadow: "0 0 0 2px var(--chakra-colors-colorPalette-200)",
				}}
				transition="border-color 0.15s, box-shadow 0.15s"
				bg="bg.subtle"
				overflow="hidden"
				collection={collection}
				inputValue={inputValue}
				onInputValueChange={handleInputChange}
				onValueChange={handleSelect}
				value={[]}
				open={isTagMode && filteredItems.length > 0}
				selectionBehavior="clear"
				positioning={{ placement: "bottom-start", sameWidth: true, gutter: 4 }}
			>
				<Combobox.Control>
					<Flex
						align="center"
						gap="1.5"
						px="2.5"
						h="7"
						cursor="text"
						onClick={() => inputRef.current?.focus()}
					>
						{isTagMode ? (
							<LuHash size={12} style={{ flexShrink: 0, opacity: 0.5 }} />
						) : (
							<LuSearch size={12} style={{ flexShrink: 0, opacity: 0.4 }} />
						)}
						<Combobox.Input
							ref={inputRef}
							placeholder={isTagMode ? "Filter tags…" : "Search or # for tags…"}
							asChild
						>
							<input
								style={{
									flex: 1,
									minWidth: 0,
									background: "transparent",
									border: "none",
									outline: "none",
									fontSize: "inherit",
									letterSpacing: "0.01em",
									color: "inherit",
								}}
							/>
						</Combobox.Input>
						{(inputValue || activeTags.length > 0) && (
							<Box
								as="button"
								onClick={handleClear}
								display="flex"
								alignItems="center"
								opacity={0.35}
								_hover={{ opacity: 0.75 }}
								flexShrink={0}
								transition="opacity 0.15s"
								style={{
									background: "none",
									border: "none",
									cursor: "pointer",
									padding: 0,
									color: "inherit",
								}}
							>
								<LuX size={11} />
							</Box>
						)}
					</Flex>
				</Combobox.Control>

				<Portal>
					<Combobox.Positioner>
						<Combobox.Content
							fontSize={uiSize}
							minW="0"
							shadow="lg"
							borderColor="border.muted"
							borderRadius="md"
							overflow="hidden"
							bg="bg"
							py="1"
						>
							<Combobox.Empty px="3" py="2" fontSize={uiSize} color="fg.subtle">
								No tags found
							</Combobox.Empty>
							{collection.items.map((item) => (
								<Combobox.Item
									key={item.value}
									item={item}
									px="2.5"
									py="1.5"
									cursor="pointer"
									_highlighted={{ bg: "bg.muted" }}
									display="flex"
									alignItems="center"
									gap="1.5"
								>
									<Badge
										colorPalette={tagColor(item.label)}
										variant="subtle"
										size="xs"
										display="inline-flex"
										alignItems="center"
										gap="0.5"
										fontSize={uiSize}
									>
										<LuHash size={9} />
										{item.label}
									</Badge>
								</Combobox.Item>
							))}
						</Combobox.Content>
					</Combobox.Positioner>
				</Portal>
			</Combobox.Root>

			{activeTags.length > 0 && (
				<Flex flexWrap="wrap" gap="1" my={2} borderColor="border.muted">
					{activeTags.map((tag) => (
						<ActiveTagBadge key={tag} tag={tag} uiSize={uiSize} />
					))}
				</Flex>
			)}
		</Box>
	);
}
