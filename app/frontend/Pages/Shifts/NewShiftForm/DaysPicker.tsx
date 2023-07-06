import React, { useState, useEffect } from 'react'
import { MultiSelect } from '@mantine/core'

const days = [
	{ value: 'sun', label: 'Sunday' },
	{ value: 'mon', label: 'Monday' },
	{ value: 'tue', label: 'Tuesday' },
	{ value: 'wed', label: 'Wednesday' },
	{ value: 'thur', label: 'Thursday' },
	{ value: 'fri', label: 'Friday' },
	{ value: 'sat', label: 'Saturday' },
]

const DaysPicker = ({ setData }) => {
	// const [days, setDays] = useState<Set<string>>(Set())

	const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		// if(event.target.checked) {
		// 	setDays(days.add(event.target.value))
		// } else {
		// 	setDays(days.remove(event.target.value))
		// }
	}

	useEffect(() => {
		return setData('day_of_week', undefined)
	}, [])

	return (
		<MultiSelect
			label="Day of the week"
			data={ days }
		>
		</MultiSelect>
	)
}

export default DaysPicker
