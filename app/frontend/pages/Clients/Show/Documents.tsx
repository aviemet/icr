import { ClientDocuments } from "@/domains/Clients/Documents"

import { type ShowClientProps } from "."

const Documents = ({ client }: ShowClientProps) => {
	return <ClientDocuments client={ client } />
}

export default Documents
