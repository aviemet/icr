import { Group, Link, Page, Section, Stack, Text, Title } from "@/components"
import { QueueTable, type ReportRequestListItem } from "@/domains/Reports"
import { Routes } from "@/lib"

interface ReportsQueueIndexProps {
	report_requests: ReportRequestListItem[]
	pagination: Schema.Pagination
}

export default function ReportsQueueIndex({ report_requests }: ReportsQueueIndexProps) {
	return (
		<Page title="Report Queue">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Title order={ 2 }>{ "Report Queue" }</Title>
					<Link as="button" href={ Routes.reportDefinitions() } buttonProps={ { variant: "light" } }>
						{ "All reports" }
					</Link>
				</Group>
				<Section variant="panel">
					<QueueTable reportRequests={ report_requests } />
				</Section>
				<Text size="sm" c="dimmed">
					{ "Completed reports are removed after 30 days" }
				</Text>
			</Stack>
		</Page>
	)
}
