import clsx from "clsx"
import React from "react"

import { Box, Section, Title } from "@/components"

import * as classes from "./CollectionPanel.css"

export interface CollectionPanelProps {
	title: string
	count?: number
	actions?: React.ReactNode
	emptyLabel?: string
	children?: React.ReactNode
	className?: string
	accent?: boolean | string
}

export function CollectionPanel({
	title,
	count,
	actions,
	emptyLabel,
	children,
	className,
	accent = false,
}: CollectionPanelProps) {
	const hasItems = React.Children.count(children) > 0

	return (
		<Section
			variant="panel"
			accent={ accent }
			className={ clsx(classes.panel, className) }
		>
			<Box className={ classes.header }>
				<Box className={ classes.titleGroup }>
					<Title order={ 4 }>{ title }</Title>
					{ typeof count === "number" && (
						<span className={ classes.count }>{ count }</span>
					) }
				</Box>
				{ actions }
			</Box>
			{ hasItems
				? <Box className={ classes.list }>{ children }</Box>
				: <Box className={ classes.empty }>{ emptyLabel ?? "-" }</Box> }
		</Section>
	)
}
