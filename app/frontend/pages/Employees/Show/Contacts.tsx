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
	return (
		<>
			<Section mb="md">
				<Title order={ 3 }>Phone Numbers</Title>
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
				<Title order={ 3 }>Emails</Title>
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
				<Title order={ 3 }>Addresses</Title>
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
