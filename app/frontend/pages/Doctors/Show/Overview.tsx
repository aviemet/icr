import { DoctorOverview } from "@/domains/Doctors/Overview"

import { type ShowDoctorProps } from "."

const Overview = ({ doctor }: ShowDoctorProps) => {
	return <DoctorOverview doctor={ doctor } />
}

export default Overview
