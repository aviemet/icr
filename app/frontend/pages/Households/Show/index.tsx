import { Group, Title, Menu, Page, Section } from "@/components"
import { Routes } from "@/lib"

interface IShowHouseholdProps {
	household: Schema.HouseholdsShow
}

const ShowHousehold = ({ household }: IShowHouseholdProps) => {
	const title = "Household"

	return (
		<Page title={ title }>
			<Section>
				<Group>
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editHousehold(household.id) }>
								Edit Household
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowHousehold
