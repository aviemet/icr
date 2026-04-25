import { NewIcon } from "@/components/Icons"
import { DoctorTable } from "@/domains/Doctors/Table"
import { IndexPageTemplate } from "@/features"
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
			pagination={ pagination }
			deleteRoute={ Routes.doctors() }
			menuOptions={ [
				{ label: "New Doctor", href: Routes.newDoctor(), icon: <NewIcon /> },
			] }
		>
			<DoctorTable records={ doctors } pagination={ pagination } model="doctors" />
		</IndexPageTemplate>
	)
}

export default DoctorsIndex
