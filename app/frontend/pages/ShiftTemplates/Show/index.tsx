import { Group, Title, Page, Section } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShowShiftTemplateProps {
	shift_template: Schema.ShiftTemplatesShow
}

const ShowShiftTemplate = ({ shift_template }: ShowShiftTemplateProps) => {
	const title = "Shift Template"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Shift Template", href: Routes.shiftTemplates() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editShiftTemplate(shift_template.id) } label={ title } />
				</Group>
			</Section>
		</Page>
	)
}

export default ShowShiftTemplate
