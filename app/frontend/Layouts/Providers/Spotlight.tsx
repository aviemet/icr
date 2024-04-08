import React, { useEffect, useState } from 'react'
import { rem, Button } from '@mantine/core'
import { Spotlight, type SpotlightActionData } from '@mantine/spotlight'
import {
	SearchIcon,
	DashboardIcon,
	ItemsIcon,
	SettingsIcon,
	AssetsIcon,
	AccessoriesIcon,
	ComponentsIcon,
	ConsumablesIcon,
} from '@/Components/Icons'
import { router } from '@inertiajs/react'
import { Routes } from '@/lib'
import axios from 'axios'
import { Loader } from '@mantine/core'


const defaultActions: SpotlightActionData[] = [
	{
		id: 'dashboard',
		label: 'Dashboard',
		description: 'Personalized start page for your organization',
		group: 'Dashboard',
		onClick: () => router.get(Routes.root()),
		leftSection: <DashboardIcon size={ 18 } />,
	},

	{
		id: 'assets',
		label: 'All Assets',
		description: 'View all company assets',
		group: 'Assets',
		onClick: () => router.get(Routes.assets()),
		leftSection: <AssetsIcon size={ 18 } />,
	},
	{
		id: 'items',
		label: 'Hardware',
		description: 'View all hardware items',
		group: 'Assets',
		onClick: () => router.get(Routes.items()),
		leftSection: <ItemsIcon size={ 18 } />,
	},
	{
		id: 'accessories',
		label: 'Accessories',
		description: 'View all accessories',
		group: 'Assets',
		onClick: () => router.get(Routes.accessories()),
		leftSection: <AccessoriesIcon size={ 18 } />,
	},
	{
		id: 'components',
		label: 'Components',
		description: 'View all components',
		group: 'Assets',
		onClick: () => router.get(Routes.components()),
		leftSection: <ComponentsIcon size={ 18 } />,
	},
	{
		id: 'consumables',
		label: 'Consumables',
		description: 'View all consumables',
		group: 'Assets',
		onClick: () => router.get(Routes.consumables()),
		leftSection: <ConsumablesIcon size={ 18 } />,
	},

	{
		id: 'tickets',
		label: 'Tickets',
		description: 'Support tickets',
		group: 'Tickets',
		onClick: () => router.get(Routes.tickets()),
		leftSection: <DashboardIcon size={ 18 } />,
	},

	{
		id: 'settings',
		label: 'Settings',
		description: 'Site configuration and settings',
		group: 'Settings',
		onClick: () => router.get(Routes.settingsGeneralIndex()),
		leftSection: <SettingsIcon size={ 18 } />,
	},
]


type TValues = {
	items: Schema.Item[]
	accessories: Schema.Accessory[]
	components: Schema.Component[]
	consumables: Schema.Consumable[]
	licenses: Schema.License[]
	people: Schema.Person[]
	tickets: Schema.Ticket[]
	networks: Schema.Network[]
	vendors: Schema.Vendor[]
	contracts: Schema.Contract[]
}

const generateActions = (values?: TValues) => {
	if(!values) return []

	return [
		...values.items.map(item => ({
			id: 'items',
			label: item.name,
			description: `${item.type}: ${item?.model?.name || ''}`,
			group: 'Items',
			onClick: () => router.get(Routes.item(item.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['items'],
		})),
		...values.accessories.map(accessory => ({
			id: 'accessories',
			label: accessory.name,
			description: `${accessory.type}: ${accessory?.model?.name || ''}`,
			group: 'Accessories',
			onClick: () => router.get(Routes.accessory(accessory.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['accessory', 'accessories'],
		})),
		...values.components.map(component => ({
			id: 'components',
			label: component.name,
			description: `${component.type}: ${component?.model?.name || ''}`,
			group: 'Components',
			onClick: () => router.get(Routes.component(component.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['components'],
		})),
		...values.consumables.map(consumable => ({
			id: 'consumables',
			label: consumable.name,
			description: `${consumable.type}: ${consumable?.model?.name || ''}`,
			group: 'Consumables',
			onClick: () => router.get(Routes.consumable(consumable.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['consumables'],
		})),
		...values.licenses.map(license => ({
			id: 'licenses',
			label: license.name,
			description: license?.manufacturer?.name || '',
			group: 'Licenses',
			onClick: () => router.get(Routes.license(license.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['licenses'],
		})),
		...values.people.map(person => ({
			id: 'people',
			label: person.name!,
			description: person?.job_title || '',
			group: 'People',
			onClick: () => router.get(Routes.person(person.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['people', 'person'],
		})),
		...values.tickets.map(ticket => ({
			id: 'tickets',
			label: ticket.subject,
			description: ticket?.primary_contact?.name || '',
			group: 'Tickets',
			onClick: () => router.get(Routes.ticket(ticket.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['tickets'],
		})),
		...values.networks.map(network => ({
			id: 'networks',
			label: `${network.name || network.address}`,
			description: `${network.vlan_id + '+' ?? ''}${network.name ? network.address : ''}`,
			group: 'Networks',
			onClick: () => router.get(Routes.network(network.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['networks'],
		})),
		...values.vendors.map(vendor => ({
			id: 'vendors',
			label: vendor.name,
			description: vendor.url || '',
			group: 'Vendors',
			onClick: () => router.get(Routes.vendor(vendor.slug)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['vendors'],
		})),
		...values.contracts.map(contract => ({
			id: 'contracts',
			label: contract.name,
			description: contract?.vendor?.name || '',
			group: 'Contracts',
			onClick: () => router.get(Routes.contract(contract.id)),
			leftSection: <SettingsIcon size={ 18 } />,
			keywords: ['contracts'],
		})),
	]
}

const SpotlightComponent = () => {
	const [query, setQuery] = useState('')
	const [values, setValues] = useState<TValues>()
	const [actions, setActions] = useState(defaultActions)
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if(query === '') {
			setActions(defaultActions)
			return
		}

		if(values === undefined) {
			setLoading(true)
			axios.get(Routes.apiSpotlights())
				.then(response => {
					setValues(response.data)
					setLoading(false)
				})
		}

		setActions(generateActions(values))
	}, [query])

	return (
		<Spotlight
			actions={ actions }
			nothingFound={ loading ? <Loader /> : 'Nothing found...' }
			onQueryChange={ setQuery }
			query={ query }
		/>
	)
}

export default SpotlightComponent
