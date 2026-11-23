import { DateTimeFormatter } from "@/components/Formatters"

import { dosageLabel } from "./prescriptionHelpers"

interface PrescriptionMetaProps {
	prescription: Schema.PrescriptionsPersisted
}

export function PrescriptionMeta({ prescription }: PrescriptionMetaProps) {
	const label = dosageLabel(prescription.dosage)

	return (
		<>
			{ label && <span>{ label }</span> }
			<span>Doctor: { prescription.doctor?.person?.name || prescription.doctor?.name || "-" }</span>
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
	)
}
