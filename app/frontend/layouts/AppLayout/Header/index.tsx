import React from 'react'
import { Avatar, Box, ButtonBase } from '@mui/material'
import LogoSection from '../LogoSection'
import SearchSection from './SearchSection'
import ProfileSection from './ProfileSection'
// import NotificationSection from './NotificationSection'
import MenuIcon from '@mui/icons-material/Menu'

const Header = ({ handleLeftDrawerToggle }) => {
	return (
		<>
			{ /* logo & toggler button */ }
			<Box
				sx={ theme => ({
					width: 228,
					display: 'flex',
					[theme.breakpoints.down('md')]: {
						width: 'auto'
					}
				}) }
			>
				<Box component="span" sx={ {
					display: { xs: 'none', md: 'block' },
					flexGrow: 1,
					overflow: 'hidden',
					width: 10
				} }>
					<LogoSection />
				</Box>
				<ButtonBase>
					<Avatar
						variant="rounded"
						sx={ theme => ({
							...theme.constants.commonAvatar,
							...theme.constants.mediumAvatar,
							transition: 'all .2s ease-in-out',
							background: theme.palette.secondary.light,
							color: theme.palette.secondary.dark,
							'&:hover': {
								background: theme.palette.secondary.dark,
								color: theme.palette.secondary.light
							}
						}) }
						onClick={ handleLeftDrawerToggle }
						color="inherit"
					>
						<MenuIcon />
					</Avatar>
				</ButtonBase>
			</Box>

			{ /* header search */ }
			<SearchSection />
			<Box sx={ { flexGrow: 1 } } />
			<Box sx={ { flexGrow: 1 } } />

			{ /* notification & profile */ }
			{ /* <NotificationSection /> */ }
			<ProfileSection />
		</>
	)
}

export default Header
