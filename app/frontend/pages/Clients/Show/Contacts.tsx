import {
	Title,
	Box,
	Text,
	Group,
	Section,
	AddressFormatter,
} from "@/components"
import { PhoneFormatter, EmailFormatter } from "@/components/Formatters"

import { type ShowClientProps } from "."

interface ClientContactsProps extends ShowClientProps {}

const Contacts = ({ client }: ClientContactsProps) => {
	return (
		<>
			<Section mb="md">
				<Title order={ 3 }>Phone Numbers</Title>
				{ client.person.contact.phones.map(phone => (
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
				{ client.person.contact.emails.map(email => (
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
				{ client.person.contact.addresses.map(address => (
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
