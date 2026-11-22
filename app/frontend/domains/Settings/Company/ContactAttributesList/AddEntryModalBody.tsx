import { type ComponentType } from "react"

import { useModalContext } from "@/components/Modal"

import { AddEntryDraftForm } from "./AddEntryDraftForm"
import { type DraftFieldsProps } from "./draftFieldsTypes"

export interface AddEntryModalBodyProps {
	emptyData: Record<string, unknown>
	draftFields: ComponentType<DraftFieldsProps>
	onAdd: (item: Record<string, unknown>) => void
}

export function AddEntryModalBody({
	emptyData,
	draftFields,
	onAdd,
}: AddEntryModalBodyProps) {
	const { close, opened } = useModalContext()

	if(!opened) return null

	return (
		<AddEntryDraftForm
			emptyData={ emptyData }
			draftFields={ draftFields }
			onAdd={ onAdd }
			close={ close }
		/>
	)
}
