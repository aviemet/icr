import { Box, AppShell, Group } from "@mantine/core"
import { ToggleColorSchemeButton } from "@/Components/Button"

const FooterComponent = () => {
	return (
		<AppShell.Footer py={ 4 } px={ 8 }>
			<Group>
				<ToggleColorSchemeButton />
				<div id="footer-portal" />
				<Box style={ { marginLeft: "auto" } }>
					©{ (new Date).getFullYear() }
				</Box>
			</Group>
		</AppShell.Footer>
	)
}

export default FooterComponent
