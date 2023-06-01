import React from 'react'
import { Box, Footer, Group, useMantineTheme } from '@mantine/core'
import { ToggleColorSchemeButton } from '@/Components/Button'

const AppFooter = () => {
	const theme = useMantineTheme()

	return (
		<Footer height={ theme.other.footer.height } py={ 4 } px={ 8 }>
			<Group>
				<Box sx={ { width: 32 } }>
					<ToggleColorSchemeButton />
				</Box>
				<div id="footer-portal" />
				<Box sx={ { marginLeft: 'auto' } }>©{ (new Date).getFullYear() }</Box>
			</Group>
		</Footer>
	)
}

export default AppFooter
