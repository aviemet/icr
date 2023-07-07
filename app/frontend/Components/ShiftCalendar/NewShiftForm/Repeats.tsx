import React, { useState, useEffect } from 'react'
import {
	Box,
	Grid,
} from '@/Components'
import {  Dropdown, FormGroup, NumberInput } from '@/Components/Form'
import { useForm } from 'use-inertia-form'
import { usePage } from '@inertiajs/react'
import { Group } from '@mantine/core'
import { Checkbox } from '@/Components/Inputs'

const Repeats = () => {
	const { data, getData } = useForm<{ shift: Schema.ShiftsFormData }>()
	const { props } = usePage<SharedInertiaProps>()

	const pluralize = () => {
		if(data.offset && data.offset > 1) {
			return 's'
		}
	}

	return (
		<FormGroup model="recurring_pattern">
			<NumberInput name="offset" min={ 1 } />

			<Dropdown
				searchable={ false }
				name="recurring_types"
				options={ props.recurring_pattern_types }
			/>

			{ /* Weekday Checkboxes */ }
			{ getData('shift.recurring_pattern.recurring_type') === 'weekly' &&
				<Checkbox.Group>
					<Group>{ ['Sun','Mon','Tue','Wed','Thur','Fri','Sat'].map((day, i) => (
						<Checkbox key={ day } value={ i } label={ day } />
					))
					}</Group>
				</Checkbox.Group>
			}

			{ /* Recurrence End Criteria */ }
			<FormLabel id="recurrence-ending-label">Ends</FormLabel>
			<RadioGroup
				aria-labelledby="recurrence-ending-label"
				defaultValue="never"
				name="radio-buttons-group"
				value={ data.end_type }
				onChange={ e => setData('end_type', e.target.value) }
			>
				<FormControlLabel value="never" control={ <Radio /> } label="Never" />
				<FormControlLabel value="date" control={ <Radio /> } label={ <>
											On
					<DatePicker name="end_date" inputFormat="EEEE, MMM do" />
				</> } />
				<FormControlLabel value="occurrences" control={ <Radio /> } label={ <>
											After
					<NumberInput name="max_occurrences" min={ 1 } />
				</> } />
			</RadioGroup>

		</FormGroup>
	)
}

export default Repeats
