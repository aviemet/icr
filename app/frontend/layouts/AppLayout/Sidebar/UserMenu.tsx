import { ActionIcon, Avatar, Menu } from "@/components"
import { LogoutIcon, PersonIcon, UserSettingsIcon } from "@/components/Icons"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

export function UserMenu() {
	const { auth } = usePageProps()
	const ownEmployeeHref = auth.own_employee_slug
		? Routes.employee(auth.own_employee_slug)
		: null
	const ownClientHref = auth.own_client_slug
		? Routes.client(auth.own_client_slug)
		: null
	const profileHref = ownEmployeeHref || ownClientHref

	return (
		<Menu withArrow arrowPosition="center" position="bottom-start">
			<Menu.Target>
				<ActionIcon variant="transparent" p={ 0 } className="user-menu-trigger">
					<Avatar id="user-menu" size="md" />
				</ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
				{ profileHref && (
					<Menu.Link
						href={ profileHref }
						leftSection={ <PersonIcon /> }
					>
						My Profile
					</Menu.Link>
				) }
				<Menu.Link
					href="/settings/user"
					leftSection={ <UserSettingsIcon /> }
				>
					User Settings
				</Menu.Link>
				<Menu.Divider />
				<Menu.Link
					href={ Routes.destroyUserSession() }
					leftSection={ <LogoutIcon /> }
				>
					Logout
				</Menu.Link>
			</Menu.Dropdown>
		</Menu>
	)
}
