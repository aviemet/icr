import { NewIcon } from "@/components/Icons"
import { TrainingTable } from "@/domains/Trainings/Index"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"


interface TrainingIndexProps {
	trainings: Schema.TrainingsIndex[]
	pagination: Schema.Pagination
}

const TrainingsIndex = ({ trainings, pagination }: TrainingIndexProps) => {
	return (
		<IndexPageTemplate
			title="Trainings"
			model="trainings"
			pagination={ pagination }
			menuOptions={ [
				{ label: "New Training", href: Routes.newTraining(), icon: <NewIcon /> },
			] }
		>
			<TrainingTable records={ trainings } pagination={ pagination } model="trainings" />
		</IndexPageTemplate>
	)
}

export default TrainingsIndex
