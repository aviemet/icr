import clsx from "clsx"

import { Section } from "@/components"

import * as classes from "./MetricTile.css"

export type MetricTileTone = "default" | "alert" | "danger"

export interface MetricTileProps {
	title: string
	children: React.ReactNode
	tone?: MetricTileTone
	icon?: React.ReactNode
	className?: string
}

function accentForTone(tone: MetricTileTone) {
	if(tone === "alert") return "yellow"
	if(tone === "danger") return "red"
	return false
}

export function MetricTile({ title, children, tone = "default", icon, className }: MetricTileProps) {
	return (
		<Section
			variant="panel"
			accent={ accentForTone(tone) }
			className={ clsx(classes.tile, className) }
		>
			<div className={ classes.titleRow }>
				{ icon && (
					<span
						className={ clsx(
							classes.icon,
							tone === "alert" && classes.iconAlert,
							tone === "danger" && classes.iconDanger,
						) }
					>
						{ icon }
					</span>
				) }
				<div className={ classes.title }>{ title }</div>
			</div>
			<div className={ classes.body }>{ children }</div>
		</Section>
	)
}
