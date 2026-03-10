import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { RequirementRequirementTable } from "@/features/Requirements/Table"
import { Routes } from "@/lib"


interface RequirementIndexProps {
	requirements: Schema.RequirementRequirementsIndex[]
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
			<RequirementRequirementTable />
		</IndexPageTemplate>
	)
}

export default RequirementsIndex
