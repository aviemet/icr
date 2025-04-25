import { useTranslation } from "react-i18next"

import { type ShowClientProps } from "."

interface ClientDocumentsProps extends ShowClientProps {}

const Documents = ({ client }: ClientDocumentsProps) => {
	const { t } = useTranslation()

	return (
		<div>{ t("views.clients.show.documents.title") }</div>
	)
}

export default Documents
