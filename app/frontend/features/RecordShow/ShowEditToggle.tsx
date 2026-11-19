import { useState } from "react"

import { Button, Group } from "@/components"

import * as classes from "./ShowEditToggle.css"

export type ShowEditMode = "show" | "edit"

export interface ShowEditToggleProps {
	title?: string
	canUpdate: boolean
	editLabel?: string
	cancelLabel?: string
	show: React.ReactNode
	edit: React.ReactNode
	defaultMode?: ShowEditMode
}

export function ShowEditToggle({
	title,
	canUpdate,
	editLabel = "Edit",
	cancelLabel = "Cancel",
	show,
	edit,
	defaultMode = "show",
}: ShowEditToggleProps) {
	const [mode, setMode] = useState<ShowEditMode>(defaultMode)
	const editing = mode === "edit" && canUpdate

	return (
		<div>
			{ (title || canUpdate) && (
				<div className={ classes.header }>
					{ title ? <div className={ classes.title }>{ title }</div> : <span /> }
					{ canUpdate && (
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
					) }
				</div>
			) }
			{ editing ? edit : show }
		</div>
	)
}
