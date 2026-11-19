import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { CollectionAddModal, CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"
import { useRecordCanUpdate } from "@/lib/hooks"

interface EmployeeCredentialsProps {
	employee: Schema.EmployeesShow
}

const CREDENTIAL_TYPE_OPTIONS = [
	{ value: "cpr", label: "CPR" },
	{ value: "first_aid", label: "First Aid" },
	{ value: "drivers_license", label: "Driver's License" },
	{ value: "professional_license", label: "Professional License" },
	{ value: "other", label: "Other" },
]

const CLEARANCE_TYPE_OPTIONS = [
	{ value: "tb", label: "TB" },
	{ value: "physical", label: "Physical" },
	{ value: "other", label: "Other" },
]

const CLEARANCE_STATUS_OPTIONS = [
	{ value: "pending", label: "Pending" },
	{ value: "cleared", label: "Cleared" },
	{ value: "expired", label: "Expired" },
]

const ID_TYPE_OPTIONS = [
	{ value: "drivers_license", label: "Driver's License" },
	{ value: "passport", label: "Passport" },
	{ value: "state_id", label: "State ID" },
	{ value: "military_id", label: "Military ID" },
	{ value: "employee_id", label: "Employee ID" },
	{ value: "other", label: "Other" },
]

function expiryTone(expiresOn: string | Date | null | undefined) {
	if(!expiresOn) return "default"
	const expires = new Date(expiresOn)
	const soon = new Date()
	soon.setDate(soon.getDate() + 60)
	if(expires < new Date()) return "danger"
	if(expires <= soon) return "warning"
	return "default"
}

export function EmployeeCredentials({ employee }: EmployeeCredentialsProps) {
	const { t } = useTranslation()
	const canUpdate = useRecordCanUpdate()

	return (
		<Stack gap="lg">
			<CollectionPanel
				title={ t("views.employees.show.credentials.identifications") }
				count={ employee.identifications.length }
				emptyLabel="No identifications."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.credentials.add_identification") }
					>
						<Form
							action={ Routes.employeeIdentifications(employee.slug) }
							method="post"
							initialData={ {
								identification: {
									id_type: "drivers_license",
									number: "",
									issued_at: "",
									expires_at: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<Select name="identification.id_type" label="Type" options={ ID_TYPE_OPTIONS } />
								<TextInput name="identification.number" label="Number" required />
								<DateInput name="identification.issued_at" label="Issued" />
								<DateInput name="identification.expires_at" label="Expires" />
								<Textarea name="identification.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Identification</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ employee.identifications.map(identification => (
					<RecordRow
						key={ identification.id }
						tone={ expiryTone(identification.expires_at) }
						title={ `${identification.id_type} - ${identification.number}` }
						meta={ identification.expires_at
							? <DateTimeFormatter>{ identification.expires_at }</DateTimeFormatter>
							: "-" }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeIdentification(employee.slug, identification.id) }
									label={ identification.number }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.employees.show.credentials.credentials") }
				count={ employee.credentials.length }
				emptyLabel="No credentials."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.credentials.add_credential") }
					>
						<Form
							action={ Routes.employeeCredentials(employee.slug) }
							method="post"
							initialData={ {
								credential: {
									name: "",
									credential_type: "cpr",
									number: "",
									issued_on: "",
									expires_on: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="credential.name" label="Name" required />
								<Select name="credential.credential_type" label="Type" options={ CREDENTIAL_TYPE_OPTIONS } />
								<TextInput name="credential.number" label="Number" />
								<DateInput name="credential.issued_on" label="Issued" />
								<DateInput name="credential.expires_on" label="Expires" />
								<Textarea name="credential.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Credential</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ employee.credentials.map(credential => (
					<RecordRow
						key={ credential.id }
						tone={ expiryTone(credential.expires_on) }
						title={ credential.name }
						meta={ (
							<>
								<span>{ credential.credential_type }</span>
								{ credential.expires_on && (
									<span><DateTimeFormatter>{ credential.expires_on }</DateTimeFormatter></span>
								) }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeCredential(employee.slug, credential.id) }
									label={ credential.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>

			<CollectionPanel
				title={ t("views.employees.show.credentials.clearances") }
				count={ employee.clearances.length }
				emptyLabel="No clearances."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.credentials.add_clearance") }
					>
						<Form
							action={ Routes.employeeClearances(employee.slug) }
							method="post"
							initialData={ {
								clearance: {
									clearance_type: "tb",
									status: "pending",
									cleared_on: "",
									expires_on: "",
									notes: "",
								},
							} }
						>
							<Stack gap="sm">
								<Select name="clearance.clearance_type" label="Type" options={ CLEARANCE_TYPE_OPTIONS } />
								<Select name="clearance.status" label="Status" options={ CLEARANCE_STATUS_OPTIONS } />
								<DateInput name="clearance.cleared_on" label="Cleared On" />
								<DateInput name="clearance.expires_on" label="Expires" />
								<Textarea name="clearance.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Clearance</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ employee.clearances.map(clearance => (
					<RecordRow
						key={ clearance.id }
						tone={ clearance.status === "expired" ? "danger" : expiryTone(clearance.expires_on) }
						title={ `${clearance.clearance_type} (${clearance.status})` }
						meta={ clearance.expires_on
							? <DateTimeFormatter>{ clearance.expires_on }</DateTimeFormatter>
							: "-" }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeClearance(employee.slug, clearance.id) }
									label={ clearance.clearance_type }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
