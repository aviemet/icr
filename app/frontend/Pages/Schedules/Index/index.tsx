import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/react'
import { Link, Grid } from '@/Components'
import Table from '../Table'
import { Schema } from '@tiptap/pm/model'
import { IndexPageTemplate } from '@/Features'
import SchedulesTable from '../Table'

interface ScheduleIndexProps {
	clients: Schema.Client[]
	pagination: Schema.Pagination
}

const Index = ({ clients, pagination }: ScheduleIndexProps) => {
	return (
		<IndexPageTemplate
			title="Clients"
			model="clients"
			rows={ clients }
			pagination={ pagination }
			deleteRoute={ Routes.clients() }
		>
			<SchedulesTable />
		</IndexPageTemplate>
	)
}

export default Index
