import { useTranslation } from "react-i18next"

import { Container, Group, Paper, Stack, Text, Title } from "@/components"

import { TimesheetFilters } from "./TimesheetFilters"
import { TimesheetList } from "./TimesheetList"
import { TimesheetStats } from "./TimesheetStats"

export default function TimesheetsIndex() {
	const { t } = useTranslation()

	return (
		<Container size="xl">
			<Stack>
				<Group>
					<Title order={ 2 }>{ t("views.timesheets.index.title") }</Title>
				</Group>

				<Paper p="md" radius="sm" withBorder>
					<TimesheetStats />
				</Paper>

				<Paper p="md" radius="sm" withBorder>
					<Stack>
						<Group>
							<Text size="lg">
								{ t("views.timesheets.index.current_period") }
							</Text>
						</Group>
						<TimesheetFilters />
						<TimesheetList />
					</Stack>
				</Paper>
			</Stack>
		</Container>
	)
}
