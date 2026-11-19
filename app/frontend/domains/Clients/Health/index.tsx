import { useTranslation } from "react-i18next"

import { Group, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { Checkbox, DateInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

interface ClientHealthProps {
	client: Schema.ClientsShow
}

const SEVERITY_OPTIONS = [
	{ value: "mild", label: "Mild" },
	{ value: "moderate", label: "Moderate" },
	{ value: "severe", label: "Severe" },
	{ value: "life_threatening", label: "Life Threatening" },
]

export function ClientHealth({ client }: ClientHealthProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="xl">
			<Section>
				<Text size="sm" mb="md">
					{ t("views.clients.show.health.preferred_hospital") }: { client.preferred_hospital || "-" }
				</Text>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.health.allergies") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.allergies.map(allergy => (
						<Group key={ allergy.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ allergy.name } ({ allergy.severity })</Text>
								{ allergy.reaction && <Text size="sm">{ allergy.reaction }</Text> }
								{ !allergy.active && <Text size="sm" c="dimmed">Inactive</Text> }
							</Stack>
							<DeleteButton
								href={ Routes.clientAllergy(client.slug, allergy.id) }
								label={ allergy.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.health.add_allergy") }</Title>
				<Form
					action={ Routes.clientAllergies(client.slug) }
					method="post"
					initialData={ {
						allergy: {
							name: "",
							severity: "mild",
							reaction: "",
							notes: "",
							active: true,
						},
					} }
				>
					<Stack gap="sm">
						<TextInput name="allergy.name" label="Name" required />
						<Select name="allergy.severity" label="Severity" options={ SEVERITY_OPTIONS } />
						<TextInput name="allergy.reaction" label="Reaction" />
						<Textarea name="allergy.notes" label="Notes" minRows={ 2 } />
						<Checkbox name="allergy.active" label="Active" />
						<Submit>Add Allergy</Submit>
					</Stack>
				</Form>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.health.diagnoses") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.diagnoses.map(diagnosis => (
						<Group key={ diagnosis.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>
									{ diagnosis.name }
									{ diagnosis.code ? ` (${diagnosis.code})` : "" }
								</Text>
								{ !diagnosis.active && <Text size="sm" c="dimmed">Inactive</Text> }
							</Stack>
							<DeleteButton
								href={ Routes.clientDiagnosis(client.slug, diagnosis.id) }
								label={ diagnosis.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.health.add_diagnosis") }</Title>
				<Form
					action={ Routes.clientDiagnoses(client.slug) }
					method="post"
					initialData={ {
						diagnosis: {
							name: "",
							code: "",
							diagnosed_on: "",
							notes: "",
							active: true,
						},
					} }
				>
					<Stack gap="sm">
						<TextInput name="diagnosis.name" label="Name" required />
						<TextInput name="diagnosis.code" label="Code" />
						<DateInput name="diagnosis.diagnosed_on" label="Diagnosed On" />
						<Textarea name="diagnosis.notes" label="Notes" minRows={ 2 } />
						<Checkbox name="diagnosis.active" label="Active" />
						<Submit>Add Diagnosis</Submit>
					</Stack>
				</Form>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.health.doctors") }</Title>
				<Stack gap="sm" mb="lg">
					{ client.doctors.map(doctor => (
						<Group key={ doctor.id } justify="space-between">
							<Text>{ doctor.person.name }</Text>
							<DeleteButton
								href={ Routes.clientDoctor(client.slug, doctor.id) }
								label={ doctor.person.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.health.link_doctor") }</Title>
				<Form
					action={ Routes.clientDoctors(client.slug) }
					method="post"
					initialData={ { doctor_id: "" } }
				>
					<Stack gap="sm">
						<TextInput name="doctor_id" label="Doctor ID" description="Paste doctor UUID for now" required />
						<Submit>Link Doctor</Submit>
					</Stack>
				</Form>
			</Section>
		</Stack>
	)
}
