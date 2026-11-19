import { useTranslation } from "react-i18next"

import { Link, Stack, Text } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, TextInput, Textarea } from "@/components/Inputs"
import {
	CollectionAddModal,
	CollectionPanel,
	MetricTile,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

interface ClientCareServicesProps {
	client: Schema.ClientsShow
}

function dateRange(starts: string | Date | null | undefined, ends: string | Date | null | undefined, currentLabel: string) {
	return (
		<span>
			{ starts ? <DateTimeFormatter>{ starts }</DateTimeFormatter> : "-" }
			{ " - " }
			{ ends ? <DateTimeFormatter>{ ends }</DateTimeFormatter> : currentLabel }
		</span>
	)
}

export function ClientCareServices({ client }: ClientCareServicesProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = can("clients", "update")

	return (
		<Stack gap="lg">
			<MetricTile title={ t("views.clients.show.care.household") }>
				{ client.household
					? <Link href={ Routes.household(client.household.slug) }>{ client.household.name }</Link>
					: <Text size="sm" c="dimmed">No household assigned.</Text> }
			</MetricTile>

			<CollectionPanel
				title={ t("views.clients.show.care.managers") }
				count={ client.clients_managers.length }
				emptyLabel="No managers assigned."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.care.add_manager") }
					>
						<Form
							action={ Routes.clientManagers(client.slug) }
							method="post"
							initialData={ {
								clients_manager: {
									manager_id: "",
									starts_at: "",
									ends_at: "",
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="clients_manager.manager_id" label="Manager Employee ID" required />
								<DateInput name="clients_manager.starts_at" label="Starts" />
								<DateInput name="clients_manager.ends_at" label="Ends" />
								<Submit>Assign Manager</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.clients_managers.map(assignment => (
					<RecordRow
						key={ assignment.id }
						title={ assignment.manager.person.name }
						meta={ dateRange(assignment.starts_at, assignment.ends_at, "Current") }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientManager(client.slug, assignment.id) }
									label={ assignment.manager.person.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.care.attendants") }
				count={ client.clients_attendants.length }
				emptyLabel="No attendants assigned."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.care.add_attendant") }
					>
						<Form
							action={ Routes.clientAttendants(client.slug) }
							method="post"
							initialData={ {
								clients_attendant: {
									attendant_id: "",
									starts_at: "",
									ends_at: "",
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="clients_attendant.attendant_id" label="Attendant Employee ID" required />
								<DateInput name="clients_attendant.starts_at" label="Starts" />
								<DateInput name="clients_attendant.ends_at" label="Ends" />
								<Submit>Assign Attendant</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.clients_attendants.map(assignment => (
					<RecordRow
						key={ assignment.id }
						title={ assignment.attendant.person.name }
						meta={ dateRange(assignment.starts_at, assignment.ends_at, "Current") }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientAttendant(client.slug, assignment.id) }
									label={ assignment.attendant.person.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.care.enrollments") }
				count={ client.enrollments.length }
				emptyLabel="No enrollments."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.care.add_enrollment") }
					>
						<Form
							action={ Routes.clientEnrollments(client.slug) }
							method="post"
							initialData={ {
								enrollment: {
									vendor_id: "",
									starts_on: "",
									ends_on: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="enrollment.vendor_id" label="Vendor ID" required />
								<DateInput name="enrollment.starts_on" label="Starts" required />
								<DateInput name="enrollment.ends_on" label="Ends" />
								<Textarea name="enrollment.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Enrollment</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.enrollments.map(enrollment => (
					<RecordRow
						key={ enrollment.id }
						title={ enrollment.vendor.name }
						meta={ dateRange(enrollment.starts_on, enrollment.ends_on, "Current") }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientEnrollment(client.slug, enrollment.id) }
									label={ enrollment.vendor.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
