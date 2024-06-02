import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ShiftsForm from '../Form'

interface EditShiftProps {
	shift: Schema.ShiftsEdit
}

const EditShift = ({ shift }: EditShiftProps) => {
	const title = 'Edit Shift'

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: 'Shifts', href: Routes.shifts() },
			{ title: Shift, href: Routes.shift(shift.id) },
			{ title },
		] }>
			<Section>
				<Heading>{ title }</Heading>
				
				<ShiftsForm
					method='put'
					to={ Routes.shift() }
					shift={ shift }
				/>
			</Section>
		</Page>
	)
}

export default EditShift
