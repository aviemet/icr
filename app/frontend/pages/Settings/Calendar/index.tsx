import { useTranslation } from "react-i18next"

import { Box, Grid, Information, Label, Stack, Text } from "@/components"
import { Form } from "@/components/Form"
import { Select, Switch } from "@/components/Inputs"
import { SettingsPageHeader } from "@/domains/Settings/SettingsPageHeader"
import { SettingsSaveButton } from "@/domains/Settings/SettingsSaveButton"
import { FormBand, FormBandStack } from "@/features"
import { Routes, withLayout } from "@/lib"

import ShiftTitleFormatInput from "./ShiftTitleFormatInput"

interface CalendarSettingsProps {
	settings: Schema.Setting
}

const splitEventsName = "settings.calendar_split_events_show_original_times"

const CalendarSettings = ({ settings }: CalendarSettingsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Form
				action={ Routes.settingsCalendar() }
				method="patch"
				initialData={ { settings } }
			>
				<SettingsPageHeader
					title={ t("views.settings.calendar.title") }
					description={ t("views.settings.calendar.description") }
					actions={ <SettingsSaveButton /> }
				/>

				<FormBandStack>
					<FormBand
						title={ t("views.settings.calendar.month_layout_title") }
						description={ t("views.settings.calendar.month_layout_description") }
					>
						<Grid>
							<Grid.Col span={ 12 }>
								<Stack gap="xs">
									<Text size="sm">
										<strong>{ t("views.settings.calendar.strategy_split") }</strong>
										{ " - " }
										{ t("views.settings.calendar.strategy_split_help") }
									</Text>
									<Text size="sm">
										<strong>{ t("views.settings.calendar.strategy_stack") }</strong>
										{ " - " }
										{ t("views.settings.calendar.strategy_stack_help") }
									</Text>
									<Text size="sm">
										<strong>{ t("views.settings.calendar.strategy_span") }</strong>
										{ " - " }
										{ t("views.settings.calendar.strategy_span_help") }
									</Text>
								</Stack>
							</Grid.Col>

							<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
								<Select
									name="settings.calendar_layout_style"
									label={ t("views.settings.calendar.strategy_label") }
									options={ [
										{ label: t("views.settings.calendar.strategy_split"), value: "split" },
										{ label: t("views.settings.calendar.strategy_stack"), value: "stack" },
										{ label: t("views.settings.calendar.strategy_span"), value: "span" },
									] }
								/>
							</Grid.Col>

							<Grid.Col span={ { lg: 4, md: 6, xs: 12 } }>
								<Box
									display="flex"
									style={ { alignItems: "center", gap: "0.25rem" } }
								>
									<Label htmlFor={ splitEventsName }>
										{ t("views.settings.calendar.split_times_label") }
									</Label>
									<Information position="top">
										{ t("views.settings.calendar.split_times_info") }
									</Information>
								</Box>
								<Switch
									id={ splitEventsName }
									name={ splitEventsName }
									wrapperProps={ { style: { display: "inline-block" } } }
								/>
							</Grid.Col>
						</Grid>
					</FormBand>

					<FormBand
						title={ t("views.settings.calendar.shift_title_band_title") }
						description={ t("views.settings.calendar.shift_title_band_description") }
					>
						<ShiftTitleFormatInput settings={ settings } />
					</FormBand>
				</FormBandStack>
			</Form>
		</Box>
	)
}

export default withLayout(CalendarSettings, "settings")
