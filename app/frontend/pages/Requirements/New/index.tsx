import { Title, Page, Section } from "@/components"
import RequirementRequirementForm from "@/features/Requirements/Form"
import { Routes } from "@/lib"


interface NewRequirementRequirementProps {
	requirement_requirement: Schema.RequirementRequirementsFormData
}

const NewRequirementRequirement = ({ ...data }: NewRequirementRequirementProps) => {
	const title = "New Requirement"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Requirements", href: Routes.requirementRequirements() },
			{ title: "New Requirement", href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<RequirementRequirementForm
					to={ Routes.requirementRequirements() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewRequirementRequirement
