import { NewIcon } from "@/Components/Icons"
import { IndexPageTemplate } from "@/Features"
import { Routes } from "@/lib"

import TrainingsTable from "../Table"

interface TrainingIndexProps {
	trainings: Schema.TrainingsIndex[]
	pagination: Schema.Pagination
}

const TrainingsIndex = ({ trainings, pagination }: TrainingIndexProps) => {
	return (
		<IndexPageTemplate
			title="Trainings"
			model="trainings"
			rows={ trainings }
			pagination={ pagination }
			menuOptions={ [
				{ label: "New Training", href: Routes.newTraining(), icon: <NewIcon /> },
			] }
		>
			<TrainingsTable />
		</IndexPageTemplate>
	)
}

export default TrainingsIndex
