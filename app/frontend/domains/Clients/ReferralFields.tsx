import { Select as MantineSelect } from "@mantine/core"
import { useState } from "react"

import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { Label, Select, TextInput } from "@/components/Inputs"

const REGIONAL_CENTER = "regional_center"
const OTHER = "other"

type ReferralSource = typeof REGIONAL_CENTER | typeof OTHER | ""

type RegionalCenterOption = {
	id: string
	name: string
	code?: string
}

function initialSource(regionalCenterId: unknown, referredByOther: unknown): ReferralSource {
	if(regionalCenterId) return REGIONAL_CENTER
	if(typeof referredByOther === "string" && referredByOther.length > 0) return OTHER
	return ""
}

export interface ReferralFieldsProps {
	regionalCenterOptions: RegionalCenterOption[]
	regionalCenterIdName?: string
	referredByOtherName?: string
	sourceLabel?: string
	regionalCenterLabel?: string
	otherLabel?: string
}

export function ReferralFields({
	regionalCenterOptions,
	regionalCenterIdName = "client.regional_center_id",
	referredByOtherName = "client.referred_by_other",
	sourceLabel = "Referral source",
	regionalCenterLabel = "Regional Center",
	otherLabel = "Other / privately funded",
}: ReferralFieldsProps) {
	const [regionalCenterId, setRegionalCenterId] = useFormField(regionalCenterIdName)
	const [referredByOther, setReferredByOther] = useFormField(referredByOtherName)
	const [source, setSource] = useState<ReferralSource>(
		() => initialSource(regionalCenterId, referredByOther),
	)

	const options = regionalCenterOptions.map(center => ({
		value: center.id,
		label: center.name,
	}))

	return (
		<>
			<Grid.Col span={ { xxs: 12, sm: 4 } }>
				<Label htmlFor="client-referral-source-search">{ sourceLabel }</Label>
				<MantineSelect
					id="client-referral-source-search"
					autoComplete="off"
					data={ [
						{ value: REGIONAL_CENTER, label: "Regional center" },
						{ value: OTHER, label: "Other / privately funded" },
					] }
					value={ source || null }
					clearable
					onChange={ (value) => {
						if(value === REGIONAL_CENTER) {
							setSource(REGIONAL_CENTER)
							setReferredByOther("")
							return
						}

						if(value === OTHER) {
							setSource(OTHER)
							setRegionalCenterId(null)
							return
						}

						setSource("")
						setRegionalCenterId(null)
						setReferredByOther("")
					} }
				/>
			</Grid.Col>
			{ source === REGIONAL_CENTER && (
				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<Select
						name={ regionalCenterIdName }
						label={ regionalCenterLabel }
						options={ options }
						searchable
						clearable
					/>
				</Grid.Col>
			) }
			{ source === OTHER && (
				<Grid.Col span={ { xxs: 12, sm: 4 } }>
					<TextInput
						name={ referredByOtherName }
						label={ otherLabel }
					/>
				</Grid.Col>
			) }
		</>
	)
}
