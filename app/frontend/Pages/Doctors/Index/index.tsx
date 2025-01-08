import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import DoctorsTable from '../Table'

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
				{ label: 'New Doctor', href: Routes.newDoctor(), icon: <NewIcon /> },
			] }
		>
			<DoctorsTable />
		</IndexPageTemplate>
	)
}

export default DoctorsIndex
