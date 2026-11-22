import { Box } from "@/components"
import { CompanyForm } from "@/domains/Settings/Company/Form"
import { withLayout } from "@/lib"

export interface CompanyDetailsProps {
	company: Schema.CompaniesShow
}

const CompanyDetails = ({ company }: CompanyDetailsProps) => {
	return (
		<Box>
			<CompanyForm company={ company } />
		</Box>
	)
}

export default withLayout(CompanyDetails, "settings")
