import { Box, AppShell, Group } from "@mantine/core"

import { DevActsAsButton } from "@/features/DevActsAs"

import * as classes from "./Footer.css"

export function Footer() {
	return (
		<AppShell.Footer py={ 4 } px={ 8 } className={ classes.footer }>
			<Group>
				<DevActsAsButton />
				<Box id="footer-portal" />
				<Box style={ { marginLeft: "auto" } }>
					©{ (new Date).getFullYear() }
				</Box>
			</Group>
		</AppShell.Footer>
	)
}
