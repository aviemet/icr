// TypesFromSerializers CacheKey f8cf82405a72deecc20e7da736b81057
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
import type EmployeesPersisted from '../Employees/Persisted'

declare global {
  namespace Schema {
    interface ShiftsClient {
      id?: string
      calendar_event_id: string
      employee: EmployeesPersisted
      employee_id: string
    }
  }
}
