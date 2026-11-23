import { Group, Link, Page, Section, Stack, Title } from "@/components"
import { WorkQueue, type ComplianceQueueCounts, type ComplianceQueueTab } from "@/domains/Compliance"
import { Routes } from "@/lib"

interface ComplianceFormSubmissionsIndexProps {
	form_submissions: Schema.ComplianceFormSubmissionsIndex[]
	tab: ComplianceQueueTab
	counts: ComplianceQueueCounts
	pagination: Schema.Pagination
}

export default function ComplianceFormSubmissionsIndex({
	form_submissions,
	tab,
	counts,
}: ComplianceFormSubmissionsIndexProps) {
	return (
		<Page title="Compliance">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Title order={ 2 }>{ "Compliance queue" }</Title>
					<Link as="button" href={ Routes.settingsComplianceFormTemplates() } buttonProps={ { variant: "light" } }>
						{ "Form templates" }
					</Link>
				</Group>
				<Section variant="panel">
					<WorkQueue formSubmissions={ form_submissions } tab={ tab } counts={ counts } />
				</Section>
			</Stack>
		</Page>
	)
}
