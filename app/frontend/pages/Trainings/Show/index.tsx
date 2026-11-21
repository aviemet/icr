import { useTranslation } from "react-i18next"

import { Group } from "@/components"
import { DeleteButton, EditButton } from "@/components/Button"
import { ClockIcon } from "@/components/Icons"
import { TrainingShowDetails } from "@/domains/Trainings/Show"
import { RecordFormPage } from "@/features"
import { Routes } from "@/lib"

interface ShowTrainingProps {
	training: Schema.EmployeeTrainingsShow
}

const ShowTraining = ({ training }: ShowTrainingProps) => {
	const { t } = useTranslation()
	const title = training.name || t("views.trainings.show.title")

	return (
		<RecordFormPage
			title={ title }
			description={ t(`views.trainings.availability.${training.status}`, { defaultValue: training.status }) }
			breadcrumbs={ [
				{ title: t("views.trainings.index.title"), href: Routes.trainings() },
				{ title },
			] }
			icon={ <ClockIcon size={ 16 } /> }
			actions={ (
				<Group gap="xs">
					<EditButton href={ Routes.editTraining(training.id) } label={ title } />
					<DeleteButton href={ Routes.training(training.id) } label={ title } />
				</Group>
			) }
		>
			<TrainingShowDetails training={ training } />
		</RecordFormPage>
	)
}

export default ShowTraining
