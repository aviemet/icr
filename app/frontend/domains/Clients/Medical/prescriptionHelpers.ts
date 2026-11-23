export const AMOUNT_UNIT_OPTIONS = [
	{ value: "mg", label: "mg" },
	{ value: "ml", label: "ml" },
	{ value: "tablet", label: "Tablet" },
	{ value: "capsule", label: "Capsule" },
	{ value: "unit", label: "Unit" },
	{ value: "other", label: "Other" },
]

export const FREQ_PERIOD_OPTIONS = [
	{ value: "hour", label: "Hour" },
	{ value: "day", label: "Day" },
	{ value: "week", label: "Week" },
	{ value: "month", label: "Month" },
	{ value: "as_needed", label: "As Needed" },
]

export const ADMIN_METHOD_OPTIONS = [
	{ value: "oral", label: "Oral" },
	{ value: "sublingual", label: "Sublingual" },
	{ value: "injection", label: "Injection" },
	{ value: "topical", label: "Topical" },
	{ value: "inhaled", label: "Inhaled" },
	{ value: "rectal", label: "Rectal" },
	{ value: "other", label: "Other" },
]

export function isActivePrescription(prescription: Schema.PrescriptionsPersisted) {
	const today = new Date()
	today.setHours(0, 0, 0, 0)
	const starts = prescription.starts_at ? new Date(prescription.starts_at) : null
	const ends = prescription.ends_at ? new Date(prescription.ends_at) : null
	const started = !starts || starts <= today
	const notEnded = !ends || ends >= today
	return started && notEnded
}

export function dosageLabel(dosage?: Schema.Dosage) {
	if(!dosage) return ""

	const amount = `${dosage.amount ?? ""} ${dosage.amount_unit ?? ""}`.trim()
	const frequency = `${dosage.freq_amount ?? ""} ${dosage.freq_period ?? ""}`.trim()
	const method = dosage.administration_method || ""
	return [amount, frequency ? `every ${frequency}` : "", method].filter(Boolean).join(" - ")
}
