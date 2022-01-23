import React, { useState } from 'react'
<<<<<<< HEAD

// material-ui
import { useTheme } from '@mui/material/styles'
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'

// project imports
import NavItem from '../NavItem'

// assets
=======
import { Collapse, List, ListItemButton, ListItemIcon, ListItemText, Typography } from '@mui/material'
import NavItem from '../NavItem'
import MenuCaption from '../MenuCaption'
>>>>>>> mui
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp'

<<<<<<< HEAD
// ==============================|| SIDEBAR MENU LIST COLLAPSE ITEMS ||============================== //

const NavCollapse = ({ menu, level }) => {
	const theme = useTheme()
	// const customization = theme.customization

=======
const NavCollapse = ({ menu, level }) => {
>>>>>>> mui
	const [open, setOpen] = useState(false)
	const [selected, setSelected] = useState(null)

	const handleClick = () => {
		setOpen(!open)
		setSelected(!selected ? menu.id : null)
	}

	// menu collapse & item
	const menus = menu.children?.map((item) => {
		switch (item.type) {
			case 'collapse':
				return <NavCollapse key={ item.id } menu={ item } level={ level + 1 } />
			case 'item':
				return <NavItem key={ item.id } item={ item } level={ level + 1 } />
			default:
				return (
					<Typography key={ item.id } variant="h6" color="error" align="center">
						Menu Items Error
					</Typography>
				)
		}
	})

	const Icon = menu.icon
	const menuIcon = menu.icon ? (
		<Icon strokeWidth={ 1.5 } size="1.3rem" style={ { marginTop: 'auto', marginBottom: 'auto' } } />
	) : (
		<FiberManualRecordIcon
			sx={ {
				width: selected === menu.id ? 8 : 6,
				height: selected === menu.id ? 8 : 6
			} }
			fontSize={ level > 0 ? 'inherit' : 'medium' }
		/>
	)

	return (
		<>
			<ListItemButton
<<<<<<< HEAD
				sx={ {
					// borderRadius: `${customization.borderRadius}px`,
=======
				sx={ theme => ({
					borderRadius: theme.constants.borderRadius,
>>>>>>> mui
					mb: 0.5,
					alignItems: 'flex-start',
					backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
					py: level > 1 ? 1 : 1.25,
					pl: `${level * 24}px`
<<<<<<< HEAD
				} }
=======
				}) }
>>>>>>> mui
				selected={ selected === menu.id }
				onClick={ handleClick }
			>
				<ListItemIcon sx={ { my: 'auto', minWidth: !menu.icon ? 18 : 36 } }>{ menuIcon }</ListItemIcon>
				<ListItemText
					primary={
						<Typography variant={ selected === menu.id ? 'h5' : 'body1' } color="inherit" sx={ { my: 'auto' } }>
							{ menu.title }
						</Typography>
					}
<<<<<<< HEAD
					secondary={
						menu.caption && (
							<Typography variant="caption" sx={ { /* ...theme.typography.subMenuCaption */ } } display="block" gutterBottom>
								{ menu.caption }
							</Typography>
						)
					}
=======
					secondary={ menu.caption && <MenuCaption>{ menu.caption }</MenuCaption> }
>>>>>>> mui
				/>
				{ open ? (
					<KeyboardArrowUpIcon />
				) : (
					<KeyboardArrowDownIcon />
				) }
			</ListItemButton>
			<Collapse in={ open } timeout="auto" unmountOnExit>
				<List
					component="div"
					disablePadding
<<<<<<< HEAD
					sx={ {
=======
					sx={ theme => ({
>>>>>>> mui
						position: 'relative',
						'&:after': {
							content: '\'\'',
							position: 'absolute',
							left: '32px',
							top: 0,
							height: '100%',
							width: '1px',
							opacity: 1,
							background: theme.palette.primary.light
						}
<<<<<<< HEAD
					} }
=======
					}) }
>>>>>>> mui
				>
					{ menus }
				</List>
			</Collapse>
		</>
	)
}

export default NavCollapse
