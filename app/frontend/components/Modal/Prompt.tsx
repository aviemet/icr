import React, { useState, useCallback }  from 'react'
import { Calendar, Views, dateFnsLocalizer } from 'react-big-calendar'
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'
import { format, parse, startOfWeek, getDay, add, set } from 'date-fns'
import enUS from 'date-fns/locale/en-US'
import {
	Box,
	Button,
	Grid,
	Modal,
	Typography
} from '@mui/material'
import { NewShiftForm, AnimateButton } from '@/components'

interface IPromptProps {
	children: React.ReactNode
	title: string
	open: boolean
	handleClose: () => void
}

const Prompt = ({ children, title, open, handleClose }: IPromptProps) => {
	return (
		<Modal
			open={ open }
			onClose={ handleClose }
			aria-labelledby="modal-modal-title"
		>
			<Box sx={ {
				position: 'absolute' as 'absolute',
				top: '50%',
				left: '50%',
				transform: 'translate(-50%, -50%)',
				bgcolor: 'background.paper',
				border: '2px solid #000',
				boxShadow: 24,
				p: 4,
				width: {
					xs: '95%',
					sm: 'clamp(400px, 90%, 550px)',
					md: 'clamp(400px, 80%, 600px)',
				}
			} }>
				<Grid container spacing={ 2 }>
					<Grid item>
						<Typography id="modal-modal-title" variant="h2" component="h2">{ title }</Typography>
					</Grid>
					<Grid item>
						{ children }
					</Grid>
				</Grid>
			</Box>
		</Modal>

	)
}

export default Prompt
