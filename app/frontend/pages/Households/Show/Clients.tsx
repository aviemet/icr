import { HouseholdClients } from "@/domains/Households/Clients"

import { type ShowHouseholdProps } from "."

const Clients = ({ household, available_clients = [] }: ShowHouseholdProps) => {
	return (
		<HouseholdClients
			household={ household }
			availableClients={ available_clients }
		/>
	)
}

export default Clients
