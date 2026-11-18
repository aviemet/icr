import { Box } from "@/components"
import { CompanyForm } from "@/domains/Settings/Company/Form"
import { withLayout } from "@/lib"

import { SettingsPageHeader } from "../../SettingsPageHeader"

export interface CompanyDetailsProps {
	company: Schema.CompaniesShow
}

const CompanyDetails = ({ company }: CompanyDetailsProps) => {
	return (
		<Box>
			<SettingsPageHeader
				title="Company Details"
				description="Company name, addresses, and phone numbers."
			/>
			<CompanyForm company={ company } />
		</Box>
	)
}

export default withLayout(CompanyDetails, "settings")
