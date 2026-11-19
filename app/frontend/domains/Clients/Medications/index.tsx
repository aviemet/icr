import { useTranslation } from "react-i18next"

import { Group, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, NumberInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

interface ClientMedicationsProps {
	client: Schema.ClientsShow
}

const AMOUNT_UNIT_OPTIONS = [
	{ value: "mg", label: "mg" },
	{ value: "ml", label: "ml" },
	{ value: "tablet", label: "Tablet" },
	{ value: "capsule", label: "Capsule" },
	{ value: "unit", label: "Unit" },
	{ value: "other", label: "Other" },
]

const FREQ_PERIOD_OPTIONS = [
	{ value: "hour", label: "Hour" },
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "as_needed", label: "As Needed" },
]

function isActivePrescription(prescription: Schema.PrescriptionsPersisted) {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const starts = prescription.starts_at ? new Date(prescription.starts_at) : null
	const ends = prescription.ends_at ? new Date(prescription.ends_at) : null
	const started = !starts || starts <= today
	const notEnded = !ends || ends >= today
	return started && notEnded
}

function PrescriptionRow({
	clientSlug,
	prescription,
}: {
	clientSlug: string
	prescription: Schema.PrescriptionsPersisted
}) {
	const dosage = prescription.dosage
	const dosageLabel = dosage
		? `${dosage.amount} ${dosage.amount_unit ?? ""} every ${dosage.freq_amount ?? ""} ${dosage.freq_period ?? ""}`
		: ""

	return (
		<Group justify="space-between" align="flex-start">
			<Stack gap={ 2 }>
				<Text fw={ 600 }>{ prescription.medication?.name }</Text>
				<Text size="sm">{ dosageLabel }</Text>
				<Text size="sm" c="dimmed">
					Doctor: { prescription.doctor?.person?.name || "-" }
				</Text>
				<Text size="sm" c="dimmed">
					{ prescription.starts_at
						? <DateTimeFormatter>{ prescription.starts_at }</DateTimeFormatter>
						: "-" }
					{ " - " }
					{ prescription.ends_at
						? <DateTimeFormatter>{ prescription.ends_at }</DateTimeFormatter>
						: "Ongoing" }
				</Text>
			</Stack>
			<DeleteButton
				href={ Routes.clientPrescription(clientSlug, prescription.id) }
				label={ prescription.medication?.name }
			/>
		</Group>
	)
}

export function ClientMedications({ client }: ClientMedicationsProps) {
	const { t } = useTranslation()
	const active = client.prescriptions.filter(isActivePrescription)
	const historical = client.prescriptions.filter(prescription => !isActivePrescription(prescription))
	const defaultDoctorId = client.doctors[0]?.id ?? ""

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.medications.active") }</Title>
				<Stack gap="md">
					{ active.map(prescription => (
						<PrescriptionRow
							key={ prescription.id }
							clientSlug={ client.slug }
							prescription={ prescription }
						/>
					)) }
					{ active.length === 0 && <Text c="dimmed">No active prescriptions.</Text> }
				</Stack>
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.medications.historical") }</Title>
				<Stack gap="md">
					{ historical.map(prescription => (
						<PrescriptionRow
							key={ prescription.id }
							clientSlug={ client.slug }
							prescription={ prescription }
						/>
					)) }
					{ historical.length === 0 && <Text c="dimmed">No historical prescriptions.</Text> }
				</Stack>
			</Section>

			<Section>
				<Title order={ 4 } mb="sm">{ t("views.clients.show.medications.add") }</Title>
				<Form
					action={ Routes.clientPrescriptions(client.slug) }
					method="post"
					initialData={ {
						prescription: {
							doctor_id: defaultDoctorId,
							starts_at: "",
							ends_at: "",
							medication: {
								name: "",
								generic_name: "",
								notes: "",
							},
							dosage: {
								amount: "",
								amount_unit: "mg",
								freq_amount: 1,
								freq_period: "day",
								notes: "",
							},
						},
					} }
				>
					<Stack gap="sm">
						<TextInput name="prescription.medication.name" label="Medication" required />
						<TextInput name="prescription.medication.generic_name" label="Generic Name" />
						<Group grow>
							<NumberInput name="prescription.dosage.amount" label="Amount" required />
							<Select name="prescription.dosage.amount_unit" label="Unit" options={ AMOUNT_UNIT_OPTIONS } />
						</Group>
						<Group grow>
							<NumberInput name="prescription.dosage.freq_amount" label="Frequency Amount" />
							<Select name="prescription.dosage.freq_period" label="Frequency Period" options={ FREQ_PERIOD_OPTIONS } />
						</Group>
						<TextInput name="prescription.doctor_id" label="Doctor ID" required />
						<Group grow>
							<DateInput name="prescription.starts_at" label="Starts" />
							<DateInput name="prescription.ends_at" label="Ends" />
						</Group>
						<Textarea name="prescription.dosage.notes" label="Notes" minRows={ 2 } />
						<Submit>Add Prescription</Submit>
					</Stack>
				</Form>
			</Section>
		</Stack>
	)
}
