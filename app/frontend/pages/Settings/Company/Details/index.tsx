import { Box } from "@/components"
import { CompanyForm } from "@/domains/Settings/Company/Form"
import { withLayout } from "@/lib"

export interface CompanyDetailsProps {
	company: Schema.CompaniesShow
	regional_center_options?: Schema.RegionalCentersOptions[]
}

const CompanyDetails = ({
	company,
	regional_center_options = [],
}: CompanyDetailsProps) => {
	return (
		<Box>
			<CompanyForm
				company={ company }
				regionalCenterOptions={ regional_center_options }
			/>
		</Box>
	)
}

export default withLayout(CompanyDetails, "settings")
