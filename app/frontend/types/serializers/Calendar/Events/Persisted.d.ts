// TypesFromSerializers CacheKey 03e71921928d193381d4cea29b10fa37
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type EventParticipant from '../../EventParticipant'
import type CalendarRecurringPattern from '../RecurringPattern'
import type Shift from '../../Shift'

declare global {
  namespace Schema {
    interface CalendarEventsPersisted {
      id: string
      all_day: boolean
      created_at: Date
      created_by_id?: string
      ends_at: Date
      event_participants: EventParticipant[]
      name?: string
      parent_id?: string
      recurring_patterns: CalendarRecurringPattern[]
      shift: Shift
      starts_at: Date
      updated_at: Date
    }
  }
}
