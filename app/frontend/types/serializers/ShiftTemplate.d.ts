// TypesFromSerializers CacheKey 7bd864a16f535990e132f40cffcc89f7
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
export {}

declare global {
  namespace Schema {
    interface ShiftTemplate {
      id?: string
      active: boolean
      client_id: string
      created_by_id?: string
      end_date?: Date
      frequency: "weekly" | "biweekly" | "monthly"
      name?: string
      start_date?: Date
    }
  }
}
