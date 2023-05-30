import React from 'react'
import { ActionIcon, Avatar, Box, Divider, Flex, Menu, Text } from '@mantine/core'
import { SettingsIcon } from '@/Components/Icons'
import { Link } from '@/Components'
import { usePage } from '@inertiajs/react'
import { Routes } from '@/lib'

const Header = () => {
	const { props } = usePage<SharedInertiaProps>()

	const u = props.auth.user.circles.map
	return (
		<Flex align="center" sx={ { width: '100%' } }>
			<Box sx={ { flex: 1 } }>
				<Text>Giving Circle</Text>
			</Box>
			<Box>
				<Menu position="bottom-end">
					<Menu.Target>
						<Avatar radius="xl" component={ ActionIcon }></Avatar>
					</Menu.Target>

					<Menu.Dropdown>
						<Divider />
						<Menu.Item
							component={ Link }
							href="/"
							icon={ <SettingsIcon /> }
						>Preferences</Menu.Item>
					</Menu.Dropdown>
				</Menu>
			</Box>
		</Flex>
	)
}

export default Header
