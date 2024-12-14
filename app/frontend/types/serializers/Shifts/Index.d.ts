// TypesFromSerializers CacheKey 7fb128fea9d6d37e287244f7116bab0c
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type CalendarEvent from '../CalendarEvent'
import type Client from '../Client'
import type Employee from '../Employee'
import type Household from '../Household'

declare global {
  namespace Schema {
    interface ShiftsIndex {
      id: unknown
      calendar_event: CalendarEvent
      clients: Client[]
      created_at: unknown
      employee: Employee
      employee_id: unknown
      households: Household[]
      updated_at: unknown
    }
  }
}
