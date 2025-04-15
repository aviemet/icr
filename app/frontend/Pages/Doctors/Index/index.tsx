import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import DoctorsTable from "@/Features/Doctors/Table"
import { Routes } from "@/lib"

interface DoctorIndexProps {
	doctors: Schema.DoctorsIndex[]
	pagination: Schema.Pagination
}

const DoctorsIndex = ({ doctors, pagination }: DoctorIndexProps) => {
	return (
		<IndexPageTemplate
			title="Doctors"
			model="doctors"
			rows={ doctors }
			pagination={ pagination }
			deleteRoute={ Routes.doctors() }
			menuOptions={ [
				{ label: "New Doctor", href: Routes.newDoctor(), icon: <NewIcon /> },
			] }
		>
			<DoctorsTable />
		</IndexPageTemplate>
	)
}

export default DoctorsIndex
