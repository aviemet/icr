import { useTranslation } from "react-i18next"

import { Group, Link, Stack, Text } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import {
	Checkbox,
	DateInput,
	NumberInput,
	Select,
	TextInput,
	Textarea,
} from "@/components/Inputs"
import { DoctorsDropdown } from "@/components/Inputs/Dropdowns"
import {
	CollectionAddModal,
	CollectionPanel,
	MetricTile,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface ClientMedicalProps {
	client: Schema.ClientsShow
}

const SEVERITY_OPTIONS = [
	{ value: "mild", label: "Mild" },
	{ value: "moderate", label: "Moderate" },
	{ value: "severe", label: "Severe" },
	{ value: "life_threatening", label: "Life Threatening" },
]

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

const ADMIN_METHOD_OPTIONS = [
	{ value: "oral", label: "Oral" },
	{ value: "sublingual", label: "Sublingual" },
	{ value: "injection", label: "Injection" },
	{ value: "topical", label: "Topical" },
	{ value: "inhaled", label: "Inhaled" },
	{ value: "rectal", label: "Rectal" },
	{ value: "other", label: "Other" },
]

function allergyTone(severity: string) {
	if(severity === "life_threatening" || severity === "severe") return "danger"
	if(severity === "moderate") return "warning"
	return "default"
}

function isActivePrescription(prescription: Schema.PrescriptionsPersisted) {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const starts = prescription.starts_at ? new Date(prescription.starts_at) : null
	const ends = prescription.ends_at ? new Date(prescription.ends_at) : null
	const started = !starts || starts <= today
	const notEnded = !ends || ends >= today
	return started && notEnded
}

function dosageLabel(dosage?: Schema.Dosage) {
	if(!dosage) return ""

	const amount = `${dosage.amount ?? ""} ${dosage.amount_unit ?? ""}`.trim()
	const frequency = `${dosage.freq_amount ?? ""} ${dosage.freq_period ?? ""}`.trim()
	const method = dosage.administration_method || ""
	return [amount, frequency ? `every ${frequency}` : "", method].filter(Boolean).join(" - ")
}

function prescriptionMeta(prescription: Schema.PrescriptionsPersisted) {
	const label = dosageLabel(prescription.dosage)

	return (
		<>
			{ label && <span>{ label }</span> }
			<span>Doctor: { prescription.doctor?.person?.name || prescription.doctor?.name || "-" }</span>
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

export function ClientMedical({ client }: ClientMedicalProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const active = client.prescriptions.filter(isActivePrescription)
	const historical = client.prescriptions.filter(prescription => !isActivePrescription(prescription))
	const defaultDoctorId = client.doctors[0]?.id ?? ""
	const incidentOptions = client.incident_reports.map(incident => ({
		value: incident.id,
		label: incident.occurred_at
			? `${incident.location || "Incident"} (${String(incident.occurred_at)})`
			: (incident.location || incident.id),
	}))

	return (
		<Stack gap="lg">
			<MetricTile title={ t("views.clients.show.medical.preferred_hospital") }>
				<Text size="sm">{ client.preferred_hospital || "-" }</Text>
			</MetricTile>

			<CollectionPanel
				title={ t("views.clients.show.medical.doctors") }
				count={ client.doctors_clients.length }
				emptyLabel="No doctors linked."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.medical.link_doctor") }
					>
						<Form
							action={ Routes.clientDoctors(client.slug) }
							method="post"
							initialData={ { doctor_id: "", notes: "" } }
						>
							<Stack gap="sm">
								<DoctorsDropdown name="doctor_id" required />
								<Textarea name="notes" label="Notes" minRows={ 2 } />
								<Submit>Link Doctor</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.doctors_clients.map(doctorsClient => (
					<RecordRow
						key={ doctorsClient.id }
						title={ (
							<Link href={ Routes.doctor(doctorsClient.doctor.slug) }>
								{ doctorsClient.doctor.person?.name || doctorsClient.doctor.name }
							</Link>
						) }
						meta={ (
							<>
								{ doctorsClient.doctor.specialty && <span>{ doctorsClient.doctor.specialty }</span> }
								{ doctorsClient.notes && <span>{ doctorsClient.notes }</span> }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientDoctor(client.slug, doctorsClient.doctor_id) }
									label={ doctorsClient.doctor.person?.name || doctorsClient.doctor.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.medical.allergies") }
				count={ client.allergies.length }
				emptyLabel="No allergies recorded."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.medical.add_allergy") }
					>
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
					</CollectionAddModal>
				) }
			>
				{ client.allergies.map(allergy => (
					<RecordRow
						key={ allergy.id }
						tone={ allergyTone(allergy.severity) }
						title={ `${allergy.name} (${allergy.severity})` }
						meta={ (
							<>
								{ allergy.reaction && <span>{ allergy.reaction }</span> }
								{ !allergy.active && <span>Inactive</span> }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientAllergy(client.slug, allergy.id) }
									label={ allergy.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.medical.diagnoses") }
				count={ client.diagnoses.length }
				emptyLabel="No diagnoses recorded."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.medical.add_diagnosis") }
					>
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
									doctor_id: defaultDoctorId,
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="diagnosis.name" label="Name" required />
								<TextInput name="diagnosis.code" label="Code" />
								<DateInput name="diagnosis.diagnosed_on" label="Diagnosed On" />
								<DoctorsDropdown name="diagnosis.doctor_id" />
								<Textarea name="diagnosis.notes" label="Notes" minRows={ 2 } />
								<Checkbox name="diagnosis.active" label="Active" />
								<Submit>Add Diagnosis</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.diagnoses.map(diagnosis => (
					<RecordRow
						key={ diagnosis.id }
						title={ diagnosis.code ? `${diagnosis.name} (${diagnosis.code})` : diagnosis.name }
						meta={ (
							<>
								{ diagnosis.doctor && (
									<span>
										Doctor:{ " " }
										<Link href={ Routes.doctor(diagnosis.doctor.slug) }>
											{ diagnosis.doctor.person?.name || diagnosis.doctor.name }
										</Link>
									</span>
								) }
								{ !diagnosis.active && <span>Inactive</span> }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientDiagnosis(client.slug, diagnosis.id) }
									label={ diagnosis.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.clients.show.medical.active_prescriptions") }
				count={ active.length }
				emptyLabel="No active prescriptions."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.medical.add_prescription") }
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
										administration_method: "oral",
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
								<Select
									name="prescription.dosage.administration_method"
									label="Administration Method"
									options={ ADMIN_METHOD_OPTIONS }
								/>
								<DoctorsDropdown name="prescription.doctor_id" required />
								<Group grow>
									<DateInput name="prescription.starts_at" label="Starts" />
									<DateInput name="prescription.ends_at" label="Ends" />
								</Group>
								<Textarea name="prescription.dosage.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Prescription</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
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
				title={ t("views.clients.show.medical.historical_prescriptions") }
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

			<CollectionPanel
				title={ t("views.clients.show.medical.hospital_visits") }
				count={ client.hospital_visits.length }
				emptyLabel="No hospital visits recorded."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.clients.show.medical.add_hospital_visit") }
					>
						<Form
							action={ Routes.clientHospitalVisits(client.slug) }
							method="post"
							initialData={ {
								hospital_visit: {
									hospital_name: client.preferred_hospital || "",
									doctor_id: defaultDoctorId,
									incident_report_id: "",
									admitted_at: "",
									discharged_at: "",
									reason: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="hospital_visit.hospital_name" label="Hospital" required />
								<DoctorsDropdown name="hospital_visit.doctor_id" />
								<Select
									name="hospital_visit.incident_report_id"
									label="Related Incident"
									options={ incidentOptions }
									clearable
								/>
								<Group grow>
									<DateInput name="hospital_visit.admitted_at" label="Admitted" />
									<DateInput name="hospital_visit.discharged_at" label="Discharged" />
								</Group>
								<TextInput name="hospital_visit.reason" label="Reason" />
								<Textarea name="hospital_visit.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Hospital Visit</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ client.hospital_visits.map(visit => (
					<RecordRow
						key={ visit.id }
						title={ visit.hospital_name }
						meta={ (
							<>
								{ visit.reason && <span>{ visit.reason }</span> }
								{ visit.doctor && (
									<span>
										Doctor:{ " " }
										<Link href={ Routes.doctor(visit.doctor.slug) }>
											{ visit.doctor.person?.name || visit.doctor.name }
										</Link>
									</span>
								) }
								<span>
									{ visit.admitted_at
										? <DateTimeFormatter>{ visit.admitted_at }</DateTimeFormatter>
										: "-" }
									{ " - " }
									{ visit.discharged_at
										? <DateTimeFormatter>{ visit.discharged_at }</DateTimeFormatter>
										: "Ongoing" }
								</span>
								{ visit.incident_report_id && (
									<span>
										<Link href={ Routes.incidentReport(visit.incident_report_id) }>
											Incident
										</Link>
									</span>
								) }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.clientHospitalVisit(client.slug, visit.id) }
									label={ visit.hospital_name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
