import { IconButton, Text } from "@chakra-ui/react";
import { Tooltip } from "#/components/ui/tooltip";
import { useFontSize } from "#/utils";

const ICON_FONT_SIZE: Record<string, string> = {
	sm: "0.65rem",
	md: "0.8rem",
	lg: "0.95rem",
};

export function FontSizeToggle({
	size = "xs",
}: {
	size?: "xs" | "sm" | "md" | "lg";
}) {
	const { cycle, size: currentSize, sizeLabel } = useFontSize();
	return (
		<Tooltip content={`Text size: ${sizeLabel}`} openDelay={300} showArrow>
			<IconButton
				size={size}
				variant="ghost"
				aria-label="Cycle text size"
				onClick={cycle}
			>
				<Text
					as="span"
					fontWeight="700"
					lineHeight="1"
					letterSpacing="-0.03em"
					fontSize={ICON_FONT_SIZE[currentSize]}
					userSelect="none"
					transition="font-size 0.15s ease"
					fontFamily="inherit"
				>
					Aa
				</Text>
			</IconButton>
		</Tooltip>
	);
}
