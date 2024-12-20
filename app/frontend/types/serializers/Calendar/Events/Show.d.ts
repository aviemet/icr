// TypesFromSerializers CacheKey 9e20eb0e17403bf29a1b4337c0fd4c34
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type CalendarRecurringPattern from '../RecurringPattern'
import type Shift from '../../Shift'

declare global {
  namespace Schema {
    interface CalendarEventsShow {
      id?: string
      created_at: Date
      created_by_id: string
      ends_at?: Date
      name: string
      parent_id?: string
      recurring_patterns: CalendarRecurringPattern[]
      shift: Shift
      starts_at?: Date
      updated_at: Date
    }
  }
}
