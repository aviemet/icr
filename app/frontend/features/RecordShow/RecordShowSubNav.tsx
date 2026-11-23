import clsx from "clsx"

import { Box } from "@/components"

import * as classes from "./RecordShowSubNav.css"

export interface RecordShowSubNavItem {
	id: string
	label: string
}

export interface RecordShowSubNavProps {
	items: RecordShowSubNavItem[]
	value: string
	onChange: (id: string) => void
}

export function RecordShowSubNav({ items, value, onChange }: RecordShowSubNavProps) {
	return (
		<Box className={ classes.row } role="tablist" aria-label="Section">
			{ items.map(item => {
				const active = item.id === value

				return (
					<button
						key={ item.id }
						type="button"
						role="tab"
						aria-selected={ active }
						data-active={ active }
						className={ classes.control }
						onClick={ () => onChange(item.id) }
					>
						<span className={ clsx("label", classes.controlLabel) }>{ item.label }</span>
					</button>
				)
			}) }
		</Box>
	)
}
