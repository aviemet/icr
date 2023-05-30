import React from 'react'
import { Divider, Navbar, Text } from '@mantine/core'
import { Heading, Link } from '@/Components'
import { Routes } from '@/lib'
import MobileMenuToggle from '../MobileMenuToggle'
import { DashboardIcon, ShiftsIcons } from '@/Components/Icons'
import menuItems from './menuItems'

const AppSidebar = () => {
	return (
		<>
			<Navbar.Section>
				<MobileMenuToggle />
				<Text>ICR SLS</Text>
			</Navbar.Section>

			<Divider />

			<Navbar.Section grow>
				{ menuItems.map(group => <>
					<Heading key={ group.id }>{ group.title }</Heading>
					{ group.children.map(item => <>
						<Link href={ item.url } key={ item.id }>
							{ React.createElement(item.icon) }
							{ item.title }
						</Link>
					</> ) }
					<Divider />
				</>) }
			</Navbar.Section>

			<Divider />

			<Navbar.Section>
			</Navbar.Section>
		</>
	)
}

export default AppSidebar
