import { useModalContext } from "@/components/Modal"

import { AddEntryDraftForm } from "./AddEntryDraftForm"

export interface AddEntryModalBodyProps {
	emptyData: Record<string, unknown>
	draftFields: (draft: Record<string, string>, setDraft: (next: Record<string, string>) => void) => React.ReactNode
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
