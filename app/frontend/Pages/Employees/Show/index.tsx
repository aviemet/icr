import { router } from "@inertiajs/react"
import { useCallback } from "react"

import { Badge, Button, Group, Title, Menu, Page, Section, Tabs } from "@/Components"
import { Routes } from "@/lib"

import Contacts from "./Contacts"
import Details from "./Details"
import Documents from "./Documents"

// Temporary interface extending the expected Schema
interface EmployeeShowData extends Schema.EmployeesShow {
	status?: string // Make optional for now until backend is updated
	allowed_events?: string[] // Make optional for now
}

export interface ShowEmployeeProps {
	employee: EmployeeShowData // Use the extended interface
}

const tabsList = [
	{ id: "details", label: "Details", component: Details },
	{ id: "contacts", label: "Contact Details", component: Contacts },
	{ id: "documents", label: "Documents", component: Documents },
]

const ShowEmployee = ({ employee }: ShowEmployeeProps) => {
	const title = employee?.person?.name || "Employee"
	// Default allowed_events to empty array if undefined
	const { status, allowed_events = [] } = employee

	const eventButtonLabels: Record<string, string> = {
		make_offer: "Make Offer",
		accept_offer: "Accept Offer",
		reject_offer: "Reject Offer",
		terminate: "Terminate",
		reconsider: "Reconsider",
	}

	// Define mapping for routes (ensure these routes exist on the backend)
	// Commenting out usage temporarily as routes are not yet defined
	// const eventRoutes: Record<string, (slug: string) => string> = {
	// 	make_offer: Routes.makeOfferEmployee,
	// 	accept_offer: Routes.acceptOfferEmployee,
	// 	reject_offer: Routes.rejectOfferEmployee,
	// 	terminate: Routes.terminateEmployee,
	// 	reconsider: Routes.reconsiderEmployee,
	// }

	const handleEventClick = useCallback((event: string) => { // Add type to event
		// const routeGenerator = eventRoutes[event]
		// if (routeGenerator) {
		// Use POST for state changes, adjust method if necessary (e.g., DELETE for terminate)
		// TODO: Implement Offer Modal for 'make_offer'
		// TODO: Implement Reason Modal for 'terminate'/'reject_offer'
		if(event === "make_offer") {
			console.log("TODO: Open Make Offer Modal")
			// Placeholder for opening modal - state management needed here
		} else if(event === "terminate" || event === "reject_offer") {
			console.log("TODO: Open Reason Modal")
			// Placeholder for opening modal - state management needed here
			// For now, just trigger the action directly (commented out)
			// router.post(routeGenerator(employee.slug), {}, {
			// 	preserveScroll: true,
			// 	// Add confirmation dialog?
			// });
		} else {
			console.log(`TODO: Trigger event ${event} for employee ${employee.slug}`)
			// router.post(routeGenerator(employee.slug), {}, { preserveScroll: true });
		}
		// } else {
		// 	console.error(`Route not defined for event: ${event}`);
		// }
	}, [employee.slug])

	return (
		<Page title={ title } breadcrumbs={ [
			{ title: "Employees", href: Routes.employees() },
			{ title, href: Routes.employee(employee.slug) },
		] }>
			<Section fullHeight>

				<Group justify="space-between" align="flex-start">
					<Group align="center" gap="sm">
						<Title>{ title }</Title>
						{ status && <Badge>{ status.charAt(0).toUpperCase() + status.slice(1) }</Badge> }
					</Group>

					<Group>
						{ allowed_events.map((event: string) => { // Add type to event
							const label = eventButtonLabels[event]
							if(!label) return null // Don't render button if label isn't defined

							const isDestructive = event === "terminate" || event === "reject_offer"

							return (
								<Button
									key={ event }
									variant={ isDestructive ? "filled" : "outline" }
									color={ isDestructive ? "red" : undefined }
									onClick={ () => handleEventClick(event) }
								>
									{ label }
								</Button>
							)
						}) }

						<Menu position="bottom-end">
							<Menu.Target>
							</Menu.Target>
							<Menu.Dropdown>
								<Menu.Link href={ Routes.editEmployee(employee.slug) }>
									Edit Employee
								</Menu.Link>
							</Menu.Dropdown>
						</Menu>
					</Group>
				</Group>


				<Tabs urlControlled={ true } defaultValue={ tabsList[0].id } mt="md">
					<Tabs.List>
						{ tabsList.map(tab => (
							<Tabs.Tab key={ tab.id } value={ tab.id }>{ tab.label }</Tabs.Tab>
						)) }
					</Tabs.List>

					{ tabsList.map(tab => {
						const Component = tab.component

						return (
							<Tabs.Panel key={ tab.id } value={ tab.id } p="md">
								<Component employee={ employee } />
							</Tabs.Panel>
						)
					}) }
				</Tabs>

			</Section>

		</Page>
	)
}

export default ShowEmployee
