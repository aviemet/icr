import React, { forwardRef, useEffect } from 'react'
import { Link } from 'components'
import { useTheme } from '@mui/material/styles'
import { Avatar, Chip, ListItemButton, ListItemIcon, ListItemText, Typography, useMediaQuery } from '@mui/material'
<<<<<<< HEAD

// assets
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'

// ==============================|| SIDEBAR MENU LIST ITEMS ||============================== //

const NavItem = ({ item, level }) => {
	const theme = useTheme()
	// const customization = theme.customization
	const matchesSM = useMediaQuery(theme.breakpoints.down('lg'))

	const Icon = item.icon
	const itemIcon = item?.icon ? (
		<Icon stroke={ 1.5 } size="1.3rem" />
	) : (
		<FiberManualRecordIcon
			sx={ {
				// width: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6,
				// height: customization.isOpen.findIndex((id) => id === item?.id) > -1 ? 8 : 6
			} }
			fontSize={ level > 0 ? 'inherit' : 'medium' }
		/>
	)
=======
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord'
import MenuCaption from '../MenuCaption'

const NavItem = ({ item, level }) => {
	const { breakpoints } = useTheme()
	const matchesSM = useMediaQuery(breakpoints.down('lg'))
>>>>>>> mui

	let itemTarget = '_self'
	if (item.target) {
		itemTarget = '_blank'
	}

	let listItemProps = {
<<<<<<< HEAD
		// component: forwardRef((props, ref) => <Link ref={ ref } { ...props } href="/" target={ itemTarget } />)
=======
		component: forwardRef((props, ref) => <Link { ...props } href={ item.url ? item.url : '#' } target={ itemTarget } />)
>>>>>>> mui
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
<<<<<<< HEAD
		// eslint-disable-next-line
    }, []);
=======
	}, [])

	const Icon = item.icon
>>>>>>> mui

	return (
		<ListItemButton
			{ ...listItemProps }
			disabled={ item.disabled }
<<<<<<< HEAD
			sx={ {
				// borderRadius: `${customization.borderRadius}px`,
=======
			sx={ theme => ({
				borderRadius: `${theme.constants.borderRadius}px`,
>>>>>>> mui
				mb: 0.5,
				alignItems: 'flex-start',
				backgroundColor: level > 1 ? 'transparent !important' : 'inherit',
				py: level > 1 ? 1 : 1.25,
				pl: `${level * 24}px`
<<<<<<< HEAD
			} }
			// selected={ customization.isOpen.findIndex((id) => id === item.id) > -1 }
			onClick={ () => itemHandler(item.id) }
		>
			<ListItemIcon sx={ { my: 'auto', minWidth: !item?.icon ? 18 : 36 } }>{ itemIcon }</ListItemIcon>
=======
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
>>>>>>> mui
			<ListItemText
				primary={
					<Typography variant={ 'body1' /* customization.isOpen.findIndex((id) => id === item.id) > -1 ? 'h5' : 'body1' */ } color="inherit">
						{ item.title }
					</Typography>
				}
<<<<<<< HEAD
				secondary={
					item.caption && (
						<Typography variant="caption" sx={ { /* ...theme.typography.subMenuCaption */ }  } display="block" gutterBottom>
							{ item.caption }
						</Typography>
					)
				}
			/>
			{ item.chip && (
				<Chip
					color={ item.chip.color }
					variant={ item.chip.variant }
					size={ item.chip.size }
					label={ item.chip.label }
					avatar={ item.chip.avatar && <Avatar>{ item.chip.avatar }</Avatar> }
				/>
			) }
=======
				secondary={ item.caption && <MenuCaption>{ item.caption }</MenuCaption> }
			/>
			{ item.chip && <Chip
				color={ item.chip.color }
				variant={ item.chip.variant }
				size={ item.chip.size }
				label={ item.chip.label }
				avatar={ item.chip.avatar && <Avatar>{ item.chip.avatar }</Avatar> }
			/> }
>>>>>>> mui
		</ListItemButton>
	)
}

export default NavItem
