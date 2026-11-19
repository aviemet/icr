import { Box } from "@/components"
import { PersonForm } from "@/domains/Settings/People/Form"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface EditPersonProps {
	person: Schema.PeopleFormData
}

const EditPerson = ({ person }: EditPersonProps) => {
	const name = person.name || "Person"

	return (
		<Box>
			<SettingsPageHeader
				title={ `Edit ${name}` }
				description="Update name details for this person."
			/>
			<FormBandStack>
				<FormBand title="Identity" description="Legal and preferred names.">
					<PersonForm
						method="put"
						to={ Routes.settingsPerson(person.slug!) }
						person={ person }
					/>
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(EditPerson, "settings")
