import { useTranslation } from "react-i18next"

import { Group, Section, Stack, Text, Title } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { DateTimeFormatter } from "@/components/Formatters"
import { DateInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

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

export function EmployeeCredentials({ employee }: EmployeeCredentialsProps) {
	const { t } = useTranslation()

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.credentials.identifications") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.identifications.map(identification => (
						<Group key={ identification.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ identification.id_type } - { identification.number }</Text>
								<Text size="sm" c="dimmed">
									{ identification.expires_at
										? <><DateTimeFormatter>{ identification.expires_at }</DateTimeFormatter></>
										: "-" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeIdentification(employee.slug, identification.id) }
								label={ identification.number }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.credentials.add_identification") }</Title>
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
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.credentials.credentials") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.credentials.map(credential => (
						<Group key={ credential.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ credential.name }</Text>
								<Text size="sm" c="dimmed">
									{ credential.credential_type }
									{ credential.expires_on
										? <> - <DateTimeFormatter>{ credential.expires_on }</DateTimeFormatter></>
										: "" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeCredential(employee.slug, credential.id) }
								label={ credential.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.credentials.add_credential") }</Title>
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
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.employees.show.credentials.clearances") }</Title>
				<Stack gap="sm" mb="lg">
					{ employee.clearances.map(clearance => (
						<Group key={ clearance.id } justify="space-between">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>{ clearance.clearance_type } ({ clearance.status })</Text>
								<Text size="sm" c="dimmed">
									{ clearance.expires_on
										? <DateTimeFormatter>{ clearance.expires_on }</DateTimeFormatter>
										: "-" }
								</Text>
							</Stack>
							<DeleteButton
								href={ Routes.employeeClearance(employee.slug, clearance.id) }
								label={ clearance.clearance_type }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.employees.show.credentials.add_clearance") }</Title>
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
			</Section>
		</Stack>
	)
}
