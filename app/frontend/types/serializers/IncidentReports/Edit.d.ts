// TypesFromSerializers CacheKey 511e613991d8b0323f16c01c69a1082d
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
export {}

declare global {
  namespace Schema {
    interface IncidentReportsEdit {
      id: string
      agency_notified_at?: string | Date
      client_id: string
      created_at: string | Date
      description?: string
      incident_type_id: string
      location?: string
      occurred_at?: string | Date
      reported_at?: string | Date
      reported_by_id: string
      reported_to_id: string
      updated_at: string | Date
    }
  }
}
