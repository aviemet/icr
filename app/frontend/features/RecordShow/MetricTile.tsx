import clsx from "clsx"

import { Box, Section, Title } from "@/components"
import { pageChrome } from "@/components/PageChrome"

import * as classes from "./MetricTile.css"

export type MetricTileTone = "default" | "alert" | "danger"

export interface MetricTileProps {
	title: string
	children: React.ReactNode
	tone?: MetricTileTone
	icon?: React.ReactNode
	className?: string
}

export function MetricTile({ title, children, tone = "default", icon, className }: MetricTileProps) {
	let accent: string | undefined
	let iconClass = pageChrome.iconBadge

	switch(tone) {
		case "alert":
			accent = "yellow"
			iconClass = classes.iconAlert
			break
		case "danger":
			accent = "red"
			iconClass = classes.iconAlert
			break
		case "default":
			iconClass = pageChrome.iconBadge
	}

	return (
		<Section
			variant="panel"
			accent={ accent }
			className={ clsx(classes.tile, className) }
		>
			<Box className={ clsx(classes.titleRow) }>
				{ icon && <span className={ clsx(iconClass) }>{ icon }</span> }
				<Title order={ 2 } size="sm" className={ clsx(classes.title) }>{ title }</Title>
			</Box>
			<Box className={ clsx(classes.body) }>{ children }</Box>
		</Section>
	)
}
