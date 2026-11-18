import { Avatar, UnstyledButton } from "@mantine/core"

import { Menu } from "@/components"

export function AvatarMenu() {
	return (
		<Menu>
			<Menu.Target>
				<UnstyledButton aria-label="User Menu">
					<Avatar
						radius="xl"
						color="primary"
						variant="filled"
					/>
				</UnstyledButton>
			</Menu.Target>

			<Menu.Dropdown>
			</Menu.Dropdown>
		</Menu>
	)
}
