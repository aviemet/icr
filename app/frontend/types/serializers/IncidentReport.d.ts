// TypesFromSerializers CacheKey 3878a678e0f614ca645ed5ae79f8aee1
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
export {}

declare global {
  namespace Schema {
    interface IncidentReport {
      id?: string
      agency_notified_at?: Date
      category_id: string
      client_id: string
      description?: string
      location?: string
      occurred_at?: Date
      reported_at?: Date
      reported_by_id: string
      reported_to_id: string
    }
  }
}
