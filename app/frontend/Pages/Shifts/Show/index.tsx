import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ShiftForm from '../Form'

interface NewShiftProps {
	shift: Schema.ShiftsFormData
}

const NewShift = ({ ...data }: NewShiftProps) => {
	const title = 'New Shift'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Shifts', href: Routes.shifts() },
			{ title: 'New Shift' },
		] }>

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
