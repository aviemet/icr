import React, { useCallback } from 'react'
import { usePage } from '@inertiajs/react'
import { add, format } from 'date-fns'
import { Form, Autocomplete, DateTime, Submit } from '@/Components/Form'
import { Routes } from '@/lib'
import {
	Box,
	Button,
	Grid,
	Link
} from '@/Components'
import DaysPicker from './DaysPicker'
import Repeats from './Repeats'

type TFormData = {
	starts_at: Date
	ends_at: Date
	client_ids: number[]
	employee: number|undefined
	created_by_id: number
	is_recurring?: boolean
	recurring_type?: 'daily'|'weekly'|'monthly'|'yearly'
	offset?: number
	end_type?: 'never'|'date'|'occurances'
	end_date?: Date
	max_occurances?: string
	day_of_week?: string
	week_of_month?: string
	day_of_month?: string
	month_of_year?: string
}

interface INewShiftFormProps {
	start: Date
	end?: Date
	client: Schema.Person
	employees: Schema.Person[]
	onSubmit?: () => void
}

const NewShiftForm: React.FC<INewShiftFormProps> = ({ start, end, client, employees, onSubmit }) => {
	const { auth } = usePage<SharedInertiaProps>().props

	const defaultData: TFormData = {
		starts_at: start,
		ends_at: end || add(start, { hours: 8 }),
		client_ids: [client.id],
		employee: undefined,
		created_by_id: auth.user.id,
		is_recurring: false,
	}

	const handleSubmit = ({ transform, wasSuccessful }) => {
		const dataForRails = data => {
			const submitData: Record<string, any> = {
				shift: {
					starts_at: data.starts_at,
					ends_at: data.ends_at,
					client_ids: data.client_ids,
					employee_id: data.employee,
					created_by_id: data.created_by_id
				}
			}

			if(data.is_recurring) {
				submitData.shift.recurring_pattern_attributes = {
					recurring_type: data.recurring_type,
					offset: data.offset,
					end_date: data.end_type === 'date' ? data.end_date : undefined,
					max_occurances: data.end_type === 'occurances' ? data.max_occurances : undefined,
					day_of_week: data.day_of_week,
					week_of_month: data.week_of_month,
					day_of_month: data.day_of_month,
					month_of_year: data.month_of_year,
				}
			}
			return submitData
		}

		transform(data => {
			console.log({ submit: dataForRails(data) })
			return dataForRails(data)
		})

		if(wasSuccessful && onSubmit) onSubmit()
	}

	return (
		<Form noValidate onSubmit={ handleSubmit } to={ Routes.shifts() } data={ defaultData }>
			<Grid>
				{ /* Employee */ }
				<Grid.Col xs={ 12 }>
					<Autocomplete
						label="Employee"
						name="employee"
						options={ useCallback(() => employees.map(e => ({
							label: `${e.f_name} ${e.l_name}`,
							id: e.id
						})), [employees])() }
					/>
				</Grid.Col>

				{ /* Start */ }
				<Grid.Col xs={ 12 } md={ 6 }>
					<Grid.Col xs={ 8 }>
						<DateTime
							name="starts_at"
							label="Start"
							inputFormat="EEEE, MMM do"
						/>
					</Grid.Col>
					<Grid.Col xs={ 4 }>
						<DateTime
							name="starts_at"
							openTo="hours"
							inputFormat="hh:mm a"
						/>
					</Grid.Col>
				</Grid.Col>

				{ /* End */ }
				<Grid.Col xs={ 12 } md={ 6 }>
					<Grid.Col xs={ 4 }>
						<DateTime
							name="ends_at"
							openTo="hours"
							inputFormat="hh:mm a"
						/>
					</Grid.Col>
					<Grid.Col xs={ 8 }>
						<DateTime
							name="ends_at"
							label="End"
							inputFormat="EEEE, MMM do"
						/>
					</Grid.Col>
				</Grid.Col>

				{ /* Repeats */ }
				<Repeats />

				<Grid.Col xs={ 12 }>
					<Box sx={ { mt: 2 } }>
						<Submit />
					</Box>
				</Grid.Col>

			</Grid>
		</Form>
	)
}

export default NewShiftForm
