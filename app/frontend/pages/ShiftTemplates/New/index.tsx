import { Title, Page, Section } from "@/components"
import ShiftTemplateForm from "@/features/ShiftTemplates/Form"
import { Routes } from "@/lib"

interface NewShiftTemplateProps {
	shift_template: Schema.ShiftTemplatesFormData
}

const NewShiftTemplate = ({ ...data }: NewShiftTemplateProps) => {
	const title = "New Shift Template"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Shift Templates", href: Routes.shiftTemplates() },
			{ title: "New Shift Template", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<ShiftTemplateForm
					to={ Routes.shiftTemplates() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewShiftTemplate
