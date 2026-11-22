import { Group, Link, Page, Section, Stack, Text, Title } from "@/components"
import { DefinitionsList, type ReportDefinitionListItem } from "@/domains/Reports"
import { Routes } from "@/lib"

interface ReportsDefinitionsIndexProps {
	report_definitions: ReportDefinitionListItem[]
}

export default function ReportsDefinitionsIndex({ report_definitions }: ReportsDefinitionsIndexProps) {
	return (
		<Page title="Reports">
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Title order={ 2 }>{ "Reports" }</Title>
					<Link as="button" href={ Routes.reportRequests() } buttonProps={ { variant: "light" } }>
						{ "Report queue" }
					</Link>
				</Group>
				<Section variant="panel">
					<DefinitionsList reportDefinitions={ report_definitions } />
				</Section>
				<Text size="sm" c="dimmed">
					{ "Completed reports are removed after 30 days" }
				</Text>
			</Stack>
		</Page>
	)
}
