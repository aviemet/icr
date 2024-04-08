import React from 'react'
import { Routes } from '@/lib'
import { IndexPageTemplate } from '@/Layouts/AppLayout/Components'
import { NewIcon } from '@/Components/Icons'
import HouseholdsTable from '../Table'

interface IHouseholdIndexProps {
	households: Schema.HouseholdsIndex[]
	pagination: Schema.Pagination
}

const HouseholdsIndex = ({ households, pagination }: IHouseholdIndexProps) => {
	return (
		<IndexPageTemplate
			title="Households"
			model="households"
			rows={ households }
			pagination={ pagination }
			deleteRoute={ Routes.households() }
			menuOptions={ [
				{ label: 'New Household', href: Routes.newHousehold(), icon: NewIcon },
			] }
		>
			<HouseholdsTable />
		</IndexPageTemplate>
	)
}

export default HouseholdsIndex
