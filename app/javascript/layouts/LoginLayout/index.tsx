import React from 'react'
import { Link } from 'components'
import { Routes } from 'lib'
import { useTheme } from '@mui/material/styles'
import { Divider, Grid, Stack, Typography, useMediaQuery } from '@mui/material'

import AuthCardWrapper from './AuthCardWrapper'
import Logo from 'layouts/AppLayout/LogoSection/Logo'
import AuthFooter from 'components/cards/AuthFooter'

const LoginLayout = ({ children }) => {
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	return (
		<Grid container direction="column" justifyContent="flex-end" sx={ { minHeight: '100vh' } }>
			<Grid item xs={ 12 }>
				<Grid container justifyContent="center" alignItems="center" sx={ { minHeight: 'calc(100vh - 68px)' } }>
					<Grid item sx={ { m: { xs: 1, sm: 3 }, mb: 0 } }>
						<AuthCardWrapper>
							<Grid container spacing={ 2 } alignItems="center" justifyContent="center">

								<Grid item sx={ { mb: 3 } }>
									<Logo />
								</Grid>

								<Grid item xs={ 12 }>
									<Grid
										container
										direction={ matchDownSM ? 'column-reverse' : 'row' }
										alignItems="center"
										justifyContent="center"
									>
										<Grid item>
											<Stack alignItems="center" justifyContent="center" spacing={ 1 }>
												<Typography
													color={ theme.palette.secondary.main }
													gutterBottom
													variant={ matchDownSM ? 'h3' : 'h2' }
												>
													Hi, Welcome Back
												</Typography>
												<Typography
													variant="caption"
													fontSize="16px"
													textAlign={ matchDownSM ? 'center' : 'inherit' }
												>
													Enter your credentials to continue
												</Typography>
											</Stack>
										</Grid>
									</Grid>
								</Grid>

								<Grid item xs={ 12 }>
									{ children }
								</Grid>

								<Grid item xs={ 12 }>
									<Divider />
								</Grid>

								<Grid item xs={ 12 }>
									<Grid item container direction="column" alignItems="center" xs={ 12 }>
										<Typography variant="subtitle1">
											<Link href={ Routes.new_user_registration_path() }>Don&apos;t have an account?</Link>
										</Typography>
									</Grid>
								</Grid>

							</Grid>
						</AuthCardWrapper>
					</Grid>
				</Grid>
			</Grid>
			<Grid item xs={ 12 } sx={ { m: 3, mt: 1 } }>
				<AuthFooter />
			</Grid>
		</Grid>
	)
}

export default (page: React.ReactNode) => <LoginLayout>{ page }</LoginLayout>
