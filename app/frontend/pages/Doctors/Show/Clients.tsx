import { DoctorClients } from "@/domains/Doctors/Clients"

import { type ShowDoctorProps } from "."

const Clients = ({ doctor }: ShowDoctorProps) => {
	return <DoctorClients doctor={ doctor } />
}

export default Clients
