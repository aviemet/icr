import { Title, Page, Section } from "@/components"
import { Routes } from "@/lib"

import TrainingsForm from "../Form"

interface EditTrainingProps {
	training: Schema.TrainingsEdit
}

const EditTraining = ({ training }: EditTrainingProps) => {
	const title = "Edit Training"

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Trainings", href: Routes.trainings() },
			{ title: "Training", href: Routes.training(training.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>

				<TrainingsForm
					method="put"
					to={ Routes.training(training.id) }
					training={ training }
				/>
			</Section>
		</Page>
	)
}

export default EditTraining
