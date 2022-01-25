import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'components'
import { Routes } from 'lib'
import { useForm, Controller } from 'react-hook-form'
import { useTheme } from '@mui/material/styles'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	FormControl,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	Stack,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
import Google from 'images/social-google.svg'
import AnimateButton from 'components/extended/AnimateButton'
// import { strengthColor, strengthIndicator } from 'utils/password-strength'

// assets
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const Register = ({ ...others }) => {
	// const passwordRef = useRef<HTMLInputElement>(null)

	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	const { control, handleSubmit } = useForm({
		defaultValues: {
			f_name: '',
			l_name: '',
			email: '',
			password: '',
		}
	})

	const [showPassword, setShowPassword] = useState(false)
	const [checked, setChecked] = useState(true)

	const [strength, setStrength] = useState(0)
	const [level, setLevel] = useState()

	const googleHandler = async () => {
		console.error('Register')
	}

	const handleMouseDownPassword = (event) => {
		// event.preventDefault()
	}

	const changePassword = (value) => {
		// const temp = strengthIndicator(value)
		// setStrength(temp)
		// setLevel(strengthColor(temp))
	}

	const onSubmit = event => {
		console.log({ event })
	}

	useEffect(() => {
		changePassword('123456')
	}, [])

	return (
		<>
			<Grid container direction="column" justifyContent="center" spacing={ 2 }>

				<Grid item xs={ 12 }>
					<Stack alignItems="center" justifyContent="center" spacing={ 1 }>
						<Typography color={ theme.palette.secondary.main } gutterBottom variant={ matchDownSM ? 'h3' : 'h2' }>
							Sign Up
						</Typography>
					</Stack>
				</Grid>

				{ /* Sign up with Google section */ }
				<Grid item xs={ 12 }>
					<AnimateButton>
						<Button
							variant="outlined"
							fullWidth
							onClick={ googleHandler }
							size="large"
							sx={ {
								color: 'grey.700',
								backgroundColor: theme.palette.grey[50],
								borderColor: theme.palette.grey[100]
							} }
						>
							<Box sx={ { mr: { xs: 1, sm: 2, width: 20 } } }>
								<img src={ Google } alt="google" width={ 16 } height={ 16 } style={ { marginRight: matchDownSM ? 8 : 16 } } />
							</Box>
							Sign up with Google
						</Button>
					</AnimateButton>
				</Grid>

				{ /* OR box */ }
				<Grid item xs={ 12 }>
					<Box sx={ { alignItems: 'center', display: 'flex' } }>
						<Divider sx={ { flexGrow: 1 } } orientation="horizontal" />
						<Button variant="outlined" disableRipple disabled sx={ {
							cursor: 'unset',
							m: 2,
							py: 0.5,
							px: 7,
							borderColor: `${theme.palette.grey[100]} !important`,
							color: `${theme.palette.grey[900]}!important`,
							fontWeight: 500,
							borderRadius: `${theme.constants.borderRadius}px`
						} }>
							OR
						</Button>
						<Divider sx={ { flexGrow: 1 } } orientation="horizontal" />
					</Box>
				</Grid>

				<Grid item xs={ 12 } container alignItems="center" justifyContent="center">
					<Box sx={ { mb: 2 } }>
						<Typography variant="subtitle1">Sign up with Email address</Typography>
					</Box>
				</Grid>
			</Grid>

			<form noValidate onSubmit={ handleSubmit(onSubmit) } autoComplete="off" { ...others }>
				<Grid container spacing={ matchDownSM ? 0 : 2 }>

					<Grid item xs={ 12 } sm={ 6 }>
						<Controller name="f_name" control={ control } render={ ({ field }) =>
							<TextField
								{ ...field }
								fullWidth
								label="First Name"
								margin="normal"
								name="f_name"
								autoComplete="off"
								data-lpignore="true"
							/>
						} />
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<Controller name="l_name" control={ control } render={ ({ field }) =>
							<TextField
								{ ...field }
								fullWidth
								label="Last Name"
								margin="normal"
								name="l_name"
								InputProps={ { 'data-lpignore': true, autoComplete: 'off' } }
							/>
						} />
					</Grid>


					<Grid item xs={ 12 }>
						<Controller name="email" control={ control } render={ ({ field }) =>
							<TextField
								{ ...field }
								fullWidth
								type="email"
								name="email"
								label="Email Address"
								autoComplete="email"
								data-lpignore="true"
							/>
						} />
					</Grid>

					<Grid item xs={ 12 }>
						<Controller name="password" control={ control } render={ ({ field }) =>
							<TextField
								{ ...field }
								fullWidth
								type={ showPassword ? 'text' : 'password' }
								name="password"
								label="Password"
								autoComplete="password"
								data-lpignore="true"
								onBlur={ () => setShowPassword(false) }
								InputProps={ { endAdornment:
									<InputAdornment position="end">
										<IconButton
											aria-label="toggle password visibility"
											onClick={ () => setShowPassword(!showPassword) }
											onMouseDown={ handleMouseDownPassword }
											edge="end"
											size="large"
										>
											{ showPassword ? <Visibility /> : <VisibilityOff /> }
										</IconButton>
									</InputAdornment>
								} }
							/>
						} />
					</Grid>
				</Grid>

				{ strength !== 0 && (
					<FormControl fullWidth>
						<Box sx={ { mb: 2 } }>
							<Grid container spacing={ 2 } alignItems="center">
								<Grid item>
									<Box sx={ { width: 85, height: 8, borderRadius: '7px' } } />
								</Grid>
								<Grid item>
									<Typography variant="subtitle1" fontSize="0.75rem">
									</Typography>
								</Grid>
							</Grid>
						</Box>
					</FormControl>
				) }

				{ /* <Grid container alignItems="center" justifyContent="space-between">
					<Grid item>
						<FormControlLabel
							control={
								<Checkbox checked={ checked } onChange={ (event) => setChecked(event.target.checked) } name="checked" color="primary" />
							}
							label={
								<Typography variant="subtitle1">
									Agree with Terms &amp; Conditions.
								</Typography>
							}
						/>
					</Grid>
				</Grid> */ }

				<Box sx={ { mt: 2 } }>
					<AnimateButton>
						<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary">
							Sign up
						</Button>
					</AnimateButton>
				</Box>
			</form>


			<Grid item xs={ 12 }>
				<Box sx={ { mt: 2 } }>
					<Grid item container direction="column" alignItems="center" xs={ 12 }>
						<Typography variant="subtitle1">
							<Link href={ Routes.new_user_session_path() }>
								Already have an account?
							</Link>
						</Typography>
					</Grid>
				</Box>
			</Grid>
		</>
	)
}

export default Register
