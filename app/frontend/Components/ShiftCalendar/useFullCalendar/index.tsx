import React, { useState, useEffect, useRef, useReducer } from 'react'
import FullCalendar from '@fullcalendar/react'
import { CalendarApi, CalendarOptions } from '@fullcalendar/core'

const useFullCalendar = (props: CalendarOptions) => {
	const calendarRef = useRef<FullCalendar>(null)

	const [api, setApi] = useState<CalendarApi>()

	useEffect(() => {
		if(!calendarRef.current) return
		// const api = calendarRef.current.getApi()
		// console.log({ api, view: api.view })
		setApi(calendarRef.current.getApi())
	}, [calendarRef.current])

	const isTodayInView = () => {
		if(!api?.view) return true

		const currTime = new Date().getTime()
		return currTime >= api.view.activeStart.getTime() && currTime <= api.view.activeEnd.getTime()
	}

	const getTitle = () => api?.view.title

	return {
		Calendar: <FullCalendar ref={ calendarRef } { ...props } />,
		api: api ? {
			...api,
			getTitle,
			isTodayInView,
		} : undefined,
	}
}

export default useFullCalendar
