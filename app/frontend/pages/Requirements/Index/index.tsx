import { NewIcon } from "@/components/Icons"
import { RequirementRequirementTable } from "@/domains/Requirements/Table"
import { IndexPageTemplate } from "@/features"
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
			pagination={ pagination }
			deleteRoute={ Routes.requirements() }
			menuOptions={ [
				{ label: "New Requirement", href: Routes.newRequirement(), icon: <NewIcon /> },
			] }
		>
			<RequirementRequirementTable records={ requirements } pagination={ pagination } model="requirements" />
		</IndexPageTemplate>
	)
}

export default RequirementsIndex
