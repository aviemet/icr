import { ClientMedical } from "@/domains/Clients/Medical"

import { type ShowClientProps } from "."

const Medical = ({ client }: ShowClientProps) => {
	return <ClientMedical client={ client } />
}

export default Medical
