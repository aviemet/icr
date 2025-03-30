import { Text, Title } from "@/Components"

import { type ShowEmployeeProps } from "."

interface EmployeeDetailsProps extends ShowEmployeeProps {}

const Details = ({ employee }: EmployeeDetailsProps) => {
	return (
		<Text>Some kind of useful dashboard, maybe important or commonly needed information and a picture. Maybe some stats and/or charts computed from other data. Could even be just a list of useful links for the employee, curated by the agency.</Text>
	)
}

export default Details
