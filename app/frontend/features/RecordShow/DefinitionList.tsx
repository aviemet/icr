import clsx from "clsx"

import * as classes from "./DefinitionList.css"

export interface DefinitionItemProps {
	label: string
	value?: React.ReactNode
	fullWidth?: boolean
}

export function DefinitionItem({ label, value, fullWidth = false }: DefinitionItemProps) {
	return (
		<div className={ clsx(classes.item, fullWidth && classes.fullWidth) }>
			<div className={ classes.label }>{ label }</div>
			<div className={ classes.value }>{ value ?? "-" }</div>
		</div>
	)
}

export interface DefinitionListProps {
	children: React.ReactNode
	className?: string
}

export function DefinitionList({ children, className }: DefinitionListProps) {
	return (
		<div className={ clsx(classes.list, className) }>
			{ children }
		</div>
	)
}
