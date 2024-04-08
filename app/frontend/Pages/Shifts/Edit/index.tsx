import React from 'react'
import { Heading, Page, Section } from '@/Components'
import { Routes } from '@/lib'
import ShiftsForm from '../Form'

interface IEditShiftProps {
	shift: Schema.ShiftsEdit
}

const EditShift = ({ shift }: IEditShiftProps) => {
	const title = 'Edit Shift'

	return (
		<Page title={ title }>
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
