import React from 'react'
import {
	Box,
	Modal,
} from '@/Components'
import { ModalProps } from '@mantine/core'

interface ModalPromptProps extends ModalProps {
	children: React.ReactNode
	title: string
}

const Prompt = ({ children, title, ...props }: ModalPromptProps) => {
	return (
		<Modal
			closeButtonProps={ { 'aria-label': 'Close modal' } }
			title={ title }
			transitionProps={ { duration: 100 } }
			{ ...props }
		>
			<Box>
				{ children }
			</Box>
		</Modal>

	)
}

export default Prompt
