import { useTranslation } from "react-i18next"
import { NestedObject } from "use-inertia-form"

import { Box, Button, Grid } from "@/components"
import { Select, Switch, DateTimeInput } from "@/components/Form/Inputs"

interface AssignmentsProps<TForm extends NestedObject = NestedObject> {
	model: string
	form: TForm
}

const Assignments = <TForm extends NestedObject>({ model, form }: AssignmentsProps<TForm>) => {
	const { t } = useTranslation()

	return (
		<Box>
			<Grid>
				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="permission_group_id"
						model={ model }
						label={ t("permission_group") }
						options={ [] }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Select
						name="role"
						model={ model }
						label={ t("role") }
						options={ [
							{ value: "member", label: t("member") },
							{ value: "admin", label: t("admin") },
						] }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<DateTimeInput
						name="starts_at"
						model={ model }
						label={ t("starts_at") }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<DateTimeInput
						name="ends_at"
						model={ model }
						label={ t("ends_at") }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Switch
						name="active"
						model={ model }
						label={ t("active") }
					/>
				</Grid.Col>

				<Grid.Col span={ { xs: 12, sm: 6 } }>
					<Button type="submit" fullWidth>
						{ t("save") }
					</Button>
				</Grid.Col>
			</Grid>
		</Box>
	)
}

export default Assignments
