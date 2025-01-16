import {
	Heading,
	PhoneNumber,
	Box,
	Text,
	Group,
	Section,
	EmailDisplay,
	AddressDisplay,

} from "@/Components"
import { type ShowClientProps } from "."

interface ClientContactsProps extends ShowClientProps {}

const Contacts = ({ client }: ClientContactsProps) => {
	return (
		<>
			<Section mb="md">
				<Heading order={ 3 }>Phone Numbers</Heading>
				{ client.person.contact.phones.map(phone => (
					<Box key={ phone.id }>
						{ phone?.name && <Text>{ phone.name }</Text> }
						<Group gap="lg">
							<PhoneNumber>
								{ phone.number }
							</PhoneNumber>
							<Text>{ phone.category.name }</Text>
						</Group>
					</Box>
				)) }
			</Section>

			<Section mb="md">
				<Heading order={ 3 }>Emails</Heading>
				{ client.person.contact.emails.map(email => (
					<Box key={ email.id }>
						{ email?.name && <Text>{ email.name }</Text> }
						<Group gap="lg">
							<EmailDisplay>
								{ email.email }
							</EmailDisplay>
							<Text>{ email.category.name }</Text>
						</Group>
					</Box>
				)) }
			</Section>

			<Section mb="md">
				<Heading order={ 3 }>Addresses</Heading>
				{ client.person.contact.addresses.map(address => (
					<Box key={ address.id }>
						<Group gap="lg">
							<AddressDisplay address={ address } />
						</Group>
					</Box>
				)) }
			</Section>
		</>
	)
}

export default Contacts
