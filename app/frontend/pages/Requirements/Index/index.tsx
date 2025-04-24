import { NewIcon } from "@/components/Icons"
import { IndexPageTemplate } from "@/features"
import RequirementRequirementsTable from "@/features/Requirements/Table"
import { Routes } from "@/lib"


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
