import { ActionIcon, Avatar, Menu } from "@/components"
import { LogoutIcon, UserSettingsIcon } from "@/components/Icons"
import { Routes } from "@/lib"

export function UserMenu() {
	return (
		<Menu withArrow arrowPosition="center" position="bottom-start">
			<Menu.Target>
				<ActionIcon variant="transparent" p={ 0 } className="user-menu-trigger">
					<Avatar id="user-menu" size="md" />
				</ActionIcon>
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
