import React, { forwardRef } from 'react'
import { EventContentArg } from '@fullcalendar/core'

interface EventContent {
	eventInfo: EventContentArg
}

const EventContent = forwardRef<HTMLDivElement, EventContent>((
	{ eventInfo },
	ref,
) => {
	return (
		<div className='fc-event-main-frame' ref={ ref }>
			<div className="fc-event-time">{ eventInfo.timeText }</div>
			<div className="fc-event-title-container">
				<div className="fc-event-title fc-sticky">{ eventInfo.event.title }</div>
			</div>
		</div>
	)
})

export default EventContent
