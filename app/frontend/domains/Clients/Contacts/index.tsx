import { useTranslation } from "react-i18next"

import {
	Box,
	Group,
	Section,
	Stack,
	Text,
	Title,
} from "@/components"
import { DeleteButton } from "@/components/Button"
import { Form, Submit } from "@/components/Form"
import { AddressFormatter, EmailFormatter, PhoneFormatter } from "@/components/Formatters"
import { Checkbox, NumberInput, Select, TextInput, Textarea } from "@/components/Inputs"
import { Routes } from "@/lib"

import { ClientContactForm } from "./ClientContactForm"

interface ClientContactsProps {
	client: Schema.ClientsShow
}

const RELATIONSHIP_OPTIONS = [
	{ value: "emergency", label: "Emergency" },
	{ value: "family", label: "Family" },
	{ value: "guardian", label: "Guardian" },
	{ value: "conservator", label: "Conservator" },
	{ value: "authorized_rep", label: "Authorized Rep" },
	{ value: "other", label: "Other" },
]

export function ClientContacts({ client }: ClientContactsProps) {
	const { t } = useTranslation()
	const contact = client.person.contact

	return (
		<Stack gap="xl">
			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.contacts.client_contact") }</Title>
				<ClientContactForm client={ client } />
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.contacts.phones") }</Title>
				{ contact?.phones?.map(phone => (
					<Box key={ phone.id } mb="sm">
						{ phone.name && <Text>{ phone.name }</Text> }
						<Group gap="lg">
							<PhoneFormatter>{ phone.number }</PhoneFormatter>
							{ phone.category && <Text>{ phone.category.name }</Text> }
						</Group>
					</Box>
				)) }
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.contacts.emails") }</Title>
				{ contact?.emails?.map(email => (
					<Box key={ email.id } mb="sm">
						{ email.name && <Text>{ email.name }</Text> }
						<Group gap="lg">
							<EmailFormatter>{ email.email }</EmailFormatter>
							{ email.category && <Text>{ email.category.name }</Text> }
						</Group>
					</Box>
				)) }
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.contacts.addresses") }</Title>
				{ contact?.addresses?.map(address => (
					<Box key={ address.id } mb="sm">
						<AddressFormatter address={ address } />
					</Box>
				)) }
			</Section>

			<Section>
				<Title order={ 3 } mb="md">{ t("views.clients.show.contacts.support_network") }</Title>
				<Stack gap="md" mb="lg">
					{ client.support_contacts.map(supportContact => (
						<Group key={ supportContact.id } justify="space-between" align="flex-start">
							<Stack gap={ 2 }>
								<Text fw={ 600 }>
									{ supportContact.name }
									{ supportContact.is_emergency ? ` (${t("views.clients.show.contacts.emergency")})` : "" }
								</Text>
								<Text size="sm" c="dimmed">
									{ supportContact.relationship } - priority { supportContact.priority }
								</Text>
								{ supportContact.person?.contact?.phones?.map(phone => (
									<PhoneFormatter key={ phone.id }>{ phone.number }</PhoneFormatter>
								)) }
							</Stack>
							<DeleteButton
								href={ Routes.clientSupportContact(client.slug, supportContact.id) }
								label={ supportContact.name }
							/>
						</Group>
					)) }
				</Stack>

				<Title order={ 4 } mb="sm">{ t("views.clients.show.contacts.add_support_contact") }</Title>
				<Form
					action={ Routes.clientSupportContacts(client.slug) }
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
						<Group grow>
							<TextInput name="support_contact.person.first_name" label="First Name" required />
							<TextInput name="support_contact.person.last_name" label="Last Name" required />
						</Group>
						<Group grow>
							<Select
								name="support_contact.relationship"
								label="Relationship"
								options={ RELATIONSHIP_OPTIONS }
							/>
							<NumberInput name="support_contact.priority" label="Priority" min={ 1 } />
						</Group>
						<Checkbox name="support_contact.is_emergency" label="Emergency contact" />
						<TextInput name="support_contact.person.contact.phones[0].number" label="Phone" />
						<Textarea name="support_contact.notes" label="Notes" minRows={ 2 } />
						<Submit>Add Support Contact</Submit>
					</Stack>
				</Form>
			</Section>
		</Stack>
	)
}
