// TypesFromSerializers CacheKey 8d84d58d4de5cd13e6b6365bd80f9738
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type ClientsPersisted from '../../Clients/Persisted'
import type EventParticipant from '../../EventParticipant'
import type CalendarRecurringPattern from '../RecurringPattern'
import type ShiftsEmployee from '../../Shifts/Employee'

declare global {
  namespace Schema {
    interface CalendarEventsEmployee {
      id: string
      all_day: boolean
      clients: ClientsPersisted[]
      created_at: Date
      created_by_id?: string
      ends_at: Date
      event_participants: EventParticipant[]
      name?: string
      parent_id?: string
      recurring_patterns: CalendarRecurringPattern[]
      shift: ShiftsEmployee
      starts_at: Date
      updated_at: Date
    }
  }
}
