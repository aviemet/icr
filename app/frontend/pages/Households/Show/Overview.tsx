import { HouseholdOverview } from "@/domains/Households/Overview"

import { type ShowHouseholdProps } from "."

const Overview = ({ household }: ShowHouseholdProps) => {
	return <HouseholdOverview household={ household } />
}

export default Overview
