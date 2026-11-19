import { useTranslation } from "react-i18next"

import { Group, Link, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, TextInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

interface ClientCareServicesProps {
	client: Schema.ClientsShow
}

export function ClientCareServices({ client }: ClientCareServicesProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.care.household") }</Title>
				{ client.household
					? (
						<Link href={ Routes.household(client.household.slug) }>{ client.household.name }</Link>
					)
					: (
						<Text c="dimmed">No household assigned.</Text>
					) }
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.care.managers") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.clients_managers.map(assignment => (
						<Group key={ assignment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ assignment.manager.person.name }</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ assignment.starts_at }</DateTimeFormatter>
									{ " - " }
									{ assignment.ends_at
										? <DateTimeFormatter>{ assignment.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.clientManager(client.slug, assignment.id) }
								label={ assignment.manager.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.care.add_manager") }</Title>
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
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.care.attendants") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.clients_attendants.map(assignment => (
						<Group key={ assignment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ assignment.attendant.person.name }</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ assignment.starts_at }</DateTimeFormatter>
									{ " - " }
									{ assignment.ends_at
										? <DateTimeFormatter>{ assignment.ends_at }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.clientAttendant(client.slug, assignment.id) }
								label={ assignment.attendant.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.care.add_attendant") }</Title>
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
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.care.enrollments") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.enrollments.map(enrollment => (
						<Group key={ enrollment.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ enrollment.vendor.name }</Text>
								<Text size="sm" c="dimmed">
									<DateTimeFormatter>{ enrollment.starts_on }</DateTimeFormatter>
									{ " - " }
									{ enrollment.ends_on
										? <DateTimeFormatter>{ enrollment.ends_on }</DateTimeFormatter>
										: "Current" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.clientEnrollment(client.slug, enrollment.id) }
								label={ enrollment.vendor.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.care.add_enrollment") }</Title>
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
			</Section>
		</Stack>
	)
}
