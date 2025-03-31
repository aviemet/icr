import { Box, Group, ScheduleButton, Section, Text } from "@/Components"
import { Routes } from "@/lib"

import { type ShowClientProps } from "."

interface ClientDetailsProps extends ShowClientProps {}

const Details = ({ client }: ClientDetailsProps) => {
	return (
		<Section>
			<Group grow justify="space-between">
				<Box></Box>
				<Box style={ { flex: 0 } }>
					<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
				</Box>
			</Group>
			<Text>Some kind of useful dashboard, maybe important or commonly needed information and a picture. Maybe some stats and/or charts computed from other data. Could even be just a list of useful links for the client, curated by the agency.</Text>
		</Section>
	)
}

export default Details
