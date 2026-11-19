import { useState } from "react"

import { Button, Group } from "@/components"

import * as classes from "./ShowEditToggle.css"

export type ShowEditMode = "show" | "edit"

export interface ShowEditToggleRenderArgs {
	editing: boolean
	controls: React.ReactNode
}

export interface ShowEditToggleProps {
	title?: string
	canUpdate: boolean
	editLabel?: string
	cancelLabel?: string
	defaultMode?: ShowEditMode
	children: (args: ShowEditToggleRenderArgs) => React.ReactNode
}

export function ShowEditToggle({
	title,
	canUpdate,
	editLabel = "Edit",
	cancelLabel = "Cancel",
	defaultMode = "show",
	children,
}: ShowEditToggleProps) {
	const [mode, setMode] = useState<ShowEditMode>(defaultMode)
	const editing = mode === "edit" && canUpdate

	const controls = canUpdate
		? (
			<Group gap="xs">
				{ editing
					? (
						<Button size="xs" variant="default" onClick={ () => setMode("show") }>
							{ cancelLabel }
						</Button>
					)
					: (
						<Button size="xs" variant="light" onClick={ () => setMode("edit") }>
							{ editLabel }
						</Button>
					) }
			</Group>
		)
		: null

	return (
		<div>
			{ title && (
				<div className={ classes.header }>
					<div className={ classes.title }>{ title }</div>
					{ controls }
				</div>
			) }
			{ children({
				editing,
				controls: title ? null : controls,
			}) }
		</div>
	)
}
