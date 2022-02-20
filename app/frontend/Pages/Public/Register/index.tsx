import React, { useState } from 'react'
import { Link } from '@/Components'
import { Routes } from '@/lib'
import { useForm } from '@inertiajs/inertia-react'
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
import Google from '@/Images/social-google.svg'
import AnimateButton from '@/Components/extended/AnimateButton'
import { strengthColor, strengthIndicator } from '@/lib/passwordStrength'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'

const Register = ({ ...others }) => {
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	const [showPassword, setShowPassword] = useState(false)

	const { data, setData, post, transform, processing, errors } = useForm({
		'f_name': '',
		'l_name': '',
		'email': '',
		'password': '',
		'time_zone': Intl.DateTimeFormat().resolvedOptions().timeZone,
	})

	const onSubmit = event => {
		event.preventDefault()
		// @ts-ignore
		transform(data => ({ user: data }))
		post(Routes.userRegistration())
	}

	// const [strength, setStrength] = useState(1)
	// const [level, setLevel] = useState({ label: '', color: })

	// const passwordStrength = (value) => {
	// 	const temp = strengthIndicator(value)
	// 	setStrength(temp)
	// 	setLevel(strengthColor(temp))
	// }

	const googleHandler = async () => {
		console.error('Google coming later')
	}

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

			<form noValidate onSubmit={ onSubmit } autoComplete="off" { ...others }>
				<input
					type="hidden"
					name="time_zone"
					value={ data['time_zone'] }
				/>
				<Grid container spacing={ matchDownSM ? 0 : 2 }>

					<Grid item xs={ 12 } sm={ 6 }>
						<FormControl error={ !!errors.f_name } fullWidth>
							<TextField
								label="First Name"
								margin="normal"
								name="f_name"
								InputProps={ { autoComplete: 'off' } }
								value={ data['f_name'] }
								onChange={ e => setData('f_name', e.target.value) }
								aria-describedby="f_name-error-text"
							/>
							{ errors.f_name && <FormHelperText id="f_name-error-text">{ errors.f_name }</FormHelperText> }
						</FormControl>
					</Grid>

					<Grid item xs={ 12 } sm={ 6 }>
						<FormControl error={ !!errors.l_name } fullWidth>
							<TextField
								label="Last Name"
								margin="normal"
								name="l_name"
								InputProps={ { autoComplete: 'off' } }
								value={ data['l_name'] }
								onChange={ e => setData('l_name', e.target.value) }
								aria-describedby="l_name-error-text"
							/>
							{ errors.l_name && <FormHelperText id="l_name-error-text">{ errors.l_name }</FormHelperText> }
						</FormControl>
					</Grid>


					<Grid item xs={ 12 }>
						<FormControl error={ !!errors.email } fullWidth>
							<TextField
								type="email"
								name="email"
								label="Email Address"
								InputProps={ { autoComplete: 'email' } }
								value={ data['email'] }
								onChange={ e => setData('email', e.target.value) }
								aria-describedby="email-error-text"
							/>
							{ errors.email && <FormHelperText id="email-error-text">{ errors.email }</FormHelperText> }
						</FormControl>
					</Grid>

					<Grid item xs={ 12 }>
						<FormControl error={ !!errors.password } fullWidth>
							<TextField
								type={ showPassword ? 'text' : 'password' }
								name="password"
								label="Password"
								onBlur={ () => setShowPassword(false) }
								value={ data['password'] }
								onChange={ e => {
									setData('password', e.target.value)
									// passwordStrength(e.target.value)
								} }
								aria-describedby="password-error-text"
								InputProps={ { autoComplete: 'off', endAdornment:
								<InputAdornment position="end">
									<IconButton
										aria-label="toggle password visibility"
										onClick={ () => setShowPassword(!showPassword) }
										edge="end"
										size="large"
									>
										{ showPassword ? <Visibility /> : <VisibilityOff /> }
									</IconButton>
								</InputAdornment>
								} }
							/>
							{ errors.password && <FormHelperText id="password-error-text">{ errors.password }</FormHelperText> }
						</FormControl>
						{ /* { strength !== 0 && (
							<FormControl fullWidth>
								<Box sx={ { mb: 2 } }>
									<Grid container spacing={ 2 } alignItems="center">
										<Grid item>
											<Box style={ { backgroundColor: level?.color } } sx={ { width: 85, height: 8, borderRadius: '7px' } } />
										</Grid>
										<Grid item>
											<Typography variant="subtitle1" fontSize="0.75rem">
											</Typography>
										</Grid>
									</Grid>
								</Box>
							</FormControl>
						) } */ }
					</Grid>
				</Grid>

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
						<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={ processing }>
							Sign up
						</Button>
					</AnimateButton>
				</Box>
			</form>


			<Grid item xs={ 12 }>
				<Box sx={ { mt: 2 } }>
					<Grid item container direction="column" alignItems="center" xs={ 12 }>
						<Typography variant="subtitle1">
							<Link href={ Routes.newUserSession() }>
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
