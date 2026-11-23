import { useTranslation } from "react-i18next"

import { Group, Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import {
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
	RecordRow,
} from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

import {
	ADMIN_METHOD_OPTIONS,
	AMOUNT_UNIT_OPTIONS,
	FREQ_PERIOD_OPTIONS,
	isActivePrescription,
} from "./prescriptionHelpers"
import { PrescriptionMeta } from "./PrescriptionMeta"

interface MedicalMedicationsProps {
	client: Schema.ClientsShow
}

export function MedicalMedications({ client }: MedicalMedicationsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()
	const active = client.prescriptions.filter(isActivePrescription)
	const historical = client.prescriptions.filter(prescription => !isActivePrescription(prescription))
	const defaultDoctorId = client.doctors[0]?.id ?? ""

	return (
		<Stack gap="lg">
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
						meta={ <PrescriptionMeta prescription={ prescription } /> }
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
						meta={ <PrescriptionMeta prescription={ prescription } /> }
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
