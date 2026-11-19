import { ClientHealth } from "@/domains/Clients/Health"

import { type ShowClientProps } from "."

const Health = ({ client }: ShowClientProps) => {
	return <ClientHealth client={ client } />
}

export default Health
