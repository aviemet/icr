import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import ShiftTemplatesTable from "@/Features/ShiftTemplates/Table"
import { Routes } from "@/lib"

interface ShiftTemplateIndexProps {
	shift_templates: Schema.ShiftTemplatesIndex[]
	pagination: Schema.Pagination
}

const ShiftTemplatesIndex = ({ shift_templates, pagination }: ShiftTemplateIndexProps) => {
	return (
		<IndexPageTemplate
			title="ShiftTemplates"
			model="shift_templates"
			rows={ shift_templates }
			pagination={ pagination }
			deleteRoute={ Routes.shiftTemplates() }
			menuOptions={ [
				{ label: "New Shift Template", href: Routes.newShiftTemplate(), icon: <NewIcon /> },
			] }
		>
			<ShiftTemplatesTable />
		</IndexPageTemplate>
	)
}

export default ShiftTemplatesIndex
