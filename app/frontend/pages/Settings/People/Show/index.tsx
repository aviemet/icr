import { Box, Group, Link, Text } from "@/components"
import { EditButton } from "@/components/Button"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

interface ShowPersonProps {
	person: Schema.PeopleShow
}

const ShowPerson = ({ person }: ShowPersonProps) => {
	const title = person?.name || "Person"

	return (
		<Box>
			<SettingsPageHeader
				title={ title }
				description="Person record in settings."
				actions={ (
					<Group gap="xs">
						<EditButton href={ Routes.editSettingsPerson(person.slug) } label={ title } />
						<Link
							href={ Routes.settingsPeople() }
							as="button"
							buttonProps={ { variant: "light", size: "sm" } }
						>
							Back to People
						</Link>
					</Group>
				) }
			/>
			<FormBandStack>
				<FormBand title="Details" description="Role and identity for this person.">
					<Text size="sm">
						Role: { person.agency_role || "-" }
					</Text>
				</FormBand>
			</FormBandStack>
		</Box>
	)
}

export default withLayout(ShowPerson, "settings")
