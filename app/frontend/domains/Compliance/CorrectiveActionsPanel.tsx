import { router } from "@inertiajs/react"

import { Button, Stack } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput, Textarea, TextInput } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface CorrectiveActionsPanelProps {
	formSubmission: Schema.ComplianceFormSubmissionsShow | Schema.ComplianceFormSubmissionsEdit
	canEdit: boolean
}

export function CorrectiveActionsPanel({ formSubmission, canEdit }: CorrectiveActionsPanelProps) {
	return (
		<CollectionPanel
			title="Corrective actions"
			count={ formSubmission.corrective_actions.length }
			emptyLabel="No corrective actions recorded."
			actions={ canEdit
				? (
					<CollectionAddModal canUpdate={ canEdit } label="Add corrective action">
						<Form
							action={ Routes.complianceFormSubmissionCorrectiveActions(formSubmission.id) }
							method="post"
							initialData={ {
								corrective_action: {
									description: "",
									root_cause: "",
									remedy: "",
									due_on: "",
									incident_report_id: "",
								},
							} }
						>
							<Stack gap="sm">
								<Textarea name="corrective_action.description" label="Unsafe condition / work practice" required minRows={ 2 } />
								<Textarea name="corrective_action.root_cause" label="Root cause" minRows={ 2 } />
								<Textarea name="corrective_action.remedy" label="Corrective action taken" minRows={ 2 } />
								<DateInput name="corrective_action.due_on" label="Due" />
								<TextInput name="corrective_action.incident_report_id" label="Incident report ID (optional)" />
								<Submit>Add corrective action</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				)
				: undefined }
		>
			{ formSubmission.corrective_actions.map(action => (
				<RecordRow
					key={ action.id }
					title={ action.description }
					meta={ action.closed_at ? "Closed" : (action.due_on ? `Due ${String(action.due_on)}` : "Open") }
					actions={ canEdit && !action.closed_at
						? (
							<Button
								size="xs"
								variant="light"
								onClick={ () => router.post(Routes.closeComplianceFormSubmissionCorrectiveAction(formSubmission.id, action.id)) }
							>
								Close
							</Button>
						)
						: undefined }
				/>
			)) }
		</CollectionPanel>
	)
}
