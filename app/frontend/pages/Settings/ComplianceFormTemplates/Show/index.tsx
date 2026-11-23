import { Box, Stack, Text, Title } from "@/components"
import { Form, Submit } from "@/components/Form"
import { Select, Switch, Textarea, TextInput } from "@/components/Inputs"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { DefinitionItem, DefinitionList } from "@/features"
import { Routes, withLayout } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ComplianceFormTemplateShowProps {
	form_template: Schema.ComplianceFormTemplatesShow
}

const ComplianceFormTemplateShow = ({ form_template }: ComplianceFormTemplateShowProps) => {
	const { can } = usePermissions()
	const canUpdate = can("compliance/form_templates", "update")

	return (
		<Box>
			<SettingsPageHeader
				title={ form_template.name }
				description={ form_template.description || "Compliance form template" }
			/>
			<Stack gap="lg">
				{ canUpdate && (
					<Form
						action={ Routes.settingsComplianceFormTemplate(form_template.slug) }
						method="put"
						initialData={ {
							form_template: {
								name: form_template.name,
								description: form_template.description ?? "",
								cadence: form_template.cadence,
								subject_type: form_template.subject_type,
								active: form_template.active,
							},
						} }
					>
						<Stack gap="sm">
							<TextInput name="form_template.name" label="Name" required />
							<Textarea name="form_template.description" label="Description" minRows={ 2 } />
							<Select
								name="form_template.cadence"
								label="Cadence"
								options={ [
									{ value: "quarterly", label: "Quarterly" },
									{ value: "ad_hoc", label: "Ad hoc" },
								] }
							/>
							<Select
								name="form_template.subject_type"
								label="Subject"
								options={ [
									{ value: "household", label: "Household" },
									{ value: "client", label: "Client" },
								] }
							/>
							<Switch name="form_template.active" label="Active" />
							<Submit>Save template</Submit>
						</Stack>
					</Form>
				) }

				{ form_template.form_sections.map(section => (
					<Stack key={ section.id } gap="xs">
						<Title order={ 4 }>{ section.name }</Title>
						{ section.show_when && (
							<Text size="sm" c="dimmed">{ `Shown when: ${section.show_when}` }</Text>
						) }
						<DefinitionList>
							{ section.form_items.map(item => (
								<DefinitionItem
									key={ item.id }
									label={ `${item.kind}: ${item.label}` }
									value={ item.required ? "Required" : "Optional" }
									fullWidth
								/>
							)) }
						</DefinitionList>
					</Stack>
				)) }
			</Stack>
		</Box>
	)
}

export default withLayout(ComplianceFormTemplateShow, "settings")
