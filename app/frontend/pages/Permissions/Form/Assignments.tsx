import { useTranslation } from "react-i18next"

import { Box, Grid } from "@/components"
import { DateTimeInput, Select, Switch } from "@/components/Inputs"

interface AssignmentsProps {
	prefix: string
}

const Assignments = ({ prefix }: AssignmentsProps) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Grid>
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name={ `${prefix}.permission_group_id` }
						label={ t("permission_group") }
						options={ [] }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name={ `${prefix}.role` }
						label={ t("role") }
						options={ [
							{ value: "member", label: t("member") },
							{ value: "admin", label: t("admin") },
						] }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<DateTimeInput
						name={ `${prefix}.starts_at` }
						label={ t("starts_at") }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<DateTimeInput
						name={ `${prefix}.ends_at` }
						label={ t("ends_at") }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Switch
						name={ `${prefix}.active` }
						label={ t("active") }
					/>
				</Grid.Col>
			</Grid>
		</Box>
	)
}

export default Assignments
