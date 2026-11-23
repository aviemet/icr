import { Page, Section, Stack, Title } from "@/components"
import { SubmissionForm } from "@/domains/Compliance"
import { Routes } from "@/lib"

interface ComplianceFormSubmissionEditProps {
	form_submission: Schema.ComplianceFormSubmissionsEdit
}

export default function ComplianceFormSubmissionEdit({ form_submission }: ComplianceFormSubmissionEditProps) {
	return (
		<Page
			title={ `Edit ${form_submission.form_template.name}` }
			breadcrumbs={ [
				{ title: "Compliance", href: Routes.complianceFormSubmissions() },
				{ title: form_submission.subject_label, href: Routes.complianceFormSubmission(form_submission.id) },
				{ title: "Edit" },
			] }
		>
			<Section variant="panel">
				<Stack gap="md">
					<Title order={ 2 }>{ form_submission.form_template.name }</Title>
					<SubmissionForm formSubmission={ form_submission } />
				</Stack>
			</Section>
		</Page>
	)
}
