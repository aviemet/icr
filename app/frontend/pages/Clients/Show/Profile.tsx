import { ClientProfileForm } from "@/domains/Clients/Profile/Form"

import { type ShowClientProps } from "."

const Profile = ({ client, regional_center_options = [] }: ShowClientProps) => {
	return (
		<ClientProfileForm
			client={ client }
			regionalCenterOptions={ regional_center_options }
		/>
	)
}

export default Profile
