import { ClientOverview } from "@/domains/Clients/Overview"

import { type ShowClientProps } from "."

const Overview = ({ client }: ShowClientProps) => {
	return <ClientOverview client={ client } />
}

export default Overview
