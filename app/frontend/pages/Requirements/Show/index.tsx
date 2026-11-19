import { Group, Title, Page, Section } from "@/components"
import { EditButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShowRequirementRequirementProps {
	requirement_requirement: Schema.RequirementRequirementsShow
}

const ShowRequirementRequirement = ({ requirement_requirement }: ShowRequirementRequirementProps) => {
	const title = "Requirement"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Requirement", href: Routes.requirements() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editRequirement(requirement_requirement.id) } label={ title } />
				</Group>
			</Section>
		</Page>
	)
}

export default ShowRequirementRequirement
