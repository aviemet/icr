// TypesFromSerializers CacheKey 4d551bf33b3bae634060048faef9332c
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
export {}

declare global {
  namespace Schema {
    interface CalendarEventsIndex {
      id: number
      created_at: string | Date
      created_by_id: number
      ends_at?: string | Date
      parent_id?: number
      recurring_pattern_id?: number
      schedulable_id?: number
      schedulable_type?: string
      starts_at?: string | Date
      updated_at: string | Date
    }
  }
}
