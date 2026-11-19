import clsx from "clsx"

import { Box } from "@/components"

import * as classes from "./DefinitionList.css"

export interface DefinitionItemProps {
	label: string
	value?: React.ReactNode
	fullWidth?: boolean
}

export function DefinitionItem({ label, value, fullWidth = false }: DefinitionItemProps) {
	return (
		<Box className={ clsx(classes.item, {
			[classes.fullWidth]: fullWidth,
		}) }>
			<Box className={ classes.label }>{ label }</Box>
			<Box className={ classes.value }>{ value ?? "-" }</Box>
		</Box>
	)
}

export interface DefinitionListProps {
	children: React.ReactNode
	className?: string
}

export function DefinitionList({ children, className }: DefinitionListProps) {
	return (
		<Box className={ clsx(classes.list, className) }>
			{ children }
		</Box>
	)
}
