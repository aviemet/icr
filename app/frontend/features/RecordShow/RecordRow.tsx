import clsx from "clsx"

import { Box } from "@/components"

import * as classes from "./RecordRow.css"

export type RecordRowTone = "default" | "warning" | "danger"

export interface RecordRowProps {
	title: React.ReactNode
	meta?: React.ReactNode
	actions?: React.ReactNode
	tone?: RecordRowTone
	className?: string
}

export function RecordRow({
	title,
	meta,
	actions,
	tone = "default",
	className,
}: RecordRowProps) {
	return (
		<Box
			className={ clsx(
				classes.row,
				tone === "warning" && classes.warning,
				tone === "danger" && classes.danger,
				className,
			) }
		>
			<Box className={ classes.main }>
				<Box className={ classes.title } data-record-row-title>{ title }</Box>
				{ meta && <Box className={ classes.meta }>{ meta }</Box> }
			</Box>
			{ actions && <Box className={ classes.actions }>{ actions }</Box> }
		</Box>
	)
}
