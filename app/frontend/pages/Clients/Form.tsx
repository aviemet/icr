import React from 'react'
import { Link, AnimateButton } from '@/components'
import { useForm } from '@inertiajs/inertia-react'
import { Routes } from '@/lib'
import { useTheme } from '@mui/material/styles'
import {
	Box,
	Button,
	FormHelperText,
	Grid,
	TextField,
	useMediaQuery
} from '@mui/material'

const Form = ({ client }) => {
	const theme = useTheme()
	const matchDownSM = useMediaQuery(theme.breakpoints.down('md'))

	const { data, setData, post, transform, processing, errors } = useForm({
		'f_name': '',
		'm_name': '',
		'l_name': ''
	})

	const onSubmit = event => {
		event.preventDefault()
		transform(data => ({
			client: data
		}))
		post(Routes.clients_path())
	}

	return (
		<form noValidate onSubmit={ onSubmit }>
			<Grid container spacing={ matchDownSM ? 0 : 2 }>
				<Grid item xs={ 12 } md={ 4 }>
					<TextField
						fullWidth
						type="f_name"
						name="f_name"
						label="First Name"
						value={ data['f_name'] }
						onChange={ e => setData('f_name', e.target.value) }
						aria-describedby="f_name-error-text"
					/>
					{ errors.f_name && <FormHelperText id="f_name-error-text">{ errors.f_name }</FormHelperText> }
				</Grid>

				<Grid item xs={ 12 } md={ 4 }>
					<TextField
						fullWidth
						type="m_name"
						name="m_name"
						label="Middle Name"
						value={ data['m_name'] }
						onChange={ e => setData('m_name', e.target.value) }
						aria-describedby="m_name-error-text"
					/>
					{ errors.m_name && <FormHelperText id="m_name-error-text">{ errors.m_name }</FormHelperText> }
				</Grid>

				<Grid item xs={ 12 } md={ 4 }>
					<TextField
						fullWidth
						type="l_name"
						name="l_name"
						label="Last Name"
						value={ data['l_name'] }
						onChange={ e => setData('l_name', e.target.value) }
						aria-describedby="l_name-error-text"
					/>
					{ errors.l_name && <FormHelperText id="l_name-error-text">{ errors.l_name }</FormHelperText> }
				</Grid>
			</Grid>

			<Box sx={ { mt: 2 } }>
				<AnimateButton>
					<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={ processing }>
						Save New Client
					</Button>
				</AnimateButton>
			</Box>
		</form>
	)
}

export default Form
