import { useTranslation } from "react-i18next"

import { Box, Group, ScheduleButton, Section, Text } from "@/components"
import { Routes } from "@/lib"

import { type ShowClientProps } from "."

interface ClientDetailsProps extends ShowClientProps {}

const Details = ({ client }: ClientDetailsProps) => {
	const { t } = useTranslation()

	return (
		<Section>
			<Group grow justify="space-between">
				<Box></Box>
				<Box style={ { flex: 0 } }>
					<ScheduleButton href={ Routes.scheduleClient(client.slug) } />
				</Box>
			</Group>
			<Text>{ t("views.clients.show.details.placeholder") }</Text>
		</Section>
	)
}

export default Details
