import { useTranslation } from "react-i18next"

import { Group, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, NumberInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

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

function prescriptionMeta(prescription: Schema.PrescriptionsPersisted) {
	const dosage = prescription.dosage
	const dosageLabel = dosage
		? `${dosage.amount} ${dosage.amount_unit ?? ""} every ${dosage.freq_amount ?? ""} ${dosage.freq_period ?? ""}`
		: ""

	return (
		<>
			{ dosageLabel && <span>{ dosageLabel }</span> }
			<span>Doctor: { prescription.doctor?.person?.name || "-" }</span>
			<span>
				{ prescription.starts_at
					? <DateTimeFormatter>{ prescription.starts_at }</DateTimeFormatter>
					: "-" }
				{ " - " }
				{ prescription.ends_at
					? <DateTimeFormatter>{ prescription.ends_at }</DateTimeFormatter>
					: "Ongoing" }
			</span>
		</>
	)
}

export function ClientMedications({ client }: ClientMedicationsProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = can("clients", "update")
	const active = client.prescriptions.filter(isActivePrescription)
	const historical = client.prescriptions.filter(prescription => !isActivePrescription(prescription))
	const defaultDoctorId = client.doctors[0]?.id ?? ""

	const addModal = (
		<CollectionAddModal
			canUpdate={ canUpdate }
			label={ t("views.clients.show.medications.add") }
		>
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
		</CollectionAddModal>
	)

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.clients.show.medications.active") }
				count={ active.length }
				emptyLabel="No active prescriptions."
				actions={ addModal }
			>
				{ active.map(prescription => (
					<RecordRow
						key={ prescription.id }
						title={ prescription.medication?.name }
						meta={ prescriptionMeta(prescription) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientPrescription(client.slug, prescription.id) }
									label={ prescription.medication?.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.medications.historical") }
				count={ historical.length }
				emptyLabel="No historical prescriptions."
			>
				{ historical.map(prescription => (
					<RecordRow
						key={ prescription.id }
						title={ prescription.medication?.name }
						meta={ prescriptionMeta(prescription) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientPrescription(client.slug, prescription.id) }
									label={ prescription.medication?.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
