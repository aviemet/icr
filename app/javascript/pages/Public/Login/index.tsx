import React, { useState } from 'react'
import { useTheme } from '@mui/material/styles'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	FormControl,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	OutlinedInput,
	Stack,
	Typography,
	useMediaQuery
} from '@mui/material'
import { AnimateButton } from 'components'
import { Routes } from 'lib'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import { Inertia } from '@inertiajs/inertia'
import Google from 'images/social-google.svg'

const customInput = theme => ({
	marginTop: 1,
	marginBottom: 1,
	'& > label': {
		top: 23,
		left: 0,
		color: theme.grey500,
		'&[data-shrink="false"]': {
			top: 5
		}
	},
	'& > div > input': {
		padding: '30.5px 14px 11.5px !important'
	},
	'& legend': {
		display: 'none'
	},
	'& fieldset': {
		top: 0
	}
})

const Login = ({ ...others }) => {
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
	const [checked, setChecked] = useState(true)

	const [email, setEmail] = useState('')
	const [password, setPassword] = useState('')

	const googleHandler = async () => {
		console.error('Login')
	}

	const [showPassword, setShowPassword] = useState(false)
	const handleClickShowPassword = () => {
		setShowPassword(!showPassword)
	}

	const handleMouseDownPassword = event => {
		event.preventDefault()
	}

	const handleLoginFormSubmit = event => {
		event.preventDefault()
		Inertia.post(Routes.user_session_path(), {
			user: {
				email: email,
				password: password
			}
		})
	}

	const customInputStyles = customInput(theme)

	return (
		<>
			<Grid container direction="column" justifyContent="center" spacing={ 2 }>

				<Grid item xs={ 12 }>
					<AnimateButton>
						<Button disableElevation fullWidth onClick={ googleHandler } size="large" variant="outlined" sx={ {
							color: 'grey.700',
							backgroundColor: theme.palette.grey[50],
							borderColor: theme.palette.grey[100]
						} }>
							<Box sx={ { mr: { xs: 1, sm: 2, width: 20 } } }>
								<img src={ Google } alt="google" width={ 16 } height={ 16 } style={ { marginRight: matchDownSM ? 8 : 16 } } />
							</Box>
							Sign in with Google
						</Button>
					</AnimateButton>
				</Grid>

				<Grid item xs={ 12 }>
					<Box sx={ { alignItems: 'center', display: 'flex' } }>
						<Divider sx={ { flexGrow: 1 } } orientation="horizontal" />

						<Button disableRipple disabled variant="outlined" sx={ {
							cursor: 'unset',
							m: 2,
							py: 0.5,
							px: 7,
							borderColor: `${theme.palette.grey[100]} !important`,
							color: `${theme.palette.grey[900]}!important`,
							fontWeight: 500,
							borderRadius: `${theme.constants.borderRadius}px`
						} }
						>
							OR
						</Button>

						<Divider sx={ { flexGrow: 1 } } orientation="horizontal" />
					</Box>
				</Grid>

				<Grid item xs={ 12 } container alignItems="center" justifyContent="center">
					<Box sx={ { mb: 2 } }>
						<Typography variant="subtitle1">Sign in with Email address</Typography>
					</Box>
				</Grid>
			</Grid>

			<form noValidate onSubmit={ handleLoginFormSubmit } { ...others }>
				<FormControl fullWidth sx={ customInputStyles }>
					<InputLabel htmlFor="outlined-adornment-email-login">Email Address / Username</InputLabel>
					<OutlinedInput
						id="outlined-adornment-email-login"
						type="email"
						name="email"
						label="Email Address / Username"
						value={ email }
						onChange={ e => setEmail(e.target.value) }
					/>
				</FormControl>

				<FormControl fullWidth sx={ customInputStyles }>
					<InputLabel htmlFor="outlined-adornment-password-login">Password</InputLabel>
					<OutlinedInput
						id="outlined-adornment-password-login"
						type={ showPassword ? 'text' : 'password' }
						name="password"
						label="Password"
						value={ password }
						onChange={ e => setPassword(e.target.value) }
						endAdornment={
							<InputAdornment position="end">
								<IconButton
									aria-label="toggle password visibility"
									onClick={ handleClickShowPassword }
									onMouseDown={ handleMouseDownPassword }
									edge="end"
									size="large"
								>
									{ showPassword ? <Visibility /> : <VisibilityOff /> }
								</IconButton>
							</InputAdornment>
						}
					/>
				</FormControl>

				<Stack direction="row" alignItems="center" justifyContent="space-between" spacing={ 1 }>
					<FormControlLabel label="Remember me" control={
						<Checkbox checked={ checked } onChange={ (event) => setChecked(event.target.checked) } name="checked" color="primary" />
					} />
					<Typography variant="subtitle1" color="secondary" sx={ { textDecoration: 'none', cursor: 'pointer' } }>
						Forgot Password?
					</Typography>
				</Stack>

				<Box sx={ { mt: 2 } }>
					<AnimateButton>
						<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
							Sign in
						</Button>
					</AnimateButton>
				</Box>
			</form>
		</>
	)
}

export default Login
