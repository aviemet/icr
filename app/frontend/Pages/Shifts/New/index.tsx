import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ShiftForm from '../Form'

interface INewShiftProps {
	shift: Schema.ShiftsFormData
}

const NewShift = ({ ...data }: INewShiftProps) => {
	const title = 'New Shift'

	return (
		<Page title={ title }>

			<Section>
				<Heading>{ title }</Heading>

				<ShiftForm
					to={ Routes.shifts() }
					{ ...data }
				/>
			</Section>

		</Page>
	)
}

export default NewShift
