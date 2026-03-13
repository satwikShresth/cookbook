import { useEffect, useRef, useState } from "react";
import { Box, Text, TreeView, createTreeCollection } from "@chakra-ui/react";
import type { MarkdownHeading } from "#/utils";
import { useFontSize, UI_FONT_SIZE, LABEL_FONT_SIZE } from "#/utils";

type Props = {
	headings: MarkdownHeading[];
};

type HeadingNode = {
	id: string;
	text: string;
	level: number;
	children?: HeadingNode[];
};

function buildTree(headings: MarkdownHeading[]): HeadingNode[] {
	const roots: HeadingNode[] = [];
	let currentH2: HeadingNode | null = null;

	for (const h of headings) {
		if (h.level === 2) {
			currentH2 = { ...h, children: [] };
			roots.push(currentH2);
		} else if (h.level === 3 && currentH2) {
			currentH2.children!.push({ ...h });
		}
	}

	// strip empty children arrays so nodeState.isBranch works correctly
	for (const node of roots) {
		if (node.children?.length === 0) delete node.children;
	}

	return roots;
}

export function TableOfContents({ headings }: Props) {
	const { size } = useFontSize();
	const uiSize = UI_FONT_SIZE[size];
	const labelSize = LABEL_FONT_SIZE[size];
	const [activeId, setActiveId] = useState<string>("");
	const observerRef = useRef<IntersectionObserver | null>(null);

	const filtered = headings.filter((h) => h.level <= 3);

	useEffect(() => {
		if (!filtered.length) return;
		observerRef.current?.disconnect();

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (entry.isIntersecting) {
						setActiveId(entry.target.id);
						break;
					}
				}
			},
			{ rootMargin: "0px 0px -80% 0px", threshold: 0 },
		);

		for (const h of filtered) {
			const el = document.getElementById(h.id);
			if (el) observer.observe(el);
		}

		observerRef.current = observer;
		return () => observer.disconnect();
	}, [headings]);

	if (!filtered.length) return null;

	const tree = buildTree(filtered);
	const expandedIds = tree.filter((n) => n.children).map((n) => n.id);

	const collection = createTreeCollection<HeadingNode>({
		nodeToValue: (node) => node.id,
		nodeToString: (node) => node.text,
		rootNode: { id: "__root__", text: "", level: 0, children: tree },
	});

	return (
		<Box>
			<Text
				fontSize={labelSize}
				fontWeight="600"
				mb="1"
				transition="font-size 0.15s ease"
			>
				On this page
			</Text>
			<TreeView.Root
				collection={collection}
				defaultExpandedValue={expandedIds}
				size="sm"
				animateContent
			>
				<TreeView.Tree>
					<TreeView.Node
						indentGuide={<TreeView.BranchIndentGuide />}
						render={({ node, nodeState }) =>
							nodeState.isBranch ? (
								<TreeView.BranchControl>
									<TreeView.BranchText
										asChild
										fontSize={uiSize}
										fontWeight={activeId === node.id ? "600" : "400"}
										color={activeId === node.id ? "fg" : "fg.muted"}
										_hover={{ color: "fg" }}
										transition="color 0.15s, font-size 0.15s ease"
									>
										<a href={`#${node.id}`}>{node.text}</a>
									</TreeView.BranchText>
								</TreeView.BranchControl>
							) : (
								<TreeView.Item asChild value={node.id}>
									<a href={`#${node.id}`}>
										<TreeView.ItemText
											fontSize={uiSize}
											fontWeight={activeId === node.id ? "500" : "400"}
											color={activeId === node.id ? "fg" : "fg.muted"}
											_hover={{ color: "fg" }}
											transition="color 0.15s, font-size 0.15s ease"
										>
											{node.text}
										</TreeView.ItemText>
									</a>
								</TreeView.Item>
							)
						}
					/>
				</TreeView.Tree>
			</TreeView.Root>
		</Box>
	);
}
