import React, { useState } from 'react'
import { Link, AnimateButton } from 'components'
import { Routes } from 'lib'
import { useForm } from '@inertiajs/inertia-react'
import { useTheme } from '@mui/material/styles'
import {
	Box,
	Button,
	Checkbox,
	Divider,
	FormControlLabel,
	FormHelperText,
	Grid,
	IconButton,
	InputAdornment,
	InputLabel,
	Stack,
	TextField,
	Typography,
	useMediaQuery
} from '@mui/material'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import Google from 'images/social-google.svg'

const Login = ({ ...others }) => {
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))
	const [checked, setChecked] = useState(true)
	const [showPassword, setShowPassword] = useState(false)

	const { data, setData, post, transform, processing, errors } = useForm({
		'email': '',
		'password': '',
	})

	const onSubmit = event => {
		event.preventDefault()
		transform(data => ({
			user: data
		}))
		post(Routes.user_session_path())
	}

	const googleHandler = async () => {
		console.error('Login')
	}

	return (
		<>
			<Grid container direction="column" justifyContent="center" spacing={ 2 }>

				<Grid item xs={ 12 }>
					<Stack alignItems="center" justifyContent="center" spacing={ 1 }>
						<Typography color={ theme.palette.secondary.main } gutterBottom variant={ matchDownSM ? 'h3' : 'h2' }>
							Hi, Welcome Back
						</Typography>
					</Stack>
				</Grid>

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

			<form noValidate onSubmit={ onSubmit } { ...others }>
				<Grid container spacing={ matchDownSM ? 0 : 2 }>
					<Grid item xs={ 12 }>
						<TextField
							fullWidth
							type="email"
							name="email"
							label="Email Address / Username"
							value={ data['email'] }
							onChange={ e => setData('email', e.target.value) }
							aria-describedby="email-error-text"
						/>
						{ errors.email && <FormHelperText id="email-error-text">{ errors.email }</FormHelperText> }
					</Grid>

					<Grid item xs={ 12 }>
						<TextField
							fullWidth
							type={ showPassword ? 'text' : 'password' }
							name="password"
							label="Password"
							value={ data['password'] }
							onChange={ e => setData('password', e.target.value) }
							aria-describedby="password-error-text"
							InputProps={ { endAdornment:
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
					</Grid>
				</Grid>

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
						<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={ processing }>
							Sign in
						</Button>
					</AnimateButton>
				</Box>
			</form>


			<Grid item xs={ 12 }>
				<Box sx={ { mt: 2 } }>
					<Grid item container direction="column" alignItems="center" xs={ 12 }>
						<Typography variant="subtitle1">
							<Link href={ Routes.new_user_registration_path() }>Don&apos;t have an account?</Link>
						</Typography>
					</Grid>
				</Box>
			</Grid>
		</>
	)
}

export default Login
