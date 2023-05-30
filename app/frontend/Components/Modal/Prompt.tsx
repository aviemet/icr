import React from 'react'
import {
	Grid,
	Heading,
	Modal,
} from '@/Components'

interface IPromptProps {
	children: React.ReactNode
	title: string
	open: boolean
	handleClose: () => void
}

const Prompt = ({ children, title, open, handleClose }: IPromptProps) => {
	return (
		<Modal
			opened={ open }
			onClose={ handleClose }
			aria-labelledby="modal-modal-title"
		>
			<Grid>
				<Grid.Col>
					<Heading order={ 2 }>{ title }</Heading>
				</Grid.Col>
				<Grid.Col>
					{ children }
				</Grid.Col>
			</Grid>
		</Modal>

	)
}

export default Prompt
