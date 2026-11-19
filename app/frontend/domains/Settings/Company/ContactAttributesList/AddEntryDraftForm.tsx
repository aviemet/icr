import { useState } from "react"

import { Button, Stack } from "@/components"

import { blankDraftFrom, draftToRecord } from "./helpers"

export interface AddEntryDraftFormProps {
	emptyData: Record<string, unknown>
	draftFields: (draft: Record<string, string>, setDraft: (next: Record<string, string>) => void) => React.ReactNode
	onAdd: (item: Record<string, unknown>) => void
	close: () => void
}

export function AddEntryDraftForm({
	emptyData,
	draftFields,
	onAdd,
	close,
}: AddEntryDraftFormProps) {
	const [draft, setDraft] = useState<Record<string, string>>(() => blankDraftFrom(emptyData))

	return (
		<Stack gap="sm">
			{ draftFields(draft, setDraft) }
			<Button
				onClick={ () => {
					onAdd(draftToRecord(draft, emptyData))
					close()
				} }
			>
				Add
			</Button>
		</Stack>
	)
}
