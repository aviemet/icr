import { Avatar, UnstyledButton } from "@mantine/core"

import { Menu } from "@/Components"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

const AvatarMenu = () => {
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
				{ /* <Menu.Link href={ Routes.user(props.auth.user.id) }>Profile & Account</Menu.Link> */ }
			</Menu.Dropdown>
		</Menu>
	)
}

export default AvatarMenu
