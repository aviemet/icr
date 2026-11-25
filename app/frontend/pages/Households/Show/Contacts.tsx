import { HouseholdContacts } from "@/domains/Households/Contacts"

import { type ShowHouseholdProps } from "."

const Contacts = ({ household }: ShowHouseholdProps) => {
	return <HouseholdContacts household={ household } />
}

export default Contacts
