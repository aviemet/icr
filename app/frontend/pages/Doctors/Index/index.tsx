import { useTranslation } from "react-i18next"

import { NewIcon } from "@/components/Icons"
import { DoctorTable } from "@/domains/Doctors/Table"
import { IndexPageTemplate } from "@/features"
import { Routes } from "@/lib"

interface DoctorIndexProps {
	doctors: Schema.DoctorsIndex[]
	pagination: Schema.Pagination
}

const DoctorsIndex = ({ doctors, pagination }: DoctorIndexProps) => {
	const { t } = useTranslation()

	return (
		<IndexPageTemplate
			title={ t("views.doctors.index.title") }
			model="doctors"
			pagination={ pagination }
			deleteRoute={ Routes.doctors() }
			dense
			actions={ [
				{ label: t("views.doctors.index.new"), href: Routes.newDoctor(), icon: <NewIcon /> },
			] }
		>
			<DoctorTable records={ doctors } model="doctors" />
		</IndexPageTemplate>
	)
}

export default DoctorsIndex
