import { ClientCareServices } from "@/domains/Clients/CareServices"

import { type ShowClientProps } from "."

const Care = ({ client }: ShowClientProps) => {
	return <ClientCareServices client={ client } />
}

export default Care
