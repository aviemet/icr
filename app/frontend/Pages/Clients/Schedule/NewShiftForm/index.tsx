import React from 'react'
import { type SlotInfo } from 'react-big-calendar'

interface NewClientShiftFormProps extends SlotInfo {
}

const NewShiftForm = ({ start, end, action, bounds, box }: NewClientShiftFormProps) => {
	return (
		<div>NewShiftForm</div>
	)
}

export default NewShiftForm
