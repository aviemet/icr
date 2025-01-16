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
import { type ShowEmployeeProps } from "."

interface EmployeeContactsProps extends ShowEmployeeProps {}

const Contacts = ({ employee }: EmployeeContactsProps) => {
	return (
		<>
			<Section mb="md">
				<Heading order={ 3 }>Phone Numbers</Heading>
				{ employee.person.contact.phones.map(phone => (
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
				{ employee.person.contact.emails.map(email => (
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
				{ employee.person.contact.addresses.map(address => (
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
