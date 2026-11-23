import { router } from "@inertiajs/react"

import { Button, Group, Link, Stack, Text, Title } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { DefinitionItem, DefinitionList, MetricLine, MetricTile } from "@/features"
import { Routes } from "@/lib"

import { CorrectiveActionsPanel } from "./CorrectiveActionsPanel"

interface SubmissionShowProps {
	formSubmission: Schema.ComplianceFormSubmissionsShow
	canEdit: boolean
	canClose: boolean
}

function answerLookup(formSubmission: Schema.ComplianceFormSubmissionsShow) {
	return new Map(formSubmission.form_answers.map(answer => [answer.form_item_id, answer]))
}

function formatAnswer(answer: Schema.ComplianceFormAnswersPersisted | undefined, kind: string) {
	if(!answer) return "-"
	if(kind === "text") return answer.text_value || "-"
	if(kind === "date") return answer.date_value ? String(answer.date_value) : "-"
	if(answer.check_value === "pass") return kind === "gate" ? "Yes" : "Pass"
	if(answer.check_value === "fail") return kind === "gate" ? "No" : "Fail"
	if(answer.check_value === "na") return "N/A"
	return "-"
}

export function SubmissionShow({ formSubmission, canEdit, canClose }: SubmissionShowProps) {
	const answers = answerLookup(formSubmission)

	return (
		<Stack gap="lg">
			<Group justify="space-between" align="center">
				<Title order={ 2 }>{ formSubmission.form_template.name }</Title>
				<Group gap="xs">
					{ canEdit && formSubmission.status === "draft" && (
						<Link as="button" href={ Routes.editComplianceFormSubmission(formSubmission.id) } buttonProps={ { variant: "light" } }>
							Continue
						</Link>
					) }
					{ canClose && formSubmission.status === "submitted" && (
						<Button
							variant="filled"
							onClick={ () => router.post(Routes.closeComplianceFormSubmission(formSubmission.id)) }
						>
							Close inspection
						</Button>
					) }
				</Group>
			</Group>

			<MetricTile title="Inspection">
				<MetricLine label="Subject" value={ formSubmission.subject_label } />
				<MetricLine label="Status" value={ formSubmission.status } />
				<MetricLine
					label="Inspected"
					value={ formSubmission.inspected_on
						? <DateTimeFormatter>{ formSubmission.inspected_on }</DateTimeFormatter>
						: "-" }
				/>
				<MetricLine
					label="Due"
					value={ formSubmission.due_on
						? <DateTimeFormatter>{ formSubmission.due_on }</DateTimeFormatter>
						: "-" }
				/>
				<MetricLine
					label="Conducted by"
					value={ formSubmission.conducted_by?.person?.name || "-" }
				/>
			</MetricTile>

			{ formSubmission.form_template.form_sections.map(section => (
				<Stack key={ section.id } gap="sm">
					<Title order={ 4 }>{ section.name }</Title>
					<DefinitionList>
						{ section.form_items.map(item => (
							<DefinitionItem
								key={ item.id }
								label={ item.label }
								value={ formatAnswer(answers.get(item.id), item.kind) }
								fullWidth
							/>
						)) }
					</DefinitionList>
				</Stack>
			)) }

			<CorrectiveActionsPanel formSubmission={ formSubmission } canEdit={ canEdit && formSubmission.status !== "closed" } />

			{ formSubmission.client?.slug && (
				<Text size="sm">
					<Link href={ Routes.client(formSubmission.client.slug, { tab: "compliance" }) }>
						Back to client compliance
					</Link>
				</Text>
			) }
		</Stack>
	)
}
