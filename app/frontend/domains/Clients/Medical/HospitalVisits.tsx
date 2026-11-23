import { useTranslation } from "react-i18next"

import { Group, Link, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import {
	DateInput,
	Select,
	TextInput,
	Textarea,
} from "@/components/Inputs"
import { DoctorsDropdown } from "@/components/Inputs/Dropdowns"
import {
	CollectionAddModal,
	CollectionPanel,
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface MedicalHospitalVisitsProps {
	client: Schema.ClientsShow
}

export function MedicalHospitalVisits({ client }: MedicalHospitalVisitsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const defaultDoctorId = client.doctors[0]?.id ?? ""
	const incidentOptions = client.incident_reports.map(incident => ({
		value: incident.id,
		label: incident.occurred_at
			? `${incident.location || "Incident"} (${String(incident.occurred_at)})`
			: (incident.location || incident.id),
	}))

	return (
		<Stack gap="lg">
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
