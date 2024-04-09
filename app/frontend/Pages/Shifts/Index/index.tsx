import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Features'
import { NewIcon } from '@/Components/Icons'
import ShiftsTable from '../Table'

interface IShiftIndexProps {
	shifts: Schema.ShiftsIndex[]
	pagination: Schema.Pagination
}

const ShiftsIndex = ({ shifts, pagination }: IShiftIndexProps) => {
	return (
		<IndexPageTemplate
			title="Shifts"
			model="shifts"
			rows={ shifts }
			pagination={ pagination }
			deleteRoute={ Routes.shifts() }
			menuOptions={ [
				{ label: 'New Shift', href: Routes.newShift(), icon: NewIcon },
			] }
		>
			<ShiftsTable />
		</IndexPageTemplate>
	)
}

export default ShiftsIndex
