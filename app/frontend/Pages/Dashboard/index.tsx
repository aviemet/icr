import { Group, Section, Title } from '@/Components'
import { usePageProps } from '@/lib/hooks'
import React from 'react'
import { DashboardCard } from '@/Features/Dashboard'

const Dashboard = () => {
	const { settings } = usePageProps()
	return (
		<Section>
			<Title>{ settings.company_name }</Title>

			<Group>
				<DashboardCard />
			</Group>
		</Section>
	)
}

export default Dashboard
