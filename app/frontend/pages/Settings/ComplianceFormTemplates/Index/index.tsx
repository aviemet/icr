import { Box, Link, Stack, Table, Text, type TableColumn } from "@/components"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { Routes, withLayout } from "@/lib"

interface ComplianceFormTemplatesIndexProps {
	form_templates: Schema.ComplianceFormTemplatesIndex[]
}

const ComplianceFormTemplatesIndex = ({ form_templates }: ComplianceFormTemplatesIndexProps) => {
	const columns: TableColumn<Schema.ComplianceFormTemplatesIndex>[] = [
		{
			accessor: "name",
			title: "Name",
			render: (template) => (
				<Link href={ Routes.settingsComplianceFormTemplate(template.slug) }>
					{ template.name }
				</Link>
			),
		},
		{ accessor: "cadence", title: "Cadence" },
		{ accessor: "subject_type", title: "Subject" },
		{
			accessor: "active",
			title: "Active",
			render: (template) => (template.active ? "Yes" : "No"),
		},
	]

	return (
		<Box>
			<SettingsPageHeader
				title="Compliance forms"
				description="Seeded inspection templates used for hazard assessments and related compliance capture."
			/>
			{ form_templates.length === 0
				? <Text>{ "No compliance form templates." }</Text>
				: (
					<Stack gap="md">
						<Table>
							<Table.DataTable records={ form_templates } columns={ columns } />
						</Table>
					</Stack>
				) }
		</Box>
	)
}

export default withLayout(ComplianceFormTemplatesIndex, "settings")
