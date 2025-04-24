import clsx from "clsx"

import { Box, AppShell, Group } from "@/components"
import useStore from "@/lib/store"

import AvatarMenu from "./AvatarMenu"
import * as classes from "../AppLayout.css"
import ToggleSidebarButton from "../ToggleSidebarButton"

const Topbar = () => {
	const { sidebarOpen, siteTitle } = useStore()

	return (
		<AppShell.Header p="xs" className={ clsx(classes.topbar, { closed: !sidebarOpen }) }>
			<Group>
				<ToggleSidebarButton />
				<Box style={ { flex: 1 } }>
					{ siteTitle }
				</Box>

				<Group>
					<AvatarMenu />
				</Group>
			</Group>
		</AppShell.Header>
	)
}

export default Topbar
