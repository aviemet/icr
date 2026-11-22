import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { TrainingTable } from "@/domains/Trainings/Index"
import { type TrainingClientOption } from "@/domains/Trainings/Index/ClientFilter"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface TrainingIndexProps {
	trainings: Schema.EmployeeTrainingsIndex[]
	pagination: Schema.Pagination
	client_options?: TrainingClientOption[]
}

const TrainingsIndex = ({
	trainings,
	pagination,
	client_options = [],
}: TrainingIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.trainings.index.title") }
			model="trainings"
			pagination={ pagination }
			dense
			actions={ [
				{ label: t("views.trainings.index.new"), href: Routes.newTraining(), icon: <NewIcon /> },
			] }
		>
			<TrainingTable
				records={ trainings }
				model="trainings"
				clientOptions={ client_options }
				serverFiltered
			/>
		</IndexPageTemplate>
	)
}

export default TrainingsIndex
