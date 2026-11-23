import { Page, Section } from "@/components"
import { SubmissionShow } from "@/domains/Compliance"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ComplianceFormSubmissionShowProps {
	form_submission: Schema.ComplianceFormSubmissionsShow
}

export default function ComplianceFormSubmissionShow({ form_submission }: ComplianceFormSubmissionShowProps) {
	const { can } = usePermissions()

	return (
		<Page
			title={ form_submission.form_template.name }
			breadcrumbs={ [
				{ title: "Compliance", href: Routes.complianceFormSubmissions() },
				{ title: form_submission.subject_label },
			] }
		>
			<Section variant="panel">
				<SubmissionShow
					formSubmission={ form_submission }
					canEdit={ can("compliance/form_submissions", "update") }
					canClose={ can("compliance/form_submissions", "close") }
				/>
			</Section>
		</Page>
	)
}
