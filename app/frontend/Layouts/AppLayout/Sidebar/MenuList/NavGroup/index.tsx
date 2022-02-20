import React from 'react'
import { Divider, List, Typography } from '@mui/material'
import NavItem from '../NavItem'
import NavCollapse from '../NavCollapse'
import MenuTitle from '../MenuTitle'
import MenuCaption from '../MenuCaption'

const NavGroup = ({ item }) => {
	return (
		<>
			<List subheader={ item.title &&
				<MenuTitle>
					{ item.title }
					{ item.caption && <MenuCaption>{ item.caption }</MenuCaption> }
				</MenuTitle>
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
