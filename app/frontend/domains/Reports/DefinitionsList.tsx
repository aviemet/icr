import { Group, Stack, Text, Title, Link } from "@/components"
import { Routes } from "@/lib"

export interface ReportDefinitionListItem {
	id: string
	name: string
	slug: string
	format: string
	mode: string
}

interface DefinitionsListProps {
	reportDefinitions: ReportDefinitionListItem[]
}

export function DefinitionsList({ reportDefinitions }: DefinitionsListProps) {
	if(reportDefinitions.length === 0) {
		return <Text>{ "No reports available" }</Text>
	}

	return (
		<Stack gap="md">
			{ reportDefinitions.map(definition => (
				<Group key={ definition.id } justify="space-between" align="center">
					<Stack gap={ 2 }>
						<Title order={ 4 }>{ definition.name }</Title>
						<Text size="sm" c="dimmed">
							{ definition.format.toUpperCase() }
							{ " · " }
							{ definition.mode }
						</Text>
					</Stack>
					<Link
						as="button"
						href={ Routes.reportDefinition(definition.id) }
						buttonProps={ { variant: "filled" } }
					>
						{ "Run" }
					</Link>
				</Group>
			)) }
		</Stack>
	)
}
