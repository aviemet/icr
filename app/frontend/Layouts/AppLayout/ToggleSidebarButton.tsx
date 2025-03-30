import { useComputedColorScheme } from "@mantine/core"

import { Burger } from "@/Components"
import useStore from "@/lib/store"

const ToggleSidebarButton = () => {
	const { sidebarOpen, toggleSidebarOpen } = useStore()
	const colorScheme = useComputedColorScheme()

	return (
		<Burger
			aria-label={ sidebarOpen ?
				"Collapse Navigation"
				:
				"Expand Navigation"
			}
			opened={ sidebarOpen }
			onClick={ () => toggleSidebarOpen() }
			size="sm"
			color={ colorScheme === "light" ? "black" : "white" }
		/>
	)
}

export default ToggleSidebarButton
