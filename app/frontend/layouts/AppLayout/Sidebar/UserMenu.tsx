import { ActionIcon, Avatar, Menu } from "@/components"
import { LogoutIcon, UserSettingsIcon } from "@/components/Icons"
import { Routes } from "@/lib"

const UserMenu = () => {
	return (
		<Menu withArrow arrowPosition="center" position="bottom-start">
			<Menu.Target>
				<ActionIcon variant="transparent" p="lg"><Avatar id="user-menu" /></ActionIcon>
			</Menu.Target>

			<Menu.Dropdown>
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

export default UserMenu
