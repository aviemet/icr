import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface DoctorHospitalVisitsProps {
	doctor: Schema.DoctorsShow
}

export function DoctorHospitalVisits({ doctor }: DoctorHospitalVisitsProps) {
	const { t } = useTranslation()

	return (
		<CollectionPanel
			title={ t("views.doctors.show.hospital_visits.title") }
			count={ doctor.hospital_visits.length }
			emptyLabel={ t("views.doctors.show.hospital_visits.empty") }
		>
			{ doctor.hospital_visits.map(visit => (
				<RecordRow
					key={ visit.id }
					title={ visit.hospital_name }
					meta={ (
						<>
							{ visit.client && (
								<span>
									<Link href={ `${Routes.client(visit.client.slug)}?tab=medical` }>
										{ visit.client.person?.name || visit.client.name }
									</Link>
								</span>
							) }
							{ visit.reason && <span>{ visit.reason }</span> }
							<span>
								{ visit.admitted_at
									? <DateTimeFormatter>{ visit.admitted_at }</DateTimeFormatter>
									: "-" }
								{ " - " }
								{ visit.discharged_at
									? <DateTimeFormatter>{ visit.discharged_at }</DateTimeFormatter>
									: "Ongoing" }
							</span>
							{ visit.incident_report_id && (
								<span>
									<Link href={ Routes.incidentReport(visit.incident_report_id) }>
										Incident
									</Link>
								</span>
							) }
						</>
					) }

				/>
			)) }
		</CollectionPanel>
	)
}
