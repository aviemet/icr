import { useTranslation } from "react-i18next"

import { TrainingAvailabilityButton } from "@/domains/Trainings/AvailabilityButton"
import { TrainingForm } from "@/domains/Trainings/Form"
import { type TrainingClientOption } from "@/domains/Trainings/Index/ClientFilter"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface EditTrainingProps {
	training: Schema.EmployeeTrainingsEdit
	client_options?: TrainingClientOption[]
}

const EditTraining = ({ training, client_options = [] }: EditTrainingProps) => {
	const { t } = useTranslation()
	const title = t("views.trainings.edit.title")

	return (
		<RecordFormPage
			title={ title }
			description="Update the catalog entry and client links."
			breadcrumbs={ [
				{ title: t("views.trainings.index.title"), href: Routes.trainings() },
				{ title: training.name || t("views.trainings.show.title"), href: Routes.training(training.id) },
				{ title: "Edit" },
			] }
			actions={ <TrainingAvailabilityButton training={ training } /> }
		>
			<TrainingForm
				method="put"
				to={ Routes.training(training.id) }
				training={ training }
				clientOptions={ client_options }
			/>
		</RecordFormPage>
	)
}

export default EditTraining
