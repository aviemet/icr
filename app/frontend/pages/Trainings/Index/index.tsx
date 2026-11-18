import { NewIcon } from "@/components/Icons"
import { TrainingTable } from "@/domains/Trainings/Index"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"


interface TrainingIndexProps {
	trainings: Schema.EmployeeTrainingsIndex[]
	pagination: Schema.Pagination
}

const TrainingsIndex = ({ trainings, pagination }: TrainingIndexProps) => {
	return (
		<IndexPageTemplate
			title="Trainings"
			model="trainings"
			pagination={ pagination }
			actions={ [
				{ label: "New Training", href: Routes.newTraining(), icon: <NewIcon /> },
			] }
		>
			<TrainingTable records={ trainings } model="trainings" />
		</IndexPageTemplate>
	)
}

export default TrainingsIndex
