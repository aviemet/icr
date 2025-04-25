import { useTranslation } from "react-i18next"

import { type ShowEmployeeProps } from "."

interface EmployeeDocumentsProps extends ShowEmployeeProps {}

const Documents = ({ employee }: EmployeeDocumentsProps) => {
	const { t } = useTranslation()

	return (
		<div>{ t("views.employees.show.documents.title") }</div>
	)
}

export default Documents
