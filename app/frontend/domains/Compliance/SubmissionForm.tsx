import { router } from "@inertiajs/react"

import { Button, Group, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { DateInput, HiddenInput, TextInput } from "@/components/Inputs"
import { Routes } from "@/lib"

import { CorrectiveActionsPanel } from "./CorrectiveActionsPanel"
import { SubmissionAnswerFields } from "./SubmissionAnswerFields"

interface SubmissionFormProps {
	formSubmission: Schema.ComplianceFormSubmissionsEdit
}

function answerForItem(
	answers: Schema.ComplianceFormAnswersPersisted[],
	itemId: string,
) {
	return answers.find(answer => answer.form_item_id === itemId)
}

export function SubmissionForm({ formSubmission }: SubmissionFormProps) {
	const sections = formSubmission.form_template.form_sections
	const answerRows = sections.flatMap(section => (
		section.form_items.map(item => {
			const existing = answerForItem(formSubmission.form_answers, item.id)
			return {
				id: existing?.id ?? "",
				form_item_id: item.id,
				check_value: existing?.check_value ?? "",
				text_value: existing?.text_value ?? "",
				date_value: existing?.date_value ? String(existing.date_value) : "",
				kind: item.kind,
				label: item.label,
				required: item.required,
				sectionId: section.id,
				sectionName: section.name,
			}
		})
	))

	const sectionOrder = sections.map(section => ({ id: section.id, name: section.name }))

	return (
		<Stack gap="lg">
			<Form
				action={ Routes.complianceFormSubmission(formSubmission.id) }
				method="put"
				initialData={ {
					form_submission: {
						inspected_on: formSubmission.inspected_on ? String(formSubmission.inspected_on) : "",
						conducted_by_id: formSubmission.conducted_by_id ?? "",
						form_answers: answerRows.map(row => ({
							id: row.id,
							form_item_id: row.form_item_id,
							check_value: row.check_value,
							text_value: row.text_value,
							date_value: row.date_value,
						})),
					},
				} }
			>
				<Stack gap="lg">
					<Group grow>
						<DateInput name="form_submission.inspected_on" label="Date of inspection" required />
						<TextInput name="form_submission.conducted_by_id" label="Conducted by (employee ID)" />
					</Group>

					{ sectionOrder.map(section => {
						const rows = answerRows
							.map((row, index) => ({ row, index }))
							.filter(entry => entry.row.sectionId === section.id)

						return (
							<Stack key={ section.id } gap="sm">
								<Title order={ 4 }>{ section.name }</Title>
								{ rows.map(({ row, index }) => (
									<Stack key={ row.form_item_id } gap="xs">
										{ row.id !== "" && (
											<HiddenInput
												name={ `form_submission.form_answers.${index}.id` }
												defaultValue={ row.id }
											/>
										) }
										<HiddenInput
											name={ `form_submission.form_answers.${index}.form_item_id` }
											defaultValue={ row.form_item_id }
										/>
										<SubmissionAnswerFields
											index={ index }
											kind={ row.kind }
											label={ row.label }
											required={ row.required }
										/>
									</Stack>
								)) }
							</Stack>
						)
					}) }

					<Group>
						<Submit>Save draft</Submit>
						<Button
							variant="filled"
							onClick={ () => router.post(Routes.submitComplianceFormSubmission(formSubmission.id)) }
						>
							Submit inspection
						</Button>
					</Group>
					{ formSubmission.form_answers.some(answer => answer.check_value === "fail") && (
						<Text size="sm" c="dimmed">
							{ "Failed checks should include a corrective action before closing the inspection." }
						</Text>
					) }
				</Stack>
			</Form>

			<CorrectiveActionsPanel formSubmission={ formSubmission } canEdit={ true } />
		</Stack>
	)
}
