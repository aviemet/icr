import React from 'react'
import {
	Grid,
	ListItemButton, ListItemButtonProps,
	ListItemIcon,
	ListItemText,
	Typography
} from '@mui/material'

interface ProfileLinkProps extends ListItemButtonProps {
	icon: any // TODO: WTF type is this?
	chip?: any
}

const TextWithGrid = ({ text, chip }) => {
	const Chip = () => chip

	return (
		<Grid container spacing={ 1 } justifyContent="space-between">
			<Grid item>
				<Typography variant="body2">{ text }</Typography>
			</Grid>
			<Grid item>
				<Chip />
			</Grid>
		</Grid>
	)
}

const TextNoGrid = ({ text }) => <Typography variant="body2">{ text }</Typography>

const ProfileLink = ({ children, chip, selected = false, onClick, icon }: ProfileLinkProps) => {
	const Icon = icon

	return (
		<ListItemButton
			sx={ theme => ({ borderRadius: `${theme.constants.borderRadius}px` }) }
			selected={ selected }
			onClick={ onClick }
		>
			<ListItemIcon>
				<Icon />
			</ListItemIcon>
			<ListItemText primary={ chip ? (
				<TextWithGrid text={ children } chip={ chip } />
			) : (
				<TextNoGrid text={ children } />
			) } />
		</ListItemButton>
	)
}

export default ProfileLink
