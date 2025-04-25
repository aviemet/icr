import { Group, Title, Menu, Page, Section } from '@/Components'
import { Routes } from '@/lib'

interface ShowPermissionProps {
	permission: Schema.PermissionsShow
}

const ShowPermission = ({ permission }: ShowPermissionProps) => {
	const title =  'Permission'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Permission', href: Routes.permissions() },
			{ title, href: window.location.href },
		] }>
			<Section>
				<Group justify="space-between">
					<Title>{ title }</Title>

					<Menu position="bottom-end">
						<Menu.Target />
						<Menu.Dropdown>
							<Menu.Link href={ Routes.editPermission(permission.id) }>
								Edit Permission
							</Menu.Link>
						</Menu.Dropdown>
					</Menu>
				</Group>

			</Section>
		</Page>
	)
}

export default ShowPermission
