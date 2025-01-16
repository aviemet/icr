import { Card, Group, Link, Section, Title } from '@/Components'
import { usePageProps } from '@/lib/hooks'
import React from 'react'
import { DashboardCard } from '@/Features/Dashboard'
import { Routes } from '@/lib'
import { PlusIcon } from '@/Components/Icons'

const Dashboard = () => {
	const { settings } = usePageProps()
	return (
		<Section>
			<Title>{ settings.company_name }</Title>

			<Group>
				<Link as="button" href={ Routes.newClient() }>
					<PlusIcon /> New Client
				</Link>
				<Link as="button" href={ Routes.newEmployee() }>
					<PlusIcon /> New Employee
				</Link>
			</Group>
		</Section>
	)
}

export default Dashboard
