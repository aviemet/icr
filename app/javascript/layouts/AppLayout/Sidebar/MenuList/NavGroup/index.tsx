import React from 'react'
import { useTheme } from '@mui/material/styles'
import { Divider, List, Typography } from '@mui/material'
import NavItem from '../NavItem'
import NavCollapse from '../NavCollapse'

const GroupTitle = ({ children }) => {
	const theme = useTheme()

	return (
		<Typography variant="caption" sx={ { ...theme.typography.menuCaption } } display="block" gutterBottom>
			{ children }
		</Typography>
	)
}

const GroupCaption = ({ children }) => {
	const theme = useTheme()

	return (
		<Typography variant="caption" sx={ { ...theme.typography.subMenuCaption } } display="block" gutterBottom>
			{ children }
		</Typography>
	)
}

const NavGroup = ({ item }) => {
	const theme = useTheme()

	return (
		<>
			<List subheader={ item.title &&
				<GroupTitle>
					{ item.title }
					{ item.caption && <GroupCaption>{ item.caption }</GroupCaption> }
				</GroupTitle>
			}>
				{ item.children?.map((menu) => {
					switch (menu.type) {
						case 'collapse':
							return <NavCollapse key={ menu.id } menu={ menu } level={ 1 } />
						case 'item':
							return <NavItem key={ menu.id } item={ menu } level={ 1 } />
						default:
							return (
								<Typography key={ menu.id } variant="h6" color="error" align="center">
									Menu Items Error
								</Typography>
							)
					}
				}) }
			</List>

			{ /* group divider */ }
			<Divider sx={ { mt: 0.25, mb: 1.25 } } />
		</>
	)
}

export default NavGroup
