import { ClientContacts } from "@/domains/Clients/Contacts"

import { type ShowClientProps } from "."

const Contacts = ({ client }: ShowClientProps) => {
	return <ClientContacts client={ client } />
}

export default Contacts
