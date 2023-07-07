import * as React from 'react'
import { ColorPicker } from '@/Components'
import { updateEmployee } from '@/queries'

interface ShiftColorPickerProps {
	employee: Schema.EmployeesIndex
}

const ShiftColorPicker = ({ employee }: ShiftColorPickerProps) => {
	const mutation = updateEmployee(employee.id)

	const handleColorChoice = (color: string) => {
		mutation.mutate({
			employee: {
				settings: {
					shift_color: color,
				},
			},
		})
	}

	return (
		<ColorPicker
			defaultColor={ employee.settings?.shift_color }
			onSave={ color => handleColorChoice(color) }
		/>
	)
}

export default ShiftColorPicker
