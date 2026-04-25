import { Title, Page, Section } from "@/components"
import { RequirementRequirementForm } from "@/domains/Requirements/Form"
import { Routes } from "@/lib"


interface EditRequirementRequirementProps {
	requirement_requirement: Schema.RequirementRequirementsEdit
}

const EditRequirementRequirement = ({ requirement_requirement }: EditRequirementRequirementProps) => {
	const title = "Edit Requirement"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Requirements", href: Routes.requirements() },
			{ title: "RequirementRequirement", href: Routes.requirement(requirement_requirement.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<RequirementRequirementForm
					method="put"
					to={ Routes.requirement(requirement_requirement.id) }
					requirement_requirement={ requirement_requirement }
				/>
			</Section>
		</Page>
	)
}

export default EditRequirementRequirement
