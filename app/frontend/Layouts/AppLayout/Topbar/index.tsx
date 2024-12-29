import useStore from '@/lib/store'
import { Box, AppShell, Group, Flex } from '@/Components'
import AvatarMenu from './AvatarMenu'

import cx from 'clsx'
import * as classes from '../AppLayout.css'

const Topbar = () => {
	const { sidebarOpen, siteTitle } = useStore()

	return (
		<AppShell.Header p="xs" className={ cx(classes.topbar, { closed: !sidebarOpen }) }>
			<Group>

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
