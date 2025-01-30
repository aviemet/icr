import { Avatar, Link, Menu } from "@/Components"
import { LogoutIcon, UserSettingsIcon } from "@/Components/Icons"
import { Routes } from "@/lib"

const UserMenu = () => {
	return (
		<Menu withArrow arrowPosition="center" position="bottom-start">
			<Menu.Target>
				<Avatar id="user-menu" />
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
