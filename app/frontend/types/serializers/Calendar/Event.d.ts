// TypesFromSerializers CacheKey c8fd30bd3d14220532a10c4cda9f93e5
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type CalendarRecurringPattern from './RecurringPattern'
import type Shift from '../Shift'

declare global {
  namespace Schema {
    interface CalendarEvent {
      id?: string
      category_id?: string
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
