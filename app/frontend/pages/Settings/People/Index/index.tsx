import { Box, Button, Link } from "@/components"
import { PlusIcon } from "@/components/Icons"
import { PersonTable } from "@/domains/Settings/People/Table"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface PersonIndexProps {
	people: Schema.PeopleIndex[]
	pagination: Schema.Pagination
}

const PeopleIndex = ({ people, pagination }: PersonIndexProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="People"
				description="Person records linked to clients, employees, and login accounts."
				actions={ (
					<Button
						component={ Link }
						href={ Routes.newSettingsPerson() }
						leftSection={ <PlusIcon size={ 16 } /> }
					>
						New Person
					</Button>
				) }
			/>
			<PersonTable records={ people } model="people" pagination={ pagination } />
		</Box>
	)
}

export default withLayout(PeopleIndex, "settings")
