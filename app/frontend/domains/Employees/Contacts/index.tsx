import { useTranslation } from "react-i18next"

import { Stack } from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { AddressFormatter, EmailFormatter, PhoneFormatter } from "@/components/Formatters"
import { Checkbox, NumberInput, Select, TextInput, Textarea } from "@/components/Inputs"
import {
	CollectionAddModal,
	CollectionPanel,
	RecordRow,
	ShowEditToggle,
} from "@/features"
import { Routes } from "@/lib"
import { usePermissions } from "@/lib/hooks"

import { EmployeeContactForm } from "./EmployeeContactForm"

interface EmployeeContactsProps {
	employee: Schema.EmployeesShow
}

const RELATIONSHIP_OPTIONS = [
	{ value: "emergency", label: "Emergency" },
	{ value: "family", label: "Family" },
	{ value: "other", label: "Other" },
]

export function EmployeeContacts({ employee }: EmployeeContactsProps) {
	const { t } = useTranslation()
	const { can } = usePermissions()
	const canUpdate = can("employees", "update")
	const contact = employee.person.contact
	const phones = contact?.phones ?? []
	const emails = contact?.emails ?? []
	const addresses = contact?.addresses ?? []

	return (
		<Stack gap="lg">
			<ShowEditToggle
				title={ t("views.employees.show.contacts.employee_contact") }
				canUpdate={ canUpdate }
				show={ (
					<Stack gap="md">
						<CollectionPanel
							title={ t("views.employees.show.contacts.phones") }
							count={ phones.length }
							emptyLabel="-"
						>
							{ phones.map(phone => (
								<RecordRow
									key={ phone.id }
									title={ <PhoneFormatter>{ phone.number }</PhoneFormatter> }
									meta={ (
										<>
											{ phone.name && <span>{ phone.name }</span> }
											{ phone.category && <span>{ phone.category.name }</span> }
										</>
									) }
								/>
							)) }
						</CollectionPanel>

						<CollectionPanel
							title={ t("views.employees.show.contacts.emails") }
							count={ emails.length }
							emptyLabel="-"
						>
							{ emails.map(email => (
								<RecordRow
									key={ email.id }
									title={ <EmailFormatter>{ email.email }</EmailFormatter> }
									meta={ (
										<>
											{ email.name && <span>{ email.name }</span> }
											{ email.category && <span>{ email.category.name }</span> }
										</>
									) }
								/>
							)) }
						</CollectionPanel>

						<CollectionPanel
							title={ t("views.employees.show.contacts.addresses") }
							count={ addresses.length }
							emptyLabel="-"
						>
							{ addresses.map(address => (
								<RecordRow
									key={ address.id }
									title={ <AddressFormatter address={ address } /> }
								/>
							)) }
						</CollectionPanel>
					</Stack>
				) }
				edit={ <EmployeeContactForm employee={ employee } /> }
			/>

			<CollectionPanel
				title={ t("views.employees.show.contacts.support_network") }
				count={ employee.support_contacts.length }
				emptyLabel="No support contacts."
				actions={ (
					<CollectionAddModal
						canUpdate={ canUpdate }
						label={ t("views.employees.show.contacts.add_support_contact") }
					>
						<Form
							action={ Routes.employeeSupportContacts(employee.slug) }
							method="post"
							initialData={ {
								support_contact: {
									relationship: "emergency",
									priority: 1,
									is_emergency: true,
									notes: "",
									person: {
										first_name: "",
										last_name: "",
										contact: {
											phones: [{ number: "", name: "" }],
										},
									},
								},
							} }
						>
							<Stack gap="sm">
								<TextInput name="support_contact.person.first_name" label="First Name" required />
								<TextInput name="support_contact.person.last_name" label="Last Name" required />
								<Select
									name="support_contact.relationship"
									label="Relationship"
									options={ RELATIONSHIP_OPTIONS }
								/>
								<NumberInput name="support_contact.priority" label="Priority" min={ 1 } />
								<Checkbox name="support_contact.is_emergency" label="Emergency contact" />
								<TextInput name="support_contact.person.contact.phones[0].number" label="Phone" />
								<Textarea name="support_contact.notes" label="Notes" minRows={ 2 } />
								<Submit>Add Support Contact</Submit>
							</Stack>
						</Form>
					</CollectionAddModal>
				) }
			>
				{ employee.support_contacts.map(supportContact => (
					<RecordRow
						key={ supportContact.id }
						tone={ supportContact.is_emergency ? "warning" : "default" }
						title={ supportContact.is_emergency
							? `${supportContact.name} (${t("views.employees.show.contacts.emergency")})`
							: supportContact.name }
						meta={ (
							<>
								<span>{ supportContact.relationship } - priority { supportContact.priority }</span>
								{ supportContact.person?.contact?.phones?.map(phone => (
									<PhoneFormatter key={ phone.id }>{ phone.number }</PhoneFormatter>
								)) }
							</>
						) }
						actions={ canUpdate
							? (
								<DeleteButton
									href={ Routes.employeeSupportContact(employee.slug, supportContact.id) }
									label={ supportContact.name }
								/>
							)
							: undefined }
					/>
				)) }
			</CollectionPanel>
		</Stack>
	)
}
