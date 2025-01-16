import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import UsersForm from '../Form'

interface EditUserProps {
	user: Schema.UsersEdit
}

const EditUser = ({ user }: EditUserProps) => {
	const title = 'Edit User'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Users', href: Routes.users() },
			{ title: User, href: Routes.user(user.id) },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Title>{ title }</Title>
				
				<UsersForm
					method='put'
					to={ Routes.user() }
					user={ user }
				/>
			</Section>
		</Page>
	)
}

export default EditUser
