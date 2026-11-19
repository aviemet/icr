import { ClientIncidents } from "@/domains/Clients/Incidents"

import { type ShowClientProps } from "."

const Incidents = ({ client }: ShowClientProps) => {
	return <ClientIncidents client={ client } />
}

export default Incidents
