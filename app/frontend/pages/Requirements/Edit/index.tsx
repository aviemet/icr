import { Title, Page, Section } from "@/components"
import RequirementRequirementsForm from "@/features/Requirements/Form"
import { Routes } from "@/lib"


interface EditRequirementRequirementProps {
	requirement_requirement: Schema.RequirementRequirementsEdit
}

const EditRequirementRequirement = ({ requirement_requirement }: EditRequirementRequirementProps) => {
	const title = "Edit Requirement"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Requirements", href: Routes.requirementRequirements() },
			{ title: "RequirementRequirement", href: Routes.requirementRequirement(requirement_requirement.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<RequirementRequirementsForm
					method="put"
					to={ Routes.requirementRequirement() }
					requirement_requirement={ requirement_requirement }
				/>
			</Section>
		</Page>
	)
}

export default EditRequirementRequirement
