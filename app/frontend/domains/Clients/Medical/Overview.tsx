import { useTranslation } from "react-i18next"

import { Link, Stack, Text } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import {
	Checkbox,
	DateInput,
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

interface MedicalOverviewProps {
	client: Schema.ClientsShow
}

const SEVERITY_OPTIONS = [
	{ value: "mild", label: "Mild" },
	{ value: "moderate", label: "Moderate" },
	{ value: "severe", label: "Severe" },
	{ value: "life_threatening", label: "Life Threatening" },
]

function allergyTone(severity: string) {
	if(severity === "life_threatening" || severity === "severe") return "danger"
	if(severity === "moderate") return "warning"
	return "default"
}

export function MedicalOverview({ client }: MedicalOverviewProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const defaultDoctorId = client.doctors[0]?.id ?? ""

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
		</Stack>
	)
}
