import { ClientProfileForm } from "@/domains/Clients/Profile/Form"

import { type ShowClientProps } from "."

const Profile = ({ client }: ShowClientProps) => {
	return <ClientProfileForm client={ client } />
}

export default Profile
