import { Title, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import TrainingForm from '../Form'

interface NewTrainingProps {
	training: Schema.TrainingsFormData
}

const NewTraining = ({ ...data }: NewTrainingProps) => {
	const title = 'New Training'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Trainings', href: Routes.trainings() },
			{ title: 'New Training', href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<TrainingForm
					to={ Routes.trainings() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewTraining
