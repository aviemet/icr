import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

import RequirementRequirementsTable from "../Table"

interface RequirementRequirementIndexProps {
	requirement_requirements: Schema.RequirementRequirementsIndex[]
	pagination: Schema.Pagination
}

const RequirementRequirementsIndex = ({ requirement_requirements, pagination }: RequirementRequirementIndexProps) => {
	return (
		<IndexPageTemplate
			title="RequirementRequirements"
			model="requirement_requirements"
			rows={ requirement_requirements }
			pagination={ pagination }
			deleteRoute={ Routes.requirementRequirements() }
			menuOptions={ [
				{ label: "New Requirement", href: Routes.newRequirementRequirement(), icon: <NewIcon /> },
			] }
		>
			<RequirementRequirementsTable />
		</IndexPageTemplate>
	)
}

export default RequirementRequirementsIndex
