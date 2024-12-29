import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import IdentificationForm from '../Form'

interface INewIdentificationProps {
	identification: Schema.IdentificationsFormData
}

const NewIdentification = ({ ...data }: INewIdentificationProps) => {
	const title = 'New Identification'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<IdentificationForm
					to={ Routes.identifications() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewIdentification
