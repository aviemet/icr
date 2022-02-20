import React from 'react'
import { Link } from '@/Components'
import { ButtonBase } from '@mui/material'
import Logo from './Logo'

const LogoSection = () => (
	<ButtonBase disableRipple component={ Link } href="/">
		<Logo />
	</ButtonBase>
)

export default LogoSection
