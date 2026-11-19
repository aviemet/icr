import { Box } from "@/components"
import { PersonForm } from "@/domains/Settings/People/Form"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface NewPersonProps {
	person: Schema.PeopleFormData
}

const NewPerson = ({ person }: NewPersonProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="New Person"
				description="Create a person record."
			/>
			<FormBandStack>
				<FormBand title="Identity" description="Legal and preferred names.">
					<PersonForm
						to={ Routes.settingsPeople() }
						person={ person }
					/>
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(NewPerson, "settings")
