import { Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Select, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

import { RECOMMENDATION_OPTIONS } from "./recommendationOptions"

export interface NoteFormProps {
	interviewId: string
}

export function NoteForm({ interviewId }: NoteFormProps) {
	return (
		<Form
			action={ Routes.interviewInterviewNotes(interviewId) }
			method="post"
			initialData={ { interview_note: { note: "", recommendation: "neutral" } } }
		>
			<Stack gap="sm">
				<Select name="interview_note.recommendation" label="Recommendation" options={ RECOMMENDATION_OPTIONS } />
				<Textarea name="interview_note.note" label="Note" minRows={ 3 } required />
				<Submit>Add Note</Submit>
			</Stack>
		</Form>
	)
}
