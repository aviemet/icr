import React, { useState, useRef, useEffect } from 'react'
import { Routes } from 'lib'
import { Inertia } from '@inertiajs/inertia'
import { useAuthState } from 'Store'
import { useTheme } from '@mui/material/styles'
import {
	Avatar,
	Box,
	Card,
	CardContent,
	Chip,
	ClickAwayListener,
	Divider,
	Grid,
	Grow,
	List,
	ListItemButton,
	ListItemIcon,
	ListItemText,
	Popper,
	Stack,
	Switch,
	Typography
} from '@mui/material'
import LogoutIcon from '@mui/icons-material/Logout'
import SettingsIcon from '@mui/icons-material/Settings'
import PersonIcon from '@mui/icons-material/Person'
import ManageAccountsIcon from '@mui/icons-material/ManageAccounts'
import ProfileLink from './ProfileLink'
import MainCard from 'components/cards/MainCard'
import { Transition, SearchInput } from 'components'
import { greeting } from 'lib'

const ProfileSection = () => {
	const [auth, _] = useAuthState()
	const theme = useTheme()

	const [sdm, setSdm] = useState(true)
	const [value, setValue] = useState('')
	const [notification, setNotification] = useState(false)
	const [selectedIndex, setSelectedIndex] = useState(-1)
	const [open, setOpen] = useState(false)

	/**
	 * anchorRef is used on different componets and specifying one type leads to other components throwing an error
	 * */
	const anchorRef = useRef<HTMLDivElement>(null)
	const handleLogout = async () => {
		Inertia.delete(Routes.destroy_user_session_path())
	}

	const handleClose = (event) => {
		if(anchorRef.current && anchorRef.current.contains(event.target)) {
			return
		}
		setOpen(false)
	}

	const handleListItemClick = (event, index, route = '') => {
		setSelectedIndex(index)
		handleClose(event)

		if(route && route !== '') {
			// navigate(route)
		}
	}
	const handleToggle = () => {
		setOpen((prevOpen) => !prevOpen)
	}

	const prevOpen = useRef(open)
	useEffect(() => {
		if(prevOpen.current === true && open === false) {
			anchorRef.current?.focus()
		}

		prevOpen.current = open
	}, [open])

	return (
		<>
			<Chip
				sx={ {
					height: '48px',
					alignItems: 'center',
					borderRadius: '27px',
					transition: 'all .2s ease-in-out',
					borderColor: theme.palette.primary.light,
					backgroundColor: theme.palette.primary.light,
					'&[aria-controls="menu-list-grow"], &:hover': {
						borderColor: theme.palette.primary.main,
						background: `${theme.palette.primary.main}!important`,
						color: theme.palette.primary.light,
						'& svg': {
							stroke: theme.palette.primary.light
						}
					},
					'& .MuiChip-label': {
						lineHeight: 0
					}
				} }
				icon={
					<Avatar
						sx={ {
							...theme.constants.mediumAvatar,
							margin: '8px 0 8px 8px !important',
							cursor: 'pointer'
						} }
						ref={ anchorRef }
						aria-controls={ open ? 'menu-list-grow' : undefined }
						aria-haspopup="true"
						color="inherit"
					>{ auth.user && `${auth.user.f_name.charAt(0)}${auth.user.l_name.charAt(0)}` }</Avatar>
				}
				label={ <SettingsIcon /> }
				variant="outlined"
				ref={ anchorRef }
				aria-controls={ open ? 'menu-list-grow' : undefined }
				aria-haspopup="true"
				onClick={ handleToggle }
				color="primary"
			/>
			<Popper
				placement="bottom-end"
				open={ open }
				anchorEl={ anchorRef.current }
				role={ undefined }
				transition
				disablePortal
				popperOptions={ {
					modifiers: [
						{
							name: 'offset',
							options: {
								offset: [0, 14]
							}
						}
					]
				} }
			>
				{ ({ TransitionProps }) => (
					<Grow { ...TransitionProps }>
						<Transition in={ open } position="top-right" { ...TransitionProps }>
							<ClickAwayListener onClickAway={ handleClose }>
								<MainCard border={ false } elevation={ 16 } content={ false } boxShadow shadow={ theme.shadows[16] }>
									<Box sx={ { p: 2 } }>
										<Stack>
											<Stack direction="row" spacing={ 0.5 } alignItems="center">
												<Typography variant="h4">{ greeting() },</Typography>
												<Typography component="span" variant="h4" sx={ { fontWeight: 400 } }>
													{ auth.user && auth.user.f_name }
												</Typography>
											</Stack>
											<Typography variant="subtitle2">{ /* role, title, permissions something */ }</Typography>
										</Stack>
										{ /* <SearchInput value={ value } setValue={ setValue } />
										<Divider /> */ }
									</Box>
									<Box sx={ { p: 2 } }>
										<Divider />
										<Card
											sx={ {
												bgcolor: theme.palette.primary.light,
												my: 2
											} }
										>
											<CardContent>
												<Grid container spacing={ 3 } direction="column">
													<Grid item>
														<Grid item container alignItems="center" justifyContent="space-between">
															<Grid item>
																<Typography variant="subtitle1">Toggle Light/Dark Theme</Typography>
															</Grid>
															<Grid item>
																<Switch
																	color="primary"
																	checked={ sdm }
																	onChange={ (e) => setSdm(e.target.checked) }
																	name="sdm"
																	size="small"
																/>
															</Grid>
														</Grid>
													</Grid>
												</Grid>
											</CardContent>
										</Card>
										<Divider />
										<List
											component="nav"
											sx={ theme => ({
												width: '100%',
												maxWidth: 350,
												minWidth: 300,
												backgroundColor: theme.palette.background.paper,
												borderRadius: '10px',
												[theme.breakpoints.down('md')]: {
													minWidth: '100%'
												},
												'& .MuiListItemButton-root': {
													mt: 0.5
												}
											}) }
										>
											<ProfileLink
												selected={ selectedIndex === 0 }
												icon={ ManageAccountsIcon }
												onClick={ event => handleListItemClick(event, 0, '/') }
											>
												Account Settings
											</ProfileLink>

											<ProfileLink
												selected={ selectedIndex === 4 }
												onClick={ handleLogout }
												icon={ LogoutIcon }
											>
												Sign Out
											</ProfileLink>

										</List>
									</Box>
								</MainCard>
							</ClickAwayListener>
						</Transition>
					</Grow>
				) }
			</Popper>
		</>
	)
}

export default ProfileSection
