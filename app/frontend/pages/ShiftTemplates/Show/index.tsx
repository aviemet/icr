import { Group, Title, Menu, Page, Section } from "@/components"
import { Routes } from "@/lib"

interface ShowShiftTemplateProps {
	shift_template: Schema.ShiftTemplatesShow
}

const ShowShiftTemplate = ({ shift_template }: ShowShiftTemplateProps) => {
	const title = "ShiftTemplate"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Shift Template", href: Routes.shiftTemplates() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editShiftTemplate(shift_template.id) }>
								Edit ShiftTemplate
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowShiftTemplate
