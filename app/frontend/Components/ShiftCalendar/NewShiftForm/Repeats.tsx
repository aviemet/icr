import React from 'react'
import { Box } from '@/Components'
import {  Dropdown, FormGroup, NumberInput } from '@/Components/Form'
import { useForm } from 'use-inertia-form'
import { Group, Tooltip } from '@mantine/core'
import { Checkbox, RadioInput } from '@/Components/Inputs'
import { Heading } from '@/Components'
import dayjs from 'dayjs'

interface RepeatsProps {
	date: Date
}

const weekDays = [
	'Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday',
]

const Repeats = ({ date }: RepeatsProps) => {
	const { getData } = useForm<{ shift: Schema.ShiftsFormData }>()

	const pluralize = (str: string) => {
		// @ts-ignore
		const offset = getData('shift.recurring_pattern.offset')
		if(offset && offset > 1) {
			return `${str}s`
		}
		return str
	}

	return (
		<FormGroup model="recurring_pattern">
			<Group noWrap>
				<Box mt="md">Every</Box>
				<NumberInput name="offset" min={ 1 } sx={ { width: 75 } } />

				<Dropdown
					searchable={ false }
					name="recurring_type"
					data={ [
						{ label: pluralize('Day'), value: '0' },
						{ label: pluralize('Week'), value: '1' },
						{ label: pluralize('Month'), value: '2' },
						{ label: pluralize('Year'), value: '3' },
					] }
				/>
			</Group>

			{ /* Weekday Checkboxes */ }
			{ String(getData('shift.recurring_pattern.recurring_type')) === '1' &&
				<Checkbox.Group>
					<Group sx={ { justifyContent: 'space-evenly' } } noWrap>{
						weekDays.map((day, i) => (
							<Tooltip key={ day } label={ day }>
								<Checkbox.Chip value={ i } noCheck defaultChecked={ dayjs(date).format('dddd') === day }>
									{ day.charAt(0) }
								</Checkbox.Chip>
							</Tooltip>
						))
					}</Group>
				</Checkbox.Group>
			}

			{ /* Recurrence End Criteria */ }
			<Group mt="md">
				<Box>
					<Heading order={ 4 }>Ends</Heading>
					<RadioInput
						name="end_type"
						options={ [
							{ label: 'Never', value: 'never' },
							{ label: 'On', value: 'on' },
							{ label: 'After', value: 'after' },
						] }
					/>
				</Box>
				<Box sx={ { flex: 1 } }>

				</Box>
			</Group>
		</FormGroup>
	)
}

export default Repeats
