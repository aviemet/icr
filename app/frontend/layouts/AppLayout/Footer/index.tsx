import { Box, AppShell, Group } from "@mantine/core"

import { ToggleColorSchemeButton } from "@/components/Button"

export function Footer() {
	return (
		<AppShell.Footer py={ 4 } px={ 8 }>
			<Group>
				<ToggleColorSchemeButton />
				<Box id="footer-portal" />
				<Box style={ { marginLeft: "auto" } }>
					©{ (new Date).getFullYear() }
				</Box>
			</Group>
		</AppShell.Footer>
	)
}
