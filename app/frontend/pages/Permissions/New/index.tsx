import { Title, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import PermissionForm from '../Form'

interface NewPermissionProps {
	permission: Schema.PermissionsFormData
}

const NewPermission = ({ ...data }: NewPermissionProps) => {
	const title = 'New Permission'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Permissions', href: Routes.permissions() },
			{ title: 'New Permission', href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<PermissionForm
					to={ Routes.permissions() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewPermission
