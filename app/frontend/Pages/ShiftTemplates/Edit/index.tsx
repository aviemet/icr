import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ShiftTemplatesForm from '../Form'

interface EditShiftTemplateProps {
	shift_template: Schema.ShiftTemplatesEdit
}

const EditShiftTemplate = ({ shift_template }: EditShiftTemplateProps) => {
	const title = 'Edit Shift Template'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Shift Templates', href: Routes.shiftTemplates() },
			{ title: ShiftTemplate, href: Routes.shiftTemplate(shift_template.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				
				<ShiftTemplatesForm
					method='put'
					to={ Routes.shiftTemplate() }
					shift_template={ shift_template }
				/>
			</Section>
		</Page>
	)
}

export default EditShiftTemplate
