import { Box, type BoxProps, type ElementProps, type MantineColor } from "@mantine/core"
import clsx from "clsx"

import { vars } from "@/lib/theme"

import { pageChrome } from "../PageChrome"
import * as classes from "./Section.css"

export type SectionVariant = "plain" | "panel"
export type SectionAccent = boolean | MantineColor

export interface SectionProps extends BoxProps, ElementProps<"section"> {
	fullHeight?: boolean
	variant?: SectionVariant
	accent?: SectionAccent
}

function resolveAccentColor(accent: Exclude<SectionAccent, false>) {
	if(accent === true) return vars.colors.primaryColors.filled

	const palette = vars.colors[accent]
	if(palette && typeof palette === "object" && "filled" in palette) {
		return palette.filled
	}

	return vars.colors.primaryColors.filled
}

export function Section({
	children,
	fullHeight = false,
	variant = "plain",
	accent,
	className,
	style,
	...props
}: SectionProps) {
	const isPanel = variant === "panel"
	const resolvedAccent: SectionAccent = accent === undefined ? false : accent
	const accentColor = isPanel && resolvedAccent !== false
		? resolveAccentColor(resolvedAccent)
		: undefined
	const showAccent = accentColor !== undefined

	return (
		<Box
			component="section"
			className={ clsx(
				{
					[pageChrome.panelSurface]: isPanel,
					[classes.root]: !isPanel,
					[classes.panel]: isPanel,
					[classes.accent]: showAccent,
					[classes.fullHeight]: fullHeight,
				},
				className,
			) }
			style={ accentColor
				? [style, { "--section-accent": accentColor }]
				: style }
			{ ...props }
		>
			{ children }
		</Box>
	)
}
