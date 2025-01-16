import { Menu } from "@/Components"
import { Avatar, UnstyledButton } from "@mantine/core"
import { usePageProps } from "@/lib/hooks"
import { Routes } from "@/lib"

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
