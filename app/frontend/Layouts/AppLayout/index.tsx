import React from 'react'
import { AppShell, Burger, Container, Menu, Title } from '@/Components'
import { useAuth, useLocation } from '@/lib/hooks'
import menuItems from './menuItems'

import * as classes from './AppLayout.css'

const AppLayout = ({ children }: { children: any }) => {
	const { isLoggedIn } = useAuth()
	const location = useLocation()

	return (
		<AppShell
			header={ { height: 45 } }
		>
			<AppShell.Header className={ classes.layout } p="xs">
				<Title size="h3">Schedule Thing</Title>
				<Menu shadow="sm">
					<Menu.Target>
						<Burger size="sm" className={ classes.menu }></Burger>
					</Menu.Target>

					<Menu.Dropdown>
						{ isLoggedIn ? menuItems.map(menuGroup =>(
							<React.Fragment key={ menuGroup.id }>
								<Menu.Label >{ menuGroup.title }</Menu.Label>
								{ menuGroup.children.map(menuItem => (
									<Menu.Link key={ menuItem.id } href={ menuItem.url }>{ menuItem.title }</Menu.Link>
								))}
							</React.Fragment>
						))
							:
							<Menu.Label>Sign In</Menu.Label>
						}
					</Menu.Dropdown>
				</Menu>
			</AppShell.Header>

			<AppShell.Main>
				<Container pt="sm">
					{ children }
				</Container>
			</AppShell.Main>

		</AppShell>
	)
}

export default AppLayout
