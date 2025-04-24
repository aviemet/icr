import { type ShowEmployeeProps } from "."

interface EmployeeDocumentsProps extends ShowEmployeeProps {}

const Documents = ({ employee }: EmployeeDocumentsProps) => {
	return (
		<div>Documents</div>
	)
}

export default Documents
