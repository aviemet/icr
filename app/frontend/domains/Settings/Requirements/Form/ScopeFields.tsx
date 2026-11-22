import { Select as MantineSelect } from "@mantine/core"
import { useTranslation } from "react-i18next"

import { Grid } from "@/components"
import { useFormField } from "@/components/Form"
import { Label, Select } from "@/components/Inputs"

type Option = {
	value: string
	label: string
}

const COMPANY_WIDE = "company"
const JOB_TITLE = "job_title"
const CLIENT = "client"
const JOB_TITLE_SCOPE_TYPE = "Employee::JobTitle"
const CLIENT_SCOPE_TYPE = "Client"

export interface ScopeFieldsProps {
	jobTitleOptions: Option[]
	clientOptions: Option[]
}

export function ScopeFields({ jobTitleOptions, clientOptions }: ScopeFieldsProps) {
	const { t } = useTranslation()
	const [scopeType, setScopeType] = useFormField("requirement.scope_type")
	const [, setScopeId] = useFormField("requirement.scope_id")

	let scopeMode = COMPANY_WIDE
	if(scopeType === JOB_TITLE_SCOPE_TYPE) {
		scopeMode = JOB_TITLE
	} else if(scopeType === CLIENT_SCOPE_TYPE) {
		scopeMode = CLIENT
	}

	return (
		<>
			<Grid.Col span={ { xxs: 12, sm: 6 } }>
				<Label htmlFor="requirement-scope-mode-search">
					{ t("views.requirements.form.scope") }
				</Label>
				<MantineSelect
					id="requirement-scope-mode-search"
					autoComplete="off"
					data={ [
						{ value: COMPANY_WIDE, label: t("views.requirements.form.scope_company") },
						{ value: JOB_TITLE, label: t("views.requirements.form.scope_job_title") },
						{ value: CLIENT, label: t("views.requirements.form.scope_client") },
					] }
					value={ scopeMode }
					onChange={ (value) => {
						if(value === JOB_TITLE) {
							setScopeType(JOB_TITLE_SCOPE_TYPE)
							setScopeId(null)
							return
						}

						if(value === CLIENT) {
							setScopeType(CLIENT_SCOPE_TYPE)
							setScopeId(null)
							return
						}

						setScopeType(null)
						setScopeId(null)
					} }
				/>
			</Grid.Col>
			{ scopeMode === JOB_TITLE && (
				<Grid.Col span={ { xxs: 12, sm: 6 } }>
					<Select
						name="requirement.scope_id"
						label={ t("views.requirements.form.job_title") }
						options={ jobTitleOptions }
						searchable
						clearable
						required
					/>
				</Grid.Col>
			) }
			{ scopeMode === CLIENT && (
				<Grid.Col span={ { xxs: 12, sm: 6 } }>
					<Select
						name="requirement.scope_id"
						label={ t("views.requirements.form.client") }
						options={ clientOptions }
						searchable
						clearable
						required
					/>
				</Grid.Col>
			) }
		</>
	)
}
