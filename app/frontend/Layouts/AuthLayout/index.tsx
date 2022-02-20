import React from 'react'
import { Divider, Grid } from '@mui/material'

import AuthCardWrapper from './AuthCardWrapper'
import Logo from '@/Layouts/AppLayout/LogoSection/Logo'
import AuthFooter from '@/Components/cards/AuthFooter'

const AuthLayout = ({ children }) => {
	return (
		<Grid container direction="column" justifyContent="flex-end" sx={ { minHeight: '100vh' } }>

			<Grid item xs={ 12 }>
				<Grid container justifyContent="center" alignItems="center" sx={ {
					minHeight: 'calc(100vh - 68px)'
				} }>
					<Grid item sx={ { m: { xs: 1, sm: 3 }, mb: 0 } }>
						<AuthCardWrapper>
							<Grid container spacing={ 2 } alignItems="center" justifyContent="center">

								<Grid item sx={ { mb: 3 } }>
									<Logo />
								</Grid>

								<Grid item xs={ 12 }>
									{ children }
								</Grid>

								<Grid item xs={ 12 }>
									<Divider />
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

export default AuthLayout
