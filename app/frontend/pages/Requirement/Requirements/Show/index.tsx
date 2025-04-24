import { Group, Title, Menu, Page, Section } from "@/components"
import { Routes } from "@/lib"

interface ShowRequirementRequirementProps {
	requirement_requirement: Schema.RequirementRequirementsShow
}

const ShowRequirementRequirement = ({ requirement_requirement }: ShowRequirementRequirementProps) => {
	const title = "RequirementRequirement"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Requirement", href: Routes.requirementRequirements() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editRequirementRequirement(requirement_requirement.id) }>
								Edit RequirementRequirement
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowRequirementRequirement
