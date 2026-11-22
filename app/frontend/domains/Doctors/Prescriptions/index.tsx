import { useTranslation } from "react-i18next"

import { Link } from "@/components"
import { DateTimeFormatter } from "@/components/Formatters"
import { CollectionPanel, RecordRow } from "@/features"
import { Routes } from "@/lib"

interface DoctorPrescriptionsProps {
	doctor: Schema.DoctorsShow
}

function dosageLabel(dosage?: Schema.Dosage) {
	if(!dosage) return ""

	const amount = `${dosage.amount ?? ""} ${dosage.amount_unit ?? ""}`.trim()
	const frequency = `${dosage.freq_amount ?? ""} ${dosage.freq_period ?? ""}`.trim()
	const method = dosage.administration_method || ""
	return [amount, frequency ? `every ${frequency}` : "", method].filter(Boolean).join(" - ")
}

export function DoctorPrescriptions({ doctor }: DoctorPrescriptionsProps) {
	const { t } = useTranslation()

	return (
		<CollectionPanel
			title={ t("views.doctors.show.prescriptions.title") }
			count={ doctor.prescriptions.length }
			emptyLabel={ t("views.doctors.show.prescriptions.empty") }
		>
			{ doctor.prescriptions.map(prescription => {
				const label = dosageLabel(prescription.dosage)

				return (
					<RecordRow
						key={ prescription.id }
						title={ prescription.medication?.name || "-" }
						meta={ (
							<>
								{ label && <span>{ label }</span> }
								{ prescription.client && (
									<span>
										<Link href={ `${Routes.client(prescription.client.slug)}?tab=medical` }>
											{ prescription.client.person?.name || prescription.client.name }
										</Link>
									</span>
								) }
								<span>
									{ prescription.starts_at
										? <DateTimeFormatter>{ prescription.starts_at }</DateTimeFormatter>
										: "-" }
									{ " - " }
									{ prescription.ends_at
										? <DateTimeFormatter>{ prescription.ends_at }</DateTimeFormatter>
										: "Ongoing" }
								</span>
							</>
						) }
					/>
				)
			}) }

		</CollectionPanel>
	)
}
