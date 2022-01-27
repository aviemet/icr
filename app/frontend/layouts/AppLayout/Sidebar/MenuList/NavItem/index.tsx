import React, { forwardRef, useEffect } from 'react'
import { Link } from 'components'
import { useTheme } from '@mui/material/styles'
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material'
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import MenuCaption from '../MenuCaption'

const NavItem = ({ item, level }) => {
	const { breakpoints } = useTheme()
	const matchesSM = useMediaQuery(breakpoints.down('lg'))

	let itemTarget = '_self'
	if (item.target) {
		itemTarget = '_blank'
	}

	let listItemProps = {
		component: forwardRef((props, ref) => <Link { ...props } href={ item.url ? item.url : '#' } target={ itemTarget } />)
	}
	if (item?.external) {
		// listItemProps = { component: 'a', href: item.url, target: itemTarget }
	}

	const itemHandler = (id) => {
		// dispatch({ type: MENU_OPEN, id })
		// if (matchesSM) dispatch({ type: SET_MENU, opened: false })
	}

	// active menu item on page load
	useEffect(() => {
		const currentIndex = document.location.pathname
			.toString()
			.split('/')
			.findIndex((id) => id === item.id)
		if (currentIndex > -1) {
			// dispatch({ type: MENU_OPEN, id: item.id })
		}
	}, [])

	const Icon = item.icon

	return (
		<ListItemButton
			{ ...listItemProps }
			disabled={ item.disabled }
			sx={ theme => ({
				borderRadius: `${theme.constants.borderRadius}px`,
				mb: 0.5,
				alignItems: 'flex-start',
				backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
				py: level > 1 ? 1 : 1.25,
				pl: `${level * 24}px`
			}) }
			// selected={ customization.isOpen.findIndex((id) => id === item.id) > -1 }
			onClick={ () => itemHandler(item.id) }
		>
			<ListItemIcon sx={ { my: 'auto', minWidth: !item?.icon ? 18 : 36 } }>
				{ item?.icon ? (
					<Icon stroke={ 1.5 } size="1.3rem" />
				) : (
					<FiberManualRecordIcon
						sx={ {
							width: 8,
							height: 8
						} }
						fontSize={ level > 0 ? 'inherit' : 'medium' }
					/>
				) }
			</ListItemIcon>
			<ListItemText
				primary={
					<Typography variant={ 'body1' /* customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1' */ } color="inherit">
						{ item.title }
					</Typography>
				}
				secondary={ item.caption && <MenuCaption>{ item.caption }</MenuCaption> }
			/>
			{ item.chip && <Chip
				color={ item.chip.color }
				variant={ item.chip.variant }
				size={ item.chip.size }
				label={ item.chip.label }
				avatar={ item.chip.avatar && <Avatar>{ item.chip.avatar }</Avatar> }
			/> }
		</ListItemButton>
	)
}

export default NavItem
