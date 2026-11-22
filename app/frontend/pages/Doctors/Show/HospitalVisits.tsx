import { DoctorHospitalVisits } from "@/domains/Doctors/HospitalVisits"

import { type ShowDoctorProps } from "."

const HospitalVisits = ({ doctor }: ShowDoctorProps) => {
	return <DoctorHospitalVisits doctor={ doctor } />
}

export default HospitalVisits
