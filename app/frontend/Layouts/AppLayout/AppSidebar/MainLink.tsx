import React from 'react'
import { Link } from '@/Components'
import { UnstyledButton, ThemeIcon, Group, Text } from '@mantine/core'

interface MainLinkProps {
	children: string
	icon: React.ReactNode
	color?: string
	href: string
}

function MainLink({ children, href, icon, color }: MainLinkProps) {
	return (
		<UnstyledButton
			component={ Link }
			href={ href }
			sx={ (theme) => ({
				display: 'block',
				width: '100%',
				padding: theme.spacing.xs,
				borderRadius: theme.radius.sm,
				color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.black,

				'&:hover': {
					backgroundColor:
            theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
				},
			}) }
		>
			<Group>
				<ThemeIcon color={ color } variant="light">
					{ icon }
				</ThemeIcon>

				<Text size="sm">{ children }</Text>
			</Group>
		</UnstyledButton>
	)
}

export default MainLink
