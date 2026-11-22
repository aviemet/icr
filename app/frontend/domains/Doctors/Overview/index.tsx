import { useTranslation } from "react-i18next"

import { Box, Text } from "@/components"
import { PhoneFormatter } from "@/components/Formatters"
import {
	BoardActionGrid,
	BoardActionTile,
	CountChip,
	MetricLine,
	MetricTile,
} from "@/features"
import { Routes } from "@/lib"

import * as classes from "./Overview.css"

interface DoctorOverviewProps {
	doctor: Schema.DoctorsShow
}

export function DoctorOverview({ doctor }: DoctorOverviewProps) {
	const { t } = useTranslation()
	const phones = doctor.person?.contact?.phones ?? []

	return (
		<Box className={ classes.board }>
			<Box className={ classes.tileRow }>
				<MetricTile title={ t("views.doctors.show.overview.specialty") }>
					<MetricLine
						label={ t("views.doctors.show.overview.specialty") }
						value={ doctor.specialty || "-" }
					/>
					<MetricLine
						label={ t("views.doctors.show.overview.npi") }
						value={ doctor.npi || "-" }
					/>
					<MetricLine
						label={ t("views.doctors.show.overview.practice") }
						value={ doctor.practice_name || "-" }
					/>
				</MetricTile>

				<MetricTile title={ t("views.doctors.show.overview.phone") }>
					{ phones.length === 0
						? <Text size="sm" c="dimmed">{ t("views.doctors.show.overview.none") }</Text>
						: phones.map(phone => (
							<MetricLine
								key={ phone.id }
								label={ phone.name || t("views.doctors.show.overview.phone") }
								value={ <PhoneFormatter>{ phone.number }</PhoneFormatter> }
							/>
						)) }
				</MetricTile>

				<MetricTile title={ t("views.doctors.show.overview.notes") }>
					<Text size="sm">{ doctor.notes || "-" }</Text>
				</MetricTile>
			</Box>

			<Box className={ classes.tileRow }>
				<MetricTile title={ t("views.doctors.show.tabs.overview") }>
					<MetricLine
						label={ t("views.doctors.show.overview.clients") }
						value={ <CountChip value={ doctor.clients_count } /> }
					/>
					<MetricLine
						label={ t("views.doctors.show.overview.prescriptions") }
						value={ <CountChip value={ doctor.prescriptions_count } /> }
					/>
					<MetricLine
						label={ t("views.doctors.show.overview.diagnoses") }
						value={ <CountChip value={ doctor.diagnoses_count } /> }
					/>
					<MetricLine
						label={ t("views.doctors.show.overview.hospital_visits") }
						value={ <CountChip value={ doctor.hospital_visits_count } /> }
					/>
					<BoardActionGrid>
						<BoardActionTile
							href={ `${Routes.doctor(doctor.slug)}?tab=clients` }
							title={ t("views.doctors.show.tabs.clients") }
							hint={ t("views.doctors.show.overview.clients") }
						/>
						<BoardActionTile
							href={ `${Routes.doctor(doctor.slug)}?tab=prescriptions` }
							title={ t("views.doctors.show.tabs.prescriptions") }
							hint={ t("views.doctors.show.overview.prescriptions") }
						/>
						<BoardActionTile
							href={ `${Routes.doctor(doctor.slug)}?tab=diagnoses` }
							title={ t("views.doctors.show.tabs.diagnoses") }
							hint={ t("views.doctors.show.overview.diagnoses") }
						/>
						<BoardActionTile
							href={ `${Routes.doctor(doctor.slug)}?tab=hospital_visits` }
							title={ t("views.doctors.show.tabs.hospital_visits") }
							hint={ t("views.doctors.show.overview.hospital_visits") }
						/>
					</BoardActionGrid>
				</MetricTile>
			</Box>
		</Box>
	)
}
