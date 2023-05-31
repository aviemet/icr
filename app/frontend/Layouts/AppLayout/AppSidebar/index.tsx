import React from 'react'
import { Divider, Navbar } from '@mantine/core'
import { Heading } from '@/Components'
import MobileMenuToggle from '../MobileMenuToggle'
import menuItems from './menuItems'
import MainLink from './MainLink'

const AppSidebar = () => {
	return (
		<>
			<Navbar.Section>
				<MobileMenuToggle />
				<Heading order={ 2 }>ICR SLS</Heading>
			</Navbar.Section>

			<Divider />

			<Navbar.Section grow>
				{ menuItems.map(group => <React.Fragment key={ group.id }>
					<Heading key={ group.id } order={ 4 }>{ group.title }</Heading>
					{ group.children.map(item => (
						<MainLink
							key={ item.id }
							href={ item.url }
							icon={ React.createElement(item.icon) }
						>
							{ item.title }
						</MainLink>
					) ) }
					<Divider />
				</React.Fragment>) }
			</Navbar.Section>

			<Divider />

			<Navbar.Section>
			</Navbar.Section>
		</>
	)
}

export default AppSidebar
