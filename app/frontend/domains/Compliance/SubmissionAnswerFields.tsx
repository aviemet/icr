import { DateInput, RadioGroup, Textarea } from "@/components/Inputs"

interface SubmissionAnswerFieldsProps {
	index: number
	kind: Schema.ComplianceFormItemsPersisted["kind"]
	label: string
	required: boolean
}

export function SubmissionAnswerFields({ index, kind, label, required }: SubmissionAnswerFieldsProps) {
	const baseName = `form_submission.form_answers.${index}`

	if(kind === "boolean_check" || kind === "gate") {
		return (
			<RadioGroup
				name={ `${baseName}.check_value` }
				label={ label }
				options={ kind === "gate"
					? [
						{ label: "Yes", value: "pass" },
						{ label: "No", value: "fail" },
					]
					: [
						{ label: "Pass", value: "pass" },
						{ label: "Fail", value: "fail" },
						{ label: "N/A", value: "na" },
					] }
			/>
		)
	}

	if(kind === "text") {
		return (
			<Textarea
				name={ `${baseName}.text_value` }
				label={ label }
				minRows={ 2 }
				required={ required }
			/>
		)
	}

	if(kind === "date") {
		return (
			<DateInput
				name={ `${baseName}.date_value` }
				label={ label }
				required={ required }
			/>
		)
	}

	return null
}
