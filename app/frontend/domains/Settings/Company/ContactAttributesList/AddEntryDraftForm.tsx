import { useState, type ComponentType } from "react"
import { useTranslation } from "react-i18next"

import { Button, Stack } from "@/components"

import { type DraftFieldsProps } from "./draftFieldsTypes"
import { blankDraftFrom, draftToRecord } from "./helpers"

export interface AddEntryDraftFormProps {
	emptyData: Record<string, unknown>
	draftFields: ComponentType<DraftFieldsProps>
	onAdd: (item: Record<string, unknown>) => void
	close: () => void
}

export function AddEntryDraftForm({
	emptyData,
	draftFields: DraftFields,
	onAdd,
	close,
}: AddEntryDraftFormProps) {
	const { t } = useTranslation()
	const [draft, setDraft] = useState<Record<string, string>>(() => blankDraftFrom(emptyData))

	return (
		<Stack gap="sm">
			<DraftFields draft={ draft } setDraft={ setDraft } />
			<Button
				onClick={ () => {
					onAdd(draftToRecord(draft, emptyData))
					close()
				} }
			>
				{ t("views.settings.company.add_entry") }
			</Button>
		</Stack>
	)
}
