import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import DosagesTable from '../Table'

interface DosageIndexProps {
	dosages: Schema.DosagesIndex[]
	pagination: Schema.Pagination
}

const DosagesIndex = ({ dosages, pagination }: DosageIndexProps) => {
	return (
		<IndexPageTemplate
			title="Dosages"
			model="dosages"
			rows={ dosages }
			pagination={ pagination }
			deleteRoute={ Routes.dosages() }
			menuOptions={ [
				{ label: 'New Dosage', href: Routes.newDosage(), icon: <NewIcon /> },
			] }
		>
			<DosagesTable />
		</IndexPageTemplate>
	)
}

export default DosagesIndex
