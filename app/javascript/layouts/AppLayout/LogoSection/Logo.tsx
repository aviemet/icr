import React from 'react'
import { useTheme } from '@mui/material/styles'
import LogoImage from 'images/logo.jpg'
import { Image } from 'components'

const Logo = () => {
	const theme = useTheme()

	return (
		<Image src={ LogoImage } />
	)
}

export default Logo
