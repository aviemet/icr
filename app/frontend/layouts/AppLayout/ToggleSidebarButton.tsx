import { useComputedColorScheme } from "@mantine/core"

import { Burger } from "@/components"
import { useStore } from "@/lib/store"

export function ToggleSidebarButton() {
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
