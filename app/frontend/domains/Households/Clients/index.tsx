import { router } from "@inertiajs/react"
import { UnstyledButton } from "@mantine/core"
import { useState } from "react"
import { useTranslation } from "react-i18next"

import { Button, Group, Link, Stack } from "@/components"
import { DeleteButton, ScheduleButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select } from "@/components/Inputs"
import {
	CollectionAddModal,
	CollectionPanel,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import * as classes from "./Clients.css"
import { MembershipEditModal } from "./MembershipEditModal"

interface HouseholdClientsProps {
	household: Schema.HouseholdsShow
	availableClients?: Schema.ClientsOptions[]
}

function dateRange(starts: string | Date | null | undefined, ends: string | Date | null | undefined) {
	return (
		<span>
			{ starts ? <DateTimeFormatter>{ starts }</DateTimeFormatter> : "-" }
			{ " - " }
			{ ends ? <DateTimeFormatter>{ ends }</DateTimeFormatter> : "Current" }
		</span>
	)
}

export function HouseholdClients({
	household,
	availableClients = [],
}: HouseholdClientsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const [managing, setManaging] = useState(false)
	const currentMemberships = household.current_memberships
	const pastMemberships = household.past_memberships
	const showManageControl = canUpdate && currentMemberships.length > 0
	const clientOptions = availableClients.map(client => ({
		label: client.name,
		value: client.id,
	}))

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.households.show.clients.current") }
				count={ currentMemberships.length }
				emptyLabel={ t("views.households.show.clients.empty_current") }
				actions={ (
					<Group gap="xs" wrap="nowrap">
						{ showManageControl && (
							managing
								? (
									<Button
										size="xs"
										variant="light"
										onClick={ () => setManaging(false) }
									>
										{ t("views.households.show.clients.done") }
									</Button>
								)
								: (
									<UnstyledButton
										type="button"
										className={ classes.manageLink }
										onClick={ () => setManaging(true) }
									>
										{ t("views.households.show.clients.manage") }
									</UnstyledButton>
								)
						) }
						<CollectionAddModal
							canUpdate={ canUpdate }
							label={ t("views.households.show.clients.add") }
						>
							<Form
								action={ Routes.householdMemberships(household.slug) }
								method="post"
								initialData={ {
									households_client: {
										client_id: "",
										starts_at: "",
									},
								} }
							>
								<Stack gap="sm">
									<Select
										name="households_client.client_id"
										label="Client"
										options={ clientOptions }
										searchable
										required
									/>
									<DateInput
										name="households_client.starts_at"
										label={ t("views.households.show.clients.starts") }
									/>
									<Submit>{ t("views.households.show.clients.add") }</Submit>
								</Stack>
							</Form>
						</CollectionAddModal>
					</Group>
				) }
			>
				{ currentMemberships.map(membership => (
					<RecordRow
						key={ membership.id }
						title={ (
							<Link href={ Routes.client(membership.client.slug) }>
								{ membership.client.full_name }
							</Link>
						) }
						meta={ dateRange(membership.starts_at, membership.ends_at) }
						actions={ (
							<Group wrap="nowrap" gap="xs">
								{ managing && canUpdate
									? (
										<>
											<MembershipEditModal
												householdSlug={ household.slug }
												membership={ membership }
											/>
											<DeleteButton
												label={ membership.client.full_name }
												onDelete={ () => {
													router.put(
														Routes.householdMembership(household.slug, membership.id),
														{ households_client: { ends_at: new Date().toISOString().slice(0, 10) } },
													)
												} }
											/>
										</>
									)
									: (
										<ScheduleButton href={ Routes.scheduleClient(membership.client.slug) } />
									) }
							</Group>
						) }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.households.show.clients.former") }
				count={ pastMemberships.length }
				emptyLabel={ t("views.households.show.clients.empty_former") }
			>
				{ pastMemberships.map(membership => (
					<RecordRow
						key={ membership.id }
						title={ (
							<Link href={ Routes.client(membership.client.slug) }>
								{ membership.client.full_name }
							</Link>
						) }
						meta={ dateRange(membership.starts_at, membership.ends_at) }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
