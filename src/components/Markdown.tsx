import parse, {
	type HTMLReactParserOptions,
	Element,
	domToReact,
} from "html-react-parser";
import type { DOMNode } from "html-react-parser";
import { Link } from "@tanstack/react-router";
import { Badge, Link as ChakraLink, Box, Checkbox } from "@chakra-ui/react";
import { Prose } from "#/components/ui/prose";
import { useFontSize } from "#/utils";

type MarkdownProps = {
	html: string;
};

export function Markdown({ html }: MarkdownProps) {
	const { size } = useFontSize();
	let firstH1Skipped = false;

	const options: HTMLReactParserOptions = {
		replace: (domNode: DOMNode) => {
			if (!(domNode instanceof Element)) return;

			if (domNode.name === "h1" && !firstH1Skipped) {
				firstH1Skipped = true;
				return <></>;
			}

			if (domNode.attribs["data-wikilink"]) {
				const slug = domNode.attribs["data-wikilink"];
				return (
					<Link to="/$" params={{ _splat: slug }}>
						<Badge
							variant="subtle"
							size="sm"
							colorPalette="teal"
							cursor="pointer"
							fontWeight="500"
							verticalAlign="middle"
							transition="all 0.15s ease"
							_hover={{ bg: "teal.muted" }}
						>
							<Box as="span" opacity={0.6}>
								#
							</Box>
							{domToReact(domNode.children as DOMNode[], options)}
						</Badge>
					</Link>
				);
			}

			if ("data-wikilink-broken" in domNode.attribs) {
				return (
					<Box
						as="span"
						opacity={0.45}
						cursor="not-allowed"
						textDecoration="line-through"
						fontSize="0.9em"
					>
						{domToReact(domNode.children as DOMNode[], options)}
					</Box>
				);
			}

			if (domNode.name === "input" && domNode.attribs.type === "checkbox") {
				const isChecked = "checked" in domNode.attribs;
				return (
					<Checkbox.Root
						readOnly
						checked={isChecked}
						display="inline-flex"
						verticalAlign="middle"
						me="2"
						colorPalette="teal"
						size="sm"
					>
						<Checkbox.HiddenInput />
						<Checkbox.Control />
					</Checkbox.Root>
				);
			}

			if (
				domNode.name === "a" &&
				domNode.attribs.href &&
				!domNode.attribs["data-wikilink"]
			) {
				const href = domNode.attribs.href;
				const isAnchor = href.startsWith("#");
				const isExternal =
					href.startsWith("http://") || href.startsWith("https://");
				if (isAnchor) return;
				if (isExternal) {
					return (
						<ChakraLink href={href} target="_blank" rel="noopener noreferrer">
							{domToReact(domNode.children as DOMNode[], options)}
						</ChakraLink>
					);
				}
				return (
					<ChakraLink asChild>
						<Link to="/$" params={{ _splat: href.replace(/^\//, "") }}>
							{domToReact(domNode.children as DOMNode[], options)}
						</Link>
					</ChakraLink>
				);
			}
		},
	};

	return (
		<Prose maxWidth="none" size={size}>
			{parse(html, options)}
		</Prose>
	);
}
