import React, { createContext, useContext } from "react"

const CalendarPopoverPortalTargetContext = createContext<HTMLElement | null>(null)

export function CalendarPopoverPortalTargetProvider({
	target,
	children,
}: React.PropsWithChildren<{ target: HTMLElement | null }>) {
	return (
		<CalendarPopoverPortalTargetContext.Provider value={ target }>
			{ children }
		</CalendarPopoverPortalTargetContext.Provider>
	)
}

export function useCalendarPopoverPortalTarget() {
	return useContext(CalendarPopoverPortalTargetContext)
}

