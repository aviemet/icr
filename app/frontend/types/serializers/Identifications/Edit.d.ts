// TypesFromSerializers CacheKey dd3cb30a89dbe492e1472232c198911b
//
// DO NOT MODIFY: This file was automatically generated by TypesFromSerializers.
export {}

declare global {
  namespace Schema {
    interface IdentificationsEdit {
      id: number
      created_at: string | Date
      expires_at?: string | Date
      extra_fields?: Record<string, string>
      identificationable_id: number
      identificationable_type: string
      issued_at?: string | Date
      notes?: string
      number?: number
      type?: number
      updated_at: string | Date
    }
  }
}
