import { useTranslation } from "react-i18next"

import {
	Title,
	Box,
	Text,
	Group,
	Section,
	AddressFormatter,
} from "@/components"
import { PhoneFormatter, EmailFormatter } from "@/components/Formatters"

import { type ShowEmployeeProps } from "."

interface EmployeeContactsProps extends ShowEmployeeProps {}

const Contacts = ({ employee }: EmployeeContactsProps) => {
	const { t } = useTranslation()

	return (
		<>
			<Section mb="md">
				<Title order={ 3 }>{ t("views.employees.show.contacts.phones") }</Title>
				{ employee.person.contact.phones.map(phone => (
					<Box key={ phone.id }>
						{ phone?.name && <Text>{ phone.name }</Text> }
						<Group gap="lg">
							<PhoneFormatter>
								{ phone.number }
							</PhoneFormatter>
							<Text>{ phone.category.name }</Text>
						</Group>
					</Box>
				)) }
			</Section>

			<Section mb="md">
				<Title order={ 3 }>{ t("views.employees.show.contacts.emails") }</Title>
				{ employee.person.contact.emails.map(email => (
					<Box key={ email.id }>
						{ email?.name && <Text>{ email.name }</Text> }
						<Group gap="lg">
							<EmailFormatter>
								{ email.email }
							</EmailFormatter>
							<Text>{ email.category.name }</Text>
						</Group>
					</Box>
				)) }
			</Section>

			<Section mb="md">
				<Title order={ 3 }>{ t("views.employees.show.contacts.addresses") }</Title>
				{ employee.person.contact.addresses.map(address => (
					<Box key={ address.id }>
						<Group gap="lg">
							<AddressFormatter address={ address } />
						</Group>
					</Box>
				)) }
			</Section>
		</>
	)
}

export default Contacts
