import { ComplianceHistory } from "@/domains/Clients/Compliance"

import { type ShowClientProps } from "."

const Compliance = ({ client }: ShowClientProps) => {
	return <ComplianceHistory client={ client } />
}

export default Compliance
