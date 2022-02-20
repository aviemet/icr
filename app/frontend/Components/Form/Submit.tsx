import React from 'react'
import { AnimateButton } from '@/Components'
import { Button } from '@mui/material'
import { useForm } from './Form'

const Submit = () => {

	const { processing } = useForm()

	return (
		<AnimateButton>
			<Button disableElevation fullWidth size="large" type="submit" variant="contained" color="secondary" disabled={ processing }>
				Save Shift
			</Button>
		</AnimateButton>
	)
}

export default Submit
