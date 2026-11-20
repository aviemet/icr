import { Stack } from "@/components"

import { NoteForm } from "./NoteForm"
import { NoteList } from "./NoteList"

export interface InterviewNotesProps {
	interviewId: string
	notes: Schema.EmployeeInterviewNotesPersisted[]
}

export function InterviewNotes({ interviewId, notes }: InterviewNotesProps) {
	return (
		<Stack gap="lg">
			<NoteList notes={ notes } />
			<NoteForm interviewId={ interviewId } />
		</Stack>
	)
}
