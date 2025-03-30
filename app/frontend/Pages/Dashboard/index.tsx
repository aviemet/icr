import React from "react"

import { Card, Group, Link, Section, Title } from "@/Components"
import { PlusIcon } from "@/Components/Icons"
import { DashboardCard } from "@/Features/Dashboard"
import { Routes } from "@/lib"
import { usePageProps } from "@/lib/hooks"

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
