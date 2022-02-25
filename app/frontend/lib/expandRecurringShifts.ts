const expandRecurringShifts = (shifts) => {
	return shifts.map(shift => {
		if(shift.recurring_pattern_id) {
			console.log({ shift })
		}
		return shift
	})
}

export default expandRecurringShifts
