import { Group, Link, Page, Section, Stack, Title } from "@/components"
import { RunReportForm, type ReportDefinitionShow } from "@/domains/Reports"
import { Routes } from "@/lib"

interface ReportsDefinitionShowProps {
	report_definition: ReportDefinitionShow
}

export default function ReportsDefinitionShow({ report_definition }: ReportsDefinitionShowProps) {
	return (
		<Page
			title={ report_definition.name }
			breadcrumbs={ [
				{ title: "Reports", href: Routes.reportDefinitions() },
				{ title: report_definition.name },
			] }
		>
			<Stack gap="md">
				<Group justify="space-between" align="center">
					<Title order={ 2 }>{ report_definition.name }</Title>
					<Link as="button" href={ Routes.reportRequests() } buttonProps={ { variant: "light" } }>
						{ "Report queue" }
					</Link>
				</Group>
				<Section variant="panel">
					<RunReportForm reportDefinition={ report_definition } />
				</Section>
			</Stack>
		</Page>
	)
}
