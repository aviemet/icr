import { ClientMedications } from "@/domains/Clients/Medications"

import { type ShowClientProps } from "."

const Medications = ({ client }: ShowClientProps) => {
	return <ClientMedications client={ client } />
}

export default Medications
