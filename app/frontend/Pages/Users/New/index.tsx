import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import UserForm from '../Form'

interface NewUserProps {
	user: Schema.UsersFormData
}

const NewUser = ({ ...data }: NewUserProps) => {
	const title = 'New User'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Users', href: Routes.users() },
			{ title: 'New User', href: window.location.href },
		] }>

			<Section>
				<Title>{ title }</Title>

				<UserForm
					to={ Routes.users() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewUser
