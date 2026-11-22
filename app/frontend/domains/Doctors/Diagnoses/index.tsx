import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface DoctorDiagnosesProps {
	doctor: Schema.DoctorsShow
}

export function DoctorDiagnoses({ doctor }: DoctorDiagnosesProps) {
	const { t } = useTranslation()

	return (
		<CollectionPanel
			title={ t("views.doctors.show.diagnoses.title") }
			count={ doctor.diagnoses.length }
			emptyLabel={ t("views.doctors.show.diagnoses.empty") }
		>
			{ doctor.diagnoses.map(diagnosis => (
				<RecordRow
					key={ diagnosis.id }
					title={ diagnosis.code ? `${diagnosis.name} (${diagnosis.code})` : diagnosis.name }
					meta={ (
						<>
							{ diagnosis.client && (
								<span>
									<Link href={ `${Routes.client(diagnosis.client.slug)}?tab=medical` }>
										{ diagnosis.client.person?.name || diagnosis.client.name }
									</Link>
								</span>
							) }
							{ diagnosis.diagnosed_on && (
								<span>
									<DateTimeFormatter>{ diagnosis.diagnosed_on }</DateTimeFormatter>
								</span>
							) }
							{ !diagnosis.active && <span>Inactive</span> }
						</>
					) }
				/>
			)) }
		</CollectionPanel>
	)
}
