import { Badge } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"

import { RECOMMENDATION_OPTIONS } from "./recommendationOptions"

export interface NoteListProps {
	notes: Schema.EmployeeInterviewNotesPersisted[]
}

export function NoteList({ notes }: NoteListProps) {
	return (
		<CollectionPanel title="Notes" count={ notes.length } emptyLabel="No notes.">
			{ notes.map(note => (
				<RecordRow
					key={ note.id }
					title={ note.note || "-" }
					meta={ (
						<span>
							<Badge variant="light" size="sm">
								{ RECOMMENDATION_OPTIONS.find(option => option.value === note.recommendation)?.label ?? note.recommendation }
							</Badge>
							{ " " }
							<DateTimeFormatter>{ note.created_at }</DateTimeFormatter>
						</span>
					) }
				/>
			)) }
		</CollectionPanel>
	)
}
