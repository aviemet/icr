import React from 'react'
import { Button } from '@/Components'
import { modals } from '@mantine/modals'

const NewShiftButton = () => {
	const handleModalOpen = () => {
		modals.open({
			title: 'New Shift',
			children: (
				<div>
					New Shift
				</div>
			),
		})
	}

	return (
		<Button
			onClick={ handleModalOpen }
			mt={ 2 }
			ml={ 2 }
			pt={ 2 }
			pb={ 3 }
			px={ 5 }
			style={ {
				height: 'auto',
				float: 'left',
			} }
		>+</Button>
	)
}

export default NewShiftButton
