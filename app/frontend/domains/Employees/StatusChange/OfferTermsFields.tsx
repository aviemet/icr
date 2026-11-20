import { Grid } from "@/components"
import { CurrencyInput, DateInput, Label, Select, Textarea, TextInput } from "@/components/Inputs"
import { JobTitlesDropdown } from "@/components/Inputs/Dropdowns"
import { OFFER_PERIOD_OPTIONS } from "@/domains/Employees/Hiring/offerOptions"

export interface OfferTermsFieldsProps {
	prefix?: string
	jobTitleLabel?: string
	showEmployeeNumber?: boolean
	currentRateLabel?: string
}

export function OfferTermsFields({
	prefix = "offer",
	jobTitleLabel = "Job Title",
	showEmployeeNumber = true,
	currentRateLabel,
}: OfferTermsFieldsProps) {
	return (
		<>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<JobTitlesDropdown
					name={ `${prefix}.job_title_id` }
					label={ jobTitleLabel }
					required
				/>
			</Grid.Col>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<DateInput
					name={ `${prefix}.proposed_start_on` }
					label="Effective Date"
					required
					valueFormat="YYYY-MM-DD"
				/>
			</Grid.Col>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<Label required htmlFor={ `${prefix}.rate` } hint={ currentRateLabel }>
					Rate
				</Label>
				<CurrencyInput
					name={ `${prefix}.rate` }
					decimalScale={ 2 }
					required
				/>
			</Grid.Col>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<Select
					name={ `${prefix}.period` }
					label="Period"
					options={ OFFER_PERIOD_OPTIONS }
					required
				/>
			</Grid.Col>
			{ showEmployeeNumber && (
				<Grid.Col span={ { xxs: 12, sm: 6 } }>
					<TextInput name={ `${prefix}.employee_number` } label="Employee Number" />
				</Grid.Col>
			) }
			<Grid.Col span={ { xxs: 12 } }>
				<Textarea name={ `${prefix}.notes` } label="Notes" minRows={ 2 } />
			</Grid.Col>
		</>
	)
}
