import { router } from "@inertiajs/react"

import { Button, Link, Stack } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ComplianceHistoryProps {
	client: Schema.ClientsShow
}

export function ComplianceHistory({ client }: ComplianceHistoryProps) {
	const { can } = usePermissions()
	const canCreate = can("compliance/form_submissions", "create")
	const submissions = client.compliance_form_submissions ?? []

	return (
		<CollectionPanel
			title="Hazard assessments"
			count={ submissions.length }
			emptyLabel="No hazard assessments yet."
			actions={ canCreate
				? (
					<Button
						size="xs"
						variant="light"
						onClick={ () => router.post(Routes.clientComplianceFormSubmissions(client.slug)) }
					>
						Start inspection
					</Button>
				)
				: undefined }
		>
			<Stack gap="xs">
				{ submissions.map(submission => (
					<RecordRow
						key={ submission.id }
						title={ submission.form_template.name }
						meta={ (
							<span>
								{ submission.status }
								{ " · " }
								{ submission.inspected_on
									? <DateTimeFormatter>{ submission.inspected_on }</DateTimeFormatter>
									: (submission.due_on
										? <>Due <DateTimeFormatter>{ submission.due_on }</DateTimeFormatter></>
										: "No date") }
							</span>
						) }
						actions={ (
							<Link
								as="button"
								href={ submission.status === "draft"
									? Routes.editComplianceFormSubmission(submission.id)
									: Routes.complianceFormSubmission(submission.id) }
								buttonProps={ { size: "xs", variant: "subtle" } }
							>
								{ submission.status === "draft" ? "Continue" : "View" }
							</Link>
						) }
					/>
				)) }
			</Stack>
		</CollectionPanel>
	)
}
