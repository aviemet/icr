import React from 'react'
import { Routes } from '@/lib'
import { Head } from '@inertiajs/react'
import { Link, Grid } from '@/Components'
import Table from './Table'
import { Schema } from '@tiptap/pm/model'

interface SchedulsIndexProps {
	clients: Schema.Client[]
}

const Index = ({ clients }: SchedulsIndexProps) => {
	return (
		<>
			<Head title="Clients"></Head>

			<h1>Clients</h1>

			<Link href={ Routes.newClient() } as="button">New Client</Link>

					<Table clients={ clients } />
		</>
	)
}

export default Index