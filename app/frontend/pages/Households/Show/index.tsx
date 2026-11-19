import { Box, Group, Link, Page, Section, Table, Text, Title } from "@/components"
import { EditButton, ScheduleButton } from "@/components/Button"
import { Routes } from "@/lib"

interface ShowHouseholdProps {
	household: Schema.HouseholdsShow
}

const ShowHousehold = ({ household }: ShowHouseholdProps) => {
	const title = household.name || "Household"

	return (
		<Page
			title={ title }
			breadcrumbs={ [
				{ title: "Households", href: Routes.households() },
				{ title, href: Routes.household(household.slug) },
			] }
		>
			<Section fullHeight>
				<Group justify="space-between" align="flex-start">
					<Title>{ title }</Title>
					<EditButton href={ Routes.editHousehold(household.slug) } label={ title } />
				</Group>

				<Box mt="md">
					<Text fw={ 500 } mb="xs">
						Clients in this household
					</Text>

					{ household.clients.length === 0
						? (
							<Text c="dimmed">
								This household does not have any clients yet.
							</Text>
						)
						: (
							<Table>
								<Table.Head>
									<Table.Row>
										<Table.Cell>Client</Table.Cell>
										<Table.Cell className="actions">Actions</Table.Cell>
									</Table.Row>
								</Table.Head>
								<Table.Body>
									{ household.clients.map(client => (
										<Table.Row key={ client.id }>

											<Table.Cell>
												<Link href={ Routes.client(client.slug) }>{ client.full_name }</Link>
											</Table.Cell>

											<Table.Cell>
												<Group wrap="nowrap" gap="xs">
													<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
												</Group>
											</Table.Cell>

										</Table.Row>
									)) }
								</Table.Body>
							</Table>
						) }
				</Box>

			</Section>
		</Page>
	)
}

export default ShowHousehold
