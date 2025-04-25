import { useTranslation } from "react-i18next"

import { Text, Title } from "@/components"

import { type ShowEmployeeProps } from "."

interface EmployeeDetailsProps extends ShowEmployeeProps {}

const Details = ({ employee }: EmployeeDetailsProps) => {
	const { t } = useTranslation()

	return (
		<Text>{ t("views.employees.show.details.placeholder") }</Text>
	)
}

export default Details
