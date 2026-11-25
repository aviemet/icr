import { HouseholdProfileForm } from "@/domains/Households/Profile/Form"

import { type ShowHouseholdProps } from "."

const Profile = ({ household }: ShowHouseholdProps) => {
	return <HouseholdProfileForm household={ household } />
}

export default Profile
