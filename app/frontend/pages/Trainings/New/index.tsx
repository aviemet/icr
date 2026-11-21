import { useTranslation } from "react-i18next"

import { TrainingForm } from "@/domains/Trainings/Form"
import { type TrainingClientOption } from "@/domains/Trainings/Index/ClientFilter"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface NewTrainingProps {
	training: Schema.EmployeeTrainingsFormData
	client_options?: TrainingClientOption[]
}

const NewTraining = ({ training, client_options = [] }: NewTrainingProps) => {
	const { t } = useTranslation()
	const title = t("views.trainings.new.title")

	return (
		<RecordFormPage
			title={ title }
			description="Define the catalog entry and any client links."
			breadcrumbs={ [
				{ title: t("views.trainings.index.title"), href: Routes.trainings() },
				{ title: "New" },
			] }
		>
			<TrainingForm
				to={ Routes.trainings() }
				training={ training }
				clientOptions={ client_options }
			/>
		</RecordFormPage>
	)
}

export default NewTraining
