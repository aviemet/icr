import { Avatar, UnstyledButton } from "@mantine/core"

import { Menu } from "@/components"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

export function AvatarMenu() {
	const props = usePageProps()

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
