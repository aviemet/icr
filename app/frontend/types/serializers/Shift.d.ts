// TypesFromSerializers CacheKey 92b36cde877354a63e3994abf6656385
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type EmployeesPersisted from './Employees/Persisted'

declare global {
  namespace Schema {
    interface Shift {
      id?: unknown
      calendar_event_id: unknown
      employee: EmployeesPersisted
      employee_id: unknown
    }
  }
}
