import { Group, Heading, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface ShowUserProps {
	user: Schema.UsersShow
}

const ShowUser = ({ user }: ShowUserProps) => {
	const title =  'User'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'User', href: Routes.users() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editUser(user.id) }>
								Edit User
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowUser
