import { useState } from "react"
import {
	Table,
	Button,
	Paper,
	Title,
	Stack,
} from "@/Components"
import { Select, NumberInput, DateInput, Form } from "@/Components/Form"
import { Routes } from "@/lib"

interface TimeEntry {
	date: Date
	hoursWorked: number
	employeeId: number
}

interface Employee {
	id: number
	name: string
}

const PayrollIndex = () => {
	const [selectedEmployee, setSelectedEmployee] = useState<string | null>(null)
	const [payPeriodStart, setPayPeriodStart] = useState<Date | null>(null)
	const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([])

	// Mock data - replace with actual API calls
	const employees: Employee[] = [
		{ id: 1, name: "John Doe" },
		{ id: 2, name: "Jane Smith" },
	]

	const handleHoursChange = (date: Date, hours: number) => {
		setTimeEntries(prev => {
			const existing = prev.findIndex(entry =>
				entry.date.toDateString() === date.toDateString()
			)

			if(existing >= 0) {
				const updated = [...prev]
				updated[existing] = { ...updated[existing], hoursWorked: hours }
				return updated
			}

			return [...prev, {
				date,
				hoursWorked: hours,
				employeeId: parseInt(selectedEmployee || "0"),
			}]
		})
	}

	const handleSubmitTimesheet = () => {
		// TODO: API call to save timesheet
		console.log("Submitting timesheet:", { selectedEmployee, payPeriodStart, timeEntries })
	}

	return (
		<Stack p="md">
			<Title order={ 2 }>Payroll Management</Title>

			<Paper p="md">
				<Form
					to={ Routes.payrolls() }
					method="post"
				>
					<Stack >
						<Select
							label="Select Employee"
							placeholder="Choose an employee"
							data={ employees.map(emp => ({
								value: emp.id.toString(),
								label: emp.name,
							})) }
							value={ selectedEmployee }
							onChange={ setSelectedEmployee }
						/>

						<DateInput
							label="Pay Period Start"
							placeholder="Select start date"
							value={ payPeriodStart }
							onChange={ setPayPeriodStart }
						/>

						{ selectedEmployee && payPeriodStart && (
							<>
								<Table>
									<thead>
										<tr>
											<th>Date</th>
											<th>Hours Worked</th>
										</tr>
									</thead>
									<tbody>
										{ [...Array(14)].map((_, index) => {
											const date = new Date(payPeriodStart)
											date.setDate(date.getDate() + index)
											const entry = timeEntries.find(e =>
												e.date.toDateString() === date.toDateString()
											)

											return (
												<tr key={ date.toISOString() }>
													<td>{ date.toLocaleDateString() }</td>
													<td>
														<NumberInput
															value={ entry?.hoursWorked || 0 }
															min={ 0 }
															max={ 24 }
															step={ 0.5 }
															onChange={ (value) => handleHoursChange(date, Number(value)) }
														/>
													</td>
												</tr>
											)
										}) }
									</tbody>
								</Table>

								<Button onClick={ handleSubmitTimesheet }>
									Submit Timesheet
								</Button>
							</>
						) }
					</Stack>
				</Form>
			</Paper>
		</Stack>
	)
}

export default PayrollIndex
