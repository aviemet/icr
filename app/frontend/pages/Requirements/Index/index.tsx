import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import RequirementsTable from "@/features/Requirements/Table"
import { Routes } from "@/lib"


interface RequirementIndexProps {
	requirements: Schema.RequirementsIndex[]
	pagination: Schema.Pagination
}

const RequirementsIndex = ({ requirements, pagination }: RequirementIndexProps) => {
	return (
		<IndexPageTemplate
			title="Requirements"
			model="requirements"
			rows={ requirements }
			pagination={ pagination }
			deleteRoute={ Routes.requirements() }
			menuOptions={ [
				{ label: "New Requirement", href: Routes.newRequirement(), icon: <NewIcon /> },
			] }
		>
			<RequirementsTable />
		</IndexPageTemplate>
	)
}

export default RequirementsIndex
