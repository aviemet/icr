import { NewIcon } from "@/components/Icons"
import { ShiftTemplateTable } from "@/domains/ShiftTemplates/Table"
import { IndexPageTemplate } from "@/features"
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
			pagination={ pagination }
			deleteRoute={ Routes.shiftTemplates() }
			menuOptions={ [
				{ label: "New Shift Template", href: Routes.newShiftTemplate(), icon: <NewIcon /> },
			] }
		>
			<ShiftTemplateTable />
		</IndexPageTemplate>
	)
}

export default ShiftTemplatesIndex
